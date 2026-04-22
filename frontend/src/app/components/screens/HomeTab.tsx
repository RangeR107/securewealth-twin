import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, ChevronDown, MessageCircle, ToggleLeft, Calendar, ShieldCheck, Clock, Eye, EyeOff, Fingerprint, MapPin, X } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { ArcGauge, Card, Pill, SEVERITY_COLOR, SEVERITY_BG, PSB } from '../ui/shared';
import type { ProfileKey } from '../../../data/mockData';

// Mock account data per profile
const ACCOUNT_DATA: Record<string, { number: string; balance: string; ifsc: string }> = {
  priya:  { number: 'XXXX XXXX 4821', balance: '₹1,24,530.00', ifsc: 'PSIB0000123' },
  ramesh: { number: 'XXXX XXXX 7743', balance: '₹4,82,910.00', ifsc: 'PSIB0000456' },
  sme:    { number: 'XXXX XXXX 2209', balance: '₹12,40,750.00', ifsc: 'PSIB0000789' },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning 🌅';
  if (h < 17) return 'Good Afternoon ☀️';
  return 'Good Evening 🌙';
}

export default function HomeTab() {
  const navigate = useNavigate();
  const { profile, activeProfile, setProfile } = useProfileStore();
  const account = ACCOUNT_DATA[activeProfile];

  // Live time
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setDate(now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Account reveal
  const [showAccount, setShowAccount] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [biometricPending, setBiometricPending] = useState<'account' | 'balance' | null>(null);

  const triggerBiometric = (type: 'account' | 'balance') => {
    setBiometricPending(type);
  };

  const confirmBiometric = () => {
    if (biometricPending === 'account') setShowAccount(true);
    if (biometricPending === 'balance') setShowBalance(true);
    setBiometricPending(null);
  };

  // Location-based alert
  const [locationAlert, setLocationAlert] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('');
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
        );
        const data = await res.json();
        const country = data.address?.country_code?.toUpperCase() || 'IN';
        if (country !== 'IN') {
          setDetectedCountry(data.address?.country || 'Unknown');
          setLocationAlert(true);
        }
      } catch { /* silent */ }
    });
  }, []);

  const quickActions = [
    { label: 'AI Advisor', Icon: MessageCircle, color: PSB.green,  path: '/app/advisor'     },
    { label: 'Scenarios',  Icon: ToggleLeft,    color: PSB.yellow, path: '/app/insights'    },
    { label: 'Life Events',Icon: Calendar,      color: PSB.greenMid,path: '/app/life-events'},
    { label: 'Guardian',   Icon: ShieldCheck,   color: PSB.green,  path: '/guardian-setup'  },
    { label: 'Audit',      Icon: Clock,         color: PSB.gray,   path: '/officer'         },
  ];

  return (
    <div className="pb-4" style={{ background: PSB.offWhite }}>

      {/* ── Biometric Modal ── */}
      {biometricPending && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white w-full max-w-[390px] rounded-t-3xl p-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: PSB.greenBg }}>
              <Fingerprint className="w-8 h-8" style={{ color: PSB.green }} />
            </div>
            <p className="text-base font-bold text-gray-900">Biometric Verification</p>
            <p className="text-xs text-gray-500 text-center">
              Touch the fingerprint sensor to reveal your{' '}
              {biometricPending === 'account' ? 'account number' : 'balance'}
            </p>
            <button
              onClick={confirmBiometric}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{ background: PSB.green }}
            >
              Authenticate (Demo)
            </button>
            <button
              onClick={() => setBiometricPending(null)}
              className="text-xs text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── International Alert Banner ── */}
      {locationAlert && (
        <div className="mx-4 mt-3 rounded-2xl p-3 flex items-start gap-3"
          style={{ background: '#FEF2F2', border: '1.5px solid #DC2626' }}>
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: PSB.red }} />
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: PSB.red }}>
              International Location Detected
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              You appear to be in <b>{detectedCountry}</b>. Transaction limits have been tightened for your security.
            </p>
          </div>
          <button onClick={() => setLocationAlert(false)}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400">{getGreeting()}</p>
          <p className="text-lg font-bold text-gray-900">{profile.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: PSB.green }}>{time}</p>
          <p className="text-[9px] text-gray-400">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={activeProfile}
              onChange={(e) => {
                setProfile(e.target.value as ProfileKey);
                setShowAccount(false);
                setShowBalance(false);
              }}
              className="appearance-none text-white text-xs font-bold px-3 py-1.5 pr-6 rounded-full border-none outline-none cursor-pointer"
              style={{ background: PSB.green }}
            >
              <option value="priya">Priya</option>
              <option value="ramesh">Ramesh</option>
              <option value="sme">SME</option>
            </select>
            <ChevronDown className="w-3 h-3 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="relative p-1">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-white"
              style={{ background: PSB.red }} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">

        {/* ── Bank Account Card ── */}
        <div className="rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.10)] relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${PSB.green} 0%, ${PSB.greenMid} 100%)` }}>
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

          {/* Bank name */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-white/60 font-bold tracking-widest">PUNJAB & SIND BANK</p>
              <p className="text-[9px] text-white/40">Savings Account</p>
            </div>
            <div className="bg-white/20 px-2 py-1 rounded-lg">
              <p className="text-[9px] font-bold text-white">PSB</p>
            </div>
          </div>

          {/* Account Number */}
          <div className="mb-3">
            <p className="text-[10px] text-white/50 mb-1">Account Number</p>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold tracking-widest text-white font-mono">
                {showAccount
                  ? account.number.replace(/X/g, '•').replace('•••• •••• ', '3782 9041 ')
                  : account.number}
              </p>
              <button
                onClick={() => showAccount ? setShowAccount(false) : triggerBiometric('account')}
                className="bg-white/20 rounded-lg p-1"
              >
                {showAccount
                  ? <EyeOff className="w-3.5 h-3.5 text-white" />
                  : <Eye className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
            <p className="text-[9px] text-white/40 mt-0.5">IFSC: {account.ifsc}</p>
          </div>

          {/* Balance */}
          <div className="bg-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/50">Available Balance</p>
              <p className="text-xl font-extrabold text-white mt-0.5">
                {showBalance ? account.balance : '₹ ••••••••'}
              </p>
            </div>
            <button
              onClick={() => showBalance ? setShowBalance(false) : triggerBiometric('balance')}
              className="bg-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5"
            >
              <Fingerprint className="w-4 h-4 text-white" />
              <span className="text-[10px] text-white font-semibold">
                {showBalance ? 'Hide' : 'Show'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Financial Immune System Score Card ── */}
        <div
          className="rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden relative"
          style={{ background: `linear-gradient(135deg, #0F4023 0%, ${PSB.green} 50%, ${PSB.greenMid} 100%)` }}
        >
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/5 rounded-full" />
          <p className="text-[10px] text-white/60 font-bold tracking-wider mb-3">
            FINANCIAL IMMUNE SYSTEM SCORE
          </p>
          <div className="flex items-center gap-4">
            <div>
              <ArcGauge score={profile.immuneScore} />
              <div className="text-center -mt-2">
                <span className="text-4xl font-extrabold text-white">{profile.immuneScore}</span>
                <span className="text-sm text-white/50 ml-1">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {[
                ['Wealth',     profile.wealthHealth,   '#2EAD62'],
                ['Security',   profile.securityHealth, '#22D3EE'],
                ['Resilience', profile.resilience,     '#D97706'],
              ].map(([label, val, color]) => (
                <div key={label as string}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-white/60">{label}</span>
                    <span className="text-[11px] font-bold text-white">{val}%</span>
                  </div>
                  <div className="h-1.5 bg-white/15 rounded-full">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${val}%`, background: color as string }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 bg-white/10 rounded-xl px-3 py-2 text-white text-xs">
            💡 Top action: {profile.leaks[0]?.action}
          </div>
        </div>

        {/* ── Wealth Leaks ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-gray-900">Wealth Leaks</h3>
            <Pill color={PSB.red} bg="#FEF2F2">● {profile.leaks.length} detected</Pill>
          </div>
          <div className="space-y-2.5">
            {profile.leaks.map((leak) => (
              <Card key={leak.id} className="overflow-hidden">
                <div className="flex gap-3 p-3.5 pr-3.5 pl-0">
                  <div
                    className="w-1 rounded-r flex-shrink-0"
                    style={{ background: SEVERITY_COLOR[leak.severity] }}
                  />
                  <span className="text-2xl">{leak.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{leak.title}</p>
                      <Pill
                        color={SEVERITY_COLOR[leak.severity]}
                        bg={SEVERITY_BG[leak.severity]}
                        className="flex-shrink-0"
                      >
                        {leak.severity}
                      </Pill>
                    </div>
                    <p className="text-xs text-gray-500">{leak.desc}</p>
                    <button
                      onClick={() => navigate('/app/insights')}
                      className="mt-1.5 text-xs font-semibold"
                      style={{ color: PSB.green }}
                    >
                      Fix → {leak.action}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2.5">Quick Actions</h3>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            {quickActions.map(({ label, Icon, color, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] min-w-[76px] active:scale-95 transition-transform flex-shrink-0"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-[10px] text-gray-700 font-semibold text-center whitespace-nowrap">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
