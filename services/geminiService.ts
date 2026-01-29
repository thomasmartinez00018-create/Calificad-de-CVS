
import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

// Función segura para obtener la API Key sin romper el hilo de ejecución del navegador
const getAIInstance = () => {
  let apiKey = "";
  try {
    apiKey = (typeof process !== 'undefined' && process.env.API_KEY) ? process.env.API_KEY : "";
  } catch (e) {
    console.warn("API_KEY no encontrada en process.env");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  const ai = getAIInstance();
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
          debilidades: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Puntos donde el candidato no cumple los criterios" },
          disponibilidadDetectada: { type: Type.STRING },
          habilidadesEncontradas: { type: Type.ARRAY, items: { type: Type.STRING } },
          puntajeIA: { type: Type.NUMBER, description: "Calificación del 1 al 100 de ajuste cultural y actitudinal" },
          resumen: { type: Type.STRING }
        },
        required: ["nombre", "email", "telefono", "experienciaAnios", "localidad", "fortalezas", "debilidades", "puntajeIA", "resumen"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
