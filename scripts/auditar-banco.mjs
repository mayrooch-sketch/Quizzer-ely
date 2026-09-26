// Não altera o banco. Node 24: node scripts/auditar-banco.mjs [origem] [destino] [--strict]
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { palavraJogavel } from '../src/shared/validation/palavra.ts';
const args = process.argv.slice(2).filter(a => a !== '--strict');
const origem = resolve(args[0] ?? '../quizzer-ely-default-rtdb-export.json');
const destino = resolve(args[1] ?? 'auditoria');
if (resolve(destino, 'resultado.json') === origem) throw new Error('O relatório não pode substituir o banco.');
const texto = readFileSync(origem, 'utf8');
const banco = JSON.parse(texto).banco;
const quiz = banco.quiz.bank.questions, knows = banco.knows.items, trechos = banco.trechos.items;
if (![quiz, knows, trechos, banco.quiz.bank.perguntas].every(Array.isArray)) throw new Error('Estrutura inválida: esperadas as listas quiz, knows e trechos.');
const chave = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const achados = [], registros = [];
const add = (tipo, caminho, id, detalhe, gravidade = 'revisao') => achados.push({ tipo, caminho, id, detalhe, gravidade });
function campos(v, path, id) {
  if (typeof v === 'string') {
    if (v !== v.trim() || /[\t\u00a0\u200b-\u200d\ufeff]| {2,}/.test(v)) add('espacos_ou_invisiveis',path,id,v);
    if (/\ufffd|Ã[£§©¡µ]|â€/.test(v)) add('possivel_codificacao',path,id,v);
  } else if(v && typeof v === 'object') for(const [k,x] of Object.entries(v)) campos(x,path+'/'+k,id);
}
function duplicados(lista, key, tipo) {
  const grupos=new Map();
  for(const r of lista) { const k=key(r); if(k) grupos.set(k,[...(grupos.get(k)??[]),r.id]); }
  return [...grupos].filter(([,ids])=>ids.length>1).map(([conteudo,ids])=>({tipo,conteudo,ids}));
}
for(const [tipo,lista] of [['quiz',quiz],['knows',knows],['trechos',trechos]]) for(const [i,r] of lista.entries()) {
  const path=`banco/${tipo}/${tipo==='quiz'?'bank/questions':'items'}/${i}`;
  registros.push({tipo,id:r.id,caminho:path}); campos(r,path,r.id);
  const aviso=(t,d,g)=>add(t,path,r.id,d,g);
  if (r.revisaoPendente === true) aviso('revisao_pendente',r.motivoRevisao);
  if(!r.id) aviso('id_ausente','', 'erro');
  if(!(r.referencia??r.reference)) aviso('referencia_ausente','Conferir fonte');
  if(tipo==='quiz') {
    const opts=['A','B','C','D'].map(k=>r[k]), resposta=r[r.correta];
    if(!r.pergunta || !opts.every(x=>typeof x==='string'&&x.trim()) || !['A','B','C','D'].includes(r.correta)) aviso('quiz_invalido',r,'erro');
    if(new Set(opts.map(chave)).size!==4) aviso('alternativas_repetidas',opts,'erro');
    if(!r.categoria) aviso('categoria_ausente','');
    if(/^(de|da|do|das|dos|a|o|as|os|em|na|no|nas|nos|para|por|com|um|uma|pelo|pela)\s/i.test(resposta??'')) aviso('resposta_com_prefixo',{pergunta:r.pergunta,resposta});
    if(/\s/.test(resposta??'')) aviso('resposta_composta',{pergunta:r.pergunta,resposta});
    if(String(resposta).length>45) aviso('resposta_longa',resposta);
    if(chave(resposta).length>3 && (' '+chave(r.pergunta)+' ').includes(' '+chave(resposta)+' ')) aviso('enunciado_contem_resposta',{pergunta:r.pergunta,resposta});
  } else if(tipo==='knows') {
    const p=r.payload??{}, choices=p.choices??[];
    if(!['vf','cloze','select','association','order','whoami'].includes(r.type)) aviso('tipo_desconhecido',r.type,'erro');
    if(r.type==='vf' && (!p.statement||typeof p.correct!=='boolean')) aviso('vf_invalido',p,'erro');
    if(['cloze','whoami'].includes(r.type)) {
      if(!p.answer || choices.length<2 || !choices.includes(p.answer) || new Set(choices.map(chave)).size!==choices.length) aviso('opcoes_invalidas',p,'erro');
      if(r.type==='cloze'&&!/_{2,}|\{\{.*?\}\}/.test(p.sentence??'')) aviso('lacuna_ausente',p.sentence);
      if(r.type==='whoami'&&!p.hints?.length) aviso('pistas_ausentes',p,'erro');
      if(r.type==='whoami' && /^(Um |Uma )/.test(p.answer ?? '')) aviso('identidade_generica',p);
      if(r.type==='whoami' && choices.some(c => /ilustração/i.test(c))) aviso('alternativa_de_ilustracao',p);
      if(r.type==='whoami'&&p.hints?.some(h=>chave(p.answer).length>3&&(' '+chave(h)+' ').includes(' '+chave(p.answer)+' '))) aviso('pista_contem_resposta',p);
    }
    if(r.type==='select') {
      const opts=p.options??[], certas=opts.filter(o=>o.correct===true).length;
      if(opts.length<2 || !certas || certas===opts.length || opts.some(o=>typeof o.correct!=='boolean'||!o.text) || new Set(opts.map(o=>chave(o.text))).size!==opts.length) aviso('select_invalido',p,'erro');
      if((p.min_correct!=null&&p.min_correct!==certas)||(p.max_correct!=null&&p.max_correct!==certas)) aviso('limites_select',{certas,min:p.min_correct,max:p.max_correct});
    }
    if(r.type==='association') {
      const pairs=p.pairs??[];
      if(pairs.length<2||pairs.some(p=>!p.left||!p.right)) aviso('pares_invalidos',p,'erro');
      for(const lado of ['left','right']) if(new Set(pairs.map(p=>chave(p[lado]))).size!==pairs.length) aviso('associacao_ambigua',{lado,pairs},'erro');
    }
    if(r.type==='order') {
      const items=p.items??[], ts=items.map(i=>typeof i==='string'?i:i.text), ordens=items.filter(i=>typeof i==='object').map(i=>i.order);
      if(items.length<2||ts.some(t=>!t)||new Set(ts.map(chave)).size!==items.length) aviso('ordem_invalida',p,'erro');
      if(new Set(ordens).size!==ordens.length) aviso('ordem_empatada',p,'erro');
    }
  } else if(!r.trecho||!r.referencia||!Array.isArray(r.temas)) aviso('trecho_invalido',r,'erro');
}
const duplicatas=[...duplicados(quiz,q=>chave(q.pergunta),'enunciado_quiz'),...duplicados(knows,q=>q.type+':'+chave(JSON.stringify(q.payload)),'payload_knows'),...duplicados(trechos,q=>chave(q.trecho),'texto_trecho')];
const idsRepetidos=duplicados(registros,r=>r.tipo+':'+r.id,'id');
const similares=[], tokens=quiz.map(q=>new Set(chave(q.pergunta).split(' ')));
for(let i=0;i<quiz.length;i++) for(let j=i+1;j<quiz.length;j++) {
  if(chave(quiz[i].pergunta)===chave(quiz[j].pergunta)) continue;
  const inter=[...tokens[i]].filter(t=>tokens[j].has(t)).length, score=inter/(tokens[i].size+tokens[j].size-inter);
  if(score>=0.82) similares.push({ids:[quiz[i].id,quiz[j].id],similaridade:score,perguntas:[quiz[i].pergunta,quiz[j].pergunta],respostas:[quiz[i][quiz[i].correta],quiz[j][quiz[j].correta]]});
}
const limites={'caca-palavras':10,cruzadas:10,anagrama:10,forca:12,bingo:12,memoria:12,'dinamico-palavras':12,'amigos-palavras':12};
const compatibilidade=Object.fromEntries(Object.entries(limites).map(([g,max])=>{
  const validas=quiz.filter(q=>palavraJogavel(q[q.correta]??'',max));
  return [g,{base:'quiz',limiteLetras:max,elegiveis:validas.length,palavrasUnicas:new Set(validas.map(q=>palavraJogavel(q[q.correta],max))).size,incompativeis:quiz.length-validas.length,idsIncompativeis:quiz.filter(q=>!palavraJogavel(q[q.correta]??'',max)).map(q=>q.id)}];
}));
for (const tipo of ['association','cloze','order','select','vf','whoami']) {
  const itens=knows.filter(r=>r.type===tipo), pendentes=itens.filter(r=>r.revisaoPendente===true);
  compatibilidade[tipo]={base:'knows/'+tipo,elegiveis:itens.length-pendentes.length,incompativeis:pendentes.length,idsIncompativeis:pendentes.map(r=>r.id)};
}
for (const game of ['quiz-categoria','quiz-competitivo','contra-relogio']) compatibilidade[game]={base:'quiz',elegiveis:quiz.length,incompativeis:0,idsIncompativeis:[]};
for (const game of ['encontre-referencia','texto-embaralhado']) compatibilidade[game]={base:'trechos',elegiveis:trechos.length,incompativeis:0,idsIncompativeis:[]};
const resumo={origem,sha256:createHash('sha256').update(texto).digest('hex'),totalRegistros:registros.length,quiz:quiz.length,knows:knows.length,trechos:trechos.length,copiasQuizIguais:JSON.stringify(quiz)===JSON.stringify(banco.quiz.bank.perguntas),duplicatasGrupos:duplicatas.length,duplicatasExcedentes:duplicatas.reduce((s,g)=>s+g.ids.length-1,0),idsRepetidos,similares:similares.length,achadosPorTipo:achados.reduce((a,r)=>(a[r.tipo]=(a[r.tipo]??0)+1,a),{}),errosEstruturais:achados.filter(a=>a.gravidade==='erro').length,compatibilidade};
mkdirSync(destino,{recursive:true});
writeFileSync(resolve(destino,'resultado.json'),JSON.stringify({resumo,duplicatas,similares,achados,registros},null,2)+'\n');
console.log(JSON.stringify({...resumo,compatibilidade:Object.fromEntries(Object.entries(compatibilidade).map(([k,{idsIncompativeis: _ids,...v}])=>[k,v]))},null,2));
if(process.argv.includes('--strict')&&(resumo.errosEstruturais||idsRepetidos.length||!resumo.copiasQuizIguais)) process.exitCode=1;
