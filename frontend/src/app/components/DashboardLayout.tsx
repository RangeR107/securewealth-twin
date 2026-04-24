import { Outlet } from 'react-router';
import { BottomNav } from './ui/BottomNav';

export default function DashboardLayout() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Scrollable content area */}
      <div style={{
        flex: 1,
        overflowY: 'scroll',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        <Outlet />
      </div>

      {/* Nav pinned at bottom of phone frame */}
      <div style={{ flexShrink: 0, borderTop: '1px solid #e5e7eb' }}>
        <BottomNav />
      </div>
    </div>
  );
}
