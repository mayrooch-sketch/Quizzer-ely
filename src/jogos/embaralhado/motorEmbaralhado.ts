import type { TrechoBiblico } from '../../shared/trechos/types';

export interface PecaDePalavra {
  id: string;
  texto: string;
  /** Posição esperada; `null` identifica uma das quatro intrusas. */
  posicaoCorreta: number | null;
  origemId: string;
}

export function tokenizar(trecho: string): string[] {
  return (
    trecho.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)?.map((palavra) =>
      palavra.toLocaleLowerCase('pt-BR'),
    ) ?? []
  );
}

function embaralhar<T>(itens: readonly T[], aleatorio: () => number): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Acrescenta exatamente quatro palavras, cada uma vinda de um texto diferente.
 * Palavras já presentes na resposta são evitadas para a remoção das intrusas
 * nunca depender de adivinhar qual das duas peças visualmente iguais sobrou.
 */
export function criarPecas(
  atual: TrechoBiblico,
  todos: readonly TrechoBiblico[],
  aleatorio: () => number = Math.random,
): PecaDePalavra[] {
  const resposta = tokenizar(atual.trecho);
  const usadas = new Set(resposta);
  const intrusas: PecaDePalavra[] = [];

  for (const origem of embaralhar(
    todos.filter((item) => item.id !== atual.id),
    aleatorio,
  )) {
    const candidatas = tokenizar(origem.trecho).filter(
      (palavra) => palavra.length >= 4 && !usadas.has(palavra),
    );
    if (candidatas.length === 0) continue;
    const texto = candidatas[Math.floor(aleatorio() * candidatas.length)];
    usadas.add(texto);
    intrusas.push({
      id: `intrusa-${intrusas.length}-${origem.id}`,
      texto,
      posicaoCorreta: null,
      origemId: origem.id,
    });
    if (intrusas.length === 4) break;
  }

  if (intrusas.length !== 4) {
    throw new Error('Não foi possível encontrar quatro palavras intrusas.');
  }

  const corretas = resposta.map<PecaDePalavra>((texto, posicaoCorreta) => ({
    id: `correta-${posicaoCorreta}`,
    texto,
    posicaoCorreta,
    origemId: atual.id,
  }));

  return embaralhar([...corretas, ...intrusas], aleatorio);
}

export function ordemEstaCorreta(
  selecionadas: readonly PecaDePalavra[],
  totalCorretas: number,
): boolean {
  if (selecionadas.length !== totalCorretas) return false;
  if (selecionadas.some((peca) => peca.posicaoCorreta === null)) return false;
  return selecionadas.every((peca, indice) => peca.posicaoCorreta === indice);
}
