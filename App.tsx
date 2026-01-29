
import React, { useState, useEffect } from 'react';
import { 
  JobRole, 
  HiringCriteria, 
  Candidate, 
  CandidateStatus 
} from './types.ts';
import Navigation from './components/Navigation.tsx';
import JobConfig from './components/JobConfig.tsx';
import Dashboard from './components/Dashboard.tsx';
import FileUploader from './components/FileUploader.tsx';

const STORAGE_KEY_CANDIDATES = 'gh_candidates_data';
const STORAGE_KEY_CRITERIA = 'gh_hiring_criteria';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CANDIDATES);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentCriteria, setCurrentCriteria] = useState<HiringCriteria>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CRITERIA);
    return saved ? JSON.parse(saved) : {
      role: 'Mozo',
      priorityCriteria: 'Buscamos perfiles con excelente trato al cliente.',
      minYearsExperience: 1,
      requiredSkills: ['Manipulación de Alimentos'],
      availability: 'Rotativo',
      proximityWeight: 50
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
    if (window.confirm('¿Estás seguro de eliminar todos los candidatos?')) {
      setCandidates([]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-8 pt-6 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
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
