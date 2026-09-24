/**
 * O item da rodada, e as ferramentas de quem conduz.
 *
 * **A tela é do mediador**, não do time. Ele segura o celular, lê em voz alta e
 * julga — o time responde falando, do outro lado da mesa. Duas consequências,
 * e as duas mudam o desenho:
 *
 * 1. **Onde ler basta, a resposta já vem à mostra.** Verdadeiro ou falso,
 *    marque os corretos, complete a frase, associação, ordem e pergunta aberta
 *    não escondem nada: ninguém além do mediador está vendo, e um toque a mais
 *    por rodada só atrasa quem conduz.
 * 2. **Onde o jogo é descobrir aos poucos, o mediador precisa de controles.**
 *    Na forca ele marca as letras que o time pede, uma a uma, e o app conta os
 *    erros. No "quem sou eu" ele revela as pistas uma a uma, e o app sabe
 *    quantas foram — que é o que decide quanto vale o acerto. No anagrama o
 *    embaralhado é a charada, então ela fica de pé até ele mandar revelar.
 *
 * Era isto que faltava: antes havia um "Mostrar a resposta" para tudo, o que
 * transformava a forca em "aqui está a palavra" e o "quem sou eu" em três
 * pistas de uma vez — sem as pistas, os botões de 1ª, 2ª e 3ª não tinham como
 * ser escolhidos com honestidade.
 */

import type { KnowsItem, Pergunta } from '../../shared/types/bank';
import type { PalavraDoBanco } from '../../shared/palavras/poco';
import { Teclado } from '../../shared/palavras/Teclado';
import type { ModoDinamico } from './modosDoDinamico';
import './dinamico.css';
import { Favoritar } from '../../shared/estudo/Favoritar';

export const MAX_ERROS_FORCA = 6;

export type ItemDaRodada =
  | { fonte: 'knows'; item: KnowsItem }
  | { fonte: 'palavra'; palavra: PalavraDoBanco }
  | { fonte: 'pergunta'; pergunta: Pergunta }
  | { fonte: 'nenhuma' };

/** O que o mediador já fez nesta rodada, e o que ele pode fazer. */
export interface MesaDoMediador {
  /** Quantas pistas do "quem sou eu" já foram lidas. Começa em 1. */
  pistas: number;
  revelarPista: () => void;
  /** Letras marcadas na forca, na ordem em que o time pediu. */
  letras: string[];
  marcarLetra: (letra: string) => void;
  /** Vale para o anagrama, onde a charada fica de pé até ele mandar revelar. */
  aberto: boolean;
  abrir: () => void;
}

interface Props {
  modo: ModoDinamico;
  item: ItemDaRodada;
  mesa: MesaDoMediador;
}

export function ItemDoModo({ modo, item, mesa }: Props) {
  return <><Favoritar jogo="dinamico-competitivo" item={item.fonte === 'knows' ? item.item : item.fonte === 'palavra' ? item.palavra : item.fonte === 'pergunta' ? item.pergunta : null} /><ConteudoDoModo modo={modo} item={item} mesa={mesa} /></>;
}

function ConteudoDoModo({ modo, item, mesa }: Props) {
  if (item.fonte === 'nenhuma') {
    return <p className="din__vazio">Sem item nesta rodada.</p>;
  }

  if (item.fonte === 'pergunta') {
    const p = item.pergunta;
    return (
      <div className="din__item">
        <p className="din__enunciado">{p.pergunta}</p>
        <p className="din__resposta">{p.alternativas[p.correta]}</p>
        <p className="din__ref">📖 {p.referencia}</p>
      </div>
    );
  }

  if (item.fonte === 'palavra') {
    return modo.jogoDePalavra === 'forca' ? (
      <Forca palavra={item.palavra} mesa={mesa} />
    ) : (
      <Anagrama palavra={item.palavra} mesa={mesa} />
    );
  }

  return <ItemDeConhecimento item={item.item} mesa={mesa} />;
}

/* ------------------------------------------------------------------ *
 * Forca — o mediador marca as letras que o time pede
 * ------------------------------------------------------------------ */

