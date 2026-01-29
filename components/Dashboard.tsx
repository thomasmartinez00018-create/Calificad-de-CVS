
import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStatus, JobRole } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onUpdateStatus, onDelete, onClearAll }) => {
  const [filterRole, setFilterRole] = useState<JobRole | 'Todos'>('Todos');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredCandidates = useMemo(() => {
    return candidates
      .filter(c => filterRole === 'Todos' || c.jobRole === filterRole)
      .filter(c => 
        c.nombre.toLowerCase().includes(search.toLowerCase()) || 
        c.localidad.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.puntajeFinal - a.puntajeFinal);
  }, [candidates, filterRole, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Talento Detectado</h2>
             <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">Ranking IA</span>
          </div>
          <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
            Gestionando {candidates.length} currículums activos
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-green-500 font-bold flex items-center gap-1 text-[10px] uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Base Sincronizada
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {candidates.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
            >
              Vaciar Base de Datos
            </button>
          )}
        </div>
      </header>

      {/* Filters Bar - Sin iconos innecesarios */}
      <div className="bg-white p-2 rounded-[28px] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Escribe para buscar por nombre o zona..."
            className="w-full bg-slate-50/50 px-8 py-4 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {['Todos', 'Mozo', 'Cocinero', 'Delivery'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`px-6 py-4 rounded-2xl text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-tighter ${
                filterRole === role 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {role === 'Todos' ? 'Cualquier Puesto' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              className={`bg-white rounded-[32px] p-6 transition-all cursor-pointer border border-transparent hover:shadow-xl hover:-translate-y-1 group ${
                selectedId === c.id ? 'ring-2 ring-indigo-500 shadow-2xl z-10' : 'shadow-sm'
              }`}
            >
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  c.puntajeFinal >= 80 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'
                }`}>
                  <span className="text-[10px] font-black opacity-70 uppercase tracking-tighter">Score</span>
                  <span className="text-xl font-black leading-none">{c.puntajeFinal}</span>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{c.nombre}</h3>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      c.status === CandidateStatus.ENTREVISTA ? 'bg-green-500' :
                      c.status === CandidateStatus.DESCARTADO ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">{c.jobRole}</span>
                    <span className="text-xs font-bold text-slate-400">{c.localidad}</span>
                  </div>
                  
                  <div className="hidden sm:flex flex-wrap gap-1.5 mt-4">
                    {c.fortalezas.slice(0, 2).map((f, idx) => (
                      <span key={idx} className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedId === c.id && (
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Experiencia</p>
                      <p className="text-sm font-black text-slate-800">{c.experienciaAnios} años</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contacto</p>
                      <p className="text-sm font-black text-indigo-600 truncate">{c.telefono || 'Sin datos'}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aplicación</p>
                      <p className="text-sm font-black text-slate-800">{new Date(c.appliedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50/30 p-5 rounded-3xl border border-indigo-100/50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Análisis IA</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{c.resumen}"</p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 flex gap-2">
                       <button 
                         onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.ENTREVISTA); }}
                         className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${c.status === CandidateStatus.ENTREVISTA ? 'bg-green-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                         Entrevistar
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.DESCARTADO); }}
                         className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                         Descartar
                       </button>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                      className="bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-48 px-6">
            <p className="text-5xl font-black text-slate-100 tracking-tighter mb-4 select-none uppercase">Sin Resultados</p>
            <h3 className="text-xl font-bold text-slate-400">Tu radar de talento está limpio</h3>
            <p className="text-slate-300 mt-2 max-w-xs mx-auto text-sm font-medium">Sube currículums en la sección de carga para empezar el análisis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
