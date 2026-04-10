import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const VERSION_CHECK_INTERVAL_MS = 60_000;

async function checkForNewVersion() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}version.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { version?: string };
    if (data.version && data.version !== __APP_VERSION__) {
      window.location.reload();
    }
  } catch {
    // Ignore transient network or cache failures.
  }
}

void checkForNewVersion();
window.setInterval(() => {
  void checkForNewVersion();
}, VERSION_CHECK_INTERVAL_MS);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
