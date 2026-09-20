/**
 * A memória curta dos jogos de palavra.
 *
 * Os jogos bebem do mesmo poço de respostas. Sem nada que os
 * ligasse, era comum sair da forca com "TABERNACULO" e cair no anagrama com
 * "TABERNACULO" — o app parecia ter meia dúzia de palavras.
 *
 * Guarda as últimas usadas e empurra-as para o fim da fila. Não é uma
 * proibição: se o poço acabar, elas voltam a sair. É estado de módulo, não de
 * React, porque o ponto é justamente sobreviver à troca de tela; e não é
 * gravado no disco, porque "curto prazo" é o que se pediu — recarregar a
 * página limpa.
 */

const LEMBRAR = 40;

/** Da mais antiga para a mais recente. */
const recentes: string[] = [];

export function marcarUsadas(palavras: readonly string[]): void {
  for (const p of palavras) {
    const i = recentes.indexOf(p);
    if (i >= 0) recentes.splice(i, 1);
    recentes.push(p);
  }
  if (recentes.length > LEMBRAR) recentes.splice(0, recentes.length - LEMBRAR);
}

export function foiUsadaAgoraPouco(palavra: string): boolean {
  return recentes.includes(palavra);
}

/**
 * Separa o poço em "ainda não saiu" e "acabou de sair", nesta ordem.
 *
 * Quem chama embaralha cada parte por conta própria — aqui só se decide quem
 * vem antes.
 */
export function priorizarNovas<T extends { palavra: string }>(
  poco: readonly T[],
): { novas: T[]; repetidas: T[] } {
  const novas: T[] = [];
  const repetidas: T[] = [];
  for (const item of poco) {
    if (foiUsadaAgoraPouco(item.palavra)) repetidas.push(item);
    else novas.push(item);
  }
  return { novas, repetidas };
}

/** Só para os testes e para a tela de diagnóstico. */
export function esquecerTudo(): void {
  recentes.length = 0;
}
