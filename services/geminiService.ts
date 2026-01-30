import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Usamos la llave proporcionada por el usuario directamente (uso "nativo")
  // para evitar problemas de propagación de variables de entorno en navegadores móviles.
  const apiKey = "AIzaSyBM2d5UYbkPBdpFwuY5Pou_4pMZ9ICubF0";
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      INSTRUCCIONES DE PRIORIDAD:
      "${criteria.priorityCriteria}"

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
    if (!text) throw new Error("La IA no devolvió contenido.");
    
    return JSON.parse(text);
    
  } catch (error: any) {
    console.error("Error Crítico de Gemini:", error);
    
    // Manejo específico de errores comunes
    if (error.message?.includes('403')) {
      throw new Error("ERROR_ACCESO: La llave API de Google no tiene permisos suficientes para este modelo.");
    }
    if (error.message?.includes('429')) {
      throw new Error("ERROR_LIMITE: Demasiadas solicitudes. Espera un momento.");
    }
    
    throw new Error(error.message || "No se pudo conectar con el motor de IA.");
  }
};