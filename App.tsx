import React, { useState, useEffect } from 'react';
import { 
  HiringCriteria, 
  Candidate, 
  CandidateStatus 
} from './types';
import Navigation from './components/Navigation';
import JobConfig from './components/JobConfig';
import Dashboard from './components/Dashboard';
import FileUploader from './components/FileUploader';

const STORAGE_KEY_CANDIDATES = 'gh_candidates_data_v3';
const STORAGE_KEY_CRITERIA = 'gh_hiring_criteria_v3';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCriteria, setCurrentCriteria] = useState<HiringCriteria>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
    return saved ? JSON.parse(saved) : {
      role: 'Mozo',
      priorityCriteria: 'Buscamos perfiles con excelente trato al cliente y presencia.',
      minYearsExperience: 2,
      requiredSkills: ['Manipulación de Alimentos'],
      availability: 'Rotativo',
      businessLocation: 'Palermo Soho, CABA'
    };
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'upload'>('dashboard');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CRITERIA, JSON.stringify(currentCriteria));
  }, [currentCriteria]);

  const handleUpdateStatus = (id: string, status: CandidateStatus) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const handleNewCandidates = (newCandidates: Candidate[]) => {
    setCandidates(prev => [...newCandidates, ...prev]);
    setActiveTab('dashboard');
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('¿ELIMINAR TODO? Esta acción borrará todos los candidatos de la base de datos actual.')) {
      setCandidates([]);
      localStorage.removeItem(STORAGE_KEY_CANDIDATES);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden font-['Plus_Jakarta_Sans']">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto no-scrollbar pb-32 md:pb-12 pt-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              candidates={candidates} 
              onUpdateStatus={handleUpdateStatus} 
              onDelete={handleDeleteCandidate}
              onClearAll={handleClearAll}
            />
          )}
          
          {activeTab === 'config' && (
            <JobConfig 
              criteria={currentCriteria} 
              onUpdate={(newC) => { setCurrentCriteria(newC); setActiveTab('dashboard'); }} 
            />
          )}
          
          {activeTab === 'upload' && (
            <FileUploader 
              criteria={currentCriteria} 
              onAnalysisComplete={handleNewCandidates}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;