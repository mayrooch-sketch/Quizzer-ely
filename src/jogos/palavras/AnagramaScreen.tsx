/**
 * Anagrama — as letras estão embaralhadas, remonte a palavra.
 *
 * **Cinco botões viraram dois.** O app antigo tinha "1 letra", "Apagar",
 * "Limpar", "Embaralhar" e "Nova palavra" numa fileira só, quatro deles
 * cinzentos e do mesmo tamanho: nada dizia qual era o toque comum. Aqui:
 *
 * - **⌫ é uma tecla**, ao lado das letras. É o gesto de quem está digitando;
 *   fazer a mão viajar até a barra de baixo para apagar uma letra é caro.
 * - **Embaralhar é tocar nas letras de cima.** O monte embaralhado é a única
 *   coisa que embaralhar mexe, então é nele que se toca.
 * - **"Limpar" saiu.** Apagar quatro letras é tocar ⌫ quatro vezes, e um
 *   "limpar tudo" tocado por engano no fim de uma palavra longa é o pior toque
 *   possível da tela.
 * - **A dica é um botão só, que escala.** Primeiro toque mostra a pergunta de
 *   onde a palavra saiu; do segundo em diante, revela uma letra no lugar dela.
 *
 * Sobram "Dica" e "Pular" — e o rótulo do principal muda para "Próxima" quando
 * a palavra é acertada, que é quando ele deixa de ser desistência.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { usePlacar } from '../../shared/jogo/useBaralho';
import type { PalavraDoBanco } from '../../shared/palavras/poco';
import { ordemDeTeclado } from '../../shared/palavras/teclas';
import { embaralharLetras, useFilaDePalavras } from './useFilaDePalavras';
import './palavras.css';
import { revelarNoAnagrama } from './ajudaAnagrama';

/** Dez letras já é uma palavra longa de tocar; acima disso vira digitação. */
const MAX_LETRAS = 10;

export function AnagramaScreen() {
  const fila = useFilaDePalavras(MAX_LETRAS);
  const placar = usePlacar();

  if (!fila.palavra) {
    return <p className="aviso">O banco não tem palavras para o anagrama.</p>;
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

  const [monte, setMonte] = useState(() => embaralharLetras(palavra));
  /** Uma posição por letra. `null` é espaço vazio. */
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array(palavra.length).fill(null),
  );
  /** Posições reveladas pela dica: ficam no lugar e não se apagam. */
  const [revelados, setRevelados] = useState<number[]>([]);
  const [ajudas, setAjudas] = useState(0);
  const [errou, setErrou] = useState(false);
  const [contado, setContado] = useState(false);

  const completo = slots.every((s) => s !== null);
  const acertou = completo && slots.join('') === palavra;

  /** Quantas vezes cada letra ainda cabe, para apagar as esgotadas do teclado. */
  const restam = new Map<string, number>();
  for (const l of palavra) restam.set(l, (restam.get(l) ?? 0) + 1);
  for (const s of slots) if (s) restam.set(s, (restam.get(s) ?? 0) - 1);

  /*
   * Só as letras da palavra, mas na ordem do teclado — não na do alfabeto.
   * É a mesma mão que vai procurar a letra na forca e nas cruzadas.
   */
  const teclas = ordemDeTeclado([...new Set([...palavra])]);

  function digitar(letra: string) {
    if (acertou) return;
    if ((restam.get(letra) ?? 0) <= 0) return;
    const vaga = slots.findIndex((s, i) => s === null && !revelados.includes(i));
    if (vaga < 0) return;

    const novos = [...slots];
    novos[vaga] = letra;
    setSlots(novos);
    setErrou(false);

    // Confere sozinho ao encher o último espaço: pedir um toque a mais para
    // dizer "terminei" é pedir um toque que não decide nada.
    if (novos.every((s) => s !== null)) {
      const certo = novos.join('') === palavra;
      setErrou(!certo);
      if (!contado) {
        placar.registrar(certo);
        setContado(true);
      }
    }
  }

  function apagar() {
    if (acertou) return;
    const ultima = slots.reduce(
      (achado, s, i) => (s !== null && !revelados.includes(i) ? i : achado),
      -1,
    );
    if (ultima < 0) return;
    const novos = [...slots];
    novos[ultima] = null;
    setSlots(novos);
    setErrou(false);
  }

  function pedirAjuda() {
    if (acertou) return;

    // Primeira ajuda: a pergunta de onde a palavra saiu.
    if (ajudas === 0) {
      setAjudas(1);
      return;
    }

    // Das seguintes: uma letra no lugar certo, que fica travada.
    const ajuda = revelarNoAnagrama(palavra, slots, revelados);
    if (!ajuda) return;
    const { slots: novos, indice: i } = ajuda;
    setSlots(novos);
    setRevelados((r) => [...r, i]);
    setAjudas((a) => a + 1);
    setErrou(false);

    if (novos.every((s) => s !== null) && !contado) {
      placar.registrar(novos.join('') === palavra);
      setContado(true);
    }
  }

  const podeRevelarMais = slots.some((s, i) => s !== palavra[i] && !revelados.includes(i));

  return (
    <Arena
      placar={placar}
      enunciado={
        <button
          type="button"
          className="ana__monte"
          aria-label="Embaralhar as letras de novo"
          onClick={() => setMonte((m) => embaralharLetras(palavra, m))}
        >
          {[...monte].map((l, i) => (
            <span key={i} className="ana__letra">
              {l}
            </span>
          ))}
        </button>
      }
      detalhe={
        acertou
          ? '✅ Acertou'
          : errou
            ? 'Não é essa. Apague e tente de novo.'
            : 'Toque nas letras de cima para embaralhar'
      }
      explicacao={
        acertou ? (
          <Explicacao
            referencia={alvo.referencia}
            comentario={`Resposta: ${alvo.original}. ${alvo.dica}`}
          />
        ) : null
      }
      secundaria={
        acertou
          ? { label: 'Dica', onClick: pedirAjuda, disabled: true }
          : {
              label: ajudas === 0 ? '💡 Dica' : '🔠 Uma letra',
              onClick: pedirAjuda,
              disabled: ajudas > 0 && !podeRevelarMais,
            }
      }
      primaria={{
        label: acertou ? 'Próxima' : 'Pular',
        onClick: onProxima,
      }}
    >
      <div className="ana">
        <div
          className={
            acertou
              ? 'ana__slots ana__slots--certo'
              : errou
                ? 'ana__slots ana__slots--errado'
                : 'ana__slots'
          }
        >
          {slots.map((s, i) => (
            <span
              key={i}
              className={revelados.includes(i) ? 'ana__slot ana__slot--dado' : 'ana__slot'}
            >
              {s ?? ''}
            </span>
          ))}
        </div>

        {ajudas > 0 ? <p className="ana__dica">💡 {alvo.dica}</p> : null}

        <div className="ana__teclado">
          {teclas.map((l) => (
            <button
              key={l}
              type="button"
              className={
                (restam.get(l) ?? 0) <= 0 ? 'ana__tecla ana__tecla--gasta' : 'ana__tecla'
              }
              onClick={() => digitar(l)}
              disabled={acertou || (restam.get(l) ?? 0) <= 0}
            >
              {l}
            </button>
          ))}
          <button
            type="button"
            className="ana__tecla ana__tecla--apagar"
            aria-label="Apagar a última letra"
            onClick={apagar}
            disabled={acertou}
          >
            ⌫
          </button>
        </div>
      </div>
    </Arena>
  );
}
