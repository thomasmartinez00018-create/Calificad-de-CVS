
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

  const calculateFinalScore = (aiScore: number, candidateExp: number, minExp: number): number => {
    let expScore = 100;
    if (candidateExp < minExp) {
      expScore = Math.max(0, 100 - (minExp - candidateExp) * 25);
    }
    return Math.round((aiScore * 0.6) + (expScore * 0.4));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setProgress(0);
    const total = files.length;
    const results: Candidate[] = [];

    for (let i = 0; i < total; i++) {
      const file = files[i];
      setCurrentFileName(file.name);
      
      try {
        const text = await extractTextFromPdf(file);
        const analysis = await analyzeResume(text, criteria);
        
        const puntajeFinal = calculateFinalScore(
          analysis.puntajeIA,
          analysis.experienciaAnios,
          criteria.minYearsExperience
        );

        results.push({
          ...analysis,
          id: Math.random().toString(36).substr(2, 9),
          status: CandidateStatus.PENDIENTE,
          jobRole: criteria.role,
          fileName: file.name,
          appliedDate: new Date().toISOString(),
          puntajeFinal
        });

        setProgress(Math.round(((i + 1) / total) * 100));
      } catch (err) {
        console.error(err);
      }
    }

    onAnalysisComplete(results);
    setTimeout(() => {
      setIsUploading(false);
      setCurrentFileName('');
    }, 500);
  };

  return (
    <div className="h-full flex flex-col justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className={`bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-50 transition-all ${isUploading ? 'scale-105' : ''}`}>
        {!isUploading ? (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Subir CVs</h2>
              <p className="text-sm font-medium text-slate-400 mt-2 leading-relaxed px-4">
                Selecciona uno o varios archivos PDF para procesar con IA según el perfil <span className="text-indigo-600 font-bold">#{criteria.role}</span>
              </p>
            </div>
            <label className="block">
              <span className="w-full bg-slate-900 text-white py-5 px-8 rounded-3xl font-black text-lg shadow-xl block cursor-pointer active:scale-95 transition-all">
                Seleccionar PDF
              </span>
              <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
            </label>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Capacidad máx: 10 CVs por lote</p>
          </div>
        ) : (
          <div className="text-center space-y-8 py-4">
            <div className="relative w-40 h-40 mx-auto">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                 <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={465} strokeDashoffset={465 - (465 * progress) / 100} className="text-indigo-600 transition-all duration-700 ease-out stroke-round" strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-black text-slate-900">{progress}%</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listo</span>
               </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-700 truncate px-4">"{currentFileName}"</p>
              <div className="flex items-center justify-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-100"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isUploading && (
        <div className="mt-10 bg-indigo-600 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl shadow-indigo-200">
          <div className="bg-indigo-400/30 p-2 rounded-xl">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-xs font-bold leading-relaxed">
            La IA evaluará automáticamente la experiencia técnica y la actitud semántica del texto.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
