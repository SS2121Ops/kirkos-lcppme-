import React from 'react';
import { useApp } from '../context/AppContext';
import { TabType } from './Navbar';
import {
  CalendarDays,
  Percent,
  Target,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
  onOpenNewPlan: () => void;
  onOpenNewPerformance: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewPlan,
  onOpenNewPerformance,
}) => {
  const { stats, processes, teams, plans, targets, performances, language } = useApp();

  // Process breakdowns
  const processStats = processes.map((proc) => {
    const procTeams = teams.filter((t) => t.process_id === proc.id);
    const procPlans = plans.filter((p) => p.process_id === proc.id);
    const procPlanIds = procPlans.map((p) => p.id);
    const procTargets = targets.filter((t) => procPlanIds.includes(t.plan_id));
    const procTargetIds = procTargets.map((t) => t.id);
    const procApprovedPerfs = performances.filter(
      (p) => procTargetIds.includes(p.target_id) && p.status === 'Approved'
    );

    const actual = procApprovedPerfs.reduce((sum, p) => sum + (p.monthly_actual || 0), 0);
    const target = procApprovedPerfs.reduce((sum, p) => {
      const tgt = targets.find((t) => t.id === p.target_id);
      return sum + (tgt?.target_value || 0);
    }, 0);
    const percent = target > 0 ? (actual / target) * 100 : 0;

    return {
      process: proc,
      teamsCount: procTeams.length,
      plansCount: procPlans.length,
      actual,
      target,
      percent,
    };
  });

  const recentPerformances = performances.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Card matching original header info */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-[#12345a]">
                {language === 'am' ? 'ዳሽቦርድ | ዋና ገጽ' : language === 'en' ? 'Dashboard Overview' : 'Dashboard | ዋና ገጽ'}
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {language === 'am'
                ? 'የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት የዕቅድ፣ የክንውንና የግምገማ አስተዳደር'
                : language === 'en'
                ? 'Kirkos Sub-City Small Taxpayers Sub-Office Planning, Performance Monitoring and Evaluation'
                : 'የዕቅድ፣ የክንውንና የግምገማ አስተዳደር | Planning, Performance & Evaluation Management'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenNewPlan}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#12345a] hover:bg-[#0f2c4d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{language === 'am' ? 'አዲስ ዕቅድ መዝግብ' : language === 'en' ? 'New Plan' : 'አዲስ ዕቅድ / New Plan'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewPerformance}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>{language === 'am' ? 'ክንውን መዝግብ' : language === 'en' ? 'Record Actual' : 'ክንውን መዝግብ / Record Actual'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Stat Cards - Matches exact app.py stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plans */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {language === 'am' ? 'ጠቅላላ ዕቅዶች' : language === 'en' ? 'Total Plans' : 'Total Plans | ጠቅላላ ዕቅዶች'}
            </span>
            <div className="p-2 bg-blue-50 text-[#12345a] rounded-lg">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#12345a]">{stats.totalPlans}</div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>{plans.filter((p) => p.status === 'Approved').length} {language === 'am' ? 'የጸደቁ' : 'Approved'}</span>
            <span className="mx-1.5">•</span>
            <span>{plans.filter((p) => p.status === 'Draft').length} {language === 'am' ? 'ረቂቅ' : 'Draft'}</span>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {language === 'am' ? 'አጠቃላይ አፈጻጸም' : language === 'en' ? 'Overall Performance' : 'Performance | አፈጻጸም'}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {stats.performancePercent.toFixed(1)}%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {language === 'am'
              ? `ክንውን፡ ${stats.totalApprovedActual.toLocaleString()} / ዕቅድ፡ ${stats.totalApprovedTarget.toLocaleString()}`
              : `Actual: ${stats.totalApprovedActual.toLocaleString()} / Target: ${stats.totalApprovedTarget.toLocaleString()}`}
          </div>
        </div>

        {/* Recorded KPIs */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {language === 'am' ? 'የተመዘገቡ KPIዎች' : language === 'en' ? 'Recorded KPIs' : 'Recorded KPIs | የተመዘገቡ KPIዎች'}
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#12345a]">{stats.totalKpis}</div>
          <div className="mt-2 text-xs text-slate-500">
            {processes.length} {language === 'am' ? 'የሥራ ሂደቶች' : 'Work Processes'}
          </div>
        </div>

        {/* Performance Records */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {language === 'am' ? 'የክንውን መዝገቦች' : language === 'en' ? 'Performance Records' : 'Performance Records | የክንውን መዝገቦች'}
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#12345a]">{stats.totalPerformances}</div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="text-emerald-700 font-medium">
              {performances.filter((p) => p.status === 'Approved').length} {language === 'am' ? 'የጸደቁ' : 'Approved'}
            </span>
            <span className="mx-1.5">•</span>
            <span className="text-amber-700 font-medium">
              {performances.filter((p) => p.status === 'Submitted').length} {language === 'am' ? 'በግምገማ ላይ' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Process-Level Performance Breakdown */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'am'
                ? 'የ3ቱ የሥራ ሂደቶች አፈጻጸም ሁኔታ'
                : language === 'en'
                ? 'Work Processes Performance Summary'
                : 'የሥራ ሂደቶች አፈጻጸም | Work Processes Performance'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'am'
                ? 'በታክስ ኢንተለጀንስ፣ የታክስ ከፋዮች ትምህርት እና የታክስ መረጃ የተከፋፈለ'
                : 'Breakdown across TII, TES, and TI core processes'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('processes')}
            className="text-xs text-[#12345a] hover:underline font-semibold inline-flex items-center"
          >
            {language === 'am' ? 'ሁሉንም ቡድኖች እይ' : 'View all teams'}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processStats.map((item) => (
            <div
              key={item.process.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#12345a] text-white text-xs font-bold rounded">
                  {item.process.code}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {item.teamsCount} {language === 'am' ? 'ቡድኖች' : 'teams'}
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mt-2 line-clamp-1" title={item.process.name}>
                {item.process.name}
              </h4>
              <p className="text-xs text-slate-500 mb-3">{item.process.description}</p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">{language === 'am' ? 'አፈጻጸም' : 'Achievement'}:</span>
                  <span className="font-bold text-[#12345a]">
                    {item.percent > 0 ? `${item.percent.toFixed(1)}%` : 'N/A'}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      item.percent >= 90
                        ? 'bg-emerald-500'
                        : item.percent >= 70
                        ? 'bg-blue-500'
                        : item.percent > 0
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${Math.min(item.percent || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>{item.plansCount} {language === 'am' ? 'ዕቅዶች' : 'plans'}</span>
                  <span>
                    {language === 'am'
                      ? `ክንውን፡ ${item.actual} / ዕቅድ፡ ${item.target}`
                      : `${item.actual} / ${item.target}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Modules Quick Navigation (Exact match to app.py cards) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          {language === 'am'
            ? 'የስርዓቱ ክፍሎች'
            : language === 'en'
            ? 'System Modules'
            : 'System Modules | የስርዓቱ ክፍሎች'}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'am'
            ? 'ወደ ዋና ዋና የሥራ አስተዳደር ክፍሎች በቀጥታ ይሂዱ'
            : 'Direct navigation to system functional modules'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('plans')}
            className="flex items-center justify-between p-4 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded-xl shadow-xs transition-colors group text-left"
          >
            <div>
              <div className="text-xs text-amber-300 font-medium">Module 1</div>
              <div className="text-sm font-bold">Annual Plans / ዓመታዊ ዕቅድ</div>
              <div className="text-xs text-slate-300 mt-1">የበጀት ዓመት ዕቅዶች እና የዒላማ ዝርዝሮች</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('performance')}
            className="flex items-center justify-between p-4 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded-xl shadow-xs transition-colors group text-left"
          >
            <div>
              <div className="text-xs text-amber-300 font-medium">Module 2</div>
              <div className="text-sm font-bold">Monthly Performance / ወርሃዊ ክንውን</div>
              <div className="text-xs text-slate-300 mt-1">የወር ክንውን ምዝገባ፣ ማረጋገጫና ማጽደቅ</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="flex items-center justify-between p-4 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded-xl shadow-xs transition-colors group text-left"
          >
            <div>
              <div className="text-xs text-amber-300 font-medium">Module 3</div>
              <div className="text-sm font-bold">Reports / ሪፖርቶችና ማጠቃለያ</div>
              <div className="text-xs text-slate-300 mt-1">አፈጻጸም ማትሪክስ፣ ማጠቃለያ እና ኤክስፖርት</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Performance Submissions Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'am'
                ? 'የቅርብ ጊዜ የክንውን መዝገቦች'
                : language === 'en'
                ? 'Recent Performance Submissions'
                : 'የቅርብ ጊዜ ክንውን | Recent Performance Records'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'am'
                ? 'የተመዘገቡ፣ የተገመገሙና የጸደቁ ወርሃዊ ሪፖርቶች'
                : 'Latest submitted and approved monthly performance reports'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('performance')}
            className="text-xs text-[#12345a] hover:underline font-semibold inline-flex items-center"
          >
            {language === 'am' ? 'ሁሉንም እይ' : 'View all records'}
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-700">
              <tr>
                <th className="py-2.5 px-3">የበጀት ዓመት / Fiscal Year</th>
                <th className="py-2.5 px-3">ወር / Month</th>
                <th className="py-2.5 px-3">ዒላማ / Target</th>
                <th className="py-2.5 px-3">ክንውን / Actual</th>
                <th className="py-2.5 px-3">መቶኛ / Achievement</th>
                <th className="py-2.5 px-3">ሁኔታ / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPerformances.length > 0 ? (
                recentPerformances.map((perf) => {
                  const tgt = targets.find((t) => t.id === perf.target_id);
                  return (
                    <tr key={perf.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-medium text-slate-900">{perf.fiscal_year}</td>
                      <td className="py-2.5 px-3 text-slate-700">Month {perf.month}</td>
                      <td className="py-2.5 px-3 text-slate-600">{tgt?.target_value ?? '-'}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{perf.monthly_actual}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-semibold ${
                            perf.achievement_percent >= 100
                              ? 'text-emerald-600'
                              : perf.achievement_percent >= 80
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {perf.achievement_percent}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            perf.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : perf.status === 'Submitted'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : perf.status === 'Reviewed'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : perf.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {perf.status === 'Approved' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          <span>{perf.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 text-sm">
                    እስካሁን የተመዘገበ የክንውን መዝገብ የለም።
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
