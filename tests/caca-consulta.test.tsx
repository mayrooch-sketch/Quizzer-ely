// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../src/app/store';
import { BANCO_VAZIO, type Pergunta } from '../src/shared/types/bank';
import { CacaPalavrasScreen } from '../src/jogos/palavras/CacaPalavrasScreen';

vi.mock('../src/jogos/palavras/gerarCaca', async (original) => ({
  ...await original<typeof import('../src/jogos/palavras/gerarCaca')>(),
  gerarCaca: ({ poco, tam }: { poco: Array<{ palavra: string }>; tam: number }) => ({
    tam, letras: Array(tam * tam).fill('A'),
    palavras: poco.map((p, i) => ({ ...p, celulas: [i, i + 1] })),
  }),
}));
afterEach(cleanup);

it('consulta pergunta e referência sem marcar palavra ou mudar contador', () => {
  const nomes = ['Noé', 'Abraão', 'Moisés', 'Davi', 'Sara', 'Rute', 'Ester', 'Paulo', 'Pedro', 'João'];
  const perguntas: Pergunta[] = nomes.map((nome, i) => ({
    id: String(i), categoria: 'Teste', pergunta: `Pergunta de teste ${i}`,
    alternativas: { A: nome, B: 'Outra', C: 'Outra', D: 'Outra' }, correta: 'A',
    referencia: i === 0 ? 'Gênesis 6:14' : '',
  }));
  useAppStore.setState({ banco: { ...BANCO_VAZIO, perguntas } });
  render(<CacaPalavrasScreen />);
  fireEvent.click(screen.getByRole('button', { name: 'NOE' }));
  expect(screen.getByText('Pergunta de teste 0')).toBeTruthy();
  expect(screen.getByText('📖 Gênesis 6:14')).toBeTruthy();
  expect(screen.getByText('0 de 10')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'SARA' }));
  expect(screen.getByText('Pergunta de teste 4')).toBeTruthy();
  expect(screen.queryByText('📖 Gênesis 6:14')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'SARA' }));
  expect(screen.queryByText('Pergunta de teste 4')).toBeNull();
  expect(screen.getByText('0 de 10')).toBeTruthy();
});
