import { useNavigate, useLocation } from 'react-router';
import { Home, BarChart3, Shield, Grid3x3 } from 'lucide-react';

const TABS = [
  { path: '/app', label: 'Home', Icon: Home },
  { path: '/app/insights', label: 'Insights', Icon: BarChart3 },
  { path: '/app/security', label: 'Security', Icon: Shield },
  { path: '/app/more', label: 'More', Icon: Grid3x3 },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/app' ? pathname === '/app' : pathname.startsWith(path);

  return (
    <div
      className="bg-white border-t border-gray-200 flex justify-around items-center flex-shrink-0"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))', paddingTop: '0.5rem' }}
    >
      {TABS.map(({ path, label, Icon }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 px-5 py-1.5 relative transition-all"
          >
            {active && (
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4338CA] rounded-full" />
            )}
            <Icon
              className={`w-[22px] h-[22px] ${active ? 'text-[#4338CA]' : 'text-gray-400'}`}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <span className={`text-[10px] font-medium ${active ? 'text-[#4338CA]' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
