import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { BackArrow, Card, Pill, PSB } from '../ui/shared';
import { useProfileStore } from '../../../context/profileStore';
import { fetchKyc, type KycStatus } from '../../../data/api';

const STATUS_COLOR: Record<string, string> = {
  verified: PSB.green,
  pending: PSB.yellow,
  action_required: PSB.red,
};

const STATUS_BG: Record<string, string> = {
  verified: PSB.greenBg,
  pending: PSB.yellowBg,
  action_required: PSB.redBg,
};

const STATUS_LABEL: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending',
  action_required: 'Action required',
};

export default function KycScreen() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  const [kyc, setKyc] = useState<KycStatus | null>(null);

  useEffect(() => {
    let c = false;
    fetchKyc(activeProfile)
      .then((k) => { if (!c) setKyc(k); })
      .catch((e) => console.warn('[KYC] fetch failed', e));
    return () => { c = true; };
  }, [activeProfile]);

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app/more')} />
        <h1 className="text-base font-bold text-gray-900">Profile &amp; KYC</h1>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {kyc ? (
          <>
            <Card className="p-4" style={{ background: STATUS_BG[kyc.status], border: `1.5px solid ${STATUS_COLOR[kyc.status]}` }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6" style={{ color: STATUS_COLOR[kyc.status] }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{kyc.level}</p>
                  <p className="text-xs text-gray-600">
                    Last verified {kyc.lastVerified} · expires {kyc.expiresOn}
                  </p>
                </div>
                <Pill color={STATUS_COLOR[kyc.status]} bg="white">
                  {STATUS_LABEL[kyc.status]}
                </Pill>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Linked Identity</h3>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-400">PAN</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: kyc.panLinked ? PSB.green : PSB.red }}>
                    {kyc.panLinked ? 'Linked ✓' : 'Not linked'}
                  </p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] text-gray-400">Aadhaar</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: kyc.aadhaarLinked ? PSB.green : PSB.red }}>
                    {kyc.aadhaarLinked ? 'Linked ✓' : 'Not linked'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Documents</h3>
              <div className="space-y-2">
                {kyc.documents.map((d) => (
                  <div key={d.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                      <p className="text-[10px] text-gray-400">{d.date}</p>
                    </div>
                    <Pill color={STATUS_COLOR[d.status] ?? PSB.gray} bg={STATUS_BG[d.status] ?? '#F3F4F6'}>
                      {STATUS_LABEL[d.status] ?? d.status}
                    </Pill>
                  </div>
                ))}
              </div>
            </Card>

            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              DPDP 2023 compliant. Your identity data is never shared without consent.
            </p>
          </>
        ) : (
          <p className="text-xs text-gray-400 text-center py-8">Loading KYC status…</p>
        )}
      </div>
    </div>
  );
}
