import { OcrPage } from '../types';

export const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                resolve(event.target.result);
            } else {
                resolve('');
            }
        };
        reader.onerror = (error) => reject(error);

        const fileType = file.type;
        if (fileType === 'application/pdf') {
            resolve(''); // PDF content is handled by OCR
        } else if (fileType === 'text/plain' || fileType === 'text/markdown' || fileType === 'text/csv' || fileType === 'application/json') {
            reader.readAsText(file);
        } else {
            resolve('File type not supported for direct text extraction.');
        }
    });
};

// Singleton promise to ensure initialization and configuration happens only once.
let pdfjsLibPromise: Promise<any> | null = null;

const initializePdfJs = (): Promise<any> => {
    if (pdfjsLibPromise) {
        return pdfjsLibPromise;
    }

    pdfjsLibPromise = new Promise((resolve, reject) => {
        // Check if the library is already loaded
        if ((window as any).pdfjsLib) {
            const pdfjsLib = (window as any).pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js';
            return resolve(pdfjsLib);
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.js';
        script.async = true;

        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib;
            if (pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;
                resolve(pdfjsLib);
            } else {
                reject(new Error("pdf.js loaded but `pdfjsLib` is not available on the window object."));
            }
        };

        script.onerror = () => {
            reject(new Error("Failed to load the pdf.js library from CDN. Check your network connection and ad-blockers."));
        };

        document.head.appendChild(script);
    });

    return pdfjsLibPromise;
};


export const processPdfForOcr = async (file: File): Promise<OcrPage[]> => {
    const pdfjsLib = await initializePdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const pages: OcrPage[] = [];

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const dataUrl = canvas.toDataURL('image/png');
            const base64 = dataUrl.split(',')[1];
            pages.push({ base64, dataUrl });
        }
    }

    return pages;
};