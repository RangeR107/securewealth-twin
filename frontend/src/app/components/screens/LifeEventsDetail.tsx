import { BackArrow, Card, Pill } from '../ui/shared';
import { useProfileStore } from '../../../context/profileStore';

export default function LifeEventsDetail() {
  const { profile } = useProfileStore();
  const e = profile.event;

  const gapItems = [
    {
      icon: '❌',
      color: '#DC2626',
      bg: '#FEF2F2',
      title: `Down Payment Gap — ${e.gap} short`,
      desc: 'Save more before applying for a home loan',
      cta: 'Start Saving Plan',
    },
    {
      icon: '✅',
      color: '#16A34A',
      bg: '#F0FDF4',
      title: 'Emergency Fund — Adequate',
      desc: 'You have 4 months of buffer saved',
      cta: null,
    },
    {
      icon: '🏦',
      color: '#4338CA',
      bg: '#EEF2FF',
      title: `Loan Eligibility — ${e.loan} estimated`,
      desc: 'Based on income, credit score, and tenure',
      cta: 'Check Eligibility',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full pb-6">
      {/* Top Bar */}
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow to="/app/insights" />
        <h1 className="text-base font-bold text-gray-900">Life Event Preparedness</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Banner */}
        <Card
          className="p-6 text-center"
          style={{ background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' }}
        >
          <div className="text-5xl mb-3">🏠</div>
          <h2 className="text-lg font-bold text-gray-900">{e.type} Detected</h2>
          <p className="text-xs text-gray-500 mt-1 mb-3">
            Based on your transaction patterns &amp; browsing
          </p>
          <span className="inline-flex items-center bg-[#16A34A] text-white text-xs font-bold px-4 py-1.5 rounded-full">
            {e.likelihood}% likelihood
          </span>
        </Card>

        {/* Readiness */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Your Readiness Score</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${e.readiness}%`,
                  background:
                    e.readiness > 70 ? '#16A34A' : e.readiness > 40 ? '#D97706' : '#DC2626',
                }}
              />
            </div>
            <span className="text-base font-extrabold text-[#D97706]">{e.readiness}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Improve in 2 areas before you're fully ready
          </p>
        </Card>

        {/* Gap Cards */}
        {gapItems.map((item, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex gap-3 p-3.5 pl-0">
              <div
                className="w-1 rounded-r flex-shrink-0"
                style={{ background: item.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.desc}</p>
                {item.cta && (
                  <Pill color={item.color} bg={item.bg}>
                    {item.cta}
                  </Pill>
                )}
              </div>
            </div>
          </Card>
        ))}

        <button className="w-full py-4 bg-[#4338CA] text-white font-bold text-base rounded-2xl hover:bg-[#3730A3] active:scale-[0.98] transition-all">
          Start Preparing →
        </button>
      </div>
    </div>
  );
}
