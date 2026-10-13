import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarDays,
  TrendingUp,
  Target,
  Network,
  FileSpreadsheet,
} from 'lucide-react';

export type TabType = 'dashboard' | 'plans' | 'performance' | 'kpis' | 'processes' | 'reports';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language } = useApp();

  const navItems: { id: TabType; icon: React.ElementType; labelAm: string; labelEn: string }[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      labelAm: 'ዋና ገጽ',
      labelEn: 'Dashboard',
    },
    {
      id: 'plans',
      icon: CalendarDays,
      labelAm: 'ዓመታዊ ዕቅዶች',
      labelEn: 'Annual Plans',
    },
    {
      id: 'performance',
      icon: TrendingUp,
      labelAm: 'ወርሃዊ ክንውን',
      labelEn: 'Monthly Performance',
    },
    {
      id: 'kpis',
      icon: Target,
      labelAm: 'KPI አመልካቾች',
      labelEn: 'KPI Indicators',
    },
    {
      id: 'processes',
      icon: Network,
      labelAm: 'ሂደቶችና ቡድኖች',
      labelEn: 'Processes & Teams',
    },
    {
      id: 'reports',
      icon: FileSpreadsheet,
      labelAm: 'ሪፖርቶች',
      labelEn: 'Reports & Matrix',
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#12345a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>
                  {language === 'am'
                    ? item.labelAm
                    : language === 'en'
                    ? item.labelEn
                    : `${item.labelEn} / ${item.labelAm}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
