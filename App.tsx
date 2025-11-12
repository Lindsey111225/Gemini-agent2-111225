
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { DocumentFile, OcrResult, Agent, AgentResult, AnalysisResult, Tab } from './types';
import { extractTextFromFile, processPdfForOcr } from './services/fileProcessor';
import { analyzeText } from './services/textUtils';
import { runAgent, extractKeywords, runOcrOnImage } from './services/geminiService';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { DocumentView } from './components/DocumentView';
import { OcrView } from './components/OcrView';
import { AnalysisView } from './components/AnalysisView';
import { AgentView } from './components/AgentView';
import { DashboardView } from './components/DashboardView';
import { PdfViewerModal } from './components/PdfViewerModal';

const App: React.FC = () => {
    const [documents, setDocuments] = useState<DocumentFile[]>([]);
    const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
    const [combinedText, setCombinedText] = useState<string>('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>(Tab.DOCUMENTS);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

    // FIX: Adhere to Gemini API guidelines by removing the API key modal and relying exclusively on `process.env.API_KEY`.
    const geminiService = useMemo(() => {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error('API_KEY environment variable not set.');
            alert('Gemini API key not found. Please set the API_KEY environment variable for the application to function.');
            return null;
        }
        try {
            const ai = new GoogleGenAI({ apiKey });
            return {
                runAgent: (prompt: string, context: string) => runAgent(ai, prompt, context),
                extractKeywords: (text: string) => extractKeywords(ai, text),
                runOcrOnImage: (base64Image: string) => runOcrOnImage(ai, base64Image),
            };
        } catch (error) {
            console.error("Error initializing GoogleGenAI:", error);
            alert("Failed to initialize the Gemini API. Please check the console for more details and ensure your API key is valid.");
            return null;
        }
    }, []);
    
    const handleSetLoading = (key: string, value: boolean) => {
        setIsLoading(prev => ({ ...prev, [key]: value }));
    };
    
    const handleFilesUpload = async (files: FileList) => {
        handleSetLoading('upload', true);
        const newDocuments: DocumentFile[] = [];
        for (const file of files) {
            const content = await extractTextFromFile(file);
            const doc: DocumentFile = {
                id: `${file.name}-${Date.now()}`,
                name: file.name,
                type: file.type,
                content: content,
                file: file.type === 'application/pdf' ? file : undefined,
                ocrPages: file.type === 'application/pdf' ? [] : undefined,
            };
            newDocuments.push(doc);
        }
        setDocuments(prev => [...prev, ...newDocuments]);
        handleSetLoading('upload', false);
    };
    
    const handleDeleteDocument = (id: string) => {
        setDocuments(docs => docs.filter(d => d.id !== id));
        setOcrResults(results => results.filter(r => r.documentId !== id));
    };

    const handleRunOcr = useCallback(async (documentId: string) => {
        if (!geminiService) {
            alert("OCR service is not available. Please check your API key configuration.");
            return;
        }
        const doc = documents.find(d => d.id === documentId);
        if (!doc || !doc.file) return;

        handleSetLoading(`ocr-${documentId}`, true);

        try {
            const pages = await processPdfForOcr(doc.file);
            const ocrPromises = pages.map(async (page, index) => {
                const text = await geminiService.runOcrOnImage(page.base64);
                return {
                    documentId,
                    pageNumber: index + 1,
                    text,
                    imageUrl: page.dataUrl,
                };
            });
            const newOcrResults = await Promise.all(ocrPromises);
            
            setOcrResults(prev => [...prev.filter(r => r.documentId !== documentId), ...newOcrResults]);
            setDocuments(docs => docs.map(d => d.id === documentId ? { ...d, ocrPages: newOcrResults } : d));

        } catch (error) {
            console.error('OCR processing failed:', error);
            alert('An error occurred during OCR processing. Please check the console.');
        } finally {
            handleSetLoading(`ocr-${documentId}`, false);
        }
    }, [documents, geminiService]);
    
    const handleCombineText = useCallback(() => {
        let fullText = '';
        documents.forEach(doc => {
            if (doc.ocrPages && doc.ocrPages.length > 0) {
                fullText += `--- Document: ${doc.name} ---\n\n`;
                doc.ocrPages.forEach(page => {
                    fullText += `Page ${page.pageNumber}:\n${page.text}\n\n`;
                });
            } else if (doc.content) {
                fullText += `--- Document: ${doc.name} ---\n\n${doc.content}\n\n`;
            }
        });
        setCombinedText(fullText);
        if (fullText) {
          setActiveTab(Tab.ANALYSIS);
        }
    }, [documents]);

    useEffect(() => {
        if (activeTab === Tab.ANALYSIS && combinedText && !analysisResult && !isLoading.analysis && geminiService) {
            const performAnalysis = async () => {
                handleSetLoading('analysis', true);
                const newKeywords = await geminiService.extractKeywords(combinedText);
                setKeywords(newKeywords);
                const analysisData = analyzeText(combinedText);
                setAnalysisResult(analysisData);
                handleSetLoading('analysis', false);
            };
            performAnalysis();
        }
    }, [activeTab, combinedText, analysisResult, isLoading.analysis, geminiService]);

    const handleRunAgent = async (agent: Agent) => {
        if (!geminiService || !combinedText) {
            if (!geminiService) {
                alert("Agent service is not available. Please check your API key configuration.");
            }
            return;
        }

        handleSetLoading(`agent-${agent.id}`, true);
        try {
            const result = await geminiService.runAgent(agent.prompt, combinedText);
            const newResult: AgentResult = {
                agentId: agent.id,
                agentName: agent.name,
                timestamp: new Date().toISOString(),
                ...result,
            };
            setAgentResults(prev => [newResult, ...prev]);
        } catch(e) {
            console.error(`Error running agent ${agent.name}:`, e);
            alert(`Failed to run agent: ${agent.name}. See console for details.`);
        } finally {
            handleSetLoading(`agent-${agent.id}`, false);
        }
    };

    const TABS: { id: Tab, label: string }[] = [
        { id: Tab.DOCUMENTS, label: 'Documents' },
        { id: Tab.OCR, label: 'OCR' },
        { id: Tab.ANALYSIS, label: 'Analysis' },
        { id: Tab.AGENTS, label: 'Agents' },
        { id: Tab.DASHBOARD, label: 'Dashboard' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-300">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TabNavigation tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-8">
                    {activeTab === Tab.DOCUMENTS && (
                        <DocumentView
                            documents={documents}
                            onFilesUpload={handleFilesUpload}
                            onDeleteDocument={handleDeleteDocument}
                            onCombineText={handleCombineText}
                            onPreviewDocument={setPreviewDoc}
                            isLoading={isLoading['upload']}
                        />
                    )}
                    {activeTab === Tab.OCR && (
                        <OcrView
                            documents={documents.filter(d => d.type === 'application/pdf')}
                            onRunOcr={handleRunOcr}
                            ocrResults={ocrResults}
                            isLoading={isLoading}
                        />
                    )}
                    {activeTab === Tab.ANALYSIS && (
                        <AnalysisView
                            combinedText={combinedText}
                            keywords={keywords}
                            analysisResult={analysisResult}
                            isLoading={isLoading['analysis']}
                        />
                    )}
                    {activeTab === Tab.AGENTS && (
                        <AgentView
                            onRunAgent={handleRunAgent}
                            agentResults={agentResults}
                            isLoading={isLoading}
                            hasContent={!!combinedText}
                        />
                    )}
                    {activeTab === Tab.DASHBOARD && (
                        <DashboardView
                            documents={documents}
                            ocrResults={ocrResults}
                            agentResults={agentResults}
                            analysisResult={analysisResult}
                        />
                    )}
                </div>
            </main>
            <PdfViewerModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
        </div>
    );
};

export default App;