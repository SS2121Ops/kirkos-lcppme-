import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Network,
  Users,
  Building,
  Shield,
  Layers,
  CheckCircle2,
  Calendar,
  Target,
} from 'lucide-react';

export const ProcessesTeamsView: React.FC = () => {
  const { processes, teams, plans, kpis, language } = useApp();
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(processes[0]?.id ?? null);

  const selectedProcess = processes.find((p) => p.id === selectedProcessId);
  const subordinateTeams = teams.filter((t) => t.process_id === selectedProcessId);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-[#12345a] rounded-lg">
            <Network className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-[#12345a]">
            {language === 'am'
              ? 'የሥራ ሂደቶችና ቡድኖች መዋቅር'
              : language === 'en'
              ? 'Work Processes & Teams Structure'
              : 'የሥራ ሂደቶችና ቡድኖች | Work Processes & Teams'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {language === 'am'
            ? 'የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት 3ቱ ዋና የሥራ ሂደቶች እና 9ኙ ቡድኖች'
            : 'Kirkos Sub-City Small Taxpayers Sub-Office: 3 Core Work Processes and 9 Functional Teams'}
        </p>
      </div>

      {/* Process Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {processes.map((proc) => {
          const procTeams = teams.filter((t) => t.process_id === proc.id);
          const procPlans = plans.filter((p) => p.process_id === proc.id);
          const procKpis = kpis.filter((k) => k.process_id === proc.id);
          const isSelected = selectedProcessId === proc.id;

          return (
            <div
              key={proc.id}
              onClick={() => setSelectedProcessId(proc.id)}
              className={`cursor-pointer rounded-xl p-5 border transition-all ${
                isSelected
                  ? 'bg-blue-50/60 border-[#12345a] shadow-sm ring-1 ring-[#12345a]'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#12345a] text-white text-xs font-extrabold rounded">
                  {proc.code}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {proc.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mt-3 line-clamp-2">
                {proc.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{proc.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-3 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">{procTeams.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{language === 'am' ? 'ቡድኖች' : 'Teams'}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{procPlans.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase">{language === 'am' ? 'ዕቅዶች' : 'Plans'}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{procKpis.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase">KPIs</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Process Detail & Subordinate Teams */}
      {selectedProcess && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#12345a] text-white text-sm font-bold rounded-lg">
                {selectedProcess.code}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedProcess.name}
              </h3>
            </div>
            {selectedProcess.responsible_role && (
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {language === 'am' ? 'ኃላፊነት' : 'Responsible Role'}: <span className="text-[#12345a] font-bold">{selectedProcess.responsible_role}</span>
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#12345a] mb-3 flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-500" />
              <span>
                {language === 'am' ? 'በሥራ ሂደቱ ስር ያሉ ቡድኖች' : 'Subordinate Operational Teams'} ({subordinateTeams.length})
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subordinateTeams.map((team) => {
                const teamKpis = kpis.filter((k) => k.team_id === team.id);
                const teamPlans = plans.filter((p) => p.team_id === team.id);

                return (
                  <div
                    key={team.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {team.code}
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        {team.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm mt-2">
                      {team.name}
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">{team.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                      {team.team_leader && (
                        <div>
                          <span className="text-slate-500">{language === 'am' ? 'የቡድን መሪ' : 'Team Leader'}: </span>
                          <span className="font-semibold text-slate-900">{team.team_leader}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 pt-1 text-[11px] text-slate-500">
                        <span>{teamPlans.length} {language === 'am' ? 'ዕቅዶች' : 'plans'}</span>
                        <span>{teamKpis.length} {language === 'am' ? 'አመልካቾች' : 'KPIs'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
