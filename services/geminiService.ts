
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

// Función segura para obtener la API Key
const getAIInstance = () => {
  let apiKey = "";
  try {
    // Vite inyectará esto según la configuración de vite.config.ts
    // @ts-ignore
    apiKey = (typeof process !== 'undefined' && process.env.API_KEY) ? process.env.API_KEY : "";
    
    if (!apiKey) {
      console.error("CRÍTICO: La API_KEY de Gemini no está configurada en el entorno.");
    }
  } catch (e) {
    console.warn("Error al acceder a las variables de entorno:", e);
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  const ai = getAIInstance();
  
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

    if (!response.text) {
      throw new Error("La IA devolvió una respuesta vacía.");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error en la llamada a Gemini:", error);
    throw error;
  }
};
