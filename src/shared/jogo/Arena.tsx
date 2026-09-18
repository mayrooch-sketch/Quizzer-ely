/**
 * A arena — a casca de toda partida.
 *
 * Três zonas fixas: enunciado no alto, miolo no meio, ações presas embaixo.
 * **Só o miolo rola**, e só quando precisa. Rolar durante um jogo é falha de
 * layout: se as opções saem da tela enquanto o enunciado sobe, perde-se o fio.
 *
 * Medido contra o pior caso do banco num iPhone SE (375×667): o modo `order`,
 * o mais apertado, usa 625px dos 667. Sobram 42px — e é por isso que aqui não
 * há cabeçalho interno nem etiqueta de tipo. O nome do jogo já está na barra
 * do topo.
 *
 * Os dezoito jogos entram aqui. Mexer no espaçamento dos botões passa a ser
 * uma linha, dezoito telas — no app antigo era dezesseis lugares, e é assim
 * que ele foi ficando desalinhado sozinho.
 */

import type { ReactNode } from 'react';
import './arena.css';

export interface AcaoArena {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  /** Quantas cartas já saíram e quantas existem. Vira a barra fina do topo. */
  progresso?: { posicao: number; total: number };
  placar?: { certas: number; erradas: number };
  /** A pergunta, a instrução, a afirmação. Nunca rola. */
  enunciado: ReactNode;
  /** Linha discreta abaixo do enunciado — "4 corretas", "2 de 6 erros". */
  detalhe?: ReactNode;
  /** O miolo. Rola por dentro quando não cabe. */
  children: ReactNode;
  /**
   * Aparece entre o miolo e as ações, depois de responder: a referência e o
   * comentário do autor. Nunca antes — em muitos itens a citação entrega a
   * resposta (decisão D8).
   */
  explicacao?: ReactNode;
  /** À esquerda, apagada. Pular, Limpar, Recomeçar. */
  secundaria?: AcaoArena;
  /** À direita, cor cheia. A que faz o jogo avançar (decisão D6). */
  primaria?: AcaoArena;
}

export function Arena({
  progresso,
  placar,
  enunciado,
  detalhe,
  children,
  explicacao,
  secundaria,
  primaria,
}: Props) {
  const pct =
    progresso && progresso.total > 0
      ? Math.round((progresso.posicao / progresso.total) * 100)
      : 0;

  return (
    <div className="arena">
      {progresso ? (
        <div
          className="arena__barra"
          role="progressbar"
          aria-valuenow={progresso.posicao}
          aria-valuemin={0}
          aria-valuemax={progresso.total}
          aria-label="Progresso da partida"
        >
          <i style={{ width: `${pct}%` }} />
        </div>
      ) : null}

      <div className="arena__topo">
        <div className="arena__enunciado">{enunciado}</div>
        {detalhe ? <p className="arena__detalhe">{detalhe}</p> : null}
      </div>

      {/*
        `tabIndex` num contêiner rolável dá acesso pelo teclado à parte que só
        se alcançava rolando com o dedo — vale para os 24 itens de `select` que
        não cabem.
      */}
      <div className="arena__miolo" tabIndex={0}>
        {children}
      </div>

      {explicacao ? <div className="arena__explicacao">{explicacao}</div> : null}

      <div className="arena__acoes">
        {placar ? (
          <span className="arena__placar" aria-label="Placar">
            <b className="ok">{placar.certas}</b>
            <b className="no">{placar.erradas}</b>
          </span>
        ) : null}

        {secundaria ? (
          <button
            type="button"
            className="arena__btn arena__btn--ghost"
            onClick={secundaria.onClick}
            disabled={secundaria.disabled}
          >
            {secundaria.label}
          </button>
        ) : null}

        {primaria ? (
          <button
            type="button"
            className="arena__btn"
            onClick={primaria.onClick}
            disabled={primaria.disabled}
          >
            {primaria.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * A referência e o comentário, mostrados depois da resposta.
 *
 * Todos os 3516 registros do banco têm os dois preenchidos, então esta caixa
 * nunca aparece vazia.
 */
export function Explicacao({
  referencia,
  comentario,
}: {
  referencia: string;
  comentario: string;
}) {
  return (
    <>
      {referencia ? <p className="expl__ref">📖 {referencia}</p> : null}
      {comentario ? <p className="expl__nota">{comentario}</p> : null}
    </>
  );
}
