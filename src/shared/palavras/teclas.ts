/**
 * A ordem das teclas — QWERTY, a mesma do teclado do celular.
 *
 * Fica separada do componente porque o anagrama usa só a ordem, sem o teclado:
 * ele desenha um punhado de letras, e quer que elas apareçam onde a mão já
 * espera encontrá-las.
 */

export const FILAS: string[][] = [
  [...'QWERTYUIOP'],
  [...'ASDFGHJKL'],
  [...'ZXCVBNM'],
];

const LETRAS = FILAS.flat();

/** Onde a letra fica no teclado. Serve para ordenar um punhado delas. */
const POSICAO = new Map(LETRAS.map((l, i) => [l, i]));

export function ordemDeTeclado(letras: readonly string[]): string[] {
  return [...letras].sort(
    (a, b) => (POSICAO.get(a) ?? 99) - (POSICAO.get(b) ?? 99),
  );
}
