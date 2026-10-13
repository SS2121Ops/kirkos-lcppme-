import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PlansView } from './components/PlansView';
import { PerformanceView } from './components/PerformanceView';
import { KpiView } from './components/KpiView';
import { ProcessesTeamsView } from './components/ProcessesTeamsView';
import { ReportsView } from './components/ReportsView';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openNewPlanOnTab, setOpenNewPlanOnTab] = useState(false);
  const [openNewPerfOnTab, setOpenNewPerfOnTab] = useState(false);

  const handleOpenNewPlan = () => {
    setActiveTab('plans');
    setOpenNewPlanOnTab(true);
  };

  const handleOpenNewPerformance = () => {
    setActiveTab('performance');
    setOpenNewPerfOnTab(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewPlan={handleOpenNewPlan}
            onOpenNewPerformance={handleOpenNewPerformance}
          />
        )}

        {activeTab === 'plans' && (
          <PlansView
            isFormOpenInitially={openNewPlanOnTab}
            onCloseInitialForm={() => setOpenNewPlanOnTab(false)}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceView
            isFormOpenInitially={openNewPerfOnTab}
            onCloseInitialForm={() => setOpenNewPerfOnTab(false)}
          />
        )}

        {activeTab === 'kpis' && <KpiView />}

        {activeTab === 'processes' && <ProcessesTeamsView />}

        {activeTab === 'reports' && <ReportsView />}
      </main>

      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div>
            <span className="font-semibold text-slate-300">Kirkos-LCPPME</span> — Legal Compliance Planning, Monitoring & Evaluation System
          </div>
          <div>
            የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት | Small Taxpayers Sub-Office
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
