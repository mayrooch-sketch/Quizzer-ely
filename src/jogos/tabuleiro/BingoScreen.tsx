/**
 * Bingo — dezesseis respostas na cartela, as perguntas cantadas uma a uma.
 *
 * Quatro das vinte perguntas cantadas **não estão na cartela**. São elas que
 * fazem do jogo um jogo: sem distratores, bastaria tocar em qualquer coisa a
 * cada pergunta. Com eles, tocar sem ler custa um dos três erros.
 *
 * **Um botão só durante a partida.** No app antigo havia "⏭️ Passar" e
 * "🔁 Nova" lado a lado, do mesmo tamanho: um toque errado no segundo apagava
 * a partida em curso. "Nova cartela" agora só existe no fim, que é quando ela
 * é a coisa certa a fazer.
 *
 * **Cada pergunta cantada vale uma chance só.** Errando, a rodada passa e a
 * casa que era a resposta fica **queimada em vermelho** — dá para ver o que
 * escapou, e ela não conta mais para fechar linha. Antes o erro só piscava e
 * deixava tentar de novo na mesma pergunta, o que fazia o distrator não custar
 * nada: bastava ir tocando até acertar.
 */

import { useEffect, useState } from 'react';
import { usePocoDePalavras, type PalavraDoBanco } from '../../shared/palavras/poco';
import { marcarUsadas } from '../../shared/palavras/memoria';
import './tabuleiro.css';

const CASAS = 16;
const LADO = 4;
const DISTRATORES = 4;
const MAX_ERROS = 3;
const PISCA_ERRO = 450;
const PAUSA_ACERTO = 600;

/** As dez linhas que fecham cartela: quatro deitadas, quatro em pé, duas em X. */
const LINHAS: number[][] = [
  ...Array.from({ length: LADO }, (_, y) => Array.from({ length: LADO }, (_, x) => y * LADO + x)),
  ...Array.from({ length: LADO }, (_, x) => Array.from({ length: LADO }, (_, y) => y * LADO + x)),
  Array.from({ length: LADO }, (_, i) => i * LADO + i),
  Array.from({ length: LADO }, (_, i) => i * LADO + (LADO - 1 - i)),
];

interface Chamada {
  /** Índice da casa na cartela, ou -1 quando a pergunta não está lá. */
  casa: number;
  pergunta: string;
}

interface Partida {
  cartela: PalavraDoBanco[];
  chamadas: Chamada[];
}

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Espalha os distratores pela rodada.
 *
 * O app antigo tinha sessenta linhas de regras para isto — "nunca mais de três
 * distratores seguidos", "sem alternância perfeita", "não concentrar no início
 * ou no fim". Com quatro distratores em vinte chamadas, duas regras dão uma
 * garantia mais forte e cabem em cinco linhas: **nenhum distrator encostado em
 * outro, e nem no começo nem no fim da rodada**. Sorteia até sair assim.
 */
function espalhar(reais: Chamada[], distratores: Chamada[]): Chamada[] {
  if (distratores.length === 0) return embaralhar(reais);

  for (let t = 0; t < 200; t++) {
    const ordem = embaralhar([...reais, ...distratores]);
    const ehDistrator = ordem.map((c) => c.casa < 0);
    if (ehDistrator[0] || ehDistrator[ordem.length - 1]) continue;
    if (ehDistrator.some((d, i) => d && ehDistrator[i + 1])) continue;
    return ordem;
  }

  return embaralhar([...reais, ...distratores]);
}

function montarPartida(poco: readonly PalavraDoBanco[]): Partida {
  const escolhidas = embaralhar(poco).slice(0, CASAS + DISTRATORES);
  const cartela = escolhidas.slice(0, CASAS);
  marcarUsadas(cartela.map((p) => p.palavra));

  const reais: Chamada[] = cartela.map((p, i) => ({ casa: i, pergunta: p.dica }));
  const falsas: Chamada[] = escolhidas
    .slice(CASAS)
    .map((p) => ({ casa: -1, pergunta: p.dica }));

  return { cartela, chamadas: espalhar(reais, falsas) };
}

export function BingoScreen() {
  const poco = usePocoDePalavras(12);
  const [rodada, setRodada] = useState(0);

  if (poco.length < CASAS + DISTRATORES) {
    return <p className="aviso">O banco não tem perguntas suficientes para o bingo.</p>;
  }

  return <Cartela key={rodada} poco={poco} onNova={() => setRodada((r) => r + 1)} />;
}

