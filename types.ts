
// FIX: Add React import to resolve namespace error for React.ComponentType.
import React from 'react';

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  content: string;
  file?: File;
  ocrPages?: OcrResult[];
}

export interface OcrPage {
    base64: string;
    dataUrl: string;
}

export interface OcrResult {
  documentId: string;
  pageNumber: number;
  text: string;
  imageUrl: string;
}

export interface Agent {
  id: string;
  name:string;
  description: string;
  prompt: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface AgentRunResult {
  analysis: string;
  followUpQuestions: string[];
}

export interface AgentResult extends AgentRunResult {
  agentId: string;
  agentName: string;
  timestamp: string;
}

export interface WordFrequency {
  word: string;
  frequency: number;
}

export interface AnalysisResult {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  wordFrequency: WordFrequency[];
}

export enum Tab {
  DOCUMENTS = 'DOCUMENTS',
  OCR = 'OCR',
  ANALYSIS = 'ANALYSIS',
  AGENTS = 'AGENTS',
  DASHBOARD = 'DASHBOARD'
}
