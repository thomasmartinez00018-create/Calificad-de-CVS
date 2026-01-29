import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, JobRole, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Capturamos el valor inyectado por Vite
  const apiKey = process.env.API_KEY;

  // Verificamos si es un string vacío, o si es literalmente la palabra "undefined" (común en fallos de build)
  if (!apiKey || apiKey.trim() === "" || apiKey === "undefined" || apiKey.length < 10) {
    console.error("CRITICAL: API Key no detectada correctamente en el cliente.");
    throw new Error("ERROR DE CONFIGURACIÓN: La web no detecta tu API Key. 1. Verifica Vercel. 2. Limpia el caché de tu celular.");
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
    if (error.message?.includes('403')) throw new Error("La API Key en Vercel parece ser inválida.");
    if (error.message?.includes('429')) throw new Error("Límite de cuota de Google alcanzado.");
    throw error;
  }
};