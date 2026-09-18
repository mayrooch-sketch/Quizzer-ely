/**
 * A home — os dezoito jogos, nos quatro grupos do app.
 *
 * Cada bloco é um cartão e cada jogo é um link de verdade (`<Link>`, não um
 * `<button>` que navega): dá para abrir em outra aba, o navegador mostra o
 * destino, e o teclado percorre na ordem.
 *
 * O estado do banco aparece aqui e em nenhum outro lugar. É a única tela que
 * todo mundo vê antes de jogar, e avisar em cada jogo repetiria a mesma frase
 * dezoito vezes.
 */

import { Link } from 'react-router-dom';
import { JOGOS_POR_GRUPO, caminhoDoJogo } from './games';
import { useAppStore } from './store';

function EstadoDoBanco() {
  const carregando = useAppStore((s) => s.carregando);
  const erro = useAppStore((s) => s.erro);
  const perguntas = useAppStore((s) => s.banco.perguntas.length);
  const knows = useAppStore((s) => s.banco.knows.length);
  const trechos = useAppStore((s) => s.banco.trechos.length);
  const buscarAgora = useAppStore((s) => s.buscarAgora);

  if (carregando) {
    return <p className="aviso">Baixando as perguntas…</p>;
  }

  if (erro) {
    return (
      <div className="aviso aviso--erro">
        <p style={{ margin: '0 0 var(--sp-12)' }}>{erro}</p>
        <button type="button" className="btn" onClick={() => void buscarAgora()}>
          Tentar de novo
        </button>
      </div>
    );
  }

  /*
   * Com banco na mão a tela não diz nada.
   *
   * "3516 perguntas carregadas" é a contagem que só interessa a quem escreveu
   * o carregador; quem abre o app quer escolher um jogo. O número aparece só
   * quando falta alguma coisa.
   */
  if (perguntas === 0 && knows === 0 && trechos === 0) {
    return <p className="aviso">Nenhuma pergunta disponível ainda.</p>;
  }

  return null;
}

export function HomeScreen() {
  return (
    <>
      <EstadoDoBanco />

      {JOGOS_POR_GRUPO.map(({ grupo, titulo, emoji, jogos }) => (
        <section className="card" key={grupo} data-grupo={grupo}>
          <div className="card__head">
            <span aria-hidden="true">{emoji}</span>
            <span>{titulo}</span>
          </div>
          <div className="card__body">
            <div className="home__tiles">
              {jogos.map((jogo) => (
                <Link className="tile" key={jogo.id} to={caminhoDoJogo(jogo.id)}>
                  <span className="tile__emoji" aria-hidden="true">
                    {jogo.emoji}
                  </span>
                  <span className="tile__label">{jogo.label}</span>
                  <span className="tile__desc">{jogo.descricao}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
