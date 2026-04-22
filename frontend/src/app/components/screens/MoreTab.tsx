import { useNavigate } from 'react-router';
import { useProfileStore } from '../../../context/profileStore';
import { Card } from '../ui/shared';
import { PROFILES } from '../../../data/mockData';
import type { ProfileKey } from '../../../data/mockData';

const FEATURES = [
  { icon: '👤', label: 'Profile & KYC', path: null },
  { icon: '🕐', label: 'Audit Trail', path: '/officer' },
  { icon: '🔔', label: 'Notifications', path: null },
  { icon: '📋', label: 'Compliance Docs', path: null },
  { icon: '❓', label: 'Help & Support', path: null },
  { icon: '🛡️', label: 'Guardian Mode', path: '/guardian-setup' },
];

export default function MoreTab() {
  const navigate = useNavigate();
  const { activeProfile, setProfile } = useProfileStore();

  return (
    <div className="bg-gray-50 min-h-full pb-6">
      <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
        <h1 className="text-base font-bold text-gray-900">More</h1>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* ── View Mode ── */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">
            VIEW MODE
          </p>
          <div className="flex gap-3">
            <Card className="flex-1 p-4 text-center border-2 border-[#4338CA] bg-indigo-50">
              <div className="text-2xl mb-1">👤</div>
              <p className="text-xs font-bold text-[#4338CA]">Customer View</p>
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
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">
            DEMO PROFILE
          </p>
          <div className="flex gap-2.5">
            {(Object.keys(PROFILES) as ProfileKey[]).map((key) => {
              const p = PROFILES[key];
              const active = activeProfile === key;
              return (
                <button
                  key={key}
                  onClick={() => setProfile(key)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 rounded-2xl border-2 transition-all ${
                    active
                      ? 'border-[#4338CA] bg-indigo-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                      active ? 'bg-[#4338CA] text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.initials}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      active ? 'text-[#4338CA]' : 'text-gray-500'
                    }`}
                  >
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
          <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-2.5">
            FEATURES
          </p>
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
          <p className="text-[10px] text-gray-400 leading-relaxed">
            SecureWealth Twin v1.0 · PSBs Hackathon 2026
          </p>
          <p className="text-[10px] text-[#4338CA] font-bold mt-0.5">
            Powered by Anthropic Claude
          </p>
        </div>
      </div>
    </div>
  );
}
