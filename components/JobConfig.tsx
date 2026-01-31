import React, { useState } from 'react';
import { HiringCriteria, JobRole } from '../types';

interface JobConfigProps {
  criteria: HiringCriteria;
  onUpdate: (criteria: HiringCriteria) => void;
}

const JobConfig: React.FC<JobConfigProps> = ({ criteria, onUpdate }) => {
  const [localCriteria, setLocalCriteria] = useState(criteria);
  const roles: JobRole[] = [
    'Cocinero', 'Fiambrero', 'Recepcionista', 'Commis', 
    'Bachero', 'RR.PP', 'Valet Parking', 'Cajero', 'Mozo'
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 max-w-5xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Estrategia</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configuración Gastronómica</p>
        </div>
        <button
          onClick={() => onUpdate(localCriteria)}
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all italic"
        >
          Sincronizar IA
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6 block italic">Puesto a Cubrir</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setLocalCriteria({ ...localCriteria, role })}
                  className={`px-3 py-4 rounded-2xl text-[10px] font-black transition-all border-2 text-center uppercase tracking-tighter italic ${
                    localCriteria.role === role
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                      : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-4">
             <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2 block italic">Experiencia Mínima (Años)</label>
             <div className="flex items-center gap-6">
                <input 
                  type="range" min="0" max="10" 
                  className="flex-1 accent-slate-900 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  value={localCriteria.minYearsExperience}
                  onChange={(e) => setLocalCriteria({...localCriteria, minYearsExperience: parseInt(e.target.value)})}
                />
                <div className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl italic">
                  {localCriteria.minYearsExperience}
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 block italic">Ubicación del Local</label>
              <input 
                type="text"
                placeholder="Ej: Palermo Soho, CABA"
                className="w-full bg-slate-50 p-4 rounded-2xl border-none text-xs font-bold text-slate-700 outline-none"
                value={localCriteria.businessLocation}
                onChange={(e) => setLocalCriteria({...localCriteria, businessLocation: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 block italic">Lo que NO puede faltar</label>
              <textarea
                className="w-full bg-slate-50 p-5 rounded-3xl border-none text-xs font-bold text-slate-700 outline-none resize-none min-h-[150px]"
                placeholder="Ej: Que haya trabajado en hoteles, que sepa manejar caja, disponibilidad feriados..."
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