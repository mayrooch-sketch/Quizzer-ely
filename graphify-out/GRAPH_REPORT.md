# Graph Report - quizzer-ts  (2026-09-24)

## Corpus Check
- 76 files · ~46,180 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .css 12, (none) 5, .cmd 2)

## Summary
- 554 nodes · 1181 edges · 33 communities (26 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41c0ff8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gerarCaca.ts
- routes.tsx
- DinamicoScreen.tsx
- package.json
- Rodada
- normalize.ts
- games.ts
- compilerOptions
- biblioteca.ts
- compilerOptions
- .oxlintrc.json
- tsconfig.json
- sw.js
- What You Must Do When Invoked
- ContraRelogioScreen.tsx
- poco.ts
- gerarCruzadas.ts
- MemoriaScreen.tsx
- graphify reference: extra exports and benchmark
- CacaPalavrasScreen.tsx
- BingoScreen.tsx
- Tabuleiro
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

## God Nodes (most connected - your core abstractions)
1. `react` - 28 edges
2. `usePlacar()` - 27 edges
3. `useBaralho()` - 26 edges
4. `PalavraDoBanco` - 20 edges
5. `compilerOptions` - 18 edges
6. `useItensDoTipo()` - 16 edges
7. `usePocoDePalavras()` - 16 edges
8. `compilerOptions` - 15 edges
9. `DinamicoScreen()` - 14 edges
10. `Arena()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Como o código está organizado` --references--> `JogoId`  [INFERRED]
  README.md → src/app/games.ts
- `EstadoDoBanco()` --calls--> `useAppStore`  [EXTRACTED]
  src/app/HomeScreen.tsx → src/app/store.ts
- `PropsTabuleiro` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/CacaPalavrasScreen.tsx → src/shared/palavras/poco.ts
- `AppShell()` --calls--> `useAppStore`  [EXTRACTED]
  src/app/AppShell.tsx → src/app/store.ts
- `AppState` --references--> `Banco`  [EXTRACTED]
  src/app/store.ts → src/shared/types/bank.ts

## Import Cycles
- None detected.

## Communities (33 total, 7 thin omitted)

### Community 0 - "gerarCaca.ts"
Cohesion: 0.17
Nodes (16): Colocada, DIAGONAIS, Direcao, embaralhar(), encher(), gerarCaca(), OpcoesCaca, posicoesPossiveis() (+8 more)

### Community 1 - "routes.tsx"
Cohesion: 0.08
Nodes (39): react, TELAS, AssociationScreen(), CORES, embaralharEstavel(), Ligacao, ClozeScreen(), src_jogos_conhecimento_conhecimento (+31 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.07
Nodes (49): @testing-library/react, vitest, AppState, useAppStore, useKnows(), usePerguntas(), useTrechos(), src_jogos_competitivo_dinamico (+41 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, jsdom, oxlint (+27 more)

### Community 4 - "Rodada"
Cohesion: 0.16
Nodes (9): revelarNoAnagrama(), Rodada(), pedirAjuda(), Props, Teclado(), FILAS, LETRAS, ordemDeTeclado() (+1 more)

### Community 5 - "normalize.ts"
Cohesion: 0.10
Nodes (43): amostra, categorias, knows, knowsBruto, perguntas, porTipo, quizBruto, buscarDaRede() (+35 more)

### Community 6 - "games.ts"
Cohesion: 0.08
Nodes (25): Ao publicar uma versão nova, Como o código está organizado, Desenvolver, Funciona sem internet, O banco de perguntas, Quizzer, Subir no Netlify, react-dom (+17 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "biblioteca.ts"
Cohesion: 0.09
Nodes (38): src_jogos_embaralhado_embaralhado, Rodada(), conferir(), criarPecas(), embaralhar(), ordemEstaCorreta(), PecaDePalavra, tokenizar() (+30 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "ContraRelogioScreen.tsx"
Cohesion: 0.16
Nodes (13): Alternativas(), Props, ContraRelogioScreen(), Fase, gravarRecorde(), lerRecorde(), src_jogos_quiz_quiz, QuizCategoriaScreen() (+5 more)

### Community 15 - "poco.ts"
Cohesion: 0.22
Nodes (10): CruzadasScreen(), PropsTabuleiro, Cruzada, EntradaCruzada, BingoScreen(), extrairPalavras(), letrasDaResposta(), semAcento() (+2 more)

### Community 16 - "gerarCruzadas.ts"
Cohesion: 0.23
Nodes (12): cabe(), Casa, cruzar(), Direcao, embaralhar(), escrever(), gerarCruzadas(), Grade (+4 more)

### Community 17 - "MemoriaScreen.tsx"
Cohesion: 0.29
Nodes (9): Carta, embaralhar(), gravarRecorde(), lerRecorde(), MemoriaScreen(), Mesa(), virar(), montarCartas() (+1 more)

### Community 18 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 19 - "CacaPalavrasScreen.tsx"
Cohesion: 0.27
Nodes (9): CacaPalavrasScreen(), alternarDiagonais(), escolherTamanho(), FONTE_DA_CELULA, gravar(), ler(), PropsTabuleiro, Caca (+1 more)

### Community 20 - "BingoScreen.tsx"
Cohesion: 0.31
Nodes (7): Cartela(), Chamada, embaralhar(), espalhar(), LINHAS, montarPartida(), marcarUsadas()

### Community 21 - "Tabuleiro"
Cohesion: 0.42
Nodes (8): Tabuleiro(), aoDescer(), aoMover(), aoSubir(), celulaDoPonto(), concluir(), caminhoEntre(), palavraNoCaminho()

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

## Knowledge Gaps
- **175 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+170 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 240 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `DinamicoScreen.tsx`, `package.json`, `games.ts`, `biblioteca.ts`, `ContraRelogioScreen.tsx`, `poco.ts`, `MemoriaScreen.tsx`, `CacaPalavrasScreen.tsx`, `BingoScreen.tsx`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `Tabuleiro()` connect `Tabuleiro` to `gerarCruzadas.ts`, `BingoScreen.tsx`, `poco.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _175 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07518796992481203 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0670762928827445 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `normalize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09898242368177614 - nodes in this community are weakly interconnected._