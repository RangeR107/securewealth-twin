import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, TrendingUp, ArrowRight } from 'lucide-react';
import { useProfileStore } from '../../../context/profileStore';
import { Card, Pill, PSB } from '../ui/shared';
import { SCENARIOS } from '../../../data/mockData';
import type { ScenarioKey } from '../../../data/mockData';
import { fetchPeerBenchmark, type PeerBenchmark } from '../../../data/api';

export default function InsightsTab() {
  const navigate = useNavigate();
  const { profile, activeProfile } = useProfileStore();
  const [scenario, setScenario] = useState<ScenarioKey>('normal');
  const s = SCENARIOS[scenario];

  const [bench, setBench] = useState<PeerBenchmark | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const b = await fetchPeerBenchmark(activeProfile);
        if (!cancelled) setBench(b);
      } catch (e) {
        console.warn('[InsightsTab] peer-benchmark failed — using static UI', e);
      }
    })();
    return () => { cancelled = true; };
  }, [activeProfile]);

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-base font-bold text-gray-900">Market Insights</h1>
          <p className="text-xs text-gray-400">Personalized for {profile.name}</p>
        </div>
        <button className="relative p-1">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#DC2626] rounded-full border border-white" />
        </button>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-4">
        {/* ── Scenario Toggle ── */}
        <div className="flex bg-gray-200 rounded-2xl p-1.5 gap-1">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                scenario === key
                  ? 'bg-white text-[#4338CA] shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>

        {/* ── Scenario Banner ── */}
        <Card style={{ background: s.bg }} className="p-4">
          <p className="text-sm font-bold mb-3" style={{ color: s.color }}>
            📡 Scenario: {s.label}
          </p>
          <div className="flex gap-2">
            {[
              ['Inflation', s.inflation],
              ['RBI Rate', s.rbi],
              ['Equity', s.equity],
            ].map(([label, val]) => (
              <div key={label} className="flex-1 bg-white/70 rounded-xl p-2 text-center">
                <p className="text-[9px] text-gray-500 font-semibold">{label}</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Recommendations ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Recommendations for You</h3>
          <div className="space-y-2.5">
            {s.recs.map((rec, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl flex-shrink-0">{rec.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 mb-1">{rec.title}</p>
                    <p className="text-xs text-gray-500 mb-3">{rec.desc}</p>
                    <Pill color="#4338CA">{rec.cta}</Pill>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Life Event Radar ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Life Event Radar</h3>
          <Card className="p-4" onClick={() => navigate('/app/life-events')}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏠</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{profile.event.type} Detected</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profile.event.likelihood}% likelihood based on your patterns
                </p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all"
                    style={{ width: `${profile.event.readiness}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#16A34A] font-semibold mt-1">
                  {profile.event.readiness}% ready
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate('/app/life-events'); }}
                className="flex items-center gap-1 bg-[#4338CA] text-white px-3 py-2 rounded-xl text-xs font-bold flex-shrink-0"
              >
                Prepare <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </Card>
        </div>

        {/* ── Peer Benchmark (live) ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Peer Benchmarking</h3>
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#4338CA]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {bench ? bench.cohort : `vs. similar ${profile.type} profiles`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {bench ? bench.narrative : 'Loading cohort data…'}
                </p>
              </div>
            </div>

            {bench && (
              <>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-extrabold" style={{ color: PSB.green }}>
                    {bench.percentile}
                    <span className="text-xs text-gray-400 font-semibold ml-0.5">%ile</span>
                  </span>
                  <span className="text-xs text-gray-500 pb-1">
                    — you {bench.yourScore} vs peers {bench.cohortAverage}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden relative">
                  <div
                    className="absolute top-0 h-full w-0.5 bg-gray-400"
                    style={{ left: `${bench.cohortAverage}%` }}
                  />
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${bench.yourScore}%`, background: PSB.green }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {bench.compareTo.map((c) => (
                    <div key={c.metric} className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400">{c.metric}</p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <p className="text-sm font-extrabold" style={{ color: c.better ? PSB.green : PSB.yellow }}>
                          {c.you}
                        </p>
                        <p className="text-[10px] text-gray-400">vs {c.peers}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!bench && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Savings Rate', profile.savings, '#16A34A'],
                  ['Risk Score', `${profile.immuneScore}`, '#4338CA'],
                  ['Goals', `${profile.goals} active`, '#D97706'],
                ].map(([lbl, val, color]) => (
                  <div key={lbl} className="bg-gray-50 rounded-xl p-2.5 text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">{lbl}</p>
                    <p className="text-xs font-bold" style={{ color }}>{val}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
