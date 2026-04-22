import { useNavigate } from 'react-router';
import { Shield, Bell, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { Card, Pill, RISK_COLOR, RISK_BG } from '../ui/shared';

export default function SecurityTab() {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const riskColor = RISK_COLOR[profile.riskLevel];
  const riskBg = RISK_BG[profile.riskLevel];

  const alerts = [
    { dot: '#16A34A', title: 'Login from trusted device', time: '2 hours ago', status: 'Cleared' },
    { dot: '#D97706', title: 'Unusual transaction time detected', time: 'Yesterday 11:42 PM', status: 'Monitoring' },
    { dot: '#16A34A', title: 'OTP verified successfully', time: '2 days ago', status: 'Cleared' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#4338CA]" />
          <h1 className="text-base font-bold text-gray-900">Security Center</h1>
        </div>
        <button className="relative p-1">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white" />
        </button>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* ── Risk Level Card ── */}
        <Card style={{ background: riskBg }} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">
                CURRENT RISK LEVEL
              </p>
              <p className="text-2xl font-extrabold" style={{ color: riskColor }}>
                {profile.riskLevel} Risk
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: `${riskColor}20` }}
            >
              {profile.riskLevel === 'Low' ? '✅' : profile.riskLevel === 'Medium' ? '⚠️' : '🚨'}
            </div>
          </div>
          {/* Risk Bar */}
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
            <div className="flex-1 bg-[#16A34A] rounded-l-full" />
            <div className="flex-1 bg-[#D97706]" />
            <div className="flex-1 bg-[#DC2626] rounded-r-full" />
          </div>
          <div className="flex justify-between mt-1.5">
            {['Low', 'Medium', 'High'].map((l) => (
              <span key={l} className="text-[9px] font-bold" style={{ color: RISK_COLOR[l] }}>
                {l}
              </span>
            ))}
          </div>
        </Card>

        {/* ── Financial Stress Index ── */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Financial Stress Index</h3>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full border-4 flex items-center justify-center flex-shrink-0"
              style={{
                borderColor:
                  profile.stressIndex < 40
                    ? '#16A34A'
                    : profile.stressIndex < 70
                    ? '#D97706'
                    : '#DC2626',
              }}
            >
              <span
                className="text-lg font-extrabold"
                style={{
                  color:
                    profile.stressIndex < 40
                      ? '#16A34A'
                      : profile.stressIndex < 70
                      ? '#D97706'
                      : '#DC2626',
                }}
              >
                {profile.stressIndex}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profile.stressIndex < 40
                  ? 'Low Stress'
                  : profile.stressIndex < 70
                  ? 'Moderate Stress'
                  : 'High Stress'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Thresholds:{' '}
                {profile.stressIndex < 40 ? 'Normal' : 'Tightened automatically'}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Recent Alerts ── */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Alerts</h3>
          <div className="space-y-1">
            {alerts.map((a, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: a.dot }}
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <Pill color={a.dot}>{a.status}</Pill>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </Card>

        {/* ── Behavioral Session ── */}
        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckCircle className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Last session — Normal behavior
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Session DNA matched your baseline</p>
            </div>
          </div>
        </Card>

        {/* ── Demo Trigger ── */}
        <button
          onClick={() => navigate('/fraud-alert')}
          className="w-full py-4 bg-white text-[#DC2626] border-2 border-[#DC2626] rounded-2xl font-bold text-sm hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-5 h-5" />
          Simulate Fraud Scenario (Demo)
        </button>
      </div>
    </div>
  );
}
