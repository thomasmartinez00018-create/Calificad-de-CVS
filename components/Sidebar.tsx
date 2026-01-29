
import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'config' | 'upload';
  onTabChange: (tab: 'dashboard' | 'config' | 'upload') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="bg-indigo-500 p-1.5 rounded-lg text-white">GH</span>
          GastroHire AI
        </h1>
        <p className="text-slate-400 text-xs mt-1">Smart Recruitment for Food</p>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          Dashboard
        </button>
        
        <button
          onClick={() => onTabChange('config')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'config' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Configuración
        </button>
        
        <button
          onClick={() => onTabChange('upload')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Subir CVs
        </button>
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40" className="w-8 h-8 rounded-full border border-slate-700" alt="Avatar" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Recursos Humanos</p>
            <p className="text-xs text-slate-500 truncate">Sede Central</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
