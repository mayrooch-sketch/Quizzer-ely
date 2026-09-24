import { create } from 'zustand';
import { chave, lerSalvos, revisarResultado, type Salvo } from './modelo';

const ERROS = 'quizzer.estudo.erros.v1';
const FAVORITOS = 'quizzer.estudo.favoritos.v1';
interface Estado {
  erros: Salvo[]; favoritos: Salvo[]; aviso: string;
  resultado: (item: Salvo, acertou: boolean) => void;
  favoritar: (item: Salvo) => void;
  removerFavorito: (item: Salvo) => void;
}
function guardar(chaveLocal: string, itens: Salvo[]) {
  try { localStorage.setItem(chaveLocal, JSON.stringify(itens)); return ''; }
  catch { return 'Não foi possível salvar neste aparelho. Os dados permanecem apenas nesta sessão; copie os favoritos antes de sair.'; }
}
export const useEstudo = create<Estado>((set, get) => ({
  erros: lerSalvos(ERROS), favoritos: lerSalvos(FAVORITOS), aviso: '',
  resultado(item, acertou) {
    if (acertou && !get().erros.some((i) => chave(i) === chave(item))) return;
    const erros = revisarResultado(get().erros, item, acertou);
    set({ erros, aviso: guardar(ERROS, erros) });
  },
  favoritar(item) {
    const favoritos = [...get().favoritos.filter((i) => chave(i) !== chave(item)), item];
    set({ favoritos, aviso: guardar(FAVORITOS, favoritos) });
  },
  removerFavorito(item) {
    const favoritos = get().favoritos.filter((i) => chave(i) !== chave(item));
    set({ favoritos, aviso: guardar(FAVORITOS, favoritos) });
  },
}));
