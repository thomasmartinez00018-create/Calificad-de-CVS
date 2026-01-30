import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Aplicando tu llave directamente para asegurar que el despliegue móvil tenga acceso total
  const apiKey = "AIzaSyC1LJIHvkKTSLL9u7B2NVfp5BTZbkJqKT4";
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      REQUERIMIENTOS DEL DUEÑO:
      "${criteria.priorityCriteria}"

      INSTRUCCIONES DE FORMATO:
      - Extrae los datos exactos del CV.
      - 'experienciaAnios': Solo el número de años de experiencia relevante.
      - 'ai_quality_score': Puntuación 0-100 basada en el fit para el puesto.
      - 'resumen': Un comentario breve para el reclutador.

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
    if (!text) throw new Error("La IA no devolvió datos legibles.");

    // Parseo directo del JSON (Gemini 3 en modo JSON ya devuelve el objeto limpio)
    return JSON.parse(text);
    
  } catch (error: any) {
    console.error("Gemini Critical Error:", error);
    
    // Si sigue dando 403, es probable que la llave necesite habilitar la "Generative Language API" en Google Cloud
    if (error.message?.includes('403')) {
      throw new Error("ERROR_ACCESO: La llave API tiene restricciones. Verifica en Google Cloud Console que la 'Generative Language API' esté habilitada.");
    }
    
    throw new Error(`ERROR_SISTEMA: ${error.message || 'Fallo de conexión con la IA'}`);
  }
};