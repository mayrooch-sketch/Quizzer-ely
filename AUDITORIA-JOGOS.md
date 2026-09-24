# Revisão dos jogos — 23/09/2026

Revisão do código dos 18 jogos, dos componentes compartilhados e dos fluxos principais no navegador local. As telas iniciais foram verificadas em 320×568, 375×667 e 1280×800. Isso não equivale a testar cada pergunta do banco ou todos os resultados aleatórios.

## Correções e verificação por jogo

| Jogo | Resultado da revisão |
| --- | --- |
| Quiz competitivo | A regra 12 agora tem uma segunda rolagem explícita para determinar os pontos, em vez de conceder sempre 12. Cronômetro em zero não oferece um início sem efeito; “Reiniciar” descreve o reset. Rolagem e passagem de turno verificadas. A regra 12 foi revisada no código, mas não saiu nas rodadas sorteadas no teste de interface. |
| Dinâmico competitivo | Mesmo ajuste no controle do cronômetro. Iniciar, pausar, reiniciar e passar a vez verificados. Os 11 modos internos foram lidos no código; não houve partida completa de cada um na interface. |
| Quiz por categoria | Resposta e nova rodada verificadas, inclusive na categoria com somente uma pergunta. Sem nova falha confirmada nesse fluxo. |
| Contra o relógio | Nova partida zera acertos/erros e avança a pergunta. Tempo baseado no horário final, sem conceder tempo extra quando a aba fica suspensa. Feedback automático não reinicia seu atraso a cada atualização do relógio. Empate não é novo recorde; encerramento antecipado mostra o tempo efetivo. Reinício com placar zerado reproduzido na interface. |
| Anagrama | A dica move a letra já utilizada quando necessário, sem criar uma cópia excedente. Teclas esgotadas ficam desativadas. Conclusão por dicas verificada; regressões de letras repetidas cobertas por testes. |
| Forca | Seis erros, revelação da resposta, bloqueio do teclado e nova rodada verificados. Sem nova falha confirmada nesse fluxo. |
| Caça-palavras | Cancelar o gesto cancela a seleção, em vez de concluir uma palavra involuntariamente. Tamanho salvo é limitado às três opções válidas. Seleção pelos dois extremos verificada com acerto no contador. |
| Palavras cruzadas | Casas acessíveis por teclado, com linha/coluna anunciadas. Menu usa diálogo modal nativo, com Escape e gestão de foco. Abertura e fechamento com Escape verificados. |
| Verdadeiro ou falso | Resposta, explicação, placar e próxima rodada verificados. Sem nova falha confirmada. |
| Marque os corretos | Alternativas embaralhadas uma vez por pergunta. Seleção, conferência, resposta correta e limpeza na próxima rodada verificadas. |
| Complete a frase | Alternativas embaralhadas uma vez por pergunta: antes os 316 itens colocavam a resposta correta na primeira posição. Resposta e avanço verificados. |
| Associação | Botão para consultar os pares corretos e retornar às ligações feitas, sem alterar o resultado. Fluxo de quatro ligações incorretas e consulta da correção verificado. |
| Quem sou eu? | Alternativas embaralhadas uma vez por pergunta: antes os 408 itens colocavam a resposta correta na primeira posição. Revelação de pista, média de pistas, resposta e avanço verificados. |
| Ordem | Consulta à sequência correta e retorno à tentativa. Setas com 44px de altura, lado a lado. Correção e placar preservado verificados. |
| Encontre a referência | Avanço usa o índice da etapa selecionada, evitando pular uma etapa se o mesmo evento for repetido antes da atualização. Percurso completo até capítulo e versículo verificado, com cada porta computada. |
| Texto embaralhado | Peças com o mesmo texto são intercambiáveis. Antes, 50 dos 103 trechos tinham palavras repetidas e podiam produzir falso erro. Peça duplicada e intrusa continuam rejeitadas. Uma frase completa foi montada e a referência foi revelada; regressão das palavras iguais coberta por teste. |
| Memória | Área de leitura com o texto integral das cartas abertas; tempo de leitura de um par errado ampliado para 3 segundos. Cartas fechadas não expõem seu conteúdo ao leitor de tela. Carta aberta e layout verificados. |
| Bingo | Controles ficam visualmente desativados durante o feedback, acompanhando o bloqueio que já existia na lógica. Resposta incorreta e bloqueio temporário verificados. |

