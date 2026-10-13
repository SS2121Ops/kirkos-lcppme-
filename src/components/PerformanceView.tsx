import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ETHIOPIAN_MONTHS, PerformanceStatus } from '../types';
import {
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Send,
  Eye,
  Check,
  XCircle,
} from 'lucide-react';

interface PerformanceViewProps {
  isFormOpenInitially?: boolean;
  onCloseInitialForm?: () => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  isFormOpenInitially = false,
  onCloseInitialForm,
}) => {
  const {
    performances,
    plans,
    targets,
    kpis,
    currentUser,
    language,
    addPerformance,
    deletePerformance,
    submitPerformance,
    reviewPerformance,
    approvePerformance,
    rejectPerformance,
    getTargetById,
    getKpiById,
    getPlanById,
    getUserById,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(isFormOpenInitially);
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form states
  const [selectedPlanId, setSelectedPlanId] = useState<number | ''>('');
  const [selectedTargetId, setSelectedTargetId] = useState<number | ''>('');
  const [month, setMonth] = useState<number>(1);
  const [fiscalYear, setFiscalYear] = useState<string>('2017 ዓ.ም.');
  const [monthlyActual, setMonthlyActual] = useState<number>(0);
  const [cumulativeActual, setCumulativeActual] = useState<number>(0);
  const [sourceSheet, setSourceSheet] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Review modal state
  const [reviewingPerfId, setReviewingPerfId] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewActionType, setReviewActionType] = useState<'review' | 'approve' | 'reject'>('approve');

  // Plan's targets
  const planTargets = selectedPlanId
    ? targets.filter((t) => t.plan_id === Number(selectedPlanId))
    : targets;

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedTargetId) {
      setFormError('ዒላማ መምረጥ ያስፈልጋል። / Please select a KPI Target.');
      return;
    }
    if (monthlyActual < 0) {
      setFormError('አፈጻጸም ከአሉታዊ መሆን የለበትም። / Actual performance cannot be negative.');
      return;
    }

    const target = getTargetById(Number(selectedTargetId));
    const targetPlan = target ? getPlanById(target.plan_id) : undefined;

    addPerformance({
      target_id: Number(selectedTargetId),
      monthly_actual: Number(monthlyActual),
      cumulative_actual: cumulativeActual ? Number(cumulativeActual) : Number(monthlyActual),
      performance_date: new Date().toISOString(),
      month: Number(month),
      fiscal_year: targetPlan?.fiscal_year || fiscalYear,
      comment: comment.trim() || undefined,
      source_sheet: sourceSheet.trim() || undefined,
      status: 'Draft',
      entered_by: currentUser.id,
    });

    setShowAddModal(false);
    setSelectedTargetId('');
    setMonthlyActual(0);
    setCumulativeActual(0);
    setComment('');
    setSourceSheet('');
    if (onCloseInitialForm) onCloseInitialForm();
  };

  const handlePerformReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingPerfId) return;

    if (reviewActionType === 'approve') {
      approvePerformance(reviewingPerfId, reviewComment);
    } else if (reviewActionType === 'review') {
      reviewPerformance(reviewingPerfId, reviewComment);
    } else if (reviewActionType === 'reject') {
      rejectPerformance(reviewingPerfId, reviewComment);
    }

    setReviewingPerfId(null);
    setReviewComment('');
  };

  // Distinct fiscal years
  const distinctYears = Array.from(new Set(performances.map((p) => p.fiscal_year)));

  // Filtered list
  const filteredList = performances.filter((p) => {
    if (filterMonth !== 'all' && String(p.month) !== filterMonth) return false;
    if (filterYear !== 'all' && p.fiscal_year !== filterYear) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#12345a]">
              {language === 'am' ? 'ወርሃዊ ክንውን' : language === 'en' ? 'Monthly Performance' : 'ወርሃዊ ክንውን | Monthly Performance'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'am'
              ? 'የታክስ ተገዥነት ክንውን ምዝገባ፣ ማረጋገጫ እና የማጽደቅ የሥራ ሂደት'
              : 'Tracking actual outputs, evidence documentation, and approval workflow'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-emerald-200" />
          <span>{language === 'am' ? 'ክንውን መዝግብ' : 'Record Performance'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በወር / By Month
            </label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም ወራት / All Months</option>
              {ETHIOPIAN_MONTHS.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  Month {m.id} - {m.nameAm} ({m.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              በበጀት ዓመት / By Fiscal Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
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
              በሁኔታ / By Workflow Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#12345a]"
            >
              <option value="all">ሁሉም ሁኔታዎች / All Statuses</option>
              <option value="Draft">Draft / ረቂቅ</option>
              <option value="Submitted">Submitted / የቀረበ</option>
              <option value="Reviewed">Reviewed / የተገመገመ</option>
              <option value="Approved">Approved / የጸደቀ</option>
              <option value="Rejected">Rejected / ውድቅ የተደረገ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Records Table - Core match to app.py /performance */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-[#12345a] text-sm sm:text-base">
            {language === 'am' ? 'የክንውን መዝገቦች' : 'Monthly Performance Records'} ({filteredList.length})
          </h3>
          <span className="text-xs text-slate-500">
            {language === 'am' ? 'የተመዘገቡ እና የጸደቁ የአፈጻጸም ዝርዝሮች' : 'Direct tracking & review approvals'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#eaf0f8] text-slate-800 text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Fiscal Year</th>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">KPI / Target</th>
                <th className="py-3 px-4">Target (ዒላማ)</th>
                <th className="py-3 px-4">Actual (ክንውን)</th>
                <th className="py-3 px-4">Achievement %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((record) => {
                  const target = getTargetById(record.target_id);
                  const kpi = target ? getKpiById(target.kpi_id) : undefined;
                  const monthObj = ETHIOPIAN_MONTHS.find((m) => m.id === record.month);
                  const enteredByUser = getUserById(record.entered_by);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#12345a]">
                        {record.fiscal_year}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span className="font-bold text-slate-800">{monthObj ? monthObj.nameAm : `Month ${record.month}`}</span>
                        <div className="text-[11px] text-slate-500">
                          {monthObj?.nameEn || `M${record.month}`}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1" title={kpi?.name}>
                          {kpi ? `${kpi.code}: ${kpi.name}` : `Target #${record.target_id}`}
                        </div>
                        {record.source_sheet && (
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <FileCheck2 className="w-3 h-3 text-emerald-600 inline" />
                            <span>{record.source_sheet}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {target ? `${target.target_value} ${kpi?.measurement_unit || ''}` : '-'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {record.monthly_actual} <span className="text-xs font-normal text-slate-500">{kpi?.measurement_unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                            record.achievement_percent >= 100
                              ? 'bg-emerald-100 text-emerald-800'
                              : record.achievement_percent >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {record.achievement_percent}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : record.status === 'Submitted'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : record.status === 'Reviewed'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : record.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {record.status === 'Approved' ? (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          <span>{record.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Submit button if Draft */}
                          {record.status === 'Draft' && (
                            <button
                              type="button"
                              onClick={() => submitPerformance(record.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-flex items-center space-x-1"
                              title="Submit for review"
                            >
                              <Send className="w-3 h-3" />
                              <span>{language === 'am' ? 'አቅርብ' : 'Submit'}</span>
                            </button>
                          )}

                          {/* Review / Approve modal button for managers / admins */}
                          {(record.status === 'Submitted' || record.status === 'Reviewed') && (
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingPerfId(record.id);
                                setReviewComment(record.review_comment || '');
                                setReviewActionType('approve');
                              }}
                              className="px-2 py-1 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded text-xs font-semibold inline-flex items-center space-x-1"
                              title="Review or Approve record"
                            >
                              <Check className="w-3 h-3" />
                              <span>{language === 'am' ? 'ገምግም/አጽድቅ' : 'Review'}</span>
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Delete this performance record?')) {
                                deletePerformance(record.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    {language === 'am' ? 'የአፈጻጸም መዝገብ የለም።' : 'No performance records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Performance */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-fadeIn">
            <h3 className="text-base font-bold text-[#12345a] mb-1">
              {language === 'am' ? 'ወርሃዊ ክንውን መመዝገቢያ' : 'Record Monthly Performance'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'am'
                ? 'የተከናወነውን ተጨባጭ ውጤት እና የማረጋገጫ መረጃ ያስገቡ'
                : 'Enter quantitative monthly actual output with evidence source'}
            </p>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ዕቅድ ምረጥ (አማራጭ ማጣሪያ) / Select Plan Filter
                </label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => {
                    setSelectedPlanId(e.target.value ? Number(e.target.value) : '');
                    setSelectedTargetId('');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                >
                  <option value="">-- ሁሉም ዕቅዶች / All Plans --</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fiscal_year} — {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የዒላማ ዝርዝር / Plan Target (KPI) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                >
                  <option value="">-- የKPI ዒላማ ይምረጡ / Select KPI Target --</option>
                  {planTargets.map((tgt) => {
                    const kpi = getKpiById(tgt.kpi_id);
                    const plan = getPlanById(tgt.plan_id);
                    return (
                      <option key={tgt.id} value={tgt.id}>
                        [{plan?.fiscal_year}] {kpi?.code} - {kpi?.name} (ዒላማ: {tgt.target_value} {kpi?.measurement_unit})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ወር / Month (1-12) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  >
                    {ETHIOPIAN_MONTHS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} - {m.nameAm} ({m.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የዚህ ወር እውነተኛ ክንውን / Monthly Actual <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={monthlyActual}
                    onChange={(e) => setMonthlyActual(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ድምር ክንውን / Cumulative Actual
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={cumulativeActual}
                    onChange={(e) => setCumulativeActual(Number(e.target.value))}
                    placeholder="ከሐምሌ/መስከረም ጀምሮ ያለው ድምር"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    የመረጃ ምንጭ ሰነድ / Source Sheet
                  </label>
                  <input
                    type="text"
                    value={sourceSheet}
                    onChange={(e) => setSourceSheet(e.target.value)}
                    placeholder="ለምሳሌ TII-Log.xlsx, ገፅ 14"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  አስተያየት / Comment & Evidence Note
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="የተከናወኑ ተግባራት አጭር ማብራሪያ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'am' ? 'ተው' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  {language === 'am' ? 'መዝግብ' : 'Record Actual'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review & Approve Modal */}
      {reviewingPerfId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-base font-bold text-[#12345a] mb-1">
              {language === 'am' ? 'የክንውን ግምገማና ውሳኔ' : 'Review & Approve Performance'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'am' ? 'የቀረበውን ሪፖርት መርምረው ውሳኔ ይስጡ' : 'Evaluate submitted actual output against legal target'}
            </p>

            <form onSubmit={handlePerformReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  ውሳኔ / Decision
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewActionType('approve')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      reviewActionType === 'approve'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ✓ አጽድቅ (Approve)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewActionType('review')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      reviewActionType === 'review'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ✎ ገምግም (Reviewed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewActionType('reject')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      reviewActionType === 'reject'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ✗ ውድቅ (Reject)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  የገምጋሚ / አጽዳቂ አስተያየት / Reviewer Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="የማጽደቂያ ወይም የማስተካከያ አስተያየት..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12345a]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingPerfId(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  {language === 'am' ? 'ተው' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#12345a] hover:bg-[#0f2c4d] text-white rounded-lg text-sm font-semibold shadow-xs"
                >
                  {language === 'am' ? 'ውሳኔውን መዝግብ' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
