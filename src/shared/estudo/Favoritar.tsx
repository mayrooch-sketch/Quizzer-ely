import { useState } from 'react';
import { conteudoDe } from './modelo';
import { useEstudo } from './store';
export function Favoritar({ item, jogo }: { item: unknown; jogo: string }) {
  const [salvo, setSalvo] = useState('');
  const conteudo = conteudoDe(item);
  if (!conteudo) return null;
  return <button className="btn btn--ghost" onClick={() => {
    useEstudo.getState().favoritar({ ...conteudo, jogo, sequencia: 0 }); setSalvo(conteudo.id);
  }}>{salvo === conteudo.id ? 'Favorito salvo' : 'Favoritar conteúdo'}</button>;
}
