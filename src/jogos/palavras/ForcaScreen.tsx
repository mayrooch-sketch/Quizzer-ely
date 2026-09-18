/**
 * Forca — seis erros, o mesmo poço de palavras do anagrama.
 *
 * **A fileira de "letras usadas" saiu.** O app antigo mostrava duas vezes a
 * mesma informação: o teclado já apagava a tecla tocada, e logo abaixo havia
 * uma fileira de fichas repetindo quais letras tinham saído, agora com cor de
 * certo e errado. Aqui a cor está na própria tecla — verde para quem está na
 * palavra, vermelha para quem não está —, e a fileira some sem levar nada.
 * São 26 alvos a menos disputando os mesmos 375px.
 *
 * **A pergunta fica à vista o tempo todo.** Boa parte das respostas do banco
 * são nomes próprios pouco comuns, e adivinhar SESBAZAR letra a letra com seis
 * chances, sem saber do que se trata, não é jogo — é sorteio. Era assim no app
 * antigo e continua sendo.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { usePlacar } from '../../shared/jogo/useBaralho';
import type { PalavraDoBanco } from '../../shared/palavras/poco';
import { useFilaDePalavras } from './useFilaDePalavras';
import { Teclado } from '../../shared/palavras/Teclado';
import './palavras.css';

const MAX_ERROS = 6;

export function ForcaScreen() {
  const fila = useFilaDePalavras(12);
  const placar = usePlacar();

  if (!fila.palavra) {
    return <p className="aviso">O banco não tem palavras para a forca.</p>;
  }

  return (
    <Rodada
      key={fila.palavra.palavra}
      alvo={fila.palavra}
      placar={placar}
      onProxima={fila.proxima}
    />
  );
}

interface PropsRodada {
  alvo: PalavraDoBanco;
  placar: ReturnType<typeof usePlacar>;
  onProxima: () => void;
}

function Rodada({ alvo, placar, onProxima }: PropsRodada) {
  const palavra = alvo.palavra;
  const [usadas, setUsadas] = useState<string[]>([]);
  const [contado, setContado] = useState(false);

  const erros = usadas.filter((l) => !palavra.includes(l)).length;
  const perdeu = erros >= MAX_ERROS;
  const ganhou = [...palavra].every((l) => usadas.includes(l));
  const acabou = perdeu || ganhou;

  function tocar(letra: string) {
    if (acabou || usadas.includes(letra)) return;

    const novas = [...usadas, letra];
    setUsadas(novas);

    const errosAgora = novas.filter((l) => !palavra.includes(l)).length;
    const venceu = [...palavra].every((l) => novas.includes(l));
    if (!contado && (venceu || errosAgora >= MAX_ERROS)) {
      placar.registrar(venceu);
      setContado(true);
    }
  }

  return (
    <Arena
      placar={placar}
      enunciado={
        <div className="forca__palavra">
          {[...palavra].map((l, i) => (
            <span
              key={i}
              className={
                usadas.includes(l)
                  ? 'forca__slot forca__slot--aberto'
                  : perdeu
                    ? 'forca__slot forca__slot--perdido'
                    : 'forca__slot'
              }
            >
              {usadas.includes(l) || perdeu ? l : ''}
            </span>
          ))}
        </div>
      }
      detalhe={
        ganhou
          ? '✅ Acertou a palavra'
          : perdeu
            ? `A palavra era ${alvo.original}`
            : `${palavra.length} letras · ${erros} de ${MAX_ERROS} erros`
      }
      explicacao={
        acabou ? (
          <Explicacao referencia={alvo.referencia} comentario={alvo.dica} />
        ) : null
      }
      primaria={{ label: acabou ? 'Próxima' : 'Pular', onClick: onProxima }}
    >
      <div className="forca">
        <Patibulo erros={erros} />
        {!acabou ? <p className="forca__dica">💡 {alvo.dica}</p> : null}

        <Teclado
          aoTocar={tocar}
          classeDaTecla={(l) =>
            !usadas.includes(l)
              ? ''
              : palavra.includes(l)
                ? 'teclado__tecla--tem'
                : 'teclado__tecla--nao'
          }
          desabilitada={(l) => usadas.includes(l)}
          tudoDesabilitado={acabou}
        />
      </div>
    </Arena>
  );
}

/**
 * O patíbulo, uma peça por erro.
 *
 * Desenhado com `currentColor` para acompanhar o tema, e com as peças ainda
 * não perdidas ocupando o lugar delas em transparente — sem isso o desenho
 * salta de tamanho a cada erro.
 */
function Patibulo({ erros }: { erros: number }) {
  const mostra = (i: number) => (erros > i ? 'forca__parte' : 'forca__parte forca__parte--oculta');

  return (
    <svg
      className="forca__svg"
      viewBox="0 0 110 120"
      role="img"
      aria-label={`${erros} de ${MAX_ERROS} erros`}
    >
      <line className="forca__parte" x1="10" y1="115" x2="100" y2="115" />
      <line className="forca__parte" x1="30" y1="115" x2="30" y2="10" />
      <line className="forca__parte" x1="30" y1="10" x2="65" y2="10" />
      <line className="forca__parte" x1="65" y1="10" x2="65" y2="22" />
      <circle className={mostra(0)} cx="65" cy="32" r="10" />
      <line className={mostra(1)} x1="65" y1="42" x2="65" y2="74" />
      <line className={mostra(2)} x1="65" y1="50" x2="50" y2="64" />
      <line className={mostra(3)} x1="65" y1="50" x2="80" y2="64" />
      <line className={mostra(4)} x1="65" y1="74" x2="52" y2="90" />
      <line className={mostra(5)} x1="65" y1="74" x2="78" y2="90" />
    </svg>
  );
}
