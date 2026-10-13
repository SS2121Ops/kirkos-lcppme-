# Kirkos-LCPPME (React Edition)
**Kirkos Legal Compliance Planning and Performance Monitoring System**  
የቂርቆስ ክ/ከተማ አነስተኛ ግብር ከፋዮች ቅርንጫፍ ጽ/ቤት የሕግ ተገዥነት ዕቅድ፣ ክንውንና ግምገማ ሥርዓት

A modern React & TypeScript web application rewritten from the original Python/Flask system for the Kirkos Sub-City Small Taxpayers Sub-Office.

## Features Preserved & Ported

- **Dashboard (ዋና ገጽ)**: Real-time statistical overview including Total Plans, Overall Achievement Percentage, Recorded KPIs, and Performance Submissions pipeline.
- **Annual Plans (ዓመታዊ ዕቅዶች)**: Full management of fiscal year plans (e.g., 2017 ዓ.ም.), objectives, assignment across the 3 Work Processes and 9 Subordinate Teams, and target allocations.
- **Plan Targets (የዕቅድ ዒላማዎች)**: Allocation of quantitative KPI targets across monthly, quarterly, and annual periods.
- **Monthly Performance (ወርሃዊ ክንውን)**: Entry and verification of monthly actual outputs with Ethiopian calendar months (መስከረም to ነሐሴ), automatic achievement % computation, source evidence documentation, and approval workflow (Submit -> Review -> Approve / Reject).
- **KPI Indicators (የአፈጻጸም አመልካቾች)**: Catalog of institutional compliance indicators with measurement units, calculation formulas, and evidence validation flags.
- **Work Processes & Teams (የሥራ ሂደቶችና ቡድኖች)**: Complete organizational mapping for:
  - **TII**: የታክስ ኢንተለጀንስ እና ምርመራ (3 Teams: TII-01, TII-02, TII-03)
  - **TES**: የታክስ ከፋዮች ትምህርት፣ ድጋፍና የሕግ ተገዥነት ስጋት ስራ አመራር (2 Teams: TES-01, TES-02)
  - **TI**: የታክስ መረጃ (4 Teams: TI-01, TI-02, TI-03, TI-04)
- **Reports & Matrix (ሪፖርቶችና ማትሪክስ)**: Executive matrix rollup, progress indicators, CSV/Excel export, and printable layout.
- **Bilingual Interface**: Full Amharic and English side-by-side or selectable language view.
- **Local Persistence**: Instant in-browser storage (`localStorage`) preserving records across sessions.

## Tech Stack

- **Runtime**: Node.js 22
- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite 6
