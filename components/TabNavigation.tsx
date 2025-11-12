
import React from 'react';
import { Tab } from '../types';

interface TabNavigationProps {
    tabs: { id: Tab, label: string }[];
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? 'border-primary-500 text-primary-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            }
                            whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors focus:outline-none
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};
