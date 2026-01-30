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
  businessLocation: string;
}

export interface CandidateAnalysis {
  nombre: string;
  email: string;
  telefono: string;
  experienciaAnios: number; // Extraído por IA, verificado por código
  localidad: string;
  habilidadesEncontradas: string[];
  fortalezas: string[];
  ai_quality_score: number; // Solo evaluación de calidad de habilidades (0-100)
  preguntasEntrevista: string[];
  resumen: string;
}

export interface Candidate extends CandidateAnalysis {
  id: string;
  status: CandidateStatus;
  jobRole: JobRole;
  fileName: string;
  appliedDate: string;
  puntajeFinal: number; // Calculado en Frontend: (IA * 0.6) + (ExpMatch * 0.4)
}