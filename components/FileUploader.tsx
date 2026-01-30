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

  // Sincronización Real: Ranking ≈ Match de IA
  const calculateFinalScore = (analysis: any): number => {
    let score = analysis.ai_quality_score;

    // Solo pequeños ajustes por datos duros de negocio (Cercanía)
    const locCandidate = analysis.localidad?.toLowerCase() || '';
    const locBusiness = criteria.businessLocation.toLowerCase();
    
    if (locCandidate.includes(locBusiness) || locBusiness.includes(locCandidate)) {
      score += 5; // Bono de proximidad
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
      <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 text-center space-y-10">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Círculo de Carga Refinado */}
            <svg className="w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle 
                cx="96" cy="96" r="80" 
                stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={502} 
                strokeDashoffset={502 - (502 * progress) / 100} 
                className="text-slate-900 transition-all duration-700 ease-out" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 italic">{progress}%</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Analizando</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">GastroHire IA está leyendo</h3>
            <p className="text-xs font-bold text-slate-400 truncate px-8">{currentFileName}</p>
          </div>

          <div className="pt-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-12">
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 hover:scale-[1.01] transition-all">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Cargar Candidatos</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Puesto: {criteria.role}</p>
          </div>

          <label className="block group">
            <div className="w-full bg-slate-900 text-white py-6 px-8 rounded-[1.5rem] font-black text-lg shadow-xl cursor-pointer group-hover:bg-slate-800 transition-all text-center uppercase italic">
              Seleccionar PDFs
            </div>
            <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">IA Predictiva V3.4</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;