/**
 * O que aparece quando o banco ainda não chegou.
 *
 * Cabe a esta tela e não a cada jogo dizer isso, porque o motivo é sempre o
 * mesmo: o banco vem de uma vez, para todos os modos.
 */

import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';

export function SemItens() {
  const carregando = useAppStore((s) => s.carregando);

  return (
    <div className="aviso">
      <p style={{ margin: 0 }}>
        {carregando
          ? 'Baixando as perguntas…'
          : 'Nenhuma pergunta disponível para este modo.'}
      </p>
      {carregando ? null : (
        <p style={{ margin: 'var(--sp-12) 0 0' }}>
          <Link to="/">Voltar ao início</Link>
        </p>
      )}
    </div>
  );
}
