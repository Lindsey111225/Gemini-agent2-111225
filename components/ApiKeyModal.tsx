
import React, { useState } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSubmit }) => {
    const [apiKey, setApiKey] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onSubmit(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700 transform transition-all">
                <h2 className="text-2xl font-bold text-white mb-4">Enter Your Gemini API Key</h2>
                <p className="text-slate-400 mb-6">
                    To use this application, please provide your Google Gemini API key. It will be used solely for this session and not stored.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key here"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full mt-6 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
                    >
                        Start Analyzing
                    </button>
                </form>
            </div>
        </div>
    );
};
