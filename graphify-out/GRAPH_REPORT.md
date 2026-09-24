# Graph Report - quizzer-ts  (2026-09-24)

## Corpus Check
- 86 files · ~50,231 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: .css 13, (none) 5, .cmd 2)

## Summary
- 597 nodes · 1395 edges · 35 communities (27 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `774592b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CacaPalavrasScreen.tsx
- routes.tsx
- DinamicoScreen.tsx
- package.json
- Rodada
- normalize.ts
- useAppStore
- compilerOptions
- biblioteca.ts
- compilerOptions
- .oxlintrc.json
- tsconfig.json
- sw.js
- What You Must Do When Invoked
- useFilaDePalavras.ts
- ForcaScreen.tsx
- CruzadasScreen.tsx
- MemoriaScreen.tsx
- graphify reference: extra exports and benchmark
- estudo.test.tsx
- PalavraDoBanco
- poco.ts
- Tabuleiro
- Revisão dos jogos — 23/09/2026
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md
- preparar-limites.mjs
- Tabuleiro
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
- `Colocada` --inherits--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCaca.ts → src/shared/palavras/poco.ts
- `FilaDePalavras` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/useFilaDePalavras.ts → src/shared/palavras/poco.ts
- `Carta` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/tabuleiro/MemoriaScreen.tsx → src/shared/palavras/poco.ts

## Import Cycles
- None detected.

## Communities (35 total, 8 thin omitted)

### Community 0 - "CacaPalavrasScreen.tsx"
Cohesion: 0.14
Nodes (20): CacaPalavrasScreen(), alternarDiagonais(), escolherTamanho(), FONTE_DA_CELULA, gravar(), ler(), PropsTabuleiro, Caca (+12 more)

### Community 1 - "routes.tsx"
Cohesion: 0.07
Nodes (51): react, TELAS, usePerguntas(), useTrechos(), AssociationScreen(), CORES, embaralharEstavel(), Ligacao (+43 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.07
Nodes (46): useKnows(), AmigosScreen(), Desafio, RodadaAmigos(), src_jogos_competitivo_dinamico, DinamicoScreen(), julgar(), proximaRodada() (+38 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (40): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, jsdom, oxlint (+32 more)

### Community 4 - "Rodada"
Cohesion: 0.16
Nodes (9): vitest, revelarNoAnagrama(), Rodada(), pedirAjuda(), embaralharLetras(), FILAS, LETRAS, ordemDeTeclado() (+1 more)

### Community 5 - "normalize.ts"
Cohesion: 0.10
Nodes (46): amostra, categorias, knows, knowsBruto, perguntas, porTipo, quizBruto, AppState (+38 more)

### Community 6 - "useAppStore"
Cohesion: 0.11
Nodes (21): Ao publicar uma versão nova, Como o código está organizado, Desenvolver, Funciona sem internet, O banco de perguntas, Quizzer, Subir no Netlify, AppShell() (+13 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "biblioteca.ts"
Cohesion: 0.10
Nodes (35): src_jogos_embaralhado_embaralhado, Rodada(), conferir(), criarPecas(), embaralhar(), ordemEstaCorreta(), PecaDePalavra, tokenizar() (+27 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "useFilaDePalavras.ts"
Cohesion: 0.33
Nodes (7): embaralhar(), FilaDePalavras, useFilaDePalavras(), foiUsadaAgoraPouco(), marcarUsadas(), priorizarNovas(), recentes

### Community 15 - "ForcaScreen.tsx"
Cohesion: 0.25
Nodes (5): PropsRodada, Rodada(), src_jogos_palavras_palavras, Props, Teclado()

### Community 16 - "CruzadasScreen.tsx"
Cohesion: 0.23
Nodes (11): cabe(), Casa, Cruzada, cruzar(), Direcao, embaralhar(), EntradaCruzada, escrever() (+3 more)

### Community 17 - "MemoriaScreen.tsx"
Cohesion: 0.33
Nodes (8): Carta, embaralhar(), gravarRecorde(), lerRecorde(), Mesa(), virar(), montarCartas(), src_jogos_tabuleiro_tabuleiro

### Community 18 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 19 - "estudo.test.tsx"
Cohesion: 0.18
Nodes (22): react-router-dom, Contexto, ContextoSessao, src_shared_estudo_estudo, Favoritar(), chave(), Conteudo, conteudoDe() (+14 more)

### Community 20 - "PalavraDoBanco"
Cohesion: 0.21
Nodes (11): OpcoesCaca, OpcoesCruzada, Posta, Cartela(), Chamada, embaralhar(), espalhar(), LINHAS (+3 more)

### Community 21 - "poco.ts"
Cohesion: 0.29
Nodes (9): CruzadasScreen(), PropsTabuleiro, BingoScreen(), MemoriaScreen(), extrairPalavras(), letrasDaResposta(), semAcento(), usePocoDePalavras() (+1 more)

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

### Community 32 - "preparar-limites.mjs"
Cohesion: 0.29
Nodes (6): ref_node_fs, ref_node_path, banco, caminho, limites, linhas

### Community 33 - "Tabuleiro"
Cohesion: 0.42
Nodes (8): Tabuleiro(), aoDescer(), aoMover(), aoSubir(), celulaDoPonto(), concluir(), caminhoEntre(), palavraNoCaminho()

## Knowledge Gaps
- **176 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 246 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `CacaPalavrasScreen.tsx`, `DinamicoScreen.tsx`, `package.json`, `useAppStore`, `biblioteca.ts`, `useFilaDePalavras.ts`, `ForcaScreen.tsx`, `CruzadasScreen.tsx`, `MemoriaScreen.tsx`, `estudo.test.tsx`, `PalavraDoBanco`, `poco.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `useSessao()` connect `routes.tsx` to `CacaPalavrasScreen.tsx`, `Tabuleiro`, `Rodada`, `CruzadasScreen.tsx`, `MemoriaScreen.tsx`, `PalavraDoBanco`, `Tabuleiro`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CacaPalavrasScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06685366993922394 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06830601092896176 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._