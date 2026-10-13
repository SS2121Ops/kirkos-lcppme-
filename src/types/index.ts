export interface WorkProcess {
  id: number;
  code: string;
  name: string;
  description?: string;
  responsible_role?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Team {
  id: number;
  code: string;
  name: string;
  description?: string;
  process_id: number;
  team_leader?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export type UserRole = 'admin' | 'manager' | 'team_leader' | 'staff';

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: UserRole;
  process_id?: number | null;
  team_id?: number | null;
  is_active_user: boolean;
  created_at: string;
}

export interface KPI {
  id: number;
  process_id: number;
  team_id?: number | null;
  code: string;
  name: string;
  description?: string;
  measurement_unit: string; // e.g. "ቁጥር" (Count), "ብር" (ETB), "%", "ጉዳዮች" (Cases)
  measurement_type: 'Count' | 'Percentage' | 'Amount';
  calculation_method?: string;
  tracks_monthly: boolean;
  tracks_cumulative: boolean;
  evidence_required: boolean;
  source_sheet?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export type PlanStatus = 'Draft' | 'Submitted' | 'Approved' | 'Closed';

export interface Plan {
  id: number;
  fiscal_year: string; // e.g. "2017 ዓ.ም."
  title: string;
  objective?: string;
  process_id: number;
  team_id?: number | null;
  start_date?: string;
  end_date?: string;
  status: PlanStatus;
  created_at: string;
}

export interface PlanTarget {
  id: number;
  plan_id: number;
  kpi_id: number;
  period: 'Monthly' | 'Quarterly' | 'Annual';
  month?: number; // 1 to 12
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  target_value: number;
  created_at: string;
}

export type PerformanceStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected';

export interface Performance {
  id: number;
  target_id: number;
  monthly_actual: number;
  cumulative_actual: number;
  achievement_percent: number;
  cumulative_achievement_percent: number;
  performance_date: string;
  month: number;
  fiscal_year: string;
  comment?: string;
  source_sheet?: string;
  status: PerformanceStatus;
  entered_by: number;
  submitted_by?: number | null;
  submitted_at?: string | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  approved_by?: number | null;
  approved_at?: string | null;
  review_comment?: string | null;
}

export const ETHIOPIAN_MONTHS = [
  { id: 1, nameAm: 'መስከረም', nameEn: 'Meskerem (Sep-Oct)', quarter: 'Q1' },
  { id: 2, nameAm: 'ጥቅምት', nameEn: 'Tikimt (Oct-Nov)', quarter: 'Q1' },
  { id: 3, nameAm: 'ህዳር', nameEn: 'Hidar (Nov-Dec)', quarter: 'Q1' },
  { id: 4, nameAm: 'ታህሳስ', nameEn: 'Tahsas (Dec-Jan)', quarter: 'Q2' },
  { id: 5, nameAm: 'ጥር', nameEn: 'Tir (Jan-Feb)', quarter: 'Q2' },
  { id: 6, nameAm: 'የካቲት', nameEn: 'Yekatit (Feb-Mar)', quarter: 'Q2' },
  { id: 7, nameAm: 'መጋቢት', nameEn: 'Megabit (Mar-Apr)', quarter: 'Q3' },
  { id: 8, nameAm: 'ሚያዝያ', nameEn: 'Miyazya (Apr-May)', quarter: 'Q3' },
  { id: 9, nameAm: 'ግንቦት', nameEn: 'Ginbot (May-Jun)', quarter: 'Q3' },
  { id: 10, nameAm: 'ሰኔ', nameEn: 'Sene (Jun-Jul)', quarter: 'Q4' },
  { id: 11, nameAm: 'ሐምሌ', nameEn: 'Hamle (Jul-Aug)', quarter: 'Q4' },
  { id: 12, nameAm: 'ነሐሴ', nameEn: 'Nehase (Aug-Sep)', quarter: 'Q4' },
];
