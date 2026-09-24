/**
 * O baralho de uma partida.
 *
 * Embaralha uma vez e vai tirando de cima. Nada repete antes de tudo ter
 * saído — que é a única forma de 464 afirmações não virarem as mesmas seis a
 * cada sessão.
 *
 * O app antigo já fazia isso no quiz e no contra-relógio, com uma fila
 * embaralhada por jogo. Aqui a fila é uma só, escrita uma vez, e os seis modos
 * de conhecimento passaram a usá-la também — lá eles sorteavam solto.
 */

import { useCallback, useMemo, useState } from 'react';

export interface Baralho<T> {
  /** A carta na mesa. `null` só quando não há nenhuma. */
  atual: T | null;
  /** Quantas já saíram, contando a atual. */
  posicao: number;
  total: number;
  /** Tira a próxima. No fim do baralho, embaralha de novo e recomeça. */
  proxima: () => void;
}

export function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function useBaralho<T>(itens: readonly T[]): Baralho<T> {
  /*
   * Embaralha quando `itens` troca de referência — e é por isso que quem
   * chama **precisa** passar um array estável (ver `useItensDoTipo`).
   *
   * Com um array novo a cada render, isto reembaralha a cada render, e a carta
   * na mesa muda debaixo do dedo de quem está respondendo. Foi exatamente esse
   * o bug encontrado ao testar os seis modos.
   */
  const ordem = useMemo(() => embaralhar(itens), [itens]);
  const [indice, setIndice] = useState(0);

  const proxima = useCallback(() => {
    setIndice((i) => (ordem.length === 0 ? 0 : (i + 1) % ordem.length));
  }, [ordem.length]);

  return {
    atual: ordem[indice] ?? null,
    posicao: ordem.length === 0 ? 0 : indice + 1,
    total: ordem.length,
    proxima,
  };
}

/**
 * O placar de uma partida.
 *
 * Separado do baralho porque nem todo jogo pontua igual — a associação conta
 * pares certos, a ordem conta posições —, mas todos mostram a mesma dupla no
 * mesmo canto da tela.
 */
export interface Placar {
  certas: number;
  erradas: number;
  registrar: (acertou: boolean) => void;
  zerar: () => void;
}

export function usePlacar(): Placar {
  const [certas, setCertas] = useState(0);
  const [erradas, setErradas] = useState(0);

  const registrar = useCallback((acertou: boolean) => {
    if (acertou) setCertas((n) => n + 1);
    else setErradas((n) => n + 1);
  }, []);

  const zerar = useCallback(() => {
    setCertas(0);
    setErradas(0);
  }, []);

  return { certas, erradas, registrar, zerar };
}
