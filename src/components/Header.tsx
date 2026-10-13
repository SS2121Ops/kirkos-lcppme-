import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, UserCheck, RotateCcw, Globe } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, setCurrentUser, users, language, setLanguage, resetToDefaults } = useApp();

  return (
    <header className="bg-[#12345a] text-white shadow-md border-b-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Org Title */}
          <div className="flex items-start sm:items-center space-x-3">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 flex-shrink-0 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Kirkos-LCPPME
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-400/30">
                  {language === 'en' ? 'Official System' : 'ይፋዊ ሥርዓት'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {language === 'am'
                  ? 'የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት'
                  : language === 'en'
                  ? 'Kirkos Sub-City Small Taxpayers Sub-Office'
                  : 'የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት | Kirkos Sub-City Small Taxpayers Sub-Office'}
              </p>
              <p className="text-xs text-slate-300">
                {language === 'am'
                  ? 'የሕግ ተገዥነት ዕቅድ፣ ክንውንና ግምገማ ሥርዓት'
                  : language === 'en'
                  ? 'Legal Compliance Planning, Monitoring & Evaluation System'
                  : 'የሕግ ተገዥነት ዕቅድ፣ ክንውንና ግምገማ ሥርዓት (LCPPME)'}
              </p>
            </div>
          </div>

          {/* Controls: Role switcher, Language, Reset */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <div className="flex items-center bg-slate-900/60 rounded-lg p-1 border border-white/10 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                type="button"
                onClick={() => setLanguage('bi')}
                className={`px-2 py-1 rounded transition-colors font-medium ${
                  language === 'bi' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
                title="Bilingual mode"
              >
                ሁለቱም / Bi
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-2 py-1 rounded transition-colors font-medium ${
                  language === 'am' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
                title="Amharic only"
              >
                አማርኛ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors font-medium ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
                title="English only"
              >
                English
              </button>
            </div>

            {/* Active User Switcher */}
            <div className="flex items-center bg-white/10 rounded-lg px-2.5 py-1.5 border border-white/15 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  {language === 'am' ? 'ተጠቃሚ / ሚና' : 'Active User & Role'}
                </span>
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const u = users.find((usr) => usr.id === Number(e.target.value));
                    if (u) setCurrentUser(u);
                  }}
                  className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer pr-2"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="text-slate-900 bg-white">
                      {u.full_name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset data */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm(language === 'am' ? 'የተቀመጡ መረጃዎችን ወደ መጀመሪያው ሁኔታ መመለስ ይፈልጋሉ?' : 'Reset demo data to initial defaults?')) {
                  resetToDefaults();
                }
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title={language === 'am' ? 'መረጃዎችን መልስ' : 'Reset initial data'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
