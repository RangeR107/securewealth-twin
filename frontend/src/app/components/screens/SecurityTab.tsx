import { useNavigate } from 'react-router';
import { Shield, Bell, CheckCircle, ChevronRight, AlertTriangle, MapPin } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { Card, Pill, RISK_COLOR, RISK_BG, PSB } from '../ui/shared';
import { useState, useEffect } from 'react';

export default function SecurityTab() {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const riskColor = RISK_COLOR[profile.riskLevel];
  const riskBg = RISK_BG[profile.riskLevel];

  // Live timestamps
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const fmt = (offsetMins: number) => {
    const d = new Date(now.getTime() - offsetMins * 60000);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const alerts = [
    { dot: PSB.green,  title: 'Login from trusted device',         time: `Today ${fmt(120)}`,   status: 'Cleared',    location: 'New Delhi, India' },
    { dot: PSB.yellow, title: 'Unusual transaction time detected',  time: `Yesterday ${fmt(780)}`,status: 'Monitoring', location: 'Mumbai, India'    },
    { dot: PSB.green,  title: 'OTP verified successfully',          time: `2 days ago ${fmt(2880)}`,status: 'Cleared',  location: 'New Delhi, India' },
  ];

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>

      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" style={{ color: PSB.green }} />
          <h1 className="text-base font-bold text-gray-900">Security Center</h1>
        </div>
        <button className="relative p-1">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full border border-white"
            style={{ background: PSB.red }} />
        </button>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">

        {/* ── Risk Level Card ── */}
        <Card style={{ background: riskBg }} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 tracking-wider mb-1">CURRENT RISK LEVEL</p>
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
          <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
            <div className="flex-1 rounded-l-full" style={{ background: PSB.green }} />
            <div className="flex-1" style={{ background: PSB.yellow }} />
            <div className="flex-1 rounded-r-full" style={{ background: PSB.red }} />
          </div>
          <div className="flex justify-between mt-1.5">
            {[['Low', PSB.green], ['Medium', PSB.yellow], ['High', PSB.red]].map(([l, c]) => (
              <span key={l} className="text-[9px] font-bold" style={{ color: c }}>{l}</span>
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
                borderColor: profile.stressIndex < 40 ? PSB.green : profile.stressIndex < 70 ? PSB.yellow : PSB.red,
              }}
            >
              <span
                className="text-lg font-extrabold"
                style={{ color: profile.stressIndex < 40 ? PSB.green : profile.stressIndex < 70 ? PSB.yellow : PSB.red }}
              >
                {profile.stressIndex}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profile.stressIndex < 40 ? 'Low Stress' : profile.stressIndex < 70 ? 'Moderate Stress' : 'High Stress'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Thresholds: {profile.stressIndex < 40 ? 'Normal' : 'Tightened automatically'}
              </p>
            </div>
          </div>
        </Card>

        {/* ── Recent Alerts with location ── */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Alerts</h3>
          <div className="space-y-1">
            {alerts.map((a, i) => (
              <button key={i}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.dot }} />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-xs text-gray-400">{a.time}</p>
                    <span className="text-gray-300">·</span>
                    <MapPin className="w-2.5 h-2.5 text-gray-300" />
                    <p className="text-[10px] text-gray-400">{a.location}</p>
                  </div>
                </div>
                <Pill color={a.dot}>{a.status}</Pill>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </Card>

        {/* ── International Transaction Warning ── */}
        <Card className="p-4" style={{ background: '#FFF7ED', border: '1.5px solid #D97706' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFFBEB' }}>
              <MapPin className="w-5 h-5" style={{ color: PSB.yellow }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Location-Based Protection Active</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Base location: <b>India</b>. Any international transaction will trigger an automatic 30-min safety pause and alert.
              </p>
            </div>
          </div>
        </Card>

        {/* ── Behavioral Session ── */}
        <Card className="p-4" style={{ background: PSB.greenBg }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <CheckCircle className="w-6 h-6" style={{ color: PSB.green }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Last session — Normal behavior</p>
              <p className="text-xs text-gray-500 mt-0.5">Session DNA matched your baseline</p>
            </div>
          </div>
        </Card>

        {/* ── Demo Trigger ── */}
        <button
          onClick={() => navigate('/fraud-alert')}
          className="w-full py-4 bg-white border-2 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          style={{ color: PSB.red, borderColor: PSB.red }}
        >
          <AlertTriangle className="w-5 h-5" />
          Simulate Fraud Scenario (Demo)
        </button>
      </div>
    </div>
  );
}
