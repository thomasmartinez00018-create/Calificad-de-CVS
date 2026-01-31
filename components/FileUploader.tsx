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
  const [errorLog, setErrorLog] = useState<string | null>(null);

  const calculateFinalScore = (analysis: any): number => {
    let score = analysis.ai_quality_score || 0;
    const locCandidate = (analysis.localidad || '').toLowerCase();
    const locBusiness = (criteria.businessLocation || '').toLowerCase();
    
    if (locBusiness && locCandidate && (locCandidate.includes(locBusiness) || locBusiness.includes(locCandidate))) {
      score += 5;
    }
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    setErrorLog(null);
    const results: Candidate[] = [];

    try {
      // Procesamos uno a uno para no exceder límites de la API gratuita/barata
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileName(file.name);
        
        try {
          const text = await extractTextFromPdf(file);
          // Pequeña pausa de 300ms entre archivos para asegurar estabilidad en móviles
          await new Promise(r => setTimeout(r, 300));
          
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
        } catch (fileErr: any) {
          console.warn(`Error procesando ${file.name}:`, fileErr);
          // Continuamos con el siguiente si uno falla
        }
        
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (results.length > 0) {
        onAnalysisComplete(results);
      } else {
        throw new Error("No se pudo analizar ningún CV. Verifica que los archivos no estén dañados.");
      }
    } catch (err: any) {
      setErrorLog(err.message || "Fallo crítico en el análisis.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearAppCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (isUploading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-10 animate-in zoom-in-95 duration-500">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle 
                cx="50%" cy="50%" r="45%" 
                stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * progress) / 100} 
                className="text-slate-900 transition-all duration-700 ease-out" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-slate-900 italic leading-none">{progress}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Flash Engine</span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-slate-900 uppercase italic">Analizando Carga</h3>
            <p className="text-[11px] font-bold text-slate-400 truncate px-10 italic uppercase tracking-tight">{currentFileName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center space-y-10">
        <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Subida Masiva</h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Soporta hasta 50 PDFs simultáneos</p>
        </div>

        {errorLog && (
          <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 animate-in shake duration-500">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1 italic">⚠️ Error Detectado</p>
            <p className="text-xs font-bold text-red-500 leading-tight mb-4">{errorLog}</p>
            <button 
              onClick={clearAppCache}
              className="text-[10px] font-black text-red-700 underline uppercase"
            >
              Limpiar Caché y Reintentar
            </button>
          </div>
        )}

        <label className="block cursor-pointer group">
          <div className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl group-hover:bg-slate-800 active:scale-95 transition-all uppercase italic tracking-tight">
            Seleccionar Archivos
          </div>
          <input 
            type="file" 
            multiple 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </label>
        
        <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-px bg-slate-100 flex-1"></div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Powered by Gemini 3 Flash</p>
            <div className="h-px bg-slate-100 flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;