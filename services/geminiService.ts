import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Buscamos la llave en todas las fuentes posibles donde Vite/Vercel la inyectan
  const apiKey = 
    (process.env.API_KEY) || 
    ((import.meta as any).env?.VITE_GEMINI_API_KEY) || 
    ((window as any).VITE_GEMINI_API_KEY);
  
  if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") {
    throw new Error("ERROR_CONFIG: No se detecta la API Key. Verifica las variables de entorno en Vercel y redespliega.");
  }

  // Validación de seguridad para evitar usar llaves de OpenAI en Gemini
  if (apiKey.startsWith("sk-")) {
    throw new Error("ERROR_PROVEEDOR: Has configurado una llave de OpenAI (sk-...), pero esta app requiere una de Google Gemini (AIza...). Cambia la llave en Vercel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS:
      "${criteria.priorityCriteria}"

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
    if (!text) throw new Error("La IA no devolvió contenido.");
    
    return JSON.parse(text);
    
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes('403') || error.message?.includes('401')) {
      throw new Error("ERROR_ACCESO: La llave API es inválida o no tiene permisos. Revisa que sea una llave de Gemini activa.");
    }
    
    throw new Error(error.message || "Fallo de conexión con el motor de IA.");
  }
};