
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <span className="text-3xl mr-3">🏥</span>
                        <div>
                            <h1 className="text-xl font-bold text-white">FDA Document Intelligence Workbench</h1>
                            <p className="text-sm text-slate-400">Powered by Gemini</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
