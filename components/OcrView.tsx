
import React from 'react';
import { DocumentFile, OcrResult } from '../types';
import { ScanIcon, DocumentIcon } from './Icons';
import { Spinner } from './Spinner';

interface OcrViewProps {
    documents: DocumentFile[];
    onRunOcr: (documentId: string) => void;
    ocrResults: OcrResult[];
    isLoading: Record<string, boolean>;
}

export const OcrView: React.FC<OcrViewProps> = ({ documents, onRunOcr, ocrResults, isLoading }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">OCR Processing</h2>
            {documents.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-800">
                    <DocumentIcon className="mx-auto h-12 w-12 text-slate-600" />
                    <h3 className="mt-2 text-sm font-semibold text-slate-400">No PDF documents found</h3>
                    <p className="mt-1 text-sm text-slate-500">Please upload a PDF file in the 'Documents' tab.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {documents.map(doc => {
                        const resultsForDoc = ocrResults.filter(r => r.documentId === doc.id);
                        const isOcrLoading = isLoading[`ocr-${doc.id}`];
                        return (
                            <div key={doc.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-white">{doc.name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {resultsForDoc.length > 0 ? `${resultsForDoc.length} pages OCR'd` : 'Ready for OCR'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onRunOcr(doc.id)}
                                        disabled={isOcrLoading}
                                        className="flex items-center gap-2 bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-wait transition-colors"
                                    >
                                        {isOcrLoading ? <Spinner /> : <ScanIcon className="w-5 h-5" />}
                                        {isOcrLoading ? 'Processing...' : 'Run OCR'}
                                    </button>
                                </div>
                                {resultsForDoc.length > 0 && (
                                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                                        {resultsForDoc.map(result => (
                                            <div key={result.pageNumber} className="border border-slate-700 rounded-lg overflow-hidden">
                                                <img src={result.imageUrl} alt={`Page ${result.pageNumber}`} className="w-full h-auto" />
                                                <div className="p-3 bg-slate-800">
                                                    <p className="text-xs text-slate-300 line-clamp-3">{result.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
