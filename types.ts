export type JobRole = 'Cocinero' | 'Fiambrero' | 'Recepcionista' | 'Commis' | 'Bachero' | 'RR.PP' | 'Valet Parking' | 'Cajero' | 'Mozo';

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
  experienciaAnios: number;
  cantidadTrabajos: number;
  edad: number | null;
  localidad: string;
  disponibilidadHoraria: string;
  habilidadesEncontradas: string[];
  fortalezas: string[];
  ai_quality_score: number;
  preguntasEntrevista: string[];
  resumen: string;
}

export interface Candidate extends CandidateAnalysis {
  id: string;
  status: CandidateStatus;
  jobRole: JobRole;
  fileName: string;
  appliedDate: string;
  puntajeFinal: number;
}