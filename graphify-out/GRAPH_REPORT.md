# Graph Report - quizzer-ts  (2026-09-18)

## Corpus Check
- 70 files · ~43,945 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .css 12, (none) 5, .cmd 2)

## Summary
- 525 nodes · 1075 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ca42f314`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CacaPalavrasScreen.tsx
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
- poco.ts
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- extraction-spec.md

## God Nodes (most connected - your core abstractions)
1. `react` - 27 edges
2. `usePlacar()` - 27 edges
3. `useBaralho()` - 24 edges
4. `PalavraDoBanco` - 20 edges
5. `compilerOptions` - 18 edges
6. `usePocoDePalavras()` - 16 edges
7. `compilerOptions` - 15 edges
8. `useItensDoTipo()` - 14 edges
9. `Arena()` - 13 edges
10. `usePerguntas()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Como o código está organizado` --references--> `JogoId`  [INFERRED]
  README.md → src/app/games.ts
- `PropsTabuleiro` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/CacaPalavrasScreen.tsx → src/shared/palavras/poco.ts
- `Colocada` --inherits--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCaca.ts → src/shared/palavras/poco.ts
- `OpcoesCaca` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCaca.ts → src/shared/palavras/poco.ts
- `EstadoDoBanco()` --calls--> `useAppStore`  [EXTRACTED]
  src/app/HomeScreen.tsx → src/app/store.ts

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "CacaPalavrasScreen.tsx"
Cohesion: 0.11
Nodes (29): CacaPalavrasScreen(), alternarDiagonais(), escolherTamanho(), FONTE_DA_CELULA, gravar(), ler(), PropsTabuleiro, Tabuleiro() (+21 more)

### Community 1 - "routes.tsx"
Cohesion: 0.07
Nodes (41): react, TELAS, AssociationScreen(), CORES, embaralharEstavel(), Ligacao, ClozeScreen(), src_jogos_conhecimento_conhecimento (+33 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.08
Nodes (40): useKnows(), usePerguntas(), src_jogos_competitivo_dinamico, DinamicoScreen(), julgar(), proximaRodada(), rolar(), sortearItem() (+32 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, oxlint, @types/node (+25 more)

### Community 4 - "Rodada"
Cohesion: 0.20
Nodes (6): Rodada(), embaralharLetras(), FILAS, LETRAS, ordemDeTeclado(), POSICAO

### Community 5 - "normalize.ts"
Cohesion: 0.09
Nodes (49): ref_node_fs, amostra, categorias, knows, knowsBruto, perguntas, porTipo, quizBruto (+41 more)

### Community 6 - "games.ts"
Cohesion: 0.09
Nodes (26): Ao publicar uma versão nova, Como o código está organizado, Desenvolver, Funciona sem internet, O banco de perguntas, Quizzer, Subir no Netlify, react-dom (+18 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "biblioteca.ts"
Cohesion: 0.09
Nodes (37): src_jogos_embaralhado_embaralhado, Rodada(), conferir(), criarPecas(), embaralhar(), ordemEstaCorreta(), PecaDePalavra, tokenizar() (+29 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 13 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 14 - "poco.ts"
Cohesion: 0.05
Nodes (50): CruzadasScreen(), PropsTabuleiro, Tabuleiro(), ForcaScreen(), PropsRodada, Rodada(), cabe(), Casa (+42 more)

### Community 18 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

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

## Knowledge Gaps
- **161 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 227 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `CacaPalavrasScreen.tsx`, `DinamicoScreen.tsx`, `package.json`, `games.ts`, `biblioteca.ts`, `poco.ts`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CacaPalavrasScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10887096774193548 - nodes in this community are weakly interconnected._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06962025316455696 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07591836734693877 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `normalize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0861952861952862 - nodes in this community are weakly interconnected._