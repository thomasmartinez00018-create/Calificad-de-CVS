
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // En Vite, process.env.API_KEY se inyecta como un string literal
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    console.error("DEBUG: API Key no detectada en este entorno.");
    throw new Error("API_KEY no configurada. Añádela en Vercel y haz un Redeploy.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un reclutador experto en gastronomía. 
      Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS DEL RECLUTADOR:
      - Experiencia mínima requerida: ${criteria.minYearsExperience} años.
      - Habilidades clave: ${criteria.requiredSkills.join(', ')}.
      - Disponibilidad deseada: ${criteria.availability}.
      - Otros criterios: ${criteria.priorityCriteria}.
      
      TEXTO DEL CV:
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

    const textOutput = response.text;
    if (!textOutput) throw new Error("La IA no generó respuesta.");

    return JSON.parse(textOutput);
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    if (error.message?.includes('403')) throw new Error("La API Key es inválida.");
    if (error.message?.includes('429')) throw new Error("Límite de cuota alcanzado.");
    throw error;
  }
};
