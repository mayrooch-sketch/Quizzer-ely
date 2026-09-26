// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { existsSync, readFileSync } from 'node:fs';
import { normalizeKnows, normalizeQuiz, normalizeTrechos } from '../src/shared/validation/normalize';
import { palavraJogavel } from '../src/shared/validation/palavra';
import { carregarDoCache } from '../src/shared/data/bancoLoader';
import { HomeScreen } from '../src/app/HomeScreen';
import { Sessao } from '../src/shared/estudo/Sessao';
import { CacaPalavrasScreen } from '../src/jogos/palavras/CacaPalavrasScreen';
import { useAppStore } from '../src/app/store';
import { BANCO_VAZIO } from '../src/shared/types/bank';
import { gerarCaca } from '../src/jogos/palavras/gerarCaca';
import { extrairPalavras } from '../src/shared/palavras/poco';
import { EmbaralhadoScreen } from '../src/jogos/embaralhado/EmbaralhadoScreen';

afterEach(() => { cleanup(); localStorage.clear(); });
it('não sorteia registros pendentes de revisão', () => {
  expect(normalizeKnows({items:[{id:'pendente',type:'whoami',revisaoPendente:true,payload:{answer:'Pessoa',choices:['Pessoa','Outra'],hints:['Pista']}}]})).toEqual([]);
});
it('base insuficiente no Embaralhado oferece recuperação sem derrubar a tela', () => {
  const trechos=normalizeTrechos({items:[{id:'t',trecho:'Uma frase de teste.',referencia:'Mateus 6:10',temas:[1]}]});
  useAppStore.setState({banco:{...BANCO_VAZIO,trechos}});
  render(<EmbaralhadoScreen />);
  expect(screen.getByText(/Não há textos diferentes suficientes/)).toBeTruthy();
  expect(screen.getByRole('button',{name:'Tentar outro trecho'})).toBeTruthy();
});
const q={id:'q',pergunta:'Qual é a resposta?',A:'Brandura',B:'Pressa',C:'Suspeita',D:'Severidade',correta:'A',categoria:'Teste'};
const knows=(type:string,payload:unknown)=>normalizeKnows({items:[{id:'k',type,payload}]});

