import React from 'react';

interface NavigationProps {
  activeTab: 'dashboard' | 'config' | 'upload';
  onTabChange: (tab: 'dashboard' | 'config' | 'upload') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Candidatos', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'upload', label: 'Nueva Carga', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>, primary: true },
    { id: 'config', label: 'Configuración', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-slate-950 h-full flex-col p-8 text-white shrink-0 border-r border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-white">G</div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-none">GastroHire</h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Intelligence ATS</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-indigo-400' : 'group-hover:text-slate-300'}`}>
                {tab.icon}
              </span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-black truncate">Admin Local</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Sede Palermo</p>
            </div>
          </div>
          <div className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] text-center bg-indigo-500/10 py-2 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            Build: v1.3.0-FIX
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`flex flex-col items-center gap-1 transition-all ${
              tab.primary 
                ? 'bg-indigo-600 text-white p-4 rounded-2xl -mt-12 shadow-2xl shadow-indigo-300 ring-8 ring-slate-50' 
                : activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            {tab.icon}
            {!tab.primary && <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navigation;