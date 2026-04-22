import { createBrowserRouter } from 'react-router';

import LoginScreen from './components/screens/LoginScreen';
import OTPScreen from './components/screens/OTPScreen';
import DashboardLayout from './components/DashboardLayout';
import HomeTab from './components/screens/HomeTab';
import InsightsTab from './components/screens/InsightsTab';
import SecurityTab from './components/screens/SecurityTab';
import MoreTab from './components/screens/MoreTab';
import LifeEventsDetail from './components/screens/LifeEventsDetail';
import FraudAlert from './components/screens/FraudAlert';
import AIAdvisor from './components/screens/AIAdvisor';
import GuardianSetup from './components/screens/GuardianSetup';
import OfficerView from './components/screens/OfficerView';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginScreen,
  },
  {
    path: '/otp',
    Component: OTPScreen,
  },
  {
    path: '/fraud-alert',
    Component: FraudAlert,
  },
  {
    path: '/guardian-setup',
    Component: GuardianSetup,
  },
  {
    path: '/officer',
    Component: OfficerView,
  },
  {
    path: '/app',
    Component: DashboardLayout,
    children: [
      { index: true, Component: HomeTab },
      { path: 'insights', Component: InsightsTab },
      { path: 'security', Component: SecurityTab },
      { path: 'more', Component: MoreTab },
      { path: 'life-events', Component: LifeEventsDetail },
      { path: 'advisor', Component: AIAdvisor },
    ],
  },
]);
