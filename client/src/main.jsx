import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { startAppVersionPolling } from './utils/appVersion';

startAppVersionPolling();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
