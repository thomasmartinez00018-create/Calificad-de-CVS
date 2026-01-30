import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  // Intentar obtener la llave de múltiples fuentes para máxima compatibilidad móvil
  const apiKey = process.env.API_KEY || (window as any).__GEMINI_KEY__;
  
  if (!apiKey) {
    throw new Error("API Key no configurada. Verifique el entorno.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analiza este CV para el puesto de ${criteria.role}.
      
      CRITERIOS DE BÚSQUEDA DEL DUEÑO:
      "${criteria.priorityCriteria}"

      REGLAS DE EXTRACCIÓN:
      - Extrae años de experiencia TOTAL como número entero.
      - 'ai_quality_score': Evalúa de 0 a 100 qué tan bien encajan sus habilidades técnicas con el puesto de ${criteria.role}.
      - 'localidad': Sé específico (ej: "Palermo", "Zona Norte").
      - 'preguntasEntrevista': 3 preguntas cortas para validar su experiencia.
      - 'resumen': Un párrafo breve y honesto sobre si vale la pena contratarlo.

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
    if (!text) throw new Error("La IA devolvió una respuesta vacía.");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Error crítico en análisis Gemini:", error);
    throw error;
  }
};