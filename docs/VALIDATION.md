# Validação para a aula

Concluída na cópia local, branch `fix/classroom-readiness`, a partir de `3c80252`. Os 34 testes passaram: 9 verificações Node e 25 testes Playwright em Chromium, sem falhas, testes ignorados ou resultados instáveis. Uma verificação complementar do mesmo caso de fallback também passou com os controles de som e CRT ativados e suas APIs indisponíveis.

O resumo estruturado e os hashes dos arquivos estão em [validation-summary.json](validation-summary.json). O resultado completo do navegador está em `test-results/results.json`, com 36 capturas em `test-results/screenshots/`.

## Escopo

Central de jogos, perfil, seis medalhas, dez rodadas do Inspector, dez mensagens do Detector de Fakes, cinco turnos com onze contatos do Chat Patrol, seis missões de senha e seis cenários de privacidade.

Três agentes fizeram a revisão em leitura antes de editar. Cada executor ficou responsável por um conjunto exclusivo de arquivos; a suíte final é executada pelo orquestrador sobre a árvore integrada.

## Matriz de verificação

| Área | Resultado verificado |
| --- | --- |
| Perfil | Dados inválidos normalizados, reset sem alterar outras chaves, recordes preservados, seis medalhas consistentes e fallback com aviso dispensável |
| Inspector | Dez rodadas e 90 cartões concluídos, 900 pontos, resposta duplicada ignorada, revisita preservada, derrota na terceira falha e reinício limpo |
| Fakes | Dez mensagens concluídas, 100 pontos, avanço sem resposta bloqueado, derrota na terceira falha e reinício limpo |
| Chat | Cinco turnos, onze contatos, 42 etapas, 37 pistas, duas confirmações e 1015 pontos; pares repetidos/inválidos não pontuam; troca de contato limpa pistas; bloqueio imediato; retry e bfcache sem travamento |
| Jogos novos | Seis missões em cada jogo concluídas por teclado, 120 pontos em cada, correção reduz pontos sem duplicação, três erros encerram e replay preserva recorde |
| Telas | Seis páginas e estados ativos em 320, 390, 768 e 1366px; sem erro de página, recurso ausente ou overflow horizontal; screenshots inspecionados |
| APIs opcionais | Partidas utilizáveis com localStorage, AudioContext e WebGL indisponíveis, incluindo ativação dos controles opcionais |
| Acessibilidade | Nenhuma violação séria ou crítica nas regras WCAG A/AA verificadas pelo axe; modal, avatar e novos jogos por teclado; cruzamento de pistas do Chat por teclado também conferido em 390px |

## Correções que a validação encontrou

A revisão em leitura identificou exploração de pontos, vidas negativas, avanço fora de ordem, pistas inexistentes, confusão entre contatos, medalhas concedidas em derrota e persistência frágil. Os três clusters corrigiram esses problemas e completaram os jogos de senha e privacidade.

A revisão cruzada detectou dois problemas adicionais durante a implementação: o sufixo fictício dos endereços revelava a resposta do Inspector, e o retorno pelo histórico durante uma resposta do Chat podia manter o contato travado. Ambos foram corrigidos. Todos os 110 cartões do Inspector receberam referência explícita e explicação coerente; há casos perigosos até dentro do domínio de referência, para que o aluno analise também o pedido apresentado.

O primeiro gate expôs seletores ambíguos no roteiro automatizado e a necessidade de dispensar o aviso de armazenamento antes de clicar nos controles cobertos. Esses testes foram ajustados conforme a interface real. A inspeção das capturas encontrou uma falha real adicional de rolagem no Inspector, corrigida para preservar as instruções iniciais e a largura disponível junto à barra de rolagem. A suíte integrada passou depois das correções, e o fallback recebeu a verificação complementar.

## Organização e entrega

Equipe: um orquestrador e três executores com arquivos exclusivos. As revisões cruzadas foram somente de leitura. Nenhum executor rodou suites nem fez commit ou push. A verificação da árvore integrada e a inspeção visual ficaram com o orquestrador.

O site está servido localmente em `http://127.0.0.1:8765`. Para outra sessão, rode `npm start` na pasta do projeto. O README contém o roteiro da aula, os comandos de teste e as referências educativas. Os documentos antigos foram consolidados; suas versões anteriores permanecem no histórico Git.

## Limites do resultado

Os testes locais não equivalem a publicar nem validar a versão que está no GitHub Pages. Safari, aparelhos físicos, leitores de tela e a aplicação da aula com crianças exigem validação própria. A suíte busca regressões concretas; não representa uma garantia matemática de ausência de qualquer defeito.
