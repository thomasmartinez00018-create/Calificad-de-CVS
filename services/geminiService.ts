import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Obtenemos la llave exclusivamente del entorno
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("ERROR_CONFIG: No hay ninguna API Key configurada en el servidor (Vercel).");
  }

  // Validación de seguridad para evitar usar llaves de OpenAI en Gemini
  if (apiKey.startsWith("sk-")) {
    throw new Error("ERROR_PROVEEDOR: Has configurado una llave de OpenAI (sk-...), pero esta app requiere una de Google Gemini (AIza...). Consíguela en ai.google.dev");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS:
      "${criteria.priorityCriteria}"

      FORMATO JSON REQUERIDO:
      - 'experienciaAnios': número entero.
      - 'ai_quality_score': 0-100.
      - 'resumen': párrafo profesional y directo.

      TEXTO CV:
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
    if (!text) throw new Error("La IA respondió pero el contenido está vacío.");
    
    return JSON.parse(text);
    
  } catch (error: any) {
    console.error("Gemini Critical Error:", error);
    
    if (error.message?.includes('403')) {
      throw new Error("ERROR_ACCESO: La llave API de Google no tiene permisos o el proyecto está restringido.");
    }
    
    if (error.message?.includes('401')) {
      throw new Error("ERROR_KEY: La API Key configurada no es válida para Google Cloud.");
    }
    
    throw new Error(error.message || "Error inesperado al conectar con el cerebro de IA.");
  }
};