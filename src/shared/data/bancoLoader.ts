/**
 * De onde vem o banco de perguntas.
 *
 * **Cache-first, e isso é uma decisão, não uma otimização.** O app abre com o
 * que já está no aparelho e só depois olha a rede. Quem abre o Quizzer no
 * ônibus tem o banco inteiro; quem abre com rede lenta não fica olhando uma
 * tela vazia.
 *
 * Isto contraria a decisão do app congregacional ("sem conexão, nada é
 * prometido") de propósito, e pelo mesmo motivo que a sustentava lá: **aqui o
 * app só lê**. Sem escrita não existe o risco que aquela regra evitava — duas
 * edições concorrentes em que a última sincronização apaga a outra. O pior
 * caso aqui é estudar com um banco de uma semana atrás.
 *
 * Lê pela REST do Realtime Database, sem o SDK do Firebase: são quatro GETs de
 * JSON, e o SDK inteiro custaria uns 300 KB para não fazer mais nada.
 */

import { BANCO_VAZIO, type Banco } from '../types/bank';
import {
  normalizeKnows,
  normalizeQuiz,
  normalizeTrechos,
} from '../validation/normalize';

const BASE = 'https://quizzer-ely-default-rtdb.firebaseio.com';

const CACHE_BANCO = 'quizzer.banco.v1';
const CACHE_VERSAO = 'quizzer.versao.v1';

/** De onde veio o que está na tela — a interface diz isso ao usuário. */
export type OrigemBanco = 'cache' | 'rede' | 'vazio';

export interface EstadoBanco {
  banco: Banco;
  origem: OrigemBanco;
}

/* ------------------------------------------------------------------ *
 * Cache local
 * ------------------------------------------------------------------ */

function lerCache(): Banco | null {
  try {
    const raw = localStorage.getItem(CACHE_BANCO);
    if (!raw) return null;
    const dados = JSON.parse(raw) as unknown;
    if (typeof dados !== 'object' || dados === null) return null;

    const { perguntas, knows, trechos, versao } = dados as Partial<Banco>;
    // Cache pela metade é o mesmo que cache nenhum: melhor buscar de novo do
    // que abrir um app com um dos bancos faltando.
    if (
      !Array.isArray(perguntas) ||
      !Array.isArray(knows) ||
      !Array.isArray(trechos)
    ) return null;
    if (perguntas.length === 0 && knows.length === 0 && trechos.length === 0) {
      return null;
    }

    // Cache também é entrada externa: uma versão antiga não pode contornar
    // validações novas nem derrubar uma tela com registros incompletos.
    const perguntasValidas = normalizeQuiz({ questions: perguntas.map(p => {
      if (!p || typeof p !== 'object') return null;
      return { ...p, ...p.alternativas };
    }) });
    const knowsValidos = normalizeKnows({ items: knows });
    const limitesConfirmados = Object.fromEntries(trechos
      .filter(t => t && typeof t === 'object' && typeof t.livro === 'string')
      .map(t => [t.livro, t.limitesConfirmados]));
    const trechosValidos = normalizeTrechos({ items: trechos, limitesConfirmados });
    if (!perguntasValidas.length && !knowsValidos.length && !trechosValidos.length) return null;
    return { perguntas: perguntasValidas, knows: knowsValidos, trechos: trechosValidos, versao: typeof versao === 'string' ? versao : null };
  } catch {
    // JSON corrompido ou armazenamento bloqueado: segue para a rede.
    return null;
  }
}

function gravarCache(banco: Banco): void {
  try {
    localStorage.setItem(CACHE_BANCO, JSON.stringify(banco));
    if (banco.versao) localStorage.setItem(CACHE_VERSAO, banco.versao);
  } catch {
    // Armazenamento cheio: o app funciona nesta sessão e busca de novo na
    // próxima. Falhar em gravar cache nunca pode derrubar a leitura.
  }
}

export function versaoEmCache(): string | null {
  try {
    return localStorage.getItem(CACHE_VERSAO);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Rede
 * ------------------------------------------------------------------ */

async function pegarJson(caminho: string): Promise<unknown> {
  const resposta = await fetch(`${BASE}/${caminho}.json`, { signal: AbortSignal.timeout(15000) });
  if (!resposta.ok) throw new Error(`${caminho}: HTTP ${resposta.status}`);
  return resposta.json();
}

/**
 * Busca o banco inteiro.
 *
 * Os três arquivos vêm em paralelo — buscá-los em fila aumentaria a espera de
 * espera de quem não tem cache.
 */
export async function buscarDaRede(): Promise<Banco> {
  const [versaoBruta, quizBruto, knowsBruto, trechosBrutos] = await Promise.all([
    pegarJson('banco/_meta/version').catch(() => null),
    pegarJson('banco/quiz'),
    pegarJson('banco/knows'),
    pegarJson('banco/trechos'),
  ]);

  const banco: Banco = {
    perguntas: normalizeQuiz(quizBruto),
    knows: normalizeKnows(knowsBruto),
    trechos: normalizeTrechos(trechosBrutos),
    versao: versaoBruta == null ? null : String(versaoBruta),
  };

  // Só grava o que dá para jogar. Uma resposta vazia — servidor fora do ar
  // devolvendo 200 com `null` — não pode apagar um cache que funciona.
  if (
    banco.perguntas.length > 0 ||
    banco.knows.length > 0 ||
    banco.trechos.length > 0
  ) gravarCache(banco);

  return banco;
}

/**
 * A versão publicada, sozinha.
 *
 * São poucos bytes, e é o que evita rebaixar 1,8 MB toda vez que o app abre.
 */
export async function versaoPublicada(): Promise<string | null> {
  try {
    const v = await pegarJson('banco/_meta/version');
    return v == null ? null : String(v);
  } catch {
    return null;
  }
}

/** O que mostrar agora, sem esperar rede. */
export function carregarDoCache(): EstadoBanco {
  const cache = lerCache();
  return cache
    ? { banco: cache, origem: 'cache' }
    : { banco: BANCO_VAZIO, origem: 'vazio' };
}
