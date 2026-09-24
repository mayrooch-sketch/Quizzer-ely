import { createContext, useContext, useEffect } from 'react';
import type { Nivel } from './modelo';
export interface Contexto {
  nivel: Nivel;
  atual: (item: unknown) => void;
  registrar: (acertou: boolean, item?: unknown, ajuda?: boolean) => void;
  ajudar: () => void;
}
export const ContextoSessao = createContext<Contexto | null>(null);
export const useSessao = () => useContext(ContextoSessao);
export function useConteudoAtual(item: unknown) {
  const atualizar = useSessao()?.atual;
  useEffect(() => { atualizar?.(item); }, [atualizar, item]);
}
