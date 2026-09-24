/**
 * Caça-palavras.
 *
 * Duas maneiras de marcar, e as duas valem sempre: **arrastar** o dedo da
 * primeira à última letra, ou **tocar a primeira e depois a última**. O app
 * antigo só tinha o arrasto, e num celular ele falha justamente nas palavras
 * verticais — o navegador entende o gesto como rolagem e a seleção se perde no
 * meio. O toque duplo não falha nunca, e quem prefere arrastar nem descobre
 * que ele existe.
 *
 * A grade tem três tamanhos porque foi pedido, e trocar de tamanho monta uma
 * grade nova — não há como redimensionar sem refazer.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { usePocoDePalavras, type PalavraDoBanco } from '../../shared/palavras/poco';
import { marcarUsadas } from '../../shared/palavras/memoria';
import {
  TAMANHOS,
  caminhoEntre,
  gerarCaca,
  palavraNoCaminho,
  type Caca,
} from './gerarCaca';
import './palavras.css';
import { Explicacao } from '../../shared/jogo/Arena';

const CHAVE_TAM = 'quizzer.caca.tamanho';
const CHAVE_DIAG = 'quizzer.caca.diagonais';
const PISCA_ERRO = 450;

/** Letra menor conforme a grade cresce, para caber na mesma largura. */
const FONTE_DA_CELULA: Record<number, string> = {
  8: '22px',
  10: '18px',
  12: '15px',
};

function ler(chave: string, padrao: string): string {
  try {
    return localStorage.getItem(chave) ?? padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: string): void {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    // Armazenamento bloqueado: a escolha vale só nesta sessão.
  }
}

export function CacaPalavrasScreen() {
  const poco = usePocoDePalavras(12);
  const [tam, setTam] = useState(() => {
    const salvo = Number(ler(CHAVE_TAM, '10'));
    return TAMANHOS.some((t) => t.tam === salvo) ? salvo : 10;
  });
  const [diagonais, setDiagonais] = useState(() => ler(CHAVE_DIAG, '0') === '1');
  const [rodada, setRodada] = useState(0);

  function escolherTamanho(novo: number) {
    setTam(novo);
    gravar(CHAVE_TAM, String(novo));
  }

  function alternarDiagonais() {
    setDiagonais((d) => {
      gravar(CHAVE_DIAG, d ? '0' : '1');
      return !d;
    });
  }

  const alvo = TAMANHOS.find((t) => t.tam === tam)?.alvo ?? 8;

  const opcoes = (
    <div className="caca__opcoes">
      {TAMANHOS.map((t) => (
        <button
          key={t.tam}
          type="button"
          className="caca__chip"
          aria-pressed={t.tam === tam}
          onClick={() => escolherTamanho(t.tam)}
        >
          {t.tam}×{t.tam}
        </button>
      ))}
      <button
        type="button"
        className="caca__chip"
        aria-pressed={diagonais}
        aria-label="Palavras na diagonal"
        onClick={alternarDiagonais}
      >
        ↘
      </button>
    </div>
  );

  if (poco.length < alvo) {
    return (
      <p className="aviso">
        O banco não tem palavras suficientes para montar a grade.
      </p>
    );
  }

  /*
   * A chave inclui tamanho, diagonais e rodada: qualquer uma que mude monta
   * uma grade nova do zero. É o que evita um efeito só para recomeçar — o
   * React desmonta e remonta, e o estado da partida vai junto.
   */
  return (
    <Tabuleiro
      key={`${tam}-${diagonais}-${rodada}`}
      tam={tam}
      alvo={alvo}
      diagonais={diagonais}
      poco={poco}
      opcoes={opcoes}
      onNova={() => setRodada((r) => r + 1)}
    />
  );
}

interface PropsTabuleiro {
  tam: number;
  alvo: number;
  diagonais: boolean;
  poco: PalavraDoBanco[];
  opcoes: ReactNode;
  onNova: () => void;
}

