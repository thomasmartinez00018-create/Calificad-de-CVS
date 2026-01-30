import React, { useState } from 'react';
import { HiringCriteria, JobRole } from '../types';

interface JobConfigProps {
  criteria: HiringCriteria;
  onUpdate: (criteria: HiringCriteria) => void;
}

const JobConfig: React.FC<JobConfigProps> = ({ criteria, onUpdate }) => {
  const [localCriteria, setLocalCriteria] = useState(criteria);
  const roles: JobRole[] = ['Mozo', 'Cocinero', 'Delivery', 'Admin', 'Limpieza', 'Hostess'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 max-w-5xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Estrategia de Búsqueda</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Configuración V3.0 Platinum</p>
        </div>
        <button
          onClick={() => onUpdate(localCriteria)}
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          Sincronizar IA
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Col: Basics */}
        <div className="space-y-8">
          <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 block">Perfil del Puesto</label>
            <div className="grid grid-cols-2 gap-4">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setLocalCriteria({ ...localCriteria, role })}
                  className={`px-4 py-5 rounded-3xl text-[11px] font-black transition-all border-2 text-center uppercase tracking-tighter ${
                    localCriteria.role === role
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xl'
                      : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-6">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Experiencia Mínima</label>
             <div className="flex items-center gap-8">
                <input 
                  type="range" min="0" max="10" 
                  className="flex-1 accent-slate-900 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  value={localCriteria.minYearsExperience}
                  onChange={(e) => setLocalCriteria({...localCriteria, minYearsExperience: parseInt(e.target.value)})}
                />
                <div className="bg-slate-900 text-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl">
                  {localCriteria.minYearsExperience}
                </div>
             </div>
          </section>
        </div>

        {/* Right Col: Context */}
        <div className="space-y-8">
          <section className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-8 flex-1 flex flex-col">
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Ubicación del Local</label>
              <input 
                type="text"
                placeholder="Ej: Palermo Soho, CABA"
                className="w-full bg-slate-50 p-5 rounded-2xl border-none text-sm font-bold text-slate-700 outline-none"
                value={localCriteria.businessLocation}
                onChange={(e) => setLocalCriteria({...localCriteria, businessLocation: e.target.value})}
              />
            </div>
            
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 block">Instrucciones de la IA</label>
              <textarea
                className="flex-1 w-full bg-slate-50 p-6 rounded-3xl border-none text-sm font-bold text-slate-700 outline-none resize-none min-h-[180px]"
                placeholder="Describe qué buscas exactamente... (ej: puntualidad, experiencia en parrilla, inglés fluido)"
                value={localCriteria.priorityCriteria}
                onChange={(e) => setLocalCriteria({ ...localCriteria, priorityCriteria: e.target.value })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobConfig;