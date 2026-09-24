/**
 * Complete a frase — sempre quatro alternativas.
 *
 * A lacuna é sublinhada e larga, não três traços baixos: quando a resposta
 * entra, ela aparece ali dentro, e o olho não precisa sair da frase para
 * conferir o que escolheu.
 *
 * As quatro alternativas cabem em grade 2×2 — todas na zona do polegar, em vez
 * de a última empurrar as outras para cima.
 */

import { useMemo, useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { embaralhar, useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';
import './conhecimento.css';

/** A frase com a lacuna preenchida pelo que foi escolhido, ou vazia. */
function Frase({ sentence, escolha }: { sentence: string; escolha: string | null }) {
  // O banco marca a lacuna com uma corrida de sublinhados.
  const partes = sentence.split(/_{2,}/);

  if (partes.length === 1) {
    // Sem marca de lacuna: mostra a frase como está, sem inventar buraco.
    return <>{sentence}</>;
  }

  return (
    <>
      {partes.map((parte, i) => (
        <span key={i}>
          {parte}
          {i < partes.length - 1 ? (
            <span className="lacuna">{escolha ?? ' '}</span>
          ) : null}
        </span>
      ))}
    </>
  );
}

export function ClozeScreen() {
  const itens = useItensDoTipo('cloze');

  const baralho = useBaralho(itens);
  const opcoes = useMemo(() => embaralhar(baralho.atual?.payload.choices ?? []), [baralho.atual]);
  const placar = usePlacar();
  const [escolha, setEscolha] = useState<string | null>(null);

  if (!baralho.atual) return <SemItens />;

  const item = baralho.atual;
  const respondido = escolha !== null;
  const acertou = escolha === item.payload.answer;

  function responder(valor: string) {
    if (respondido) return;
    setEscolha(valor);
    placar.registrar(valor === item.payload.answer);
  }

  function seguir() {
    setEscolha(null);
    baralho.proxima();
  }

  function classe(valor: string): string {
    if (!respondido) return 'opcao';
    if (valor === item.payload.answer) return 'opcao opcao--certa';
    if (valor === escolha) return 'opcao opcao--errada';
    return 'opcao';
  }

  return (
    <Arena
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      placar={placar}
      enunciado={
        <Frase sentence={item.payload.sentence} escolha={escolha} />
      }
      detalhe={item.payload.prompt}
      explicacao={
        respondido ? (
          <Explicacao
            referencia={item.reference}
            comentario={
              acertou ? item.notes : `A resposta é "${item.payload.answer}". ${item.notes}`
            }
          />
        ) : null
      }
      secundaria={{ label: 'Pular', onClick: seguir, disabled: respondido }}
      primaria={{ label: 'Próxima', onClick: seguir, disabled: !respondido }}
    >
      <div className="opcoes-grade">
        {opcoes.map((op) => (
          <button
            key={op}
            type="button"
            className={classe(op)}
            onClick={() => responder(op)}
            disabled={respondido}
          >
            {op}
          </button>
        ))}
      </div>
    </Arena>
  );
}
