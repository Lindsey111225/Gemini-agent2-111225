
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { AgentRunResult } from '../types';

export const runOcrOnImage = async (ai: GoogleGenAI, base64Image: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: base64Image,
            },
        };
        const textPart = {
            text: "Perform OCR on this document page. Transcribe the text exactly as it appears, preserving original formatting and line breaks. Do not summarize or add any extra commentary."
        };
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error during OCR with Gemini:", error);
        return "OCR failed. Please check your API key and network connection.";
    }
};

export const extractKeywords = async (ai: GoogleGenAI, text: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Extract the top 15 most relevant keywords or key phrases from the following text. Return them as a JSON array of strings. Text: """${text}"""`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const keywords = JSON.parse(jsonStr);
        return Array.isArray(keywords) ? keywords : [];
    } catch (error) {
        console.error("Error extracting keywords:", error);
        return [];
    }
};

export const runAgent = async (ai: GoogleGenAI, prompt: string, context: string): Promise<AgentRunResult> => {
    try {
        const fullPrompt = `
            ${prompt}

            Here is the document context you need to analyze:
            """
            ${context}
            """

            Based on your analysis, also provide 3-5 potential follow-up questions a user might have.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.STRING,
                            description: "The detailed analysis based on the user's request and provided context. Format using Markdown."
                        },
                        followUpQuestions: {
                            type: Type.ARRAY,
                            description: "An array of 3 to 5 string questions that are relevant follow-ups to the analysis.",
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ["analysis", "followUpQuestions"]
                }
            }
        });
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        
        return {
            analysis: result.analysis || "No analysis provided.",
            followUpQuestions: result.followUpQuestions || []
        };
    } catch (error) {
        console.error("Error running agent:", error);
        return {
            analysis: "Agent execution failed. Please check your API key and network connection. The model may have returned an invalid response.",
            followUpQuestions: []
        };
    }
};
