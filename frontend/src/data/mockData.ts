// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ProfileKey = 'priya' | 'ramesh' | 'sme';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Severity = 'critical' | 'moderate' | 'minor';
export type ScenarioKey = 'normal' | 'inflation' | 'ratecut';

export interface WealthLeak {
  id: number;
  severity: Severity;
  icon: string;
  title: string;
  desc: string;
  action: string;
}

export interface LifeEvent {
  type: string;
  likelihood: number;
  readiness: number;
  gap: string;
  loan: string;
}

export interface UserProfile {
  name: string;
  age: number | null;
  initials: string;
  type: string;
  income: string;
  savings: string;
  goals: number;
  risk: string;
  immuneScore: number;
  wealthHealth: number;
  securityHealth: number;
  resilience: number;
  stressIndex: number;
  riskLevel: RiskLevel;
  leaks: WealthLeak[];
  event: LifeEvent;
  portfolio: string;
  persona: string;
}

export interface ScenarioRecommendation {
  icon: string;
  title: string;
  desc: string;
  cta: string;
}

export interface Scenario {
  label: string;
  color: string;
  bg: string;
  inflation: string;
  rbi: string;
  equity: string;
  recs: ScenarioRecommendation[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  bullets?: string[];
  disclaimer?: boolean;
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────

export const PROFILES: Record<ProfileKey, UserProfile> = {
  priya: {
    name: 'Priya Sharma',
    age: 26,
    initials: 'PS',
    type: 'Young Professional',
    income: '₹85,000',
    savings: '12%',
    goals: 2,
    risk: 'Moderate',
    immuneScore: 73,
    wealthHealth: 68,
    securityHealth: 81,
    resilience: 62,
    stressIndex: 32,
    riskLevel: 'Low',
    leaks: [
      {
        id: 1,
        severity: 'critical',
        icon: '💸',
        title: 'Idle Savings Detected',
        desc: '₹45,000 sitting in zero-interest account',
        action: 'Move to Liquid Fund',
      },
      {
        id: 2,
        severity: 'moderate',
        icon: '📋',
        title: 'Subscription Overlap',
        desc: '3 streaming services — save ₹899/month',
        action: 'Review Subscriptions',
      },
      {
        id: 3,
        severity: 'minor',
        icon: '🏦',
        title: 'Missed Tax Saving',
        desc: '₹15,000 80C limit unused this year',
        action: 'Start ELSS SIP',
      },
    ],
    event: {
      type: 'Home Purchase',
      likelihood: 78,
      readiness: 54,
      gap: '₹3.2L',
      loan: '₹42L',
    },
    portfolio: '₹1.2L in FD, ₹18K in MF',
    persona: 'Impulse Spender, turning corner',
  },

  ramesh: {
    name: 'Ramesh Iyer',
    age: 45,
    initials: 'RI',
    type: 'Mid-Career Family',
    income: '₹1,40,000',
    savings: '22%',
    goals: 4,
    risk: 'Conservative',
    immuneScore: 61,
    wealthHealth: 55,
    securityHealth: 70,
    resilience: 58,
    stressIndex: 54,
    riskLevel: 'Medium',
    leaks: [
      {
        id: 1,
        severity: 'critical',
        icon: '📈',
        title: 'Under-Invested Savings',
        desc: '₹2.1L idle — opportunity cost ₹18K/yr',
        action: 'Start SIP Now',
      },
      {
        id: 2,
        severity: 'moderate',
        icon: '🛡️',
        title: 'Insurance Gap',
        desc: 'Term cover insufficient for family size',
        action: 'Review Coverage',
      },
      {
        id: 3,
        severity: 'minor',
        icon: '💳',
        title: 'High EMI Ratio',
        desc: 'EMIs at 42% of income — above safe zone',
        action: 'Prepay Strategy',
      },
    ],
    event: {
      type: 'Child Education',
      likelihood: 91,
      readiness: 67,
      gap: '₹8.5L',
      loan: '₹25L',
    },
    portfolio: '₹8.4L in FD, ₹1.2L in LIC',
    persona: 'Anxious Saver, under-invested',
  },

  sme: {
    name: 'Kavita & Sons',
    age: null,
    initials: 'KS',
    type: 'SME Business',
    income: '₹3.2L rev',
    savings: '18%',
    goals: 3,
    risk: 'High',
    immuneScore: 58,
    wealthHealth: 52,
    securityHealth: 66,
    resilience: 56,
    stressIndex: 61,
    riskLevel: 'High',
    leaks: [
      {
        id: 1,
        severity: 'critical',
        icon: '💰',
        title: 'Surplus Sitting Idle',
        desc: '₹4.8L business surplus — 0% return',
        action: 'Park in Sweep FD',
      },
      {
        id: 2,
        severity: 'moderate',
        icon: '⚠️',
        title: 'Cash Flow Volatility',
        desc: '3 months irregular salary credits detected',
        action: 'Set Cash Buffer',
      },
      {
        id: 3,
        severity: 'minor',
        icon: '📊',
        title: 'No Business Insurance',
        desc: 'Key-person risk unprotected',
        action: 'Get Quote',
      },
    ],
    event: {
      type: 'Business Expansion',
      likelihood: 65,
      readiness: 41,
      gap: '₹12L',
      loan: '₹60L',
    },
    portfolio: '₹4.8L in Current A/C, ₹80K MF',
    persona: 'Cash flow volatile, surplus idle',
  },
};

// ─── SCENARIOS ────────────────────────────────────────────────────────────────

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  normal: {
    label: 'Normal',
    color: '#16A34A',
    bg: '#F0FDF4',
    inflation: '5.1%',
    rbi: '6.5%',
    equity: 'Bullish',
    recs: [
      {
        icon: '📈',
        title: 'Continue your SIP',
        desc: 'Markets stable — stay the course with ₹5,000/month SIP',
        cta: 'Manage SIP',
      },
      {
        icon: '🏦',
        title: 'FD rates attractive',
        desc: 'Lock ₹30,000 in 1-year FD at 7.2% before rate changes',
        cta: 'Book FD',
      },
      {
        icon: '🛡️',
        title: 'Review insurance',
        desc: 'Low-inflation window — best time to review term cover',
        cta: 'Check Coverage',
      },
    ],
  },

  inflation: {
    label: 'High Inflation',
    color: '#D97706',
    bg: '#FFFBEB',
    inflation: '7.8%',
    rbi: '6.75%',
    equity: 'Cautious',
    recs: [
      {
        icon: '💧',
        title: 'Shift to Liquid Funds',
        desc: 'Move ₹20,000 from FD to liquid fund to beat inflation',
        cta: 'Act Now',
      },
      {
        icon: '🥇',
        title: 'Gold allocation',
        desc: 'Add 10% gold ETF as inflation hedge — ₹8,500 suggested',
        cta: 'Buy Gold ETF',
      },
      {
        icon: '✂️',
        title: 'Trim discretionary',
        desc: 'Cut non-essential spending by ₹3,000/month this quarter',
        cta: 'Review Budget',
      },
    ],
  },

  ratecut: {
    label: 'Rate Cut',
    color: '#4338CA',
    bg: '#EEF2FF',
    inflation: '4.2%',
    rbi: '5.75%',
    equity: 'Strong Bull',
    recs: [
      {
        icon: '📊',
        title: 'Increase equity SIP',
        desc: 'Rate cuts drive rally — increase SIP to ₹8,000/month',
        cta: 'Increase SIP',
      },
      {
        icon: '🏠',
        title: 'Home loan window',
        desc: 'Rates dropping — best time to apply for ₹40L loan',
        cta: 'Check Eligibility',
      },
      {
        icon: '🔄',
        title: 'Refinance EMIs',
        desc: 'Renegotiate existing loans — save ₹2,100/month',
        cta: 'Refinance Now',
      },
    ],
  },
};

// ─── INITIAL CHAT MESSAGES ────────────────────────────────────────────────────

export const INITIAL_CHAT: ChatMessage[] = [
  { role: 'user', text: 'Should I start a SIP right now?' },
  {
    role: 'ai',
    text: 'Based on your profile, yes — this is a good time to start.',
    bullets: [
      'Start ₹3,000/month in a Flexi-cap fund',
      'Add ₹2,000/month in a Liquid fund for emergencies',
      'Review after 3 months — increase by ₹500 each quarter',
    ],
    disclaimer: true,
  },
  { role: 'user', text: 'Am I safe from fraud right now?' },
  {
    role: 'ai',
    text: 'Your security health is 81/100 — above average.',
    bullets: [
      'No suspicious sessions in last 7 days ✓',
      'Device trust: Verified ✓',
      'Stress Index: Low — thresholds are normal ✓',
    ],
    disclaimer: false,
  },
];

// ─── AUDIT TIMELINE ───────────────────────────────────────────────────────────

export const AUDIT_TIMELINE = [
  { label: 'Login', time: '11:42 PM', status: 'normal' as const },
  { label: 'Navigate', time: '11:43 PM', status: 'normal' as const },
  { label: 'Amount\nEntered', time: '11:44 PM', status: 'normal' as const },
  { label: 'Paste\nDetected', time: '11:44 PM', status: 'flagged' as const },
  { label: 'Hover\n8.3s', time: '11:45 PM', status: 'flagged' as const },
  { label: 'Txn Held', time: '11:45 PM', status: 'held' as const },
];

export const AUDIT_SIGNALS = [
  { key: 'paste_detected', value: 'TRUE ⚠️', flagged: true },
  { key: 'hover_duration', value: '8.3s (threshold: 3s)', flagged: true },
  { key: 'risk_score', value: '74 / 100', flagged: true },
  { key: 'fraud_persona', value: 'Social Engineering', flagged: true },
  { key: 'stress_index', value: '32 / 100 (Low)', flagged: false },
  { key: 'z_score_deviation', value: '2.8σ above baseline', flagged: true },
];
