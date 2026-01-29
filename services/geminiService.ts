import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // En v2.0.0 usamos directamente la variable definida por Vite
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("ERROR: API Key no detectada. Por favor, realiza un Redeploy manual en Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un reclutador experto en gastronomía. 
      Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS:
      - Exp mínima: ${criteria.minYearsExperience} años.
      - Disponibilidad: ${criteria.availability}.
      - Instrucciones: ${criteria.priorityCriteria}.
      
      CV:
      ${resumeText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nombre: { type: Type.STRING },
            email: { type: Type.STRING },
            telefono: { type: Type.STRING },
            experienciaAnios: { type: Type.NUMBER },
            localidad: { type: Type.STRING },
            fortalezas: { type: Type.ARRAY, items: { type: Type.STRING } },
            debilidades: { type: Type.ARRAY, items: { type: Type.STRING } },
            disponibilidadDetectada: { type: Type.STRING },
            habilidadesEncontradas: { type: Type.ARRAY, items: { type: Type.STRING } },
            puntajeIA: { type: Type.NUMBER },
            resumen: { type: Type.STRING }
          },
          required: ["nombre", "email", "telefono", "experienciaAnios", "localidad", "fortalezas", "debilidades", "puntajeIA", "resumen"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};