function Cartela({ poco, onNova }: { poco: PalavraDoBanco[]; onNova: () => void }) {
  const [partida] = useState<Partida>(() => montarPartida(poco));
  const [vez, setVez] = useState(0);
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const [errada, setErrada] = useState<number | null>(null);
  const [erros, setErros] = useState(0);
  const [acertou, setAcertou] = useState<number | null>(null);
  /** Casas que eram a resposta de uma pergunta errada. Não valem mais. */
  const [perdidas, setPerdidas] = useState<number[]>([]);

  const chamada = partida.chamadas[vez] ?? null;
  const linhaFeita = LINHAS.find((l) => l.every((c) => marcadas.includes(c))) ?? null;
  const perdeu = erros >= MAX_ERROS;
  const semChamadas = chamada === null;
  const acabou = linhaFeita !== null || perdeu || semChamadas;

  /*
   * O vermelho do toque errado dura o tempo de ser visto, e então a rodada
   * passa. É a mesma pausa do acerto, para que errar e acertar tenham o mesmo
   * ritmo — o que muda é a cor.
   */
  useEffect(() => {
    if (errada === null) return;
    const id = setTimeout(() => {
      setErrada(null);
      setVez((v) => v + 1);
    }, PISCA_ERRO);
    return () => clearTimeout(id);
  }, [errada]);

  /* Depois de acertar, a próxima pergunta entra sozinha. */
  useEffect(() => {
    if (acertou === null) return;
    const id = setTimeout(() => {
      setAcertou(null);
      setVez((v) => v + 1);
    }, PAUSA_ACERTO);
    return () => clearTimeout(id);
  }, [acertou]);

  function tocar(i: number) {
    if (acabou || acertou !== null || errada !== null) return;
    if (marcadas.includes(i) || perdidas.includes(i) || !chamada) return;

    if (chamada.casa === i) {
      setMarcadas((m) => [...m, i]);
      setAcertou(i);
      return;
    }

    setErrada(i);
    setErros((e) => e + 1);

    // A resposta que escapou fica queimada. Num distrator não há o que queimar.
    if (chamada.casa >= 0) {
      setPerdidas((p) => (p.includes(chamada.casa) ? p : [...p, chamada.casa]));
    }
  }

  function passar() {
    if (acabou || acertou !== null || errada !== null) return;

    // Dizer "não está na cartela" quando estava também custa a resposta.
    if (chamada && chamada.casa >= 0) {
      setErros((e) => e + 1);
      setErrada(chamada.casa);
      setPerdidas((p) => (p.includes(chamada.casa) ? p : [...p, chamada.casa]));
      return;
    }

    setVez((v) => v + 1);
  }

  const ganhou = linhaFeita !== null;

  return (
    <div className="bingo">
      {acabou ? (
        <p className={ganhou ? 'bingo__chamada bingo__chamada--fim' : 'bingo__chamada'}>
          <b>
            {ganhou ? '🎉 BINGO!' : '😅 Fim de jogo'}
          </b>{' '}
          {ganhou
            ? `Fechou com ${marcadas.length} de ${CASAS} · ${erros} ${erros === 1 ? 'erro' : 'erros'}.`
            : perdeu
              ? `Três erros. Você tinha ${marcadas.length} de ${CASAS}.`
              : `Acabaram as perguntas com ${marcadas.length} de ${CASAS}.`}
        </p>
      ) : (
        <p className="bingo__chamada">{chamada!.pergunta}</p>
      )}

      <div className="bingo__cartela">
        {partida.cartela.map((p, i) => (
          <button
            key={p.palavra}
            type="button"
            className={
              linhaFeita?.includes(i)
                ? 'bingo__casa bingo__casa--linha'
                : errada === i
                  ? 'bingo__casa bingo__casa--errada'
                  : perdidas.includes(i)
                    ? 'bingo__casa bingo__casa--perdida'
                    : marcadas.includes(i)
                      ? 'bingo__casa bingo__casa--marcada'
                      : 'bingo__casa'
            }
            onClick={() => tocar(i)}
            disabled={acabou || marcadas.includes(i) || perdidas.includes(i)}
          >
            {p.original}
          </button>
        ))}
      </div>

      {acabou ? null : (
        <p className="bingo__placar">
          <span>
            Pergunta {vez + 1} de {partida.chamadas.length}
          </span>
          <span className={erros > 0 ? 'bingo__erros bingo__erros--alerta' : 'bingo__erros'}>
            ❌ {erros} de {MAX_ERROS}
          </span>
        </p>
      )}

      <div className="mem__acoes">
        {acabou ? (
          <button type="button" className="btn" onClick={onNova}>
            Nova cartela
          </button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={passar}>
            ⏭ Não está na cartela
          </button>
        )}
      </div>
    </div>
  );
}
