/**
 * Os onze modos do dinâmico competitivo, sorteados pelos dados.
 *
 * A tabela é a do app antigo (`DYN_DIE_MAP`), sem mudança de conteúdo: são
 * regras que o grupo já joga. Cada soma de dois dados cai num modo, e as somas
 * do meio — que saem mais vezes — ficam com os modos que rendem mais rodada.
 *
 * O que mudou é a mesma coisa que mudou no quiz competitivo: **o app faz a
 * conta**. Lá eram quatro botões ± minúsculos e o mediador somava de cabeça;
 * aqui cada modo traz os botões do veredito dele, e o "dobro ou nada" dobra
 * sozinho.
 */

import type { KnowsType } from '../../shared/types/bank';
import type { Lancamento } from '../quiz/regrasDosDados';

/**
 * De onde sai o item da rodada.
 *
 * `knows` são os seis modos de conhecimento; `palavra` são forca e anagrama,
 * que bebem do poço de respostas do quiz; `pergunta` são as perguntas de
 * múltipla escolha mostradas sem as alternativas; e `nenhuma` é o passa-a-vez,
 * que não tem item nenhum.
 */
export type FonteDoModo = 'knows' | 'palavra' | 'pergunta' | 'nenhuma';

export interface ModoDinamico {
  soma: number;
  icone: string;
  nome: string;
  /** O que o time tem de fazer, para o mediador ler em voz alta. */
  instrucao: string;
  pontuacao: string;
  fonte: FonteDoModo;
  /** Qual tipo do Knows, quando a fonte é `knows`. */
  tipo?: KnowsType;
  /** Forca ou anagrama — muda como a palavra é mostrada. */
  jogoDePalavra?: 'forca' | 'anagrama';
  botoes: [string, string];
  lancamento: Lancamento;
}

/** Ganha N pontos ao acertar, nada ao errar. */
function fixo(n: number): Lancamento {
  return { aplicar: (atual, acertou) => atual + (acertou ? n : 0) };
}

const DEPOIS = 'Depois do tempo, o outro time pode responder.';

export const MODOS: Record<number, ModoDinamico> = {
  2: {
    soma: 2,
    icone: '⚖️',
    nome: 'Verdadeiro ou falso',
    instrucao: `O time diz se a afirmação é verdadeira ou falsa. ${DEPOIS}`,
    pontuacao: 'Acertou +1 · errou 0',
    fonte: 'knows',
    tipo: 'vf',
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  3: {
    soma: 3,
    icone: '☑️',
    nome: 'Marque os corretos',
    instrucao: `O time diz todas as opções certas da lista. ${DEPOIS}`,
    pontuacao: 'Acertou tudo +2 · errou 0',
    fonte: 'knows',
    tipo: 'select',
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  4: {
    soma: 4,
    icone: '✏️',
    nome: 'Complete a frase',
    instrucao: `O time diz a palavra que falta. ${DEPOIS}`,
    pontuacao: 'Acertou +1 · errou 0',
    fonte: 'knows',
    tipo: 'cloze',
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  5: {
    soma: 5,
    icone: '⏭️',
    nome: 'Passa a vez',
    instrucao: 'Nesta rodada o time não responde: a vez passa direto.',
    pontuacao: 'Ninguém ganha nem perde ponto',
    fonte: 'nenhuma',
    botoes: ['Passar a vez', 'Passar a vez'],
    lancamento: fixo(0),
  },
  6: {
    soma: 6,
    icone: '🕵️',
    nome: 'Quem sou eu',
    instrucao: 'O mediador lê as pistas uma a uma até o time acertar.',
    pontuacao: '1ª pista +3 · 2ª +2 · 3ª +1',
    fonte: 'knows',
    tipo: 'whoami',
    botoes: ['Acertou', 'Errou'],
    lancamento: fixo(0),
  },
  7: {
    soma: 7,
    icone: '🔢',
    nome: 'Ordem',
    instrucao: `O time coloca os acontecimentos na sequência certa. ${DEPOIS}`,
    pontuacao: 'Acertou +2 · errou 0',
    fonte: 'knows',
    tipo: 'order',
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  8: {
    soma: 8,
    icone: '🪢',
    nome: 'Forca',
    instrucao: 'O time descobre a palavra pedindo letras ao mediador.',
    pontuacao: 'Acertou +2 · errou 0',
    fonte: 'palavra',
    jogoDePalavra: 'forca',
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  9: {
    soma: 9,
    icone: '🔀',
    nome: 'Anagrama',
    instrucao: `O time remonta a palavra com as letras embaralhadas. ${DEPOIS}`,
    pontuacao: 'Acertou +2 · errou 0',
    fonte: 'palavra',
    jogoDePalavra: 'anagrama',
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  10: {
    soma: 10,
    icone: '🔗',
    nome: 'Associação',
    instrucao: `O time liga cada nome à frase dele. ${DEPOIS}`,
    pontuacao: 'Acertou tudo +2 · errou 0',
    fonte: 'knows',
    tipo: 'association',
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  11: {
    soma: 11,
    icone: '🔥',
    nome: 'Dobro ou nada',
    instrucao: `Pergunta aberta, sem alternativas à vista. ${DEPOIS}`,
    pontuacao: 'Acertou: dobra os pontos · errou: perde metade',
    fonte: 'pergunta',
    botoes: ['Acertou ×2', 'Errou ÷2'],
    lancamento: {
      aplicar: (atual, acertou) => (acertou ? atual * 2 : Math.floor(atual / 2)),
    },
  },
  12: {
    soma: 12,
    icone: '❓',
    nome: 'Pergunta aberta',
    instrucao: `Pergunta do banco sem as alternativas. ${DEPOIS}`,
    pontuacao: 'Acertou +1 · errou 0',
    fonte: 'pergunta',
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
};

/**
 * Os três botões do "Quem sou eu", onde o valor depende de quantas pistas
 * foram usadas — os mesmos do dado 9 do quiz competitivo.
 */
export const PISTAS: { label: string; pontos: number }[] = [
  { label: '1ª pista +3', pontos: 3 },
  { label: '2ª pista +2', pontos: 2 },
  { label: '3ª pista +1', pontos: 1 },
];
