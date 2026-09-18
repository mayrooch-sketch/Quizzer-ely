# Quizzer

Dezesseis jogos bíblicos, feitos para jogar no celular com amigos.

Reescrita em TypeScript do app original — um arquivo `index.html` de 7394
linhas. O motivo da reescrita foi manutenção, não recursos novos: os jogos são
os mesmos, o banco é o mesmo, e as decisões de cada tela estão registradas em
`decisoes-quizzer.md`.

## Subir no Netlify

O app é estático. Não há servidor, nem build no Netlify, nem variável de
ambiente para configurar.

```bash
npm install
npm run build
```

Isso gera a pasta **`dist/`**. Arraste **a pasta `dist`** (não a pasta do
projeto) para o Netlify em <https://app.netlify.com/drop>, ou use o campo de
deploy manual de um site existente.

Dentro de `dist` já vão os dois arquivos que o Netlify lê sozinho:

- **`_redirects`** — manda qualquer endereço para o `index.html`. Sem ele,
  abrir `/jogo/forca` direto, ou recarregar a página no meio de uma partida,
  daria 404.
- **`_headers`** — guarda os arquivos de `/assets` para sempre (o nome deles
  tem o hash do conteúdo) e impede que o `index.html` fique guardado, que é o
  que faria um deploy novo demorar dias para chegar em quem já usou.

### Ao publicar uma versão nova

Rode `npm run build` de novo e suba a `dist` inteira. Quem já tem o app aberto
recebe a versão nova no próximo carregamento — o service worker busca o
`index.html` na rede antes de olhar o cache, exatamente para isso.

## O banco de perguntas

Vem do Firebase Realtime Database, por REST, **somente leitura**:

```
https://quizzer-ely-default-rtdb.firebaseio.com
```

O app não escreve nada e não usa o SDK do Firebase — são três `fetch`. Na
primeira visita ele baixa e guarda no `localStorage`; nas seguintes abre com o
que está guardado e confere a versão (`banco/_meta/version`) em segundo plano.
Se a versão mudou, baixa de novo.

Trocar de banco é trocar a constante `BASE` em
[`src/shared/data/bancoLoader.ts`](src/shared/data/bancoLoader.ts).

## Funciona sem internet

Depois da primeira visita, o app abre e joga offline: a casca fica no cache do
service worker ([`public/sw.js`](public/sw.js)) e o banco no `localStorage`.
Dá para instalar na tela inicial do celular — o `manifest.webmanifest` está
pronto e os ícones também.

## Desenvolver

```bash
npm run dev      # servidor de desenvolvimento na porta 5174
npm run build    # tsc -b && vite build
npm run preview  # serve a pasta dist, para conferir a versão de produção
npm run lint     # oxlint
```

O service worker **só é registrado em produção**: em desenvolvimento ele
serviria do cache o arquivo que acabou de ser editado.

## Como o código está organizado

```
src/
  app/          casca, rotas, catálogo de jogos, estado global
  jogos/
    quiz/         múltipla escolha (categoria, contra o relógio, competitivo)
    conhecimento/ os seis modos do banco Knows
    palavras/     anagrama, forca, caça-palavras, cruzadas
    tabuleiro/    memória, bingo
    competitivo/  dinâmico competitivo
  shared/
    types/        os tipos do banco — união discriminada por `type`
    validation/   normalizadores tolerantes (aceitam o legado, não rejeitam)
    data/         carga do banco, cache primeiro
    jogo/         a arena, o baralho, o placar, a mesa dos times
    palavras/     o poço de palavras, a memória curta, o teclado QWERTY
```

Três lugares valem conhecer antes de mexer:

- **[`src/app/games.ts`](src/app/games.ts)** é o catálogo, e é fonte única: a
  home, as rotas e o título do cabeçalho saem todos daí. No app antigo eram
  três listas separadas, e esquecer uma só aparecia clicando.
- **[`src/app/routes.tsx`](src/app/routes.tsx)** tem um `Record` completo de
  `JogoId` para tela. Acrescentar um jogo ao catálogo sem escrever a tela dele
  **não compila**.
- **[`src/shared/jogo/Arena.tsx`](src/shared/jogo/Arena.tsx)** é a casca de
  toda partida: enunciado parado no alto, miolo rolando no meio, ações presas
  embaixo. Mexer no espaçamento dos botões é uma linha, dezesseis telas.
