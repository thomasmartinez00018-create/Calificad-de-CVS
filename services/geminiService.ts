import { GoogleGenAI, Type } from "@google/genai";
import { CandidateAnalysis, HiringCriteria } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeResume = async (
  resumeText: string, 
  criteria: HiringCriteria
): Promise<CandidateAnalysis> => {
  const apiKey = "AIzaSyBM2d5UYbkPBdpFwuY5Pou_4pMZ9ICubF0";
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analiza CV para ${criteria.role}. Criterio: ${criteria.priorityCriteria}. 
      Extrae obligatoriamente: Edad, Cantidad de empleos anteriores, Disponibilidad horaria, Años de experiencia total, Localidad y Nombre.
      Texto: ${resumeText.substring(0, 12000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nombre: { type: Type.STRING },
            email: { type: Type.STRING },
            telefono: { type: Type.STRING },
            experienciaAnios: { type: Type.NUMBER },
            cantidadTrabajos: { type: Type.NUMBER },
            edad: { type: Type.NUMBER, nullable: true },
            localidad: { type: Type.STRING },
            disponibilidadHoraria: { type: Type.STRING },
            habilidadesEncontradas: { type: Type.ARRAY, items: { type: Type.STRING } },
            fortalezas: { type: Type.ARRAY, items: { type: Type.STRING } },
            ai_quality_score: { type: Type.NUMBER },
            preguntasEntrevista: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Preguntas específicas para hacerle en la entrevista basadas en su CV" },
            resumen: { type: Type.STRING }
          },
          required: ["nombre", "email", "telefono", "experienciaAnios", "cantidadTrabajos", "disponibilidadHoraria", "ai_quality_score", "preguntasEntrevista", "resumen"]
        },
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Respuesta vacía");
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Error en IA");
  }
};