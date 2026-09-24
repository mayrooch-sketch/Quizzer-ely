/**
 * Quiz competitivo — dois times, dados, cronômetro.
 *
 * É a tela mais cheia do app, e a única em que o celular passa de mão em mão.
 * Por isso **o time da vez se vê do outro lado da mesa**: borda grossa e fundo
 * tingido, não uma sombrinha.
 *
 * **O placar é manual, e é decisão tomada com motivo** (ver `regrasDosDados`):
 * em quatro das doze regras a resposta é falada e julgada por uma pessoa, e em
 * duas o acerto dobra o placar. O app não tem como saber quem acertou. O que
 * ele faz é mostrar a regra que caiu, oferecer os botões dela e fazer a conta —
 * os quatro ± minúsculos do app antigo somem, e o "dobro ou nada" deixa de ser
 * conta de cabeça no meio do jogo.
 */

import { useEffect, useState } from 'react';
import { useBaralho } from '../../shared/jogo/useBaralho';
import { usePerguntas } from '../../app/store';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { LETRAS } from '../../shared/types/bank';
import { Dado } from '../../shared/jogo/Dado';
import { semMovimento } from '../../shared/jogo/movimento';
import { PISTAS_DO_NOVE, REGRAS, rolarDados } from './regrasDosDados';
import '../../shared/jogo/mesa.css';
import { useRelogioModerador } from '../../shared/jogo/useRelogioModerador';
import { Favoritar } from '../../shared/estudo/Favoritar';

type Time = 'A' | 'B';

/** Quanto tempo os dados tremem antes de parar. */
const DURACAO_ROLAGEM = 700;

