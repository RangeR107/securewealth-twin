import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, CheckCircle } from 'lucide-react';
import { Card, Pill } from '../ui/shared';
import { AUDIT_TIMELINE, AUDIT_SIGNALS } from '../../../data/mockData';

const NODE_COLOR = {
  normal: '#16A34A',
  flagged: '#D97706',
  held: '#DC2626',
} as const;

export default function OfficerView() {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(3);

  return (
    <div className="bg-gray-50 min-h-full pb-8">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Officer Dashboard</h1>
        </div>
        <Pill color="#DC2626" bg="#FEF2F2">🏦 Officer Mode</Pill>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* ── Incident Card ── */}
        <Card className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Pill color="#4338CA" bg="#EEF2FF">#INC-2026-00847</Pill>
              <p className="text-base font-bold text-gray-900 mt-2">Priya Sharma</p>
              <p className="text-xs text-gray-400 mt-0.5">22 Apr 2026, 11:45 PM · ₹85,000 transfer</p>
            </div>
            <Pill color="#D97706" bg="#FFFBEB">Under Review</Pill>
          </div>
          <div className="flex gap-2">
            {[
              ['Risk Score', '74/100', '#DC2626', '#FEF2F2'],
              ['Persona', 'Social Eng.', '#D97706', '#FFFBEB'],
              ['Response', 'Cool-off', '#16A34A', '#F0FDF4'],
            ].map(([l, v, c, bg]) => (
              <div
                key={l}
                className="flex-1 rounded-xl p-2.5 text-center"
                style={{ background: bg as string }}
              >
                <p className="text-[9px] text-gray-500 font-semibold">{l}</p>
                <p className="text-xs font-extrabold mt-0.5" style={{ color: c as string }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Forensic Timeline ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Forensic Timeline</h3>
          <Card className="p-4">
            <div className="overflow-x-auto pb-2">
              <div className="flex items-start min-w-[340px] relative">
                {AUDIT_TIMELINE.map((node, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center relative">
                    {/* Connector line */}
                    {i < AUDIT_TIMELINE.length - 1 && (
                      <div
                        className="absolute top-3.5 left-1/2 w-full h-0.5 z-0"
                        style={{
                          background:
                            i < activeNode
                              ? NODE_COLOR[node.status as keyof typeof NODE_COLOR]
                              : '#E5E7EB',
                        }}
                      />
                    )}
                    {/* Node button */}
                    <button
                      onClick={() => setActiveNode(i)}
                      className="w-7 h-7 rounded-full z-10 relative flex-shrink-0 transition-all"
                      style={{
                        background: NODE_COLOR[node.status as keyof typeof NODE_COLOR],
                        border: `3px solid ${
                          activeNode === i ? '#111827' : NODE_COLOR[node.status as keyof typeof NODE_COLOR]
                        }`,
                        boxShadow: activeNode === i ? '0 0 0 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    />
                    <p
                      className="text-[9px] text-center mt-1.5 leading-tight whitespace-pre-line"
                      style={{
                        color: activeNode === i ? '#111827' : '#6B7280',
                        fontWeight: activeNode === i ? 700 : 400,
                      }}
                    >
                      {node.label}
                    </p>
                    <p className="text-[8px] text-gray-400">{node.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Customer Explanation ── */}
        <Card className="p-4" style={{ borderLeft: '4px solid #16A34A' }}>
          <p className="text-[10px] font-bold text-[#16A34A] mb-2">👤 Customer Explanation</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            A copy-paste action and 8-second hesitation on the confirm button were detected.
            This differs from your usual transaction behavior and triggered our safety system.
          </p>
        </Card>

        {/* ── Technical Signal Log ── */}
        <Card className="p-4 bg-gray-50" style={{ borderLeft: '4px solid #4338CA' }}>
          <p className="text-[10px] font-bold text-[#4338CA] mb-3">🔬 Technical Signal Log</p>
          <div className="space-y-2">
            {AUDIT_SIGNALS.map(({ key, value, flagged }) => (
              <div
                key={key}
                className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
              >
                <span className="text-[11px] font-mono text-gray-500">{key}</span>
                <span
                  className="text-[11px] font-bold font-mono"
                  style={{ color: flagged ? '#DC2626' : '#16A34A' }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Risk Assessment ── */}
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <h3 className="text-xs font-bold text-amber-900 mb-1.5">Risk Assessment</h3>
          <p className="text-xs text-amber-800 leading-relaxed">
            High-confidence fraud indicators detected. Behavioral pattern suggests social
            engineering. Customer may be under external pressure. Cooling-off period applied.
          </p>
        </Card>

        {/* ── Action Buttons ── */}
        <div className="flex gap-3">
          <button className="flex-1 py-3.5 bg-white text-[#4338CA] border-2 border-[#4338CA] rounded-2xl font-semibold text-sm hover:bg-indigo-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => navigate('/app')}
            className="flex-1 py-3.5 bg-[#16A34A] text-white rounded-2xl font-semibold text-sm hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Resolved
          </button>
        </div>

        <p className="text-[9px] text-gray-400 text-center">
          DPDP 2023 · 7-year retention policy · RBI DBS.FrMC.BC.No.1/23.04.001/2023
        </p>
      </div>
    </div>
  );
}
