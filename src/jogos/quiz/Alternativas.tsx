/**
 * As quatro alternativas de uma pergunta.
 *
 * **Em lista, não em grade** — decisão do usuário. A mediana das alternativas
 * tem 8 caracteres e caberia numa grade 2×2, mas o máximo tem 62, e uma grade
 * que às vezes vira lista muda de forma no meio do jogo.
 *
 * **Sem as letras A/B/C/D.** Elas existiam para casar com folha de respostas;
 * aqui se toca no texto. O banco continua guardando a letra — é ela que diz
 * qual está certa —, ela só não aparece.
 */

import type { Letra, Pergunta } from '../../shared/types/bank';
import { LETRAS } from '../../shared/types/bank';
import { useMemo } from 'react';
import { embaralhar } from '../../shared/jogo/useBaralho';
import { useSessao } from '../../shared/estudo/contexto';
import { reduzirOpcoes } from '../../shared/estudo/dificuldade';

interface Props {
  pergunta: Pergunta;
  /** Letra escolhida, ou `null` enquanto não respondeu. */
  escolha: Letra | null;
  onEscolher: (letra: Letra) => void;
}

export function Alternativas({ pergunta, escolha, onEscolher }: Props) {
  const nivel = useSessao()?.nivel ?? 'normal';
  const opcoes = useMemo(() => reduzirOpcoes(embaralhar(LETRAS), pergunta.correta, nivel), [pergunta, nivel]);
  const respondido = escolha !== null;

  return (
    <>
      {opcoes.map((letra) => {
        let classe = 'opcao';
        if (respondido) {
          if (letra === pergunta.correta) classe = 'opcao opcao--certa';
          else if (letra === escolha) classe = 'opcao opcao--errada';
        }
        return (
          <button
            key={letra}
            type="button"
            className={classe}
            onClick={() => onEscolher(letra)}
            disabled={respondido}
          >
            {pergunta.alternativas[letra]}
          </button>
        );
      })}
    </>
  );
}
