import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Download } from 'lucide-react';
import { BackArrow, Card, Pill, PSB } from '../ui/shared';
import { fetchCompliance, type ComplianceDoc } from '../../../data/api';

const CAT_COLOR: Record<ComplianceDoc['category'], string> = {
  regulation: '#4338CA',
  policy:     PSB.green,
  statement:  PSB.greenMid,
  report:     PSB.yellow,
};

const CAT_BG: Record<ComplianceDoc['category'], string> = {
  regulation: '#EEF2FF',
  policy:     PSB.greenBg,
  statement:  PSB.greenBg,
  report:     PSB.yellowBg,
};

export default function ComplianceScreen() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<ComplianceDoc[]>([]);

  useEffect(() => {
    let c = false;
    fetchCompliance()
      .then((d) => { if (!c) setDocs(d); })
      .catch((e) => console.warn('[Compliance] fetch failed', e));
    return () => { c = true; };
  }, []);

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app/more')} />
        <h1 className="text-base font-bold text-gray-900">Compliance Docs</h1>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-2.5">
        <p className="text-[11px] text-gray-500 px-1">
          DPDP 2023 · RBI Master Direction · Policy archive.
        </p>
        {docs.map((d) => (
          <Card key={d.id} className="p-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Pill color={CAT_COLOR[d.category]} bg={CAT_BG[d.category]}>
                  {d.category}
                </Pill>
                <p className="text-[10px] text-gray-400">{d.fileSize}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-snug">{d.title}</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{d.summary}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {d.issuedBy} · {d.date}
              </p>
            </div>
            <button
              className="p-2 rounded-xl flex-shrink-0"
              style={{ background: PSB.greenBg, color: PSB.green }}
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
