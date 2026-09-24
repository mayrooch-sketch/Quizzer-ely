import { useState } from 'react';
import { useTrechos } from '../../app/store';
import { Arena } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar, type Placar } from '../../shared/jogo/useBaralho';
import type { TrechoBiblico } from '../../shared/trechos/types';
import {
  criarPecas,
  ordemEstaCorreta,
  tokenizar,
  type PecaDePalavra,
} from './motorEmbaralhado';
import './embaralhado.css';

export function EmbaralhadoScreen() {
  const trechos = useTrechos();
  const baralho = useBaralho(trechos);
  const placar = usePlacar();

  if (!baralho.atual) return <p>Nenhum trecho disponível.</p>;

  return (
    <Rodada
      key={baralho.rodada}
      trecho={baralho.atual}
      todos={trechos}
      placar={placar}
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      aoSeguir={baralho.proxima}
    />
  );
}

function Rodada({
  trecho,
  todos,
  placar,
  progresso,
  aoSeguir,
}: {
  trecho: TrechoBiblico;
  todos: readonly TrechoBiblico[];
  placar: Placar;
  progresso: { posicao: number; total: number };
  aoSeguir: () => void;
}) {
  const [pecas] = useState(() => criarPecas(trecho, todos));
  const [selecionadas, setSelecionadas] = useState<PecaDePalavra[]>([]);
  const [feedback, setFeedback] = useState<'quente' | 'frio' | null>(null);
  const [teveErro, setTeveErro] = useState(false);
  const [concluida, setConcluida] = useState(false);
  const totalCorretas = tokenizar(trecho.trecho).length;
  const idsSelecionados = new Set(selecionadas.map((peca) => peca.id));
  const disponiveis = pecas.filter((peca) => !idsSelecionados.has(peca.id));

  function colocar(peca: PecaDePalavra) {
    if (concluida) return;
    setFeedback(null);
    setSelecionadas((atuais) => [...atuais, peca]);
  }

  function devolver(id: string) {
    if (concluida) return;
    setFeedback(null);
    setSelecionadas((atuais) => atuais.filter((peca) => peca.id !== id));
  }

  function conferir() {
    if (!ordemEstaCorreta(selecionadas, totalCorretas)) {
      setFeedback('frio');
      if (!teveErro) {
        setTeveErro(true);
        placar.registrar(false);
      }
      return;
    }
    setFeedback('quente');
    setConcluida(true);
    if (!teveErro) placar.registrar(true);
  }

  return (
    <Arena
      progresso={progresso}
      placar={placar}
      enunciado="Coloque as palavras na ordem certa e descubra a referência."
      detalhe="Há quatro palavras intrusas. O primeiro resultado define o placar; corrigir depois de errar conclui o desafio, sem acrescentar acerto."
      explicacao={
        concluida ? (
          <div className="embaralhado__resultado">
            <q>{trecho.trecho}</q>
            <strong>📖 {trecho.referencia}</strong>
          </div>
        ) : null
      }
      secundaria={
        concluida
          ? undefined
          : {
              label: 'Desfazer',
              onClick: () => {
                setFeedback(null);
                setSelecionadas((atuais) => atuais.slice(0, -1));
              },
              disabled: selecionadas.length === 0,
            }
      }
      primaria={
        concluida
          ? { label: 'Próxima', onClick: aoSeguir }
          : {
              label: 'Conferir',
              onClick: conferir,
              disabled: selecionadas.length === 0,
            }
      }
    >
      {feedback ? (
        <span className={`temperatura temperatura--${feedback}`} role="status">
          {feedback === 'quente' ? '🔥 Quente' : '❄️ Frio'}
        </span>
      ) : null}

      <section className="embaralhado__area" aria-label="Frase montada">
        {selecionadas.length === 0 ? (
          <span className="embaralhado__vazio">Toque nas palavras para começar.</span>
        ) : (
          selecionadas.map((peca) => (
            <button
              type="button"
              className="palavra palavra--montada"
              key={peca.id}
              onClick={() => devolver(peca.id)}
              disabled={concluida}
              aria-label={`Retirar ${peca.texto}`}
            >
              {peca.texto}
            </button>
          ))
        )}
      </section>

      {!concluida ? (
        <section className="embaralhado__banco" aria-label="Palavras disponíveis">
          {disponiveis.map((peca) => (
            <button
              type="button"
              className="palavra"
              key={peca.id}
              onClick={() => colocar(peca)}
            >
              {peca.texto}
            </button>
          ))}
        </section>
      ) : null}
    </Arena>
  );
}
