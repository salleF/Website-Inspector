# 🕹️ CyberKids Arcade — Central de Jogos de Segurança Digital
> **Plataforma interativa de jogos educativos de cibersegurança e educação midiática para crianças de 10 a 12 anos.**

![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)
![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20WebGL-orange.svg)
![Público](https://img.shields.io/badge/P%C3%BAblico-10%20a%2012%20anos-green.svg)
![Status](https://img.shields.io/badge/Status-Online%20no%20GitHub%20Pages-brightgreen.svg)

---

## 🎯 Sobre a Plataforma

A **CyberKids Arcade** é uma central interativa de jogos acadêmicos inspirada na era de ouro dos portais web clássicos (como ClickJogos, Miniclip e Jogos360). Criada com propósitos pedagógicos, a plataforma prepara estudantes do Ensino Fundamental para navegar pela internet de maneira crítica, segura e consciente.

---

## 🎮 Catálogo de Jogos da Central

### 1. 🔍 Website Inspector (Google 2006)
- **Tema:** Leitura crítica de links, detecção de *phishing*, malwares e *typosquatting* (erros intencionais de digitação).
- **Mecânica:** Os alunos viajam no tempo até a interface do **Google de 2006** (com efeitos de TV de Tubo CRT via WebGL e VHS) e analisam entre **7 e 11 links** em 10 rodadas de pesquisas escolares reais.
- **Dificuldade:** Progressiva em 3 níveis (Fácil, Médio e Difícil).

### 2. 🎭 Detector de Fakes & Golpes
- **Tema:** Combate a *fake news*, boatos, mensagens fraudulentas e engenharia social.
- **Mecânica:** Em um simulador de smartphone interativo (com apps de WhatsApp, Instagram, SMS e Portais de Notícias), os alunos julgam 10 mensagens reais entre **🟢 É Fato / Confiável** vs **🔴 É Fake / Golpe**.

### 3. 🔑 Cofre de Senhas Fortes *(Em Breve)*
- Treinamento prático para criação de senhas robustas e proteção de contas.

### 4. 🛡️ Guardião da Privacidade *(Em Breve)*
- Conscientização sobre o que postar e compartilhar nas redes sociais vs o que deve ser mantido privado.

---

## 🏆 Sistema de Perfil do Aluno e Conquistas

- **Escolha de Avatar:** 6 personagens temáticos (Detetive, Cyber Bot, Raposa, Gato Hacker, Mago, Heroína).
- **Painel de Agente:** Nome personalizado e ranking progressivo (*Recruta Digital ➔ Detetive da Web ➔ Mestre da Segurança*).
- **Galeria de Medalhas:**
  - 🔍 *Mestre Inspetor de Links* (desbloqueada no Website Inspector).
  - 🎭 *Caçador de Fakes* (desbloqueada no Detector de Fakes).
  - 🏆 *Detetive Supremo* (ao concluir todas as missões).
- **Salvamento Automático:** Todo o progresso e pontuação são salvos localmente no navegador via `localStorage`.
- **Botão Resetar Turma:** Permite ao professor reiniciar os dados facilmente entre aulas diferentes.

---

## 👨‍🏫 Guia do Professor & Atividade em Sala de Aula

A plataforma conta com um modal integrado contendo um roteiro sugerido de **45 a 50 minutos** de aula:
1. **Introdução (5 min):** Apresentação do papel de detetive e personalização do avatar.
2. **Missão 1 - Website Inspector (15 min):** Análise dos links no Google 2006.
3. **Missão 2 - Detector de Fakes (15 min):** Análise das mensagens no smartphone.
4. **Roda de Conversa (10 min):** Debate sobre as armadilhas mais difíceis encontradas.

---

## 🌐 Como Acessar Online

O projeto está publicado e disponível gratuitamente no GitHub Pages:
👉 **[https://sallef.github.io/Website-Inspector/](https://sallef.github.io/Website-Inspector/)**

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Layout moderno de portal arcade, simulador de smartphone e estética retro 2006.
- **JavaScript (Vanilla ES6+):** Lógica procedurador de fases, gerenciamento de estado e persistência no `localStorage`.
- **WebGL (GLSL Fragment Shaders):** Efeito de tubo de monitor CRT e vinheta no Website Inspector.
- **Web Audio API:** Efeitos sonoros retro gerados dinamicamente no navegador (sem arquivos pesados externos).

---

## 📜 Licença

Este projeto é de uso **livre e educacional** (Licença MIT). Fique à vontade para utilizar em escolas, eventos pedagógicos, oficinas de cibersegurança e feiras de ciências!
