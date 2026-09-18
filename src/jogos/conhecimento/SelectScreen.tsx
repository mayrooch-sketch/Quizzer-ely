/**
 * Marque os corretos — 282 itens.
 *
 * A exceção da regra "cabe numa tela": 258 itens têm 6 opções e cabem; 24 têm
 * 10 ou 12 e não cabem. Só por causa desses 24 o miolo rola por dentro — com o
 * enunciado e os botões parados.
 *
 * Quantas marcar precisa estar dito. O banco traz `minCorrect`/`maxCorrect`, e
 * sem esse número o jogo vira adivinhação de quantidade, não de conteúdo.
 *
 * Conferência explícita, não a cada toque: com várias respostas certas,
 * corrigir no meio da escolha atrapalharia quem ainda está montando a resposta.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';

function textoDeQuantas(min: number, max: number): string {
  if (min === max) return `${min} corretas`;
  return `de ${min} a ${max} corretas`;
}

export function SelectScreen() {
  const itens = useItensDoTipo('select');

  const baralho = useBaralho(itens);
  const placar = usePlacar();
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set());
  const [conferido, setConferido] = useState(false);

  if (!baralho.atual) return <SemItens />;

  const item = baralho.atual;
  const { options, minCorrect, maxCorrect } = item.payload;

  function alternar(texto: string) {
    if (conferido) return;
    setMarcadas((antes) => {
      const novo = new Set(antes);
      if (novo.has(texto)) novo.delete(texto);
      else novo.add(texto);
      return novo;
    });
  }

  function conferir() {
    const certo = options.every((o) => o.correct === marcadas.has(o.text));
    setConferido(true);
    placar.registrar(certo);
  }

  function seguir() {
    setMarcadas(new Set());
    setConferido(false);
    baralho.proxima();
  }

  const tudoCerto = options.every((o) => o.correct === marcadas.has(o.text));

  function classe(op: { text: string; correct: boolean }): string {
    if (!conferido) return 'opcao';
    // Depois de conferir: verde no que devia estar marcado, vermelho no que
    // foi marcado e não devia. O que ficou de fora e devia ficar não recebe
    // marca de erro — recebe a de acerto, porque é onde a resposta está.
    if (op.correct) return 'opcao opcao--certa';
    if (marcadas.has(op.text)) return 'opcao opcao--errada';
    return 'opcao';
  }

  return (
    <Arena
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      placar={placar}
      enunciado={item.payload.prompt}
      detalhe={textoDeQuantas(minCorrect, maxCorrect)}
      explicacao={
        conferido ? (
          <Explicacao
            referencia={item.reference}
            comentario={tudoCerto ? item.notes : `As certas estão em verde. ${item.notes}`}
          />
        ) : null
      }
      secundaria={
        conferido
          ? { label: 'Pular', onClick: seguir, disabled: true }
          : { label: 'Limpar', onClick: () => setMarcadas(new Set()), disabled: marcadas.size === 0 }
      }
      primaria={
        conferido
          ? { label: 'Próxima', onClick: seguir }
          : { label: 'Conferir', onClick: conferir, disabled: marcadas.size === 0 }
      }
    >
      {options.map((op) => (
        <button
          key={op.text}
          type="button"
          className={classe(op)}
          aria-pressed={marcadas.has(op.text)}
          onClick={() => alternar(op.text)}
          disabled={conferido}
        >
          <span aria-hidden="true">{marcadas.has(op.text) ? '☑' : '☐'}</span>
          {op.text}
        </button>
      ))}
    </Arena>
  );
}
