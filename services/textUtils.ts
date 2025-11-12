
import { AnalysisResult, WordFrequency } from '../types';

// A simple list of English stop words.
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
  'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'o', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 's', 'same', 'she',
  'should', 'so', 'some', 'such', 't', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'page', 'document'
]);

export const analyzeText = (text: string): AnalysisResult => {
    const charCount = text.length;
    const words = text.match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentenceCount = sentences.length;

    const wordFrequencies: { [key: string]: number } = {};
    words.forEach(word => {
        const lowerWord = word.toLowerCase();
        if (!STOP_WORDS.has(lowerWord) && isNaN(parseInt(lowerWord))) {
            wordFrequencies[lowerWord] = (wordFrequencies[lowerWord] || 0) + 1;
        }
    });

    const sortedWordFrequency: WordFrequency[] = Object.entries(wordFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([word, frequency]) => ({ word, frequency }));

    return {
        wordCount,
        charCount,
        sentenceCount,
        wordFrequency: sortedWordFrequency,
    };
};
