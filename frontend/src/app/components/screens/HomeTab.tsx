import { useNavigate } from 'react-router';
import { Bell, ChevronDown, MessageCircle, ToggleLeft, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { ArcGauge, Card, Pill, SEVERITY_COLOR, SEVERITY_BG } from '../ui/shared';
import type { ProfileKey } from '../../../data/mockData';

export default function HomeTab() {
  const navigate = useNavigate();
  const { profile, activeProfile, setProfile } = useProfileStore();

  const quickActions = [
    { label: 'AI Advisor', Icon: MessageCircle, color: '#4338CA', path: '/app/advisor' },
    { label: 'Scenarios', Icon: ToggleLeft, color: '#D97706', path: '/app/insights' },
    { label: 'Life Events', Icon: Calendar, color: '#16A34A', path: '/app/life-events' },
    { label: 'Guardian', Icon: ShieldCheck, color: '#3B82F6', path: '/guardian-setup' },
    { label: 'Audit', Icon: Clock, color: '#6B7280', path: '/officer' },
  ];

  return (
    <div className="bg-gray-50 pb-4">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Good Morning 👋</p>
          <p className="text-lg font-bold text-gray-900">{profile.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Profile Switcher */}
          <div className="relative">
            <select
              value={activeProfile}
              onChange={(e) => setProfile(e.target.value as ProfileKey)}
              className="appearance-none bg-indigo-50 text-[#4338CA] text-xs font-bold px-3 py-1.5 pr-6 rounded-full border-none outline-none cursor-pointer"
            >
              <option value="priya">Priya</option>
              <option value="ramesh">Ramesh</option>
              <option value="sme">SME</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#4338CA] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {/* Bell */}
          <button className="relative p-1">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* ── Financial Immune System Score Card ── */}
        <div className="bg-gradient-to-br from-[#312E81] via-[#4338CA] to-[#6366F1] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden relative">
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
                ['Wealth', profile.wealthHealth, '#16A34A'],
                ['Security', profile.securityHealth, '#22D3EE'],
                ['Resilience', profile.resilience, '#D97706'],
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
            <Pill color="#DC2626" bg="#FEF2F2">
              ● {profile.leaks.length} detected
            </Pill>
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
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {leak.title}
                      </p>
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
                      className="mt-1.5 text-xs text-[#4338CA] font-semibold"
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
