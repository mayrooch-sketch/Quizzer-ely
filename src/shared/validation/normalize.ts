/**
 * Leitura tolerante do banco.
 *
 * Mesma decisão do outro app: nada de Zod. Um validador de esquema **rejeita**
 * o que não bate; aqui é preciso **aceitar** o que der para aceitar e descartar
 * só o item que não tem conserto. O banco é escrito por gente, num app
 * separado, e um campo torto não pode derrubar as outras 2330 perguntas.
 *
 * A regra de descarte é sempre a mesma: some o item que **não dá para jogar**.
 * Um `cloze` sem frase não tem jogo; um `cloze` sem `notes` tem.
 *
 * Nada aqui lança exceção. Item ruim vira `null` e é filtrado.
 */

import {
  LETRAS,
  type KnowsItem,
  type KnowsType,
  type Letra,
  type PayloadAssociation,
  type PayloadCloze,
  type PayloadOrder,
  type PayloadSelect,
  type PayloadVf,
  type PayloadWhoAmI,
  type Pergunta,
} from '../types/bank';
import { prepararTrechos } from '../trechos/biblioteca';
import type { TrechoBiblico, TrechoBruto } from '../trechos/types';

/* ------------------------------------------------------------------ *
 * Leitores de campo
 * ------------------------------------------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function texto(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function listaDeTextos(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(texto).filter(Boolean);
}

/**
 * Booleano tolerante.
 *
 * O banco atual grava `true`/`false` de verdade, mas exportações passadas por
 * planilha costumam trazer `"true"`, `"1"` ou `"sim"`. Aceitar isso custa três
 * linhas; descobrir depois que meia dúzia de afirmações inverteu de resposta
 * custa muito mais.
 */
function booleano(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const t = texto(value).toLowerCase();
  return t === 'true' || t === '1' || t === 'sim' || t === 'v';
}

function inteiro(value: unknown, padrao: number): number {
  const n = typeof value === 'number' ? value : Number(texto(value));
  return Number.isFinite(n) ? Math.trunc(n) : padrao;
}

/**
 * Texto sem acento e em minúsculas, para comparar e agrupar.
 *
 * Existe por um problema real do banco: etiquetas sem acento convivem com
 * versões acentuadas, como `associacao`/`associação` e `fe`/`fé`. São o
 * mesmo assunto escrito de dois jeitos, e sem isto um filtro por etiqueta
 * esconderia metade dos itens sem avisar.
 */
