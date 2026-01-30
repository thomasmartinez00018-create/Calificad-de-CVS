import React, { useState } from 'react';
import { HiringCriteria, Candidate, CandidateStatus } from '../types';
import { extractTextFromPdf } from '../services/pdfService';
import { analyzeResume } from '../services/geminiService';

interface FileUploaderProps {
  criteria: HiringCriteria;
  onAnalysisComplete: (candidates: Candidate[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ criteria, onAnalysisComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');

  // Lógica de Scoring: El ranking debe ser un reflejo honesto del Match de IA
  const calculateFinalScore = (analysis: any): number => {
    let score = analysis.ai_quality_score;

    // Solo un pequeño margen por cercanía geográfica (+5 puntos)
    const locCandidate = analysis.localidad?.toLowerCase() || '';
    const locBusiness = criteria.businessLocation.toLowerCase();
    
    if (locCandidate.includes(locBusiness) || locBusiness.includes(locCandidate)) {
      score += 5;
    }

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    const results: Candidate[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFileName(file.name);
      
      try {
        const text = await extractTextFromPdf(file);
        const analysis = await analyzeResume(text, criteria);
        const puntajeFinal = calculateFinalScore(analysis);

        results.push({
          ...analysis,
          id: Math.random().toString(36).substr(2, 9),
          status: CandidateStatus.PENDIENTE,
          jobRole: criteria.role,
          fileName: file.name,
          appliedDate: new Date().toISOString(),
          puntajeFinal
        });
      } catch (err) {
        console.error("Fallo en archivo:", file.name);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    onAnalysisComplete(results);
    setIsUploading(false);
  };

  if (isUploading) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/10 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-lg bg-white rounded-[4rem] p-14 shadow-2xl border border-white/50 text-center space-y-10">
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            {/* Círculo de Carga Premium */}
            <svg className="w-full h-full -rotate-90 drop-shadow-xl">
              <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
              <circle 
                cx="112" cy="112" r="95" 
                stroke="currentColor" strokeWidth="14" fill="transparent" 
                strokeDasharray={596} 
                strokeDashoffset={596 - (596 * progress) / 100} 
                className="text-slate-900 transition-all duration-700 ease-out" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 italic leading-none">{progress}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Ranking IA</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Analizando Talento</h3>
            <p className="text-xs font-bold text-slate-400 truncate px-10 bg-slate-50 py-3 rounded-2xl border border-slate-100 italic">{currentFileName}</p>
          </div>

          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-12">
      <div className="bg-white rounded-[4rem] p-14 shadow-2xl border border-slate-100 hover:scale-[1.01] transition-all group">
        <div className="text-center space-y-10">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Cargar CVs</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-3">Perfil actual: {criteria.role}</p>
          </div>

          <label className="block cursor-pointer">
            <div className="w-full bg-slate-900 text-white py-7 px-10 rounded-[2rem] font-black text-xl shadow-xl hover:bg-slate-800 transition-all text-center uppercase italic tracking-tight">
              Seleccionar Archivos
            </div>
            <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Procesamiento V3.6 Platinum</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;