export function CompetitivoScreen() {
  const perguntas = usePerguntas();
  const baralho = useBaralho(perguntas);
  const personagens = useBaralho(useItensDoTipo('whoami'));
  const [pistas, setPistas] = useState(1);

  const [pontos, setPontos] = useState<Record<Time, number>>({ A: 0, B: 0 });
  const [vez, setVez] = useState<Time>('A');
  const [dados, setDados] = useState<{ a: number; b: number; soma: number } | null>(null);
  const { segundos, setSegundos, rodando, setRodando } = useRelogioModerador();
  const [ultimoResultado, setUltimoResultado] = useState<{ pontos: Record<Time, number>; vez: Time; restaurar: () => void } | null>(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [dadosBonus, setDadosBonus] = useState<ReturnType<typeof rolarDados> | null>(null);

  /*
   * A rolagem em curso. O resultado já está sorteado aqui dentro — o que falta
   * é o tempo do tremor. Guardá-lo em estado é o que permite a tela mostrar os
   * dados rolando sem já revelar a regra que caiu.
   */
  const [rolagem, setRolagem] = useState<{ a: number; b: number; soma: number } | null>(null);
  const [ultimos, setUltimos] = useState({ a: 1, b: 1 });

  const regra = dados ? REGRAS[dados.soma] : null;
  const rolando = rolagem !== null;

  /*
   * O relógio para sozinho no zero por não agendar o próximo passo — em vez
   * de um `setRodando(false)` dentro do efeito, que seria um render a mais
   * só para desligar um estado que já dá para deduzir.
   */
  const contando = rodando && (segundos ?? 0) > 0;


  /* Os dados param, e só então a regra da rodada aparece. */
  useEffect(() => {
    if (!rolagem) return;
    const id = setTimeout(() => {
      setDados(rolagem);
      setUltimos({ a: rolagem.a, b: rolagem.b });
      setSegundos(REGRAS[rolagem.soma].segundos);
      setRodando(false);
      setMostrarResposta(false);
      setRolagem(null);
    }, DURACAO_ROLAGEM);
    return () => clearTimeout(id);
  }, [rolagem, setSegundos, setRodando]);

  if (perguntas.length === 0) {
    return <p className="aviso">Nenhuma pergunta disponível ainda.</p>;
  }

  const pergunta = baralho.atual;
  const adversario: Time = vez === 'A' ? 'B' : 'A';

  function rolar() {
    setUltimoResultado(null);
    setPistas(1);
    const d = rolarDados();
    setDadosBonus(null);

    // Sem animação, o resultado entra na hora.
    if (semMovimento()) {
      setDados(d);
      setUltimos({ a: d.a, b: d.b });
      setSegundos(REGRAS[d.soma].segundos);
      setRodando(false);
      setMostrarResposta(false);
      return;
    }

    setRolagem(d);
  }

  /** Aplica o veredito do mediador segundo a regra que caiu. */
  function julgar(acertou: boolean, pontosFixos?: number) {
    setUltimoResultado({ pontos: { ...pontos }, vez, restaurar: () => {
      setDados(dados); setDadosBonus(dadosBonus); setSegundos(segundos); setRodando(false);
      setMostrarResposta(mostrarResposta); setPistas(pistas); baralho.voltar();
      if (dados?.soma === 9) personagens.voltar();
    } });
    if (!regra) return;
    setPontos((atual) => {
      const meu =
        pontosFixos !== undefined
          ? atual[vez] + (acertou ? pontosFixos : 0)
          : regra.lancamento.aplicar(atual[vez], acertou);
      const doOutro =
        atual[adversario] + (regra.lancamento.aoAdversario?.(acertou) ?? 0);
      return { ...atual, [vez]: Math.max(0, meu), [adversario]: doOutro };
    });
    proximaRodada();
  }

  function proximaRodada() {
    setVez(adversario);
    setDados(null);
    setSegundos(null);
    setRodando(false);
    setMostrarResposta(false);
    baralho.proxima();
    if (dados?.soma === 9) personagens.proxima();
  }

  /* Dado 8: a pergunta é aberta, então as alternativas ficam escondidas. */
  const esconderAlternativas = dados?.soma === 8 && !mostrarResposta;

  return (
    <div className="comp">
      {ultimoResultado && !dados && !rolando ? (
        <button type="button" className="btn btn--ghost" onClick={() => {
          setPontos(ultimoResultado.pontos);
          setVez(ultimoResultado.vez);
          ultimoResultado.restaurar();
          setUltimoResultado(null);
        }}>Desfazer último resultado (pontos e turno)</button>
      ) : null}
      <div className="comp__times">
        {(['A', 'B'] as Time[]).map((t) => (
          <button
            key={t}
            type="button"
            className={t === vez ? 'comp__time comp__time--vez' : 'comp__time'}
            onClick={() => setVez(t)}
          >
            <span className="comp__rotulo">
              Time {t}
              {t === vez ? ' · joga agora' : ''}
            </span>
            <b>{pontos[t]}</b>
          </button>
        ))}
      </div>

      {!dados ? (
        <div className="comp__vazio">
          <p>Vez do time {vez}.</p>
          <div className="dados">
            <Dado valor={ultimos.a} rolando={rolando} grande />
            <Dado valor={ultimos.b} rolando={rolando} grande />
          </div>
          <button type="button" className="btn" onClick={rolar} disabled={rolando}>
            {rolando ? 'Rolando…' : 'Rolar os dados'}
          </button>
        </div>
      ) : (
        <>
          <div className="comp__relogio">
            <span className={segundos !== null && segundos <= 10 ? 'cr-contagem cr-contagem--fim' : 'cr-contagem'}>
              {segundos}s
            </span>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={segundos === 0}
              onClick={() => setRodando((r) => !r)}
            >
              {contando ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setSegundos(regra!.segundos);
                setRodando(false);
              }}
            >
              Reiniciar
            </button>
          </div>

          <div className="comp__meio">
          <Favoritar jogo="quiz-competitivo" item={dados.soma === 9 ? personagens.atual : pergunta} />
          <div className="comp__regra">
            <div className="comp__dados">
              <Dado valor={dados.a} />
              <Dado valor={dados.b} />
            </div>
            <div>
              <p className="comp__regra-titulo">
                {dados.soma} — {regra!.titulo}
              </p>
              <p className="comp__regra-texto">{regra!.instrucao}</p>
              <p className="comp__regra-pontos">{regra!.pontuacao}</p>
            </div>
          </div>

          {dados.soma === 12 ? (
            <div className="comp__regra">
              {dadosBonus ? <p role="status">Segunda rolagem: {dadosBonus.a} + {dadosBonus.b}. O acerto vale {dadosBonus.soma} pontos.</p> : (
                <button type="button" className="btn" onClick={() => setDadosBonus(rolarDados())}>
                  Rolar os dados dos pontos
                </button>
              )}
            </div>
          ) : null}

          {dados.soma === 9 ? (
            <div className="comp__pergunta">
              {personagens.atual ? <>
                {personagens.atual.payload.hints.slice(0, pistas).map((pista, i) => <p key={i}>{i + 1}ª pista: {pista}</p>)}
                <button type="button" className="btn btn--ghost" disabled={pistas >= personagens.atual.payload.hints.length} onClick={() => setPistas((n) => n + 1)}>Revelar próxima pista</button>
                <button type="button" className="btn btn--ghost" onClick={() => setMostrarResposta(true)}>Mostrar resposta ao moderador</button>
                {mostrarResposta ? <p>{personagens.atual.payload.answer} · {personagens.atual.reference}</p> : null}
              </> : <p>Sem personagens disponíveis. Passe a vez sem pontuar.</p>}
            </div>
          ) : pergunta ? (
            <div className="comp__pergunta">
              <p className="comp__enunciado">{pergunta.pergunta}</p>
              {esconderAlternativas ? (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setMostrarResposta(true)}
                >
                  Revelar alternativas
                </button>
              ) : (
                <ul className="comp__alts">
                  {LETRAS.map((l) => (
                    <li
                      key={l}
                      className={
                        mostrarResposta && l === pergunta.correta
                          ? 'comp__alt comp__alt--certa'
                          : 'comp__alt'
                      }
                    >
                      {pergunta.alternativas[l]}
                    </li>
                  ))}
                </ul>
              )}
              {!mostrarResposta ? (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setMostrarResposta(true)}
                >
                  Mostrar a resposta
                </button>
              ) : (
                <p className="comp__ref">📖 {pergunta.referencia}</p>
              )}
            </div>
          ) : null}

          </div>

          {/*
            Os botões da regra que caiu. É aqui que o app faz a aritmética e o
            mediador dá o veredito — a divisão honesta entre os dois.
          */}
          <div className="comp__veredito">
            {dados.soma === 9 ? (
              <>
                {PISTAS_DO_NOVE.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="btn"
                    onClick={() => julgar(true, p.pontos)}
                    disabled={!personagens.atual || p.pontos !== Math.max(1, 4 - pistas)}
                  >
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => julgar(false)}
                >
                  Errou · +3 ao time {adversario}
                </button>
              </>
            ) : dados.soma === 12 ? (
              <>
                <button
                  type="button"
                  className="btn"
                  disabled={!dadosBonus}
                  onClick={() => dadosBonus && julgar(true, dadosBonus.soma)}
                >
                  {dadosBonus ? `Acertou +${dadosBonus.soma}` : 'Role os pontos'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => julgar(false)}
                >
                  Errou
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn" onClick={() => julgar(true)}>
                  {regra!.botoes[0]}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => julgar(false)}
                >
                  {regra!.botoes[1]}
                </button>
              </>
            )}
          </div>

          <button type="button" className="comp__passar" onClick={proximaRodada}>
            Passar a vez sem pontuar
          </button>
        </>
      )}
    </div>
  );
}
