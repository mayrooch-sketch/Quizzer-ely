/**
 * Confere os normalizadores contra o banco de verdade.
 *
 * Não é um teste automatizado — é a conferência que se roda depois de mexer em
 * `normalize.ts`, para ver **quanto** do banco sobreviveu e **o que** foi
 * descartado. Um normalizador que devolve zero item passa em qualquer teste de
 * tipo e não serve para nada.
 *
 *   npx tsx scripts/conferir-banco.ts
 */

import { readFileSync } from 'node:fs';
import { normalizeKnows, normalizeQuiz } from '../src/shared/validation/normalize';
import { KNOWS_TYPES, type KnowsType } from '../src/shared/types/bank';

const dir = process.argv[2] ?? '.';

const quizBruto = JSON.parse(readFileSync(`${dir}/quiz.json`, 'utf8'));
const knowsBruto = JSON.parse(readFileSync(`${dir}/knows.json`, 'utf8'));

const brutasQuiz = quizBruto?.bank?.questions?.length ?? 0;
const brutosKnows = knowsBruto?.items?.length ?? 0;

const perguntas = normalizeQuiz(quizBruto);
const knows = normalizeKnows(knowsBruto);

console.log('QUIZ  ', `${perguntas.length}/${brutasQuiz}`, `descartadas: ${brutasQuiz - perguntas.length}`);
console.log('KNOWS ', `${knows.length}/${brutosKnows}`, `descartados: ${brutosKnows - knows.length}`);

const porTipo = new Map<KnowsType, number>();
knows.forEach((k) => porTipo.set(k.type, (porTipo.get(k.type) ?? 0) + 1));
console.log(
  '  por tipo:',
  KNOWS_TYPES.map((t) => `${t}=${porTipo.get(t) ?? 0}`).join(' '),
);

const categorias = new Map<string, number>();
perguntas.forEach((p) => categorias.set(p.categoria, (categorias.get(p.categoria) ?? 0) + 1));
console.log('  categorias:', categorias.size);

/* A união discriminada em uso: cada tipo lê só o payload que é dele. */
const amostra = KNOWS_TYPES.map((tipo) => {
  const item = knows.find((k) => k.type === tipo);
  if (!item) return `${tipo}: nenhum`;
  switch (item.type) {
    case 'vf':
      return `${tipo}: correct=${item.payload.correct}`;
    case 'select':
      return `${tipo}: ${item.payload.options.length} opções, ${item.payload.minCorrect}–${item.payload.maxCorrect} certas`;
    case 'cloze':
      return `${tipo}: ${item.payload.choices.length} alternativas`;
    case 'association':
      return `${tipo}: ${item.payload.pairs.length} pares`;
    case 'whoami':
      return `${tipo}: ${item.payload.hints.length} pistas`;
    case 'order':
      return `${tipo}: ${item.payload.items.length} passos`;
  }
});
console.log(amostra.map((l) => '  ' + l).join('\n'));
