import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Intentar obtener la llave de la forma más directa posible para evitar fallos de compilación/despliegue
  const apiKey = (window as any).__GEMINI_KEY__ || process.env.API_KEY;
  
  if (!apiKey || apiKey.length < 10) {
    throw new Error("ERROR_CONFIG: La llave de Inteligencia Artificial no está activa o es inválida.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS ESPECÍFICOS:
      "${criteria.priorityCriteria}"

      REGLAS:
      - 'experienciaAnios': Solo el número (ej: 3).
      - 'ai_quality_score': 0-100 basado en el match con ${criteria.role}.
      - 'resumen': Un comentario breve para el dueño del local.

      TEXTO:
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
            habilidadesEncontradas: { type: Type.ARRAY, items: { type: Type.STRING } },
            fortalezas: { type: Type.ARRAY, items: { type: Type.STRING } },
            ai_quality_score: { type: Type.NUMBER },
            preguntasEntrevista: { type: Type.ARRAY, items: { type: Type.STRING } },
            resumen: { type: Type.STRING }
          },
          required: ["nombre", "email", "telefono", "experienciaAnios", "ai_quality_score", "preguntasEntrevista", "resumen"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("ERROR_IA: La IA no respondió correctamente.");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes('403')) throw new Error("ERROR_KEY: Tu API Key no tiene permisos o expiró.");
    if (error.message?.includes('429')) throw new Error("ERROR_LIMIT: Demasiadas solicitudes. Espera un momento.");
    throw new Error(`ERROR_ANALISIS: ${error.message || 'Error desconocido en la IA'}`);
  }
};