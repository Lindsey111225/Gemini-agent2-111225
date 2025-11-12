
import React, { useRef } from 'react';
import { DocumentFile } from '../types';
import { FileIcon, TrashIcon, CombineIcon, UploadIcon, PreviewIcon } from './Icons';

interface DocumentViewProps {
    documents: DocumentFile[];
    onFilesUpload: (files: FileList) => void;
    onDeleteDocument: (id: string) => void;
    onCombineText: () => void;
    onPreviewDocument: (doc: DocumentFile) => void;
    isLoading: boolean;
}

export const DocumentView: React.FC<DocumentViewProps> = ({ documents, onFilesUpload, onDeleteDocument, onCombineText, onPreviewDocument, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className="text-xl font-bold text-white mb-4">Upload Documents</h2>
                <div
                    className="relative block w-full rounded-lg border-2 border-dashed border-slate-700 p-12 text-center hover:border-slate-500 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
                    <span className="mt-2 block text-sm font-semibold text-slate-400">
                        {isLoading ? 'Processing...' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">PDF, TXT, MD, CSV, JSON</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && onFilesUpload(e.target.files)}
                    className="hidden"
                    accept=".pdf,.txt,.md,.csv,.json"
                />
            </div>
            <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Document Queue ({documents.length})</h2>
                    <button
                        onClick={onCombineText}
                        disabled={documents.length === 0}
                        className="flex items-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                    >
                        <CombineIcon className="w-5 h-5" />
                        Combine & Analyze
                    </button>
                </div>
                <div className="bg-slate-800/50 rounded-lg border border-slate-800">
                    <ul role="list" className="divide-y divide-slate-800">
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <li key={doc.id} className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <FileIcon className="h-6 w-6 text-slate-500" />
                                        <span className="text-sm font-medium text-slate-200">{doc.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {doc.type === 'application/pdf' && doc.file && (
                                            <button onClick={() => onPreviewDocument(doc)} title="Preview PDF" className="text-slate-500 hover:text-primary-400 transition-colors">
                                                <PreviewIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <button onClick={() => onDeleteDocument(doc.id)} title="Delete Document" className="text-slate-500 hover:text-red-500 transition-colors">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="p-8 text-center text-slate-500">
                                Upload documents to get started.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};