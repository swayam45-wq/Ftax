// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export type VisaType = 'F1' | 'F2' | 'J1' | 'J2' | 'H1B' | 'OPT' | 'CPT' | 'OTHER';

export type DegreeType = 'BACHELORS' | 'MASTERS' | 'PHD' | 'CERTIFICATE' | 'OTHER';

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  passportCountry?: string;
  visaType?: VisaType;
  sevisId?: string;
  university: string;
  department?: string;
  degree?: DegreeType;
  programStartDate?: string;
  expectedGraduation?: string;
  hasSSN: boolean;
  hasITIN: boolean;
  completionPercentage: number;
}

// ─── Travel History ────────────────────────────────────────────────────────────

export interface TravelEntry {
  id: string;
  userId: string;
  departureDate: string;
  returnDate?: string;
  destination: string;
  reason?: string;
  daysOutside: number;
}

// ─── Residency ─────────────────────────────────────────────────────────────────

export type ResidencyStatus = 'NONRESIDENT_ALIEN' | 'RESIDENT_ALIEN' | 'DUAL_STATUS';

export interface ResidencyCheckResult {
  status: ResidencyStatus;
  statusLabel: string;
  reasoning: ResidencyReasoning;
  daysCount: DaysCountBreakdown;
  ruleApplied: string;
  taxYear: number;
}

export interface ResidencyReasoning {
  summary: string;
  steps: ResidencyStep[];
  plainEnglish: string;
}

export interface ResidencyStep {
  stepNumber: number;
  title: string;
  description: string;
  result: 'PASS' | 'FAIL' | 'INFO';
  value?: string | number;
}

export interface DaysCountBreakdown {
  currentYear: number;
  priorYear: number;
  twoYearsAgo: number;
  priorYearWeighted: number;
  twoYearsAgoWeighted: number;
  totalWeighted: number;
  threshold: number;
  meetsThreshold: boolean;
  exemptYears: number;
}

// ─── Tax Rules ─────────────────────────────────────────────────────────────────

export type RuleOperator = 'equals' | '<' | '<=' | '>' | '>=' | 'in' | 'not_in';

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: string | number | boolean | string[];
}

export interface TaxRule {
  ruleId: string;
  description: string;
  priority: number;
  conditions: RuleCondition[];
  result: Record<string, unknown>;
}

export interface TaxRuleSet {
  year: number;
  version: string;
  lastUpdated: string;
  rules: TaxRule[];
  constants: Record<string, number | string>;
}

// ─── API Response ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
