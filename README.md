# 🔍 Website Inspector
> **Jogo educativo interativo de cibersegurança e educação digital para crianças de 10 a 12 anos.**

![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)
![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20WebGL-orange.svg)
![Ano](https://img.shields.io/badge/Est%C3%A9tica-Google%202006-red.svg)

---

## 🎯 Sobre o Projeto

O **Website Inspector** é um minigame educativo em página única (*Single-File Web App*) desenvolvido para ensinar alunos do ensino fundamental a identificar links perigosos, tentativas de *phishing*, malwares, enganos por digitação (*typosquatting*) e ciladas comuns na internet.

Ambientado no visual clássico do **Google de 2006** e no antigo **Windows XP**, o jogo combina nostalgia retro com aprendizado prático de segurança digital em um ambiente divertido e imersivo.

---

## 🕹️ Mecânicas do Jogo

- 🕵️ **10 Rodadas de Investigação:** Cada fase apresenta uma pesquisa escolar ou busca do cotidiano infantil (como baixar jogos, pesquisar sobre o Sistema Solar, quizzes, skins de games, etc.).
- 📊 **Progressão de Dificuldade Dinâmica (7 a 11 Links):** Os links exibidos em cada fase são sorteados procedurarmente de um banco classificado em 3 níveis de dificuldade:
  - 🟢 **Fácil:** Golpes óbvios (*domínios `.xyz`, executáveis `.exe` em pesquisas de trabalhos de escola, promessas de celulares grátis*).
  - 🟡 **Médio:** Falsos atalhos e cadastros de celulares (*sites não oficiais, instaladores modificados de terceiros, cobranças de SMS*).
  - 🔴 **Difícil:** Phishing avançado e Typosquatting (*erros sutis de ortografia como `miinecraft.net`, `robllox.com`, `epiiicgames.com` e falsos subdomínios*).
- 💡 **Feedback Educativo Instantâneo:** Ao avaliar cada link como 🟢 **É Seguro** ou 🔴 **É Cilada**, o aluno recebe uma explicação clara e pedagógica sobre o motivo.
- ☠️ **Invasão de Vírus em Tempo Real:** Ao errar uma avaliação, o computador sofre danos! O sistema ganha glitches visuais progressivos e bugs de vírus SVG começam a se espalhar pela tela.
- 🚨 **Alerta Retro Windows XP:** Telas de erro estilizadas como janelas do Windows XP alertam sobre o perigo detectado.

---

## 🖥️ Estética Retro & Efeitos Visuais

- 📺 **Shader WebGL CRT TV (Distorção de Tubo Barrel Distort):** Efeito 3D que simula a curvatura de vidro dos monitores de tubo antigos dos anos 2000.
- 📼 **Overlay de Filtro VHS:** Efeito com linhas de varredura vintage (pode ser ligado/desligado no botão do cabeçalho).
- 🌐 **Abas de Navegador Nostálgicas:** Navegação por abas clássicas com os logos originais do *Google Brasil*, *Orkut*, *Jogos360* e *MSN Hotmail*.
- 🔟 **Paginação Google 10-O:** A logo histórica do Google (`Goooooooooogle`) atua como indicador das 10 rodadas, destacando a página atual em vermelho (`g-red`) e marcando rodadas concluídas com `✓`.
- 🎵 **Sintetizador de Áudio 8-bit:** Efeitos sonoros gerados dinamicamente via **Web Audio API** (sem arquivos pesados de áudio externos).

---

## 🚀 Como Executar o Projeto

Como o jogo foi desenvolvido em **arquitetura de arquivo único**, você não precisa instalar nenhuma dependência ou servidor Node.js!

### 💻 Executar Localmente
1. Baixe o código fonte ou clone este repositório.
2. Abra o arquivo `index.html` (ou `detetive_web_game.html`) em qualquer navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

### 🌐 Publicar Online Gratuitamente (GitHub Pages)
1. No seu repositório do GitHub, vá em **Settings** > **Pages**.
2. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
3. Clique em **Save**.
4. Em menos de 1 minuto, seu jogo estará acessível online em:
   ```text
   https://salleF.github.io/Website-Inspector/
   ```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica da aplicação e layouts da SERP.
- **CSS3:** Estilização retro, keyframes de animação de vírus, efeito de balanço CRT e caixas de alerta.
- **JavaScript (Vanilla ES6+):** Lógica do jogo, amostragem procedural de dificuldade, manipulação de DOM e gerenciamento de estado.
- **WebGL (GLSL Fragment Shaders):** Processamento via GPU para distorção de tubo de TV CRT e vinheta.
- **Web Audio API:** Geração de efeitos sonoros em tempo real de acertos (arpejo) e erros (varredura de frequência).

---

## 📜 Licença

Este projeto é de uso **livre e educacional** (Licença MIT). Fique à vontade para utilizar em escolas, eventos pedagógicos, oficinas de cibersegurança e feiras de ciências!
