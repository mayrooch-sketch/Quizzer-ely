import { describe, expect, it } from 'vitest';
import {
  LIVROS_BIBLICOS,
  contarPalavras,
} from '../src/shared/trechos/biblioteca';
import { normalizeTrechos } from '../src/shared/validation/normalize';
import { extrairPalavras } from '../src/shared/palavras/poco';
import type { Pergunta } from '../src/shared/types/bank';
import {
  criarPecas,
  ordemEstaCorreta,
  tokenizar,
} from '../src/jogos/embaralhado/motorEmbaralhado';
import {
  criarEtapas,
  separarLocalDaReferencia,
  pontosDaEtapa,
} from '../src/jogos/referencia/motorReferencia';

const TRECHOS_TESTE = normalizeTrechos({
  items: [
    {
      id: 'corintios',
      trecho: 'O próprio Filho também se sujeitará Àquele que lhe sujeitou todas as coisas.',
      referencia: '1 Coríntios 15:28',
      temas: [5],
    },
    {
      id: 'mateus',
      trecho: 'Venha o teu Reino. Seja feita a tua vontade, como no céu, assim também na terra.',
      referencia: 'Mateus 6:10',
      temas: [5],
    },
    {
      id: 'mateus-composta',
      trecho: 'Eles estipularam para ele trinta moedas de prata.',
      referencia: 'Mateus 26:14, 15; 27:5',
      temas: [6],
    },
    {
      id: 'salmo',
      trecho: 'Seu prazer está na lei de Jeová.',
      referencia: 'Salmo 1:1-3',
      temas: [1],
    },
    {
      id: 'joao',
      trecho: 'Todos os que estão nos túmulos memoriais ouvirão a sua voz.',
      referencia: 'João 5:28, 29',
      temas: [11],
    },
    {
      id: 'atos',
      trecho: 'Ele não está longe de cada um de nós.',
      referencia: 'Atos 17:27',
      temas: [2],
    },
  ],
});

describe('biblioteca compartilhada', () => {
  it('mantém os 66 livros em uma classificação única', () => {
    expect(LIVROS_BIBLICOS).toHaveLength(66);
    expect(new Set(LIVROS_BIBLICOS.map((livro) => livro.nome)).size).toBe(66);
  });

  it('normaliza os trechos recebidos do banco', () => {
    expect(TRECHOS_TESTE).toHaveLength(6);
    expect(
      new Set(TRECHOS_TESTE.map((trecho) => trecho.referencia)).size,
    ).toBe(6);
  });

  it('entrega fragmentos jogáveis e sem endereço externo', () => {
    for (const trecho of TRECHOS_TESTE) {
      expect(contarPalavras(trecho.trecho)).toBeGreaterThanOrEqual(4);
      expect(contarPalavras(trecho.trecho)).toBeLessThanOrEqual(20);
      expect(trecho.trecho).not.toContain('…');
      expect(JSON.stringify(trecho)).not.toMatch(/https?:|www\./i);
    }
  });
});

describe('Encontre a referência', () => {
  it('reduz 25 pontos por erro sem ultrapassar o piso', () => {
    expect([0, 1, 2, 3, 4, 50].map(pontosDaEtapa)).toEqual([100, 75, 50, 25, 25, 25]);
  });

  it('respeita os limites do JSON e não mistura capítulos de outros livros', () => {
    const [trecho] = normalizeTrechos({
      limitesConfirmados: { Mateus: { capitulosAte: 6, versiculosAte: { '6': 10 } } },
      items: [{ id: 'm', trecho: 'Texto de teste', referencia: 'Mateus 6:10', temas: [] }],
    });
    const etapas = criarEtapas(trecho, [...TRECHOS_TESTE, trecho]);
    expect(trecho.limitesConfirmados?.capitulosAte).toBe(6);
    expect(etapas.at(-2)!.opcoes.every((op) => Number(op) >= 1 && Number(op) <= 6)).toBe(true);
    // Referências de outro capítulo não ampliam o limite dos versículos do 6.
    expect(etapas.at(-1)!.opcoes.every((op) => Number(op) >= 1 && Number(op) <= 10)).toBe(true);
  });
  it('termina com capítulo e versículo separados, sem inventar opções além do banco', () => {
    for (const trecho of TRECHOS_TESTE) {
      const etapas = criarEtapas(trecho, TRECHOS_TESTE, () => 0.37);
      for (const etapa of etapas) {
        expect(etapa.opcoes).toContain(etapa.correta);
        expect(new Set(etapa.opcoes).size).toBe(etapa.opcoes.length);
      }
      expect(etapas.at(-2)?.tipo).toBe('capitulo');
      expect(etapas.at(-2)!.opcoes.length).toBeLessThanOrEqual(4);
      expect(etapas.at(-1)?.tipo).toBe('versiculo');
      expect(etapas.at(-1)!.opcoes.length).toBeLessThanOrEqual(4);
    }
  });

  it('separa também uma referência que passa por dois capítulos', () => {
    const trecho = TRECHOS_TESTE.find(
      (item) => item.referencia === 'Mateus 26:14, 15; 27:5',
    )!;
    expect(separarLocalDaReferencia(trecho)).toEqual({
      capitulo: '26 e 27',
      versiculo: '14, 15 e 5',
    });
  });
});

