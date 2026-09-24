export type DivisaoBiblica = 'hebraico-aramaicas' | 'gregas-cristas';

export type SecaoBiblica =
  | 'pentateuco'
  | 'historicos'
  | 'poeticos'
  | 'profeticos'
  | 'evangelhos'
  | 'atos'
  | 'cartas'
  | 'apocalipse';

export type DificuldadeTrecho = 'facil' | 'media' | 'dificil';

export interface LivroBiblico {
  nome: string;
  divisao: DivisaoBiblica;
  secao: SecaoBiblica;
  /** Subdivisão mostrada como uma sala extra apenas quando ela ajuda. */
  grupo: string | null;
}

export interface TrechoBruto {
  id: string;
  trecho: string;
  referencia: string;
  /** Números das perguntas temáticas em que o texto aparece. */
  temas: number[];
}

export interface TrechoBiblico extends TrechoBruto {
  limitesConfirmados?: { capitulosAte: number; versiculosAte: Record<string, number> };
  livro: string;
  divisao: DivisaoBiblica;
  secao: SecaoBiblica;
  grupo: string | null;
  dificuldade: DificuldadeTrecho;
}
