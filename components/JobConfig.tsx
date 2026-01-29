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
    const key = process.env.API_KEY;
    if (!key || key === "undefined" || key === "") {
      alert("❌ ERROR: La API Key no está llegando al navegador. Verifica Vercel y haz un Redeploy.");
    } else {
      alert(`✅ OK: API Key detectada. Empieza con: ${key.substring(0, 4)}... (Largo: ${key.length})`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      <header className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Criterios de Selección</h2>
          <p className="text-sm font-medium text-slate-400">Entrena a la IA para buscar tu perfil ideal</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={testApiKey}
            className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm"
          >
            Probar Conexión
          </button>
          <button
            onClick={() => onUpdate(localCriteria)}
            className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-200 hover:translate-y-[-2px] active:translate-y-0 transition-all"
          >
            Guardar Configuración
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block">¿Para qué puesto reclutamos?</label>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Experiencia Mínima (Años)</label>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" min="0" max="10" 
                    className="flex-1 accent-orange-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    value={localCriteria.minYearsExperience}
                    onChange={(e) => setLocalCriteria({...localCriteria, minYearsExperience: parseInt(e.target.value)})}
                  />
                  <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl">
                    {localCriteria.minYearsExperience}
                  </div>
                </div>
             </div>

             <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Importancia de la Cercanía</label>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" min="0" max="100" 
                    className="flex-1 accent-orange-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    value={localCriteria.proximityWeight}
                    onChange={(e) => setLocalCriteria({...localCriteria, proximityWeight: parseInt(e.target.value)})}
                  />
                  <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base">
                    {localCriteria.proximityWeight}%
                  </div>
                </div>
             </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-full flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Instrucciones semánticas para la IA</label>
            <textarea
              className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border-none text-sm font-medium text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder="Ej: Priorizar candidatos que vivan en zona norte. Valorar mucho si tienen experiencia en manejo de caja y si demuestran una actitud proactiva en su redacción..."
              value={localCriteria.priorityCriteria}
              onChange={(e) => setLocalCriteria({ ...localCriteria, priorityCriteria: e.target.value })}
            />
            
            <div className="mt-8">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Turno Preferido</label>
              <div className="grid grid-cols-2 gap-2">
                {['Mañana', 'Tarde', 'Noche', 'Rotativo'].map(t => (
                  <button
                    key={t}
                    onClick={() => setLocalCriteria({...localCriteria, availability: t as any})}
                    className={`py-3 rounded-xl text-xs font-bold border ${localCriteria.availability === t ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-slate-100 text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <div className="md:hidden flex flex-col gap-3">
        <button
          onClick={testApiKey}
          className="w-full bg-slate-200 text-slate-700 py-4 rounded-3xl font-bold"
        >
          Probar Diagnóstico Técnico
        </button>
        <button
          onClick={() => onUpdate(localCriteria)}
          className="w-full bg-orange-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-orange-200 active:scale-95 transition-all"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default JobConfig;