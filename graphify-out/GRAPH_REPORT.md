# Graph Report - quizzer-ts  (2026-09-26)

## Corpus Check
- 94 files · ~147,234 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: .css 13, (none) 5, .cmd 2)

## Summary
- 623 nodes · 1418 edges · 36 communities (28 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea75270c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gerarCaca.ts
- routes.tsx
- DinamicoScreen.tsx
- package.json
- auditar-banco.mjs
- normalize.ts
- games.ts
- compilerOptions
- EmbaralhadoScreen.tsx
- compilerOptions
- .oxlintrc.json
- tsconfig.json
- sw.js
- What You Must Do When Invoked
- Auditoria do Quizzer — 26/09/2026
- ContraRelogioScreen.tsx
- Teclado.tsx
- poco.ts
- graphify reference: extra exports and benchmark
- estudo.test.tsx
- gerarCruzadas.ts
- MemoriaScreen.tsx
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
- knip.json
- BingoScreen.tsx
- Estudo e partidas — plano de implementação
- PalavraDoBanco

## God Nodes (most connected - your core abstractions)
1. `react` - 34 edges
2. `useBaralho()` - 27 edges
3. `usePlacar()` - 27 edges
4. `PalavraDoBanco` - 23 edges
5. `usePocoDePalavras()` - 18 edges
6. `compilerOptions` - 18 edges
7. `useSessao()` - 16 edges
8. `useItensDoTipo()` - 16 edges
9. `compilerOptions` - 15 edges
10. `usePerguntas()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Interpreter guard for subcommands` --references--> `add()`  [INFERRED]
  .codex/skills/graphify/SKILL.md → scripts/auditar-banco.mjs
- `Como o código está organizado` --references--> `JogoId`  [INFERRED]
  README.md → src/app/games.ts
- `compatibilidade` --calls--> `palavraJogavel()`  [EXTRACTED]
  scripts/auditar-banco.mjs → src/shared/validation/palavra.ts
- `knows()` --calls--> `normalizeKnows()`  [EXTRACTED]
  tests/auditoria.test.tsx → src/shared/validation/normalize.ts
- `EstadoDoBanco()` --calls--> `useAppStore`  [EXTRACTED]
  src/app/HomeScreen.tsx → src/app/store.ts

## Import Cycles
- None detected.

## Communities (36 total, 8 thin omitted)

### Community 0 - "gerarCaca.ts"
Cohesion: 0.16
Nodes (19): Tabuleiro(), aoDescer(), aoMover(), aoSubir(), celulaDoPonto(), concluir(), Caca, caminhoEntre() (+11 more)

### Community 1 - "routes.tsx"
Cohesion: 0.06
Nodes (46): react, TELAS, useTrechos(), AssociationScreen(), CORES, embaralharEstavel(), Ligacao, ClozeScreen() (+38 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.07
Nodes (43): Desafio, RodadaAmigos(), src_jogos_competitivo_dinamico, DinamicoScreen(), julgar(), proximaRodada(), rolar(), sortearItem() (+35 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (40): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, jsdom, oxlint (+32 more)

### Community 4 - "auditar-banco.mjs"
Cohesion: 0.08
Nodes (24): Interpreter guard for subcommands, ref_node_crypto, ref_node_fs, ref_node_path, achados, add(), args, campos() (+16 more)

### Community 5 - "normalize.ts"
Cohesion: 0.09
Nodes (54): @testing-library/react, vitest, amostra, categorias, knows, knowsBruto, perguntas, porTipo (+46 more)

### Community 6 - "games.ts"
Cohesion: 0.11
Nodes (20): Ao publicar uma versão nova, Como o código está organizado, Desenvolver, Funciona sem internet, O banco de perguntas, Quizzer, Subir no Netlify, AppShell() (+12 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "EmbaralhadoScreen.tsx"
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
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents) (+15 more)

### Community 14 - "Auditoria do Quizzer — 26/09/2026"
Cohesion: 0.20
Nodes (9): Alterações no app, Arquivos de código alterados, Auditoria do Quizzer — 26/09/2026, Compatibilidade final por jogo, Correções no JSON, Duplicatas e revisão manual, Escopo e limite da entrega, Validações preventivas (+1 more)

### Community 15 - "ContraRelogioScreen.tsx"
Cohesion: 0.18
Nodes (12): usePerguntas(), Alternativas(), Props, ContraRelogioScreen(), Fase, gravarRecorde(), lerRecorde(), src_jogos_quiz_quiz (+4 more)

### Community 16 - "Teclado.tsx"
Cohesion: 0.33
Nodes (5): Props, Teclado(), FILAS, LETRAS, POSICAO

### Community 17 - "poco.ts"
Cohesion: 0.21
Nodes (9): AmigosScreen(), CruzadasScreen(), PropsTabuleiro, Cruzada, EntradaCruzada, BingoScreen(), extrairPalavras(), usePocoDePalavras() (+1 more)

### Community 18 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 19 - "estudo.test.tsx"
Cohesion: 0.19
Nodes (21): react-router-dom, Contexto, ContextoSessao, src_shared_estudo_estudo, Favoritar(), chave(), Conteudo, conteudoDe() (+13 more)

### Community 20 - "gerarCruzadas.ts"
Cohesion: 0.25
Nodes (12): cabe(), Casa, cruzar(), Direcao, embaralhar(), escrever(), gerarCruzadas(), Grade (+4 more)

### Community 21 - "MemoriaScreen.tsx"
Cohesion: 0.29
Nodes (9): Carta, embaralhar(), gravarRecorde(), lerRecorde(), MemoriaScreen(), Mesa(), virar(), montarCartas() (+1 more)

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

### Community 33 - "BingoScreen.tsx"
Cohesion: 0.36
Nodes (6): Cartela(), embaralhar(), espalhar(), LINHAS, montarPartida(), marcarUsadas()

### Community 35 - "PalavraDoBanco"
Cohesion: 0.25
Nodes (8): PropsRodada, PropsTabuleiro, OpcoesCruzada, Posta, FilaDePalavras, Chamada, Partida, PalavraDoBanco

## Knowledge Gaps
- **201 isolated node(s):** `Escopo e limite da entrega`, `Alterações no app`, `Correções no JSON`, `Compatibilidade final por jogo`, `Duplicatas e revisão manual` (+196 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 272 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `BingoScreen.tsx`, `DinamicoScreen.tsx`, `package.json`, `games.ts`, `EmbaralhadoScreen.tsx`, `ContraRelogioScreen.tsx`, `poco.ts`, `estudo.test.tsx`, `MemoriaScreen.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `Interpreter guard for subcommands` connect `auditar-banco.mjs` to `What You Must Do When Invoked`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `Escopo e limite da entrega`, `Alterações no app`, `Correções no JSON` to the rest of the system?**
  _201 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06441947565543071 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06704260651629072 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `auditar-banco.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.08262108262108261 - nodes in this community are weakly interconnected._