# Graph Report - quizzer-ts  (2026-09-25)

## Corpus Check
- 87 files · ~50,109 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: .css 13, (none) 5, .cmd 2)

## Summary
- 599 nodes · 1396 edges · 34 communities (26 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a57ced5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gerarCaca.ts
- react
- DinamicoScreen.tsx
- package.json
- poco.ts
- normalize.ts
- routes.tsx
- compilerOptions
- biblioteca.ts
- compilerOptions
- .oxlintrc.json
- tsconfig.json
- sw.js
- What You Must Do When Invoked
- CacaPalavrasScreen.tsx
- gerarCruzadas.ts
- AnagramaScreen.tsx
- Tabuleiro
- graphify reference: extra exports and benchmark
- estudo.test.tsx
- PalavraDoBanco
- Tabuleiro
- MemoriaScreen.tsx
- Revisão dos jogos — 23/09/2026
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- knip.json
- Estudo e partidas — plano de implementação

## God Nodes (most connected - your core abstractions)
1. `react` - 34 edges
2. `usePlacar()` - 28 edges
3. `useBaralho()` - 27 edges
4. `PalavraDoBanco` - 23 edges
5. `useSessao()` - 22 edges
6. `usePocoDePalavras()` - 18 edges
7. `compilerOptions` - 18 edges
8. `useItensDoTipo()` - 16 edges
9. `compilerOptions` - 15 edges
10. `usePerguntas()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Como o código está organizado` --references--> `JogoId`  [INFERRED]
  README.md → src/app/games.ts
- `PropsTabuleiro` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/CacaPalavrasScreen.tsx → src/shared/palavras/poco.ts
- `FilaDePalavras` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/useFilaDePalavras.ts → src/shared/palavras/poco.ts
- `EstadoDoBanco()` --calls--> `useAppStore`  [EXTRACTED]
  src/app/HomeScreen.tsx → src/app/store.ts
- `SemItens()` --calls--> `useAppStore`  [EXTRACTED]
  src/jogos/conhecimento/SemItens.tsx → src/app/store.ts

## Import Cycles
- None detected.

## Communities (34 total, 8 thin omitted)

### Community 0 - "gerarCaca.ts"
Cohesion: 0.23
Nodes (12): DIAGONAIS, Direcao, embaralhar(), encher(), gerarCaca(), posicoesPossiveis(), RETAS, sortear() (+4 more)

### Community 1 - "react"
Cohesion: 0.07
Nodes (42): react, usePerguntas(), useTrechos(), AssociationScreen(), CORES, embaralharEstavel(), Ligacao, ClozeScreen() (+34 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.07
Nodes (45): useKnows(), Desafio, RodadaAmigos(), src_jogos_competitivo_dinamico, DinamicoScreen(), julgar(), proximaRodada(), rolar() (+37 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (36): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, jsdom, oxlint (+28 more)

### Community 4 - "poco.ts"
Cohesion: 0.17
Nodes (13): AmigosScreen(), CruzadasScreen(), PropsTabuleiro, Cruzada, EntradaCruzada, src_jogos_palavras_palavras, BingoScreen(), MemoriaScreen() (+5 more)

### Community 5 - "normalize.ts"
Cohesion: 0.07
Nodes (56): ref_node_fs, ref_node_path, amostra, categorias, knows, knowsBruto, perguntas, porTipo (+48 more)

### Community 6 - "routes.tsx"
Cohesion: 0.10
Nodes (27): Ao publicar uma versão nova, Como o código está organizado, Desenvolver, Funciona sem internet, O banco de perguntas, Quizzer, Subir no Netlify, react-dom (+19 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "biblioteca.ts"
Cohesion: 0.09
Nodes (36): src_jogos_embaralhado_embaralhado, Rodada(), conferir(), criarPecas(), embaralhar(), ordemEstaCorreta(), PecaDePalavra, tokenizar() (+28 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "CacaPalavrasScreen.tsx"
Cohesion: 0.27
Nodes (9): CacaPalavrasScreen(), alternarDiagonais(), escolherTamanho(), FONTE_DA_CELULA, gravar(), ler(), PropsTabuleiro, Caca (+1 more)

### Community 15 - "gerarCruzadas.ts"
Cohesion: 0.36
Nodes (9): cabe(), Casa, cruzar(), Direcao, embaralhar(), escrever(), gerarCruzadas(), Grade (+1 more)

### Community 16 - "AnagramaScreen.tsx"
Cohesion: 0.10
Nodes (19): vitest, revelarNoAnagrama(), AnagramaScreen(), PropsRodada, Rodada(), pedirAjuda(), ForcaScreen(), PropsRodada (+11 more)

### Community 17 - "Tabuleiro"
Cohesion: 0.42
Nodes (8): Tabuleiro(), aoDescer(), aoMover(), aoSubir(), celulaDoPonto(), concluir(), caminhoEntre(), palavraNoCaminho()

### Community 18 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 19 - "estudo.test.tsx"
Cohesion: 0.19
Nodes (21): Contexto, ContextoSessao, src_shared_estudo_estudo, Favoritar(), chave(), Conteudo, conteudoDe(), lerSalvos() (+13 more)

### Community 20 - "PalavraDoBanco"
Cohesion: 0.16
Nodes (14): Colocada, OpcoesCaca, OpcoesCruzada, Posta, Cartela(), Chamada, embaralhar(), espalhar() (+6 more)

### Community 22 - "MemoriaScreen.tsx"
Cohesion: 0.43
Nodes (7): embaralhar(), gravarRecorde(), lerRecorde(), Mesa(), virar(), montarCartas(), marcarUsadas()

### Community 23 - "Revisão dos jogos — 23/09/2026"
Cohesion: 0.25
Nodes (7): Banco publicado, Correções e verificação por jogo, Implementação de regras e consulta — 24/09/2026, Pendências identificadas em 23/09 (situação anterior à implementação abaixo), Revisão de layout, Revisão dos jogos — 23/09/2026, Verificação automatizada

### Community 24 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 25 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 26 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 27 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 32 - "knip.json"
Cohesion: 0.50
Nodes (3): entry, project, $schema

## Knowledge Gaps
- **178 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `$schema` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 247 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DinamicoScreen.tsx`, `package.json`, `poco.ts`, `routes.tsx`, `biblioteca.ts`, `CacaPalavrasScreen.tsx`, `AnagramaScreen.tsx`, `estudo.test.tsx`, `PalavraDoBanco`, `MemoriaScreen.tsx`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `useSessao()` connect `react` to `poco.ts`, `biblioteca.ts`, `CacaPalavrasScreen.tsx`, `AnagramaScreen.tsx`, `Tabuleiro`, `PalavraDoBanco`, `Tabuleiro`, `MemoriaScreen.tsx`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0716651610960554 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06949152542372881 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Should `normalize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07219662058371736 - nodes in this community are weakly interconnected._