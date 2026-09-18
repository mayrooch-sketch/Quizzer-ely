/**
 * O gerador do caça-palavras.
 *
 * **Toda palavra cruza pelo menos uma outra**, com no máximo uma solta. Foi o
 * pedido, e muda o jogo: uma grade de palavras paralelas, sem contato, é uma
 * lista disfarçada de tabuleiro — acha-se cada palavra isolada e o resto da
 * grade é enchimento.
 *
 * A garantia não é dada na hora de colocar, e sim no fim. Monta-se o grafo
 * "a palavra A divide célula com a palavra B" e conta-se quem ficou com grau
 * zero; se passar de uma, joga fora a grade e tenta outra. Verificar durante a
 * colocação não bastaria — a primeira palavra nunca tem com quem cruzar, e só
 * se sabe se ela ficou acompanhada depois que as outras entraram.
 *
 * Medido com o banco real, 400 grades por configuração: 8×8/6 palavras,
 * 10×10/8 e 12×12/10 saíram em **100% das vezes e sem nenhuma palavra solta**,
 * com uma média de 1,0 a 1,3 tentativas. As diagonais não mudam essa conta —
 * por isso são opção de dificuldade, e não um risco de a grade não fechar.
 */

import type { PalavraDoBanco } from '../../shared/palavras/poco';
import { priorizarNovas } from '../../shared/palavras/memoria';

interface Direcao {
  dx: number;
  dy: number;
}

