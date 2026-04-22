import { useNavigate } from 'react-router';
import { useProfileStore } from '../../../context/profileStore';
import { Card, PSB } from '../ui/shared';
import { PROFILES } from '../../../data/mockData';
import type { ProfileKey } from '../../../data/mockData';

const FEATURES = [
  { icon: '👤', label: 'Profile & KYC',    path: null           },
  { icon: '🕐', label: 'Audit Trail',      path: '/officer'     },
  { icon: '🔔', label: 'Notifications',    path: null           },
  { icon: '📋', label: 'Compliance Docs',  path: null           },
  { icon: '❓', label: 'Help & Support',   path: null           },
  { icon: '🛡️', label: 'Guardian Mode',   path: '/guardian-setup' },
];

export default function MoreTab() {
  const navigate = useNavigate();
  const { activeProfile, setProfile } = useProfileStore();

  return (
    <div className="min-h-full pb-6" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900">More</h1>
      </div>

      <div className="px-4 pt-4 space-y-5">

        {/* ── View Mode ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">VIEW MODE</p>
          <div className="flex gap-3">
            <Card className="flex-1 p-4 text-center border-2"
              style={{ borderColor: PSB.green, background: PSB.greenBg }}>
              <div className="text-2xl mb-1">👤</div>
              <p className="text-xs font-bold" style={{ color: PSB.green }}>Customer View</p>
            </Card>
            <Card
              className="flex-1 p-4 text-center border border-gray-200"
              onClick={() => navigate('/officer')}
            >
              <div className="text-2xl mb-1">🏦</div>
              <p className="text-xs font-bold text-gray-500">Officer View</p>
            </Card>
          </div>
        </div>

        {/* ── Demo Profile ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">DEMO PROFILE</p>
          <div className="flex gap-2.5">
            {(Object.keys(PROFILES) as ProfileKey[]).map((key) => {
              const p = PROFILES[key];
              const active = activeProfile === key;
              return (
                <button
                  key={key}
                  onClick={() => setProfile(key)}
                  className="flex-1 flex flex-col items-center py-3 px-2 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: active ? PSB.green : '#E5E7EB',
                    background:  active ? PSB.greenBg : 'white',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
                    style={{
                      background: active ? PSB.green : '#F3F4F6',
                      color:      active ? 'white' : '#6B7280',
                    }}
                  >
                    {p.initials}
                  </div>
                  <span className="text-[10px] font-bold"
                    style={{ color: active ? PSB.green : '#6B7280' }}>
                    {key === 'sme' ? 'SME' : p.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-0.5">{p.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Features Grid ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">FEATURES</p>
          <div className="grid grid-cols-2 gap-2.5">
            {FEATURES.map(({ icon, label, path }) => (
              <Card
                key={label}
                className="flex items-center gap-3 p-4"
                onClick={path ? () => navigate(path) : undefined}
                style={path ? undefined : { cursor: 'default' }}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="text-center pt-2">
          <p className="text-[10px] font-bold mt-0.5" style={{ color: PSB.green }}>
          Punjab & Sind Bank
          </p>
        </div>
      </div>
    </div>
  );
}
