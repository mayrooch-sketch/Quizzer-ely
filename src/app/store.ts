/**
 * Estado global.
 *
 * Guarda **só o que mais de uma tela precisa**: o banco de perguntas e o estado
 * do carregamento. Cada jogo guarda a partida dele em `useState` no próprio
 * componente.
 *
 * Essa divisão é o oposto do app antigo, onde um único objeto `APP.state`
 * carregava o quiz, os oito jogos e o modal — e qualquer mexida em qualquer
 * jogo passava por ele. Aqui, mudar a regra da forca não toca em nada que a
 * cruzada leia.
 */

import { create } from 'zustand';
import {
  buscarDaRede,
  carregarDoCache,
  versaoEmCache,
  versaoPublicada,
  type OrigemBanco,
} from '../shared/data/bancoLoader';
import { BANCO_VAZIO, type Banco } from '../shared/types/bank';

interface AppState {
  banco: Banco;
  origem: OrigemBanco;
  /** Verdadeiro só enquanto a primeira busca acontece sem nada em cache. */
  carregando: boolean;
  /** Preenchido quando a busca falhou e não havia cache. */
  erro: string | null;

  iniciar: () => void;
  buscarAgora: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  banco: BANCO_VAZIO,
  origem: 'vazio',
  carregando: false,
  erro: null,

  /**
   * Abre com o cache e confere a rede em segundo plano.
   *
   * A conferência é pela versão publicada, não pelo banco inteiro: baixar
   * 1,8 MB a cada abertura para descobrir que nada mudou seria caro justamente
   * no celular, que é onde o app é usado.
   */
  iniciar() {
    const doCache = carregarDoCache();
    set({
      banco: doCache.banco,
      origem: doCache.origem,
      carregando: doCache.origem === 'vazio',
      erro: null,
    });

    void (async () => {
      const publicada = await versaoPublicada();
      const local = versaoEmCache();

      // Já está em dia: nada a baixar.
      if (doCache.origem === 'cache' && publicada !== null && publicada === local) {
        return;
      }
      // Sem rede e com cache: segue com o cache, sem alarme.
      if (publicada === null && doCache.origem === 'cache') return;

      await get().buscarAgora();
    })();
  },

  async buscarAgora() {
    try {
      const banco = await buscarDaRede();
      if (banco.perguntas.length === 0 && banco.knows.length === 0) {
        // Resposta vazia não substitui um cache que funciona.
        if (get().origem === 'cache') {
          set({ carregando: false });
          return;
        }
        set({ carregando: false, erro: 'O banco veio vazio.' });
        return;
      }
      set({ banco, origem: 'rede', carregando: false, erro: null });
    } catch {
      // Falhou com cache na mão: o usuário continua jogando e não fica sabendo
      // de um problema que não o afeta.
      if (get().origem === 'cache') {
        set({ carregando: false });
        return;
      }
      set({
        carregando: false,
        erro: 'Não foi possível baixar as perguntas. Verifique a conexão.',
      });
    }
  },
}));

/* ------------------------------------------------------------------ *
 * Leitores
 * ------------------------------------------------------------------ */

export function usePerguntas() {
  return useAppStore((s) => s.banco.perguntas);
}

export function useKnows() {
  return useAppStore((s) => s.banco.knows);
}
