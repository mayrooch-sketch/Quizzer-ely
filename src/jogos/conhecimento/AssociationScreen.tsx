/**
 * Associação — de dois a quatro pares por rodada.
 *
 * A tela mais apertada dos seis, e a que mais depende de uma decisão de
 * largura: **as colunas não têm o mesmo tamanho**. À esquerda vai um nome
 * curto; à direita, uma frase de até 80 caracteres. Dividir 50/50 faria a
 * frase quebrar em seis linhas ao lado de uma palavra sozinha.
 *
 * Ligar é tocar à esquerda e tocar à direita — sem arrastar. Arrastar num
 * celular briga com a rolagem e falha justamente quando o dedo está apressado.
 *
 * A cor marca o par e aparece dos dois lados: é o que permite conferir de
 * relance, sem reler tudo.
 *
 * "Desfazer" tira só a última ligação. Um "limpar tudo" tocado por engano
 * depois de três acertos seria o pior toque possível desta tela.
 */

import { useState } from 'react';
import { Arena, Explicacao } from '../../shared/jogo/Arena';
import { useBaralho, usePlacar } from '../../shared/jogo/useBaralho';
import { useItensDoTipo } from '../../shared/jogo/useItensDoTipo';
import { SemItens } from './SemItens';
import './conhecimento.css';

/** Quatro cores distinguíveis, na ordem em que os pares são ligados. */
const CORES = ['a', 'b', 'c', 'd'] as const;

/**
 * Uma ligação, guardada por **posição** e não por texto.
 *
 * Trinta e um itens do banco repetem um texto dentro do mesmo item — quatro
 * animais que "Entrou na arca com Noé", dois nomes iguais à esquerda. Com a
 * identidade no texto, tocar num deles selecionava os dois, uma ligação valia
 * pelas duas e o React ainda reclamava de chave repetida. Posição é única por
 * construção.
 */
interface Ligacao {
  /** Índice do par, na coluna da esquerda. */
  esq: number;
  /** Índice do par de onde veio a frase escolhida à direita. */
  dir: number;
}

