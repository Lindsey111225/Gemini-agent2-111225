
import React from 'react';
import { AnalysisResult } from '../types';
import { Spinner } from './Spinner';

interface AnalysisViewProps {
    combinedText: string;
    onUpdateCombinedText: (newText: string) => void;
    keywords: string[];
    analysisResult: AnalysisResult | null;
    isLoading: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ combinedText, onUpdateCombinedText, keywords, analysisResult, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Spinner size="lg"/>
                <p className="mt-4 text-lg">Analyzing content...</p>
            </div>
        );
    }
    
    if (!combinedText) {
        return <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-800 text-slate-500">Combine documents to see analysis.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-4">Combined Document Editor</h2>
                <textarea
                    className="w-full h-[600px] bg-slate-800/50 p-4 rounded-lg border border-slate-800 text-sm text-slate-300 whitespace-pre-wrap font-sans focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    value={combinedText}
                    onChange={(e) => onUpdateCombinedText(e.target.value)}
                    placeholder="Combined document text... You can edit it here."
                />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Extracted Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                        {keywords.length > 0 ? keywords.map((kw, i) => (
                            <span key={i} className="bg-primary-900/50 text-primary-300 text-xs font-medium px-2.5 py-1 rounded-full border border-primary-800">{kw}</span>
                        )) : <p className="text-slate-500 text-sm">No keywords extracted yet.</p>}
                    </div>
                </div>
                {analysisResult && (
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Text Metrics</h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                                <p className="text-2xl font-bold text-primary-400">{analysisResult.wordCount.toLocaleString()}</p>
                                <p className="text-sm text-slate-400">Words</p>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                                <p className="text-2xl font-bold text-primary-400">{analysisResult.sentenceCount.toLocaleString()}</p>
                                <p className="text-sm text-slate-400">Sentences</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-semibold text-white mb-3">Top Words</h3>
                            <ul className="space-y-2">
                                {analysisResult.wordFrequency.map(item => (
                                    <li key={item.word} className="flex justify-between text-sm">
                                        <span className="text-slate-300">{item.word}</span>
                                        <span className="font-mono text-slate-400">{item.frequency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