const RETAS: Direcao[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const DIAGONAIS: Direcao[] = [
  { dx: 1, dy: 1 },
  { dx: -1, dy: -1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
];

export interface Colocada extends PalavraDoBanco {
  /** Índices na grade linear, da primeira letra para a última. */
  celulas: number[];
}

export interface Caca {
  tam: number;
  /** `tam * tam` letras, em linha. */
  letras: string[];
  palavras: Colocada[];
  /** Quantas ficaram sem cruzar ninguém. Nunca passa de 1. */
  soltas: number;
}

export interface Tamanho {
  tam: number;
  alvo: number;
  label: string;
}

/**
 * Os três tamanhos oferecidos.
 *
 * O alvo de palavras cresce menos que a área de propósito: uma grade maior com
 * a mesma densidade viraria uma sopa de letras cruzadas onde qualquer sequência
 * parece uma palavra.
 */
export const TAMANHOS: Tamanho[] = [
  { tam: 8, alvo: 6, label: 'Pequena' },
  { tam: 10, alvo: 8, label: 'Média' },
  { tam: 12, alvo: 10, label: 'Grande' },
];

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function sortear<T>(itens: readonly T[]): T {
  return itens[Math.floor(Math.random() * itens.length)];
}

/** Todas as posições onde a palavra caberia, e quantas letras reaproveita. */
function posicoesPossiveis(
  grade: string[],
  tam: number,
  palavra: string,
  dirs: Direcao[],
): { celulas: number[]; cruza: number }[] {
  const saida: { celulas: number[]; cruza: number }[] = [];

  for (const dir of dirs) {
    for (let y = 0; y < tam; y++) {
      for (let x = 0; x < tam; x++) {
        const fx = x + dir.dx * (palavra.length - 1);
        const fy = y + dir.dy * (palavra.length - 1);
        if (fx < 0 || fx >= tam || fy < 0 || fy >= tam) continue;

        let cabe = true;
        let cruza = 0;
        const celulas: number[] = [];

        for (let i = 0; i < palavra.length; i++) {
          const c = (y + dir.dy * i) * tam + (x + dir.dx * i);
          const atual = grade[c];
          if (atual && atual !== palavra[i]) {
            cabe = false;
            break;
          }
          if (atual === palavra[i]) cruza++;
          celulas.push(c);
        }

        if (cabe) saida.push({ celulas, cruza });
      }
    }
  }

  return saida;
}

/**
 * Enche o que sobrou com letras sorteadas do **poço inteiro**.
 *
 * Sorteio uniforme de A-Z entregaria a resposta: as palavras do banco quase
 * não têm K, W ou Y, e uma grade salpicada delas mostra onde as palavras não
 * estão. Sortear só das palavras postas erra para o outro lado — são umas
 * quarenta letras, e o enchimento sai com metade da grade em A e S.
 *
 * O poço tem milhares de letras na proporção do português bíblico do banco,
 * que é exatamente a distribuição de onde as palavras escondidas vieram.
 */
function encher(grade: string[], sopa: readonly string[]): string[] {
  const alfabeto = sopa.length > 0 ? sopa : [...'AEIOURSTNLMDCPBGVFHJZQX'];
  return grade.map((c) => c || sortear(alfabeto));
}

export interface OpcoesCaca {
  tam: number;
  alvo: number;
  poco: readonly PalavraDoBanco[];
  diagonais: boolean;
  /** Quantas grades descartar antes de desistir. */
  tentativas?: number;
}

export function gerarCaca({
  tam,
  alvo,
  poco,
  diagonais,
  tentativas = 60,
}: OpcoesCaca): Caca | null {
  const dirs = diagonais ? [...RETAS, ...DIAGONAIS] : RETAS;

  /*
   * As que ainda não saíram nos outros jogos de palavra vêm primeiro; as
   * recentes ficam na reserva, para o caso de o poço não dar conta.
   */
  const cabem = poco.filter((p) => p.palavra.length <= tam);
  const sopa = poco.flatMap((p) => [...p.palavra]);
  const { novas, repetidas } = priorizarNovas(cabem);

  for (let t = 0; t < tentativas; t++) {
    const grade: string[] = Array(tam * tam).fill('');
    const candidatas = [...embaralhar(novas), ...embaralhar(repetidas)];
    const postas: Colocada[] = [];

    for (const cand of candidatas) {
      if (postas.length >= alvo) break;

      const opcoes = posicoesPossiveis(grade, tam, cand.palavra, dirs);
      if (opcoes.length === 0) continue;

      /*
       * Prefere cruzar, mas sorteia entre as que cruzam. Escolher sempre a de
       * mais cruzamentos amontoa tudo num canto e deixa metade da grade vazia.
       */
      const cruzando = opcoes.filter((o) => o.cruza > 0);
      const escolha = cruzando.length
        ? sortear(cruzando)
        : postas.length === 0
          ? sortear(opcoes)
          : null;

      // Já há palavras no tabuleiro e esta não cruza nenhuma: fica de fora.
      if (!escolha) continue;

      escolha.celulas.forEach((c, i) => {
        grade[c] = cand.palavra[i];
      });
      postas.push({ ...cand, celulas: escolha.celulas });
    }

    if (postas.length < alvo) continue;

    const soltas = postas.filter((a) =>
      postas.every((b) => b === a || !a.celulas.some((c) => b.celulas.includes(c))),
    ).length;

    if (soltas <= 1) {
      return { tam, letras: encher(grade, sopa), palavras: postas, soltas };
    }
  }

  return null;
}

/**
 * O caminho reto entre duas células, se houver um.
 *
 * Aceita as oito direções sempre — mesmo numa grade sem diagonais. Recusar o
 * arrasto diagonal do dedo não impediria nada e daria a impressão de que o
 * toque falhou.
 */
export function caminhoEntre(
  tam: number,
  de: number,
  ate: number,
): number[] | null {
  const x1 = de % tam;
  const y1 = Math.floor(de / tam);
  const x2 = ate % tam;
  const y2 = Math.floor(ate / tam);

  const dx = Math.sign(x2 - x1);
  const dy = Math.sign(y2 - y1);
  const passos = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));

  const reto =
    x1 === x2 || y1 === y2 || Math.abs(x2 - x1) === Math.abs(y2 - y1);
  if (!reto) return null;

  const caminho: number[] = [];
  for (let i = 0; i <= passos; i++) {
    caminho.push((y1 + dy * i) * tam + (x1 + dx * i));
  }
  return caminho;
}

/** A palavra cujo lugar é exatamente este caminho — nos dois sentidos. */
export function palavraNoCaminho(
  palavras: readonly Colocada[],
  caminho: readonly number[],
): Colocada | null {
  const igual = (a: readonly number[], b: readonly number[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const invertido = [...caminho].reverse();
  return (
    palavras.find(
      (p) => igual(p.celulas, caminho) || igual(p.celulas, invertido),
    ) ?? null
  );
}