O placar compartilhado agora anuncia acertos e erros. Explicações longas têm rolagem própria limitada para não expulsar todos os controles da tela; alternativas em duas colunas podem quebrar palavras longas. Não houve estouro horizontal nos 54 carregamentos de telas nem erro de console capturado.

## Banco publicado

Em 23/09/2026, o Firebase estava na versão 3 e o conteúdo de quiz, knows e trechos era idêntico ao JSON local da pasta anterior, comparado após ordenar as chaves dos objetos. O banco contém 408 itens de Quem sou eu, com 258 rótulos de resposta diferentes — isso não representa necessariamente 258 pessoas distintas, pois existem variantes de nomes. Nenhum texto bíblico ou pergunta foi alterado nesta revisão.

## Melhorias que ainda merecem uma próxima etapa

- **Referência:** o placar atual continua sendo acertos/erros, sem um placar numérico decrescente. Definir a fórmula de pontos por erro e por etapa antes de introduzir esse segundo indicador. Os distratores numéricos também devem respeitar os limites do livro/capítulo; hoje vêm de referências de outros trechos.
- **Quiz competitivo:** na soma 9, a tela ainda usa uma pergunta comum e deixa o mediador improvisar as pistas de Quem sou eu. Integrar os itens específicos desse jogo daria consistência à rodada.
- **Quem sou eu:** uma revisão editorial adicional deve consolidar variantes de nomes e avaliar respostas genéricas como “um dos…”; contagem por texto não equivale a personagens únicos. Não houve nova verificação doutrinária de todos os itens nesta rodada.
- **Baralhos:** ao terminar a lista, a sequência atual repete a mesma ordem. Melhorar a rotação e tratar atualização do banco durante uma partida, mantendo a pergunta e sua resposta sincronizadas.
- **Anagrama e Embaralhado:** comunicar claramente que o placar considera o primeiro resultado da rodada. Hoje corrigir depois de errar conclui o desafio, mas não acrescenta um acerto.
- **Caça-palavras:** oferecer seleção de extremos também pelo teclado. A interação por ponteiro funciona, mas a grade ainda não tem operação equivalente pelo teclado.
- **Memória:** permitir ao jogador escolher quanto tempo deseja para ler pares errados; três segundos podem continuar curtos para algumas pessoas.
- **Competitivos:** cronômetros pausáveis ainda descontam por execução do temporizador; aplicar a mesma precisão por horário absoluto usada no Contra o relógio, preservando pausa e retomada.

## Verificação automatizada

Testes de regras dos trechos e do Anagrama, análise estática e compilação de produção. Os testes acrescentados cobrem palavras repetidas visualmente idênticas, rejeição de peça duplicada e conservação das letras ao pedir dica.

## Revisão de layout

Revisão adicional em 23/09/2026: 18 telas de jogos nas resoluções 320×568, 667×375 e 1280×800 (54 carregamentos), com amostragem do conteúdo sorteado. Nenhum estouro horizontal ou área principal com altura zero foi detectado após os ajustes. Isso não substitui a revisão de todos os textos do banco.

- Cruzadas: altura mínima para impedir que a grade desapareça em telas baixas.
- Bingo: cartela preservada e texto maior; contraste reforçado nas casas completadas e nas respostas da Memória.
- Telas horizontais: rolagem vertical para manter opções e controles utilizáveis, em vez de comprimir a partida.
- Competitivos: regra em largura inteira abaixo dos dados no celular; conteúdo interno não é esmagado.
- Embaralhado: peças com altura mínima de toque de 44px.
- Referência: capítulos e versículos em duas colunas no celular, mantendo as etapas textuais em uma coluna.
- Menu inicial: cartões compactos em linha nas telas mais estreitas. Painéis de palavras limitados em largura no desktop e contraste dos textos secundários reforçado.

Menu modal conferido no desktop e menu inicial conferido em 320px. Análise estática e compilação de produção passaram. Sem alteração no banco de perguntas nesta revisão.
