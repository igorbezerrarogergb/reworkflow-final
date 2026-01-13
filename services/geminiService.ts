
import { GoogleGenAI, Type } from "@google/genai";
import { ReworkTicket, AIAnalysisResult } from "../types";

// As per system instructions, we MUST use process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRework = async (ticket: ReworkTicket): Promise<AIAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this rework ticket and provide structural feedback. 
    Title: ${ticket.title}
    Description: ${ticket.description}
    Department: ${ticket.department}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestion: {
            type: Type.STRING,
            description: "A constructive suggestion to fix the root cause."
          },
          estimatedRisk: {
            type: Type.STRING,
            description: "Risk assessment: Low, Medium, or High."
          },
          preventiveMeasures: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actions to prevent this from recurring."
          },
          category: {
            type: Type.STRING,
            description: "Categorize this error (e.g., Human Error, Machine Failure, Material Defect)."
          }
        },
        required: ["suggestion", "estimatedRisk", "preventiveMeasures", "category"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as AIAnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid AI response format");
  }
};

export const getAggregatedInsights = async (tickets: ReworkTicket[]): Promise<string> => {
  if (tickets.length === 0) return "Not enough data for insights.";
  
  const summary = tickets.map(t => `- ${t.title} (${t.department}): ${t.description}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following list of rework tickets, identify the most critical recurring patterns and suggest one major process improvement to reduce overall rework costs.\n\nTickets:\n${summary}`,
  });

  return response.text || "No insights generated.";
};
