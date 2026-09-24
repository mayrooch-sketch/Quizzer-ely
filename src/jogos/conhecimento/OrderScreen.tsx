/**
 * Ordem — de três a seis passos.
 *
 * A tela que define o limite de todas as outras: itens longos usam o miolo
 * rolável, preservando o enunciado e as ações num iPhone SE.
 * Se alguma coisa crescer, é aqui que estoura primeiro — e é por isso que aqui
 * não há cabeçalho interno nem margem generosa.
 *
 * **Setas, não arrastar.** Arrastar numa lista dentro de uma página que rola é
 * o gesto que mais falha no celular. As setas sempre funcionam, e a de cima do
 * primeiro item fica desligada em vez de sumir: botão que some muda o alvo dos
 * outros no meio do toque.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar, type Placar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';
import type { KnowsItemOf } from '../../shared/types/bank';
import './conhecimento.css';

/**
 * Embaralha garantindo que a ordem inicial **não** seja a certa.
 *
 * Sortear solto entrega a resposta pronta uma vez a cada 120 rodadas — e é
 * exatamente a rodada que faz a pessoa achar que o jogo está quebrado.
 */
function embaralharDiferente(itens: readonly string[]): string[] {
  if (itens.length < 2) return [...itens];

  for (let tentativa = 0; tentativa < 20; tentativa++) {
    const c = [...itens];
    for (let i = c.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [c[i], c[j]] = [c[j], c[i]];
    }
    if (c.some((t, i) => t !== itens[i])) return c;
  }
  // Improvável: devolve com os dois primeiros trocados.
  const c = [...itens];
  [c[0], c[1]] = [c[1], c[0]];
  return c;
}

export function OrderScreen() {
  const itens = useItensDoTipo('order');

  const baralho = useBaralho(itens);
  const placar = usePlacar();

  if (!baralho.atual) return <SemItens />;

  /*
   * `key` no item: cada rodada é um componente novo, então a ordem embaralhada
   * nasce no `useState` e some junto com a rodada. Sem isso seria preciso um
   * efeito para reembaralhar na troca de item — e efeito que chama `setState`
   * é um render a mais e um lugar a mais para errar.
   */
  return (
    <Rodada
      key={baralho.atual.id}
      item={baralho.atual}
      placar={placar}
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      aoSeguir={baralho.proxima}
    />
  );
}

function Rodada({
  item,
  placar,
  progresso,
  aoSeguir,
}: {
  item: KnowsItemOf<'order'>;
  placar: Placar;
  progresso: { posicao: number; total: number };
  aoSeguir: () => void;
}) {
  const certa = item.payload.items;
  const [ordem, setOrdem] = useState(() => embaralharDiferente(certa));
  const [conferido, setConferido] = useState(false);
  const [mostrarOrdem, setMostrarOrdem] = useState(false);

  function mover(de: number, para: number) {
    if (conferido || para < 0 || para >= ordem.length) return;
    setOrdem((atual) => {
      const c = [...atual];
      [c[de], c[para]] = [c[para], c[de]];
      return c;
    });
  }

  function conferir() {
    setConferido(true);
    placar.registrar(ordem.every((t, i) => t === certa[i]));
  }

  const acertos = ordem.filter((t, i) => t === certa[i]).length;

  return (
    <Arena
      progresso={progresso}
      placar={placar}
      enunciado={item.payload.prompt}
      detalhe={
        conferido ? `${mostrarOrdem ? 'Ordem correta. Sua tentativa: ' : ''}${acertos} de ${certa.length} posições certas` : undefined
      }
      explicacao={
        conferido ? (
          <Explicacao referencia={item.reference} comentario={item.notes} />
        ) : null
      }
      secundaria={
        conferido
          ? { label: mostrarOrdem ? 'Sua ordem' : 'Ver ordem correta', onClick: () => setMostrarOrdem((atual) => !atual) }
          : {
              label: 'Recomeçar',
              onClick: () => setOrdem(embaralharDiferente(certa)),
            }
      }
      primaria={
        conferido
          ? { label: 'Próxima', onClick: aoSeguir }
          : { label: 'Conferir', onClick: conferir }
      }
    >
      <ol className="ordem">
        {(mostrarOrdem ? certa : ordem).map((texto, i) => {
          const estado = !conferido
            ? ''
            : mostrarOrdem || texto === certa[i]
              ? ' ordem__item--certa'
              : ' ordem__item--errada';
          return (
            <li className={`ordem__item${estado}`} key={texto}>
              <span className="ordem__n">{i + 1}</span>
              <span className="ordem__texto">{texto}</span>
              {conferido ? null : (
                <span className="ordem__setas">
                  <button
                    type="button"
                    aria-label={`Subir: ${texto}`}
                    onClick={() => mover(i, i - 1)}
                    disabled={i === 0}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label={`Descer: ${texto}`}
                    onClick={() => mover(i, i + 1)}
                    disabled={i === ordem.length - 1}
                  >
                    ▼
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Arena>
  );
}
