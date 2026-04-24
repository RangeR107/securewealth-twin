import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Check, MapPin } from 'lucide-react';
import { PSB } from '../ui/shared';
import {
  fetchIncident,
  fetchIncidents,
  resolveIncident,
  type IncidentDetail,
} from '../../../data/api';

const CHECKLIST = [
  'I initiated this transaction myself',
  'Nobody has asked me to make this payment',
  'I am not under any pressure right now',
];

export default function FraudAlert() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { incidentId?: string } };
  const [secs, setSecs] = useState(28 * 60 + 43);
  const [checked, setChecked] = useState([false, false, false]);
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [resolving, setResolving] = useState(false);
  const [alertTime] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [alertDate] = useState(() =>
    new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  );

  // If a transaction submit forwarded us here with an incidentId, load it.
  // Otherwise, pull the most recent incident so the "Simulate Fraud" button
  // also surfaces real backend data.
  useEffect(() => {
    (async () => {
      try {
        if (location.state?.incidentId) {
          const detail = await fetchIncident(location.state.incidentId);
          setIncident(detail);
        } else {
          const list = await fetchIncidents();
          if (list.length > 0) {
            const detail = await fetchIncident(list[0].incidentId);
            setIncident(detail);
          }
        }
      } catch (e) {
        console.warn('[FraudAlert] incident fetch failed — using static UI', e);
      }
    })();
  }, [location.state?.incidentId]);

  const handleConfirm = async () => {
    if (resolving) return;
    setResolving(true);
    try {
      if (incident) await resolveIncident(incident.incidentId, 'resolve');
    } catch (e) {
      console.warn('[FraudAlert] resolve failed — continuing', e);
    } finally {
      setResolving(false);
      navigate('/app');
    }
  };

  const handleCancel = async () => {
    try {
      if (incident) await resolveIncident(incident.incidentId, 'dismiss');
    } catch (e) {
      console.warn('[FraudAlert] dismiss failed — continuing', e);
    } finally {
      navigate('/app/security');
    }
  };

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
      style={{ background: PSB.yellowBg }}
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5 border-[3px]"
        style={{ background: '#FEF3C7', borderColor: PSB.yellow }}
      >
        <span className="text-4xl">⏸️</span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
        Transaction Paused
      </h1>

      {/* Timestamp + location */}
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-3 h-3 text-gray-400" />
        <p className="text-xs text-gray-400">Flagged at {alertTime} · {alertDate} · India</p>
      </div>

      <p className="text-sm text-gray-600 text-center max-w-[280px] leading-relaxed mb-8">
        We noticed unusual patterns in this session. This is a{' '}
        <span className="font-bold" style={{ color: PSB.yellow }}>30-minute safety pause</span> — not a
        permanent block.
      </p>

      {/* Countdown Timer */}
      <div
        className="w-32 h-32 rounded-full border-[6px] flex flex-col items-center justify-center mb-8 bg-white"
        style={{ borderColor: PSB.yellow, boxShadow: '0 4px 20px rgba(217,119,6,0.15)' }}
      >
        <span className="text-3xl font-extrabold tracking-tight" style={{ color: PSB.yellow }}>
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
              style={{ borderColor: checked[i] ? PSB.green : '#E5E7EB' }}
            >
              <div
                className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background:  checked[i] ? PSB.green : '#F3F4F6',
                  borderColor: checked[i] ? PSB.green : '#D1D5DB',
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
          disabled={!allChecked || resolving}
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all"
          style={{
            background: allChecked ? PSB.green : '#E5E7EB',
            color:      allChecked ? 'white'   : '#9CA3AF',
            cursor:     allChecked && !resolving ? 'pointer' : 'not-allowed',
          }}
        >
          {resolving ? 'Processing…' : allChecked ? 'Confirm & Proceed ✓' : 'Complete checklist to proceed'}
        </button>
        <button
          onClick={handleCancel}
          className="w-full py-4 bg-white rounded-2xl font-bold text-sm active:scale-[0.98] transition-all border-2"
          style={{ color: PSB.red, borderColor: PSB.red }}
        >
          Cancel Transaction
        </button>
      </div>

      <p className="text-[10px] text-gray-400 text-center mt-6">
        A Punjab & Sind Bank fraud analyst may review this session anonymously.
      </p>
    </div>
  );
}
