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

  const getCardTheme = (c: Candidate) => {
    if (c.status === CandidateStatus.DESCARTADO) {
      return {
        bg: 'bg-red-50/50',
        border: 'border-red-200',
        accent: 'bg-red-400',
        text: 'text-red-700',
        label: 'DESCARTADO',
        opacity: 'opacity-75'
      };
    }
    if (c.status === CandidateStatus.ENTREVISTA) {
      return {
        bg: 'bg-emerald-50/80',
        border: 'border-emerald-300',
        accent: 'bg-emerald-600',
        text: 'text-emerald-800',
        label: 'AGENDADO',
        opacity: 'opacity-100'
      };
    }
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
      label: 'BAJO',
      opacity: 'opacity-100'
    };
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-32">
      <header className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Talento</h2>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ranking V3.7 Mobile Ready</p>
        </div>
        {candidates.length > 0 && (
          <button 
            onPointerDown={(e) => { e.preventDefault(); onClearAll(); }}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-sm hover:border-red-500 active:bg-red-50 transition-all"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Vaciar</span>
          </button>
        )}
      </header>

      <div className="relative group">
        <input
          type="text"
          placeholder="Buscar mozo, cocinero, zona..."
          className="w-full bg-white pl-12 pr-6 py-4 md:py-6 rounded-2xl md:rounded-[2rem] shadow-lg shadow-slate-200/40 text-sm font-bold focus:ring-4 focus:ring-slate-900/5 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {filtered.map(c => {
          const theme = getCardTheme(c);
          return (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              className={`${theme.bg} ${theme.opacity} rounded-3xl md:rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedId === c.id ? 'border-slate-900 shadow-xl' : `${theme.border} shadow-sm hover:shadow-md`}`}
            >
              <div className="p-4 md:p-8 flex items-center gap-3 md:gap-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${theme.accent} flex flex-col items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-lg md:text-xl font-black text-white italic leading-none">{c.puntajeFinal}</span>
                  <span className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase mt-0.5">PTS</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 truncate tracking-tighter uppercase italic">{c.nombre}</h3>
                    <span className={`text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded md:rounded-lg ${theme.accent} text-white uppercase tracking-widest`}>
                      {theme.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 md:gap-x-4 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">
                    <span>{c.experienciaAnios}A EXP</span>
                    <span>• {c.localidad.split(',')[0]}</span>
                    <span className={theme.text}>• {c.jobRole}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); openWhatsApp(c); }}
                  className="bg-emerald-500 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-100 active:scale-90 transition-all shrink-0"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-3.694c1.616.96 3.255 1.487 4.904 1.488 5.421 0 9.831-4.41 9.834-9.83.002-2.628-1.023-5.097-2.887-6.963-1.864-1.865-4.331-2.889-6.958-2.89-5.423 0-9.832 4.41-9.835 9.83-.001 1.761.47 3.473 1.364 4.977l-.908 3.321 3.484-.913z"/></svg>
                </button>
              </div>

              {selectedId === c.id && (
                <div className={`px-4 pb-6 md:px-8 md:pb-8 pt-4 space-y-4 md:space-y-6 animate-in slide-in-from-top-2 duration-300 border-t border-slate-100 ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-50/20' : 'bg-slate-50'}`}>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[ {l: 'WhatsApp', v: c.telefono}, {l: 'E-mail', v: c.email}, {l: 'Zona', v: c.localidad}, {l: 'Calidad IA', v: `${c.ai_quality_score}%`, dark: true} ].map((stat, i) => (
                      <div key={i} className={`${stat.dark ? theme.accent : 'bg-white'} p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden`}>
                        <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest mb-1 ${stat.dark ? 'text-white/50' : 'text-slate-300'}`}>{stat.l}</p>
                        <p className={`text-[10px] md:text-xs font-bold truncate ${stat.dark ? 'text-white italic' : 'text-slate-700'}`}>{stat.v || 'N/A'}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 space-y-3">
                     <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Habilidades Clave</h4>
                     <div className="flex flex-wrap gap-1.5">
                       {c.habilidadesEncontradas?.slice(0, 6).map((h, i) => (
                         <span key={i} className="bg-slate-900 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-lg uppercase italic">{h}</span>
                       ))}
                     </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100">
                      <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-2">Análisis Predictivo</h4>
                      <p className="text-[11px] md:text-sm font-bold text-slate-600 leading-relaxed italic">"{c.resumen}"</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-200 gap-3">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} className="text-[9px] font-black text-red-400 uppercase tracking-widest p-2">Eliminar</button>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.DESCARTADO); }}
                        className={`flex-1 md:flex-none px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'}`}
                      >
                        {c.status === CandidateStatus.DESCARTADO ? 'Descartado' : 'Descartar'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.ENTREVISTA); }} 
                        className={`flex-1 md:flex-none px-8 py-4 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-xl ${c.status === CandidateStatus.ENTREVISTA ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}
                      >
                        {c.status === CandidateStatus.ENTREVISTA ? 'Agendado' : 'Agendar / OK'}
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