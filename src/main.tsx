import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import './services/story/dataIntegrity';
import { cleanupLegacyMapArtifacts } from './services/cleanup/legacyMapCleanup';

cleanupLegacyMapArtifacts();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
