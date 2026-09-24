import { useState } from 'react';
import { chave, textoFavoritos, type Salvo } from './modelo';
import { useEstudo } from './store';
import './estudo.css';

export function Revisao({ itens, aoVoltar }: { itens: Salvo[]; aoVoltar: () => void }) {
  const [fila] = useState(() => [...itens]);
  const [indice, setIndice] = useState(0);
  const [aberta, setAberta] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [encerrada, setEncerrada] = useState(false);
  const item = encerrada ? undefined : fila[indice];
  function julgar(acertou: boolean) {
    if (!aberta || !item) return;
    useEstudo.getState().resultado(item, acertou);
    if (acertou) setAcertos((n) => n + 1);
    setIndice((n) => n + 1); setAberta(false);
  }
  return <section className="estudo">
    <h2>Revisar meus erros</h2>
    <p>Responda mentalmente e depois confira. Esta revisão é uma autoavaliação. Dois acertos consecutivos sem ajuda retiram o item da lista.</p>
    {item ? <>
      <p>{indice + 1} de {fila.length}</p><p className="estudo-texto">{item.pergunta}</p>
      {aberta ? <><p className="estudo-texto"><strong>Resposta:</strong> {item.resposta}</p>
        {item.referencia && <p>Referência: {item.referencia}</p>}{item.explicacao && <p>{item.explicacao}</p>}
        <button className="btn" onClick={() => julgar(true)}>Acertei sem ajuda</button>
        <button className="btn btn--ghost" onClick={() => julgar(false)}>Errei ou precisei de ajuda</button>
      </> : <button className="btn" onClick={() => setAberta(true)}>Conferir resposta</button>}
    </> : <p>Resumo da revisão: {acertos} acertos e {indice - acertos} erros em {indice} itens. Os demais não foram julgados.</p>}
    <button className="btn btn--ghost" onClick={item ? () => setEncerrada(true) : aoVoltar}>{item ? 'Finalizar revisão' : 'Voltar'}</button>
  </section>;
}

export function TelasEstudo() {
  const { favoritos, erros, aviso, removerFavorito } = useEstudo();
  const [revisao, setRevisao] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const texto = textoFavoritos(favoritos);
  if (revisao) return <Revisao itens={erros} aoVoltar={() => setRevisao(false)} />;
  return <section className="estudo">
    <h2>Meus erros</h2><p>{erros.length} itens para revisar neste aparelho.</p>
    <button className="btn" disabled={!erros.length} onClick={() => setRevisao(true)}>Revisar meus erros</button>
    <h2>Favoritos para copiar</h2>
    <p>Copie e salve onde preferir. Nada é enviado automaticamente.</p>
    {favoritos.map((item) => <article key={chave(item)}>
      <p>{item.pergunta}</p><button className="btn btn--ghost" onClick={() => removerFavorito(item)}>Retirar favorito</button>
    </article>)}
    <label>Texto dos favoritos<textarea readOnly value={favoritos.length ? texto : ''} rows={10} onFocus={(e) => e.currentTarget.select()} /></label>
    <button className="btn" disabled={!favoritos.length} onClick={async () => {
      try { await navigator.clipboard.writeText(texto); setMensagem('Texto copiado. Agora cole onde quiser.'); }
      catch { setMensagem('Não foi possível copiar automaticamente. Selecione o texto acima e copie manualmente.'); }
    }}>Copiar texto</button>
    <p role="status">{mensagem || aviso}</p>
  </section>;
}

export function CopiaFavoritos() {
  const favoritos = useEstudo((s) => s.favoritos);
  const [status, setStatus] = useState('');
  const texto = favoritos.length ? textoFavoritos(favoritos) : '';
  return <section className="estudo copia-favoritos">
    <label>Texto para salvar<textarea rows={5} value={texto} readOnly onFocus={(e) => e.currentTarget.select()} /></label>
    <button className="btn" disabled={!texto} onClick={async () => {
      try { await navigator.clipboard.writeText(texto); setStatus('Texto copiado.'); }
      catch { setStatus('Selecione o texto acima e copie manualmente.'); }
    }}>Copiar texto</button><p role="status">{status}</p>
  </section>;
}
