/**
 * Memória — achar o par entre a pergunta e a resposta.
 *
 * **Seis pares, não oito.** O app antigo abria dezesseis cartas e enfiava
 * numa delas uma pergunta de até 80 caracteres. Numa tela de 375px, dezesseis
 * cartas dão uma carta de 85px de lado: a pergunta caberia em corpo 8, que
 * ninguém lê. Com doze cartas a carta fica com ~113px e a pergunta cabe
 * legível — e o jogo continua sendo o mesmo jogo.
 *
 * **As cartas de pergunta e de resposta têm cores diferentes.** Era assim no
 * original, e é uma boa ideia: uma pergunta nunca casa com outra pergunta, e
 * mostrar isso na cor evita o par que já se sabe impossível.
 *
 * O placar é o número de tentativas — quanto menos, melhor —, e o recorde fica
 * no navegador.
 */

import { useEffect, useState } from 'react';
import { usePocoDePalavras, type PalavraDoBanco } from '../../shared/palavras/poco';
import { marcarUsadas } from '../../shared/palavras/memoria';
import './tabuleiro.css';
import { useSessao } from '../../shared/estudo/contexto';

const PARES = 6;
const PAUSA_DESVIRAR = 3000;
const CHAVE_RECORDE = 'quizzer.memoria.recorde';

interface Carta {
  conteudo: PalavraDoBanco;
  id: string;
  par: number;
  tipo: 'pergunta' | 'resposta';
  texto: string;
}

function lerRecorde(): number {
  try {
    const n = Number(localStorage.getItem(CHAVE_RECORDE));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function gravarRecorde(n: number): void {
  try {
    localStorage.setItem(CHAVE_RECORDE, String(n));
  } catch {
    // Armazenamento bloqueado: o recorde vale só nesta sessão.
  }
}

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function montarCartas(poco: readonly PalavraDoBanco[]): Carta[] {
  const escolhidas = embaralhar(poco).slice(0, PARES);
  marcarUsadas(escolhidas.map((p) => p.palavra));

  const cartas = escolhidas.flatMap((p, i) => [
    { id: `p${i}`, par: i, tipo: 'pergunta' as const, texto: p.dica, conteudo: p },
    { id: `r${i}`, par: i, tipo: 'resposta' as const, texto: p.original, conteudo: p },
  ]);

  return embaralhar(cartas);
}

export function MemoriaScreen() {
  const poco = usePocoDePalavras(12);
  const [rodada, setRodada] = useState(0);

  if (poco.length < PARES) {
    return <p className="aviso">O banco não tem cartas suficientes para a memória.</p>;
  }

  return <Mesa key={rodada} poco={poco} onNova={() => setRodada((r) => r + 1)} />;
}

function Mesa({
  poco,
  onNova,
}: {
  poco: PalavraDoBanco[];
  onNova: () => void;
}) {
  const [cartas] = useState<Carta[]>(() => montarCartas(poco));
  const sessao = useSessao();
  const [viradas, setViradas] = useState<number[]>([]);
  const [achados, setAchados] = useState<number[]>([]);
  const [tentativas, setTentativas] = useState(0);
  const [recorde, setRecorde] = useState(lerRecorde);

  const completo = achados.length === PARES;

  /*
   * Duas cartas na mesa que não casaram viram sozinhas depois de um instante.
   * O instante existe para dar tempo de guardar onde elas estavam — é o jogo
   * inteiro. Menos que isso e a carta some antes de ser vista.
   *
   * Só o par que **não** casou passa por aqui: o que casa é resolvido no
   * próprio toque, sem esperar um render a mais para descobrir.
   */
  useEffect(() => {
    if (viradas.length < 2) return;
    const id = setTimeout(() => setViradas([]), PAUSA_DESVIRAR);
    return () => clearTimeout(id);
  }, [viradas]);

  function virar(i: number) {
    if (viradas.length >= 2) return;
    if (viradas.includes(i) || achados.includes(cartas[i].par)) return;
    sessao?.atual(cartas[i].conteudo);

    if (viradas.length === 0) {
      setViradas([i]);
      return;
    }

    const primeira = viradas[0];
    const tentativa = tentativas + 1;
    setTentativas(tentativa);
    sessao?.registrar(cartas[primeira].par === cartas[i].par, cartas[primeira].conteudo);

    if (cartas[primeira].par !== cartas[i].par) {
      setViradas([primeira, i]);
      return;
    }

    // Casou: as duas ficam abertas por `achados`, e a mesa fica livre já.
    const novos = [...achados, cartas[i].par];
    setAchados(novos);
    setViradas([]);

    if (novos.length === PARES && (recorde === 0 || tentativa < recorde)) {
      gravarRecorde(tentativa);
      setRecorde(tentativa);
    }
  }

  const perfeito = tentativas === PARES;

  return (
    <div className="mem">
      {completo ? (
        /*
         * O fim acontece **em cima do tabuleiro**, não numa tela à parte.
         *
         * Antes, casar o último par trocava a tela na hora: quem acabou de
         * virar a carta decisiva não chegava a ver o tabuleiro completo. O
         * resultado agora entra na mesma linha do placar, e as doze cartas
         * ficam onde estão, abertas.
         */
        <p className="mem__resultado">
          <span className="mem__emoji" aria-hidden="true">
            {perfeito ? '🏆' : tentativas <= PARES * 2 ? '😎' : '🙂'}
          </span>
          <b>
            {PARES} pares em {tentativas} tentativas
          </b>
          {/*
            Texto curto porque a linha não pode quebrar.
            "Sem errar nenhuma vez." passava de uma linha num celular de
            375px, e a segunda linha roubava 29px de altura do tabuleiro —
            as doze cartas encolhiam no exato instante em que a pessoa fecha
            o último par e olha para elas.
          */}
          <span className="mem__sub">
            {perfeito
              ? 'Sem errar!'
              : recorde === tentativas
                ? '🔥 Novo recorde!'
                : `Recorde: ${recorde}`}
          </span>
        </p>
      ) : (
        <p className="mem__placar">
          <span>
            {achados.length} de {PARES} pares
          </span>
          <span className="mem__tentativas">{tentativas} tentativas</span>
        </p>
      )}

      <div className="mem__mesa">
        {cartas.map((c, i) => {
          const aberta = viradas.includes(i) || achados.includes(c.par);
          const casada = achados.includes(c.par);
          return (
            <button
              key={c.id}
              type="button"
              className={
                casada ? 'mem__carta mem__carta--casada' : aberta ? 'mem__carta mem__carta--aberta' : 'mem__carta'
              }
              onClick={() => virar(i)}
              aria-label={aberta ? c.texto : 'Carta virada'}
              aria-pressed={aberta}
            >
              <span className="mem__gira">
                <span className="mem__face mem__verso" aria-hidden="true">🃏</span>
                <span
                  aria-hidden={!aberta}
                  className={
                    c.tipo === 'pergunta'
                      ? 'mem__face mem__frente mem__frente--pergunta'
                      : 'mem__face mem__frente mem__frente--resposta'
                  }
                >
                  {aberta ? c.texto : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mem__leitura" aria-live="polite" tabIndex={0}>
        {viradas.length > 0
          ? viradas.map((i) => cartas[i].texto).join(' • ')
          : completo ? 'Todos os pares encontrados.' : 'Vire duas cartas para ligar uma pergunta à resposta.'}
      </p>

      <div className="mem__acoes">
        <button
          type="button"
          className={completo ? 'btn' : 'btn btn--ghost'}
          onClick={onNova}
        >
          {completo ? 'Jogar de novo' : 'Nova partida'}
        </button>
      </div>
    </div>
  );
}
