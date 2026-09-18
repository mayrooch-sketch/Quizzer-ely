/**
 * O poço de palavras — a fonte dos quatro jogos de palavra.
 *
 * Anagrama, forca, caça-palavras e cruzadas não têm banco próprio: eles
 * reaproveitam a **resposta correta** das perguntas do quiz, e usam o próprio
 * enunciado como dica. Era assim no app antigo (`extractWordCandidates`), e é
 * uma boa ideia — o banco de 1185 perguntas vira 355 palavras sem ninguém
 * precisar digitar uma lista à parte.
 *
 * O que mudou é que ali cada jogo refazia a extração do seu jeito, com
 * variações de filtro entre eles. Aqui é uma função só, e o que muda de jogo
 * para jogo é o tamanho máximo que ele aceita.
 */

import { useMemo } from 'react';
import { usePerguntas } from '../../app/store';
import type { Pergunta } from '../types/bank';
import { chaveDeTexto } from '../validation/normalize';

export interface PalavraDoBanco {
  /** Só A–Z maiúsculo, sem acento. É esta que o jogo compara. */
  palavra: string;
  /** Como está escrita no banco, com acento. É esta que o jogo mostra no fim. */
  original: string;
  /** A pergunta de onde ela saiu. */
  dica: string;
  referencia: string;
}

/**
 * Tira os acentos e sobe para maiúsculas.
 *
 * Sem isto, "ORAÇÃO" e "ORACAO" seriam palavras diferentes, e as letras Ç e Ã
 * apareceriam numa grade cujo teclado só tem A–Z. Reaproveita a mesma função
 * que o normalizador usa nas etiquetas: tirar acento é uma regra só, e ter
 * duas cópias dela é como as etiquetas do banco se partiram em duas.
 */
function semAcento(texto: string): string {
  return chaveDeTexto(texto).toUpperCase();
}

/**
 * Extrai as palavras jogáveis de um banco de perguntas.
 *
 * Fica de fora o que não dá partida: resposta com espaço ("Mar Vermelho"),
 * com número ou pontuação, e com menos de três letras. Duas palavras que só
 * diferem no acento contam como uma — no jogo elas são a mesma.
 */
export function extrairPalavras(
  perguntas: readonly Pergunta[],
  maxLetras: number,
): PalavraDoBanco[] {
  const vistas = new Set<string>();
  const saida: PalavraDoBanco[] = [];

  for (const p of perguntas) {
    const original = p.alternativas[p.correta].trim();
    const palavra = semAcento(original);
    if (!/^[A-Z]{3,}$/.test(palavra)) continue;
    if (palavra.length > maxLetras) continue;
    if (vistas.has(palavra)) continue;
    vistas.add(palavra);
    saida.push({ palavra, original, dica: p.pergunta, referencia: p.referencia });
  }

  return saida;
}

/** O poço já filtrado, estável enquanto o banco não trocar. */
export function usePocoDePalavras(maxLetras: number): PalavraDoBanco[] {
  const perguntas = usePerguntas();
  return useMemo(
    () => extrairPalavras(perguntas, maxLetras),
    [perguntas, maxLetras],
  );
}
