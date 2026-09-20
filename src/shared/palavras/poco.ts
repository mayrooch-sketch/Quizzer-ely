/**
 * O poço de palavras — a fonte dos jogos que reutilizam respostas do quiz.
 *
 * Anagrama, forca, caça-palavras e cruzadas não têm banco próprio: eles
 * reaproveitam a **resposta correta** das perguntas do quiz, e usam o próprio
 * enunciado como dica. Era assim no app antigo (`extractWordCandidates`), e é
 * uma boa ideia — o banco de perguntas vira centenas de alvos sem ninguém
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

function letrasDaResposta(texto: string): string | null {
  const limpa = texto.trim();
  // Aceita expressões como "Mar Vermelho" e nomes hifenizados, mas continua
  // recusando números e pontuação que os tabuleiros e teclados não representam.
  if (!/^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(limpa)) return null;
  return semAcento(limpa).replace(/[ '\u2019-]/g, '');
}

/**
 * Extrai as palavras jogáveis de um banco de perguntas.
 *
 * Fica de fora o que não dá partida: resposta com número, pontuação não
 * linguística ou menos de três letras. Espaços, hífens e apóstrofos são
 * ocultados durante a mecânica; a grafia original reaparece no resultado.
 * Duas respostas que viram a mesma sequência de letras contam como uma.
 */
export function extrairPalavras(
  perguntas: readonly Pergunta[],
  maxLetras: number,
): PalavraDoBanco[] {
  const vistas = new Set<string>();
  const saida: PalavraDoBanco[] = [];

  for (const p of perguntas) {
    const original = p.alternativas[p.correta].trim();
    const palavra = letrasDaResposta(original);
    if (!palavra || palavra.length < 3) continue;
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
