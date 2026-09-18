/**
 * O gerador das palavras cruzadas.
 *
 * O algoritmo é o do app antigo (`buildCrossword`), e por bom motivo: ele
 * funciona. Começa com uma palavra deitada no meio, e cada palavra seguinte
 * entra cruzando uma que já está lá, numa letra que as duas dividem. Duas
 * palavras nunca ficam encostadas lado a lado — só se tocam no cruzamento.
 *
 * Duas coisas mudaram.
 *
 * **Tenta várias vezes.** Lá, uma montagem ruim virava "Não foi possível
 * montar um grid viável. Tente novamente" — um erro que o app pedia ao usuário
 * para resolver tocando de novo no mesmo botão. Aqui a grade é remontada até
 * dar certo, e o aviso só aparece se nem assim der.
 *
 * **A grade é recortada.** Lá eram sempre 10×10, com as bordas vazias ocupando
 * espaço: numa tela de 375px isso é uma fileira inteira de células gasta em
 * nada. Aqui a grade sai do tamanho do que foi usado — em geral algo como
 * 10×7 —, e a célula fica proporcionalmente maior.
 */

import { priorizarNovas } from '../../shared/palavras/memoria';
import type { PalavraDoBanco } from '../../shared/palavras/poco';

const LADO = 10;

export type Direcao = 'h' | 'v';

export interface EntradaCruzada extends PalavraDoBanco {
  /** Coluna e linha da primeira letra, já recortadas. */
  x: number;
  y: number;
  dir: Direcao;
  /** O número que aparece na casa inicial. */
  numero: number;
  /** Índices das casas que a palavra ocupa, na ordem de leitura. */
  casas: number[];
}

export interface Casa {
  /** A letra certa. `null` é casa preta. */
  letra: string | null;
  /** Número da casa, ou 0 quando não começa palavra nenhuma. */
  numero: number;
}

export interface Cruzada {
  colunas: number;
  linhas: number;
  casas: Casa[];
  entradas: EntradaCruzada[];
}

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

interface Posta extends PalavraDoBanco {
  x: number;
  y: number;
  dir: Direcao;
}

type Grade = (string | null)[][];

function cabe(grade: Grade, palavra: string, x0: number, y0: number, dir: Direcao): boolean {
  const dx = dir === 'h' ? 1 : 0;
  const dy = dir === 'v' ? 1 : 0;
  const x1 = x0 + dx * (palavra.length - 1);
  const y1 = y0 + dy * (palavra.length - 1);
  if (x0 < 0 || y0 < 0 || x1 >= LADO || y1 >= LADO) return false;

  for (let i = 0; i < palavra.length; i++) {
    const x = x0 + dx * i;
    const y = y0 + dy * i;
    const atual = grade[y][x];
    if (atual && atual !== palavra[i]) return false;

    /*
     * Casa vazia não pode ter vizinha do lado: duas palavras encostadas
     * formariam, na leitura, uma terceira palavra que ninguém pediu.
     */
    if (!atual) {
      if (dir === 'v') {
        if ((x > 0 && grade[y][x - 1]) || (x < LADO - 1 && grade[y][x + 1])) return false;
      } else {
        if ((y > 0 && grade[y - 1][x]) || (y < LADO - 1 && grade[y + 1][x])) return false;
      }
    }
  }

  // Nem encostada na ponta: senão a palavra continuaria depois do fim.
  const ax = x0 - dx;
  const ay = y0 - dy;
  if (ax >= 0 && ay >= 0 && grade[ay][ax]) return false;
  const bx = x1 + dx;
  const by = y1 + dy;
  if (bx < LADO && by < LADO && grade[by][bx]) return false;

  return true;
}

function escrever(grade: Grade, palavra: string, x0: number, y0: number, dir: Direcao): void {
  const dx = dir === 'h' ? 1 : 0;
  const dy = dir === 'v' ? 1 : 0;
  for (let i = 0; i < palavra.length; i++) {
    grade[y0 + dy * i][x0 + dx * i] = palavra[i];
  }
}

