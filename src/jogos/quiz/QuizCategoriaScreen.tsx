/**
 * Quiz por categoria — perguntas agrupadas por assunto.
 *
 * São duas telas: escolher o assunto, depois responder. A escolha mostra
 * **quantas perguntas cada assunto tem** — de 12 em "Profecias e visões" a 233
 * em "Personagens bíblicos". Saber o tamanho antes muda o que se escolhe, e o
 * app antigo não dizia.
 *
 * Sem barra de progresso quando o assunto tem 233 perguntas: ninguém joga um
 * baralho inteiro numa sentada, e uma barra que nunca se move não informa nada.
 * O que informa é o placar.
 */

import { useMemo, useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { usePerguntas } from '../../app/store';
import { Alternativas } from './Alternativas';
import type { Letra, Pergunta } from '../../shared/types/bank';
import './quiz.css';

export function QuizCategoriaScreen() {
  const perguntas = usePerguntas();
  const [categoria, setCategoria] = useState<string | null>(null);

  const categorias = useMemo(() => {
    const conta = new Map<string, number>();
    perguntas.forEach((p) => conta.set(p.categoria, (conta.get(p.categoria) ?? 0) + 1));
    return [...conta.entries()].sort(([a], [b]) => a.localeCompare(b, 'pt-BR'));
  }, [perguntas]);

  const doAssunto = useMemo(
    () => (categoria ? perguntas.filter((p) => p.categoria === categoria) : []),
    [perguntas, categoria],
  );

  if (perguntas.length === 0) {
    return <p className="aviso">Nenhuma pergunta disponível ainda.</p>;
  }

  if (!categoria) {
    return (
      <>
        <p className="screen-hint">Escolha um assunto para começar.</p>
        <div className="assuntos">
          {categorias.map(([nome, quantas]) => (
            <button
              key={nome}
              type="button"
              className="assunto"
              onClick={() => setCategoria(nome)}
            >
              <span className="assunto__nome">{nome}</span>
              <span className="assunto__n">{quantas}</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <Rodadas
      key={categoria}
      perguntas={doAssunto}
      categoria={categoria}
      aoTrocarAssunto={() => setCategoria(null)}
    />
  );
}

function Rodadas({
  perguntas,
  categoria,
  aoTrocarAssunto,
}: {
  perguntas: Pergunta[];
  categoria: string;
  aoTrocarAssunto: () => void;
}) {
  const baralho = useBaralho(perguntas);
  const placar = usePlacar();
  const [escolha, setEscolha] = useState<Letra | null>(null);

  if (!baralho.atual) return <p className="aviso">Assunto sem perguntas.</p>;

  const pergunta = baralho.atual;
  const respondido = escolha !== null;
  const acertou = escolha === pergunta.correta;

  function responder(letra: Letra) {
    if (respondido) return;
    setEscolha(letra);
    placar.registrar(letra === pergunta.correta);
  }

  function seguir() {
    setEscolha(null);
    baralho.proxima();
  }

  return (
    <Arena
      placar={placar}
      enunciado={pergunta.pergunta}
      detalhe={categoria}
      explicacao={
        respondido ? (
          <Explicacao
            referencia={pergunta.referencia}
            comentario={
              acertou
                ? ''
                : `A resposta é "${pergunta.alternativas[pergunta.correta]}".`
            }
          />
        ) : null
      }
      secundaria={
        respondido
          ? { label: 'Trocar assunto', onClick: aoTrocarAssunto }
          : { label: 'Pular', onClick: seguir }
      }
      primaria={{ label: 'Próxima', onClick: seguir, disabled: !respondido }}
    >
      <Alternativas
        pergunta={pergunta}
        escolha={escolha}
        onEscolher={responder}
      />
    </Arena>
  );
}