function Forca({ palavra, mesa }: { palavra: PalavraDoBanco; mesa: MesaDoMediador }) {
  const alvo = palavra.palavra;
  const erros = mesa.letras.filter((l) => !alvo.includes(l)).length;
  const completou = [...alvo].every((l) => mesa.letras.includes(l));
  const perdeu = erros >= MAX_ERROS_FORCA;

  return (
    <div className="din__item">
      <p className="din__enunciado">💡 {palavra.dica}</p>

      <div className="din__letras">
        {[...alvo].map((l, i) => {
          const mostra = mesa.letras.includes(l) || perdeu;
          return (
            <span
              key={i}
              className={mostra ? 'din__letra' : 'din__letra din__letra--oculta'}
            >
              {mostra ? l : ''}
            </span>
          );
        })}
      </div>

      <p className={erros > 0 ? 'din__contador din__contador--alerta' : 'din__contador'}>
        {completou
          ? '✅ Palavra completa'
          : perdeu
            ? `❌ Seis erros — a palavra era ${palavra.original}`
            : `${alvo.length} letras · ${erros} de ${MAX_ERROS_FORCA} erros`}
      </p>

      {/* O teclado é do mediador: ele toca na letra que o time pediu. */}
      <Teclado
        aoTocar={mesa.marcarLetra}
        classeDaTecla={(l) =>
          !mesa.letras.includes(l)
            ? ''
            : alvo.includes(l)
              ? 'teclado__tecla--tem'
              : 'teclado__tecla--nao'
        }
        desabilitada={(l) => mesa.letras.includes(l)}
        tudoDesabilitado={completou || perdeu}
      />

      {completou || perdeu ? <p className="din__ref">📖 {palavra.referencia}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Anagrama — a charada fica de pé até o mediador revelar
 * ------------------------------------------------------------------ */

function Anagrama({ palavra, mesa }: { palavra: PalavraDoBanco; mesa: MesaDoMediador }) {
  /*
   * O embaralhado é calculado a partir do id da palavra, não sorteado a cada
   * render: a charada não pode mudar debaixo dos olhos de quem está pensando
   * nela.
   */
  const monte = embaralharEstavel(palavra.palavra);

  return (
    <div className="din__item">
      <p className="din__enunciado">💡 {palavra.dica}</p>

      <div className="din__letras">
        {[...(mesa.aberto ? palavra.palavra : monte)].map((l, i) => (
          <span key={i} className="din__letra">
            {l}
          </span>
        ))}
      </div>

      {mesa.aberto ? (
        <p className="din__ref">📖 {palavra.referencia}</p>
      ) : (
        <button type="button" className="btn btn--ghost" onClick={mesa.abrir}>
          Mostrar a palavra
        </button>
      )}
    </div>
  );
}

/**
 * Embaralha as letras por uma semente tirada da própria palavra.
 *
 * Sem semente, cada render devolveria uma ordem nova e as letras dançariam na
 * mesa enquanto o time discute.
 */
function embaralharEstavel(palavra: string): string {
  let h = 7;
  for (let i = 0; i < palavra.length; i++) h = (h * 31 + palavra.charCodeAt(i)) >>> 0;

  const letras = [...palavra];
  for (let i = letras.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [letras[i], letras[j]] = [letras[j], letras[i]];
  }

  const saida = letras.join('');
  // Saiu igual à palavra: gira uma casa, que é sempre diferente.
  return saida === palavra ? saida.slice(1) + saida[0] : saida;
}

/* ------------------------------------------------------------------ *
 * Os seis modos de conhecimento
 * ------------------------------------------------------------------ */

function ItemDeConhecimento({ item, mesa }: { item: KnowsItem; mesa: MesaDoMediador }) {
  return (
    <div className="din__item">
      {corpo(item, mesa)}
      <p className="din__ref">📖 {item.reference}</p>
      {item.notes ? <p className="din__nota">{item.notes}</p> : null}
    </div>
  );
}

function corpo(item: KnowsItem, mesa: MesaDoMediador) {
  switch (item.type) {
    case 'vf':
      return (
        <>
          <p className="din__enunciado">{item.payload.statement}</p>
          <p className="din__resposta">
            {item.payload.correct ? 'Verdadeiro' : 'Falso'}
          </p>
        </>
      );

    case 'select':
      return (
        <>
          <p className="din__enunciado">{item.payload.prompt}</p>
          <ul className="din__lista">
            {item.payload.options.map((o, i) => (
              <li key={i} className={o.correct ? 'din__linha din__linha--certa' : 'din__linha'}>
                {o.text}
              </li>
            ))}
          </ul>
        </>
      );

    case 'cloze':
      return (
        <>
          <p className="din__enunciado">{item.payload.sentence.replace('____', '____')}</p>
          <p className="din__resposta">{item.payload.answer}</p>
          <ul className="din__lista din__lista--linha">
            {item.payload.choices.map((c) => (
              <li
                key={c}
                className={
                  c === item.payload.answer ? 'din__linha din__linha--certa' : 'din__linha'
                }
              >
                {c}
              </li>
            ))}
          </ul>
        </>
      );

    case 'association':
      return (
        <>
          <p className="din__enunciado">{item.payload.prompt}</p>
          <ul className="din__lista">
            {item.payload.pairs.map((p, i) => (
              <li key={i} className="din__par">
                <b>{p.left}</b>
                <span className="din__certo">{p.right}</span>
              </li>
            ))}
          </ul>
        </>
      );

    case 'whoami': {
      /*
       * Uma pista por vez, e é o mediador quem abre a próxima. É o que faz a
       * regra existir: a primeira pista vale +3, a segunda +2, a terceira +1.
       * Mostrando as três de uma vez, não haveria como saber quanto vale.
       */
      const total = item.payload.hints.length;
      const lidas = Math.min(mesa.pistas, total);
      return (
        <>
          <ol className="din__pistas">
            {item.payload.hints.slice(0, lidas).map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>

          {lidas < total ? (
            <button type="button" className="btn btn--ghost" onClick={mesa.revelarPista}>
              Errou o chute · próxima pista ({lidas + 1} de {total})
            </button>
          ) : (
            <p className="din__contador">Todas as {total} pistas foram lidas.</p>
          )}

          <p className="din__resposta">{item.payload.answer}</p>
        </>
      );
    }

    case 'order':
      return (
        <>
          <p className="din__enunciado">{item.payload.prompt}</p>
          <ol className="din__ordem din__ordem--certa">
            {item.payload.items.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </>
      );
  }
}