/** Tenta encaixar a candidata cruzando alguma das que já estão na grade. */
function cruzar(grade: Grade, postas: Posta[], cand: PalavraDoBanco): Posta | null {
  const palavra = cand.palavra;

  for (const e of embaralhar(postas)) {
    for (let i = 0; i < palavra.length; i++) {
      for (let j = 0; j < e.palavra.length; j++) {
        if (e.palavra[j] !== palavra[i]) continue;

        const dir: Direcao = e.dir === 'h' ? 'v' : 'h';
        const x = e.x + (e.dir === 'h' ? j : 0);
        const y = e.y + (e.dir === 'v' ? j : 0);
        const x0 = x - (dir === 'h' ? i : 0);
        const y0 = y - (dir === 'v' ? i : 0);

        if (cabe(grade, palavra, x0, y0, dir)) {
          escrever(grade, palavra, x0, y0, dir);
          return { ...cand, x: x0, y: y0, dir };
        }
      }
    }
  }

  return null;
}

export interface OpcoesCruzada {
  poco: readonly PalavraDoBanco[];
  /** Quantas palavras tentar colocar. */
  alvo?: number;
  /** Abaixo disto a grade é jogada fora e outra é montada. */
  minimo?: number;
  tentativas?: number;
}

export function gerarCruzadas({
  poco,
  alvo = 10,
  minimo = 7,
  tentativas = 40,
}: OpcoesCruzada): Cruzada | null {
  /* Palavras curtas demais dão poucos cruzamentos; longas demais não cabem. */
  const cabem = poco.filter((p) => p.palavra.length >= 4 && p.palavra.length <= LADO);
  if (cabem.length < minimo) return null;

  const { novas, repetidas } = priorizarNovas(cabem);

  for (let t = 0; t < tentativas; t++) {
    const grade: Grade = Array.from({ length: LADO }, () => Array(LADO).fill(null));
    const fila = [...embaralhar(novas), ...embaralhar(repetidas)];
    const postas: Posta[] = [];

    const primeira = fila.shift();
    if (!primeira) return null;
    const x0 = Math.floor((LADO - primeira.palavra.length) / 2);
    const y0 = Math.floor(LADO / 2);
    escrever(grade, primeira.palavra, x0, y0, 'h');
    postas.push({ ...primeira, x: x0, y: y0, dir: 'h' });

    for (const cand of fila) {
      if (postas.length >= alvo) break;
      const posta = cruzar(grade, postas, cand);
      if (posta) postas.push(posta);
    }

    if (postas.length >= minimo) return recortarENumerar(grade, postas);
  }

  return null;
}

/**
 * Recorta a grade até o que foi usado e numera as casas.
 *
 * A numeração é a de sempre: da esquerda para a direita, de cima para baixo,
 * e ganha número toda casa que começa uma palavra.
 */
function recortarENumerar(grade: Grade, postas: Posta[]): Cruzada {
  let minX = LADO;
  let minY = LADO;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < LADO; y++) {
    for (let x = 0; x < LADO; x++) {
      if (!grade[y][x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const colunas = maxX - minX + 1;
  const linhas = maxY - minY + 1;
  const letra = (x: number, y: number) =>
    x < 0 || y < 0 || x >= colunas || y >= linhas ? null : grade[y + minY][x + minX];

  const casas: Casa[] = [];
  let numero = 1;
  for (let y = 0; y < linhas; y++) {
    for (let x = 0; x < colunas; x++) {
      const l = letra(x, y);
      if (!l) {
        casas.push({ letra: null, numero: 0 });
        continue;
      }
      const comecaH = !letra(x - 1, y) && !!letra(x + 1, y);
      const comecaV = !letra(x, y - 1) && !!letra(x, y + 1);
      casas.push({ letra: l, numero: comecaH || comecaV ? numero++ : 0 });
    }
  }

  const entradas: EntradaCruzada[] = postas
    .map((p) => {
      const x = p.x - minX;
      const y = p.y - minY;
      const casasDaPalavra = [...p.palavra].map((_, i) =>
        p.dir === 'h' ? y * colunas + (x + i) : (y + i) * colunas + x,
      );
      return {
        ...p,
        x,
        y,
        numero: casas[y * colunas + x].numero,
        casas: casasDaPalavra,
      };
    })
    .sort((a, b) => a.numero - b.numero || (a.dir === 'h' ? -1 : 1));

  return { colunas, linhas, casas, entradas };
}
