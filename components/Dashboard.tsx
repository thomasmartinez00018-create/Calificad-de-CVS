import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStatus } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

interface AppointmentData {
  fecha: string;
  hora: string;
  entrevistador: string;
}

const Dashboard: React.FC<DashboardProps> = ({ candidates, onUpdateStatus, onDelete, onClearAll }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData>({
    fecha: '',
    hora: '',
    entrevistador: ''
  });

  const filtered = useMemo(() => {
    return candidates
      .filter(c => 
        c.nombre.toLowerCase().includes(search.toLowerCase()) || 
        c.localidad.toLowerCase().includes(search.toLowerCase()) ||
        c.jobRole.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.puntajeFinal - a.puntajeFinal);
  }, [candidates, search]);

  const generateWhatsAppMessage = (c: Candidate) => {
    const { fecha, hora, entrevistador } = appointment;
    const f = fecha || "[FECHA]";
    const h = hora || "[HORARIO]";
    const e = entrevistador || "[NOMBRE DEL ENTREVISTADOR]";

    const text = `¡Hola ${c.nombre}! 👋 Un gusto saludarte. 

Somos del equipo de Selección de Personal. Vimos tu perfil para el puesto de *${c.jobRole}* y nos interesa mucho tu experiencia.

Nos gustaría invitarte a una entrevista presencial:
📍 *Ubicación:* Alicia Moreau de Justo, Puerto Madero.
📅 *Día:* ${f}
⏰ *Horario:* ${h}
👤 *Te recibe:* ${e}

Por favor, ¿podrías confirmarnos si podés asistir? 
¡Muchas gracias!`;

    window.open(`https://wa.me/${c.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getCardTheme = (c: Candidate) => {
    if (c.status === CandidateStatus.DESCARTADO) return { bg: 'bg-red-50/40', accent: 'bg-red-500', label: 'DESCARTADO' };
    if (c.status === CandidateStatus.ENTREVISTA) return { bg: 'bg-emerald-50/50', accent: 'bg-emerald-600', label: 'CITADO' };
    if (c.puntajeFinal >= 85) return { bg: 'bg-white', accent: 'bg-emerald-500', label: 'TOP MATCH' };
    return { bg: 'bg-white', accent: 'bg-slate-900', label: 'APTO' };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-32 px-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Ranking de Talento</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Análisis en tiempo real • Alicia Moreau de Justo</p>
        </div>
        <button onClick={onClearAll} className="text-[9px] font-black text-slate-300 uppercase underline hover:text-red-500 transition-colors">Vaciar Base de Datos</button>
      </header>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Filtrar por puesto (Cocinero, Cajero, etc) o zona..."
          className="w-full bg-white px-6 py-5 rounded-3xl shadow-xl shadow-slate-200/50 text-sm font-bold outline-none border border-transparent focus:border-slate-900 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-300 font-black uppercase italic">Sin candidatos analizados</p>
          </div>
        ) : filtered.map(c => {
          const theme = getCardTheme(c);
          const isSelected = selectedId === c.id;

          return (
            <div 
              key={c.id} 
              onClick={() => setSelectedId(isSelected ? null : c.id)}
              className={`${theme.bg} rounded-[2.5rem] border border-slate-100 shadow-sm transition-all overflow-hidden cursor-pointer hover:shadow-md ${isSelected ? 'ring-2 ring-slate-900 shadow-2xl' : ''}`}
            >
              <div className="p-5 md:p-8 flex items-center gap-4 md:gap-8">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl ${theme.accent} flex flex-col items-center justify-center shrink-0 shadow-lg transform transition-transform ${isSelected ? 'scale-110 rotate-3' : ''}`}>
                  <span className="text-xl md:text-3xl font-black text-white italic">{c.puntajeFinal}</span>
                  <span className="text-[7px] md:text-[9px] font-bold text-white/60">SCORE</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase italic truncate tracking-tighter">{c.nombre}</h3>
                    <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{c.jobRole}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-3">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase italic">Experiencia</span>
                      <span className="text-[11px] font-bold text-slate-700">{c.experienciaAnios} Años</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase italic">Empleos</span>
                      <span className="text-[11px] font-bold text-slate-700">{c.cantidadTrabajos} puestos</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase italic">Edad</span>
                      <span className="text-[11px] font-bold text-slate-700">{c.edad || 'Desconocida'}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-300 uppercase italic">Zona</span>
                      <span className="text-[11px] font-bold text-slate-700 truncate">{c.localidad}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 uppercase italic mb-1">Status</span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase italic ${c.status === CandidateStatus.ENTREVISTA ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.status}
                    </span>
                </div>
              </div>

              {isSelected && (
                <div className="px-6 pb-8 pt-4 space-y-6 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300" onClick={e => e.stopPropagation()}>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Preguntas Estratégicas (IA)</h4>
                        <ul className="space-y-3">
                          {c.preguntasEntrevista.slice(0, 4).map((q, i) => (
                            <li key={i} className="flex gap-3 text-[11px] font-bold text-slate-600 leading-tight">
                              <span className="text-slate-900 mt-0.5">●</span> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-slate-900 p-6 rounded-3xl shadow-xl">
                        <h4 className="text-[10px] font-black text-white/40 uppercase mb-2">Disponibilidad Detallada</h4>
                        <p className="text-[11px] font-bold text-white italic leading-relaxed">"{c.disponibilidadHoraria || 'Sin especificar en CV'}"</p>
                        <div className="h-px bg-white/10 my-4"></div>
                        <h4 className="text-[10px] font-black text-white/40 uppercase mb-2 italic">Análisis de Perfil</h4>
                        <p className="text-[11px] font-bold text-white/80 italic leading-relaxed">{c.resumen}</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border-2 border-emerald-100 shadow-xl space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Agendar en Puerto Madero</h4>
                        <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      </div>
                      
                      <div className="space-y-3">
                        <input 
                          type="text" placeholder="Día (ej: Lunes 24)" 
                          className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold outline-none border border-slate-100 focus:border-emerald-300 transition-all"
                          value={appointment.fecha}
                          onChange={e => setAppointment({...appointment, fecha: e.target.value})}
                        />
                        <input 
                          type="text" placeholder="Hora (ej: 14:30 hs)" 
                          className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold outline-none border border-slate-100 focus:border-emerald-300 transition-all"
                          value={appointment.hora}
                          onChange={e => setAppointment({...appointment, hora: e.target.value})}
                        />
                        <input 
                          type="text" placeholder="Entrevistador (ej: Sr. Gómez)" 
                          className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold outline-none border border-slate-100 focus:border-emerald-300 transition-all"
                          value={appointment.entrevistador}
                          onChange={e => setAppointment({...appointment, entrevistador: e.target.value})}
                        />
                      </div>

                      <button 
                        onClick={() => {
                          onUpdateStatus(c.id, CandidateStatus.ENTREVISTA);
                          generateWhatsAppMessage(c);
                        }}
                        className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.222-3.694c1.616.96 3.255 1.487 4.904 1.488 5.421 0 9.831-4.41 9.834-9.83.002-2.628-1.023-5.097-2.887-6.963-1.864-1.865-4.331-2.889-6.958-2.89-5.423 0-9.832 4.41-9.835 9.83-.001 1.761.47 3.473 1.364 4.977l-.908 3.321 3.484-.913z"/></svg>
                        Enviar Invitación
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(c.id, CandidateStatus.DESCARTADO); }}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${c.status === CandidateStatus.DESCARTADO ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                      {c.status === CandidateStatus.DESCARTADO ? 'Descartado' : 'Descartar'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                      className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-slate-300 border border-slate-100 hover:text-red-400 hover:bg-red-50 transition-all"
                    >
                      Eliminar
                    </button>
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