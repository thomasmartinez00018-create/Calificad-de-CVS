import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Intentamos obtener la llave de múltiples lugares inyectados por Vite
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.length < 10) {
    const errorDetail = `Valor detectado: "${apiKey}". Tipo: ${typeof apiKey}`;
    console.error("CRITICAL API KEY ERROR:", errorDetail);
    throw new Error(`ERROR DE CONFIGURACIÓN: La app no detecta tu llave. Detalle: ${errorDetail}. Por favor, limpia el caché de tu móvil.`);
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

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};