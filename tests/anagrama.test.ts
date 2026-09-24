import { describe, expect, it } from 'vitest';
import { revelarNoAnagrama } from '../src/jogos/palavras/ajudaAnagrama';

describe('Dica do anagrama', () => {
  it('move uma letra esgotada sem duplicar as peças disponíveis', () => {
    expect(revelarNoAnagrama('LUA', ['U', 'L', null], [])).toEqual({
      slots: ['L', null, null], indice: 0,
    });
  });

  it('preserva letras reveladas e permite concluir palavras com letras repetidas', () => {
    const ajuda = revelarNoAnagrama('ANA', ['A', 'A', 'N'], [0]);
    expect(ajuda).toEqual({ slots: ['A', 'N', null], indice: 1 });
    expect(revelarNoAnagrama('ANA', ajuda!.slots, [0, 1])).toEqual({
      slots: ['A', 'N', 'A'], indice: 2,
    });
    expect(revelarNoAnagrama('ANA', ['A', 'N', 'A'], [0, 1, 2])).toBeNull();
  });
});
