/**
 * Palavras cruzadas.
 *
 * **A lista de dicas saiu de baixo da grade.** No app antigo as duas listas —
 * horizontais e verticais — ficavam abaixo de tudo, e num celular isso quer
 * dizer rolar para ler a dica, rolar de volta para digitar, e repetir a cada
 * palavra. A dica da vez agora mora numa **barra fixa acima do teclado**, com
 * ‹ › para andar entre as palavras; a lista completa continua existindo, numa
 * folha que abre por cima quando se toca na dica.
 *
 * **Seis botões viraram três.** Eram "Limpar", "Revelar", "1 letra",
 * "Verificar palavra", "Verificar tudo" e "Tentar novamente", todos do mesmo
 * tamanho. Ficaram os dois toques do jogo — **🔠 Letra** e **Conferir** — e um
 * **⋯** para o resto, que é o que se usa uma vez por partida: limpar, revelar
 * tudo e montar outra grade.
 *
 * O teclado é da tela, não do sistema: o teclado do celular cobre metade da
 * área e leva a grade junto. É o mesmo da forca, em QWERTY (ver `Teclado`).
 */

import { useEffect, useRef, useState } from 'react';
import { usePocoDePalavras } from '../../shared/palavras/poco';
import { marcarUsadas } from '../../shared/palavras/memoria';
import { Teclado } from '../../shared/palavras/Teclado';
import { gerarCruzadas, type Cruzada, type EntradaCruzada } from './gerarCruzadas';
import './palavras.css';

export function CruzadasScreen() {
  const poco = usePocoDePalavras(10);
  const [rodada, setRodada] = useState(0);

  if (poco.length < 20) {
    return <p className="aviso">O banco não tem palavras suficientes para as cruzadas.</p>;
  }

  return <Tabuleiro key={rodada} poco={poco} onNova={() => setRodada((r) => r + 1)} />;
}

interface PropsTabuleiro {
  poco: ReturnType<typeof usePocoDePalavras>;
  onNova: () => void;
}

