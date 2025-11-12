
import React from 'react';
import { Agent, AgentResult } from '../types';
import { BrainIcon, ComplianceIcon, InteractionIcon, EventIcon, PlayIcon, DocumentIcon } from './Icons';
import { Spinner } from './Spinner';

interface AgentViewProps {
    onRunAgent: (agent: Agent) => void;
    agentResults: AgentResult[];
    isLoading: Record<string, boolean>;
    hasContent: boolean;
}

const AGENTS: Agent[] = [
    { id: 'adverse-events', name: 'Adverse Event Detection', description: 'Identifies and categorizes potential adverse events mentioned in the documents.', prompt: 'You are an expert in pharmacovigilance. Analyze the provided text for any mentions of adverse events or side effects related to drugs or medical devices. List each event, the associated product, and provide a brief summary.', icon: EventIcon },
    { id: 'drug-interactions', name: 'Drug Interaction Analysis', description: 'Scans for mentions of multiple drugs and analyzes potential interactions.', prompt: 'As a clinical pharmacist, review the text for mentions of two or more drugs. Identify potential drug-drug interactions, classify their severity (mild, moderate, severe), and explain the potential consequences.', icon: InteractionIcon },
    { id: 'regulatory-compliance', name: 'Regulatory Compliance Check', description: 'Checks document content against common FDA regulatory keywords and clauses.', prompt: 'You are a regulatory affairs specialist. Scan the documents for language related to FDA regulations (e.g., 21 CFR Part 11, GCP, GMP). Highlight sections that demonstrate compliance or indicate potential non-compliance, citing specific phrases from the text.', icon: ComplianceIcon },
];

export const AgentView: React.FC<AgentViewProps> = ({ onRunAgent, agentResults, isLoading, hasContent }) => {
    
    if (!hasContent) {
        return (
            <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-800">
                <DocumentIcon className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-2 text-sm font-semibold text-slate-400">No content to analyze</h3>
                <p className="mt-1 text-sm text-slate-500">Please combine documents in the 'Documents' tab first.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-white mb-4">Available Agents</h2>
                <div className="space-y-4">
                    {AGENTS.map(agent => {
                        const isAgentLoading = isLoading[`agent-${agent.id}`];
                        return (
                        <div key={agent.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-800">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className="bg-slate-700 p-2 rounded-lg"><agent.icon className="w-6 h-6 text-primary-400" /></div>
                                    <div>
                                        <h3 className="font-semibold text-white">{agent.name}</h3>
                                        <p className="text-sm text-slate-400">{agent.description}</p>
                                    </div>
                                </div>
                                <button onClick={() => onRunAgent(agent)} disabled={isAgentLoading} className="flex items-center gap-2 text-sm bg-primary-600 text-white font-semibold py-1.5 px-3 rounded-md hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-wait transition-colors">
                                    {isAgentLoading ? <Spinner /> : <PlayIcon className="w-4 h-4" />}
                                    Run
                                </button>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-4">Agent Run History</h2>
                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-3">
                    {agentResults.length > 0 ? agentResults.map((result, index) => (
                        <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-800">
                            <h3 className="font-bold text-lg text-primary-400 flex items-center gap-2">
                                <BrainIcon className="w-5 h-5" /> {result.agentName}
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">{new Date(result.timestamp).toLocaleString()}</p>
                            <div className="prose prose-sm prose-invert max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: result.analysis.replace(/\n/g, '<br/>') }} />
                            
                            {result.followUpQuestions.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-sm text-white mb-2">Suggested Follow-up Questions:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.followUpQuestions.map((q, i) => (
                                            <button key={i} className="bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-600 transition-colors">{q}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-12 bg-slate-800/50 rounded-lg border border-slate-800 text-slate-500">
                            Run an agent to see the results here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
