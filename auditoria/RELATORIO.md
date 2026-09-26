# Auditoria do Quizzer — 26/09/2026

## Escopo e limite da entrega

Auditoria técnica executada sobre **3.620 registros**: 1.177 perguntas de quiz, 2.340 exercícios Knows e 103 trechos. As duas listas do quiz, `questions` e `perguntas`, são cópias idênticas e não foram contadas duas vezes. Todos passaram pela varredura estrutural; os registros ativos passaram também pelos normalizadores reais do app.

**A conferência bíblica e editorial individual de todos os 3.620 registros não está concluída.** A análise automatizada não certifica exatidão, contexto, português ou unicidade de interpretação. Foram examinados os achados, as respostas distintas de Quem sou eu e os 103 trechos; casos duvidosos foram preservados. Não interpretar “zero erros estruturais” como “zero erros de conteúdo”.

## Alterações no app

- Home sem os dois atalhos superiores. Os 18 jogos continuam disponíveis.
- Favoritos/revisão continuam acessíveis no resumo da partida; cópia de favoritos continua dentro dos jogos.
- Entre amigos continua acessível em **Dinâmico competitivo → Outras formas de jogar**, sem destaque na home. Configurações ficam em uma seção opcional; os padrões permitem começar diretamente.
- Removida a tela genérica de dificuldade antes dos jogos individuais, junto com código e testes exclusivos dos níveis removidos. Preservadas as ajudas durante o jogo.
- Caça-palavras: 10×10, até oito palavras, horizontal/vertical, sem seletores nem preferências antigas de tamanho/diagonal. Bancos menores podem fornecer menos palavras, a partir de duas.
- Preservados a escolha de categoria (define o assunto), o início do cronômetro (não consome tempo sem consentimento) e os controles do moderador.
- Uma resposta composta nunca é concatenada para virar palavra. A elegibilidade é compartilhada, derivada automaticamente, sem controles novos.
- Cache revalidado antes do uso; leituras de rede têm limite de 15 segundos.
- Embaralhado apresenta recuperação quando faltam quatro fontes de palavras intrusas, em vez de derrubar a tela.

## Correções no JSON

Arquivo: `../quizzer-ely-default-rtdb-export.json`. Backup completo: `../quizzer-ely-default-rtdb-export.backup-auditoria-20260926.json`.

**80 registros alterados, sem exclusões e com IDs e ordem preservados:**

- **62 perguntas de quiz**: 31 com ajustes de enunciado/alternativas e 32 com padronização de categoria; uma pergunta pertence aos dois grupos. As duas cópias foram sincronizadas.
- **17 exercícios Knows**: dois com a grafia “Júniass” corrigida para “Júnias”; 15 marcados `revisaoPendente: true` por não individualizarem uma pessoa. Permanecem no JSON, com motivo, mas não entram nos sorteios.
- **Um trecho**: corrigidas as aspas da fala em Mateus 26:15, sem alterar palavras ou referência.
- Versão de publicação preparada de 4 para 5. Nada enviado ao Firebase.

Exemplos de reformulação: Brandura, Nazaré, Cesareia, Candelabro, Carcereiro, Soldado, Denário e Terraço. Perguntas e alternativas foram ajustadas juntas. “Personagens” foi unificado com “Personagens bíblicos”; “Reis”, com “Reis e governantes”. Outras categorias não equivalentes foram preservadas.

O histórico campo a campo está em [alteracoes.json](alteracoes.json). As propostas textuais estão em [correcoes-quiz.json](correcoes-quiz.json).

## Compatibilidade final por jogo

Contagens por base de origem, não sobre a soma de formatos incompatíveis por definição. “Incompatível” com palavras não significa pergunta errada nem removida do quiz. Repetições da mesma resposta são reunidas no poço.

| Jogo/base | Registros elegíveis | Fora desse formato | Palavras únicas |
|---|---:|---:|---:|
| Caça-palavras | 797 | 380 | 381 |
| Anagrama | 797 | 380 | 381 |
| Cruzadas | 797 | 380 | 381 |
| Forca | 806 | 371 | 388 |
| Bingo | 806 | 371 | 388 |
| Memória | 806 | 371 | 388 |
| Dinâmico/Entre amigos — desafios de palavras | 806 | 371 | 388 |
| Quiz por categoria/Quiz competitivo/Contra o relógio | 1.177 cada | 0 estrutural | — |
| Associação | 447 | 0 estrutural | — |
| Complete a frase | 316 | 0 estrutural | — |
| Ordem | 393 | 0 estrutural | — |
| Marque os corretos | 297 | 0 estrutural | — |
| Verdadeiro ou falso | 479 | 0 estrutural | — |
| Quem sou eu | 393 | 15 pendentes | — |
| Encontre a referência/Texto embaralhado | 103 cada | 0 estrutural | — |

Antes das correções, com **a mesma regra de palavra única**, havia 360 palavras de até 10 letras e 367 de até 12. Ganho: **21 palavras únicas** em cada faixa, sem concatenar expressões. Não comparar diretamente com contagens antigas que aceitavam nomes compostos.

## Duplicatas e revisão manual

Dois pares de exercícios com payload repetido, preservados para decisão editorial:

- `clz_028` / `clz_301`: mesma frase para completar com “servo”.
- `clz_057` / `clz_080`: mesma frase para completar com “Deus”.

