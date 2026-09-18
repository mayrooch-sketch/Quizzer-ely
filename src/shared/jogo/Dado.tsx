/**
 * Um dado, com face de dado.
 *
 * Antes aqui aparecia o número escrito — "6" e "4" em dois quadradinhos. Um
 * dado de verdade não mostra número: mostra pontos, e é a face que se
 * reconhece de longe, do outro lado da mesa, sem ler. Quem joga não soma "6" e
 * "4"; vê duas faces e sabe.
 *
 * A rolagem também é da mesa: o dado **treme e troca de face** enquanto rola, e
 * só então para no valor sorteado. O resultado já está decidido quando a
 * animação começa — o tremor é encenação, e é justamente por isso que ele pode
 * ser cortado sem prejuízo de quem pediu menos movimento no sistema.
 */

import { useEffect, useState } from 'react';
import './dado.css';

/**
 * Quais das nove casas da face têm ponto, por valor.
 *
 * A grade 3×3 é a mesma para as seis faces, e é isso que faz os pontos ficarem
 * alinhados entre um dado e outro.
 */
const PONTOS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

interface Props {
  valor: number;
  rolando?: boolean;
  grande?: boolean;
}

export function Dado({ valor, rolando = false, grande = false }: Props) {
  /*
   * A face do tremor mora à parte, e a face mostrada é derivada das duas. Se
   * `valor` fosse escrito no estado a cada troca, parar de rolar exigiria um
   * `setState` dentro do efeito só para devolver o valor certo.
   */
  const [tremor, setTremor] = useState(1);

  useEffect(() => {
    if (!rolando) return;
    const id = setInterval(() => setTremor(1 + Math.floor(Math.random() * 6)), 90);
    return () => clearInterval(id);
  }, [rolando]);

  const face = rolando ? tremor : valor;
  const classe = [
    'dado',
    grande ? 'dado--grande' : '',
    rolando ? 'dado--rolando' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classe}
      role="img"
      aria-label={rolando ? 'Dado rolando' : `Dado: ${valor}`}
    >
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} className={PONTOS[face]?.includes(i) ? 'dado__ponto' : ''} />
      ))}
    </div>
  );
}
