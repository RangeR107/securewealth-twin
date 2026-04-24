import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BackArrow, Card, Pill, PSB } from '../ui/shared';
import { useProfileStore } from '../../../context/profileStore';
import {
  fetchNotifications,
  markNotificationRead,
  type NotificationItem,
} from '../../../data/api';

const SEV_COLOR = { info: PSB.green, warning: PSB.yellow, critical: PSB.red };
const SEV_BG    = { info: PSB.greenBg, warning: PSB.yellowBg, critical: PSB.redBg };

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { activeProfile } = useProfileStore();
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let c = false;
    fetchNotifications(activeProfile)
      .then((n) => { if (!c) setItems(n); })
      .catch((e) => console.warn('[Notifications] fetch failed', e));
    return () => { c = true; };
  }, [activeProfile]);

  const handleClick = async (n: NotificationItem) => {
    if (n.read) return;
    try {
      const updated = await markNotificationRead(activeProfile, n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? updated : x)));
    } catch (e) {
      console.warn('[Notifications] mark read failed', e);
    }
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="min-h-full" style={{ background: PSB.offWhite }}>
      <div className="bg-white px-4 pt-12 pb-3.5 flex items-center gap-2 border-b border-gray-100">
        <BackArrow onClick={() => navigate('/app/more')} />
        <h1 className="text-base font-bold text-gray-900">Notifications</h1>
        {unread > 0 && (
          <Pill color={PSB.red} bg={PSB.redBg} className="ml-auto">
            {unread} new
          </Pill>
        )}
      </div>

      <div className="px-4 pt-4 pb-6 space-y-2.5">
        {items.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8">No notifications yet.</p>
        )}
        {items.map((n) => (
          <Card
            key={n.id}
            className="p-3.5 flex items-start gap-3"
            onClick={() => handleClick(n)}
            style={{
              borderLeft: `4px solid ${SEV_COLOR[n.severity]}`,
              opacity: n.read ? 0.75 : 1,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: SEV_BG[n.severity] }}
            >
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: SEV_COLOR[n.severity] }} />
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5 leading-snug">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.timestamp)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
