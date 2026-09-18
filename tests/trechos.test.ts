import { describe, expect, it } from 'vitest';
import {
  LIVROS_BIBLICOS,
  contarPalavras,
} from '../src/shared/trechos/biblioteca';
import { TRECHOS_BIBLICOS } from '../src/shared/trechos/trechos';
import {
  criarPecas,
  ordemEstaCorreta,
  tokenizar,
} from '../src/jogos/embaralhado/motorEmbaralhado';
import { criarEtapas } from '../src/jogos/referencia/motorReferencia';

describe('biblioteca compartilhada', () => {
  it('mantém os 66 livros em uma classificação única', () => {
    expect(LIVROS_BIBLICOS).toHaveLength(66);
    expect(new Set(LIVROS_BIBLICOS.map((livro) => livro.nome)).size).toBe(66);
  });

  it('mantém as 103 referências únicas da seleção', () => {
    expect(TRECHOS_BIBLICOS).toHaveLength(103);
    expect(
      new Set(TRECHOS_BIBLICOS.map((trecho) => trecho.referencia)).size,
    ).toBe(103);
  });

  it('entrega fragmentos jogáveis e sem endereço externo', () => {
    for (const trecho of TRECHOS_BIBLICOS) {
      expect(contarPalavras(trecho.trecho)).toBeGreaterThanOrEqual(4);
      expect(contarPalavras(trecho.trecho)).toBeLessThanOrEqual(20);
      expect(trecho.trecho).not.toContain('…');
      expect(JSON.stringify(trecho)).not.toMatch(/https?:|www\./i);
    }
  });
});

describe('Encontre a referência', () => {
  it('sempre inclui a resposta correta e quatro referências no final', () => {
    for (const trecho of TRECHOS_BIBLICOS) {
      const etapas = criarEtapas(trecho, TRECHOS_BIBLICOS, () => 0.37);
      for (const etapa of etapas) {
        expect(etapa.opcoes).toContain(etapa.correta);
        expect(new Set(etapa.opcoes).size).toBe(etapa.opcoes.length);
      }
      const final = etapas.at(-1);
      expect(final?.tipo).toBe('referencia');
      expect(final?.opcoes).toHaveLength(4);
    }
  });
});

describe('Texto embaralhado', () => {
  it('oculta caixa e pontuação ao criar as peças', () => {
    expect(tokenizar('Uma frase, Bem-sucedida!')).toEqual([
      'uma',
      'frase',
      'bem-sucedida',
    ]);
  });

  it('mistura quatro palavras vindas de quatro textos diferentes', () => {
    const atual = TRECHOS_BIBLICOS[0];
    const pecas = criarPecas(atual, TRECHOS_BIBLICOS, () => 0.41);
    const intrusas = pecas.filter((peca) => peca.posicaoCorreta === null);
    expect(intrusas).toHaveLength(4);
    expect(new Set(intrusas.map((peca) => peca.origemId)).size).toBe(4);
    expect(pecas).toHaveLength(tokenizar(atual.trecho).length + 4);
  });

  it('não aceita prefixo, palavra intrusa ou ordem errada', () => {
    const atual = TRECHOS_BIBLICOS[0];
    const pecas = criarPecas(atual, TRECHOS_BIBLICOS, () => 0.53);
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