function Tabuleiro({ tam, alvo, diagonais, poco, opcoes, onNova }: PropsTabuleiro) {
  const [caca] = useState<Caca | null>(() =>
    gerarCaca({ tam, alvo, poco, diagonais }),
  );

  const [achadas, setAchadas] = useState<string[]>([]);
  const [revelado, setRevelado] = useState(false);
  const [ancora, setAncora] = useState<number | null>(null);
  const [traco, setTraco] = useState<number[]>([]);
  const [erro, setErro] = useState<number[]>([]);
  const [consultada, setConsultada] = useState<PalavraDoBanco | null>(null);

  /*
   * O gesto em curso mora numa ref, não em estado.
   *
   * `pointerup` precisa saber onde `pointerdown` começou, e ler isso de um
   * `useState` é apostar que o React já renderizou entre os dois eventos.
   * Ele costuma ter renderizado — mas num toque rápido os dois chegam no mesmo
   * quadro, e o gesto se perde sem deixar rastro. A ref está lá no instante
   * seguinte, sempre. O que fica em estado é só o que a tela desenha.
   */
  const gesto = useRef<{ inicio: number; caminho: number[] } | null>(null);

  /* As palavras desta grade saem da fila dos outros jogos de palavra. */
  useEffect(() => {
    if (caca) marcarUsadas(caca.palavras.map((p) => p.palavra));
  }, [caca]);

  useEffect(() => {
    if (erro.length === 0) return;
    const id = setTimeout(() => setErro([]), PISCA_ERRO);
    return () => clearTimeout(id);
  }, [erro]);

  if (!caca) {
    return (
      <div className="caca">
        <p className="aviso">
          Não deu para montar uma grade em que todas as palavras se cruzem.
        </p>
        <button type="button" className="btn" onClick={onNova}>
          Tentar de novo
        </button>
      </div>
    );
  }

  const grade = caca;
  const completo = achadas.length === grade.palavras.length;

  /** Qual célula está sob este ponto da tela. */
  function celulaDoPonto(x: number, y: number): number | null {
    const sob = document.elementFromPoint(x, y);
    const cel = sob instanceof Element ? sob.closest('[data-i]') : null;
    if (!(cel instanceof HTMLElement)) return null;
    const i = Number(cel.dataset.i);
    return Number.isInteger(i) ? i : null;
  }

  function concluir(caminho: number[] | null) {
    if (!caminho || caminho.length < 2) return;
    const achou = palavraNoCaminho(grade.palavras, caminho);
    if (achou) {
      if (!achadas.includes(achou.palavra)) {
        setAchadas((a) => [...a, achou.palavra]);
      }
    } else {
      setErro(caminho);
    }
  }

  function aoDescer(e: ReactPointerEvent<HTMLDivElement>) {
    const i = celulaDoPonto(e.clientX, e.clientY);
    if (i === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    // Segundo toque do modo "toca a primeira, toca a última".
    if (ancora !== null && ancora !== i) {
      concluir(caminhoEntre(grade.tam, ancora, i));
      setAncora(null);
      gesto.current = null;
      return;
    }

    setAncora(null);
    gesto.current = { inicio: i, caminho: [i] };
    setTraco([i]);
  }

  function aoMover(e: ReactPointerEvent<HTMLDivElement>) {
    const atual = gesto.current;
    if (!atual) return;
    const i = celulaDoPonto(e.clientX, e.clientY);
    if (i === null) return;
    const caminho = caminhoEntre(grade.tam, atual.inicio, i);
    if (!caminho) return;
    atual.caminho = caminho;
    setTraco(caminho);
  }

  function aoSubir() {
    const atual = gesto.current;
    if (!atual) return;
    gesto.current = null;

    // Um toque só: guarda a âncora e espera a segunda letra.
    if (atual.caminho.length > 1) concluir(atual.caminho);
    else setAncora(atual.inicio);

    setTraco([]);
  }

  const celulasAchadas = new Set(
    grade.palavras
      .filter((p) => achadas.includes(p.palavra))
      .flatMap((p) => p.celulas),
  );

  const celulasReveladas = revelado
    ? new Set(
        grade.palavras
          .filter((p) => !achadas.includes(p.palavra))
          .flatMap((p) => p.celulas),
      )
    : new Set<number>();

  function classeDaCelula(i: number): string {
    if (erro.includes(i)) return 'caca__cel caca__cel--erro';
    if (traco.includes(i)) return 'caca__cel caca__cel--traco';
    if (ancora === i) return 'caca__cel caca__cel--ancora';
    if (celulasAchadas.has(i)) return 'caca__cel caca__cel--achada';
    if (celulasReveladas.has(i)) return 'caca__cel caca__cel--revelada';
    return 'caca__cel';
  }

  const estilo = {
    '--n': grade.tam,
    '--fs-cel': FONTE_DA_CELULA[grade.tam] ?? '18px',
  } as CSSProperties;

  return (
    <div className="caca">
      <div className="caca__topo">
        <span
          className={
            completo ? 'caca__contador caca__contador--fim' : 'caca__contador'
          }
        >
          {completo
            ? '✓ Achou todas'
            : `${achadas.length} de ${grade.palavras.length}`}
        </span>
        {opcoes}
      </div>

      <div
        className="caca__grade"
        style={estilo}
        aria-label={`Grade de ${grade.tam} por ${grade.tam} letras`}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoSubir}
        onPointerCancel={() => {
          gesto.current = null;
          setTraco([]);
          setAncora(null);
        }}
      >
        {grade.letras.map((letra, i) => (
          <div key={i} data-i={i} className={classeDaCelula(i)}>
            {letra}
          </div>
        ))}
      </div>

      <div className="caca__lista">
        {grade.palavras.map((p) => {
          const foi = achadas.includes(p.palavra);
          const classe = foi
            ? 'caca__palavra caca__palavra--achada'
            : revelado
              ? 'caca__palavra caca__palavra--revelada'
              : 'caca__palavra';
          return (
            <button type="button" key={p.palavra} className={classe}
              aria-pressed={consultada?.palavra === p.palavra}
              aria-controls="caca-pergunta"
              onClick={() => setConsultada((atual) => atual?.palavra === p.palavra ? null : p)}>
              {p.palavra}
            </button>
          );
        })}
      </div>

      <section id="caca-pergunta" aria-live="polite">
        {consultada ? <>
          <strong>{consultada.original}</strong>
          <Explicacao comentario={consultada.dica} referencia={consultada.referencia} />
        </> : <p className="screen-hint">Toque em uma palavra da lista para consultar a pergunta e a referência.</p>}
      </section>

      <div className="caca__acoes">
        {!completo && !revelado ? (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setRevelado(true)}
          >
            Mostrar onde estão
          </button>
        ) : null}
        <button type="button" className="btn" onClick={onNova}>
          Nova grade
        </button>
      </div>
    </div>
  );
}