export function chaveDeTexto(value: string): string {
  return value
    .normalize('NFD')
    // Marcas de acento combinantes (U+0300–U+036F), escritas escapadas para
    // que o arquivo não dependa de ser lido como UTF-8.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/* ------------------------------------------------------------------ *
 * Quiz
 * ------------------------------------------------------------------ */

/**
 * Uma pergunta de múltipla escolha.
 *
 * Descarta quando falta o enunciado, quando alguma alternativa está vazia ou
 * quando `correta` não aponta para uma delas — nos três casos não há pergunta
 * jogável, e mostrá-la seria oferecer uma rodada impossível de acertar.
 */
function normalizePergunta(raw: unknown, indice: number): Pergunta | null {
  if (!isRecord(raw)) return null;

  const enunciado = texto(raw.pergunta);
  if (!enunciado) return null;

  const alternativas = {} as Record<Letra, string>;
  for (const letra of LETRAS) {
    const valor = texto(raw[letra]);
    if (!valor) return null;
    alternativas[letra] = valor;
  }

  const correta = texto(raw.correta).toUpperCase();
  if (!LETRAS.includes(correta as Letra)) return null;

  return {
    // Sem id no banco, a posição serve: o app só precisa distinguir uma
    // pergunta da outra dentro da sessão.
    id: texto(raw.id) || `q_${indice}`,
    categoria: texto(raw.categoria) || 'Sem categoria',
    pergunta: enunciado,
    alternativas,
    correta: correta as Letra,
    referencia: texto(raw.referencia),
  };
}

/**
 * O banco de quiz inteiro.
 *
 * O arquivo traz **dois arrays idênticos** — `perguntas` e `questions`. É
 * sobra da importação. Ler um só evita processar os dados duas vezes;
 * `questions` vem primeiro por ser o que o app
 * antigo usava.
 */
export function normalizeQuiz(raw: unknown): Pergunta[] {
  if (!isRecord(raw)) return [];
  const bank = isRecord(raw.bank) ? raw.bank : raw;
  const lista = Array.isArray(bank.questions)
    ? bank.questions
    : Array.isArray(bank.perguntas)
      ? bank.perguntas
      : [];

  return lista
    .map((item, i) => normalizePergunta(item, i))
    .filter((p): p is Pergunta => p !== null);
}

/* ------------------------------------------------------------------ *
 * Knows — um normalizador por tipo
 * ------------------------------------------------------------------ */

function payloadVf(p: Record<string, unknown>): PayloadVf | null {
  const statement = texto(p.statement);
  if (!statement) return null;
  return { statement, correct: booleano(p.correct) };
}

/**
 * Precisa de pelo menos uma certa e uma errada: uma lista só de certas —
 * ou só de erradas — é uma pergunta cuja resposta é "marque tudo".
 */
function payloadSelect(p: Record<string, unknown>): PayloadSelect | null {
  if (!Array.isArray(p.options)) return null;

  const options = p.options.flatMap((o) => {
    if (!isRecord(o)) return [];
    const t = texto(o.text);
    return t ? [{ text: t, correct: booleano(o.correct) }] : [];
  });

  const certas = options.filter((o) => o.correct).length;
  if (certas === 0 || certas === options.length) return null;

  return {
    prompt: texto(p.prompt) || 'Marque as opções certas.',
    options,
    // O banco declara min e max; quando faltam, a contagem real serve para os
    // dois — é o que a instrução na tela precisa dizer.
    minCorrect: inteiro(p.min_correct, certas),
    maxCorrect: inteiro(p.max_correct, certas),
  };
}

/**
 * A resposta precisa estar entre as alternativas.
 *
 * Se não estiver, não há como acertar. O normalizador **não** a acrescenta:
 * inventar uma alternativa mudaria o item silenciosamente, e um item a menos é
 * mais honesto do que um item alterado.
 */
function payloadCloze(p: Record<string, unknown>): PayloadCloze | null {
  const sentence = texto(p.sentence);
  const answer = texto(p.answer);
  const choices = listaDeTextos(p.choices);
  if (!sentence || !answer || choices.length < 2) return null;
  if (!choices.includes(answer)) return null;

  return {
    prompt: texto(p.prompt) || 'Complete a frase:',
    sentence,
    answer,
    choices,
  };
}

function payloadAssociation(
  p: Record<string, unknown>,
): PayloadAssociation | null {
  if (!Array.isArray(p.pairs)) return null;

  const pairs = p.pairs.flatMap((par) => {
    if (!isRecord(par)) return [];
    const left = texto(par.left);
    const right = texto(par.right);
    return left && right ? [{ left, right }] : [];
  });

  // Com um par só não há o que associar.
  if (pairs.length < 2) return null;
  return { prompt: texto(p.prompt) || 'Associe as colunas.', pairs };
}

function payloadWhoAmI(p: Record<string, unknown>): PayloadWhoAmI | null {
  const answer = texto(p.answer);
  const choices = listaDeTextos(p.choices);
  const hints = listaDeTextos(p.hints);
  if (!answer || hints.length === 0 || choices.length < 2) return null;
  if (!choices.includes(answer)) return null;
  return { answer, choices, hints };
}

/**
 * Ordena por `order` e devolve só os textos — a posição passa a ser a resposta.
 *
 * Empate ou buraco na numeração não invalida o item: a ordenação é estável, e
 * o resultado continua sendo uma sequência jogável.
 */
function payloadOrder(p: Record<string, unknown>): PayloadOrder | null {
  if (!Array.isArray(p.items)) return null;

  const items = p.items
    .flatMap((item, i) => {
      if (typeof item === 'string') {
        const t = texto(item);
        return t ? [{ ordem: i, text: t }] : [];
      }
      if (!isRecord(item)) return [];
      const t = texto(item.text);
      return t ? [{ ordem: inteiro(item.order, i), text: t }] : [];
    })
    .sort((a, b) => a.ordem - b.ordem)
    .map((x) => x.text);

  if (items.length < 2) return null;
  return { prompt: texto(p.prompt) || 'Coloque na ordem correta.', items };
}

/** Um item do Knows, ou `null` se não der para jogar. */
function normalizeKnowsItem(
  raw: unknown,
  indice: number,
): KnowsItem | null {
  if (!isRecord(raw)) return null;

  const tipo = texto(raw.type).toLowerCase() as KnowsType;
  const payloadBruto = isRecord(raw.payload) ? raw.payload : null;
  if (!payloadBruto) return null;

  const base = {
    id: texto(raw.id) || `k_${indice}`,
    notes: texto(raw.notes),
    reference: texto(raw.reference),
    tags: listaDeTextos(raw.tags),
  };

  switch (tipo) {
    case 'vf': {
      const payload = payloadVf(payloadBruto);
      return payload ? { ...base, type: 'vf', payload } : null;
    }
    case 'select': {
      const payload = payloadSelect(payloadBruto);
      return payload ? { ...base, type: 'select', payload } : null;
    }
    case 'cloze': {
      const payload = payloadCloze(payloadBruto);
      return payload ? { ...base, type: 'cloze', payload } : null;
    }
    case 'association': {
      const payload = payloadAssociation(payloadBruto);
      return payload ? { ...base, type: 'association', payload } : null;
    }
    case 'whoami': {
      const payload = payloadWhoAmI(payloadBruto);
      return payload ? { ...base, type: 'whoami', payload } : null;
    }
    case 'order': {
      const payload = payloadOrder(payloadBruto);
      return payload ? { ...base, type: 'order', payload } : null;
    }
    // Tipo novo publicado por uma versão futura do app de administração:
    // some da lista em vez de quebrar a tela.
    default:
      return null;
  }
}

export function normalizeKnows(raw: unknown): KnowsItem[] {
  if (!isRecord(raw)) return [];
  const lista = Array.isArray(raw.items) ? raw.items : [];
  return lista
    .map((item, i) => normalizeKnowsItem(item, i))
    .filter((item): item is KnowsItem => item !== null);
}

/* ------------------------------------------------------------------ *
 * Trechos — base dos dois jogos de citações
 * ------------------------------------------------------------------ */

function normalizeTrecho(raw: unknown, indice: number): TrechoBiblico | null {
  if (!isRecord(raw)) return null;

  const trecho: TrechoBruto = {
    id: texto(raw.id) || `trecho_${indice}`,
    trecho: texto(raw.trecho),
    referencia: texto(raw.referencia),
    temas: Array.isArray(raw.temas)
      ? raw.temas.filter((tema): tema is number => Number.isInteger(tema))
      : [],
  };
  if (!trecho.trecho || !trecho.referencia) return null;

  try {
    return prepararTrechos([trecho])[0] ?? null;
  } catch {
    // Livro desconhecido invalida somente este trecho, não o banco inteiro.
    return null;
  }
}

export function normalizeTrechos(raw: unknown): TrechoBiblico[] {
  if (!isRecord(raw)) return [];
  const lista = Array.isArray(raw.items) ? raw.items : [];
  const trechos = lista
    .map((item, indice) => normalizeTrecho(item, indice))
    .filter((item): item is TrechoBiblico => item !== null);
  for (const trecho of trechos) {
    const limite = isRecord(raw.limitesConfirmados) ? raw.limitesConfirmados[trecho.livro] : null;
    if (!isRecord(limite) || !isRecord(limite.versiculosAte)) continue;
    const capitulosAte = Number(limite.capitulosAte);
    if (!Number.isInteger(capitulosAte) || capitulosAte < 1 || capitulosAte > 200) continue;
    const versiculosAte = Object.fromEntries(Object.entries(limite.versiculosAte)
      .filter(([capitulo, n]) => /^\d+$/.test(capitulo) && Number(capitulo) >= 1 && Number(capitulo) <= capitulosAte && Number.isInteger(n) && Number(n) > 0 && Number(n) <= 200));
    trecho.limitesConfirmados = { capitulosAte, versiculosAte: versiculosAte as Record<string, number> };
  }
  return trechos;
}
