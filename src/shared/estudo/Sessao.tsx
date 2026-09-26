import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { chave, conteudoDe, type Conteudo, type Salvo } from './modelo';
import { useEstudo } from './store';
import { CopiaFavoritos, Revisao } from './TelasEstudo';
import './estudo.css';
import { ContextoSessao, type Contexto } from './contexto';

interface Resultado { item: Salvo; acertou: boolean; ajuda: boolean }
export function Sessao({ jogo, children }: { jogo: string; children: ReactNode }) {
  const [fase, setFase] = useState<'jogando' | 'resumo' | 'revisao'>('jogando');
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [ajudas, setAjudas] = useState(0);
  const [salvo, setSalvo] = useState('');
  const [copiarAberto, setCopiarAberto] = useState(false);
  const aviso = useEstudo((s) => s.aviso);
  // Estável para não repetir a seleção do conteúdo ao atualizar o resumo.
  const atual = useMemo(() => (item: unknown) => setConteudo(conteudoDe(item)), []);
  const contexto = useMemo<Contexto>(() => ({
    atual,
    registrar: (acertou, item, ajuda = false) => {
      const c = conteudoDe(item) ?? conteudo;
      if (!c) return;
      const entrada = { ...c, jogo, sequencia: 0 };
      setResultados((anteriores) => [...anteriores, { item: entrada, acertou, ajuda }]);
      // Uma conclusão assistida não retira uma pergunta da revisão.
      if (!acertou || (!ajuda && jogo !== 'encontre-referencia')) useEstudo.getState().resultado(entrada, acertou);
    },
    ajudar: () => setAjudas((n) => n + 1),
  }), [jogo, conteudo, atual]);
  const erros = [...new Map(resultados.filter((r) => !r.acertou).map((r) => [chave(r.item), r.item])).values()];
  const assuntos = [...new Set(erros.map((i) => i.assunto))];
  const certas = resultados.filter((r) => r.acertou && !r.ajuda).length;
  const erradas = resultados.filter((r) => !r.acertou).length;
  const assistidas = resultados.filter((r) => r.acertou && r.ajuda).length;
  if (fase === 'revisao') return <Revisao itens={erros} aoVoltar={() => setFase('resumo')} />;
  if (fase === 'resumo') return <section className="estudo">
    <h2>Resumo da partida</h2>
    <p>{certas} {certas === 1 ? 'acerto' : 'acertos'} sem ajuda · {erradas} {erradas === 1 ? 'erro' : 'erros'} · {assistidas} {assistidas === 1 ? 'conclusão' : 'conclusões'} com ajuda</p>
    <p>{ajudas} {ajudas === 1 ? 'pedido' : 'pedidos'} de ajuda.</p>
    {jogo === 'encontre-referencia' ? <p>Os resultados contam portas. Para retirar o trecho da revisão, acerte a referência completa nos cartões de revisão.</p> : null}
    {jogo === 'cruzadas' ? <p>Conta a primeira conferência de cada palavra preenchida. Palavras não conferidas não são julgadas.</p> : null}
    {jogo === 'caca-palavras' ? <p>Contam palavras encontradas. Traços sem uma palavra não geram pergunta para revisar.</p> : null}
    {jogo === 'memoria' ? <p>Contam tentativas de formar pares.</p> : null}
    <p>Itens não respondidos não contam como erros.</p>
    {assuntos.length ? <p>Assuntos para revisar: {assuntos.join('; ')}</p> : <p>Nenhum erro registrado nesta partida.</p>}
    <button className="btn" disabled={!erros.length} onClick={() => setFase('revisao')}>Revisar só os erros desta partida</button>
    <button className="btn btn--ghost" onClick={() => { setResultados([]); setAjudas(0); setConteudo(null); setFase('jogando'); }}>Nova partida</button>
    <Link to="/estudo">Meus erros e favoritos</Link>
  </section>;
  return <ContextoSessao.Provider value={contexto}>
    <div className="sessao-barra">
      <button className="btn btn--ghost" onClick={() => setFase('resumo')}>Finalizar partida</button>
      <button className="btn btn--ghost" disabled={!conteudo} onClick={() => {
        if (conteudo) { useEstudo.getState().favoritar({ ...conteudo, jogo, sequencia: 0 }); setSalvo(conteudo.id); }
      }}>{conteudo && salvo === conteudo.id ? 'Favorito salvo' : 'Favoritar conteúdo'}</button>
      <button className="btn btn--ghost" onClick={() => setCopiarAberto((aberto) => !aberto)}>{copiarAberto ? 'Fechar texto dos favoritos' : 'Copiar favoritos'}</button>
    </div>
    {aviso ? <p role="status">{aviso}</p> : null}
    {copiarAberto ? <CopiaFavoritos /> : null}
    {children}
  </ContextoSessao.Provider>;
}
