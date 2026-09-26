import { useMemo, useState } from 'react';
import { useKnows, usePerguntas } from '../../app/store';
import { usePocoDePalavras } from '../../shared/palavras/poco';
import { embaralhar } from '../../shared/jogo/useBaralho';
import { useRelogioModerador } from '../../shared/jogo/useRelogioModerador';
import { ItemDoModo, type ItemDaRodada } from './ItemDoModo';
import { MODOS, type ModoDinamico } from './modosDoDinamico';
import '../../shared/estudo/estudo.css';

interface Desafio { modo: ModoDinamico; item: ItemDaRodada }
export function AmigosScreen() {
  const knows = useKnows(); const perguntas = usePerguntas(); const palavras = usePocoDePalavras(12);
  const [quantidade, setQuantidade] = useState(10);
  const [duracao, setDuracao] = useState(60);
  const [selecionados, setSelecionados] = useState<number[]>([2, 4, 6, 7, 8, 9, 10, 12]);
  const [partida, setPartida] = useState<Desafio[] | null>(null);
  const disponiveis = useMemo(() => Object.values(MODOS).filter((m) => m.fonte !== 'nenhuma').map((modo) => {
    const itens: ItemDaRodada[] = modo.fonte === 'knows'
      ? knows.filter((i) => i.type === modo.tipo).map((item) => ({ fonte: 'knows', item }))
      : modo.fonte === 'palavra' ? palavras.map((palavra) => ({ fonte: 'palavra', palavra }))
        : perguntas.map((pergunta) => ({ fonte: 'pergunta', pergunta }));
    return { modo, itens };
  }), [knows, perguntas, palavras]);
  if (partida) return <Partida desafios={partida} segundosPorRodada={duracao} aoSair={() => setPartida(null)} />;
  const escolhidos = disponiveis.filter((d) => selecionados.includes(d.modo.soma) && d.itens.length > 0);
  return <section className="estudo"><h2>Partida entre amigos</h2>
    <p>O moderador segura o celular e aplica as regras. Os modos selecionados se alternam em ciclos embaralhados; os times A e B alternam a vez. O tempo nunca aplica uma penalidade sozinho.</p>
    <p>Padrão: 10 rodadas, 60 segundos por rodada. Você pode finalizar antes.</p>
    <details><summary>Ajustar encontro (opcional)</summary>
    <label>Quantidade de rodadas<select value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))}>{[4, 6, 10, 20].map((n) => <option key={n}>{n}</option>)}</select></label>
    <label>Segundos por rodada<select value={duracao} onChange={(e) => setDuracao(Number(e.target.value))}>{[30, 60, 90, 120].map((n) => <option key={n}>{n}</option>)}</select></label>
    <fieldset className="modos-amigos"><legend>Jogos participantes</legend>
      {disponiveis.map(({ modo, itens }) => <label key={modo.soma}><input type="checkbox" checked={selecionados.includes(modo.soma)} disabled={!itens.length} onChange={() => setSelecionados((atuais) => atuais.includes(modo.soma) ? atuais.filter((n) => n !== modo.soma) : [...atuais, modo.soma])} />{modo.nome}{!itens.length ? ' — sem conteúdo' : ''}</label>)}
    </fieldset>
    </details>
    <button className="btn" disabled={!escolhidos.length} onClick={() => {
      const filas = new Map(escolhidos.map((d) => [d.modo.soma, embaralhar(d.itens)]));
      let modos: typeof escolhidos = [];
      const desafios: Desafio[] = [];
      for (let i = 0; i < quantidade; i++) {
        if (!modos.length) modos = embaralhar(escolhidos);
        const escolhido = modos.shift()!;
        if (!filas.get(escolhido.modo.soma)!.length) filas.set(escolhido.modo.soma, embaralhar(escolhido.itens));
        desafios.push({ modo: escolhido.modo, item: filas.get(escolhido.modo.soma)!.shift()! });
      }
      setPartida(desafios);
    }}>Iniciar encontro</button>
  </section>;
}

