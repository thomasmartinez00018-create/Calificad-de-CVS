import React, { useState } from 'react';
import { HiringCriteria, JobRole } from '../types';

interface JobConfigProps {
  criteria: HiringCriteria;
  onUpdate: (criteria: HiringCriteria) => void;
}

const JobConfig: React.FC<JobConfigProps> = ({ criteria, onUpdate }) => {
  const [localCriteria, setLocalCriteria] = useState(criteria);
  const roles: JobRole[] = ['Mozo', 'Cocinero', 'Delivery', 'Admin', 'Limpieza', 'Hostess'];

  const testApiKey = () => {
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!key || key === "undefined" || key === "") {
      alert(`❌ ERROR: Llave no detectada.\n\nValor: "${key}"\n\nEsto suele ser por caché viejo en el celular. Borra historial o usa Incógnito.`);
    } else {
      alert(`✅ OK: Llave detectada.\n\nEmpieza con: ${key.substring(0, 5)}...\nLargo: ${key.length} caracteres.`);
    }
  };

  const forceClear = () => {
    if (confirm("¿Limpiar datos locales y forzar recarga? Esto puede ayudar si el celular está 'trabado' en una versión vieja.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Criterios de Selección</h2>
          <p className="text-sm font-medium text-slate-400">Versión de Sistema: v1.7.0 (Esmeralda)</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={forceClear}
            className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl font-bold text-xs"
          >
            Limpiar Caché
          </button>
          <button
            onClick={testApiKey}
            className="bg-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl font-bold text-xs"
          >
            Diagnóstico
          </button>
          <button
            onClick={() => onUpdate(localCriteria)}
            className="hidden md:block bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200"
          >
            Guardar
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">Puesto</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setLocalCriteria({ ...localCriteria, role })}
                  className={`px-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 text-center ${
                    localCriteria.role === role
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                      : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Experiencia Mínima</label>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" min="0" max="10" 
                    className="flex-1 accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    value={localCriteria.minYearsExperience}
                    onChange={(e) => setLocalCriteria({...localCriteria, minYearsExperience: parseInt(e.target.value)})}
                  />
                  <div className="bg-emerald-50 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl">
                    {localCriteria.minYearsExperience}
                  </div>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-full flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Instrucciones IA</label>
            <textarea
              className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border-none text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none resize-none min-h-[200px]"
              placeholder="Ej: Priorizar cercanía..."
              value={localCriteria.priorityCriteria}
              onChange={(e) => setLocalCriteria({ ...localCriteria, priorityCriteria: e.target.value })}
            />
          </section>
        </div>
      </div>
      
      <div className="md:hidden">
        <button
          onClick={() => onUpdate(localCriteria)}
          className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-emerald-200"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};

export default JobConfig;