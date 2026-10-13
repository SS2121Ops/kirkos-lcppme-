import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ETHIOPIAN_MONTHS } from '../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Building2,
  TrendingUp,
  Target,
  FileCheck2,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    stats,
    processes,
    teams,
    plans,
    targets,
    performances,
    language,
    getProcessById,
    getTeamById,
    getKpiById,
  } = useApp();

  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('all');
  const [selectedProcessId, setSelectedProcessId] = useState<string>('all');

  const distinctYears = Array.from(new Set(plans.map((p) => p.fiscal_year)));

  // Matrix generation by Team
  const matrixData = teams
    .filter((t) => (selectedProcessId === 'all' ? true : String(t.process_id) === selectedProcessId))
    .map((team) => {
      const process = getProcessById(team.process_id);
      const teamPlans = plans.filter((p) => {
        if (p.team_id !== team.id) return false;
        if (selectedFiscalYear !== 'all' && p.fiscal_year !== selectedFiscalYear) return false;
        return true;
      });
      const teamPlanIds = teamPlans.map((p) => p.id);
      const teamTargets = targets.filter((t) => teamPlanIds.includes(t.plan_id));
      const teamTargetIds = teamTargets.map((t) => t.id);

      const teamApprovedPerfs = performances.filter(
        (p) => teamTargetIds.includes(p.target_id) && p.status === 'Approved'
      );

      const totalTarget = teamApprovedPerfs.reduce((acc, p) => {
        const tgt = targets.find((t) => t.id === p.target_id);
        return acc + (tgt?.target_value || 0);
      }, 0);

      const totalActual = teamApprovedPerfs.reduce((acc, p) => acc + (p.monthly_actual || 0), 0);
      const achievementPercent = totalTarget > 0 ? (totalActual / totalTarget) * 100 : 0;

      return {
        team,
        process,
        plansCount: teamPlans.length,
        targetsCount: teamTargets.length,
        approvedRecordsCount: teamApprovedPerfs.length,
        totalTarget,
        totalActual,
        achievementPercent,
      };
    });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Process Code',
      'Process Name',
      'Team Code',
      'Team Name',
      'Plans Count',
      'Approved Target',
      'Approved Actual',
      'Achievement %',
    ];

    const rows = matrixData.map((row) => [
      row.process?.code || '',
      `"${row.process?.name || ''}"`,
      row.team.code,
      `"${row.team.name}"`,
      row.plansCount,
      row.totalTarget,
      row.totalActual,
      `${row.achievementPercent.toFixed(1)}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kirkos_lcppme_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#12345a]">
              {language === 'am' ? 'ሪፖርቶች እና ግምገማ ማትሪክስ' : language === 'en' ? 'Reports & Matrix' : 'ሪፖርቶችና ማትሪክስ | Reports & Evaluation'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'am'
              ? 'የዕቅድ እና ክንውን ንጽጽር፣ የቡድኖች አፈጻጸም ደረጃ እና ወደ ኤክሴል/ህትመት ማውጫ'
              : 'Performance rollup, comparative matrices, Excel/CSV export, and print reports'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#12345a] hover:bg-[#0f2c4d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{language === 'am' ? 'CSV / ኤክሴል አውርድ' : 'Export CSV'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{language === 'am' ? 'አትም' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Exact match to app.py /reports view */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {language === 'am' ? 'ጠቅላላ ዕቅዶች' : 'Total Plans'}
          </div>
          <div className="text-2xl font-extrabold text-[#12345a]">{stats.totalPlans}</div>
          <div className="text-xs text-slate-500 mt-1">
            {language === 'am' ? 'በሲስተሙ የተመዘገቡ አመታዊ ዕቅዶች' : 'Total annual plans in system'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {language === 'am' ? 'ጠቅላላ KPIዎች' : 'Total KPIs'}
          </div>
          <div className="text-2xl font-extrabold text-purple-700">{stats.totalKpis}</div>
          <div className="text-xs text-slate-500 mt-1">
            {language === 'am' ? 'የተመዘገቡ የአፈጻጸም መለኪያዎች' : 'Institutional indicators catalog'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {language === 'am' ? 'ጠቅላላ የክንውን መዝገቦች' : 'Total Performance Records'}
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats.totalPerformances}</div>
          <div className="text-xs text-slate-500 mt-1">
            {language === 'am' ? 'ወርሃዊ የክንውን መዝገቦች ድምር' : 'Recorded monthly performance submissions'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በበጀት ዓመት አጣራ / Fiscal Year Filter
            </label>
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም የበጀት ዓመታት / All Fiscal Years</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በሥራ ሂደት አጣራ / Process Filter
            </label>
            <select
              value={selectedProcessId}
              onChange={(e) => setSelectedProcessId(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም የሥራ ሂደቶች / All Processes</option>
              {processes.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team Matrix Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-[#12345a] text-sm sm:text-base">
            {language === 'am' ? 'የቡድኖች አፈጻጸም ንጽጽር ማትሪክስ' : 'Team Performance Comparison Matrix'}
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'am' ? 'የጸደቁ ክንውኖች ብቻ የተካተቱበት' : 'Based on approved actuals'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eaf0f8] text-slate-800 text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ሂደት / Process</th>
                <th className="py-3 px-4">ቡድን / Team</th>
                <th className="py-3 px-4">ዕቅዶች / Plans</th>
                <th className="py-3 px-4">የጸደቀ ዒላማ / Target</th>
                <th className="py-3 px-4">የጸደቀ ክንውን / Actual</th>
                <th className="py-3 px-4">አፈጻጸም / Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixData.map((row) => (
                <tr key={row.team.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 text-xs font-bold text-[#12345a]">
                    {row.process?.code}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-900">
                    <div>{row.team.name}</div>
                    <div className="text-[11px] text-slate-400">{row.team.code}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-700">{row.plansCount}</td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-600">{row.totalTarget}</td>
                  <td className="py-3 px-4 text-xs font-bold text-slate-900">{row.totalActual}</td>
                  <td className="py-3 px-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            row.achievementPercent >= 90
                              ? 'bg-emerald-500'
                              : row.achievementPercent >= 70
                              ? 'bg-blue-500'
                              : row.achievementPercent > 0
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${Math.min(row.achievementPercent || 0, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">
                        {row.achievementPercent > 0 ? `${row.achievementPercent.toFixed(1)}%` : '0.0%'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
