import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStatus, JobRole } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onUpdateStatus, onDelete, onClearAll }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return candidates
      .filter(c => 
        c.nombre.toLowerCase().includes(search.toLowerCase()) || 
        c.localidad.toLowerCase().includes(search.toLowerCase()) ||
        c.habilidadesEncontradas?.some(h => h.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => b.puntajeFinal - a.puntajeFinal);
  }, [candidates, search]);

  const openWhatsApp = (c: Candidate) => {
    const text = `Hola ${c.nombre}, soy de GastroHire. Vi tu CV para ${c.jobRole} y me interesó mucho. ¿Podríamos coordinar una breve entrevista?`;
    window.open(`https://wa.me/${c.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Sistema de Temas Dinámicos
  const getCardTheme = (c: Candidate) => {
    // Prioridad 1: Estados de decisión del usuario
    if (c.status === CandidateStatus.DESCARTADO) {
      return {
        bg: 'bg-red-50/50',
        border: 'border-red-200',
        accent: 'bg-red-400',
        text: 'text-red-700',
        label: 'DESCARTADO',
        opacity: 'opacity-70'
      };
    }
    if (c.status === CandidateStatus.ENTREVISTA) {
      return {
        bg: 'bg-emerald-50/80',
        border: 'border-emerald-300',
        accent: 'bg-emerald-600',
        text: 'text-emerald-800',
        label: 'AGENDADO / OK',
        opacity: 'opacity-100'
      };
    }

    // Prioridad 2: Basado en el ranking de IA (Pendientes)
    if (c.puntajeFinal >= 80) return {
      bg: 'bg-white',
      border: 'border-emerald-100',
      accent: 'bg-emerald-500',
      text: 'text-emerald-600',
      label: 'TOP MATCH',
      opacity: 'opacity-100'
    };
    if (c.puntajeFinal >= 50) return {
      bg: 'bg-white',
      border: 'border-slate-100',
      accent: 'bg-slate-900',
      text: 'text-slate-700',
      label: 'APTO',
      opacity: 'opacity-100'
    };
    return {
      bg: 'bg-white',
      border: 'border-rose-100',
      accent: 'bg-rose-400',
      text: 'text-rose-600',
      label: 'BAJO MATCH',
      opacity: 'opacity-100'
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-5xl mx-auto pb-32">
      <header className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Candidatos</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Ranking Inteligente V3.6</p>
        </div>
        {candidates.length > 0 && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClearAll();
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm hover:border-red-500 hover:bg-red-50 transition-all active:scale-95 group"
          >
            <svg className="w-4 h-4 text-slate-300 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            <span className="text-[10px] font-black text-slate-400 group-hover:text-red-600 uppercase tracking-widest">Vaciar Base</span>
          </button>
        )}
      </header>

      {/* Buscador */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, zona o habilidades (Parrilla, Inglés, etc...)"
          className="w-full bg-white pl-14 pr-8 py-6 rounded-[2rem] border-none shadow-xl shadow-slate-200/40 text-sm font-bold focus:ring-4 focus:ring-slate-900/10 transition-all outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(c => {
          const theme = getCardTheme(c);
          return (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              className={`${theme.bg} ${theme.opacity} rounded-[2.5rem] border-2 transition-all overflow-hidden cursor-pointer ${selectedId === c.id ? 'border-slate-900 shadow-2xl scale-[1.01]' : `${theme.border} shadow-sm hover:shadow-lg`}`}
            >
              <div className="p-8 flex items-center gap-8">
                {/* Badge de Score con Color de Estado */}
                <div className={`w-16 h-16 rounded-2xl ${theme.accent} flex flex-col items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-xl font-black text-white italic leading-none">{c.puntajeFinal}</span>
                  <span className="text-[8px] font-bold text-white/50 uppercase mt-0.5">PTS</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-slate-900 truncate tracking-tighter uppercase italic">{c.nombre}</h3>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-lg ${theme.accent} text-white uppercase tracking-widest shadow-sm`}>
                      {theme.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.experienciaAnios} AÑOS EXP.</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">• {c.localidad}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>• {c.jobRole}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); openWhatsApp(c); }}
                  className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200 hover:scale-110 active:scale-90 transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-3.694c1.616.96 3.255 1.487 4.904 1.488 5.421 0 9.831-4.41 9.834-9.83.002-2.628-1.023-5.097-2.887-6.963-1.864-1.865-4.331-2.889-6.958-2.89-5.423 0-9.832 4.41-9.835 9.83-.001 1.761.47 3.473 1.364 4.977l-.908 3.321 3.484-.913z"/></svg>
                </button>
              </div>

              {/* Snapshot Detallado */}
              {selectedId === c.id && (
                <div className={`px-8 pb-8 pt-4 space-y-6 animate-in slide-in-from-top-4 duration-300 border-t border-slate-100 ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-50/20' : 'bg-slate-50'}`}>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="text-xs font-bold text-slate-700">{c.telefono || 'Sin datos'}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">E-mail</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{c.email}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Localidad</p>
                      <p className="text-xs font-bold text-slate-700">{c.localidad}</p>
                    </div>
                    <div className={`${theme.accent} p-5 rounded-2xl shadow-xl flex flex-col justify-center border-l-4 border-white/20`}>
                      <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1 italic">Coincidencia IA</p>
                      <p className="text-sm font-black text-white italic">{c.ai_quality_score}% Calidad</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lo mejor del perfil</h4>
                     <div className="flex flex-wrap gap-2">
                       {c.habilidadesEncontradas?.map((h, i) => (
                         <span key={i} className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase italic tracking-tighter">
                           {h}
                         </span>
                       ))}
                       {c.fortalezas?.map((f, i) => (
                         <span key={i} className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase italic border border-emerald-100">
                           {f}
                         </span>
                       ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Análisis Predictivo</h4>
                      <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 text-sm font-bold text-slate-600 leading-relaxed italic shadow-sm">
                        "{c.resumen}"
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1 text-right italic">Guía Estratégica</h4>
                      <div className="space-y-2">
                        {c.preguntasEntrevista.map((q, i) => (
                          <div key={i} className="flex gap-4 bg-white p-4 rounded-2xl border border-slate-100 items-center hover:border-slate-900 transition-all shadow-sm">
                            <span className="bg-slate-900 text-white font-black text-[9px] w-6 h-6 rounded-lg flex items-center justify-center shrink-0">0{i+1}</span>
                            <p className="text-xs font-bold text-slate-700 leading-tight">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de Estado */}
                  <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} 
                      className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.2em] p-4 transition-colors"
                    >
                      Eliminar Registro
                    </button>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.DESCARTADO); }}
                        className={`flex-1 md:flex-none px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'bg-white border border-slate-200 text-slate-400 hover:border-red-500 hover:text-red-500'}`}
                      >
                        {c.status === CandidateStatus.DESCARTADO ? 'Ya Descartado' : 'Descartar'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.ENTREVISTA); }} 
                        className={`flex-1 md:flex-none px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl ${c.status === CandidateStatus.ENTREVISTA ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:scale-[1.03] active:scale-95'}`}
                      >
                        {c.status === CandidateStatus.ENTREVISTA ? 'Cita Confirmada' : 'Agendar / OK'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;