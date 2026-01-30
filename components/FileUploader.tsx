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
      } catch (err: any) {
        console.error(`Error procesando ${file.name}:`, err);
        setErrorLog(err.message || "Error desconocido al procesar.");
        // Si falla un archivo, cortamos el proceso para informar el error
        setIsUploading(false);
        return;
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    if (results.length > 0) {
      onAnalysisComplete(results);
    } else {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-white text-center space-y-8 animate-in zoom-in-95">
          <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
              <circle 
                cx="50%" cy="50%" r="45%" 
                stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * progress) / 100} 
                className="text-slate-900 transition-all duration-500" 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl md:text-5xl font-black text-slate-900 italic">{progress}%</span>
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Leyendo CV</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase italic">GastroHire IA</h3>
            <p className="text-[10px] font-bold text-slate-400 truncate px-4 italic">{currentFileName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-8">
      <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-slate-100 text-center space-y-8">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center mx-auto shadow-xl rotate-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Cargar CVs</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puesto Seleccionado: {criteria.role}</p>
        </div>

        {errorLog && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-200 animate-in shake duration-500">
            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 italic">⚠️ Error Detectado</p>
            <p className="text-xs font-bold text-red-500 leading-tight">{errorLog}</p>
            <p className="text-[9px] font-medium text-red-400 mt-3">Intenta subir archivos individuales o revisa tu conexión.</p>
          </div>
        )}

        <label className="block cursor-pointer group">
          <div className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg shadow-lg group-hover:bg-slate-800 active:scale-95 transition-all uppercase italic">
            Seleccionar PDFs
          </div>
          <input 
            type="file" 
            multiple 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileChange} 
            onClick={(e) => {
              (e.currentTarget as any).value = ''; 
              setErrorLog(null);
            }}
          />
        </label>
        
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Procesamiento V3.8 Mobile Pro</p>
      </div>
    </div>
  );
};

export default FileUploader;