it('não concatena compostos nem remove pontuação para fabricar palavras',()=>{
  for(const s of ['De brandura','Mar Vermelho','Bem-sucedido',"D’Ávila",'João 3','Sim/não','fé!','de\u200bbrandura','para']) expect(palavraJogavel(s,20)).toBeNull();
  expect(palavraJogavel('  brandura  ',10)).toBe('BRANDURA');
  expect(palavraJogavel('Bênção',10)).toBe('BENCAO');
  expect(palavraJogavel('Be\u0302nc\u0327a\u0303o',10)).toBe('BENCAO');
  expect(palavraJogavel('Brandura',7)).toBeNull();
});
it('não converte booleano ausente ou desconhecido em falso',()=>{
  for(const correct of [undefined,'talvez',2,null]) expect(knows('vf',{statement:'Teste',correct})).toHaveLength(0);
  for(const correct of [false,'false',0,'não']) expect(knows('vf',{statement:'Teste',correct})[0]).toMatchObject({payload:{correct:false}});
});
it('rejeita alternativas repetidas, lacunas ausentes e respostas fora das opções',()=>{
  expect(normalizeQuiz({questions:[{...q,B:'brandura'}]})).toHaveLength(0);
  expect(knows('cloze',{sentence:'Frase sem lacuna',answer:'A',choices:['A','B']})).toHaveLength(0);
  expect(knows('cloze',{sentence:'Frase ___',answer:'C',choices:['A','B']})).toHaveLength(0);
  expect(knows('whoami',{hints:['Pista'],answer:'A',choices:['A','a']})).toHaveLength(0);
});
it('não aceita pares incompletos nem ordem empatada',()=>{
  expect(knows('association',{pairs:[{left:'A',right:'1'},{left:'B',right:'1'}]})).toHaveLength(0);
  expect(knows('order',{items:[{text:'A',order:1},{text:'B',order:1}]})).toHaveLength(0);
  expect(knows('order',{items:[{text:'A',order:1},{text:'B',order:3}]})).toHaveLength(1);
});
it('deriva quantidade correta no select e rejeita uma alternativa inválida',()=>{
  const options=[{text:'A',correct:true},{text:'B',correct:false}];
  expect(knows('select',{options,min_correct:0,max_correct:20})[0]).toMatchObject({payload:{minCorrect:1,maxCorrect:1}});
  expect(knows('select',{options:[...options,{text:'C'}]})).toHaveLength(0);
});
it('revalida o cache antigo sem quebrar com registros incompletos',()=>{
  localStorage.setItem('quizzer.banco.v1',JSON.stringify({perguntas:[{},...normalizeQuiz({questions:[q]})],knows:[{}],trechos:[{}],versao:'4'}));
  const {banco}=carregarDoCache();
  expect(banco.perguntas).toHaveLength(1); expect(banco.knows).toHaveLength(0); expect(banco.trechos).toHaveLength(0);
});
it('home prioriza os 18 jogos sem os dois atalhos superiores',()=>{
  useAppStore.setState({banco:BANCO_VAZIO,carregando:false,erro:null});
  render(<MemoryRouter><HomeScreen /></MemoryRouter>);
  expect(screen.getAllByRole('link')).toHaveLength(18);
  expect(screen.queryByRole('link',{name:'Meus erros e favoritos'})).toBeNull();
  expect(screen.queryByRole('link',{name:'Partida entre amigos'})).toBeNull();
});
it('caça-palavras inicia sem configurações e pode finalizar e reiniciar',()=>{
  const perguntas=normalizeQuiz({questions:['Sara','Marta','Maria','Abraão','Paulo','Pedro','Rute','Ester'].map((A,i)=>({...q,id:String(i),A}))});
  useAppStore.setState({banco:{...BANCO_VAZIO,perguntas}});
  render(<MemoryRouter><Sessao jogo="caca-palavras"><CacaPalavrasScreen /></Sessao></MemoryRouter>);
  expect(screen.queryByLabelText('Dificuldade')).toBeNull();
  expect(screen.queryByRole('button',{name:'Começar partida'})).toBeNull();
  expect(screen.getByLabelText('Grade de 10 por 10 letras')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'Finalizar partida'}));
  fireEvent.click(screen.getByRole('button',{name:'Nova partida'}));
  expect(screen.getByLabelText('Grade de 10 por 10 letras')).toBeTruthy();
});

const caminho='../quizzer-ely-default-rtdb-export.json';
it.skipIf(!existsSync(caminho))('banco local: todos os registros passam na leitura e 30 grades equilibradas são jogáveis',()=>{
  const {banco}=JSON.parse(readFileSync(caminho,'utf8'));
  const perguntas=normalizeQuiz(banco.quiz);
  expect(perguntas).toHaveLength(banco.quiz.bank.questions.length);
  expect(normalizeKnows(banco.knows)).toHaveLength(banco.knows.items.filter((r: { revisaoPendente?: boolean }) => r.revisaoPendente !== true).length);
  expect(normalizeTrechos(banco.trechos)).toHaveLength(banco.trechos.items.length);
  expect(banco.quiz.bank.questions).toEqual(banco.quiz.bank.perguntas);
  const poco=extrairPalavras(perguntas,10);
  for(let i=0;i<30;i++) {
    const grade=gerarCaca({tam:10,alvo:8,poco,diagonais:false});
    expect(grade?.palavras).toHaveLength(8);
    expect(grade!.soltas).toBeLessThanOrEqual(1);
    for(const p of grade!.palavras) expect(p.celulas.map(c=>grade!.letras[c]).join('')).toBe(p.palavra);
  }
},20000);
