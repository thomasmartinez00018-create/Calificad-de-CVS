import React from 'react';

interface NavigationProps {
  activeTab: 'dashboard' | 'config' | 'upload';
  onTabChange: (tab: 'dashboard' | 'config' | 'upload') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Talento', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'upload', label: 'Escanear', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>, primary: true },
    { id: 'config', label: 'Estrategia', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ];

  return (
    <>
      <div className="hidden md:flex w-72 bg-slate-900 h-full flex-col p-8 text-white shrink-0 border-r border-slate-800/50">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-gradient-to-tr from-slate-200 to-slate-400 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-900/50 font-black text-slate-900 text-xl">GH</div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter leading-none">GastroHire</h1>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">V3.0 PLATINUM</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-2xl scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-slate-900' : 'group-hover:text-slate-300'}`}>
                {tab.icon}
              </span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-800/50">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estado Local</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs font-bold text-slate-200">Palermo, BA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-8 py-4 flex justify-between items-center z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              tab.primary 
                ? 'bg-slate-900 text-white p-5 rounded-[2.5rem] -mt-16 shadow-2xl ring-8 ring-slate-50' 
                : activeTab === tab.id ? 'text-slate-900 scale-110' : 'text-slate-400 opacity-50'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navigation;