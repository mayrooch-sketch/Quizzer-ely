/**
 * Os itens de um tipo do Knows, com referência estável.
 *
 * **Existe por causa de um bug, e o bug vale ficar registrado.** Os seis modos
 * faziam cada um o seu `knows.filter(i => i.type === 'vf')` direto no corpo do
 * componente. `.filter()` devolve um array novo a cada render — e o baralho,
 * que embaralha quando a lista muda, entendia "lista nova" e reembaralhava.
 *
 * O efeito na tela: **tocar numa alternativa trocava a pergunta**. A pessoa
 * respondia uma coisa e a explicação falava de outra. Nada quebrava, nada
 * aparecia no console; só o jogo ficava sem sentido.
 *
 * Aqui o `useMemo` depende de `knows`, que vem do estado global e só troca
 * quando o banco troca de verdade — do cache para a rede, uma vez por sessão.
 */

import { useMemo } from 'react';
import { useKnows } from '../../app/store';
import type { KnowsItemOf, KnowsType } from '../types/bank';

export function useItensDoTipo<T extends KnowsType>(tipo: T): KnowsItemOf<T>[] {
  const knows = useKnows();
  return useMemo(
    () => knows.filter((i): i is KnowsItemOf<T> => i.type === tipo),
    [knows, tipo],
  );
}
