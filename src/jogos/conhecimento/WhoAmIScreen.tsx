/**
 * Quem sou eu — personagens humanos reais, sempre com três pistas.
 *
 * As pistas ainda fechadas **já ocupam o lugar delas**, apagadas. Sem isso,
 * cada pista nova empurraria as alternativas para baixo — e o dedo erraria o
 * alvo que estava mirando.
 *
 * O contador de pistas usadas é o placar natural deste modo: acertar na
 * primeira vale mais do que acertar na terceira, e sem o número isso não fica
 * registrado em lugar nenhum.
 */

import { useMemo, useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { embaralhar, useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';
import './conhecimento.css';
import { useSessao } from '../../shared/estudo/contexto';
import { reduzirOpcoes } from '../../shared/estudo/dificuldade';

export function WhoAmIScreen() {
  const sessao = useSessao();
  const nivel = sessao?.nivel ?? 'normal';
  const itens = useItensDoTipo('whoami');

  const baralho = useBaralho(itens);
  const opcoes = useMemo(() => reduzirOpcoes(embaralhar(baralho.atual?.payload.choices ?? []), baralho.atual?.payload.answer ?? '', nivel), [baralho.atual, nivel]);
  const placar = usePlacar();
  const [abertas, setAbertas] = useState(nivel === 'facil' ? 2 : 1);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [pistasGastas, setPistasGastas] = useState(0);

  if (!baralho.atual) return <SemItens />;

  const item = baralho.atual;
  const pistas = item.payload.hints;
  const respondido = escolha !== null;
  const acertou = escolha === item.payload.answer;
  const temMaisPistas = nivel !== 'dificil' && abertas < pistas.length;

  function responder(valor: string) {
    if (respondido) return;
    setEscolha(valor);
    placar.registrar(valor === item.payload.answer, item, abertas > (nivel === 'facil' ? 2 : 1));
    if (valor === item.payload.answer) setPistasGastas((n) => n + abertas);
  }

  function seguir() {
    setEscolha(null);
    setAbertas(nivel === 'facil' ? 2 : 1);
    baralho.proxima();
  }

  const acertosComPistas =
    placar.certas > 0 ? (pistasGastas / placar.certas).toFixed(1) : null;

  return (
    <Arena
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      placar={placar}
      enunciado="Quem sou eu?"
      detalhe={
        acertosComPistas
          ? `Média de ${acertosComPistas} pista${acertosComPistas === '1.0' ? '' : 's'} por acerto`
          : 'Quanto menos pistas, melhor'
      }
      explicacao={
        respondido ? (
          <Explicacao
            referencia={item.reference}
            comentario={
              acertou ? item.notes : `Era ${item.payload.answer}. ${item.notes}`
            }
          />
        ) : null
      }
      secundaria={
        temMaisPistas && !respondido
          ? { label: 'Mais uma pista', onClick: () => { sessao?.ajudar(); setAbertas((n) => n + 1); } }
          : { label: 'Pular', onClick: seguir, disabled: respondido }
      }
      primaria={{ label: 'Próxima', onClick: seguir, disabled: !respondido }}
    >
      <div className="pistas">
        {pistas.map((pista, i) => (
          <div
            key={pista}
            className={i < abertas ? 'pista pista--aberta' : 'pista'}
          >
            {i < abertas ? pista : `${i + 1}ª pista`}
          </div>
        ))}
      </div>

      <div className="opcoes-grade">
        {opcoes.map((op) => (
          <button
            key={op}
            type="button"
            className={
              !respondido
                ? 'opcao'
                : op === item.payload.answer
                  ? 'opcao opcao--certa'
                  : op === escolha
                    ? 'opcao opcao--errada'
                    : 'opcao'
            }
            onClick={() => responder(op)}
            disabled={respondido}
          >
            {op}
          </button>
        ))}
      </div>
    </Arena>
  );
}
