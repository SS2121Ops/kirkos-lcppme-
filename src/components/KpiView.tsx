import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KPI } from '../types';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Search,
  Check,
  FileCheck,
} from 'lucide-react';

export const KpiView: React.FC = () => {
  const {
    kpis,
    processes,
    teams,
    language,
    addKPI,
    updateKPI,
    deleteKPI,
    getProcessById,
    getTeamById,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterProcess, setFilterProcess] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [processId, setProcessId] = useState<number | ''>('');
  const [teamId, setTeamId] = useState<number | ''>('');
  const [measurementUnit, setMeasurementUnit] = useState('ቁጥር');
  const [measurementType, setMeasurementType] = useState<'Count' | 'Percentage' | 'Amount'>('Count');
  const [calculationMethod, setCalculationMethod] = useState('');
  const [tracksMonthly, setTracksMonthly] = useState(true);
  const [tracksCumulative, setTracksCumulative] = useState(true);
  const [evidenceRequired, setEvidenceRequired] = useState(true);
  const [sourceSheet, setSourceSheet] = useState('');

  const availableTeams = processId
    ? teams.filter((t) => t.process_id === Number(processId) && t.status === 'Active')
    : [];

  const handleCreateKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !processId) return;

    addKPI({
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      process_id: Number(processId),
      team_id: teamId ? Number(teamId) : null,
      measurement_unit: measurementUnit.trim(),
      measurement_type: measurementType,
      calculation_method: calculationMethod.trim() || undefined,
      tracks_monthly: tracksMonthly,
      tracks_cumulative: tracksCumulative,
      evidence_required: evidenceRequired,
      source_sheet: sourceSheet.trim() || undefined,
      status: 'Active',
    });

    setShowAddModal(false);
    setCode('');
    setName('');
    setDescription('');
    setCalculationMethod('');
    setSourceSheet('');
  };

  const filteredKpis = kpis.filter((k) => {
    if (filterProcess !== 'all' && String(k.process_id) !== filterProcess) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        k.code.toLowerCase().includes(q) ||
        k.name.toLowerCase().includes(q) ||
        (k.description && k.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
              <Target className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#12345a]">
              {language === 'am' ? 'የአፈጻጸም አመልካቾች (KPIs)' : language === 'en' ? 'KPI Indicators' : 'የአፈጻጸም አመልካቾች | Key Performance Indicators'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'am'
              ? 'የታክስ ስራ ሂደቶችና ቡድኖች መለኪያ መስፈርቶች እና የስሌት ስልቶች'
              : 'Institutional performance indicators catalog, formulas, and verification rules'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'am' ? 'አዲስ KPI መዝግብ' : 'Add KPI'}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="በKPI ኮድ ወይም ስም ፈልግ... / Search by code or title"
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            />
          </div>

          <div>
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
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKpis.map((kpi) => {
          const process = getProcessById(kpi.process_id);
          const team = getTeamById(kpi.team_id);

          return (
            <div
              key={kpi.id}
              className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-bold rounded-md">
                    {kpi.code}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      kpi.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {kpi.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2">
                  {kpi.name}
                </h3>
                {kpi.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{kpi.description}</p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'am' ? 'የሥራ ሂደት' : 'Process'}:</span>
                    <span className="font-semibold text-slate-800">{process?.code}</span>
                  </div>
                  {team && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === 'am' ? 'ቡድን' : 'Team'}:</span>
                      <span className="font-medium text-slate-800 line-clamp-1">{team.code}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'am' ? 'መለኪያ' : 'Unit'}:</span>
                    <span className="font-medium text-slate-800">
                      {kpi.measurement_unit} ({kpi.measurement_type})
                    </span>
                  </div>
                  {kpi.calculation_method && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">{language === 'am' ? 'ስሌት' : 'Method'}:</span>
                      <span className="font-medium text-slate-800 line-clamp-1">{kpi.calculation_method}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  {kpi.evidence_required && (
                    <span className="inline-flex items-center text-emerald-700" title="Evidence required">
                      <FileCheck className="w-3.5 h-3.5 mr-0.5" />
                      <span>ማስረጃ</span>
                    </span>
                  )}
                  {kpi.tracks_monthly && (
                    <span className="text-slate-600">ወርሃዊ</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Delete this KPI?')) deleteKPI(kpi.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Delete KPI"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add KPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#12345a] mb-1">
              {language === 'am' ? 'አዲስ KPI አመልካች መዝግብ' : 'Add New KPI Indicator'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'am'
                ? 'የመለኪያውን ኮድ፣ ስም፣ ሂደት እና የስሌት ሁኔታ ያስገቡ'
                : 'Define indicator measurement specifications and verification requirements'}
            </p>

            <form onSubmit={handleCreateKpi} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የKPI ኮድ / Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ለምሳሌ KPI-TII-04"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የመለኪያ ዓይነት / Type
                  </label>
                  <select
                    value={measurementType}
                    onChange={(e) => setMeasurementType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  >
                    <option value="Count">Count / በቁጥር</option>
                    <option value="Percentage">Percentage / በመቶኛ</option>
                    <option value="Amount">Amount / በገንዘብ (ብር)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የKPI ስም / Indicator Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="የአመልካቹ ስም"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የሥራ ሂደት / Process <span className="text-rose-500">*</span>
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
                    <option value="">-- ይምረጡ --</option>
                    {processes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} — {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ቡድን / Team (Optional)
                  </label>
                  <select
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : '')}
                    disabled={!processId}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  >
                    <option value="">-- ያለ ቡድን --</option>
                    {availableTeams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የመለኪያ መለኪያ / Unit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={measurementUnit}
                    onChange={(e) => setMeasurementUnit(e.target.value)}
                    placeholder="ቁጥር, ብር, %, ወዘተ"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የስሌት ስልት / Calculation Method
                  </label>
                  <input
                    type="text"
                    value={calculationMethod}
                    onChange={(e) => setCalculationMethod(e.target.value)}
                    placeholder="የስሌት ቀመር ወይም ድምር ዘዴ"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የመረጃ ምንጭ ሰነድ / Source Sheet
                </label>
                <input
                  type="text"
                  value={sourceSheet}
                  onChange={(e) => setSourceSheet(e.target.value)}
                  placeholder="ለምሳሌ Audit-Report.xlsx"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-700">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tracksMonthly}
                    onChange={(e) => setTracksMonthly(e.target.checked)}
                    className="rounded text-[#12345a]"
                  />
                  <span>ወርሃዊ ክትትል (Monthly)</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tracksCumulative}
                    onChange={(e) => setTracksCumulative(e.target.checked)}
                    className="rounded text-[#12345a]"
                  />
                  <span>ድምር ክትትል (Cumulative)</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evidenceRequired}
                    onChange={(e) => setEvidenceRequired(e.target.checked)}
                    className="rounded text-[#12345a]"
                  />
                  <span>ማስረጃ ግዴታ ነው (Evidence Required)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'am' ? 'ተው' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  {language === 'am' ? 'መዝግብ' : 'Save KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
