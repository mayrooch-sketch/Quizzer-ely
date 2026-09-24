import type { Nivel } from './modelo';
/** Mantém a ordem embaralhada: a posição correta nunca é fixada pelo nível. */
export function reduzirOpcoes<T>(opcoes: readonly T[], correta: T, nivel: Nivel): T[] {
  if (nivel !== 'facil' || opcoes.length <= 2) return [...opcoes];
  const errada = opcoes.find((op) => op !== correta);
  return opcoes.filter((op) => op === correta || op === errada);
}
