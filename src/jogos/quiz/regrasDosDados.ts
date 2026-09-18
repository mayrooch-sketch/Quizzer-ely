/**
 * As regras dos dados do quiz competitivo.
 *
 * Transcritas do app antigo (`ruleTextForSum`) sem mudança de conteúdo: são
 * regras que o grupo já joga, e reescrevê-las mudaria o jogo.
 *
 * O que mudou é a forma. Antes eram doze strings com quebras de linha, montadas
 * para caber num alerta. Aqui cada regra é um objeto — e é isso que permite ao
 * app **mostrar os botões daquela regra** e fazer a aritmética dela.
 *
 * **Por que o placar não é automático.** Nos dados 3, 4, 8 e 10 a resposta é
 * dada em voz alta e julgada por uma pessoa: o app não fica sabendo se o time
 * acertou. Nos dados 6 e 11 o acerto dobra o placar e o erro tira metade. No 9,
 * errar dá pontos ao adversário. O app faz a conta; quem diz o veredito é o
 * mediador.
 */

export interface Lancamento {
  /** Pontos do time que respondeu, dado o veredito. Recebe o placar atual. */
  aplicar: (placarAtual: number, acertou: boolean) => number;
  /** Quanto vai para o adversário. Só o dado 9 usa. */
  aoAdversario?: (acertou: boolean) => number;
}

export interface RegraDado {
  soma: number;
  titulo: string;
  /** O que o time tem de fazer. Aparece na tela para o mediador ler. */
  instrucao: string;
  /** Como pontua, em uma linha. */
  pontuacao: string;
  /** Segundos no cronômetro. Os relâmpagos encurtam. */
  segundos: number;
  /** Rótulos dos botões de veredito, na ordem [acertou, errou]. */
  botoes: [string, string];
  lancamento: Lancamento;
}

/** Ganha N pontos ao acertar, nada ao errar. */
function fixo(n: number): Lancamento {
  return { aplicar: (atual, acertou) => atual + (acertou ? n : 0) };
}

const NOTA_VEZ = 'Depois do tempo, o outro time pode responder.';

export const REGRAS: Record<number, RegraDado> = {
  2: {
    soma: 2,
    titulo: 'Vale 2 pontos',
    instrucao: `A pergunta da rodada vale o dobro. ${NOTA_VEZ}`,
    pontuacao: 'Acertou +2 · errou 0',
    segundos: 60,
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  3: {
    soma: 3,
    titulo: 'Responder sem pergunta',
    instrucao:
      'Uma pessoa dá dicas em palavras soltas — nunca uma frase inteira, e nunca a resposta. Ex.: templo · oração · profeta · Israel.',
    pontuacao: 'Acertou +1 · errou 0',
    segundos: 60,
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  4: {
    soma: 4,
    titulo: 'Mímica',
    instrucao: `A resposta é representada sem falar. ${NOTA_VEZ}`,
    pontuacao: 'Acertou +1 · errou 0',
    segundos: 60,
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  5: {
    soma: 5,
    titulo: 'Rodada relâmpago',
    instrucao: 'Dez segundos para responder. Depois, o outro time pode.',
    pontuacao: 'Acertou +2 · errou 0',
    segundos: 10,
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  6: {
    soma: 6,
    titulo: 'Dobro ou nada',
    instrucao: `Responda a pergunta. ${NOTA_VEZ}`,
    pontuacao: 'Acertou: dobra os pontos · errou: perde metade',
    segundos: 60,
    botoes: ['Acertou ×2', 'Errou ÷2'],
    lancamento: {
      aplicar: (atual, acertou) =>
        acertou ? atual * 2 : Math.floor(atual / 2),
    },
  },
  7: {
    soma: 7,
    titulo: 'Rodada relâmpago',
    instrucao: 'Vinte segundos para responder. Depois, o outro time pode.',
    pontuacao: 'Acertou +2 · errou 0',
    segundos: 20,
    botoes: ['Acertou +2', 'Errou'],
    lancamento: fixo(2),
  },
  8: {
    soma: 8,
    titulo: 'Pergunta sem opções',
    instrucao: `Pergunta aberta — as alternativas ficam escondidas. ${NOTA_VEZ}`,
    pontuacao: 'Acertou +1 · errou 0',
    segundos: 60,
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  9: {
    soma: 9,
    titulo: 'Quem sou eu',
    instrucao: `O mediador conduz a dinâmica do "Quem sou eu". ${NOTA_VEZ}`,
    pontuacao: '1ª pista +3 · 2ª +2 · 3ª +1 · errou dá +3 ao adversário',
    segundos: 60,
    botoes: ['Acertou', 'Errou'],
    lancamento: {
      // O quanto vale depende da pista, então a tela oferece os três botões.
      aplicar: (atual, acertou) => (acertou ? atual : atual),
      aoAdversario: (acertou) => (acertou ? 0 : 3),
    },
  },
  10: {
    soma: 10,
    titulo: 'Pode pedir uma dica',
    instrucao: `O time pode pedir uma dica ao mediador. ${NOTA_VEZ}`,
    pontuacao: 'Acertou +1 · errou 0',
    segundos: 60,
    botoes: ['Acertou +1', 'Errou'],
    lancamento: fixo(1),
  },
  11: {
    soma: 11,
    titulo: 'Dobro ou nada',
    instrucao: `Responda a pergunta. ${NOTA_VEZ}`,
    pontuacao: 'Acertou: dobra os pontos · errou: perde metade',
    segundos: 60,
    botoes: ['Acertou ×2', 'Errou ÷2'],
    lancamento: {
      aplicar: (atual, acertou) =>
        acertou ? atual * 2 : Math.floor(atual / 2),
    },
  },
  12: {
    soma: 12,
    titulo: 'Dois dados + pontos',
    instrucao: `Role os dois dados de novo: acertando, o time ganha o valor tirado. ${NOTA_VEZ}`,
    pontuacao: 'Acertou: o valor dos dados · errou: 0',
    segundos: 60,
    botoes: ['Acertou', 'Errou'],
    lancamento: fixo(0),
  },
};

/**
 * Os três botões do dado 9, onde o valor depende de quantas pistas foram
 * usadas. Ficam fora de `botoes` porque só esta regra tem três vereditos.
 */
export const PISTAS_DO_NOVE: { label: string; pontos: number }[] = [
  { label: '1ª pista +3', pontos: 3 },
  { label: '2ª pista +2', pontos: 2 },
  { label: '3ª pista +1', pontos: 1 },
];

export function rolarDados(): { a: number; b: number; soma: number } {
  const a = 1 + Math.floor(Math.random() * 6);
  const b = 1 + Math.floor(Math.random() * 6);
  return { a, b, soma: a + b };
}
