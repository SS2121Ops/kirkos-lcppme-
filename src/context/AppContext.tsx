import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkProcess,
  Team,
  User,
  KPI,
  Plan,
  PlanTarget,
  Performance,
} from '../types';
import {
  INITIAL_PROCESSES,
  INITIAL_TEAMS,
  INITIAL_USERS,
  INITIAL_KPIS,
  INITIAL_PLANS,
  INITIAL_TARGETS,
  INITIAL_PERFORMANCES,
} from '../data/seedData';

interface AppContextType {
  processes: WorkProcess[];
  teams: Team[];
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  kpis: KPI[];
  plans: Plan[];
  targets: PlanTarget[];
  performances: Performance[];
  language: 'am' | 'en' | 'bi'; // Amharic, English, or Bilingual
  setLanguage: (lang: 'am' | 'en' | 'bi') => void;

  // Plan methods
  addPlan: (plan: Omit<Plan, 'id' | 'created_at'>) => Plan;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;

  // Target methods
  addTarget: (target: Omit<PlanTarget, 'id' | 'created_at'>) => PlanTarget;
  updateTarget: (id: number, updates: Partial<PlanTarget>) => void;
  deleteTarget: (id: number) => void;

  // KPI methods
  addKPI: (kpi: Omit<KPI, 'id' | 'created_at'>) => KPI;
  updateKPI: (id: number, updates: Partial<KPI>) => void;
  deleteKPI: (id: number) => void;

  // Performance methods
  addPerformance: (perf: Omit<Performance, 'id' | 'achievement_percent' | 'cumulative_achievement_percent'>) => Performance;
  updatePerformance: (id: number, updates: Partial<Performance>) => void;
  deletePerformance: (id: number) => void;
  submitPerformance: (id: number) => void;
  reviewPerformance: (id: number, comment?: string) => void;
  approvePerformance: (id: number, comment?: string) => void;
  rejectPerformance: (id: number, comment?: string) => void;

  // Helpers
  getProcessById: (id?: number | null) => WorkProcess | undefined;
  getTeamById: (id?: number | null) => Team | undefined;
  getKpiById: (id?: number | null) => KPI | undefined;
  getTargetById: (id?: number | null) => PlanTarget | undefined;
  getPlanById: (id?: number | null) => Plan | undefined;
  getUserById: (id?: number | null) => User | undefined;

