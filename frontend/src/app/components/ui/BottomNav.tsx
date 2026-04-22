import { useNavigate, useLocation } from 'react-router';
import { Home, BarChart3, Shield, Grid3x3 } from 'lucide-react';
import { PSB } from './shared';

const TABS = [
  { path: '/app',            label: 'Home',     Icon: Home     },
  { path: '/app/insights',   label: 'Insights', Icon: BarChart3 },
  { path: '/app/security',   label: 'Security', Icon: Shield   },
  { path: '/app/more',       label: 'More',     Icon: Grid3x3  },
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
              <div
                className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                style={{ background: PSB.green }}
              />
            )}
            <Icon
              className="w-[22px] h-[22px]"
              style={{ color: active ? PSB.green : '#9CA3AF' }}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? PSB.green : '#9CA3AF' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
