/**
 * Verdadeiro ou falso — 464 itens.
 *
 * O modo mais simples dos seis, e por isso o que define o resto: uma afirmação
 * no alto, duas respostas coladas embaixo, nada mais na tela.
 *
 * Aqui o emoji fica. ✅ e ❌ **são** a resposta — não são decoração de botão,
 * que é o caso que a decisão D3 tirou.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';

export function VfScreen() {
  const itens = useItensDoTipo('vf');

  const baralho = useBaralho(itens);
  const placar = usePlacar();
  const [resposta, setResposta] = useState<boolean | null>(null);

  if (!baralho.atual) return <SemItens />;

  const item = baralho.atual;
  const respondido = resposta !== null;
  const acertou = resposta === item.payload.correct;

  function responder(valor: boolean) {
    if (respondido) return;
    setResposta(valor);
    placar.registrar(valor === item.payload.correct);
  }

  function seguir() {
    setResposta(null);
    baralho.proxima();
  }

  /** Verde na certa, vermelho só na errada que foi escolhida. */
  function classe(valor: boolean): string {
    if (!respondido) return 'opcao';
    if (valor === item.payload.correct) return 'opcao opcao--certa';
    if (valor === resposta) return 'opcao opcao--errada';
    return 'opcao';
  }

  return (
    <Arena
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      placar={placar}
      enunciado={item.payload.statement}
      explicacao={
        respondido ? (
          <Explicacao
            referencia={item.reference}
            comentario={acertou ? item.notes : `A resposta certa é ${item.payload.correct ? 'verdadeiro' : 'falso'}. ${item.notes}`}
          />
        ) : null
      }
      secundaria={{ label: 'Pular', onClick: seguir, disabled: respondido }}
      primaria={{ label: 'Próxima', onClick: seguir, disabled: !respondido }}
    >
      <div className="opcoes-grade vf-botoes">
        <button
          type="button"
          className={classe(true)}
          onClick={() => responder(true)}
          disabled={respondido}
        >
          <span aria-hidden="true">✅</span>
          Verdadeiro
        </button>
        <button
          type="button"
          className={classe(false)}
          onClick={() => responder(false)}
          disabled={respondido}
        >
          <span aria-hidden="true">❌</span>
          Falso
        </button>
      </div>
    </Arena>
  );
}