  // Stats
  stats: {
    totalPlans: number;
    totalKpis: number;
    totalPerformances: number;
    performancePercent: number;
    totalApprovedActual: number;
    totalApprovedTarget: number;
  };

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROCESSES: 'kirkos_lcppme_processes_v1',
  TEAMS: 'kirkos_lcppme_teams_v1',
  USERS: 'kirkos_lcppme_users_v1',
  CURRENT_USER: 'kirkos_lcppme_current_user_v1',
  KPIS: 'kirkos_lcppme_kpis_v1',
  PLANS: 'kirkos_lcppme_plans_v1',
  TARGETS: 'kirkos_lcppme_targets_v1',
  PERFORMANCES: 'kirkos_lcppme_performances_v1',
  LANG: 'kirkos_lcppme_language_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<WorkProcess[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROCESSES);
    return saved ? JSON.parse(saved) : INITIAL_PROCESSES;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS[0];
  });

  const [kpis, setKpis] = useState<KPI[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KPIS);
    return saved ? JSON.parse(saved) : INITIAL_KPIS;
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [targets, setTargets] = useState<PlanTarget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return saved ? JSON.parse(saved) : INITIAL_TARGETS;
  });

  const [performances, setPerformances] = useState<Performance[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERFORMANCES);
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCES;
  });

  const [language, setLanguage] = useState<'am' | 'en' | 'bi'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as 'am' | 'en' | 'bi') || 'bi';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(processes));
  }, [processes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(kpis));
  }, [kpis]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERFORMANCES, JSON.stringify(performances));
  }, [performances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  // Lookup helpers
  const getProcessById = (id?: number | null) => processes.find((p) => p.id === id);
  const getTeamById = (id?: number | null) => teams.find((t) => t.id === id);
  const getKpiById = (id?: number | null) => kpis.find((k) => k.id === id);
  const getTargetById = (id?: number | null) => targets.find((t) => t.id === id);
  const getPlanById = (id?: number | null) => plans.find((p) => p.id === id);
  const getUserById = (id?: number | null) => users.find((u) => u.id === id);

  // Stats calculation
  const approvedPerformances = performances.filter((p) => p.status === 'Approved');
  const totalApprovedActual = approvedPerformances.reduce((acc, p) => acc + (p.monthly_actual || 0), 0);
  const totalApprovedTarget = approvedPerformances.reduce((acc, p) => {
    const target = targets.find((t) => t.id === p.target_id);
    return acc + (target ? target.target_value || 0 : 0);
  }, 0);

  const performancePercent =
    totalApprovedTarget > 0 ? (totalApprovedActual / totalApprovedTarget) * 100 : 0;

  const stats = {
    totalPlans: plans.length,
    totalKpis: kpis.length,
    totalPerformances: performances.length,
    performancePercent,
    totalApprovedActual,
    totalApprovedTarget,
  };

  // Plan actions
  const addPlan = (planData: Omit<Plan, 'id' | 'created_at'>): Plan => {
    const newId = plans.length > 0 ? Math.max(...plans.map((p) => p.id)) + 1 : 1;
    const newPlan: Plan = {
      ...planData,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id: number, updates: Partial<Plan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePlan = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    // also remove targets linked to this plan
    setTargets((prev) => prev.filter((t) => t.plan_id !== id));
  };

  // Target actions
  const addTarget = (targetData: Omit<PlanTarget, 'id' | 'created_at'>): PlanTarget => {
    const newId = targets.length > 0 ? Math.max(...targets.map((t) => t.id)) + 1 : 1;
    const newTarget: PlanTarget = {
      ...targetData,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setTargets((prev) => [...prev, newTarget]);
    return newTarget;
  };

  const updateTarget = (id: number, updates: Partial<PlanTarget>) => {
    setTargets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTarget = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setPerformances((prev) => prev.filter((p) => p.target_id !== id));
  };

  // KPI actions
  const addKPI = (kpiData: Omit<KPI, 'id' | 'created_at'>): KPI => {
    const newId = kpis.length > 0 ? Math.max(...kpis.map((k) => k.id)) + 1 : 1;
    const newKpi: KPI = {
      ...kpiData,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setKpis((prev) => [...prev, newKpi]);
    return newKpi;
  };

  const updateKPI = (id: number, updates: Partial<KPI>) => {
    setKpis((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  };

  const deleteKPI = (id: number) => {
    setKpis((prev) => prev.filter((k) => k.id !== id));
  };

  // Performance actions
  const addPerformance = (
    perfData: Omit<Performance, 'id' | 'achievement_percent' | 'cumulative_achievement_percent'>
  ): Performance => {
    const target = targets.find((t) => t.id === perfData.target_id);
    const targetVal = target?.target_value || 1;
    const achievement_percent = (perfData.monthly_actual / targetVal) * 100;
    const cumulative_achievement_percent =
      perfData.cumulative_actual > 0 && targetVal > 0
        ? (perfData.cumulative_actual / targetVal) * 100
        : achievement_percent;

    const newId = performances.length > 0 ? Math.max(...performances.map((p) => p.id)) + 1 : 1;
    const newPerf: Performance = {
      ...perfData,
      id: newId,
      achievement_percent: Number(achievement_percent.toFixed(1)),
      cumulative_achievement_percent: Number(cumulative_achievement_percent.toFixed(1)),
      entered_by: currentUser.id,
    };
    setPerformances((prev) => [newPerf, ...prev]);
    return newPerf;
  };

  const updatePerformance = (id: number, updates: Partial<Performance>) => {
    setPerformances((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updates };
        const target = targets.find((t) => t.id === merged.target_id);
        if (target && target.target_value > 0) {
          merged.achievement_percent = Number(((merged.monthly_actual / target.target_value) * 100).toFixed(1));
        }
        return merged;
      })
    );
  };

  const deletePerformance = (id: number) => {
    setPerformances((prev) => prev.filter((p) => p.id !== id));
  };

  const submitPerformance = (id: number) => {
    setPerformances((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Submitted',
              submitted_by: currentUser.id,
              submitted_at: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const reviewPerformance = (id: number, comment?: string) => {
    setPerformances((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Reviewed',
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
              review_comment: comment || p.review_comment,
            }
          : p
      )
    );
  };

  const approvePerformance = (id: number, comment?: string) => {
    setPerformances((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Approved',
              approved_by: currentUser.id,
              approved_at: new Date().toISOString(),
              review_comment: comment || p.review_comment,
            }
          : p
      )
    );
  };

  const rejectPerformance = (id: number, comment?: string) => {
    setPerformances((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Rejected',
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString(),
              review_comment: comment || 'Needs revision',
            }
          : p
      )
    );
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.PROCESSES);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.KPIS);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.TARGETS);
    localStorage.removeItem(STORAGE_KEYS.PERFORMANCES);

    setProcesses(INITIAL_PROCESSES);
    setTeams(INITIAL_TEAMS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setKpis(INITIAL_KPIS);
    setPlans(INITIAL_PLANS);
    setTargets(INITIAL_TARGETS);
    setPerformances(INITIAL_PERFORMANCES);
  };

  return (
    <AppContext.Provider
      value={{
        processes,
        teams,
        users,
        currentUser,
        setCurrentUser,
        kpis,
        plans,
        targets,
        performances,
        language,
        setLanguage,
        addPlan,
        updatePlan,
        deletePlan,
        addTarget,
        updateTarget,
        deleteTarget,
        addKPI,
        updateKPI,
        deleteKPI,
        addPerformance,
        updatePerformance,
        deletePerformance,
        submitPerformance,
        reviewPerformance,
        approvePerformance,
        rejectPerformance,
        getProcessById,
        getTeamById,
        getKpiById,
        getTargetById,
        getPlanById,
        getUserById,
        stats,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
