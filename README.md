# 🕹️ CyberKids Arcade — Central de Jogos de Segurança Digital
> **Plataforma interativa de jogos educativos de cibersegurança e educação midiática para crianças de 10 a 12 anos.**

![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)
![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20WebGL%20%7C%20Web%20Audio-orange.svg)
![Público](https://img.shields.io/badge/P%C3%BAblico-10%20a%2012%20anos-green.svg)
![Status](https://img.shields.io/badge/Status-Online%20no%20GitHub%20Pages-brightgreen.svg)

---

## 🎯 Sobre a Plataforma

A **CyberKids Arcade** é uma central interativa de jogos acadêmicos inspirada na era de ouro dos portais web clássicos (como ClickJogos, Miniclip e Jogos360). Criada com propósitos pedagógicos, a plataforma prepara estudantes do Ensino Fundamental para navegar pela internet de maneira crítica, segura e consciente contra golpes, phishing, desinformação e aliciadores.

---

## 🎮 Catálogo de Jogos da Central

### 1. 🔍 Website Inspector (Google 2006)
- **Tema:** Leitura crítica de links, detecção de *phishing*, malwares e *typosquatting* (erros intencionais de digitação).
- **Mecânica:** Os alunos viajam no tempo até a interface do **Google de 2006** (com efeitos de TV de Tubo CRT via WebGL e áudio retro) e analisam entre **7 e 11 links** em 10 rodadas de pesquisas escolares reais.
- **Dificuldade:** Progressiva em 3 níveis (Fácil, Médio e Difícil).

### 2. 🎭 Detector de Fakes & Golpes (Ajude a Vovó!)
- **Tema:** Combate a *fake news*, boatos, mensagens fraudulentas e engenharia social.
- **Mecânica:** Em um simulador de smartphone em primeira pessoa na sala da Vovó Jurema, os alunos julgam notificações reais entre **🟢 É Fato / Confiável** vs **🔴 É Fake / Golpe** antes que a paciência da vovó se esgote.

### 3. 💬 Chat Patrol / Vigilante da Rede
- **Tema:** Identificação de perfis falsos, aliciamento digital, proteção de dados íntimos/pessoais e confrontação de contradições em aplicativos de mensagem.
- **Mecânica:** Inspirado na tensão e multitarefa de *Five Nights at Freddy's (FNAF)*, o jogador monitora um aplicativo realista no estilo **Discord Dark Mode** durante **5 Turnos / Dias**.
- **Destaques:**
  - **Barra de Paciência em Tempo Real:** Se o tempo esgotar, ocorre um susto visual (*screen-shake* + flash vermelho + som estridente de estática) e o jogador perde 1 vida.
  - **Dossiê do Usuário:** Cruzamento de dados da bio, data de criação da conta e conexões mútuas para encontrar furos e contradições.
  - **Confronto & Banimento:** 3 opções de diálogo por rodada (Contra-ataque, Neutro, Ingênuo). Ao acumular evidências suficientes, o botão **`[🚫 BLOQUEAR E DENUNCIAR]`** é liberado para banir o golpista.
  - **Discernimento Real:** O jogador deve aprender a não bloquear amigos e colegas legítimos que pedem ajuda real.

### 4. 🔑 Crie sua Senha Secreta! *(Em Breve)*
- Treinamento prático para criação de passphrases robustas e seguras.

### 5. 🛡️ Escudo de Privacidade! *(Em Breve)*
- Conscientização sobre configurações de privacidade em redes sociais e controle de exposição de dados.

---

## 🏆 Sistema de Perfil do Aluno e Conquistas

- **Escolha de Avatar:** 6 personagens temáticos (Detetive 🕵️‍♂️, Cyber Bot 🤖, Raposa 🦊, Gato 🐱, Mago 🧙‍♂️, Heroína 🦸‍♀️).
- **Painel de Agente:** Nome personalizado e ranking progressivo (*Nível 1 • Recruta 🔍 ➔ Nível 2 • Detetive 🛡️ ➔ Nível 3 • Mestre 🏆*).
- **Galeria de 4 Medalhas:**
  - 🔍 *Mestre dos Links* (desbloqueada no Website Inspector).
  - 🎭 *Caçador de Fakes* (desbloqueada no Detector de Fakes).
  - 💬 *Vigilante do Chat* (desbloqueada ao sobreviver aos 5 turnos do Chat Patrol).
  - 🏆 *Detetive Supremo* (desbloqueada automaticamente ao conquistar todas as medalhas).
- **Salvamento Automático:** Todo o progresso, pontuação e conquistas são salvos no navegador via `localStorage` (`cyberkids_profile`).
- **Botão Resetar Turma:** Permite ao professor zerar os dados instantaneamente para uma nova turma.

---

## 👨‍🏫 Guia do Professor & Roteiro Pedagógico em Sala de Aula

A plataforma conta com um modal integrado com sugestão de roteiro para **45 a 50 minutos** de aula de informática ou cidadania digital:
1. **Ambientação (5 min):** Apresentação do papel de agente e personalização do avatar na Central.
2. **Missão 1 - Website Inspector (15 min):** Inspeção de URLs, identificação de domínios falsos e golpes de download.
3. **Missão 2 - Detector de Fakes (10 min):** Julgamento de notícias falsas e promoções enganosas de WhatsApp/SMS.
4. **Missão 3 - Vigilante do Chat (15 min):** Investigação de perfis suspeitos, proteção de endereço e fotos privadas no chat.
5. **Debate e Conclusão (5 min):** Comparação de medalhas conquistadas e debate sobre situações reais vivenciadas pelos alunos.

---

## 🌐 Como Acessar Online

O projeto está publicado e disponível gratuitamente no GitHub Pages:
👉 **[https://sallef.github.io/Website-Inspector/](https://sallef.github.io/Website-Inspector/)**

---

## 🛠️ Tecnologias Utilizadas (Zero Dependências)

- **HTML5 & CSS3 Moderno:** Layout responsivo *edge-to-edge*, tema Discord Dark Mode autêntico e animações CSS puras.
- **JavaScript (Vanilla ES6+):** Máquinas de estado para os 3 jogos, timers em tempo real e persistência no `localStorage`.
- **WebGL (GLSL Shaders):** Efeitos de monitor CRT retrô no Website Inspector.
- **Web Audio API:** Sintetizador sonoro integrado (chimes do Discord, estática FNAF, pops de mensagem, arpeggios e martelo de ban) sem arquivos de áudio externos pesados.

---

## 📜 Licença

Este projeto é de uso **livre e educacional** (Licença MIT). Fique à vontade para utilizar em escolas, oficinas de cibersegurança e feiras de ciências!
