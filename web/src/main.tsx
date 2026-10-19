import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.css';

const root = document.getElementById('root')!;
const app = <StrictMode><App /></StrictMode>;
// The production build ships pre-rendered HTML (scripts/prerender.mjs); hydrate it. In dev, render fresh.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
