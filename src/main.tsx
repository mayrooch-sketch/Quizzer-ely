import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import './styles/global.css';

const raiz = document.getElementById('root');
if (!raiz) throw new Error('Elemento #root não encontrado no index.html');

createRoot(raiz).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

/*
 * O service worker é o que faz o app abrir sem internet (ver `public/sw.js`).
 *
 * Só em produção: em desenvolvimento ele ficaria entre o Vite e a página,
 * servindo do cache o arquivo que acabou de ser editado — e a edição pareceria
 * não ter acontecido.
 *
 * A falha é silenciosa de propósito. Sem service worker o app funciona
 * exatamente igual, só não abre offline; avisar disso seria assustar quem não
 * perdeu nada.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
