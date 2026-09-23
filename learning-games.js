(function () {
  'use strict';

  const lessons = {
    secret_password: {
      name: 'Senha Secreta', icon: '🔑', badge: 'Guardião das Senhas',
      intro: 'Abra o laboratório e ajude a agente Duda a cuidar de suas contas. Você vai montar uma frase de treino e resolver cinco situações sobre senhas.',
      art: 'Uma chave diferente para cada conta',
      warning: 'Nunca digite uma senha real. Todas as palavras e personagens deste jogo são inventados. Não copie os exemplos para usar nas suas contas.',
      summary: 'Senhas longas e únicas, sem dados pessoais, ajudam a proteger suas contas. Um adulto de confiança pode ajudar com um gerenciador e a verificação em duas etapas.',
      source: 'https://cartilha.cert.br/dicas-rapidas/', sourceName: 'Dicas de segurança do CERT.br',
      stages: [
        {
          type: 'builder', icon: '🧪', title: 'Misture quatro palavras de treino',
          sceneTitle: 'Laboratório da agente Duda',
          scene: 'Duda nasceu em 2014. Nome e ano de nascimento são fáceis de descobrir, por isso não entram na receita.',
          prompt: 'Escolha quatro palavras diferentes, sem dados da Duda e sem sequências óbvias. Toque novamente em uma palavra para retirá-la.',
          note: 'As palavras são só peças de treino, não uma senha para usar de verdade.',
          tip: 'Uma frase longa pode combinar palavras aleatórias sem relação. Evite dados pessoais e exemplos conhecidos.',
          words: [
            { text: 'Farol', safe: true }, { text: 'Nuvem', safe: true },
            { text: 'Cacto', safe: true }, { text: 'Tambor', safe: true },
            { text: 'Planeta', safe: true }, { text: 'Jacaré', safe: true },
            { text: 'Duda2014', safe: false }, { text: '123456', safe: false }
          ]
        },
        {
          icon: '📏', title: 'Qual receita ajuda mais?', sceneTitle: 'Uma senha nova',
          scene: 'Duda vai criar uma conta com a ajuda de um adulto. Ela quer algo difícil de adivinhar.',
          prompt: 'Qual orientação você daria? Não escolha uma senha real, escolha a melhor receita.',
          tip: 'Comprimento e imprevisibilidade ajudam. Trocar uma letra por um símbolo não salva uma senha óbvia.',
          options: [
            { text: 'Usar meu nome e trocar a letra A por @.', correct: false, feedback: 'Essa troca é conhecida e seu nome pode ser descoberto. Prefira uma senha longa e imprevisível, sem dados pessoais.' },
            { text: 'Criar uma frase longa com palavras aleatórias, sem relação com meus dados.', correct: true, feedback: 'Boa receita! Palavras aleatórias podem formar uma frase longa. Peça ajuda a um adulto ou a um gerenciador para criar uma combinação que não seja previsível.' },
            { text: 'Usar uma senha curtinha para lembrar rápido.', correct: false, feedback: 'Uma senha curta costuma ter menos combinações possíveis. Uma frase longa pode ser mais fácil de lembrar e mais difícil de adivinhar.' }
          ]
        },
        {
          icon: '🗝️', title: 'Uma conta nova, uma chave nova', sceneTitle: 'Duas contas diferentes',
          scene: 'A senha do jogo da Duda ficou exposta. Ela também tem uma conta de atividades escolares.',
          prompt: 'O que ajuda a evitar que o mesmo vazamento abra as duas contas?',
          tip: 'Use uma senha diferente em cada serviço. Se uma vazar, troque-a com ajuda de um adulto.',
          options: [
            { text: 'Repetir a mesma senha em todas as contas.', correct: false, feedback: 'Quem descobre uma senha pode tentar usá-la em outros serviços. Senhas diferentes limitam esse risco.' },
            { text: 'Trocar a senha exposta e manter senhas diferentes em cada serviço.', correct: true, feedback: 'Isso protege melhor as outras contas. Peça ajuda a um adulto para trocar a senha exposta e conferir se houve acesso indevido.' },
            { text: 'Usar a mesma senha e acrescentar 1 em cada conta nova.', correct: false, feedback: 'Uma pequena mudança cria um padrão fácil de tentar. Prefira senhas realmente diferentes para cada serviço.' }
          ]
        },
        {
          icon: '💬', title: 'O suporte pediu sua senha', sceneTitle: 'Mensagem inesperada',
          scene: 'Uma pessoa no chat diz: “Sou do suporte. Envie sua senha e o código que acabou de chegar para ganhar um item.”',
          prompt: 'Como a Duda deve agir?',
          tip: 'Senha e códigos de verificação não são presentes nem provas de amizade. Não os envie pelo chat.',
          options: [
            { text: 'Enviar só o código, porque ele vence rápido.', correct: false, feedback: 'O código pode abrir sua conta naquele instante. Não envie senha nem código de verificação para alguém no chat.' },
            { text: 'Enviar a senha e trocar depois.', correct: false, feedback: 'A pessoa pode entrar na conta antes da troca. Interrompa o contato e peça ajuda a um adulto de confiança.' },
            { text: 'Não enviar nada, bloquear ou denunciar e pedir ajuda a um adulto.', correct: true, feedback: 'Certo! Você não precisa descobrir quem está por trás da mensagem. Um adulto pode ajudar a usar o canal oficial de suporte, se necessário.' }
          ]
        },
        {
          icon: '🔐', title: 'Adicione uma segunda proteção', sceneTitle: 'Configurações da conta',
          scene: 'O serviço oferece verificação em duas etapas. Além da senha, ele pede outra confirmação para entrar.',
          prompt: 'Qual é o melhor próximo passo?',
          tip: 'Ative a verificação em duas etapas com ajuda de um adulto. Nunca compartilhe os códigos.',
          options: [
            { text: 'Ativar com ajuda de um adulto e guardar os códigos de recuperação com segurança.', correct: true, feedback: 'Boa decisão! A segunda etapa dificulta o acesso de outra pessoa. Os códigos de recuperação também precisam ficar protegidos.' },
            { text: 'Deixar desligada porque minha senha parece boa.', correct: false, feedback: 'Mesmo uma boa senha pode vazar ou ser roubada. Uma segunda confirmação adiciona proteção.' },
            { text: 'Ativar e publicar os códigos para não perdê-los.', correct: false, feedback: 'Os códigos dão acesso à conta. Combine com um adulto uma forma segura de guardá-los, sem publicar ou mandar no chat.' }
          ]
        },
        {
          icon: '🧰', title: 'Como guardar tantas chaves?', sceneTitle: 'O caderno de contas',
          scene: 'Duda agora usa senhas diferentes e quer lembrar de todas com segurança.',
          prompt: 'O que ela pode combinar com um adulto de confiança?',
          tip: 'Um gerenciador de senhas, configurado com ajuda, pode criar e guardar senhas únicas. Evite deixar senhas expostas.',
          options: [
            { text: 'Mandar uma foto das senhas para o grupo da turma.', correct: false, feedback: 'O grupo não é um lugar seguro para senhas. Outras pessoas podem copiar e repassar essa foto.' },
            { text: 'Usar um gerenciador de senhas configurado com a ajuda do adulto.', correct: true, feedback: 'Boa escolha! O adulto pode ajudar a escolher e configurar o gerenciador e a proteger o acesso a ele. Não é preciso decorar várias senhas fracas.' },
            { text: 'Colar todas as senhas na tela do computador da escola.', correct: false, feedback: 'Qualquer pessoa que usar o computador poderá ler. Combine uma forma de armazenamento protegido com um adulto de confiança.' }
          ]
        }
      ]
    },
    privacy_shield: {
      name: 'Escudo de Privacidade', icon: '🛡️', badge: 'Guardião da Privacidade',
      intro: 'Ajude a agente Raposa a proteger um perfil fictício. Ajuste seis decisões do dia a dia, entenda o efeito de cada escolha e monte seu escudo.',
      art: 'Você escolhe o que compartilha',
      warning: 'Nenhuma configuração real será alterada. Não conte seu endereço, escola, telefone ou outra informação pessoal para jogar.',
      summary: 'Compartilhe menos dados, confira quem vê suas publicações e revise permissões. Se alguém pressionar, pedir segredo ou causar desconforto, procure um adulto de confiança.',
      source: 'https://new.safernet.org.br/helpline', sourceName: 'Orientação da SaferNet Brasil',
      stages: [
        {
          icon: '👥', title: 'Quem pode ver o perfil?', sceneTitle: 'Perfil: Raposa Espacial',
          scene: 'O perfil está público. Até pessoas que Raposa não conhece podem acompanhar suas publicações.',
          prompt: 'Escolha uma configuração mais cuidadosa para esse perfil fictício.',
          tip: 'Uma conta privada limita o público. Ainda assim, revise pedidos e lembre que alguém pode copiar uma publicação.',
          options: [
            { text: 'Conta pública e aceitar todos para ganhar seguidores.', correct: false, feedback: 'Mais seguidores também podem incluir desconhecidos. Limitar o público e revisar pedidos reduz a exposição.' },
            { text: 'Conta privada e aceitar apenas pessoas conhecidas, com ajuda de um adulto.', correct: true, feedback: 'Primeira parte do escudo pronta! A conta privada limita o público, mas não impede capturas de tela. Pense antes de publicar.' },
            { text: 'Conta privada, mas aprovar qualquer pedido automaticamente.', correct: false, feedback: 'A conta privada perde parte da proteção se todo desconhecido entra. Revise quem você aceita.' }
          ]
        },
        {
          icon: '📍', title: 'Sua localização precisa aparecer?', sceneTitle: 'Permissão de localização',
          scene: 'Um jogo de quebra-cabeças quer acessar a localização precisa o tempo todo. Essa informação não é necessária para montar as peças.',
          prompt: 'Qual configuração você escolhe?',
          tip: 'Negue permissões que o aplicativo não precisa. Revise a localização com um adulto quando houver uma necessidade real.',
          options: [
            { text: 'Permitir localização precisa o tempo todo.', correct: false, feedback: 'Esse jogo não precisa saber onde você está. Permissões extras podem expor sua localização sem ajudar na atividade.' },
            { text: 'Permitir só porque a tela insistiu várias vezes.', correct: false, feedback: 'Insistência não torna a permissão necessária. Você pode negar e pedir ajuda para conferir.' },
            { text: 'Não permitir e conferir as permissões com um adulto.', correct: true, feedback: 'Boa proteção! Para esse quebra-cabeças, negar a localização evita compartilhar um dado desnecessário.' }
          ]
        },
        {
          icon: '📸', title: 'Confira o fundo da foto', sceneTitle: 'Uma foto antes de publicar',
          scene: 'Raposa tirou uma foto legal. Ao fundo aparecem o endereço da casa e o nome da escola no uniforme de um colega.',
          prompt: 'O que fazer antes de compartilhar?',
          tip: 'Confira o fundo de fotos e vídeos. Proteja dados seus e de outras pessoas e peça autorização antes de publicar imagens delas.',
          options: [
            { text: 'Publicar rápido porque a foto ficou bonita.', correct: false, feedback: 'Uma foto pode revelar onde você mora ou estuda. Confira esses detalhes antes de publicar.' },
            { text: 'Não publicar assim; remover os dados visíveis e pedir autorização ao colega e a um adulto.', correct: true, feedback: 'Boa pausa! Você protege sua privacidade e a do colega. Se não conseguir esconder os dados, escolha outra foto ou não publique.' },
            { text: 'Mandar só para o grupo e confiar que ninguém vai repassar.', correct: false, feedback: 'Uma imagem pode ser copiada mesmo em grupos fechados. Remova os dados antes de compartilhar e confira a autorização das pessoas na foto.' }
          ]
        },
        {
          icon: '✉️', title: 'Mensagem de um desconhecido', sceneTitle: 'Caixa de mensagens',
          scene: 'Alguém que Raposa nunca encontrou pede seu telefone para continuar a conversa em outro aplicativo.',
          prompt: 'Qual atitude protege melhor a Raposa?',
          tip: 'Não envie telefone, endereço ou fotos pessoais para desconhecidos. Você pode encerrar o contato e procurar ajuda.',
          options: [
            { text: 'Passar o telefone para não parecer mal-educada.', correct: false, feedback: 'Você não deve informações pessoais a alguém. Pode recusar, encerrar a conversa e pedir ajuda.' },
            { text: 'Pedir uma selfie e confiar se a foto parecer simpática.', correct: false, feedback: 'Uma foto não prova quem está conversando. Não compartilhe dados pessoais para tentar confirmar uma identidade.' },
            { text: 'Não enviar o telefone, limitar mensagens e bloquear ou denunciar se necessário.', correct: true, feedback: 'Você controla quem pode falar com você. Peça ajuda a um adulto de confiança se houver insistência ou desconforto.' }
          ]
        },
        {
          icon: '🎙️', title: 'Cada permissão tem um motivo', sceneTitle: 'Um aplicativo de lanterna',
          scene: 'O aplicativo quer acesso ao microfone, aos contatos e a todas as fotos para acender a luz.',
          prompt: 'Como revisar esse pedido?',
          tip: 'Permita apenas o que for necessário para a função do aplicativo. Na dúvida, negue e peça ajuda.',
          options: [
            { text: 'Negar acessos desnecessários e pedir ajuda para escolher um aplicativo adequado.', correct: true, feedback: 'Isso evita entregar contatos, fotos e áudio sem motivo. Se a função não exige esses dados, você pode negar.' },
            { text: 'Aceitar tudo, porque aplicativos sempre precisam disso.', correct: false, feedback: 'Nem toda permissão tem uma boa razão. Uma lanterna não precisa ler seus contatos para acender a luz.' },
            { text: 'Liberar tudo agora e esquecer de revisar depois.', correct: false, feedback: 'Os dados podem ser acessados enquanto a permissão está liberada. Vale conferir antes de aceitar.' }
          ]
        },
        {
          icon: '🤝', title: 'Um segredo que incomoda', sceneTitle: 'Pedido na conversa',
          scene: 'Uma pessoa insiste em receber uma foto pessoal e diz: “Não conte para nenhum adulto. Você vai se dar mal se contar.”',
          prompt: 'Qual é a melhor atitude?',
          tip: 'Você não tem culpa pela pressão de outra pessoa. Interrompa o contato e procure um adulto de confiança, mesmo se já tiver enviado algo.',
          options: [
            { text: 'Continuar a conversa para investigar sozinho.', correct: false, feedback: 'Você não precisa investigar nem enfrentar a pessoa. Interrompa o contato e procure um adulto de confiança.' },
            { text: 'Não enviar a foto, interromper o contato e contar a um adulto de confiança.', correct: true, feedback: 'Pedir ajuda é uma atitude de proteção. Você não tem culpa pela pressão. Um adulto pode ajudar a bloquear, denunciar e preservar informações necessárias sem repassar a foto.' },
            { text: 'Enviar a foto para acabar com a insistência.', correct: false, feedback: 'A pressão pode continuar. Não envie a foto. Se já enviou, você ainda pode pedir ajuda e não é culpado pela atitude da outra pessoa.' }
          ]
        }
      ]
    }
  };

  const gameId = document.body.dataset.game;
  const game = lessons[gameId];
  const root = document.getElementById('game-content');
  if (!game || !root) return;
  const h = CyberKidsProfile.escapeHtml;
  const state = {
    phase: 'intro', index: 0, score: 0, mistakes: 0, stageMistakes: 0,
    completed: 0, options: [], words: [], selected: [], review: [], correct: false
  };

  function shuffled(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function updateBest() {
    const profile = CyberKidsProfile.load();
    document.getElementById('personal-best').textContent = `Seu recorde: ${profile.scores[gameId]} pontos`;
  }

  function focusHeading() {
    const heading = root.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  function showIntro() {
    updateBest();
    root.innerHTML = `<section class="intro" aria-labelledby="intro-title">
      <div class="intro-art"><span class="big-icon" aria-hidden="true">${game.icon}</span><p>${h(game.art)}</p></div>
      <div class="intro-copy"><h2 id="intro-title">${h(game.name)}</h2><p>${h(game.intro)}</p>
        <ul class="rules"><li>São <strong>${game.stages.length} missões</strong>, sem limite de tempo.</li>
          <li>Acerto de primeira vale <strong>20 pontos</strong>. Depois de uma tentativa, vale <strong>10 pontos</strong>.</li>
          <li>Você pode corrigir suas escolhas. Com <strong>3 erros</strong>, a rodada termina e você pode tentar novamente.</li>
          <li>Complete todas as missões para ganhar a medalha <strong>${h(game.badge)}</strong>. Máximo: <strong>${game.stages.length * 20} pontos</strong>.</li></ul>
        <p class="notice">${h(game.warning)}</p>
        <div class="button-row"><button class="button" data-action="start">Começar missão</button></div>
        <p class="small-copy">Use o mouse ou Tab e Enter. Não precisa arrastar nada. Só o recorde e a medalha são salvos no seu perfil.</p>
      </div></section>`;
  }

  function start() {
    state.index = 0;
    state.score = 0;
    state.mistakes = 0;
    state.completed = 0;
    state.review = [];
    prepareStage();
  }

  function prepareStage() {
    const stage = game.stages[state.index];
    state.stageMistakes = 0;
    state.options = shuffled(stage.options || []);
    state.words = shuffled(stage.words || []);
    renderStage();
  }

  function renderStage() {
    state.phase = 'playing';
    state.selected = [];
    const stage = game.stages[state.index];
    const progress = game.stages.map((_, index) => `<span class="${index < state.index ? 'done' : index === state.index ? 'current' : ''}"></span>`).join('');
    let task;
    if (stage.type === 'builder') {
      task = `<div class="word-tray" role="group" aria-label="Palavras de treino">${state.words.map((word, index) => `<button class="word" data-action="word" data-index="${index}" aria-pressed="false">${h(word.text)}</button>`).join('')}</div>
        <p class="small-copy" id="selection-count" role="status">0 de 4 palavras escolhidas</p>
        <div class="phrase-preview" id="phrase-preview" role="group" aria-label="Frase de treino">Sua mistura aparece aqui</div>
        <p class="small-copy">Esta é uma demonstração pública. Não use a mistura como senha real.</p>
        <button class="button" data-action="check-words" disabled>Conferir mistura</button>`;
    } else {
      task = `<div class="options" role="group" aria-label="Escolha uma atitude">${state.options.map((option, index) => `<button class="option" data-action="answer" data-index="${index}">${h(option.text)}</button>`).join('')}</div>`;
    }
    root.innerHTML = `<div class="mission-hud" role="group" aria-label="Progresso da partida"><span>Missão ${state.index + 1} de ${game.stages.length}</span><span>${state.score} pontos</span><span class="mistakes">Tentativas restantes: ${3 - state.mistakes} de 3</span></div>
      <div class="mission-progress" role="img" aria-label="${state.completed} de ${game.stages.length} missões completas">${progress}</div>
      <div class="mission-layout"><aside class="scene" aria-label="Situação fictícia"><span class="scene-icon" aria-hidden="true">${stage.icon}</span>
        <p class="scene-title">${h(stage.sceneTitle)}</p><p class="scene-copy">${h(stage.scene)}</p>
        <p class="simulation">Cenário fictício para aprender</p>${stage.note ? `<p class="scene-note">${h(stage.note)}</p>` : ''}</aside>
        <section class="challenge" aria-labelledby="challenge-title"><h2 id="challenge-title">${h(stage.title)}</h2><p>${h(stage.prompt)}</p>${task}
        <div id="feedback" hidden></div><div id="continue-area"></div></section></div>`;
    focusHeading();
  }

  function selectWord(index) {
    if (state.phase !== 'playing' || !state.words[index]) return;
    const selectedIndex = state.selected.indexOf(index);
    if (selectedIndex !== -1) state.selected.splice(selectedIndex, 1);
    else if (state.selected.length < 4) state.selected.push(index);
    else {
      document.getElementById('selection-count').textContent = 'Você já escolheu quatro. Retire uma palavra antes de trocar.';
      return;
    }
    root.querySelectorAll('[data-action="word"]').forEach(button => {
      button.setAttribute('aria-pressed', String(state.selected.includes(Number(button.dataset.index))));
    });
    document.getElementById('selection-count').textContent = `${state.selected.length} de 4 palavras escolhidas`;
    document.getElementById('phrase-preview').textContent = state.selected.length
      ? state.selected.map(item => state.words[item].text).join(' · ') : 'Sua mistura aparece aqui';
    root.querySelector('[data-action="check-words"]').disabled = state.selected.length !== 4;
  }

  function checkWords() {
    if (state.phase !== 'playing' || state.selected.length !== 4) return;
    const correct = state.selected.every(index => state.words[index].safe);
    answer(correct, correct
      ? 'Boa mistura de treino! Você juntou quatro palavras diferentes, sem usar os dados da Duda. Em uma conta real, crie outra combinação, longa e imprevisível, com ajuda de um adulto. Nunca copie este exemplo.'
      : 'Duda2014 usa dados da personagem e 123456 é uma sequência muito conhecida. Retire essas peças e escolha quatro palavras diferentes sem relação com a pessoa.');
  }

  function chooseAnswer(index) {
    if (state.phase !== 'playing' || !state.options[index]) return;
    const option = state.options[index];
    const button = root.querySelector(`[data-action="answer"][data-index="${index}"]`);
    button.classList.add(option.correct ? 'correct' : 'incorrect');
    const tag = document.createElement('span');
    tag.className = 'choice-tag';
    tag.textContent = option.correct ? '✓ Boa escolha' : 'Vamos revisar esta escolha';
    button.append(tag);
    answer(option.correct, option.feedback);
  }

  function answer(correct, explanation) {
    if (state.phase !== 'playing') return;
    state.phase = 'feedback';
    state.correct = correct;
    const stage = game.stages[state.index];
    const points = state.stageMistakes ? 10 : 20;
    if (correct) {
      state.score += points;
      state.completed = state.index + 1;
    } else {
      state.mistakes++;
      state.stageMistakes++;
    }
    state.review[state.index] = { title: stage.title, tip: stage.tip, correct };
    root.querySelectorAll('[data-action="answer"], [data-action="word"], [data-action="check-words"]').forEach(button => { button.disabled = true; });
    const feedback = document.getElementById('feedback');
    feedback.hidden = false;
    feedback.className = `feedback ${correct ? 'good' : 'retry'}`;
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('tabindex', '-1');
    const heading = correct ? `Proteção reforçada! +${points} pontos` : state.mistakes >= 3 ? 'Vamos fazer uma pausa para revisar' : 'Você pode aprender com esta tentativa';
    feedback.innerHTML = `<h3>${heading}</h3><p>${h(explanation)}</p>${!correct ? `<p>Tentativas restantes: ${3 - state.mistakes} de 3.</p>` : ''}`;
    const end = state.mistakes >= 3 || (correct && state.index === game.stages.length - 1);
    document.getElementById('continue-area').innerHTML = `<button class="button" data-action="continue">${end ? 'Ver resultado' : correct ? 'Próxima missão' : 'Tentar esta missão de novo'}</button>`;
    const hud = root.querySelector('.mission-hud');
    hud.children[1].textContent = `${state.score} pontos`;
    hud.children[2].textContent = `Tentativas restantes: ${3 - state.mistakes} de 3`;
    feedback.focus();
  }

  function continueGame() {
    if (state.phase !== 'feedback') return;
    if (state.mistakes >= 3) { finish(false); return; }
    if (!state.correct) { renderStage(); return; }
    if (state.index === game.stages.length - 1) { finish(true); return; }
    state.index++;
    prepareStage();
  }

  function finish(completed) {
    if (state.phase === 'result') return;
    state.phase = 'result';
    const profile = CyberKidsProfile.record(gameId, state.score, { completed });
    document.getElementById('personal-best').textContent = `Seu recorde: ${profile.scores[gameId]} pontos`;
    root.innerHTML = `<section class="result" aria-labelledby="result-title"><div class="result-heading"><span class="scene-icon" aria-hidden="true">${completed ? '🏅' : '📖'}</span>
      <div><h2 id="result-title">${completed ? 'Missão completa!' : 'Hora de revisar e tentar de novo'}</h2><p>${completed ? `Medalha conquistada: ${h(game.badge)}.` : 'Três tentativas não deram certo nesta rodada. Leia as dicas e recomece quando quiser.'}</p></div></div>
      <div class="result-stats"><p><strong>${state.score} / ${game.stages.length * 20}</strong>Pontos nesta rodada</p><p><strong>${state.completed} / ${game.stages.length}</strong>Missões completas</p><p><strong>${profile.scores[gameId]}</strong>Seu recorde</p></div>
      <p class="notice">${h(game.summary)}</p><div><h3>Leve estas dicas com você</h3><ul class="review-list">${state.review.map(item => `<li><strong>${h(item.title)}:</strong> ${h(item.tip)}</li>`).join('')}</ul></div>
      <p>${completed ? 'Você pode jogar novamente. Seu maior recorde fica guardado.' : 'A medalha desta rodada exige completar todas as missões. Seu maior recorde e as medalhas já conquistadas continuam no perfil.'}</p>
      <div class="button-row"><button class="button" data-action="replay">Jogar novamente</button><a class="button secondary" href="index.html">Voltar à central</a></div>
      <p class="source-links">Para continuar a conversa com um adulto: <a href="${game.source}" target="_blank" rel="noopener noreferrer">${h(game.sourceName)}</a>.</p></section>`;
    focusHeading();
  }

  root.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled || !root.contains(button)) return;
    const action = button.dataset.action;
    if ((action === 'start' && state.phase === 'intro') || (action === 'replay' && state.phase === 'result')) start();
    else if (action === 'word') selectWord(Number(button.dataset.index));
    else if (action === 'check-words') checkWords();
    else if (action === 'answer') chooseAnswer(Number(button.dataset.index));
    else if (action === 'continue') continueGame();
  });

  document.getElementById('home-link').addEventListener('click', event => {
    if ((state.phase === 'playing' || state.phase === 'feedback') && !confirm('Voltar à central? A rodada atual será encerrada. Seu recorde anterior continua guardado.')) event.preventDefault();
  });

  showIntro();
})();
