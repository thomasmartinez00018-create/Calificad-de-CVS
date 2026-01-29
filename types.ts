
export type JobRole = 'Mozo' | 'Cocinero' | 'Delivery' | 'Admin' | 'Limpieza' | 'Hostess';

export enum CandidateStatus {
  PENDIENTE = 'Pendiente',
  ENTREVISTA = 'Entrevista',
  DESCARTADO = 'Descartado'
}

export interface HiringCriteria {
  role: JobRole;
  priorityCriteria: string;
  minYearsExperience: number;
  requiredSkills: string[]; // Ej: ["Carnet de manipulación", "Inglés"]
  availability: 'Mañana' | 'Tarde' | 'Noche' | 'Rotativo' | 'Cualquiera';
  proximityWeight: number; // 0 a 100
}

export interface CandidateAnalysis {
  nombre: string;
  email: string;
  telefono: string;
  experienciaAnios: number;
  localidad: string;
  fortalezas: string[];
  debilidades: string[]; // Lo que le falta según el puesto
  disponibilidadDetectada: string;
  habilidadesEncontradas: string[];
  puntajeIA: number;
  resumen: string;
}

export interface Candidate extends CandidateAnalysis {
  id: string;
  status: CandidateStatus;
  jobRole: JobRole;
  fileName: string;
  appliedDate: string;
  puntajeFinal: number; // Calculado combinando IA + Reglas automáticas
}
