/**
 * Contra o relógio — 60 segundos, o mesmo banco do quiz.
 *
 * **Sem botão "Próxima".** Num jogo cronometrado, obrigar um segundo toque
 * cobra do jogador um tempo que é o próprio placar. Toca, vê a cor por um
 * instante, e a próxima entra sozinha.
 *
 * Esse instante tem 550ms: é o suficiente para o olho registrar a cor e curto
 * o bastante para não custar uma pergunta.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Arena } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { usePerguntas } from '../../app/store';
import { Alternativas } from './Alternativas';
import type { Letra } from '../../shared/types/bank';
import './quiz.css';
// O relógio da contagem é o mesmo dos jogos de mesa.
import '../../shared/jogo/mesa.css';

const SEGUNDOS = 60;
const PAUSA_FEEDBACK = 550;
const CHAVE_RECORDE = 'quizzer.contraRelogio.recorde';

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

type Fase = 'parado' | 'jogando' | 'fim';

export function ContraRelogioScreen() {
  const perguntas = usePerguntas();
  const baralho = useBaralho(perguntas);
  const proximaPergunta = baralho.proxima;
  const placar = usePlacar();

  const [fase, setFase] = useState<Fase>('parado');
  const [segundos, setSegundos] = useState(SEGUNDOS);
  const [escolha, setEscolha] = useState<Letra | null>(null);
  const [recorde, setRecorde] = useState(lerRecorde);
  const [novoRecorde, setNovoRecorde] = useState(false);
  const [tempoJogado, setTempoJogado] = useState(0);
  const inicioRef = useRef(0);
  const limiteRef = useRef(0);

  /*
   * O placar só é lido no fim, e é guardado numa ref para que o relógio não
   * seja recriado a cada acerto — se o efeito do intervalo dependesse do
   * placar, o segundo em curso se perderia a cada resposta.
   *
   * A ref é preenchida num efeito, não no corpo do render: escrever numa ref
   * durante o render é o tipo de coisa que funciona até o React renderizar
   * duas vezes.
   */
  const certasRef = useRef(0);
  useEffect(() => {
    certasRef.current = placar.certas;
  }, [placar.certas]);

  const encerrar = useCallback(() => {
    if (limiteRef.current === 0) return;
    setTempoJogado(Math.min(SEGUNDOS, Math.ceil((Date.now() - inicioRef.current) / 1000)));
    limiteRef.current = 0;
    setFase('fim');
    setSegundos(0);
    if (certasRef.current > lerRecorde()) {
      gravarRecorde(certasRef.current);
      setRecorde(certasRef.current);
      setNovoRecorde(true);
    }
  }, []);

  /*
   * Um `setInterval` só, criado ao começar e desmontado ao sair da tela.
   * Depende só de `fase`: se dependesse do placar, seria recriado a cada
   * acerto e o segundo em curso se perderia.
   */
  useEffect(() => {
    if (fase !== 'jogando') return;
    const id = setInterval(() => {
      const restantes = Math.max(0, Math.ceil((limiteRef.current - Date.now()) / 1000));
      setSegundos(restantes);
      if (restantes === 0) encerrar();
    }, 100);
    return () => clearInterval(id);
  }, [fase, encerrar]);

  /* Avanço automático depois do instante de feedback. */
  useEffect(() => {
    if (escolha === null || fase !== 'jogando') return;
    const id = setTimeout(() => {
      setEscolha(null);
      proximaPergunta();
    }, PAUSA_FEEDBACK);
    return () => clearTimeout(id);
  }, [escolha, fase, proximaPergunta]);

  if (perguntas.length === 0) {
    return <p className="aviso">Nenhuma pergunta disponível ainda.</p>;
  }

  function comecar() {
    placar.zerar();
    certasRef.current = 0;
    setNovoRecorde(false);
    if (fase === 'fim') baralho.proxima();
    inicioRef.current = Date.now();
    limiteRef.current = inicioRef.current + SEGUNDOS * 1000;
    setSegundos(SEGUNDOS);
    setEscolha(null);
    setFase('jogando');
  }

  if (fase === 'parado') {
    return (
      <div className="cr-abertura">
        <p className="cr-relogio">{SEGUNDOS}s</p>
        <p>Quantas você acerta antes do tempo acabar?</p>
        {recorde > 0 ? (
          <p className="cr-recorde">Seu recorde: {recorde} {recorde === 1 ? 'acerto' : 'acertos'}</p>
        ) : null}
        <button type="button" className="btn" onClick={comecar}>
          Começar
        </button>
      </div>
    );
  }

  if (fase === 'fim') {
    return (
      <div className="cr-abertura">
        <p className="cr-relogio">{placar.certas}</p>
        <p>{placar.certas === 1 ? 'acerto' : 'acertos'} em {tempoJogado} segundos</p>
        {novoRecorde ? (
          <p className="cr-recorde cr-recorde--novo">🔥 Novo recorde!</p>
        ) : (
          <p className="cr-recorde">Seu recorde: {recorde} {recorde === 1 ? 'acerto' : 'acertos'}</p>
        )}
        <button type="button" className="btn" onClick={comecar}>
          Jogar de novo
        </button>
      </div>
    );
  }

  const pergunta = baralho.atual;
  if (!pergunta) return <p className="aviso">Sem perguntas.</p>;

  return (
    <Arena
      enunciado={pergunta.pergunta}
      detalhe={
        <span className={segundos <= 10 ? 'cr-contagem cr-contagem--fim' : 'cr-contagem'}>
          {segundos}s restantes
        </span>
      }
      secundaria={{ label: 'Encerrar', onClick: encerrar }}
      primaria={{
        label: `${placar.certas} ${placar.certas === 1 ? 'acerto' : 'acertos'}`,
        onClick: () => {},
        disabled: true,
      }}
    >
      <Alternativas
        pergunta={pergunta}
        escolha={escolha}
        onEscolher={(letra) => {
          if (escolha !== null) return;
          if (Date.now() >= limiteRef.current) {
            encerrar();
            return;
          }
          setEscolha(letra);
          if (letra === pergunta.correta) certasRef.current += 1;
          placar.registrar(letra === pergunta.correta);
        }}
      />
    </Arena>
  );
}
