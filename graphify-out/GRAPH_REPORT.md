# Graph Report - quizzer-ts  (2026-09-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 400 nodes · 876 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- poco.ts
- routes.tsx
- DinamicoScreen.tsx
- package.json
- CruzadasScreen.tsx
- normalize.ts
- store.ts
- compilerOptions
- ContraRelogioScreen.tsx
- compilerOptions
- .oxlintrc.json
- tsconfig.json
- sw.js

## God Nodes (most connected - your core abstractions)
1. `react` - 25 edges
2. `usePlacar()` - 23 edges
3. `PalavraDoBanco` - 20 edges
4. `useBaralho()` - 20 edges
5. `compilerOptions` - 18 edges
6. `usePocoDePalavras()` - 16 edges
7. `compilerOptions` - 15 edges
8. `useItensDoTipo()` - 14 edges
9. `AssociationScreen()` - 12 edges
10. `DinamicoScreen()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `PropsTabuleiro` --references--> `usePocoDePalavras()`  [EXTRACTED]
  src/jogos/palavras/CruzadasScreen.tsx → src/shared/palavras/poco.ts
- `PropsTabuleiro` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/CacaPalavrasScreen.tsx → src/shared/palavras/poco.ts
- `Colocada` --inherits--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCaca.ts → src/shared/palavras/poco.ts
- `OpcoesCaca` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCaca.ts → src/shared/palavras/poco.ts
- `OpcoesCruzada` --references--> `PalavraDoBanco`  [EXTRACTED]
  src/jogos/palavras/gerarCruzadas.ts → src/shared/palavras/poco.ts

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "poco.ts"
Cohesion: 0.06
Nodes (60): CacaPalavrasScreen(), alternarDiagonais(), escolherTamanho(), FONTE_DA_CELULA, gravar(), ler(), PropsTabuleiro, Tabuleiro() (+52 more)

### Community 1 - "routes.tsx"
Cohesion: 0.08
Nodes (33): react, TELAS, AssociationScreen(), CORES, embaralharEstavel(), Ligacao, ClozeScreen(), src_jogos_conhecimento_conhecimento (+25 more)

### Community 2 - "DinamicoScreen.tsx"
Cohesion: 0.07
Nodes (40): src_jogos_competitivo_dinamico, DinamicoScreen(), julgar(), proximaRodada(), rolar(), sortearItem(), tirarDaFila(), embaralhar() (+32 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (35): dependencies, react, react-dom, react-router-dom, zustand, devDependencies, oxlint, @types/node (+27 more)

### Community 4 - "CruzadasScreen.tsx"
Cohesion: 0.07
Nodes (21): Rodada(), PropsTabuleiro, Tabuleiro(), cabe(), Casa, Cruzada, cruzar(), Direcao (+13 more)

### Community 5 - "normalize.ts"
Cohesion: 0.13
Nodes (33): ref_node_fs, amostra, categorias, knows, knowsBruto, perguntas, porTipo, quizBruto (+25 more)

### Community 6 - "store.ts"
Cohesion: 0.11
Nodes (27): AppShell(), jogoDaRota(), caminhoDoJogo(), Grupo, GRUPO_INFO, GRUPOS, Jogo, JogoId (+19 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 8 - "ContraRelogioScreen.tsx"
Cohesion: 0.20
Nodes (12): usePerguntas(), Alternativas(), Props, ContraRelogioScreen(), Fase, gravarRecorde(), lerRecorde(), src_jogos_quiz_quiz (+4 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **106 isolated node(s):** `Direcao`, `Tamanho`, `Chamada`, `Carta`, `Ligacao` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 155 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `poco.ts`, `DinamicoScreen.tsx`, `package.json`, `CruzadasScreen.tsx`, `store.ts`, `ContraRelogioScreen.tsx`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `PalavraDoBanco` connect `poco.ts` to `routes.tsx`, `DinamicoScreen.tsx`, `CruzadasScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `Tabuleiro()` connect `CruzadasScreen.tsx` to `poco.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `Direcao`, `Tamanho`, `Chamada` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `poco.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `routes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Should `DinamicoScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07346938775510205 - nodes in this community are weakly interconnected._