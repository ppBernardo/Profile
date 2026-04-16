import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useGLTF } from '@react-three/drei';
import App from './App.tsx';
import './index.css';

// Pré-carrega os modelos 3D imediatamente ao iniciar a app
useGLTF.preload('/darth_vader_helmet.glb');
useGLTF.preload('/lightsaber_red.glb');
useGLTF.preload('/3d_t.i.e_fighter_-_star_wars_model.glb');
useGLTF.preload('/death_star_-_star_wars.glb');
useGLTF.preload('/r2d2.glb');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
