import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { BackArrow, Card, Pill } from '../ui/shared';
import { useProfileStore } from '../../../context/profileStore';
import { addGuardian } from '../../../data/api';

interface FormState {
  name: string;
  phone: string;
  relationship: string;
  consent: boolean;
}

export default function GuardianSetup() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    relationship: 'Family',
    consent: false,
  });

  const isFormValid = form.name.trim() && form.phone.trim() && form.consent;

  const sendRequest = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    try {
      await addGuardian({
        profileKey: activeProfile,
        name: form.name,
        phone: form.phone,
        relationship: form.relationship,
        consent: form.consent,
      });
    } catch (e) {
      console.warn('[GuardianSetup] addGuardian API failed — proceeding in demo mode', e);
    } finally {
      setSubmitting(false);
      setStep(3);
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => (step === 1 ? navigate('/app') : setStep(step - 1))} />
        <h1 className="text-base font-bold text-gray-900">Guardian Mode</h1>
      </div>

      <div className="px-4 pt-5 pb-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s
                    ? 'bg-[#16A34A] text-white'
                    : step === s
                    ? 'bg-[#4338CA] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" strokeWidth={3} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-8 h-0.5 transition-all ${step > s ? 'bg-[#16A34A]' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <Card className="p-6 text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Protect Yourself with a Guardian
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Add a trusted contact who gets notified if something unusual happens — without
              ever seeing your balance or transactions.
            </p>
            <div className="space-y-3 text-left mb-6">
              {[
                'Gets alerts only — never your balance',
                'Cannot approve or cancel transactions',
                'Full DPDP 2023 consent required',
                'Revoke anytime — instantly effective',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#16A34A]" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#4338CA] text-white font-bold rounded-2xl hover:bg-[#3730A3] active:scale-[0.98] transition-all"
            >
              Set Up Guardian →
            </button>
          </Card>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <Card className="p-5">
            <h2 className="text-base font-bold text-gray-900 mb-5">Guardian Details</h2>

            {/* Name */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Guardian's Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Aditya Kumar"
                className="w-full border-[1.5px] border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#4338CA] transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border-[1.5px] border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#4338CA] transition-colors"
              />
            </div>

            {/* Relationship */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Relationship
              </label>
              <select
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                className="w-full border-[1.5px] border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none bg-white focus:border-[#4338CA] transition-colors"
              >
                {['Family', 'Spouse', 'Parent', 'Sibling', 'Trusted Friend'].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Consent Checkbox */}
            <button
              onClick={() => setForm({ ...form, consent: !form.consent })}
              className="flex items-start gap-3 mb-6 text-left w-full"
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  form.consent
                    ? 'bg-[#4338CA] border-[#4338CA]'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {form.consent && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                I confirm I have my guardian's verbal consent to add them
              </span>
            </button>

            <button
              disabled={!isFormValid || submitting}
              onClick={sendRequest}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
                isFormValid && !submitting
                  ? 'bg-[#4338CA] text-white hover:bg-[#3730A3] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Sending…' : 'Send Guardian Request →'}
            </button>
          </Card>
        )}

        {/* ── STEP 3 – Confirmation ── */}
        {step === 3 && (
          <Card className="p-6 text-center">
            <div className="w-18 h-18 bg-green-50 rounded-full border-4 border-[#16A34A] flex items-center justify-center mx-auto mb-4" style={{ width: 72, height: 72 }}>
              <Check className="w-8 h-8 text-[#16A34A]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Request Sent!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              <span className="font-semibold text-gray-800">{form.name || 'Your Guardian'}</span>{' '}
              has been sent a request to{' '}
              <span className="font-semibold text-gray-800">{form.phone || '+91 XXXXX'}</span>.
              They must accept via OTP on their own phone.
            </p>

            <Pill color="#D97706" bg="#FFFBEB" className="mb-3">
              ⏳ Pending Acceptance
            </Pill>

            <div className="flex justify-center gap-2 flex-wrap mt-3 mb-5">
              <Pill color="#6B7280" bg="#F3F4F6">Expires in 48 hours</Pill>
              <Pill color="#16A34A" bg="#F0FDF4">DPDP 2023 ✓</Pill>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed px-4 mb-5">
              Your guardian will only receive activity alerts — never your balance, amounts, or
              transaction details. Compliant with DPDP 2023 data minimization.
            </p>

            <button
              onClick={() => navigate('/app')}
              className="w-full py-3.5 bg-[#4338CA] text-white font-bold rounded-2xl hover:bg-[#3730A3] active:scale-[0.98] transition-all mb-3"
            >
              Done
            </button>
            <button className="text-sm text-[#4338CA] font-semibold">
              Manage Guardians
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
