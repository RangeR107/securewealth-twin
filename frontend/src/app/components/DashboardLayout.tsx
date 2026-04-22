import { Outlet } from 'react-router';
import { BottomNav } from './ui/BottomNav';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
