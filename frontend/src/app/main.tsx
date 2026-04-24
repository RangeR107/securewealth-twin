import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import App from './App';
import { useProfileStore } from '../context/profileStore';

// Kick off backend profile fetch on app boot. Falls back to mockData if backend is down.
void useProfileStore.getState().load();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
