
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // process.env.API_KEY es reemplazado por Vite durante el build
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY no configurada. Por favor, añádela en las variables de entorno de Vercel.");
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
    if (!textOutput) {
      throw new Error("La IA no generó una respuesta válida.");
    }

    return JSON.parse(textOutput);
  } catch (error: any) {
    console.error("Error detallado de Gemini:", error);
    
    if (error.message?.includes('403') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error("Error de Autenticación: La API Key en Vercel es incorrecta.");
    }
    
    if (error.message?.includes('429')) {
      throw new Error("Límite de cuota excedido. Espera un momento.");
    }

    throw new Error("Error en el análisis del CV. Intenta de nuevo.");
  }
};
