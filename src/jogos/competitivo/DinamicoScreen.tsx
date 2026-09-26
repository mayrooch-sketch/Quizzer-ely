/**
 * Dinâmico competitivo — dois times, e os dados sorteiam o tipo de desafio.
 *
 * É o irmão do quiz competitivo, e desenha a **mesma mesa**: placar dos times
 * parado em cima, o que se lê rolando no meio, veredito preso embaixo (ver
 * `mesa.css`). O que muda é o que cai no meio — aqui a soma dos dados escolhe
 * entre onze modos, dos seis do conhecimento à forca, ao anagrama e à pergunta
 * aberta.
 *
 * **O placar é do mediador, e a conta é do app.** Em quase todos os modos a
 * resposta é falada: o app não tem como saber quem acertou. O que ele faz é
 * mostrar a regra que caiu, oferecer os botões dela e fazer a aritmética — os
 * quatro ± minúsculos do app antigo somem, e o "dobro ou nada" deixa de ser
 * conta de cabeça no meio do jogo.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKnows, usePerguntas } from '../../app/store';
import { usePocoDePalavras } from '../../shared/palavras/poco';
import { Dado } from '../../shared/jogo/Dado';
import { semMovimento } from '../../shared/jogo/movimento';
import { rolarDados } from '../quiz/regrasDosDados';
import { MODOS, PISTAS } from './modosDoDinamico';
import {
  ItemDoModo,
  MAX_ERROS_FORCA,
  type ItemDaRodada,
  type MesaDoMediador,
} from './ItemDoModo';
import '../../shared/jogo/mesa.css';
import { useRelogioModerador } from '../../shared/jogo/useRelogioModerador';
import './dinamico.css';

type Time = 'A' | 'B';

const SEGUNDOS = 60;

/** Quanto tempo os dados tremem antes de parar. */
const DURACAO_ROLAGEM = 700;

interface Rolagem {
  a: number;
  b: number;
  soma: number;
  item: ItemDaRodada;
}

