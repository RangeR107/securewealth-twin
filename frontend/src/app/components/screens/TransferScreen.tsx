import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { BackArrow, Card, Pill, PSB } from '../ui/shared';
import {
  trustCheck,
  fetchAffordability,
  submitTransaction,
  type TrustCheckResponse,
  type AffordabilityResponse,
} from '../../../data/api';

const TRUST_COLOR: Record<'green' | 'yellow' | 'red', string> = {
  green:  PSB.green,
  yellow: PSB.yellow,
  red:    PSB.red,
};

const TRUST_BG: Record<'green' | 'yellow' | 'red', string> = {
  green:  PSB.greenBg,
  yellow: PSB.yellowBg,
  red:    PSB.redBg,
};

const TRUST_DOT: Record<'green' | 'yellow' | 'red', string> = {
  green:  '🟢',
  yellow: '🟡',
  red:    '🔴',
};

export default function TransferScreen() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trust, setTrust] = useState<TrustCheckResponse | null>(null);
  const [afford, setAfford] = useState<AffordabilityResponse | null>(null);

  // Paste + hover instrumentation for the fraud engine.
  const pasteDetected = useRef(false);
  const hoverStart = useRef<number | null>(null);
  const [hoverSec, setHoverSec] = useState(0);

  // Debounced trust lookup.
  useEffect(() => {
    if (!recipient.trim()) {
      setTrust(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await trustCheck(activeProfile, recipient);
        setTrust(r);
      } catch (e) {
        console.warn('[TransferScreen] trust-check failed', e);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [recipient, activeProfile]);

  // Debounced affordability preview.
  useEffect(() => {
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) {
      fetchAffordability(activeProfile).then(setAfford).catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      fetchAffordability(activeProfile, n)
        .then(setAfford)
        .catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [amount, activeProfile]);

  const parsedAmount = Number(amount);
  const canSubmit = useMemo(
    () => recipient.trim().length > 0 && parsedAmount > 0 && !submitting,
    [recipient, parsedAmount, submitting],
  );

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    // End hover timer.
    if (hoverStart.current !== null) {
      setHoverSec((Date.now() - hoverStart.current) / 1000);
    }

    try {
      const result = await submitTransaction({
        profileKey: activeProfile,
        amount: parsedAmount,
        recipient,
        recipientIsNew: trust?.status !== 'known',
        deviceId: 'device-default',
        deviceIsNew: false,
        pasteDetected: pasteDetected.current,
        hoverDurationSec: hoverSec || 0,
        note: note || undefined,
      });

      if (result.evaluation.decision === 'ALLOW') {
        navigate('/app', { state: { flash: 'Transfer successful' } });
        return;
      }
      // WARN or BLOCK → route to FraudAlert carrying the incident id.
      navigate('/fraud-alert', {
        state: { incidentId: result.incident?.incidentId ?? result.evaluation.incidentId },
      });
    } catch (e) {
      console.warn('[TransferScreen] submitTransaction failed', e);
      setError('Could not submit transfer. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app')} />
        <h1 className="text-base font-bold text-gray-900">Send Money</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Recipient */}
        <Card className="p-4">
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">
            Recipient (name or UPI)
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            onPaste={() => { pasteDetected.current = true; }}
            placeholder="e.g. Swiggy · 9876543210 · someone@upi"
            className="w-full border-[1.5px] border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#1A6B3C] transition-colors"
          />

          {/* Invisible Security Indicator */}
          {trust && (
            <div
              className="mt-3 rounded-2xl px-3 py-2.5 flex items-center gap-2"
              style={{ background: TRUST_BG[trust.color], border: `1.5px solid ${TRUST_COLOR[trust.color]}` }}
            >
              <span className="text-base">{TRUST_DOT[trust.color]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: TRUST_COLOR[trust.color] }}>
                  {trust.label}
                </p>
                <p className="text-[11px] text-gray-600 leading-snug">{trust.note}</p>
              </div>
              {trust.pastCount > 0 && (
                <Pill color={TRUST_COLOR[trust.color]} bg="white">
                  {trust.pastCount}× paid
                </Pill>
              )}
            </div>
          )}
        </Card>

        {/* Amount */}
        <Card className="p-4">
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">
            Amount (₹)
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full text-2xl font-extrabold text-gray-900 outline-none bg-transparent"
          />

          {afford && (
            <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-xl p-2.5">
              <span className="text-base">💸</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-600 leading-snug">{afford.narrative}</p>
                {afford.checkedAmount && afford.canAfford === false && (
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: PSB.red }}>
                    Overshoots your safe-to-spend.
                  </p>
                )}
                {afford.checkedAmount && afford.canAfford === true && (
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: PSB.green }}>
                    Fits comfortably ✓
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Note */}
        <Card className="p-4">
          <label className="text-xs font-semibold text-gray-600 block mb-1.5">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Rent for April"
            className="w-full border-[1.5px] border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#1A6B3C] transition-colors"
          />
        </Card>

        {error && (
          <Card className="p-3" style={{ background: PSB.redBg, border: `1.5px solid ${PSB.red}` }}>
            <p className="text-xs font-semibold" style={{ color: PSB.red }}>{error}</p>
          </Card>
        )}

        {/* Submit */}
        <button
          onMouseEnter={() => { hoverStart.current = Date.now(); }}
          onMouseLeave={() => {
            if (hoverStart.current !== null) {
              setHoverSec((Date.now() - hoverStart.current) / 1000);
              hoverStart.current = null;
            }
          }}
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          style={{
            background: canSubmit ? PSB.green : '#E5E7EB',
            color:      canSubmit ? 'white'   : '#9CA3AF',
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          {submitting ? 'Checking risk…' : 'Send securely'}
        </button>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Every transfer is scored by the Financial Immune System. High-risk
          sessions trigger a 30-minute cool-off — compliant with RBI fraud controls.
        </p>
      </div>
    </div>
  );
}
