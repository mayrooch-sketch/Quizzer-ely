import type { KnowsItem, Pergunta } from '../types/bank';
import type { PalavraDoBanco } from '../palavras/poco';
import type { TrechoBiblico } from '../trechos/types';

export interface Conteudo {
  id: string;
  pergunta: string;
  resposta: string;
  referencia: string;
  explicacao: string;
  assunto: string;
}
export interface Salvo extends Conteudo { jogo: string; sequencia: number }
export function conteudoDe(valor: unknown): Conteudo | null {
  if (!valor || typeof valor !== 'object') return null;
  if ('alternativas' in valor) {
    const p = valor as Pergunta;
    return { id: p.id, pergunta: p.pergunta, resposta: p.alternativas[p.correta], referencia: p.referencia, explicacao: '', assunto: p.categoria };
  }
  if ('trecho' in valor) {
    const t = valor as TrechoBiblico;
    return { id: t.id, pergunta: t.trecho, resposta: t.referencia, referencia: t.referencia, explicacao: '', assunto: t.livro };
  }
  if ('palavra' in valor) {
    const p = valor as PalavraDoBanco;
    return { id: p.palavra, pergunta: p.dica, resposta: p.original, referencia: p.referencia, explicacao: '', assunto: 'Palavras' };
  }
  if ('payload' in valor) {
    const k = valor as KnowsItem;
    const base = { id: k.id, referencia: k.reference, explicacao: k.notes, assunto: k.tags.filter((t) => !['whoami', 'vf', 'cloze', 'select', 'association', 'order'].includes(t)).join(', ') || 'Conhecimento' };
    switch (k.type) {
      case 'vf': return { ...base, pergunta: k.payload.statement, resposta: k.payload.correct ? 'Verdadeiro' : 'Falso' };
      case 'cloze': return { ...base, pergunta: k.payload.sentence, resposta: k.payload.answer };
      case 'whoami': return { ...base, pergunta: k.payload.hints.join('\n'), resposta: k.payload.answer };
      case 'association': return { ...base, pergunta: k.payload.prompt, resposta: k.payload.pairs.map((p) => `${p.left} — ${p.right}`).join('\n') };
      case 'order': return { ...base, pergunta: k.payload.prompt, resposta: k.payload.items.map((p, i) => `${i + 1}. ${p}`).join('\n') };
      case 'select': return { ...base, pergunta: k.payload.prompt, resposta: k.payload.options.filter((o) => o.correct).map((o) => o.text).join('\n') };
    }
  }
  return null;
}
export const chave = (item: Pick<Salvo, 'id' | 'jogo'>) => `${item.jogo}:${item.id}`;
export function revisarResultado(itens: Salvo[], item: Salvo, acertou: boolean): Salvo[] {
  const existente = itens.find((i) => chave(i) === chave(item));
  const sequencia = acertou ? (existente?.sequencia ?? 0) + 1 : 0;
  const outros = itens.filter((i) => chave(i) !== chave(item));
  return sequencia >= 2 ? outros : [...outros, { ...item, sequencia }];
}
export function textoFavoritos(itens: Salvo[]): string {
  return ['Meus favoritos — Quizzer', ...itens.map((i, n) => [
    `${n + 1}. ${i.pergunta}`, `Resposta: ${i.resposta}`,
    i.referencia && `Referência: ${i.referencia}`, i.explicacao && `Explicação: ${i.explicacao}`,
  ].filter(Boolean).join('\n'))].join('\n\n');
}
export function lerSalvos(chaveLocal: string): Salvo[] {
  try {
    const bruto: unknown = JSON.parse(localStorage.getItem(chaveLocal) ?? '[]');
    if (!Array.isArray(bruto)) return [];
    return bruto.filter((i): i is Salvo => i && ['id', 'jogo', 'pergunta', 'resposta', 'referencia', 'explicacao', 'assunto'].every((campo) => typeof i[campo] === 'string') && Number.isInteger(i.sequencia) && i.sequencia >= 0);
  } catch { return []; }
}