function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function DinamicoScreen() {
  const knows = useKnows();
  const perguntas = usePerguntas();
  const poco = usePocoDePalavras(12);

  /* Um balde por tipo, feito uma vez: onze modos pescando do mesmo banco. */
  const porTipo = useMemo(() => {
    const mapa = new Map<string, typeof knows>();
    for (const item of knows) {
      const lista = mapa.get(item.type) ?? [];
      lista.push(item);
      mapa.set(item.type, lista);
    }
    return mapa;
  }, [knows]);

  const [pontos, setPontos] = useState<Record<Time, number>>({ A: 0, B: 0 });
  const [vez, setVez] = useState<Time>('A');
  const [dados, setDados] = useState<{ a: number; b: number; soma: number } | null>(null);
  const [item, setItem] = useState<ItemDaRodada>({ fonte: 'nenhuma' });
  const [aberto, setAberto] = useState(false);
  /* O que o mediador já fez nesta rodada. Zera a cada rolagem. */
  const [pistas, setPistas] = useState(1);
  const [letras, setLetras] = useState<string[]>([]);
  const { segundos, setSegundos, rodando, setRodando } = useRelogioModerador();
  const [ultimoResultado, setUltimoResultado] = useState<{ pontos: Record<Time, number>; vez: Time; restaurar: () => void } | null>(null);

  /*
   * A rolagem em curso. Os dados e o item já estão sorteados aqui dentro — o
   * que falta é o tempo do tremor. É o que permite mostrar os dados rolando
   * sem já revelar o modo que caiu.
   */
  const [rolagem, setRolagem] = useState<Rolagem | null>(null);
  const [ultimos, setUltimos] = useState({ a: 1, b: 1 });

  /*
   * Filas embaralhadas por tipo, para nada repetir antes de tudo ter saído.
   * Ficam numa ref porque não desenham nada — e porque precisam sobreviver
   * entre rodadas sem provocar render.
   */
  const filas = useRef(new Map<string, unknown[]>());

  function tirarDaFila<T>(chave: string, pool: readonly T[]): T | null {
    if (pool.length === 0) return null;
    let fila = filas.current.get(chave) as T[] | undefined;
    if (!fila || fila.length === 0) {
      fila = embaralhar(pool);
      filas.current.set(chave, fila as unknown[]);
    }
    return fila.shift() ?? null;
  }

  const modo = dados ? MODOS[dados.soma] : null;
  const rolando = rolagem !== null;

  /* O relógio para sozinho no zero por não agendar o próximo passo. */
  const contando = rodando && (segundos ?? 0) > 0;


  /* Os dados param, e só então o modo da rodada aparece. */
  useEffect(() => {
    if (!rolagem) return;
    const id = setTimeout(() => {
      setDados({ a: rolagem.a, b: rolagem.b, soma: rolagem.soma });
      setUltimos({ a: rolagem.a, b: rolagem.b });
      setItem(rolagem.item);
      setAberto(false);
      setPistas(1);
      setLetras([]);
      setSegundos(SEGUNDOS);
      setRodando(false);
      setRolagem(null);
    }, DURACAO_ROLAGEM);
    return () => clearTimeout(id);
  }, [rolagem, setSegundos, setRodando]);

  const adversario: Time = vez === 'A' ? 'B' : 'A';

  if (knows.length === 0 && perguntas.length === 0) {
    return <p className="aviso">O banco ainda não chegou.</p>;
  }

  function sortearItem(soma: number): ItemDaRodada {
    const m = MODOS[soma];
    switch (m.fonte) {
      case 'knows': {
        const escolhido = tirarDaFila(m.tipo!, porTipo.get(m.tipo!) ?? []);
        return escolhido ? { fonte: 'knows', item: escolhido } : { fonte: 'nenhuma' };
      }
      case 'palavra': {
        const escolhida = tirarDaFila('palavra', poco);
        return escolhida ? { fonte: 'palavra', palavra: escolhida } : { fonte: 'nenhuma' };
      }
      case 'pergunta': {
        const escolhida = tirarDaFila('pergunta', perguntas);
        return escolhida ? { fonte: 'pergunta', pergunta: escolhida } : { fonte: 'nenhuma' };
      }
      default:
        return { fonte: 'nenhuma' };
    }
  }

  function rolar() {
    setUltimoResultado(null);
    const d = rolarDados();
    const sorteado = sortearItem(d.soma);

    // Sem animação, o resultado entra na hora.
    if (semMovimento()) {
      setDados(d);
      setUltimos({ a: d.a, b: d.b });
      setItem(sorteado);
      setAberto(false);
      setPistas(1);
      setLetras([]);
      setSegundos(SEGUNDOS);
      setRodando(false);
      return;
    }

    setRolagem({ ...d, item: sorteado });
  }

  function proximaRodada() {
    setVez(adversario);
    setDados(null);
    setItem({ fonte: 'nenhuma' });
    setAberto(false);
    setPistas(1);
    setLetras([]);
    setSegundos(null);
    setRodando(false);
  }

  const mesa: MesaDoMediador = {
    pistas,
    revelarPista: () => setPistas((p) => p + 1),
    letras,
    marcarLetra: (l) => setLetras((atual) => (atual.includes(l) ? atual : [...atual, l])),
    aberto,
    abrir: () => setAberto(true),
  };

  /*
   * Quanto vale o acerto do "quem sou eu" — o app sabe porque foi ele quem
   * abriu as pistas. Da terceira em diante vale +1.
   */
  const pontosDaPista = PISTAS[Math.min(pistas, PISTAS.length) - 1].pontos;

  /* Na forca, o app conta os erros das letras que o mediador marcou. */
  const errosDaForca =
    item.fonte === 'palavra'
      ? letras.filter((l) => !item.palavra.palavra.includes(l)).length
      : 0;

  /** Aplica o veredito do mediador segundo o modo que caiu. */
  function julgar(acertou: boolean, pontosFixos?: number) {
    setUltimoResultado({ pontos: { ...pontos }, vez, restaurar: () => {
      setDados(dados); setItem(item); setAberto(aberto); setPistas(pistas); setLetras(letras);
      setSegundos(segundos); setRodando(false);
    } });
    if (!modo) return;
    setPontos((atual) => {
      const meu =
        pontosFixos !== undefined
          ? atual[vez] + (acertou ? pontosFixos : 0)
          : modo.lancamento.aplicar(atual[vez], acertou);
      const doOutro = atual[adversario] + (modo.lancamento.aoAdversario?.(acertou) ?? 0);
      return { ...atual, [vez]: Math.max(0, meu), [adversario]: doOutro };
    });
    proximaRodada();
  }

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

      {!dados || !modo ? (
        <div className="comp__vazio">
          <p>Vez do time {vez}.</p>
          <div className="dados">
            <Dado valor={ultimos.a} rolando={rolando} grande />
            <Dado valor={ultimos.b} rolando={rolando} grande />
          </div>
          <button type="button" className="btn" onClick={rolar} disabled={rolando}>
            {rolando ? 'Rolando…' : 'Rolar os dados'}
          </button>
          {!rolando ? <details><summary>Outras formas de jogar</summary><Link to="/amigos">Partida entre amigos</Link></details> : null}
        </div>
      ) : (
        <>
          <div className="comp__relogio">
            <span
              className={
                segundos !== null && segundos <= 10
                  ? 'cr-contagem cr-contagem--fim'
                  : 'cr-contagem'
              }
            >
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
                setSegundos(SEGUNDOS);
                setRodando(false);
              }}
            >
              Reiniciar
            </button>
          </div>

          <div className="comp__meio">
            <div className="comp__regra">
              <div className="comp__dados">
                <Dado valor={dados.a} />
                <Dado valor={dados.b} />
              </div>
              <div>
                <p className="comp__regra-titulo">
                  {modo.icone} {modo.nome}
                </p>
                <p className="comp__regra-texto">{modo.instrucao}</p>
                <p className="comp__regra-pontos">{modo.pontuacao}</p>
              </div>
            </div>

            <ItemDoModo modo={modo} item={item} mesa={mesa} />
          </div>

          {/*
            Os botões do modo que caiu. É aqui que o app faz a aritmética e o
            mediador dá o veredito — a divisão honesta entre os dois.
          */}
          {modo.fonte === 'nenhuma' ? (
            <div className="comp__veredito comp__veredito--um">
              <button type="button" className="btn" onClick={() => julgar(false)}>
                ⏭️ Passar a vez
              </button>
            </div>
          ) : modo.soma === 6 ? (
            <div className="comp__veredito">
              <button
                type="button"
                className="btn"
                onClick={() => julgar(true, pontosDaPista)}
              >
                Acertou +{pontosDaPista}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => julgar(false)}
              >
                Errou
              </button>
            </div>
          ) : modo.jogoDePalavra === 'forca' ? (
            <div className="comp__veredito">
              <button type="button" className="btn" onClick={() => julgar(true)}>
                {modo.botoes[0]}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => julgar(false)}
              >
                {errosDaForca >= MAX_ERROS_FORCA ? 'Errou · seis erros' : 'Errou'}
              </button>
            </div>
          ) : (
            <div className="comp__veredito">
              <button type="button" className="btn" onClick={() => julgar(true)}>
                {modo.botoes[0]}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => julgar(false)}
              >
                {modo.botoes[1]}
              </button>
            </div>
          )}

          <button type="button" className="comp__passar" onClick={proximaRodada}>
            Passar a vez sem pontuar
          </button>
        </>
      )}
    </div>
  );
}
