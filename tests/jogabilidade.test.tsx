// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { useBaralho } from '../src/shared/jogo/useBaralho';
import { useRelogioModerador } from '../src/shared/jogo/useRelogioModerador';
import { useAppStore } from '../src/app/store';
import { BANCO_VAZIO, type Pergunta } from '../src/shared/types/bank';
import { CompetitivoScreen } from '../src/jogos/quiz/CompetitivoScreen';
import { DinamicoScreen } from '../src/jogos/competitivo/DinamicoScreen';
import { AnagramaScreen } from '../src/jogos/palavras/AnagramaScreen';
import { ReferenciaScreen } from '../src/jogos/referencia/ReferenciaScreen';
import { normalizeTrechos } from '../src/shared/validation/normalize';
import * as dados from '../src/jogos/quiz/regrasDosDados';

const pergunta: Pergunta = { id: 'p', categoria: 'Teste', pergunta: 'Quem construiu a arca?', alternativas: { A: 'Noé', B: 'Abraão', C: 'Moisés', D: 'Davi' }, correta: 'A', referencia: 'Gênesis 6:14' };
beforeEach(() => {
  useAppStore.setState({ banco: { ...BANCO_VAZIO, perguntas: [pergunta], knows: [
    { id: 'quem', type: 'whoami', notes: '', reference: 'Gênesis 6:14', tags: [], payload: { answer: 'Noé', hints: ['Pista um', 'Pista dois', 'Pista três'], choices: ['Noé', 'Moisés'] } },
    { id: 'vf', type: 'vf', notes: '', reference: 'Gênesis 6:14', tags: [], payload: { statement: 'Afirmação de teste', correct: true } },
  ] } });
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('baralho', () => {
  it('preserva o item durante atualização e aplica o novo banco no ciclo seguinte', () => {
    const misturar = vi.fn((itens: readonly string[]) => [...itens]);
    const { result, rerender } = renderHook(({ itens }) => useBaralho(itens, misturar), { initialProps: { itens: ['a', 'b'] } });
    const proxima = result.current.proxima;
    rerender({ itens: ['c', 'd'] });
    expect(result.current.atual).toBe('a');
    expect(result.current.proxima).toBe(proxima);
    act(() => result.current.proxima());
    expect(result.current.atual).toBe('b');
    act(() => result.current.proxima());
    expect(result.current.atual).toBe('c');
    expect(misturar).toHaveBeenCalledTimes(2);
    act(() => result.current.voltar());
    expect(result.current.atual).toBe('b');
  });
  it('carrega um banco tardio e renova a rodada mesmo com um item só', () => {
    const { result, rerender } = renderHook(({ itens }) => useBaralho(itens), { initialProps: { itens: [] as string[] } });
    rerender({ itens: ['a'] });
    expect(result.current.atual).toBe('a');
    act(() => result.current.proxima());
    expect(result.current.rodada).toBe(1);
  });
});

it('cronômetro desconta suspensão, conserva pausa e reinicia', () => {
  vi.useFakeTimers(); vi.setSystemTime(1000);
  const { result } = renderHook(() => useRelogioModerador());
  act(() => result.current.setSegundos(60));
  act(() => result.current.setRodando(true));
  vi.setSystemTime(31000);
  act(() => vi.advanceTimersByTime(100));
  expect(result.current.segundos).toBe(30);
  act(() => result.current.setRodando(false));
  act(() => vi.advanceTimersByTime(60000));
  expect(result.current.segundos).toBe(30);
  act(() => result.current.setRodando(true));
  act(() => vi.advanceTimersByTime(30000));
  expect(result.current.segundos).toBe(0);
  expect(result.current.rodando).toBe(false);
  act(() => result.current.setSegundos(60));
  expect(result.current.segundos).toBe(60);
  expect(result.current.rodando).toBe(false);
});

it('quiz competitivo restaura pergunta, pontos e turno ao desfazer', () => {
  vi.spyOn(dados, 'rolarDados').mockReturnValue({ a: 1, b: 1, soma: 2 });
  render(<CompetitivoScreen />);
  fireEvent.click(screen.getByRole('button', { name: 'Rolar os dados' }));
  fireEvent.click(screen.getByRole('button', { name: 'Acertou +2' }));
  expect(screen.getByRole('button', { name: /Time A/ }).textContent).toContain('2');
  fireEvent.click(screen.getByRole('button', { name: /Desfazer último/ }));
  expect(screen.getByRole('button', { name: /Time A/ }).textContent).toContain('joga agora0');
  expect(screen.getByText(pergunta.pergunta)).toBeTruthy();
  expect(screen.queryByRole('button', { name: /Desfazer último/ })).toBeNull();
});

it('dinâmico restaura o mesmo desafio e permite corrigir o julgamento', () => {
  vi.spyOn(dados, 'rolarDados').mockReturnValue({ a: 1, b: 1, soma: 2 });
  render(<DinamicoScreen />);
  fireEvent.click(screen.getByRole('button', { name: 'Rolar os dados' }));
  fireEvent.click(screen.getByRole('button', { name: 'Acertou +1' }));
  fireEvent.click(screen.getByRole('button', { name: /Desfazer último/ }));
  expect(screen.getByText('Afirmação de teste')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Errou' }));
  expect(screen.getByRole('button', { name: /Time A/ }).textContent).toContain('0');
});

it('soma nove usa pistas reais e só oferece o valor correspondente', () => {
  vi.spyOn(dados, 'rolarDados').mockReturnValue({ a: 4, b: 5, soma: 9 });
  render(<CompetitivoScreen />);
  fireEvent.click(screen.getByRole('button', { name: 'Rolar os dados' }));
  expect(screen.getByText('1ª pista: Pista um')).toBeTruthy();
  expect(screen.queryByText(pergunta.pergunta)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Revelar próxima pista' }));
  expect((screen.getByRole('button', { name: '1ª pista +3' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: '2ª pista +2' }));
  expect(screen.getByRole('button', { name: /Time A/ }).textContent).toContain('2');
});

it('anagrama concluído inteiramente por dicas não recebe acerto independente', () => {
  const { container } = render(<AnagramaScreen />);
  fireEvent.click(screen.getByRole('button', { name: /Dica/ }));
  for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: /Uma letra/ }));
  expect(screen.getByText(/Concluído com ajuda/)).toBeTruthy();
  expect(container.querySelector('.arena__placar')?.getAttribute('aria-label')).toBe('0 acertos e 0 erros');
});

it('Referência pontua cada porta e rever não duplica pontos', () => {
  useAppStore.setState({ banco: { ...BANCO_VAZIO, trechos: normalizeTrechos({ items: [{ id: 't', trecho: 'Texto de teste', referencia: 'Mateus 6:10', temas: [] }] }) } });
  render(<ReferenciaScreen />);
  fireEvent.click(screen.getByRole('button', { name: /Escrituras Hebraico/ }));
  fireEvent.click(screen.getByRole('button', { name: /Escrituras Gregas/ }));
  expect(screen.getByText(/· 75 pontos/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Rever caminho' }));
  fireEvent.click(screen.getByRole('button', { name: /Escrituras Gregas/ }));
  expect(screen.getByText(/· 75 pontos/)).toBeTruthy();
});
