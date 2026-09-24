import { useRef, useState } from 'react';
import { useTrechos } from '../../app/store';
import { Arena } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar, type Placar } from '../../shared/jogo/useBaralho';
import type { TrechoBiblico } from '../../shared/trechos/types';
import { criarEtapas, pontosDaEtapa } from './motorReferencia';
import './referencia.css';

export function ReferenciaScreen() {
  const trechos = useTrechos();
  const baralho = useBaralho(trechos);
  const placar = usePlacar();
  const [pontos, setPontos] = useState(0);

  if (!baralho.atual) return <p>Nenhum trecho disponível.</p>;

  return (
    <Rodada
      key={baralho.rodada}
      trecho={baralho.atual}
      todos={trechos}
      placar={placar}
      pontos={pontos}
      somarPontos={(valor) => setPontos((total) => total + valor)}
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      aoSeguir={baralho.proxima}
    />
  );
}

function Rodada({
  trecho,
  todos,
  placar,
  pontos,
  somarPontos,
  progresso,
  aoSeguir,
}: {
  trecho: TrechoBiblico;
  todos: readonly TrechoBiblico[];
  placar: Placar;
  pontos: number;
  somarPontos: (valor: number) => void;
  progresso: { posicao: number; total: number };
  aoSeguir: () => void;
}) {
  const [etapas] = useState(() => criarEtapas(trecho, todos));
  const [indice, setIndice] = useState(0);
  const [feedback, setFeedback] = useState<'quente' | 'frio' | null>(null);
  const [portasErradas, setPortasErradas] = useState<Set<string>>(new Set());
  const portasErradasRef = useRef(new Set<string>());
  const etapasPontuadasRef = useRef(new Set<number>());
  const [etapasPontuadas, setEtapasPontuadas] = useState(new Set<number>());
  const [concluida, setConcluida] = useState(false);
  const etapa = etapas[indice];
  const errosDaEtapa = [...portasErradas].filter((porta) => porta.startsWith(`${indice}\u0000`)).length;

  const chaveDaPorta = (opcao: string) => `${indice}\u0000${opcao}`;

  function escolher(opcao: string) {
    if (concluida) return;
    if (opcao !== etapa.correta) {
      const chave = chaveDaPorta(opcao);
      if (portasErradasRef.current.has(chave)) return;
      portasErradasRef.current.add(chave);
      setPortasErradas((atuais) => new Set(atuais).add(chave));
      setFeedback('frio');
      placar.registrar(false);
      return;
    }

    setFeedback('quente');
    if (!etapasPontuadasRef.current.has(indice)) {
      etapasPontuadasRef.current.add(indice);
      setEtapasPontuadas(new Set(etapasPontuadasRef.current));
      placar.registrar(true);
      const erros = [...portasErradasRef.current].filter((porta) => porta.startsWith(`${indice}\u0000`)).length;
      somarPontos(pontosDaEtapa(erros));
    }
    if (indice === etapas.length - 1) {
      setConcluida(true);
      return;
    }
    setIndice(indice + 1);
  }

  return (
    <Arena
      progresso={progresso}
      placar={placar}
      enunciado={<q className="ref-trecho">{trecho.trecho}</q>}
      detalhe={
        concluida
          ? `Referência encontrada! Total: ${pontos} pontos.`
          : `Caminho ${indice + 1} de ${etapas.length}: ${etapa.pergunta} · ${pontos} pontos`
      }
      explicacao={
        concluida ? (
          <p className="ref-resultado">📖 {trecho.referencia}</p>
        ) : null
      }
      secundaria={
        concluida
          ? undefined
          : {
              label: 'Rever caminho',
              onClick: () => {
                setIndice(0);
                setFeedback(null);
              },
            }
      }
      primaria={
        concluida ? { label: 'Próxima', onClick: aoSeguir } : undefined
      }
    >
      <div className="ref-corredor">
        {!concluida ? <p role="status">{etapasPontuadas.has(indice) ? 'Etapa já pontuada' : `Esta etapa vale ${pontosDaEtapa(errosDaEtapa)} pontos`}</p> : null}
        <details>
          <summary>Regras de pontuação</summary>
          <p>Cada etapa começa valendo 100 pontos. Cada porta errada desconta 25, até o mínimo de 25. Os pontos são somados ao acertar. Rever caminho mantém erros e bloqueios, sem pontuar novamente. Os contadores registram cada porta.</p>
        </details>
        {feedback ? (
          <span className={`temperatura temperatura--${feedback}`} role="status">
            {feedback === 'quente' ? '🔥 Quente' : '❄️ Frio'}
          </span>
        ) : null}

        {concluida ? (
          <div className="ref-chegada" aria-label="Caminho concluído">
            <span aria-hidden="true">🏁</span>
            <strong>Você encontrou!</strong>
          </div>
        ) : (
          <div className="ref-portas" data-etapa={etapa.tipo}>
            {etapa.opcoes.map((opcao) => {
              const errada = portasErradas.has(chaveDaPorta(opcao));
              return (
                <button
                  type="button"
                  className={errada ? 'ref-porta ref-porta--errada' : 'ref-porta'}
                  key={opcao}
                  onClick={() => escolher(opcao)}
                  disabled={errada}
                >
                  <span aria-hidden="true">{errada ? '❄' : '▥'}</span>
                  <b>{opcao}</b>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Arena>
  );
}
