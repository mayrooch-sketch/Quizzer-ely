import type {
  DificuldadeTrecho,
  DivisaoBiblica,
  LivroBiblico,
  SecaoBiblica,
  TrechoBiblico,
  TrechoBruto,
} from './types';

export const DIVISAO_LABEL: Record<DivisaoBiblica, string> = {
  'hebraico-aramaicas': 'Escrituras Hebraico-Aramaicas',
  'gregas-cristas': 'Escrituras Gregas Cristãs',
};

export const SECAO_LABEL: Record<SecaoBiblica, string> = {
  pentateuco: 'Pentateuco',
  historicos: 'Livros históricos',
  poeticos: 'Livros poéticos',
  profeticos: 'Livros proféticos',
  evangelhos: 'Os Evangelhos',
  atos: 'Atos dos Apóstolos',
  cartas: 'Cartas',
  apocalipse: 'Apocalipse',
};

const H = 'hebraico-aramaicas' as const;
const G = 'gregas-cristas' as const;

function livros(
  nomes: readonly string[],
  divisao: DivisaoBiblica,
  secao: SecaoBiblica,
  grupo: string | null = null,
): LivroBiblico[] {
  return nomes.map((nome) => ({ nome, divisao, secao, grupo }));
}

/**
 * Os 66 livros e as divisões usadas nas portas do jogo.
 *
 * Os grupos extras existem apenas onde uma porta com doze ou mais escolhas
 * ficaria ruim no celular. Eles não mudam a seção a que o livro pertence.
 */
export const LIVROS_BIBLICOS: readonly LivroBiblico[] = [
  ...livros(
    ['Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio'],
    H,
    'pentateuco',
  ),
  ...livros(['Josué', 'Juízes', 'Rute'], H, 'historicos', 'Josué a Rute'),
  ...livros(
    ['1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas'],
    H,
    'historicos',
    'Samuel, Reis e Crônicas',
  ),
  ...livros(
    ['Esdras', 'Neemias', 'Ester'],
    H,
    'historicos',
    'Esdras a Ester',
  ),
  ...livros(
    ['Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cântico de Salomão'],
    H,
    'poeticos',
  ),
  ...livros(
    ['Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel'],
    H,
    'profeticos',
    'Isaías a Daniel',
  ),
  ...livros(
    [
      'Oseias',
      'Joel',
      'Amós',
      'Obadias',
      'Jonas',
      'Miqueias',
      'Naum',
      'Habacuque',
      'Sofonias',
      'Ageu',
      'Zacarias',
      'Malaquias',
    ],
    H,
    'profeticos',
    'Os Doze',
  ),
  ...livros(['Mateus', 'Marcos', 'Lucas', 'João'], G, 'evangelhos'),
  ...livros(['Atos'], G, 'atos'),
  ...livros(
    [
      'Romanos',
      '1 Coríntios',
      '2 Coríntios',
      'Gálatas',
      'Efésios',
      'Filipenses',
      'Colossenses',
      '1 Tessalonicenses',
      '2 Tessalonicenses',
    ],
    G,
    'cartas',
    'A várias congregações cristãs',
  ),
  ...livros(
    ['1 Timóteo', '2 Timóteo', 'Tito', 'Filêmon'],
    G,
    'cartas',
    'A cristãos individuais',
  ),
  ...livros(
    [
      'Hebreus',
      'Tiago',
      '1 Pedro',
      '2 Pedro',
      '1 João',
      '2 João',
      '3 João',
      'Judas',
    ],
    G,
    'cartas',
    'Aos cristãos em geral',
  ),
  ...livros(['Apocalipse'], G, 'apocalipse'),
];

const ALIASES: Readonly<Record<string, string>> = {
  Salmo: 'Salmos',
};

/** Encontra o livro sem depender do tamanho do nome ou de abreviações. */
export function livroDaReferencia(referencia: string): LivroBiblico {
  const nomes = [...LIVROS_BIBLICOS]
    .sort((a, b) => b.nome.length - a.nome.length)
    .map((livro) => livro.nome);
  const alias = Object.keys(ALIASES).find((nome) =>
    referencia.startsWith(`${nome} `),
  );
  const nome = alias
    ? ALIASES[alias]
    : nomes.find((candidato) => referencia.startsWith(`${candidato} `));
  const livro = LIVROS_BIBLICOS.find((item) => item.nome === nome);
  if (!livro) throw new Error(`Livro desconhecido em: ${referencia}`);
  return livro;
}

export function contarPalavras(trecho: string): number {
  return trecho.match(/[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function dificuldade(trecho: string): DificuldadeTrecho {
  const total = contarPalavras(trecho);
  if (total <= 10) return 'facil';
  if (total <= 14) return 'media';
  return 'dificil';
}

export function prepararTrechos(
  brutos: readonly TrechoBruto[],
): readonly TrechoBiblico[] {
  return brutos.map((bruto) => {
    const livro = livroDaReferencia(bruto.referencia);
    return {
      ...bruto,
      livro: livro.nome,
      divisao: livro.divisao,
      secao: livro.secao,
      grupo: livro.grupo,
      dificuldade: dificuldade(bruto.trecho),
    };
  });
}
