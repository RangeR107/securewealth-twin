import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronDown } from 'lucide-react';
import { BackArrow, Card, PSB } from '../ui/shared';
import { fetchHelp, type HelpFaq } from '../../../data/api';

export default function HelpScreen() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<HelpFaq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let c = false;
    fetchHelp()
      .then((f) => { if (!c) setFaqs(f); })
      .catch((e) => console.warn('[Help] fetch failed', e));
    return () => { c = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return faqs;
    const q = query.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app/more')} />
        <h1 className="text-base font-bold text-gray-900">Help &amp; Support</h1>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 border border-gray-200 focus-within:border-[#1A6B3C]">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help…"
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No matching help articles.</p>
        )}

        {filtered.map((f) => {
          const open = openId === f.id;
          return (
            <Card
              key={f.id}
              className="p-4"
              onClick={() => setOpenId(open ? null : f.id)}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest">
                    {f.category.toUpperCase()}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{f.question}</p>
                </div>
                <ChevronDown
                  className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform"
                  style={{ transform: open ? 'rotate(180deg)' : undefined }}
                />
              </div>
              {open && (
                <p className="text-xs text-gray-600 mt-3 leading-relaxed">{f.answer}</p>
              )}
            </Card>
          );
        })}

        <Card className="p-4 mt-2" style={{ background: PSB.greenBg }}>
          <p className="text-xs font-bold text-gray-900">Still need help?</p>
          <p className="text-[11px] text-gray-600 mt-1 leading-snug">
            Call our 24×7 helpline at <b>1800-419-8300</b> or email{' '}
            <b>help@punjabsindbank.co.in</b>.
          </p>
        </Card>
      </div>
    </div>
  );
}