describe('Texto embaralhado', () => {
  it('aceita a troca entre peças visualmente iguais e recusa peça duplicada', () => {
    const corretas = tokenizar('Por causa do aumento do que é contra a lei.').map((texto, i) => ({
      id: `p${i}`, texto, posicaoCorreta: i, origemId: 'teste',
    }));
    const trocadas = [...corretas];
    [trocadas[2], trocadas[4]] = [trocadas[4], trocadas[2]];
    expect(ordemEstaCorreta(trocadas, corretas.length)).toBe(true);
    trocadas[4] = trocadas[2];
    expect(ordemEstaCorreta(trocadas, corretas.length)).toBe(false);
  });
  it('oculta caixa e pontuação ao criar as peças', () => {
    expect(tokenizar('Uma frase, Bem-sucedida!')).toEqual([
      'uma',
      'frase',
      'bem-sucedida',
    ]);
  });

  it('mistura quatro palavras vindas de quatro textos diferentes', () => {
    const atual = TRECHOS_TESTE[0];
    const pecas = criarPecas(atual, TRECHOS_TESTE, () => 0.41);
    const intrusas = pecas.filter((peca) => peca.posicaoCorreta === null);
    expect(intrusas).toHaveLength(4);
    expect(new Set(intrusas.map((peca) => peca.origemId)).size).toBe(4);
    expect(pecas).toHaveLength(tokenizar(atual.trecho).length + 4);
  });

  it('não aceita prefixo, palavra intrusa ou ordem errada', () => {
    const atual = TRECHOS_TESTE[0];
    const pecas = criarPecas(atual, TRECHOS_TESTE, () => 0.53);
    const corretas = pecas
      .filter((peca) => peca.posicaoCorreta !== null)
      .sort((a, b) => (a.posicaoCorreta ?? 0) - (b.posicaoCorreta ?? 0));
    const total = corretas.length;

    expect(ordemEstaCorreta(corretas, total)).toBe(true);
    expect(ordemEstaCorreta(corretas.slice(0, -1), total)).toBe(false);
    expect(
      ordemEstaCorreta([pecas.find((p) => p.posicaoCorreta === null)!, ...corretas], total),
    ).toBe(false);
    expect(ordemEstaCorreta([...corretas].reverse(), total)).toBe(false);
  });
});

describe('Poço de palavras', () => {
  const pergunta = (
    id: string,
    resposta: string,
  ): Pergunta => ({
    id,
    categoria: 'Teste',
    pergunta: `Dica para ${resposta}`,
    alternativas: { A: resposta, B: 'Outra', C: 'Mais uma', D: 'Última' },
    correta: 'A',
    referencia: 'Teste 1:1',
  });

  it('recusa expressões e nomes com separadores sem concatenar', () => {
    const palavras = extrairPalavras(
      [
        pergunta('1', 'Mar Vermelho'),
        pergunta('2', 'Bem-sucedido'),
        pergunta('3', "D'Ávila"),
      ],
      12,
    );

    expect(palavras).toEqual([]);
  });

  it('continua recusando números e pontuação não representada', () => {
    expect(
      extrairPalavras(
        [pergunta('1', 'Doze 12'), pergunta('2', 'Sim/não')],
        20,
      ),
    ).toHaveLength(0);
  });
});
