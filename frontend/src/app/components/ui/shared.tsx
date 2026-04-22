import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

// ─── PILL ─────────────────────────────────────────────────────────────────────
interface PillProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  outline?: boolean;
  className?: string;
}

export function Pill({ children, color = '#4338CA', bg, outline, className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${className}`}
      style={{
        background: outline ? 'transparent' : bg || `${color}18`,
        color,
        border: outline ? `1.5px solid ${color}` : 'none',
      }}
    >
      {children}
    </span>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// ─── BACK ARROW ───────────────────────────────────────────────────────────────
interface BackArrowProps {
  to?: string;
  onClick?: () => void;
}

export function BackArrow({ to, onClick }: BackArrowProps) {
  const navigate = useNavigate();
  const handleClick = onClick || (() => to ? navigate(to) : navigate(-1));
  return (
    <button
      onClick={handleClick}
      className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
    >
      <ArrowLeft className="w-5 h-5 text-gray-800" />
    </button>
  );
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
export function StatusBar() {
  return (
    <div className="h-11 bg-white flex items-center justify-between px-4 text-xs border-b border-gray-100 flex-shrink-0">
      <span className="font-medium">9:41</span>
      <div className="flex gap-1 items-center">
        <div className="w-4 h-3 border-2 border-gray-800 rounded-sm" />
        <div className="w-4 h-3 border-2 border-gray-800 rounded-sm" />
        <div className="w-6 h-3 border-2 border-gray-800 rounded-sm relative">
          <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-1 h-1.5 bg-gray-800 rounded-sm" />
          <div className="absolute inset-0.5 bg-gray-800 rounded-sm scale-x-75 origin-left" />
        </div>
      </div>
    </div>
  );
}

// ─── ARC GAUGE ────────────────────────────────────────────────────────────────
interface ArcGaugeProps {
  score: number;
}

export function ArcGauge({ score }: ArcGaugeProps) {
  const r = 68, cx = 88, cy = 82, sw = 13;
  const circ = Math.PI * r;
  const offset = circ * (1 - score / 100);
  const ang = Math.PI * (1 - score / 100);
  const nx = cx + r * Math.cos(Math.PI + ang);
  const ny = cy + r * Math.sin(Math.PI + ang);

  return (
    <svg width={176} height={96} viewBox="0 0 176 96">
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="45%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="url(#arcGrad)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
      <circle cx={nx} cy={ny} r={7} fill="white" />
      <circle cx={nx} cy={ny} r={3.5} fill="#4338CA" />
    </svg>
  );
}

// ─── SEVERITY HELPERS ─────────────────────────────────────────────────────────
export const SEVERITY_COLOR: Record<string, string> = {
  critical: '#DC2626',
  moderate: '#D97706',
  minor: '#CA8A04',
};

export const SEVERITY_BG: Record<string, string> = {
  critical: '#FEF2F2',
  moderate: '#FFFBEB',
  minor: '#FEFCE8',
};

export const RISK_COLOR: Record<string, string> = {
  Low: '#16A34A',
  Medium: '#D97706',
  High: '#DC2626',
};

export const RISK_BG: Record<string, string> = {
  Low: '#F0FDF4',
  Medium: '#FFFBEB',
  High: '#FEF2F2',
};
