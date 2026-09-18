import {
  DIVISAO_LABEL,
  LIVROS_BIBLICOS,
  SECAO_LABEL,
} from '../../shared/trechos/biblioteca';
import type { TrechoBiblico } from '../../shared/trechos/types';

export type TipoEtapa = 'divisao' | 'secao' | 'grupo' | 'livro' | 'referencia';

export interface EtapaReferencia {
  tipo: TipoEtapa;
  pergunta: string;
  correta: string;
  opcoes: string[];
}

function embaralhar<T>(itens: readonly T[], aleatorio: () => number): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function unicos(itens: readonly string[]): string[] {
  return [...new Set(itens)];
}

function opcoesDeReferencia(
  atual: TrechoBiblico,
  todos: readonly TrechoBiblico[],
  aleatorio: () => number,
): string[] {
  const candidatos = [
    ...todos.filter((item) => item.livro === atual.livro),
    ...todos.filter(
      (item) => item.secao === atual.secao && item.livro !== atual.livro,
    ),
    ...todos.filter((item) => item.divisao === atual.divisao),
    ...todos,
  ];
  const outras = unicos(
    candidatos
      .map((item) => item.referencia)
      .filter((referencia) => referencia !== atual.referencia),
  );
  return embaralhar(
    [atual.referencia, ...embaralhar(outras, aleatorio).slice(0, 3)],
    aleatorio,
  );
}

export function criarEtapas(
  atual: TrechoBiblico,
  todos: readonly TrechoBiblico[],
  aleatorio: () => number = Math.random,
): EtapaReferencia[] {
  const etapas: EtapaReferencia[] = [
    {
      tipo: 'divisao',
      pergunta: 'Em que parte da Bíblia está esse trecho?',
      correta: DIVISAO_LABEL[atual.divisao],
      opcoes: embaralhar(Object.values(DIVISAO_LABEL), aleatorio),
    },
    {
      tipo: 'secao',
      pergunta: 'A que seção pertence?',
      correta: SECAO_LABEL[atual.secao],
      opcoes: embaralhar(
        unicos(
          LIVROS_BIBLICOS.filter((livro) => livro.divisao === atual.divisao).map(
            (livro) => SECAO_LABEL[livro.secao],
          ),
        ),
        aleatorio,
      ),
    },
  ];

  const livrosDaSecao = LIVROS_BIBLICOS.filter(
    (livro) =>
      livro.divisao === atual.divisao && livro.secao === atual.secao,
  );
  const grupos = unicos(
    livrosDaSecao
      .map((livro) => livro.grupo)
      .filter((grupo): grupo is string => grupo !== null),
  );

  if (atual.grupo && grupos.length > 1) {
    etapas.push({
      tipo: 'grupo',
      pergunta: 'Em qual grupo de livros?',
      correta: atual.grupo,
      opcoes: embaralhar(grupos, aleatorio),
    });
  }

  const livrosDaPorta = livrosDaSecao.filter(
    (livro) => !atual.grupo || livro.grupo === atual.grupo,
  );
  if (livrosDaPorta.length > 1) {
    etapas.push({
      tipo: 'livro',
      pergunta: 'Em qual livro?',
      correta: atual.livro,
      opcoes: embaralhar(
        livrosDaPorta.map((livro) => livro.nome),
        aleatorio,
      ),
    });
  }

  etapas.push({
    tipo: 'referencia',
    pergunta: 'Qual é a referência?',
    correta: atual.referencia,
    opcoes: opcoesDeReferencia(atual, todos, aleatorio),
  });

  return etapas;
}
