/**
 * A fila de palavras do anagrama e da forca.
 *
 * Mesma ideia do baralho dos outros jogos — embaralha uma vez e vai tirando de
 * cima —, com uma diferença: as palavras que **acabaram de sair nos outros
 * jogos de palavra** vão para o fim da fila. Os quatro bebem do mesmo poço de
 * 352 palavras, e sem isso era comum sair da forca com uma palavra e cair no
 * anagrama com a mesma.
 *
 * Não é proibição. Se o poço apertar, as recentes voltam a sair — o que não
 * pode é o app parecer ter meia dúzia de palavras.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { marcarUsadas, priorizarNovas } from '../../shared/palavras/memoria';
import { usePocoDePalavras, type PalavraDoBanco } from '../../shared/palavras/poco';

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export interface FilaDePalavras {
  palavra: PalavraDoBanco | null;
  /** Quantas já saíram, contando a atual. */
  posicao: number;
  total: number;
  proxima: () => void;
}

export function useFilaDePalavras(maxLetras: number): FilaDePalavras {
  const poco = usePocoDePalavras(maxLetras);

  /*
   * A ordem é decidida uma vez, quando o poço chega. Refazê-la a cada render
   * trocaria a palavra debaixo do dedo de quem está jogando — foi exatamente
   * esse o bug dos seis modos de conhecimento.
   */
  const ordem = useMemo(() => {
    const { novas, repetidas } = priorizarNovas(poco);
    return [...embaralhar(novas), ...embaralhar(repetidas)];
  }, [poco]);

  const [indice, setIndice] = useState(0);
  const palavra = ordem[indice] ?? null;

  /* A palavra da vez sai da fila dos outros jogos enquanto estiver na tela. */
  useEffect(() => {
    if (palavra) marcarUsadas([palavra.palavra]);
  }, [palavra]);

  const proxima = useCallback(() => {
    setIndice((i) => (ordem.length === 0 ? 0 : (i + 1) % ordem.length));
  }, [ordem.length]);

  return {
    palavra,
    posicao: ordem.length === 0 ? 0 : indice + 1,
    total: ordem.length,
    proxima,
  };
}

/**
 * Embaralha as letras de uma palavra, evitando dois resultados.
 *
 * Evita a própria palavra — um anagrama que sai igual à resposta não é
 * charada — e evita o embaralhamento anterior, para que tocar em "embaralhar"
 * sempre mude alguma coisa. Dezoito tentativas: palavras como "ANA", com
 * poucas permutações possíveis, não travam o laço.
 */
export function embaralharLetras(palavra: string, evitar?: string): string {
  const letras = [...palavra];
  let saida = palavra;

  for (let t = 0; t < 18; t++) {
    for (let i = letras.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    saida = letras.join('');
    if (saida !== palavra && saida !== evitar) break;
  }

  return saida;
}
