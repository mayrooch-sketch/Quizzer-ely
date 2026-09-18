/**
 * O teclado dos jogos de palavra — um só, em QWERTY.
 *
 * A ordem é a do teclado do celular, não a do alfabeto. Quem joga não procura
 * a letra: a mão já sabe onde ela fica, e obrigar a leitura de A a Z transforma
 * cada letra numa busca. As três fileiras têm largura de tecla igual e ficam
 * centradas, como num teclado de verdade.
 *
 * Forca e cruzadas usam este; o anagrama tem o seu, com só as letras da palavra
 * — mas na mesma ordem (ver `ordemDeTeclado`).
 */

import { FILAS } from './teclas';
import './teclas.css';

export interface Props {
  aoTocar: (letra: string) => void;
  /** Classe extra da tecla — verde, riscada, apagada. */
  classeDaTecla?: (letra: string) => string;
  aoApagar?: () => void;
  desabilitada?: (letra: string) => boolean;
  tudoDesabilitado?: boolean;
}

export function Teclado({
  aoTocar,
  classeDaTecla,
  aoApagar,
  desabilitada,
  tudoDesabilitado,
}: Props) {
  return (
    <div className="teclado">
      {FILAS.map((fila, n) => (
        <div key={n} className="teclado__fila">
          {fila.map((l) => (
            <button
              key={l}
              type="button"
              className={`teclado__tecla ${classeDaTecla?.(l) ?? ''}`}
              onClick={() => aoTocar(l)}
              disabled={tudoDesabilitado || desabilitada?.(l)}
            >
              {l}
            </button>
          ))}

          {/* O ⌫ mora no fim da última fileira, como no teclado do celular. */}
          {n === FILAS.length - 1 && aoApagar ? (
            <button
              type="button"
              className="teclado__tecla teclado__tecla--larga"
              aria-label="Apagar"
              onClick={aoApagar}
              disabled={tudoDesabilitado}
            >
              ⌫
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
