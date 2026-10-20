import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { VitalsApp } from './VitalsApp';
import '../styles/global.css';
import './vitals.css';

createRoot(document.getElementById('root')!).render(<StrictMode><VitalsApp /></StrictMode>);
