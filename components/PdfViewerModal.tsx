import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DocumentFile } from '../types';
import { Spinner } from './Spinner';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons';

interface PdfViewerModalProps {
    doc: DocumentFile | null;
    onClose: () => void;
}

// FIX: Configure the PDF.js worker globally to prevent loading errors.
// This uses the version of pdf.js that react-pdf depends on, ensuring compatibility.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ doc, onClose }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        // Reset state when doc changes
        if(doc) {
            setNumPages(null);
            setPageNumber(1);
        }
    }, [doc]);

    if (!doc || !doc.file) {
        return null;
    }
    
    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }
    
    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md" onClick={onClose}>
            <div className="relative bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col p-4 border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white truncate pr-4">{doc.name}</h3>
                    <div className="flex items-center gap-4">
                        {numPages && (
                             <div className="flex items-center gap-2">
                                <button onClick={goToPrevPage} disabled={pageNumber <= 1} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <ChevronLeftIcon className="w-5 h-5 text-white" />
                                </button>
                                <span className="text-sm text-white font-mono">
                                    Page {pageNumber} of {numPages}
                                </span>
                                <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <ChevronRightIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        )}
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                            <CloseIcon className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-auto flex items-center justify-center relative">
                    <Document
                        file={doc.file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="text-center">
                                <Spinner size="lg" />
                                <p className="mt-2 text-slate-400">Loading PDF...</p>
                            </div>
                        }
                        error={
                             <div className="text-center text-red-400">
                                <p>Failed to load PDF.</p>
                                <p className="text-sm">Please check the file and try again.</p>
                            </div>
                        }
                    >
                        <div className="flex justify-center">
                            <Page 
                                pageNumber={pageNumber} 
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                            />
                        </div>
                    </Document>
                </div>
            </div>
        </div>
    );
};
