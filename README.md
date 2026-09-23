# CyberKids Arcade

Cinco jogos de segurança digital para uma aula acompanhada por professor, voltada a crianças de 10 a 12 anos. O site usa HTML, CSS e JavaScript, sem servidor de dados e sem dependências externas para jogar.

## Abrir para a aula

Com Node.js instalado, execute na pasta do projeto:

```powershell
npm start
```

Abra [a central local](http://127.0.0.1:8765). Não é necessário instalar pacotes para iniciar o servidor local. Alternativa: `python -m http.server 8765 --bind 127.0.0.1`.

Os arquivos também podem ser servidos pelo GitHub Pages. O endereço público do repositório é [Website Inspector](https://sallef.github.io/Website-Inspector/); mudanças locais só aparecem lá depois de publicação. Use o mesmo navegador e a mesma origem durante a aula para manter o progresso.

## Jogos

| Jogo | Atividade | Progresso |
| --- | --- | --- |
| Website Inspector | Analisar endereço, contexto e pedidos de sites simulados | 10 rodadas; recorde e medalha ao concluir |
| Detector de Fakes | Ajudar a Vovó Jurema a verificar mensagens simuladas | 10 notificações; explicação após cada escolha |
| Chat Patrol | Investigar conversas, cruzar pistas e escolher formas de proteção | 5 turnos e 11 contatos; bloqueio disponível sem confronto obrigatório |
| Senha Secreta | Montar uma frase de treino e aprender a proteger contas | 6 missões; nunca solicita uma senha real |
| Escudo de Privacidade | Proteger um perfil fictício em situações do cotidiano | 6 cenários; permite aprender e corrigir escolhas |

Cada jogo tem instruções, retorno à central e reinício. As simulações não abrem os endereços suspeitos, não enviam mensagens, não instalam arquivos e não fazem denúncias reais. Não é preciso criar conta em nenhuma rede social para participar.

## Perfil e conquistas

Use um apelido fictício. O perfil fica somente no `localStorage` deste navegador, na chave `cyberkids_profile`. Nenhum dado é enviado a um servidor. Os recordes guardam a maior pontuação de cada jogo, e a medalha é concedida pela conclusão da atividade. As cinco medalhas de jogos liberam a sexta, Detetive Supremo.

`profile.js` valida o formato dos dados e recupera perfis antigos, incompletos ou corrompidos. Se o navegador bloquear o armazenamento, um aviso explica que o progresso será mantido apenas na página atual. Reiniciar perfil limpa somente os dados desta plataforma neste navegador.

Não use os pontos como avaliação formal do aluno. São registros locais de uma atividade didática, sem autenticação ou proteção contra edição pelas ferramentas do navegador.

## Roteiro de 50 minutos

1. **5 min:** explicar que os casos e dados são fictícios e escolher um apelido.
2. **10 min:** Inspector, analisando algumas rodadas em conjunto.
3. **10 min:** Detector de Fakes e conversa sobre como verificar antes de compartilhar.
4. **10 min:** Chat Patrol. A criança pode encerrar um contato e chamar um adulto de confiança sem discutir.
5. **10 min:** dividir a turma entre Senha Secreta e Escudo de Privacidade.
6. **5 min:** debate final e troca de aprendizados.

Completar todas as rodadas e turnos dos cinco jogos pode exigir outra aula. Não force velocidade de leitura. Sons e efeitos intensos não são necessários para jogar, e o Chat não pune o tempo usado para ler.

## Validação técnica

Node.js 24 e navegadores Chromium são usados na suíte automatizada:

```powershell
npm ci
npx playwright install chromium
npm test
```

Os testes cobrem perfil, navegação, partidas, reinícios, cliques repetidos, persistência, falta de APIs opcionais, responsividade e acessibilidade automatizada. Capturas e resultados ficam em `test-results/`. A configuração de CI fica em `.github/workflows/validate.yml`.

Consulte [o relatório de validação](docs/VALIDATION.md), [os achados da revisão](docs/audit.json) e [o estado para retomada](STATUS.json). Não há etapa de build: a pasta do projeto contém o site pronto para servir.

## Arquitetura

- `index.html`: central, apelido, avatares e guia do professor.
- `profile.js`: schema e persistência compartilhada.
- `website-inspector.html` e `fake-detector.html`: jogos clássicos.
- `chat-patrol.html`, `chat-patrol-data.js`, `chat-patrol-game.js`, `chat-patrol-audio.js`: apresentação, roteiro, motor e áudio do Chat.
- `secret-password.html`, `privacy-shield.html`, `learning-games.js`, `learning-games.css`: jogos de senha e privacidade.
- `detetive_web_game.html`: compatibilidade do endereço antigo, encaminhando ao Inspector atual.
- `Imagens/`: recursos locais do Detector de Fakes.
- `scripts/serve.cjs`: servidor de desenvolvimento restrito à máquina local.
- `tests/`: regressões e verificações no navegador.

## Referências educativas

O conteúdo foi revisado com apoio da [Cartilha do CERT.br](https://cartilha.cert.br/dicas-rapidas/) e do [Canal de Ajuda da SaferNet](https://new.safernet.org.br/helpline). O cadeado/HTTPS indica conexão criptografada, não a honestidade de um site, como explica o [Chromium](https://blog.chromium.org/2023/05/an-update-on-lock-icon.html).

Na vida real, não envie senhas, códigos ou dados pessoais em conversas suspeitas. Procure um adulto de confiança. Errar ou receber uma mensagem indesejada não torna a criança culpada.
