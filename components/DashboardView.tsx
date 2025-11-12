
import React from 'react';
import { DocumentFile, OcrResult, AgentResult, AnalysisResult } from '../types';
import { DocumentIcon, ScanIcon, BrainIcon, ChartIcon } from './Icons';

interface DashboardViewProps {
    documents: DocumentFile[];
    ocrResults: OcrResult[];
    agentResults: AgentResult[];
    analysisResult: AnalysisResult | null;
}

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-800 flex items-center gap-4">
        <div className="bg-slate-700 p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm font-semibold text-slate-400">{label}</p>
        </div>
    </div>
);

export const DashboardView: React.FC<DashboardViewProps> = ({ documents, ocrResults, agentResults, analysisResult }) => {
    const totalPagesOcr = new Set(ocrResults.map(r => `${r.documentId}-${r.pageNumber}`)).size;
    const uniqueAgentsRun = new Set(agentResults.map(r => r.agentId)).size;

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">Project Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<DocumentIcon className="w-8 h-8 text-primary-400"/>} label="Documents Processed" value={documents.length} />
                <StatCard icon={<ScanIcon className="w-8 h-8 text-primary-400"/>} label="Pages OCR'd" value={totalPagesOcr} />
                <StatCard icon={<BrainIcon className="w-8 h-8 text-primary-400"/>} label="Agent Runs" value={agentResults.length} />
                <StatCard icon={<ChartIcon className="w-8 h-8 text-primary-400"/>} label="Total Words Analyzed" value={analysisResult?.wordCount.toLocaleString() || 0} />
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Recent Agent Activity</h3>
                    <div className="bg-slate-800/50 rounded-lg border border-slate-800 max-h-96 overflow-y-auto">
                         <ul role="list" className="divide-y divide-slate-800">
                            {agentResults.slice(0, 10).map((result, index) => (
                                <li key={index} className="p-4 flex items-center gap-4">
                                    <BrainIcon className="w-5 h-5 text-primary-400 flex-shrink-0"/>
                                    <div>
                                        <p className="font-semibold text-sm text-white">{result.agentName}</p>
                                        <p className="text-xs text-slate-400">{new Date(result.timestamp).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                            {agentResults.length === 0 && <li className="p-4 text-center text-slate-500">No agent activity yet.</li>}
                        </ul>
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4">Document Summary</h3>
                     <div className="bg-slate-800/50 rounded-lg border border-slate-800 max-h-96 overflow-y-auto">
                         <ul role="list" className="divide-y divide-slate-800">
                            {documents.map((doc) => (
                                <li key={doc.id} className="p-4 flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                        <DocumentIcon className="w-5 h-5 text-slate-500 flex-shrink-0"/>
                                        <p className="font-semibold text-sm text-white">{doc.name}</p>
                                   </div>
                                   <span className="text-xs font-mono text-slate-400 bg-slate-700 px-2 py-1 rounded-md">
                                    {doc.ocrPages && doc.ocrPages.length > 0 ? `${doc.ocrPages.length} OCR pages` : doc.type.split('/')[1] || doc.type}
                                   </span>
                                </li>
                            ))}
                            {documents.length === 0 && <li className="p-4 text-center text-slate-500">No documents processed yet.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
