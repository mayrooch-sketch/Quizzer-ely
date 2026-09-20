/**
 * O catálogo de jogos — fonte única.
 *
 * A home, as rotas e o título do cabeçalho saem todos daqui. No app antigo
 * essas três coisas eram três listas separadas: os botões em `viewHome()`, os
 * nomes em `headerView()` e os destinos no `switch` de `route()`. Acrescentar
 * um jogo significava lembrar dos três lugares, e esquecer um só aparecia
 * clicando.
 *
 * Os grupos e os emojis são os mesmos do original. Foram escolhidos por quem
 * usa o app, e não há motivo para reinventá-los.
 */

export const GRUPOS = [
  'competitivo',
  'palavras',
  'conhecimento',
  'tabuleiro',
] as const;

export type Grupo = (typeof GRUPOS)[number];

export const GRUPO_INFO: Record<Grupo, { titulo: string; emoji: string }> = {
  competitivo: { titulo: 'Competitivo', emoji: '🏆' },
  palavras: { titulo: 'Jogos de palavras', emoji: '🔤' },
  conhecimento: { titulo: 'Conhecimento', emoji: '📖' },
  tabuleiro: { titulo: 'Jogos de tabuleiro', emoji: '🎲' },
};

export type JogoId =
  | 'quiz-competitivo'
  | 'dinamico-competitivo'
  | 'quiz-categoria'
  | 'contra-relogio'
  | 'anagrama'
  | 'forca'
  | 'caca-palavras'
  | 'cruzadas'
  | 'vf'
  | 'select'
  | 'cloze'
  | 'association'
  | 'whoami'
  | 'order'
  | 'encontre-referencia'
  | 'texto-embaralhado'
  | 'memoria'
  | 'bingo';

export interface Jogo {
  id: JogoId;
  label: string;
  emoji: string;
  grupo: Grupo;
  /**
   * Uma linha dizendo o que o jogo pede.
   *
   * Lição do outro app: quem usa não é quem construiu, e uma linha de
   * explicação é o que permite aprender abrindo, sem manual.
   */
  descricao: string;
  /** De qual banco o jogo se alimenta. Governa o aviso de banco vazio. */
  fonte: 'quiz' | 'knows' | 'palavras' | 'trechos';
}

export const JOGOS: Jogo[] = [
  {
    id: 'quiz-competitivo',
    label: 'Quiz competitivo',
    emoji: '🏁',
    grupo: 'competitivo',
    descricao: 'Dois times, dados e cronômetro. Quem responde mais, ganha.',
    fonte: 'quiz',
  },
  {
    id: 'dinamico-competitivo',
    label: 'Dinâmico competitivo',
    emoji: '⚔️',
    grupo: 'competitivo',
    descricao: 'Onze modos variados, disputados entre times.',
    fonte: 'knows',
  },

  {
    id: 'quiz-categoria',
    label: 'Quiz por categoria',
    emoji: '📚',
    grupo: 'palavras',
    descricao: 'Escolha um assunto e responda no seu ritmo.',
    fonte: 'quiz',
  },
  {
    id: 'contra-relogio',
    label: 'Contra o relógio',
    emoji: '⏱️',
    grupo: 'palavras',
    descricao: 'Quantas você acerta antes do tempo acabar?',
    fonte: 'quiz',
  },
  {
    id: 'anagrama',
    label: 'Anagrama',
    emoji: '🔀',
    grupo: 'palavras',
    descricao: 'As letras estão embaralhadas. Remonte a palavra.',
    fonte: 'palavras',
  },
  {
    id: 'forca',
    label: 'Forca',
    emoji: '🪢',
    grupo: 'palavras',
    descricao: 'Descubra a palavra letra por letra, com seis chances.',
    fonte: 'palavras',
  },
  {
    id: 'caca-palavras',
    label: 'Caça-palavras',
    emoji: '🔎',
    grupo: 'palavras',
    descricao: 'Ache as palavras escondidas na grade.',
    fonte: 'palavras',
  },
  {
    id: 'cruzadas',
    label: 'Palavras cruzadas',
    emoji: '🧩',
    grupo: 'palavras',
    descricao: 'Preencha a grade usando as dicas.',
    fonte: 'palavras',
  },

  {
    id: 'vf',
    label: 'Verdadeiro ou falso',
    emoji: '⚖️',
    grupo: 'conhecimento',
    descricao: 'Uma afirmação por vez. Está certa ou errada?',
    fonte: 'knows',
  },
  {
    id: 'select',
    label: 'Marque os corretos',
    emoji: '☑️',
    grupo: 'conhecimento',
    descricao: 'Mais de uma resposta certa na mesma lista.',
    fonte: 'knows',
  },
  {
    id: 'cloze',
    label: 'Complete a frase',
    emoji: '✏️',
    grupo: 'conhecimento',
    descricao: 'Falta uma palavra. Escolha qual.',
    fonte: 'knows',
  },
  {
    id: 'association',
    label: 'Associação',
    emoji: '🔗',
    grupo: 'conhecimento',
    descricao: 'Ligue cada item da esquerda ao par dele.',
    fonte: 'knows',
  },
  {
    id: 'whoami',
    label: 'Quem sou eu?',
    emoji: '🕵️',
    grupo: 'conhecimento',
    descricao: 'Pistas que levam a um nome — quanto menos usar, melhor.',
    fonte: 'knows',
  },
  {
    id: 'order',
    label: 'Ordem',
    emoji: '🔢',
    grupo: 'conhecimento',
    descricao: 'Coloque os acontecimentos na sequência certa.',
    fonte: 'knows',
  },
  {
    id: 'encontre-referencia',
    label: 'Encontre a referência',
    emoji: '🚪',
    grupo: 'conhecimento',
    descricao: 'Siga as pistas até encontrar de onde vem o trecho.',
    fonte: 'trechos',
  },
  {
    id: 'texto-embaralhado',
    label: 'Texto embaralhado',
    emoji: '🧱',
    grupo: 'conhecimento',
    descricao: 'Organize as palavras e descubra a referência.',
    fonte: 'trechos',
  },

  {
    id: 'memoria',
    label: 'Memória',
    emoji: '🃏',
    grupo: 'tabuleiro',
    descricao: 'Vire as cartas e ache os pares.',
    fonte: 'knows',
  },
  {
    id: 'bingo',
    label: 'Bingo',
    emoji: '🎱',
    grupo: 'tabuleiro',
    descricao: 'Marque na cartela o que for cantado.',
    fonte: 'quiz',
  },
];

export const JOGOS_POR_GRUPO = GRUPOS.map((grupo) => ({
  grupo,
  ...GRUPO_INFO[grupo],
  jogos: JOGOS.filter((j) => j.grupo === grupo),
}));

export function caminhoDoJogo(id: JogoId): string {
  return `/jogo/${id}`;
}

export function jogoPorId(id: string): Jogo | undefined {
  return JOGOS.find((j) => j.id === id);
}
