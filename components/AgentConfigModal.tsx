import React, { useState, useEffect } from 'react';
import { Agent } from '../types';
import { CloseIcon } from './Icons';
import { Spinner } from './Spinner';

interface AgentConfigModalProps {
    agent: Agent;
    isOpen: boolean;
    onClose: () => void;
    onRun: (configuredAgent: Agent) => void;
    isLoading: boolean;
}

const AVAILABLE_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash'];

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({ agent, isOpen, onClose, onRun, isLoading }) => {
    const [prompt, setPrompt] = useState(agent.prompt);
    const [model, setModel] = useState(agent.model);

    useEffect(() => {
        setPrompt(agent.prompt);
        setModel(agent.model);
    }, [agent]);

    if (!isOpen) {
        return null;
    }

    const handleRun = () => {
        onRun({ ...agent, prompt, model });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full border border-slate-700 transform transition-all flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Configure Agent: {agent.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
                        <CloseIcon className="w-6 h-6 text-slate-400" />
                    </button>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                    <div>
                        <label htmlFor="model-select" className="block text-sm font-medium text-slate-300 mb-1">Model</label>
                        <select
                            id="model-select"
                            value={model}
                            onChange={e => setModel(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {AVAILABLE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="prompt-textarea" className="block text-sm font-medium text-slate-300 mb-1">Prompt</label>
                        <textarea
                            id="prompt-textarea"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            rows={15}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm font-mono text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-wait transition-colors min-w-[100px]"
                    >
                        {isLoading ? <Spinner /> : 'Run Agent'}
                    </button>
                </div>
            </div>
        </div>
    );
};
