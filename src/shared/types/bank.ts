/**
 * O banco de perguntas, em tipos.
 *
 * São três bancos independentes, com formas diferentes, e é por isso que eles
 * têm tipos separados em vez de um "item" genérico:
 *
 * - **Quiz** (`banco/quiz`): perguntas de múltipla escolha A/B/C/D.
 * - **Knows** (`banco/knows`): itens em seis tipos, cada um com um
 *   `payload` de forma própria.
 *
 * O `payload` é o motivo principal de o app ganhar TypeScript. No app antigo
 * ele é um objeto solto: `association` traz `pairs`, `cloze` traz
 * `sentence`/`answer`/`choices`, `select` traz `min_correct`/`max_correct`.
 * Acertar qual campo existe em qual tipo era trabalho de memória, e errar só
 * aparecia rodando. Com a união discriminada abaixo, o editor cobra o `type`
 * antes de deixar ler o `payload`.
 *
 * **Campos do banco que não estão aqui, e por quê.** Uma varredura nos
 * registros mostrou quatro campos vazios em 100% deles: `title` nos itens do
 * Knows, `meta.categoria`, `meta.subcategoria` e `meta.id_original`; e, nas
 * perguntas, `obs` e `observacoes`. São sobras da importação que gerou o banco
 * (`source: "merged_import"`). Declará-los seria prometer um dado que não
 * existe — e obrigar toda tela a tratar o caso vazio para sempre. Voltam no
 * dia em que forem preenchidos.
 */

import type { TrechoBiblico } from '../trechos/types';

/* ------------------------------------------------------------------ *
 * Quiz — múltipla escolha
 * ------------------------------------------------------------------ */

/** As quatro alternativas, sempre nesta ordem. */
export const LETRAS = ['A', 'B', 'C', 'D'] as const;
export type Letra = (typeof LETRAS)[number];

export interface Pergunta {
  id: string;
  categoria: string;
  pergunta: string;
  /** Texto de cada alternativa, indexado pela letra. */
  alternativas: Record<Letra, string>;
  correta: Letra;
  /** Citação bíblica. Presente em todas as perguntas do banco atual. */
  referencia: string;
}

/* ------------------------------------------------------------------ *
 * Knows — seis tipos, seis payloads
 * ------------------------------------------------------------------ */

export const KNOWS_TYPES = [
  'vf',
  'select',
  'cloze',
  'association',
  'whoami',
  'order',
] as const;

export type KnowsType = (typeof KNOWS_TYPES)[number];

/** O que todo item traz, seja qual for o tipo. */
interface KnowsBase {
  id: string;
  /** Comentário do autor sobre o item. Presente em todos. */
  notes: string;
  /** Citação bíblica. Presente em todos. */
  reference: string;
  /** Assuntos do item. Ver a nota sobre acentuação em `normalize.ts`. */
  tags: string[];
}

/** Uma afirmação para julgar. */
export interface PayloadVf {
  statement: string;
  correct: boolean;
}

/**
 * Marcar as opções certas — quantas forem.
 *
 * `minCorrect`/`maxCorrect` existem porque o número de respostas certas varia
 * por item, e é isso que a instrução na tela precisa dizer.
 */
export interface PayloadSelect {
  prompt: string;
  options: { text: string; correct: boolean }[];
  minCorrect: number;
  maxCorrect: number;
}

/** Frase com uma lacuna, escolhida entre alternativas. */
export interface PayloadCloze {
  prompt: string;
  sentence: string;
  answer: string;
  choices: string[];
}

/** Ligar cada item da esquerda ao seu par da direita. */
export interface PayloadAssociation {
  prompt: string;
  pairs: { left: string; right: string }[];
}

/** Pistas que levam a um nome, escolhido entre alternativas. */
export interface PayloadWhoAmI {
  hints: string[];
  answer: string;
  choices: string[];
}

/**
 * Colocar os acontecimentos na ordem certa.
 *
 * No banco cada item vem como `{ order, text }`. O normalizador ordena e
 * entrega só os textos: a posição no array **é** a resposta. Guardar o número
 * junto permitiria que array e campo discordassem, e não há terceira fonte
 * para decidir qual dos dois está certo.
 */
export interface PayloadOrder {
  prompt: string;
  items: string[];
}

/**
 * Um item do Knows.
 *
 * A união é discriminada por `type`: ler `item.payload.pairs` só compila
 * depois de o código provar que `item.type === 'association'`.
 */
export type KnowsItem =
  | (KnowsBase & { type: 'vf'; payload: PayloadVf })
  | (KnowsBase & { type: 'select'; payload: PayloadSelect })
  | (KnowsBase & { type: 'cloze'; payload: PayloadCloze })
  | (KnowsBase & { type: 'association'; payload: PayloadAssociation })
  | (KnowsBase & { type: 'whoami'; payload: PayloadWhoAmI })
  | (KnowsBase & { type: 'order'; payload: PayloadOrder });

/** O item de um tipo específico, para funções que já sabem qual é. */
export type KnowsItemOf<T extends KnowsType> = Extract<KnowsItem, { type: T }>;

/* ------------------------------------------------------------------ *
 * O banco inteiro
 * ------------------------------------------------------------------ */

export interface Banco {
  perguntas: Pergunta[];
  knows: KnowsItem[];
  /** Trechos compartilhados por Encontre a referência e Texto embaralhado. */
  trechos: readonly TrechoBiblico[];
  /** Versão publicada em `banco/_meta/version`. Governa o cache. */
  versao: string | null;
}

export const BANCO_VAZIO: Banco = {
  perguntas: [],
  knows: [],
  trechos: [],
  versao: null,
};
