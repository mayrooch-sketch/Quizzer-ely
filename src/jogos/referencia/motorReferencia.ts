import {
  DIVISAO_LABEL,
  LIVROS_BIBLICOS,
  SECAO_LABEL,
} from '../../shared/trechos/biblioteca';
import type { TrechoBiblico } from '../../shared/trechos/types';

export type TipoEtapa =
  | 'divisao'
  | 'secao'
  | 'grupo'
  | 'livro'
  | 'capitulo'
  | 'versiculo';

export interface EtapaReferencia {
  tipo: TipoEtapa;
  pergunta: string;
  correta: string;
  opcoes: string[];
}

export function pontosDaEtapa(erros: number): number {
  return Math.max(25, 100 - erros * 25);
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

export interface LocalDaReferencia {
  capitulo: string;
  versiculo: string;
}

/** Separa inclusive referências compostas, como `26:14, 15; 27:5`. */
export function separarLocalDaReferencia(
  trecho: Pick<TrechoBiblico, 'livro' | 'referencia'>,
): LocalDaReferencia {
  const local = trecho.referencia.slice(trecho.livro.length).trim();
  const partes = local.split(';').map((parte) => parte.trim());
  const capitulos = partes.map((parte) => parte.split(':', 1)[0].trim());
  const versiculos = partes.map((parte) => parte.slice(parte.indexOf(':') + 1).trim());

  return {
    capitulo: unicos(capitulos).join(' e '),
    versiculo: versiculos.join(' e '),
  };
}

function quatroOpcoes(
  correta: string,
  candidatos: readonly string[],
  aleatorio: () => number,
): string[] {
  const outras = unicos(candidatos).filter((opcao) => opcao !== correta);
  return embaralhar(
    [correta, ...embaralhar(outras, aleatorio).slice(0, 3)],
    aleatorio,
  );
}

function opcoesDeCapitulo(
  atual: TrechoBiblico,
  todos: readonly TrechoBiblico[],
  aleatorio: () => number,
): string[] {
  const correta = separarLocalDaReferencia(atual).capitulo;
  const conhecidos = todos.filter((item) => item.livro === atual.livro);
  const maximo = atual.limitesConfirmados?.capitulosAte ?? Math.max(
    ...[atual, ...conhecidos].flatMap((item) => separarLocalDaReferencia(item).capitulo.match(/\d+/g)!.map(Number)),
  );
  return quatroOpcoes(
    correta,
    Array.from({ length: maximo }, (_, i) => String(i + 1)),
    aleatorio,
  );
}

function opcoesDeVersiculo(
  atual: TrechoBiblico,
  todos: readonly TrechoBiblico[],
  aleatorio: () => number,
): string[] {
  const localAtual = separarLocalDaReferencia(atual);
  const limites: Record<string, number> = { ...atual.limitesConfirmados?.versiculosAte };
  for (const item of [atual, ...todos.filter((t) => t.livro === atual.livro)]) {
    for (const parte of item.referencia.slice(item.livro.length).trim().split(';')) {
      const [capitulo, versos] = parte.trim().split(':');
      if (!versos) continue;
      limites[capitulo] = Math.max(limites[capitulo] ?? 0, ...versos.match(/\d+/g)!.map(Number));
    }
  }
  const capitulos = localAtual.capitulo.match(/\d+/g)!;
  const maximo = Math.min(...capitulos.map((capitulo) => limites[capitulo] ?? 1));
  return quatroOpcoes(
    localAtual.versiculo,
    Array.from({ length: maximo }, (_, i) => String(i + 1)),
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

  const local = separarLocalDaReferencia(atual);
  etapas.push(
    {
      tipo: 'capitulo',
      pergunta: 'Agora, escolha o capítulo.',
      correta: local.capitulo,
      opcoes: opcoesDeCapitulo(atual, todos, aleatorio),
    },
    {
      tipo: 'versiculo',
      pergunta: 'Por fim, escolha o versículo.',
      correta: local.versiculo,
      opcoes: opcoesDeVersiculo(atual, todos, aleatorio),
    },
  );

  return etapas;
}