Não há IDs repetidos. Três pares de quiz tiveram alta similaridade textual, mas **não foram considerados duplicatas**: diferenciam origem/destino, primeira/segunda praga ou primeira/terceira tentação.

Pendências prioritárias:

- 15 registros de Quem sou eu: `who_225`, `who_228`, `who_251`, `who_256`, `who_341`, `who_365`, `who_376`, `who_384`, `who_391`, `who_399`, `who_402`, `who_433`, `who_434`, `who_435`, `who_439`. Exigem identificar uma pessoa inequívoca e rever alternativas, sem inferir identidade não informada no relato. Quatro incluem alternativas de ilustrações.
- 63 respostas ainda começam com artigo/preposição; 310 são compostas; quatro ultrapassam 45 caracteres. Estes grupos se sobrepõem e incluem respostas válidas para quiz: **não são 377 erros confirmados**. A lista completa, com pergunta, resposta, ID e caminho, está em `resultado.json`.
- 11 enunciados contêm texto semelhante à resposta. Há falsos positivos, como “Parã” versus “para”, nomes presentes em referências e perguntas sobre autoria. Revisar especialmente `q_411` (o enunciado contém “carne”) e `q_886` (formulação potencialmente ambígua sobre transmissão da mensagem).
- Vários trechos são fragmentos curtos ou referências compostas. Rever se cada fragmento identifica inequivocamente a referência exigida; não substituir a citação por paráfrase.
- Continuar a conferência factual individual dos demais exercícios, especialmente cronologia, pistas genéricas e alternativas semanticamente equivalentes. A varredura não detecta todos esses casos.

## Validações preventivas

- Palavra deve ser uma unidade só de letras; acentos/cedilha são convertidos para A–Z apenas depois da elegibilidade. Espaços internos, hífen, apóstrofo, números e pontuação não são apagados para fabricar uma palavra.
- Quiz rejeita alternativas vazias/repetidas e chave correta inválida.
- Verdadeiro/falso rejeita booleano desconhecido/ausente em vez de assumir falso.
- Select rejeita opções inválidas/repetidas e deriva a quantidade de acertos dos próprios dados.
- Cloze exige lacuna e resposta entre opções distintas; Quem sou eu exige resposta nas opções, pistas e não estar pendente de revisão.
- Associação rejeita pares incompletos/ambíguos; Ordem rejeita textos repetidos e posições empatadas.
- Validações aplicadas na rede e no cache.
- `npm run audit:bank -- --strict`: varredura de todas as listas, IDs, duplicatas, espaços, campos e compatibilidade. Gera `auditoria/resultado.json`; não altera o banco. Requer Node 24. O modo estrito falha para erros estruturais, IDs repetidos ou divergência entre cópias do quiz, mas não transforma avisos editoriais em proibições.
- O script é um diagnóstico; os testes com o JSON local exercitam também a implementação real dos normalizadores. O JSON não é embutido no bundle.

## Verificação de jogos e interface

Os 18 destinos foram abertos no navegador sem tela de erro. Caça-palavras verificado visualmente em 375×667, com consulta da pergunta/referência sem alterar o contador. Bingo também verificado nessa largura. Foi preservado o controle pelo moderador nos competitivos.

Cobertura automatizada: **44 testes**, incluindo normalização, cache corrompido, início direto, finalização/reinício, favoritos, pistas, pontuação de portas, desfazer resultados, base insuficiente e **30 grades geradas com o banco local real**. Build, lint, Knip e `git diff --check` aprovados.

O navegador usou o código local e o banco ainda publicado. A validação das alterações do JSON foi feita pelos testes locais; não foi publicado o JSON apenas para obter uma captura. A abertura das telas não equivale a uma partida completa de cada jogo ou a teste em aparelhos físicos.

## Arquivos de código alterados

`package.json`; `scripts/auditar-banco.mjs` (novo); `src/app/HomeScreen.tsx`; `src/jogos/competitivo/AmigosScreen.tsx`; `src/jogos/competitivo/DinamicoScreen.tsx`; `src/jogos/conhecimento/ClozeScreen.tsx`; `src/jogos/conhecimento/WhoAmIScreen.tsx`; `src/jogos/embaralhado/EmbaralhadoScreen.tsx`; `src/jogos/palavras/AnagramaScreen.tsx`; `src/jogos/palavras/CacaPalavrasScreen.tsx`; `src/jogos/palavras/gerarCaca.ts`; `src/jogos/palavras/palavras.css`; `src/jogos/quiz/Alternativas.tsx`; `src/jogos/referencia/ReferenciaScreen.tsx`; `src/shared/data/bancoLoader.ts`; `src/shared/estudo/Sessao.tsx`; `src/shared/estudo/contexto.ts`; `src/shared/estudo/modelo.ts`; `src/shared/palavras/poco.ts`; `src/shared/validation/normalize.ts`; `src/shared/validation/palavra.ts` (novo); `tests/auditoria.test.tsx` (novo); `tests/estudo.test.tsx`; `tests/jogabilidade.test.tsx`; `tests/trechos.test.ts`.

Removido `src/shared/estudo/dificuldade.ts`. Relatórios e grafo Graphify atualizados separadamente. Sem commit, push ou upload nesta entrega.
