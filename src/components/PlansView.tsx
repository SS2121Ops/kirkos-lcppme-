import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plan, PlanStatus } from '../types';
import {
  CalendarDays,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface PlansViewProps {
  isFormOpenInitially?: boolean;
  onCloseInitialForm?: () => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  isFormOpenInitially = false,
  onCloseInitialForm,
}) => {
  const {
    plans,
    processes,
    teams,
    kpis,
    targets,
    language,
    addPlan,
    updatePlan,
    deletePlan,
    addTarget,
    deleteTarget,
    getProcessById,
    getTeamById,
    getKpiById,
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(isFormOpenInitially);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // Filters
  const [filterFiscalYear, setFilterFiscalYear] = useState<string>('all');
  const [filterProcess, setFilterProcess] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states
  const [fiscalYear, setFiscalYear] = useState('2017 ዓ.ም.');
  const [title, setTitle] = useState('');
  const [processId, setProcessId] = useState<number | ''>('');
  const [teamId, setTeamId] = useState<number | ''>('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // New Target inside Plan state
  const [showAddTargetModal, setShowAddTargetModal] = useState(false);
  const [targetKpiId, setTargetKpiId] = useState<number | ''>('');
  const [targetPeriod, setTargetPeriod] = useState<'Monthly' | 'Quarterly' | 'Annual'>('Monthly');
  const [targetMonth, setTargetMonth] = useState<number>(1);
  const [targetQuarter, setTargetQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [targetValue, setTargetValue] = useState<number>(100);

  // Available teams for the selected process in the form
  const availableTeams = processId
    ? teams.filter((t) => t.process_id === Number(processId) && t.status === 'Active')
    : [];

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!fiscalYear.trim()) {
      setFormError('የበጀት ዓመት ማስገባት ያስፈልጋል። / Fiscal Year is required.');
      return;
    }
    if (!title.trim()) {
      setFormError('የዕቅድ ርዕስ ማስገባት ያስፈልጋል። / Plan Title is required.');
      return;
    }
    if (!processId) {
      setFormError('የሥራ ሂደት መምረጥ ያስፈልጋል። / Work Process is required.');
      return;
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setFormError('የመጨረሻ ቀን ከመጀመሪያ ቀን በፊት መሆን የለበትም። / End date cannot be before start date.');
      return;
    }

    const created = addPlan({
      fiscal_year: fiscalYear.trim(),
      title: title.trim(),
      objective: objective.trim() || undefined,
      process_id: Number(processId),
      team_id: teamId ? Number(teamId) : null,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      status: 'Draft',
    });

    setFormSuccess('ዕቅዱ በተሳካ ሁኔታ ተመዝግቧል። / Plan successfully registered!');
    setTitle('');
    setObjective('');
    setStartDate('');
    setEndDate('');
    setShowAddForm(false);
    setSelectedPlanId(created.id);
    if (onCloseInitialForm) onCloseInitialForm();
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !targetKpiId || targetValue <= 0) return;

    addTarget({
      plan_id: selectedPlanId,
      kpi_id: Number(targetKpiId),
      period: targetPeriod,
      month: targetPeriod === 'Monthly' ? targetMonth : undefined,
      quarter: targetPeriod === 'Quarterly' ? targetQuarter : undefined,
      target_value: Number(targetValue),
    });

    setShowAddTargetModal(false);
    setTargetKpiId('');
    setTargetValue(100);
  };

  // Distinct fiscal years for filtering
  const distinctYears = Array.from(new Set(plans.map((p) => p.fiscal_year)));

  // Filtered plans
  const filteredPlans = plans.filter((p) => {
    if (filterFiscalYear !== 'all' && p.fiscal_year !== filterFiscalYear) return false;
    if (filterProcess !== 'all' && String(p.process_id) !== filterProcess) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  const selectedPlanTargets = selectedPlan
    ? targets.filter((t) => t.plan_id === selectedPlan.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-[#12345a] rounded-lg">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#12345a]">
              {language === 'am' ? 'ዓመታዊ ዕቅዶች' : language === 'en' ? 'Annual Plans' : 'ዓመታዊ ዕቅዶች | Annual Plans'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'am'
              ? 'የበጀት ዓመት ግቦች፣ የሥራ ሂደት እና የቡድን ዓመታዊ የዕቅድ ዝርዝሮች'
              : 'Annual compliance plans, objectives, and quantitative KPI target allocations'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormError(null);
            setFormSuccess(null);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#12345a] hover:bg-[#0f2c4d] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>
            {showAddForm
              ? (language === 'am' ? 'ቅጹን ዝጋ' : 'Close Form')
              : (language === 'am' ? 'አዲስ ዕቅድ መዝግብ' : 'Add New Plan')}
          </span>
        </button>
      </div>

      {/* Messages */}
      {formSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}
      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Add Plan Form - Exact match to app.py /plans form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-xs border border-blue-200 p-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-[#12345a]">
              {language === 'am' ? 'አዲስ ዓመታዊ ዕቅድ መመዝገቢያ' : 'Register New Annual Plan'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'am'
                ? 'የበጀት ዓመት፣ የዕቅድ ርዕስ እና የሥራ ሂደት መረጃዎችን ያስገቡ'
                : 'Fill in required fiscal year, plan title, and assigned work process'}
            </p>
          </div>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fiscal Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የበጀት ዓመት / Fiscal Year <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  placeholder="ለምሳሌ 2017 ዓ.ም. / 2018 ዓ.ም."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የዕቅድ ርዕስ / Plan Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="የዕቅዱን ርዕስ ያስገቡ"
                  maxLength={255}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              {/* Process */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የሥራ ሂደት / Work Process <span className="text-rose-500">*</span>
                </label>
                <select
                  value={processId}
                  onChange={(e) => {
                    setProcessId(e.target.value ? Number(e.target.value) : '');
                    setTeamId('');
                  }}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                >
                  <option value="">-- የሥራ ሂደት ይምረጡ / Select Process --</option>
                  {processes
                    .filter((p) => p.status === 'Active')
                    .map((proc) => (
                      <option key={proc.id} value={proc.id}>
                        {proc.code} — {proc.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የቡድን ስም (አማራጭ) / Team (Optional)
                </label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : '')}
                  disabled={!processId}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                >
                  <option value="">-- ያለ ቡድን / All or General --</option>
                  {availableTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.code} — {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የመጀመሪያ ቀን / Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የመጨረሻ ቀን / End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ዋና ዓላማ / Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                placeholder="የዕቅዱን ዋና ዓላማ እና የሚጠበቁ ውጤቶች ይግለጹ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                {language === 'am' ? 'ተው' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
              >
                {language === 'am' ? 'ዕቅዱን አስቀምጥ' : 'Save Plan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በበጀት ዓመት / By Fiscal Year
            </label>
            <select
              value={filterFiscalYear}
              onChange={(e) => setFilterFiscalYear(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም ዓመታት / All Fiscal Years</option>
              {distinctYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በሥራ ሂደት / By Process
            </label>
            <select
              value={filterProcess}
              onChange={(e) => setFilterProcess(e.target.value)}
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

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በሁኔታ / By Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም ሁኔታዎች / All Statuses</option>
              <option value="Draft">Draft / ረቂቅ</option>
              <option value="Submitted">Submitted / የቀረበ</option>
              <option value="Approved">Approved / የጸደቀ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans Table - Preserves original layout and adds interactive details */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-[#12345a] text-sm sm:text-base">
            {language === 'am' ? 'የተመዘገቡ ዕቅዶች ዝርዝር' : 'Registered Annual Plans'} ({filteredPlans.length})
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'am' ? 'ዕቅዱን ጠቅ በማድረግ የዒላማ ዝርዝሮችን ይመልከቱ' : 'Click a plan to manage targets'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eaf0f8] text-slate-800 text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">የበጀት ዓመት / Fiscal Year</th>
                <th className="py-3 px-4">የዕቅድ ርዕስ / Plan Title</th>
                <th className="py-3 px-4">የሥራ ሂደት / Process</th>
                <th className="py-3 px-4">ቡድን / Team</th>
                <th className="py-3 px-4">ሁኔታ / Status</th>
                <th className="py-3 px-4 text-right">እርምጃ / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => {
                  const process = getProcessById(plan.process_id);
                  const team = getTeamById(plan.team_id);
                  const planTargetsCount = targets.filter((t) => t.plan_id === plan.id).length;
                  const isSelected = selectedPlanId === plan.id;

                  return (
                    <React.Fragment key={plan.id}>
                      <tr
                        onClick={() => setSelectedPlanId(isSelected ? null : plan.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-[#12345a]">
                          {plan.fiscal_year}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div>{plan.title}</div>
                          {plan.objective && (
                            <div className="text-xs text-slate-500 line-clamp-1">{plan.objective}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs font-medium text-slate-700">
                          <span className="font-bold text-[#12345a]">{process?.code}</span> —{' '}
                          {process?.name || plan.process_id}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          {team ? `${team.code} — ${team.name}` : <span className="text-slate-400">ያለ ቡድን (ጠቅላላ)</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              plan.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : plan.status === 'Submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {plan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={plan.status}
                              onChange={(e) => updatePlan(plan.id, { status: e.target.value as PlanStatus })}
                              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Submitted">Submitted</option>
                              <option value="Approved">Approved</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => setSelectedPlanId(isSelected ? null : plan.id)}
                              className="p-1 text-slate-500 hover:text-[#12345a]"
                              title="Toggle targets"
                            >
                              {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this plan?')) {
                                  deletePlan(plan.id);
                                  if (selectedPlanId === plan.id) setSelectedPlanId(null);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Delete plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Targets Section */}
                      {isSelected && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={6} className="p-4 sm:p-6 border-b border-slate-200">
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                                <div>
                                  <h4 className="font-bold text-[#12345a] text-sm flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    <span>
                                      {language === 'am' ? 'የዕቅዱ ዒላማዎች' : 'Plan Targets'} ({planTargetsCount})
                                    </span>
                                  </h4>
                                  <p className="text-xs text-slate-500">
                                    {language === 'am'
                                      ? 'በዕቅዱ ስር የተመደቡ የKPI ወርሃዊ/ሩብ ዓመታዊ ግቦች'
                                      : 'KPI targets allocated for this plan'}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowAddTargetModal(true)}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg shadow-xs self-start"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{language === 'am' ? 'አዲስ ዒላማ ጨምር' : 'Add Target'}</span>
                                </button>
                              </div>

                              {selectedPlanTargets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {selectedPlanTargets.map((target) => {
                                    const targetKpi = getKpiById(target.kpi_id);
                                    return (
                                      <div
                                        key={target.id}
                                        className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-2xs relative"
                                      >
                                        <div className="flex items-start justify-between">
                                          <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                            {targetKpi?.code || `KPI #${target.kpi_id}`}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => deleteTarget(target.id)}
                                            className="text-slate-400 hover:text-rose-600"
                                            title="Delete target"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <div className="font-semibold text-slate-900 mt-2 line-clamp-2">
                                          {targetKpi?.name || 'KPI'}
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
                                          <span>
                                            {target.period === 'Monthly' ? `Month ${target.month}` : target.quarter || target.period}
                                          </span>
                                          <span className="font-bold text-slate-900 text-sm">
                                            {target.target_value} <span className="font-normal text-slate-500 text-xs">{targetKpi?.measurement_unit}</span>
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 italic py-2">
                                  {language === 'am'
                                    ? 'እስካሁን ለዚህ ዕቅድ የተመደበ ዒላማ የለም። "አዲስ ዒላማ ጨምር" የሚለውን ይጫኑ።'
                                    : 'No targets allocated to this plan yet. Click "Add Target" to set monthly KPI goals.'}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    {language === 'am' ? 'እስካሁን የተመዘገበ ዕቅድ የለም።' : 'No annual plans registered yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Modal */}
      {showAddTargetModal && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-base font-bold text-[#12345a] mb-1">
              {language === 'am' ? 'ዒላማ ለዕቅዱ መድብ' : 'Allocate Target to Plan'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedPlan.title}</p>

            <form onSubmit={handleAddTarget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  KPI አመልካች / KPI Indicator <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetKpiId}
                  onChange={(e) => setTargetKpiId(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                >
                  <option value="">-- KPI ይምረጡ / Select KPI --</option>
                  {kpis.map((kpi) => (
                    <option key={kpi.id} value={kpi.id}>
                      {kpi.code} — {kpi.name} ({kpi.measurement_unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ወቅት / Period
                  </label>
                  <select
                    value={targetPeriod}
                    onChange={(e) => setTargetPeriod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  >
                    <option value="Monthly">Monthly / ወርሃዊ</option>
                    <option value="Quarterly">Quarterly / ሩብ ዓመት</option>
                    <option value="Annual">Annual / ዓመታዊ</option>
                  </select>
                </div>

                {targetPeriod === 'Monthly' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ወር (1-12) / Month
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={targetMonth}
                      onChange={(e) => setTargetMonth(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                    />
                  </div>
                )}

                {targetPeriod === 'Quarterly' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      ሩብ ዓመት / Quarter
                    </label>
                    <select
                      value={targetQuarter}
                      onChange={(e) => setTargetQuarter(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                    >
                      <option value="Q1">Q1 (1st Quarter)</option>
                      <option value="Q2">Q2 (2nd Quarter)</option>
                      <option value="Q3">Q3 (3rd Quarter)</option>
                      <option value="Q4">Q4 (4th Quarter)</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የዒላማ መጠን / Target Value <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={0.1}
                  step="any"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTargetModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'am' ? 'ተው' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold"
                >
                  {language === 'am' ? 'አስቀምጥ' : 'Save Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