function Partida({ desafios, segundosPorRodada, aoSair }: { desafios: Desafio[]; segundosPorRodada: number; aoSair: () => void }) {
  const [indice, setIndice] = useState(0);
  const [pontos, setPontos] = useState({ A: 0, B: 0 });
  const [fim, setFim] = useState(false);
  const [ultimo, setUltimo] = useState<{ indice: number; pontos: typeof pontos } | null>(null);
  const [aguardando, setAguardando] = useState(false);
  const vez = indice % 2 === 0 ? 'A' : 'B';
  const encerrado = fim || indice >= desafios.length;
  return <section className="estudo">
    <h2>{encerrado ? 'Resultado do encontro' : `Rodada ${indice + 1} de ${desafios.length} · Time ${vez}`}</h2>
    <p>Time A: {pontos.A} · Time B: {pontos.B}</p>
    {encerrado ? <><p>{pontos.A === pontos.B ? 'Empate' : `Time ${pontos.A > pontos.B ? 'A' : 'B'} venceu`} · {indice} {indice === 1 ? 'rodada julgada' : 'rodadas julgadas'}.</p>
      <button className="btn" onClick={aoSair}>Configurar novo encontro</button></> : aguardando ? <button className="btn" onClick={() => { setUltimo(null); setAguardando(false); }}>Próximo desafio</button> :
      <RodadaAmigos key={indice} desafio={desafios[indice]} duracao={segundosPorRodada} aoJulgar={(acertou, pistas) => {
        setUltimo({ indice, pontos: { ...pontos } });
        const modo = desafios[indice].modo;
        setPontos((p) => ({ ...p, [vez]: modo.soma === 6 ? p[vez] + (acertou ? Math.max(1, 4 - pistas) : 0) : modo.lancamento.aplicar(p[vez], acertou) }));
        setIndice((n) => n + 1); setAguardando(true);
      }} />}
    {ultimo && (aguardando || encerrado) ? <button className="btn btn--ghost" onClick={() => {
      setIndice(ultimo.indice); setPontos(ultimo.pontos); setUltimo(null); setAguardando(false); setFim(false);
    }}>Desfazer último resultado e repetir desafio</button> : null}
    {!encerrado ? <button className="btn btn--ghost" onClick={() => setFim(true)}>Finalizar encontro agora</button> : null}
  </section>;
}
function RodadaAmigos({ desafio, duracao, aoJulgar }: { desafio: Desafio; duracao: number; aoJulgar: (acertou: boolean, pistas: number) => void }) {
  const relogio = useRelogioModerador();
  const [pistas, setPistas] = useState(1); const [letras, setLetras] = useState<string[]>([]); const [aberto, setAberto] = useState(false);
  return <>
    <h3>{desafio.modo.nome}</h3><p>{desafio.modo.instrucao}</p><p>{desafio.modo.pontuacao}</p>
    <p role="status">{relogio.segundos ?? duracao}s · {relogio.segundos === 0 ? 'Tempo esgotado. O moderador decide.' : 'Cronômetro auxiliar'}</p>
    <div className="sessao-barra"><button className="btn" disabled={relogio.segundos === 0} onClick={() => {
      if (relogio.segundos === null) relogio.setSegundos(duracao);
      relogio.setRodando(!relogio.rodando);
    }}>{relogio.rodando ? 'Pausar' : 'Iniciar tempo'}</button><button className="btn btn--ghost" onClick={() => relogio.setSegundos(duracao)}>Reiniciar tempo</button></div>
    <ItemDoModo modo={desafio.modo} item={desafio.item} mesa={{ pistas, revelarPista: () => setPistas((n) => n + 1), letras, marcarLetra: (l) => setLetras((ls) => ls.includes(l) ? ls : [...ls, l]), aberto, abrir: () => setAberto(true) }} />
    <button className="btn" onClick={() => aoJulgar(true, pistas)}>{desafio.modo.soma === 6 ? `Acertou +${Math.max(1, 4 - pistas)}` : desafio.modo.botoes[0]}</button>
    <button className="btn btn--ghost" onClick={() => aoJulgar(false, pistas)}>{desafio.modo.botoes[1]}</button>
  </>;
}