function Tabuleiro({ poco, onNova }: PropsTabuleiro) {
  const [cruzada] = useState<Cruzada | null>(() => {
    const c = gerarCruzadas({ poco });
    if (c) marcarUsadas(c.entradas.map((e) => e.palavra));
    return c;
  });

  /** Casa → letra escrita. */
  const [valores, setValores] = useState<Record<number, string>>({});
  /** Casas reveladas pela ajuda: não se apagam. */
  const [dadas, setDadas] = useState<number[]>([]);
  const [conferido, setConferido] = useState(false);
  const [folha, setFolha] = useState<'dicas' | 'mais' | null>(null);
  const [ativa, setAtiva] = useState(0);
  const [passo, setPasso] = useState(0);

  if (!cruzada) {
    return (
      <div className="cw">
        <p className="aviso">Não deu para montar uma grade. Tente de novo.</p>
        <button type="button" className="btn" onClick={onNova}>
          Montar outra
        </button>
      </div>
    );
  }

  const entrada = cruzada.entradas[ativa];
  const casaAtiva = entrada.casas[Math.min(passo, entrada.casas.length - 1)];
  const naEntrada = new Set(entrada.casas);

  const completo = cruzada.casas.every(
    (c, i) => c.letra === null || valores[i] === c.letra,
  );

  function irPara(indice: number, posicao = 0) {
    setAtiva(indice);
    setPasso(posicao);
    setFolha(null);
  }

  /** Toca numa casa: entra nela, e tocar de novo vira a direção. */
  function tocarCasa(i: number) {
    if (cruzada!.casas[i].letra === null) return;
    const donas = cruzada!.entradas
      .map((e, k) => ({ e, k }))
      .filter(({ e }) => e.casas.includes(i));
    if (donas.length === 0) return;

    const atualTem = donas.some(({ k }) => k === ativa);
    const escolhida =
      atualTem && donas.length > 1
        ? (donas.find(({ k }) => k !== ativa) ?? donas[0])
        : (donas.find(({ e }) => e.dir === 'h') ?? donas[0]);

    setAtiva(escolhida.k);
    setPasso(escolhida.e.casas.indexOf(i));
  }

  /**
   * Escreve e leva o cursor para o próximo lugar que ainda precisa de letra.
   *
   * Pula as casas já preenchidas — numa palavra que cruza outra, metade das
   * casas costuma já ter letra, e parar em cada uma delas obriga a tocar duas
   * vezes para chegar onde falta. E quando a palavra fecha, **salta para a
   * próxima que ainda tem buraco**: sem isso o cursor encalha na última casa e
   * cada letra nova apaga a anterior, em silêncio.
   */
  function escrever(letra: string) {
    const novos = dadas.includes(casaAtiva)
      ? valores
      : { ...valores, [casaAtiva]: letra };

    if (novos !== valores) {
      setValores(novos);
      setConferido(false);
    }

    const vazia = entrada.casas.findIndex(
      (c, i) => i > passo && novos[c] === undefined,
    );
    if (vazia >= 0) {
      setPasso(vazia);
      return;
    }

    const total = cruzada!.entradas.length;
    for (let k = 1; k <= total; k++) {
      const prox = cruzada!.entradas[(ativa + k) % total];
      const buraco = prox.casas.findIndex((c) => novos[c] === undefined);
      if (buraco >= 0) {
        setAtiva((ativa + k) % total);
        setPasso(buraco);
        return;
      }
    }

    // Nada mais a preencher: o cursor fica onde está.
    setPasso(Math.min(passo + 1, entrada.casas.length - 1));
  }

  function apagar() {
    setConferido(false);
    if (valores[casaAtiva] !== undefined && !dadas.includes(casaAtiva)) {
      setValores((v) => {
        const copia = { ...v };
        delete copia[casaAtiva];
        return copia;
      });
      return;
    }
    const anterior = Math.max(0, passo - 1);
    const casaAnterior = entrada.casas[anterior];
    setPasso(anterior);
    if (!dadas.includes(casaAnterior)) {
      setValores((v) => {
        const copia = { ...v };
        delete copia[casaAnterior];
        return copia;
      });
    }
  }

  /** Revela a casa da vez — ou a primeira vazia da palavra, se esta já tem letra. */
  function revelarLetra() {
    const alvo = valores[casaAtiva] === undefined
      ? casaAtiva
      : (entrada.casas.find((c) => valores[c] === undefined) ?? casaAtiva);
    const certa = cruzada!.casas[alvo].letra;
    if (!certa) return;
    setValores((v) => ({ ...v, [alvo]: certa }));
    setDadas((d) => (d.includes(alvo) ? d : [...d, alvo]));
    setConferido(false);
  }

  function revelarTudo() {
    const todas: Record<number, string> = {};
    cruzada!.casas.forEach((c, i) => {
      if (c.letra) todas[i] = c.letra;
    });
    setValores(todas);
    setDadas(Object.keys(todas).map(Number));
    setConferido(false);
    setFolha(null);
  }

  function limpar() {
    setValores({});
    setDadas([]);
    setConferido(false);
    setFolha(null);
  }

  function classeDaCasa(i: number, casa: Cruzada['casas'][number]): string {
    if (casa.letra === null) return 'cw__casa cw__casa--preta';
    const base = ['cw__casa'];
    if (i === casaAtiva) base.push('cw__casa--ativa');
    else if (naEntrada.has(i)) base.push('cw__casa--linha');
    if (dadas.includes(i)) base.push('cw__casa--dada');
    else if (conferido && valores[i] !== undefined) {
      base.push(valores[i] === casa.letra ? 'cw__casa--certa' : 'cw__casa--errada');
    }
    return base.join(' ');
  }

  const preenchidas = entrada.casas.filter((c) => valores[c] !== undefined).length;

  return (
    <div className="cw">
      <div className="cw__barra">
        <button
          type="button"
          className="cw__seta"
          aria-label="Palavra anterior"
          onClick={() => irPara((ativa - 1 + cruzada.entradas.length) % cruzada.entradas.length)}
        >
          ‹
        </button>

        <button
          type="button"
          className="cw__dica"
          onClick={() => setFolha('dicas')}
          aria-label="Ver todas as dicas"
        >
          <span className="cw__dica-num">
            {entrada.numero}
            {entrada.dir === 'h' ? '→' : '↓'} · {entrada.palavra.length} letras
          </span>
          <span className="cw__dica-texto">{entrada.dica}</span>
        </button>

        <button
          type="button"
          className="cw__seta"
          aria-label="Próxima palavra"
          onClick={() => irPara((ativa + 1) % cruzada.entradas.length)}
        >
          ›
        </button>
      </div>

      <div className="cw__caixa">
        <div
          className="cw__grade"
          style={
            {
              '--colunas': cruzada.colunas,
              '--linhas': cruzada.linhas,
            } as React.CSSProperties
          }
        >
          {cruzada.casas.map((casa, i) => (
            <div
              key={i}
              className={classeDaCasa(i, casa)}
              onClick={() => tocarCasa(i)}
              role={casa.letra ? 'button' : undefined}
              tabIndex={casa.letra ? 0 : undefined}
              aria-label={casa.letra ? `Linha ${Math.floor(i / cruzada.colunas) + 1}, coluna ${i % cruzada.colunas + 1}: ${valores[i] ?? 'vazia'}` : undefined}
              onKeyDown={(event) => {
                if (casa.letra && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  tocarCasa(i);
                }
              }}
            >
              {casa.numero ? <b className="cw__num">{casa.numero}</b> : null}
              {casa.letra ? <span>{valores[i] ?? ''}</span> : null}
            </div>
          ))}
        </div>
      </div>

      {completo ? (
        <p className="cw__fim">✅ Grade completa</p>
      ) : (
        <Teclado aoTocar={escrever} aoApagar={apagar} />
      )}

      <div className="cw__acoes">
        <button type="button" className="btn btn--ghost" onClick={revelarLetra}>
          🔠 Letra
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setConferido(true)}
          disabled={preenchidas === 0 && Object.keys(valores).length === 0}
        >
          Conferir
        </button>
        <button
          type="button"
          className="btn btn--ghost cw__mais"
          aria-label="Mais opções"
          onClick={() => setFolha('mais')}
        >
          ⋯
        </button>
      </div>

      {folha ? (
        <Folha
          titulo={folha === 'dicas' ? 'Todas as dicas' : 'Esta grade'}
          onFechar={() => setFolha(null)}
        >
          {folha === 'dicas' ? (
            <ListaDeDicas
              entradas={cruzada.entradas}
              ativa={ativa}
              resolvida={(e) => e.casas.every((c) => valores[c] === cruzada.casas[c].letra)}
              onEscolher={irPara}
            />
          ) : (
            <div className="folha__opcoes">
              <button type="button" className="btn btn--ghost" onClick={limpar}>
                🧽 Limpar tudo
              </button>
              <button type="button" className="btn btn--ghost" onClick={revelarTudo}>
                👁️ Revelar tudo
              </button>
              <button type="button" className="btn" onClick={onNova}>
                🔁 Montar outra grade
              </button>
            </div>
          )}
        </Folha>
      ) : null}
    </div>
  );
}

