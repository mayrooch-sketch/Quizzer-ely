# Estudo e partidas — plano de implementação

1. Sessão individual: Finalizar sempre disponível, sem depender do fim do banco. Encerramento desmonta o jogo e seus temporizadores. Resumo informa resultados, ajudas e assuntos com erros; itens não respondidos não viram erros. Nova partida começa zerada.
2. Revisão: erros salvos apenas no aparelho, identificados por jogo e item. Revisão por cartões de pergunta/resposta, com autoavaliação explícita. Dois acertos consecutivos sem ajuda retiram o item; erro reinicia a sequência. Resumo permite revisar somente os erros da sessão.
3. Favoritos: selecionar conteúdos do banco e copiar uma coleção legível com pergunta/trecho, resposta, explicação e referência disponível. Sem envio externo. Se copiar falhar, oferecer texto selecionável. Retirar favoritos não altera o banco.
4. Dificuldade: escolhida antes de começar, travada na sessão. Fácil reduz alternativas nos jogos de resposta única e libera mais pistas; difícil limita dicas. Mecânicas sem variação ficam explicitamente identificadas, sem inventar dificuldade editorial. Resultados distinguem dificuldade e ajuda.
5. Entre amigos: configuração de rodadas, segundos e modos; alternância entre dois times, veredito sempre manual, cronômetro apenas auxiliar. Resumo final ou encerramento antecipado; desfazer último resultado antes do próximo desafio.
6. Persistência: localStorage validado e tolerante a indisponibilidade; mensagem quando dados não puderem ser conservados. Nenhuma pergunta embutida e nenhuma alteração no Firebase.
7. Verificação: testes de persistência/modelo, sessões, cópia, revisão e rodada moderada, lint, build e inspeção visual responsiva.

O jogo “Qual não pertence?” não será implementado.

## Entrega e verificação

Implementados os itens 1 a 5. Sessão com encerramento antecipado nos 16 jogos individuais; revisão por cartões com autoavaliação; favoritos com texto selecionável e cópia; dificuldade mecânica nos modos descritos na abertura; encontro configurável com os 10 modos de desafio do Dinâmico, exceto passa-a-vez. O encontro preserva julgamento manual e aceita encerramento antecipado.

34 testes passaram, incluindo persistência, falha de clipboard, revisão, resumo antecipado, dificuldade e encontro. Lint sem avisos e build de produção aprovado. No navegador, verificados início/finalização dos 16 jogos em 320×568 sem transbordamento horizontal, cópia de favorito, revisão removida após dois acertos e encontro encerrado após uma rodada. Não equivale a percorrer todas as perguntas do banco.

Nenhum conteúdo bíblico foi criado ou alterado, nenhum upload ao Firebase foi feito. Erros/favoritos ficam neste navegador; copiar é a forma de levar os favoritos para outro aplicativo. O resumo é da sessão atual, não um histórico permanente. Nos jogos sem variação de dificuldade, as opções próprias são preservadas e isso é informado antes da partida.
