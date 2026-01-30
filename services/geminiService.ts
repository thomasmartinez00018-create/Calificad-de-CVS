import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // En v2.4.0 damos prioridad máxima a la llave inyectada en el DOM por el index.html
  const apiKey = 
    (window as any).__GEMINI_KEY__ || 
    process.env.API_KEY || 
    (import.meta as any).env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("❌ FALLO CRÍTICO: El celular no encuentra la llave. Intenta abrir la web en MODO INCÓGNITO.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS:
      - Experiencia mínima: ${criteria.minYearsExperience} años.
      - Prioridades: ${criteria.priorityCriteria}.
      
      CV A ANALIZAR:
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