export function AssociationScreen() {
  const itens = useItensDoTipo('association');

  const baralho = useBaralho(itens);
  const placar = usePlacar();
  const [ligacoes, setLigacoes] = useState<Ligacao[]>([]);
  const [selecaoEsq, setSelecaoEsq] = useState<number | null>(null);
  const [conferido, setConferido] = useState(false);
  const [mostrarPares, setMostrarPares] = useState(false);

  if (!baralho.atual) return <SemItens />;

  const item = baralho.atual;
  const pares = item.payload.pairs;

  /*
   * A direita é embaralhada por item, não a cada render: sem isso, tocar num
   * nome reordenaria as frases debaixo do dedo.
   */
  const direita = embaralharEstavel(item.id, pares.map((_, i) => i));

  const ligadoEsq = (esq: number) => ligacoes.find((l) => l.esq === esq);
  const ligadoDir = (dir: number) => ligacoes.find((l) => l.dir === dir);

  function tocarEsquerda(esq: number) {
    if (conferido) return;
    if (ligadoEsq(esq)) {
      setLigacoes((ls) => ls.filter((l) => l.esq !== esq));
      setSelecaoEsq(null);
      return;
    }
    setSelecaoEsq((atual) => (atual === esq ? null : esq));
  }

  function tocarDireita(dir: number) {
    if (conferido) return;
    if (ligadoDir(dir)) {
      setLigacoes((ls) => ls.filter((l) => l.dir !== dir));
      return;
    }
    if (selecaoEsq === null) return;
    setLigacoes((ls) => [...ls, { esq: selecaoEsq, dir }]);
    setSelecaoEsq(null);
  }

  /*
   * Confere por texto, não por posição: quando duas frases da direita são
   * idênticas, ligar à outra é tão certo quanto ligar a esta, e marcar erro
   * seria cobrar do jogador uma diferença que a tela não mostra.
   */
  const ligacaoCerta = (l: Ligacao) => pares[l.dir].right === pares[l.esq].right;

  function conferir() {
    const certo = pares.every((_, i) => {
      const l = ligadoEsq(i);
      return l ? ligacaoCerta(l) : false;
    });
    setConferido(true);
    placar.registrar(certo);
  }

  function seguir() {
    setLigacoes([]);
    setSelecaoEsq(null);
    setConferido(false);
    setMostrarPares(false);
    baralho.proxima();
  }

  const completo = ligacoes.length === pares.length;
  const acertos = ligacoes.filter(ligacaoCerta).length;

  /** A cor do par, pela ordem em que foi ligado. */
  function corDe(ligacao: Ligacao | undefined): string | null {
    if (!ligacao) return null;
    const i = ligacoes.indexOf(ligacao);
    return i < 0 ? null : CORES[i % CORES.length];
  }

  function classeLinha(ligada: string | null, certa: boolean | null): string {
    const base = ['assoc__item'];
    if (ligada) base.push(`assoc__item--${ligada}`);
    if (certa === true) base.push('assoc__item--certa');
    if (certa === false) base.push('assoc__item--errada');
    return base.join(' ');
  }

  return (
    <Arena
      progresso={{ posicao: baralho.posicao, total: baralho.total }}
      placar={placar}
      enunciado={item.payload.prompt}
      detalhe={
        conferido
          ? `${mostrarPares ? 'Pares corretos. Sua tentativa: ' : ''}${acertos} de ${pares.length} pares certos`
          : selecaoEsq !== null
            ? 'Agora toque na frase que combina'
            : 'Toque num nome, depois na frase dele'
      }
      explicacao={
        conferido ? (
          <Explicacao referencia={item.reference} comentario={item.notes} />
        ) : null
      }
      secundaria={
        conferido
          ? { label: mostrarPares ? 'Suas ligações' : 'Ver pares corretos', onClick: () => setMostrarPares((atual) => !atual) }
          : {
              label: 'Desfazer',
              onClick: () => setLigacoes((ls) => ls.slice(0, -1)),
              disabled: ligacoes.length === 0,
            }
      }
      primaria={
        conferido
          ? { label: 'Próxima', onClick: seguir }
          : { label: 'Conferir', onClick: conferir, disabled: !completo }
      }
    >
      {mostrarPares ? (
        <ul className="assoc__respostas">
          {pares.map((par, i) => <li key={i}><b>{par.left}</b> — {par.right}</li>)}
        </ul>
      ) : <div className="assoc">
        <div className="assoc__col assoc__col--esq">
          {pares.map((p, i) => {
            const l = ligadoEsq(i);
            const certa = conferido ? (l ? ligacaoCerta(l) : false) : null;
            return (
              <button
                key={i}
                type="button"
                className={classeLinha(corDe(l), certa)}
                aria-pressed={selecaoEsq === i}
                onClick={() => tocarEsquerda(i)}
                disabled={conferido}
              >
                {p.left}
              </button>
            );
          })}
        </div>

        <div className="assoc__col">
          {direita.map((dir) => {
            const l = ligadoDir(dir);
            const certa = conferido ? (l ? ligacaoCerta(l) : false) : null;
            return (
              <button
                key={dir}
                type="button"
                className={classeLinha(corDe(l), certa)}
                onClick={() => tocarDireita(dir)}
                disabled={conferido}
              >
                {pares[dir].right}
              </button>
            );
          })}
        </div>
      </div>}
    </Arena>
  );
}

/**
 * Embaralhamento que depende do item, não do render.
 *
 * Usa o id como semente: a mesma lista sempre sai na mesma ordem para o mesmo
 * item, e muda quando o item muda. Sem isso, tocar num nome reordenaria as
 * frases debaixo do dedo — o pior tipo de bug de toque.
 */
function embaralharEstavel<T>(semente: string, itens: readonly T[]): T[] {
  let h = 0;
  for (let i = 0; i < semente.length; i++) h = (h * 31 + semente.charCodeAt(i)) >>> 0;

  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
