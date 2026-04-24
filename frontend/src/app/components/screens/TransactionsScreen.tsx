import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { BackArrow, Card, Pill, PSB } from '../ui/shared';
import { useProfileStore } from '../../../context/profileStore';
import {
  fetchNarratedTransactions,
  type TransactionNarrative,
} from '../../../data/api';

const TAG_COLOR: Record<string, string> = {
  frequent: PSB.yellow,
  recurring: PSB.greenMid,
  higher: PSB.red,
  scheduled: PSB.green,
  income: PSB.green,
};

const TAG_BG: Record<string, string> = {
  frequent: PSB.yellowBg,
  recurring: PSB.greenBg,
  higher: PSB.redBg,
  scheduled: PSB.greenBg,
  income: PSB.greenBg,
};

export default function TransactionsScreen() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  const [items, setItems] = useState<TransactionNarrative[]>([]);
  const [filter, setFilter] = useState<'all' | 'spend' | 'income'>('all');

  useEffect(() => {
    let c = false;
    fetchNarratedTransactions(activeProfile, 40)
      .then((r) => { if (!c) setItems(r.items); })
      .catch((e) => console.warn('[Transactions] fetch failed', e));
    return () => { c = true; };
  }, [activeProfile]);

  const filtered = useMemo(() => {
    if (filter === 'spend')  return items.filter((t) => t.amount > 0);
    if (filter === 'income') return items.filter((t) => t.amount < 0);
    return items;
  }, [items, filter]);

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app')} />
        <h1 className="text-base font-bold text-gray-900">Transactions</h1>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-3">
        {/* Filter */}
        <div className="flex bg-gray-200 rounded-2xl p-1.5 gap-1">
          {(['all', 'spend', 'income'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === k ? 'bg-white shadow-sm' : 'text-gray-500'
              }`}
              style={filter === k ? { color: PSB.green } : undefined}
            >
              {k === 'all' ? 'All' : k === 'spend' ? 'Spend' : 'Income'}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8">No transactions.</p>
        )}

        <Card className="overflow-hidden">
          {filtered.map((tx, i) => (
            <div
              key={tx.id}
              className="flex items-start gap-3 p-3.5"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
                style={{ background: PSB.greenBg }}>
                {tx.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{tx.merchant}</p>
                  <p className={`text-sm font-bold flex-shrink-0 ${tx.amount < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount < 0 ? '+' : '−'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{tx.narrative}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-gray-400">
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                  {tx.tag && (
                    <Pill color={TAG_COLOR[tx.tag] ?? PSB.gray} bg={TAG_BG[tx.tag] ?? '#F3F4F6'}>
                      {tx.tag}
                    </Pill>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
