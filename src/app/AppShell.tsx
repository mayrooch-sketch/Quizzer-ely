/**
 * Casca do app.
 *
 * Topo com o nome da tela e, fora da home, a seta de voltar. Não há menu
 * lateral: os dezesseis jogos cabem na home, e um menu seria um segundo
 * caminho para a mesma lista.
 *
 * A seta volta sempre para a home, e não para a tela anterior do histórico.
 * Sair de uma partida para cair no meio de outra partida é o tipo de volta que
 * confunde — quem toca em voltar quer escolher outro jogo.
 */

import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { jogoPorId } from './games';
import { useAppStore } from './store';

/**
 * O jogo aberto, ou nada na home.
 *
 * Devolve o registro inteiro porque a casca precisa de duas coisas dele: o
 * título do topo e o grupo, que pinta a faixa e tudo o que a partida desenhar.
 */
function jogoDaRota(pathname: string) {
  if (pathname === '/' || pathname === '') return undefined;
  return jogoPorId(pathname.replace(/^\/jogo\//, ''));
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const iniciar = useAppStore((s) => s.iniciar);

  // Abre com o cache e confere a rede uma vez, na montagem.
  useEffect(() => {
    iniciar();
  }, [iniciar]);

  const naHome = location.pathname === '/';
  const jogo = jogoDaRota(location.pathname);

  return (
    /* Sem jogo aberto o atributo não sai, e `--c-grupo` continua na primária. */
    <div className="shell" data-grupo={jogo?.grupo}>
      <header className="topbar">
        {naHome ? null : (
          <button
            type="button"
            className="topbar__back"
            aria-label="Voltar para o início"
            onClick={() => navigate('/')}
          >
            ‹
          </button>
        )}
        <h1 className="topbar__title">{jogo?.label ?? 'Quizzer'}</h1>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="bottombar" aria-hidden="true" />
    </div>
  );
}