function ListaDeDicas({
  entradas,
  ativa,
  resolvida,
  onEscolher,
}: {
  entradas: EntradaCruzada[];
  ativa: number;
  resolvida: (e: EntradaCruzada) => boolean;
  onEscolher: (i: number) => void;
}) {
  const grupos: { titulo: string; dir: 'h' | 'v' }[] = [
    { titulo: 'Horizontais →', dir: 'h' },
    { titulo: 'Verticais ↓', dir: 'v' },
  ];

  return (
    <>
      {grupos.map(({ titulo, dir }) => (
        <section key={dir} className="folha__grupo">
          <h3 className="folha__titulo">{titulo}</h3>
          {entradas.map((e, i) =>
            e.dir !== dir ? null : (
              <button
                key={i}
                type="button"
                className={
                  i === ativa
                    ? 'folha__dica folha__dica--ativa'
                    : resolvida(e)
                      ? 'folha__dica folha__dica--feita'
                      : 'folha__dica'
                }
                onClick={() => onEscolher(i)}
              >
                <b>{e.numero}.</b> {e.dica}{' '}
                <span className="folha__tam">{e.palavra.length} letras</span>
              </button>
            ),
          )}
        </section>
      ))}
    </>
  );
}

/**
 * A folha que sobe por cima da grade.
 *
 * Cobre a tela em vez de empurrar o conteúdo: a grade fica onde estava, e
 * fechar devolve exatamente o que havia antes.
 */
function Folha({
  titulo,
  onFechar,
  children,
}: {
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog ref={dialogRef} className="folha" aria-label={titulo} onCancel={onFechar}>
      <button
        type="button"
        className="folha__fundo"
        aria-label="Fechar"
        onClick={onFechar}
      />
      <div className="folha__painel">
        <div className="folha__cabeca">
          <b>{titulo}</b>
          <button type="button" className="folha__fechar" onClick={onFechar}>
            Fechar
          </button>
        </div>
        <div className="folha__corpo">{children}</div>
      </div>
    </dialog>
  );
}
