/**
 * SecureWealth Twin — API client.
 *
 * Drop this file in at:
 *   frontend/src/data/api.ts
 *
 * It intentionally re-exports the same shapes as mockData.ts so you can
 * migrate screen-by-screen by changing ONE import line per file:
 *
 *   // before
 *   import { PROFILES } from '../../data/mockData';
 *
 *   // after
 *   import { fetchProfiles } from '../../data/api';
 *   const PROFILES = await fetchProfiles();
 *
 * No other frontend code needs to change. The TypeScript types in mockData.ts
 * are re-exported here so existing code continues to type-check.
 */

import type {
  ChatMessage,
  LifeEvent,
  ProfileKey,
  Scenario,
  ScenarioKey,
  UserProfile,
  WealthLeak,
} from './mockData';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Uses Vite env var. Falls back to localhost so demos work out of the box.
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  'http://localhost:8000';

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`API ${path} ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  sessionToken: string;
  otpSent: boolean;
  maskedMobile: string;
}
export interface OtpVerifyResponse {
  authToken: string;
  profileKey: ProfileKey;
}

export const login = (mobile: string, password: string) =>
  request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ mobile, password }),
  });

export const verifyOtp = (sessionToken: string, otp: string) =>
  request<OtpVerifyResponse>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ sessionToken, otp }),
  });

// ─── PROFILES / DASHBOARD ─────────────────────────────────────────────────────

export const fetchProfiles = () =>
  request<Record<ProfileKey, UserProfile>>('/profiles');

export const fetchProfile = (key: ProfileKey) =>
  request<UserProfile>(`/profiles/${key}`);

export const fetchScenarios = () =>
  request<Record<ScenarioKey, Scenario>>('/scenarios');

export const fetchScenario = (key: ScenarioKey) =>
  request<Scenario>(`/scenarios/${key}`);

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────

export const fetchLeaks = (key: ProfileKey) =>
  request<WealthLeak[]>(`/insights/${key}/leaks`);

export const fetchLifeEvent = (key: ProfileKey) =>
  request<LifeEvent>(`/insights/${key}/life-event`);

export interface DashboardSummary {
  immuneScore: number;
  wealthHealth: number;
  securityHealth: number;
  resilience: number;
  stressIndex: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  portfolio: string;
  persona: string;
}
export const fetchDashboardSummary = (key: ProfileKey) =>
  request<DashboardSummary>(`/insights/${key}/summary`);

// ─── SECURITY ─────────────────────────────────────────────────────────────────

export interface AuditTimelineNode {
  label: string;
  time: string;
  status: 'normal' | 'flagged' | 'held';
}
export interface AuditSignal {
  key: string;
  value: string;
  flagged: boolean;
}
export interface SecuritySummary {
  riskLevel: 'Low' | 'Medium' | 'High';
  stressIndex: number;
  securityHealth: number;
}

export const fetchSecuritySummary = (key: ProfileKey) =>
  request<SecuritySummary>(`/security/${key}`);

export const fetchAuditTimeline = () =>
  request<AuditTimelineNode[]>('/security/audit/timeline');

export const fetchAuditSignals = () =>
  request<AuditSignal[]>('/security/audit/signals');

// ─── TRANSACTIONS + FRAUD ─────────────────────────────────────────────────────

export type FraudDecision = 'ALLOW' | 'WARN' | 'BLOCK';

export interface TransactionRequest {
  profileKey: ProfileKey;
  amount: number;
  recipient: string;
  recipientIsNew?: boolean;
  deviceId?: string;
  deviceIsNew?: boolean;
  pasteDetected?: boolean;
  hoverDurationSec?: number;
  location?: string;
  note?: string;
}

export interface FraudEvaluation {
  score: number;
  decision: FraudDecision;
  reasons: string[];
  incidentId: string | null;
}

export interface Transaction {
  id: string;
  profileKey: ProfileKey;
  amount: number;
  recipient: string;
  timestamp: string;
  status: 'completed' | 'pending_review' | 'blocked' | 'cancelled';
  decision: FraudDecision;
  riskScore: number;
  reasons: string[];
  incidentId: string | null;
}

/** Preview the risk decision WITHOUT persisting — safe to call on every keystroke. */
export const evaluateTransaction = (body: TransactionRequest) =>
  request<FraudEvaluation>('/transactions/evaluate', {
    method: 'POST',
    body: JSON.stringify(body),
  });

/** Commit the transaction. Opens an incident if decision is WARN or BLOCK. */
export const submitTransaction = (body: TransactionRequest) =>
  request<{
    transaction: Transaction;
    evaluation: FraudEvaluation;
    incident: IncidentDetail | null;
  }>('/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const fetchTransactions = (profileKey?: ProfileKey) =>
  request<{ items: Transaction[]; total: number }>(
    `/transactions${profileKey ? `?profileKey=${profileKey}` : ''}`,
  );

// ─── INCIDENTS ────────────────────────────────────────────────────────────────

export interface IncidentSummary {
  incidentId: string;
  profileKey: ProfileKey;
  userName: string;
  amount: number;
  timestamp: string;
  riskScore: number;
  decision: FraudDecision;
  fraudPersona: string;
  status: 'open' | 'resolved' | 'escalated';
}
export interface IncidentDetail extends IncidentSummary {
  timeline: AuditTimelineNode[];
  signals: AuditSignal[];
  reasons: string[];
}

export const fetchIncidents = () => request<IncidentSummary[]>('/incidents');
export const fetchIncident = (id: string) =>
  request<IncidentDetail>(`/incidents/${id}`);
export const resolveIncident = (
  id: string,
  action: 'resolve' | 'escalate' | 'dismiss' = 'resolve',
  notes?: string,
) =>
  request<{ incidentId: string; status: 'open' | 'resolved' | 'escalated' }>(
    `/incidents/${id}/resolve`,
    { method: 'POST', body: JSON.stringify({ action, notes }) },
  );

// ─── GUARDIANS ────────────────────────────────────────────────────────────────

export interface Guardian {
  guardianId: string;
  profileKey: ProfileKey;
  name: string;
  phone: string;
  relationship: string;
  status: 'pending' | 'active' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export const addGuardian = (body: {
  profileKey: ProfileKey;
  name: string;
  phone: string;
  relationship: string;
  consent: boolean;
}) =>
  request<Guardian>('/guardians', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const fetchGuardians = (key: ProfileKey) =>
  request<Guardian[]>(`/guardians/${key}`);

export const revokeGuardian = (id: string) =>
  request<Guardian>(`/guardians/${id}`, { method: 'DELETE' });

// ─── CHAT ─────────────────────────────────────────────────────────────────────

export const fetchInitialChat = () => request<ChatMessage[]>('/chat/initial');

export const fetchChatHistory = (key: ProfileKey) =>
  request<ChatMessage[]>(`/chat/${key}`);

export const sendChatMessage = (profileKey: ProfileKey, message: string) =>
  request<{ reply: ChatMessage; history: ChatMessage[] }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ profileKey, message }),
  });

// ─── SYSTEM AUDIT LOG ─────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  profileKey: ProfileKey | null;
  event: string;
  details: Record<string, unknown>;
}

export const fetchAuditLog = (profileKey?: ProfileKey, limit = 100) =>
  request<{ items: AuditLogEntry[]; total: number }>(
    `/audit-log?${profileKey ? `profileKey=${profileKey}&` : ''}limit=${limit}`,
  );

// ─── INTELLIGENCE LAYER ──────────────────────────────────────────────────────

export interface FinancialPulse {
  score: number;
  previousScore: number;
  delta: number;
  trend: 'up' | 'down' | 'flat';
  label: string;
  headline: string;
  breakdown: { label: string; value: number; color: string }[];
}

export interface AffordabilityResponse {
  monthlyIncome: number;
  committedExpenses: number;
  goalAllocation: number;
  safeToSpend: number;
  status: 'safe' | 'stretch' | 'risky';
  narrative: string;
  checkedAmount?: number | null;
  canAfford?: boolean | null;
  afterPurchase?: number | null;
}

export interface PeerBenchmark {
  profileKey: ProfileKey;
  cohort: string;
  yourScore: number;
  cohortAverage: number;
  percentile: number;
  narrative: string;
  compareTo: { metric: string; you: number; peers: number; better: boolean }[];
}

export interface Recommendation {
  id: number;
  severity: 'critical' | 'moderate' | 'minor';
  icon: string;
  title: string;
  desc: string;
  action: string;
  impact: string;
  rationale: string;
}

export interface TransactionNarrative {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  timestamp: string;
  narrative: string;
  tag?: string | null;
  emoji: string;
}

export interface TrustCheckResponse {
  status: 'known' | 'new' | 'flagged';
  label: string;
  color: 'green' | 'yellow' | 'red';
  pastCount: number;
  lastSeen?: string | null;
  note: string;
}

export const fetchFinancialPulse = (key: ProfileKey) =>
  request<FinancialPulse>(`/intelligence/${key}/financial-pulse`);

export const fetchAffordability = (key: ProfileKey, amount?: number) =>
  request<AffordabilityResponse>(
    `/intelligence/${key}/affordability${amount !== undefined ? `?amount=${amount}` : ''}`,
  );

export const fetchPeerBenchmark = (key: ProfileKey) =>
  request<PeerBenchmark>(`/intelligence/${key}/peer-benchmark`);

export const fetchTopRecommendation = (key: ProfileKey) =>
  request<Recommendation>(`/intelligence/${key}/top-recommendation`);

export const fetchNarratedTransactions = (key: ProfileKey, limit = 12) =>
  request<{ items: TransactionNarrative[]; total: number }>(
    `/intelligence/${key}/transactions?limit=${limit}`,
  );

export const trustCheck = (profileKey: ProfileKey, recipient: string) =>
  request<TrustCheckResponse>('/intelligence/trust-check', {
    method: 'POST',
    body: JSON.stringify({ profileKey, recipient }),
  });

// ─── SECURITY ADDITIONS (Session DNA + Location Guard) ──────────────────────

export interface SessionDNA {
  deviceId: string;
  deviceLabel: string;
  trusted: boolean;
  ipMasked: string;
  network: string;
  lastSeen: string;
  location: string;
  biometric: 'fingerprint' | 'face' | 'none';
  behaviorScore: number;
  signals: AuditSignal[];
}

export interface LocationGuard {
  homeCity: string;
  currentCity: string;
  currentCountry: string;
  safe: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  travelMode: boolean;
  lastLocationChange: string;
  narrative: string;
}

export const fetchSessionDNA = (key: ProfileKey) =>
  request<SessionDNA>(`/security/${key}/session-dna`);

export const fetchLocationGuard = (key: ProfileKey) =>
  request<LocationGuard>(`/security/${key}/location`);

export const toggleTravelMode = (key: ProfileKey) =>
  request<LocationGuard>(`/security/${key}/location/travel-mode`, { method: 'POST' });

// ─── EXTRAS (KYC, notifications, compliance, help) ──────────────────────────

export interface KycStatus {
  profileKey: ProfileKey;
  status: 'verified' | 'pending' | 'action_required';
  level: 'Full KYC' | 'Min KYC' | 'Video KYC';
  panLinked: boolean;
  aadhaarLinked: boolean;
  lastVerified: string;
  expiresOn: string;
  documents: { name: string; status: string; date: string }[];
}

export interface NotificationItem {
  id: string;
  type: 'security' | 'insight' | 'transaction' | 'guardian' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
}

export interface ComplianceDoc {
  id: string;
  title: string;
  category: 'regulation' | 'policy' | 'statement' | 'report';
  issuedBy: string;
  date: string;
  fileSize: string;
  summary: string;
}

export interface HelpFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const fetchKyc = (key: ProfileKey) =>
  request<KycStatus>(`/extras/${key}/kyc`);

export const fetchNotifications = (key: ProfileKey) =>
  request<NotificationItem[]>(`/extras/${key}/notifications`);

export const markNotificationRead = (key: ProfileKey, id: string) =>
  request<NotificationItem>(`/extras/${key}/notifications/${id}/read`, {
    method: 'POST',
  });

export const fetchCompliance = () =>
  request<ComplianceDoc[]>('/extras/compliance');

export const fetchHelp = () => request<HelpFaq[]>('/extras/help');
