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

import { useCallback, useEffect, useRef, useState } from 'react';

export interface Baralho<T> {
  /** A carta na mesa. `null` só quando não há nenhuma. */
  atual: T | null;
  /** Quantas já saíram, contando a atual. */
  posicao: number;
  total: number;
  rodada: number;
  /** Tira a próxima. No fim do baralho, embaralha de novo e recomeça. */
  proxima: () => void;
  voltar: () => void;
}

export function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function useBaralho<T>(itens: readonly T[], misturar: (itens: readonly T[]) => T[] = embaralhar): Baralho<T> {
  /*
   * Mantém um retrato do banco até o fim do ciclo. Atualizações entram apenas
   * no próximo embaralhamento, sem trocar a pergunta durante uma resposta.
   * O número da rodada também reinicia telas quando há apenas uma carta.
   */
  type Estado = { ordem: T[]; indice: number; rodada: number; anterior?: Estado };
  const fonte = useRef({ itens, misturar });
  useEffect(() => { fonte.current = { itens, misturar }; }, [itens, misturar]);
  const [estado, setEstado] = useState<Estado>(() => ({ ordem: misturar(itens), indice: 0, rodada: 0 }));
  const { ordem, indice } = estado;
  if (ordem.length === 0 && itens.length > 0) {
    setEstado({ ordem: misturar(itens), indice: 0, rodada: estado.rodada });
  }

  const proxima = useCallback(() => {
    setEstado((atual) => {
      const anterior = { ordem: atual.ordem, indice: atual.indice, rodada: atual.rodada };
      const rodada = atual.rodada + 1;
      if (atual.indice + 1 < atual.ordem.length) return { ...atual, indice: atual.indice + 1, rodada, anterior };
      const nova = fonte.current.misturar(fonte.current.itens);
      if (nova.length > 1 && nova[0] === atual.ordem[atual.indice]) [nova[0], nova[1]] = [nova[1], nova[0]];
      return { ordem: nova, indice: 0, rodada, anterior };
    });
  }, []);

  return {
    atual: ordem[indice] ?? null,
    posicao: ordem.length === 0 ? 0 : indice + 1,
    total: ordem.length,
    rodada: estado.rodada,
    proxima,
    voltar: () => setEstado((atual) => atual.anterior ?? atual),
  };
}

/**
 * O placar de uma partida.
 *
 * Separado do baralho: Associação e Ordem contam a rodada inteira;
 * Referência conta cada porta. Os detalhes de cada regra ficam na tela.
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
