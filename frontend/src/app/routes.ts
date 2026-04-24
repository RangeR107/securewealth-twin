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
import TransferScreen from './components/screens/TransferScreen';
import TransactionsScreen from './components/screens/TransactionsScreen';
import KycScreen from './components/screens/KycScreen';
import NotificationsScreen from './components/screens/NotificationsScreen';
import ComplianceScreen from './components/screens/ComplianceScreen';
import HelpScreen from './components/screens/HelpScreen';

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
      { path: 'transfer', Component: TransferScreen },
      { path: 'transactions', Component: TransactionsScreen },
      { path: 'kyc', Component: KycScreen },
      { path: 'notifications', Component: NotificationsScreen },
      { path: 'compliance', Component: ComplianceScreen },
      { path: 'help', Component: HelpScreen },
    ],
  },
]);
