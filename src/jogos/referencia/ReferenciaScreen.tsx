import { useState } from 'react';
import { Arena } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar, type Placar } from '../../shared/jogo/useBaralho';
import { TRECHOS_BIBLICOS } from '../../shared/trechos/trechos';
import type { TrechoBiblico } from '../../shared/trechos/types';
import { criarEtapas } from './motorReferencia';
import './referencia.css';

export function ReferenciaScreen() {
  const baralho = useBaralho(TRECHOS_BIBLICOS);
  const placar = usePlacar();

  if (!baralho.atual) return <p>Nenhum trecho disponível.</p>;

  return (
    <Rodada
      key={baralho.atual.id}
      trecho={baralho.atual}
      placar={placar}
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      aoSeguir={baralho.proxima}
    />
  );
}

function Rodada({
  trecho,
  placar,
  progresso,
  aoSeguir,
}: {
  trecho: TrechoBiblico;
  placar: Placar;
  progresso: { posicao: number; total: number };
  aoSeguir: () => void;
}) {
  const [etapas] = useState(() => criarEtapas(trecho, TRECHOS_BIBLICOS));
  const [indice, setIndice] = useState(0);
  const [feedback, setFeedback] = useState<'quente' | 'frio' | null>(null);
  const [teveErro, setTeveErro] = useState(false);
  const [concluida, setConcluida] = useState(false);
  const etapa = etapas[indice];

  function escolher(opcao: string) {
    if (concluida) return;
    if (opcao !== etapa.correta) {
      setFeedback('frio');
      if (!teveErro) {
        setTeveErro(true);
        placar.registrar(false);
      }
      return;
    }

    setFeedback('quente');
    if (indice === etapas.length - 1) {
      setConcluida(true);
      if (!teveErro) placar.registrar(true);
      return;
    }
    setIndice((atual) => atual + 1);
  }

  return (
    <Arena
      progresso={progresso}
      placar={placar}
      enunciado={<q className="ref-trecho">{trecho.trecho}</q>}
      detalhe={
        concluida
          ? 'Referência encontrada!'
          : `Caminho ${indice + 1} de ${etapas.length}: ${etapa.pergunta}`
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
              label: 'Recomeçar',
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
          <div className="ref-portas">
            {etapa.opcoes.map((opcao) => (
              <button
                type="button"
                className="ref-porta"
                key={opcao}
                onClick={() => escolher(opcao)}
              >
                <span aria-hidden="true">▥</span>
                <b>{opcao}</b>
              </button>
            ))}
          </div>
        )}
      </div>
    </Arena>
  );
}
