import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';

const CHECKLIST = [
  'I initiated this transaction myself',
  'Nobody has asked me to make this payment',
  'I am not under any pressure right now',
];

export default function FraudAlert() {
  const navigate = useNavigate();
  const [secs, setSecs] = useState(28 * 60 + 43);
  const [checked, setChecked] = useState([false, false, false]);

  useEffect(() => {
    const t = setInterval(() => setSecs((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <div
      className="min-h-full flex flex-col items-center px-5 py-10"
      style={{ background: '#FFFBEB' }}
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border-[3px] border-[#D97706]"
        style={{ background: '#FEF3C7' }}
      >
        <span className="text-4xl">⏸️</span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl font-extrabold text-gray-900 mb-3 text-center">
        Transaction Paused
      </h1>
      <p className="text-sm text-gray-600 text-center max-w-[280px] leading-relaxed mb-8">
        We noticed unusual patterns in this session. This is a{' '}
        <span className="font-bold text-[#D97706]">30-minute safety pause</span> — not a
        permanent block.
      </p>

      {/* Countdown Timer */}
      <div
        className="w-32 h-32 rounded-full border-[6px] border-[#D97706] flex flex-col items-center justify-center mb-8 bg-white"
        style={{ boxShadow: '0 4px 20px rgba(217,119,6,0.15)' }}
      >
        <span className="text-3xl font-extrabold text-[#D97706] tracking-tight">
          {mm}:{ss}
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">remaining</span>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Safety Checklist</h2>
        <div className="space-y-2.5">
          {CHECKLIST.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border-[1.5px] transition-all active:scale-[0.98]"
              style={{
                borderColor: checked[i] ? '#16A34A' : '#E5E7EB',
              }}
            >
              <div
                className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: checked[i] ? '#16A34A' : '#F3F4F6',
                  borderColor: checked[i] ? '#16A34A' : '#D1D5DB',
                }}
              >
                {checked[i] && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-800 text-left font-medium">{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm mt-6 space-y-3">
        <button
          disabled={!allChecked}
          onClick={() => navigate('/app')}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            allChecked
              ? 'bg-[#4338CA] text-white hover:bg-[#3730A3] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {allChecked ? 'Confirm & Proceed ✓' : 'Complete checklist to proceed'}
        </button>
        <button
          onClick={() => navigate('/app/security')}
          className="w-full py-4 bg-white text-[#DC2626] border-2 border-[#DC2626] rounded-2xl font-bold text-sm hover:bg-red-50 active:scale-[0.98] transition-all"
        >
          Cancel Transaction
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-6">
        A fraud analyst may review this session anonymously.
      </p>
    </div>
  );
}
