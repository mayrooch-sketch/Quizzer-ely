// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { conteudoDe, lerSalvos, revisarResultado, textoFavoritos, type Salvo } from '../src/shared/estudo/modelo';
import { useEstudo } from '../src/shared/estudo/store';
import { Sessao } from '../src/shared/estudo/Sessao';
import { TelasEstudo } from '../src/shared/estudo/TelasEstudo';
import { useAppStore } from '../src/app/store';
import { BANCO_VAZIO, type KnowsItemOf } from '../src/shared/types/bank';
import { VfScreen } from '../src/jogos/conhecimento/VfScreen';
import { WhoAmIScreen } from '../src/jogos/conhecimento/WhoAmIScreen';
import { AmigosScreen } from '../src/jogos/competitivo/AmigosScreen';

const vf: KnowsItemOf<'vf'> = { id: 'vf1', type: 'vf', tags: ['História'], notes: 'Explicação de teste', reference: 'Referência de teste', payload: { statement: 'Afirmação de teste', correct: true } };
const salvo: Salvo = { ...conteudoDe(vf)!, jogo: 'vf', sequencia: 0 };
beforeEach(() => {
  localStorage.clear(); useEstudo.setState({ erros: [], favoritos: [], aviso: '' });
  useAppStore.setState({ banco: { ...BANCO_VAZIO, knows: [vf] } });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('dois acertos consecutivos retiram item; erro reinicia sequência', () => {
  let lista = revisarResultado([], salvo, false);
  lista = revisarResultado(lista, salvo, true); expect(lista[0].sequencia).toBe(1);
  lista = revisarResultado(lista, salvo, false); expect(lista[0].sequencia).toBe(0);
  lista = revisarResultado(lista, salvo, true);
  expect(revisarResultado(lista, salvo, true)).toEqual([]);
});
it('valida armazenamento corrompido e conserva o texto das referências', () => {
  localStorage.setItem('teste', '{'); expect(lerSalvos('teste')).toEqual([]);
  localStorage.setItem('teste', JSON.stringify([{}, salvo])); expect(lerSalvos('teste')).toEqual([salvo]);
  expect(textoFavoritos([salvo])).toContain('Resposta: Verdadeiro');
  expect(textoFavoritos([salvo])).toContain('Referência: Referência de teste');
  expect(textoFavoritos([salvo])).toContain('Explicação: Explicação de teste');
});
it('favoritos são únicos por jogo e item e sobrevivem à leitura do armazenamento', () => {
  useEstudo.getState().favoritar(salvo); useEstudo.getState().favoritar(salvo);
  expect(useEstudo.getState().favoritos).toHaveLength(1);
  expect(lerSalvos('quizzer.estudo.favoritos.v1')).toHaveLength(1);
});
it('avisa quando o armazenamento não funciona, sem impedir o jogo', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('bloqueado'); });
  useEstudo.getState().favoritar(salvo);
  expect(useEstudo.getState().favoritos).toHaveLength(1);
  expect(useEstudo.getState().aviso).toContain('apenas nesta sessão');
});
it('finaliza imediatamente sem inventar erro para pergunta não respondida', () => {
  render(<MemoryRouter><Sessao jogo="vf"><VfScreen /></Sessao></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Finalizar partida' }));
  expect(screen.getByText('Resumo da partida')).toBeTruthy();
  expect(screen.getByText(/0 acertos sem ajuda · 0 erros/)).toBeTruthy();
  expect(screen.queryByText('Afirmação de teste')).toBeNull();
});
it('registra erro, copia favorito sem sair, finaliza e revisa somente os erros', () => {
  render(<MemoryRouter><Sessao jogo="vf"><VfScreen /></Sessao></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Favoritar conteúdo' }));
  fireEvent.click(screen.getByRole('button', { name: 'Copiar favoritos' }));
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toContain('Referência de teste');
  expect(screen.getByText('Afirmação de teste')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /Falso/ }));
  expect(useEstudo.getState().erros).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', { name: 'Finalizar partida' }));
  expect(screen.getByText(/0 acertos sem ajuda · 1 erro/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Revisar só os erros desta partida' }));
  expect(screen.queryByRole('button', { name: 'Acertei sem ajuda' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Conferir resposta' }));
  fireEvent.click(screen.getByRole('button', { name: 'Acertei sem ajuda' }));
  expect(useEstudo.getState().erros[0].sequencia).toBe(1);
});
it('botão copiar usa clipboard e falha oferece cópia manual', async () => {
  useEstudo.getState().favoritar(salvo);
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<TelasEstudo />);
  fireEvent.click(screen.getByRole('button', { name: 'Copiar texto' }));
  expect(await screen.findByText(/Texto copiado/)).toBeTruthy();
  expect(writeText).toHaveBeenCalledWith(textoFavoritos([salvo]));
  writeText.mockRejectedValueOnce(new Error('bloqueado'));
  fireEvent.click(screen.getByRole('button', { name: 'Copiar texto' }));
  expect(await screen.findByText(/copie manualmente/)).toBeTruthy();
});
it('Quem sou eu começa direto com uma pista e todas as opções', () => {
  useAppStore.setState({ banco: { ...BANCO_VAZIO, knows: [{ ...vf, type: 'whoami', payload: { hints: ['Um', 'Dois', 'Três'], answer: 'Alvo', choices: ['Alvo', 'Outro', 'Terceiro', 'Quarto'] } }] } });
  render(<MemoryRouter><Sessao jogo="whoami"><WhoAmIScreen /></Sessao></MemoryRouter>);
  expect(screen.getByText('Um')).toBeTruthy(); expect(screen.queryByText('Dois')).toBeNull();
  expect(document.querySelectorAll('.opcoes-grade button')).toHaveLength(4);
});
it('encontro permite selecionar modo, alterna times, desfaz e encerra cedo', () => {
  render(<AmigosScreen />);
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar encontro' }));
  expect(screen.getByText(/Rodada 1 de 10 · Time A/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Acertou +1' }));
  expect(screen.getByText('Time A: 1 · Time B: 0')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /Desfazer último/ }));
  expect(screen.getByText('Time A: 0 · Time B: 0')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Acertou +1' }));
  fireEvent.click(screen.getByRole('button', { name: 'Próximo desafio' }));
  expect(screen.getByText(/Rodada 2 de 10 · Time B/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Finalizar encontro agora' }));
  expect(screen.getByText(/1 rodada julgada/)).toBeTruthy();
  expect(screen.queryByRole('button', { name: 'Acertou +1' })).toBeNull();
});
