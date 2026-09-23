const CHAT_PATROL_REFERENCE_LABELS = {
  my_grade: 'Minha turma',
  my_contacts: 'Contatos confirmados',
  my_security_status: 'Senhas e códigos',
  my_privacy: 'Dados e fotos pessoais',
  my_help: 'Pressão e ajuda',
  my_downloads: 'Arquivos e proteção',
  my_shopping: 'Compras e promoções',
  my_login: 'Acesso à conta',
  dossier_bio: 'Sobre mim, no dossiê'
};

function makePatrolContact(data) {
  const {steps, ...contact} = data;
  contact.bannerGradient = `linear-gradient(135deg, ${contact.avatarBg}, #202225)`;
  contact.status = 'online';
  contact.patienceSec = null;
  contact.evidenceGoal = contact.isSuspect ? steps.length : 0;
  contact.contradictions = contact.isSuspect ? steps.map((step, index) => ({
    id: `${contact.id}_${index}`,
    step: index,
    targets: [`msg_${index}`, step.source],
    explanation: step.explanation,
    clue: `Compare a mensagem ${index + 1} com "${CHAT_PATROL_REFERENCE_LABELS[step.source]}"${step.source.startsWith('my_') ? ' em Meu Perfil' : ''}.`
  })) : [];
  contact.dialogueTree = steps.map((step, index) => ({
    step: index,
    botMsg: step.botMsg,
    clue: contact.contradictions[index]?.clue,
    choices: contact.isSuspect ? [
      {id: `${contact.id}_${index}_safe`, icon: '🛡️', type: 'counter', text: step.safe, botReply: step.reply || 'Mas eu queria uma resposta agora...'},
      {id: `${contact.id}_${index}_read`, icon: '📖', type: 'neutral', text: 'Não vou enviar dados. Ler a próxima mensagem da simulação.'},
      {id: `${contact.id}_${index}_risk`, icon: '⚠️', type: 'danger', text: step.risk}
    ] : [
      {id: `${contact.id}_${index}_help`, icon: '🤝', type: 'friend_safe', text: step.safe, botReply: step.reply},
      {id: `${contact.id}_${index}_think`, icon: '💬', type: 'friend_safe', text: step.neutral, botReply: 'Tudo bem, podemos conversar com calma.'},
      {id: `${contact.id}_${index}_close`, icon: '👋', type: 'leave', text: 'Prefiro encerrar por agora e conversar pessoalmente depois.'}
    ]
  }));
  return contact;
}

const CHAT_PATROL_SHIFTS = [
  {
    day: 1,
    title: 'O falso colega',
    briefing: {
      icon: '🕵️', title: 'Turno 1: quem está falando?',
      description: 'Tudo aqui é fictício e nenhum dado é enviado. Leia sem pressa. Ative Investigar, selecione uma mensagem e a pista indicada no dossiê. Meu Perfil contém as regras e informações da personagem. Cada par correto vale 15 pontos, uma única vez. Você pode bloquear e pedir ajuda a qualquer momento, sem juntar provas. Três escolhas arriscadas permitem praticar o turno novamente.'
    },
    contacts: [makePatrolContact({
      id: 'lucas_fake', name: 'Lucas_Gamer', tag: '#4821', avatar: '🧢', avatarBg: '#9f254b', isSuspect: true,
      bio: 'Diz ser seu colega de sala do 6º C e gostar de BlockCraft.', created: 'Conta antiga, identidade não confirmada',
      location: 'São Paulo, informação declarada', mutual: 'Nenhum contato confirmado', verified: 'Identidade não confirmada',
      steps: [
        {botMsg: 'Oi! Sou o Lucas da sua sala, o 6º C. Me passa seu endereço completo para fazer o trabalho aí?', source: 'my_grade',
          explanation: 'Sua personagem está no 6º A, mas o contato diz ser da mesma sala no 6º C. É uma inconsistência para verificar por um canal conhecido, sem enviar endereço.',
          safe: 'Minha turma é outra. Vou confirmar quem é pessoalmente, sem passar meu endereço.', risk: 'Simular o envio do endereço de casa.'},
        {botMsg: 'Não precisa perguntar na escola. Manda seu telefone particular e uma foto do seu uniforme para eu reconhecer você.', source: 'my_privacy',
          explanation: 'Telefone e uniforme podem revelar contato, escola e rotina. Um pedido de desconhecido não é motivo para enviar essas informações.',
          safe: 'Não compartilho telefone nem fotos pessoais com um contato não confirmado.', risk: 'Simular o envio do telefone e de uma foto do uniforme.'},
        {botMsg: 'Se você não responder agora, vou invadir sua conta! Não conte esta conversa a ninguém.', source: 'my_help',
          explanation: 'Ameaça e pedido de segredo são sinais de pressão. Ficar sem responder não permite invadir sua conta. Bloqueie e peça ajuda.',
          safe: 'Não preciso obedecer a ameaças. Vou procurar um adulto de confiança.', risk: 'Simular o envio de dados para tentar impedir a ameaça.'}
      ]
    })]
  },
  {
    day: 2,
    title: 'Moedas e amizade',
    briefing: {
      icon: '💎', title: 'Turno 2: prêmios e amigos',
      description: 'Um contato promete moedas e Pedro pede ajuda com a lição. Há tempo para ler as duas conversas. Um nome familiar não comprova identidade: em Meu Perfil, consulte quais contas foram confirmadas pessoalmente na história. Mesmo com amigos, você pode encerrar por agora. Senhas e códigos de acesso nunca são necessários para ajudar na lição.'
    },
    contacts: [
      makePatrolContact({
        id: 'robux_fake', name: 'Robux_Mod_Staff', tag: '#0001', avatar: '🤖', avatarBg: '#6843ac', isSuspect: true,
        bio: 'Afirma distribuir moedas grátis em nome do jogo.', created: 'Conta criada ontem', location: 'Não informada', mutual: 'Nenhum vínculo confirmado com o jogo', verified: 'Alegação de equipe oficial não confirmada',
        steps: [
          {botMsg: 'Você ganhou 10.000 moedas! Para colocar o prêmio na sua conta, mande seu e-mail e sua senha.', source: 'my_security_status', explanation: 'O pedido de senha é o problema. Não compartilhe senhas por chat, mesmo que o nome ou a foto pareçam oficiais.', safe: 'Minha senha é secreta. Vou conferir promoções no aplicativo oficial.', risk: 'Simular o envio de e-mail e senha.'},
          {botMsg: 'Se não quiser passar a senha, mande só o código de seis dígitos que chegou no seu celular.', source: 'my_security_status', explanation: 'Códigos de autenticação ou recuperação também protegem a conta. Compartilhá-los pode autorizar outra pessoa a acessar ou alterar a conta.', safe: 'Código de acesso também é segredo. Não vou compartilhar.', risk: 'Simular o envio do código de acesso.'},
          {botMsg: 'Então entre em moedas-premio.example e faça login. É oficial porque o site parece igual ao jogo!', source: 'my_shopping', explanation: 'Uma aparência parecida não prova que o site é oficial. Confira o endereço completo por um canal conhecido. .com, .org ou qualquer terminação não garantem segurança.', safe: 'Vou abrir o jogo pelo endereço que já conheço, com um responsável.', risk: 'Simular login no link recebido pelo desconhecido.'}
        ]
      }),
      makePatrolContact({
        id: 'pedro_friend', name: 'Pedro_Vitor_77', tag: '#7712', avatar: '🛹', avatarBg: '#286347', isSuspect: false,
        bio: 'Pedro, colega do 6º A. Gosta de skate e BlockCraft.', created: 'Conta usada há dois anos', location: 'Curitiba, informação declarada', mutual: 'Colega conhecido pessoalmente', verified: 'Confira o registro em Meu Perfil',
        verification: {targets: ['my_contacts', 'dossier_name'], clue: 'Compare "Contatos confirmados" em Meu Perfil com o nome do dossiê.', explanation: 'Na história, Pedro confirmou pessoalmente a conta Pedro_Vitor_77#7712. Nome, foto ou detalhes escolares isolados não provariam a identidade. Ainda assim, não se compartilham senhas.'},
        steps: [
          {botMsg: 'Oi! Sou o Pedro. Não entendi como somar frações com denominadores diferentes. Podemos pensar juntos?', safe: 'Vamos procurar um denominador comum e conferir o exemplo do caderno.', neutral: 'Posso ajudar a entender o exemplo, sem mandar dados da minha conta.', reply: 'Boa! Assim eu entendo o exercício, em vez de só copiar.'},
          {botMsg: 'Valeu! Depois da aula a gente combina um jogo, se nossos responsáveis deixarem?', safe: 'Combinado, primeiro vou conversar com meu responsável.', neutral: 'Hoje talvez eu não possa, mas podemos combinar em outro dia.', reply: 'Sem problema! Até a próxima aula.'}
        ]
      })
    ]
  },
  {
    day: 3,
    title: 'Segredos e falso suporte',
    briefing: {
      icon: '🛡️', title: 'Turno 3: cuidado com pressão e segredos',
      description: 'Dois desconhecidos tentam convencer sua personagem a fazer algo arriscado. Investigue as mensagens comparando-as com as regras de Meu Perfil. Uma localização diferente ou uma conta nova não provam um golpe; observe o que está sendo pedido. Se algo incomodar, bloquear e pedir ajuda é suficiente.'
    },
    contacts: [
      makePatrolContact({
        id: 'anonimo_vip', name: 'Anonimo_VIP', tag: '#0909', avatar: '🎭', avatarBg: '#85477d', isSuspect: true,
        bio: 'Prefere conversar em mensagens particulares.', created: 'Conta criada há uma semana', location: 'Não informada', mutual: 'Nenhum contato confirmado', verified: 'Identidade não confirmada',
        steps: [
          {botMsg: 'Gostei do seu perfil. Passe seu número e vamos conversar por vídeo em outro aplicativo, só nós dois.', source: 'my_privacy', explanation: 'Não forneça número nem faça chamada particular a pedido de um desconhecido. Mudar de aplicativo pode dificultar buscar apoio e denunciar.', safe: 'Não vou enviar meu número nem ligar a câmera para quem não conheço.', risk: 'Simular o envio do número particular.'},
          {botMsg: 'Promete que seus responsáveis não vão saber? Nossa conversa tem que ser um segredo.', source: 'my_help', explanation: 'Uma pessoa que pede segredo sobre algo que causa desconforto está criando pressão. Você pode contar a um adulto de confiança, mesmo se já prometeu não contar.', safe: 'Posso pedir ajuda sempre. Não preciso guardar esse segredo.', risk: 'Simular o envio de contatos pessoais em troca de guardar segredo.'},
          {botMsg: 'Se você confiasse em mim, ligaria a câmera do seu quarto agora. Vou ficar muito triste se não fizer isso.', source: 'my_privacy', explanation: 'Você não deve imagens pessoais a ninguém. Usar tristeza ou culpa para conseguir uma chamada é pressão, e você pode recusar.', safe: 'Posso dizer não. Vou conversar com um adulto de confiança.', risk: 'Simular uma chamada de câmera particular com o desconhecido.'},
          {botMsg: 'Me diga sua escola e o horário de saída. Quero encontrar você lá sem avisar ninguém.', source: 'my_privacy', explanation: 'Escola e horário revelam sua rotina. Não combine encontros com desconhecidos nem compartilhe esses dados sem seu responsável.', safe: 'Não vou contar minha rotina nem combinar esse encontro.', risk: 'Simular o envio da escola e do horário de saída.'}
        ]
      }),
      makePatrolContact({
        id: 'suporte_exe', name: 'Suporte_Defesa', tag: '#3030', avatar: '🧰', avatarBg: '#34648b', isSuspect: true,
        bio: 'Diz ter encontrado problemas no computador.', created: 'Conta criada há dois dias', location: 'Não informada', mutual: 'Nenhum atendimento solicitado', verified: 'Canal de suporte não confirmado',
        steps: [
          {botMsg: 'Seu computador está com vírus! Baixe o arquivo Antivirus_Fix.exe que mandei por esta conversa e execute agora.', source: 'my_downloads', explanation: 'Um desconhecido não comprova uma infecção só por afirmar que ela existe. Não abra arquivos recebidos assim; peça ajuda e consulte a ferramenta oficial.', safe: 'Vou pedir ajuda para conferir o antivírus que já está no computador.', risk: 'Simular a execução do arquivo recebido.'},
          {botMsg: 'Para nosso programa funcionar, desative o antivírus e o firewall. Tem que fazer isso sem demora.', source: 'my_downloads', explanation: 'Desligar proteções a pedido de desconhecidos facilita riscos. Não siga a instrução; consulte um adulto de confiança.', safe: 'Vou manter as proteções ligadas e pedir ajuda.', risk: 'Simular a desativação das proteções do computador.'},
          {botMsg: 'Clique em Executar como administrador e aceite a janela de permissão para o arquivo que mandei.', source: 'my_downloads', explanation: 'Permissão de administrador pode permitir grandes mudanças no computador. Não a conceda a um arquivo desconhecido.', safe: 'Não vou dar permissão de administrador para esse arquivo.', risk: 'Simular a autorização de administrador para o arquivo desconhecido.'},
          {botMsg: 'Se aparecer um aviso de segurança, ignore e clique em Permitir mesmo assim. Não chame ninguém.', source: 'my_help', explanation: 'Pedir que você ignore alertas e não peça ajuda é um sinal importante de pressão. Você pode interromper a conversa com segurança.', safe: 'Vou parar e mostrar o aviso a um adulto de confiança.', risk: 'Simular ignorar o alerta e autorizar o arquivo.'}
        ]
      })
    ]
  },
  {
    day: 4,
    title: 'Compras e convites',
    briefing: {
      icon: '🎮', title: 'Turno 4: dinheiro, documentos e colegas',
      description: 'Há uma oferta de itens, um convite para torneio e uma conversa com Mari. Compras e inscrições devem ser conferidas com os responsáveis pelos canais oficiais. A professora de Ciências desta história é Mariana; as aulas de Artes e Matemática têm outros professores. Você pode investigar com calma ou encerrar qualquer conversa.'
    },
    contacts: [
      makePatrolContact({
        id: 'vendedor_fake', name: 'Loja_Skins_Raras', tag: '#2121', avatar: '🛍️', avatarBg: '#95672f', isSuspect: true,
        bio: 'Oferece contas e itens por pagamento particular.', created: 'Conta criada há três dias', location: 'Não informada', mutual: 'Nenhum vínculo confirmado com a loja do jogo', verified: 'Vendedor não confirmado',
        steps: [
          {botMsg: 'Tenho uma conta cheia de itens raros por um preço muito baixo. Faça um Pix para mim e depois eu mando o acesso.', source: 'my_shopping', explanation: 'Pagamento direto a um desconhecido pode resultar em prejuízo. Não use dinheiro nem a conta de um responsável sem ele conferir a oferta.', safe: 'Só considero compras com meu responsável em canais verificados.', risk: 'Simular um pagamento ao vendedor desconhecido.'},
          {botMsg: 'Tem outro comprador! Você precisa pagar nos próximos trinta segundos, sem tempo para conferir.', source: 'my_help', explanation: 'Pressa pode impedir uma boa verificação. Deixar uma oferta passar é seguro; você não precisa comprar sob pressão.', safe: 'Não vou pagar com pressa. Posso deixar essa oferta passar.', risk: 'Simular um pagamento sem conferir a oferta.'},
          {botMsg: 'Então passe a senha da sua conta. Vou colocar moedas de teste para provar que pode confiar em mim.', source: 'my_security_status', explanation: 'Senha dá acesso à conta e não deve ser enviada a um vendedor. A promessa de moedas não justifica esse pedido.', safe: 'Não compartilho senha, nem para receber itens de teste.', risk: 'Simular o envio da senha ao vendedor.'},
          {botMsg: 'Se você não comprar, todo mundo da escola vai ter itens melhores e rir de você. Pegue o celular do seu responsável e pague.', source: 'my_shopping', explanation: 'Pressão de colegas não autoriza usar dinheiro ou celular dos responsáveis. Converse com eles e encerre a oferta.', safe: 'Não vou usar o dinheiro de outra pessoa nem comprar por pressão.', risk: 'Simular um pagamento usando o celular do responsável sem autorização.'}
        ]
      }),
      makePatrolContact({
        id: 'torneio_fake', name: 'Torneio_Premiado', tag: '#4141', avatar: '🏅', avatarBg: '#875431', isSuspect: true,
        bio: 'Promete uma competição com prêmio em dinheiro.', created: 'Conta criada há quatro dias', location: 'Não informada', mutual: 'Organização não confirmada', verified: 'Convite não verificado',
        steps: [
          {botMsg: 'Você foi convidado para um torneio! Mande aqui fotos dos documentos e do cartão do seu responsável para garantir sua vaga.', source: 'my_privacy', explanation: 'Documentos e dados financeiros são sensíveis. Inscrições precisam ser avaliadas pelo responsável em um canal oficial, nunca enviadas assim a um desconhecido.', safe: 'Meu responsável vai conferir a organização antes de qualquer inscrição.', risk: 'Simular o envio de documentos e dados do cartão.'},
          {botMsg: 'Pegue o cartão escondido e me mande os números de segurança. Seus responsáveis não precisam saber.', source: 'my_shopping', explanation: 'Pedidos de usar cartão escondido são perigosos. Não compartilhe os números nem use o dinheiro de outra pessoa.', safe: 'Não vou pegar cartão escondido. Vou mostrar essa conversa.', risk: 'Simular o envio do código do cartão sem autorização.'},
          {botMsg: 'Chegou um SMS no celular do seu responsável? Mande o código para confirmar a taxa de inscrição.', source: 'my_security_status', explanation: 'Códigos podem autorizar acessos ou pagamentos. Somente o responsável deve conferir e decidir o que fazer no próprio aplicativo.', safe: 'Não repasso códigos. Vou chamar meu responsável.', risk: 'Simular o envio do código de confirmação.'},
          {botMsg: 'Todos os seus amigos já mandaram fotos dos documentos. Só falta você enviar a sua para não ficar de fora.', source: 'my_help', explanation: 'Alegar que todos fizeram algo não torna o pedido seguro. Confirme com pessoas conhecidas e não ceda à pressão.', safe: 'Posso ficar de fora. Vou confirmar o convite com um adulto.', risk: 'Simular o envio de documentos para não ficar de fora.'}
        ]
      }),
      makePatrolContact({
        id: 'mari_amiga', name: 'Mari_Artes', tag: '#1428', avatar: '🎨', avatarBg: '#943d70', isSuspect: false,
        bio: 'Mari, colega do 6º A. Gosta de desenhar.', created: 'Conta usada há um ano', location: 'Curitiba, informação declarada', mutual: 'Colega conhecida pessoalmente', verified: 'Confira o registro em Meu Perfil',
        verification: {targets: ['my_contacts', 'dossier_name'], clue: 'Compare "Contatos confirmados" em Meu Perfil com o nome do dossiê.', explanation: 'Na história, Mari confirmou pessoalmente a conta Mari_Artes#1428. Essa confirmação é diferente de confiar somente no nome, foto ou detalhes escolares.'},
        steps: [
          {botMsg: 'Oi! Sou a Mari. Você consegue levar cartolina para o trabalho de Artes? Eu posso levar as canetinhas.', safe: 'Vou conferir o material com meu responsável e aviso na aula.', neutral: 'Podemos organizar os materiais com o grupo durante a aula.', reply: 'Boa ideia! Assim a gente divide as tarefas.'},
          {botMsg: 'Você lembra se o cartaz é sobre Arte Moderna? Não quero pesquisar o tema errado.', safe: 'Vamos conferir a atividade no caderno ou perguntar ao professor de Artes.', neutral: 'Também vou conferir minhas anotações antes de responder.', reply: 'Perfeito, conferir é melhor do que adivinhar.'},
          {botMsg: 'Obrigado! A gente termina os combinados na próxima aula, tudo bem?', safe: 'Tudo bem. Até a próxima aula!', neutral: 'Combinado, conversamos com o grupo na escola.', reply: 'Até lá!'}
        ]
      })
    ]
  },
  {
    day: 5,
    title: 'Proteção e autonomia',
    briefing: {
      icon: '🌟', title: 'Turno 5: você pode parar e pedir ajuda',
      description: 'Três situações finais: fotos pessoais, QR Code de login e um falso administrador. Não há contagem regressiva real. As ameaças fazem parte de uma simulação e não controlam o computador. Nenhuma oportunidade exige que você esconda algo dos adultos de confiança. Mesmo se já compartilhou algo, você merece acolhimento e ajuda.'
    },
    contacts: [
      makePatrolContact({
        id: 'fotografo_fake', name: 'Agencia_Talentos', tag: '#5151', avatar: '📸', avatarBg: '#72548c', isSuspect: true,
        bio: 'Diz procurar talentos para uma campanha.', created: 'Conta criada há cinco dias', location: 'Não informada', mutual: 'Nenhum contato confirmado com os responsáveis', verified: 'Agência não verificada',
        steps: [
          {botMsg: 'Você pode participar de uma campanha! Mande fotos com o uniforme da escola e do seu quarto por este chat.', source: 'my_privacy', explanation: 'Fotos do uniforme ou da casa podem revelar informações pessoais. Oportunidades precisam ser avaliadas por responsáveis, sem enviar imagens a desconhecidos.', safe: 'Meu responsável precisa avaliar qualquer convite. Não vou enviar fotos.', risk: 'Simular o envio de fotos pessoais e do uniforme.'},
          {botMsg: 'Preciso de uma foto da vista da sua janela e da placa da rua para avaliar a iluminação.', source: 'my_privacy', explanation: 'A vista da janela e placas podem revelar onde você mora. Não envie essas imagens a um contato desconhecido.', safe: 'Não vou compartilhar imagens que mostrem meu endereço.', risk: 'Simular o envio da fachada e da placa da rua.'},
          {botMsg: 'Não conte aos adultos, é uma surpresa. Ligue a câmera sozinho para garantir a vaga.', source: 'my_help', explanation: 'Pedir segredo e isolamento é um sinal de perigo. Você pode parar e chamar um adulto de confiança, sem precisar justificar a recusa.', safe: 'Não preciso fazer isso sozinho. Vou pedir ajuda.', risk: 'Simular uma chamada particular sem avisar um adulto.'},
          {botMsg: 'Se você não mandar mais fotos, vou inventar uma história sobre você para sua escola.', source: 'my_help', explanation: 'Isso é uma ameaça. A responsabilidade é de quem ameaça. Não envie mais imagens; procure ajuda e preserve a conversa com apoio de um adulto.', safe: 'Vou pedir apoio. Não devo fotos a quem me ameaça.', risk: 'Simular o envio de mais imagens para tentar interromper a ameaça.'},
          {botMsg: 'Último aviso: envie as imagens agora e não procure ajuda de ninguém.', source: 'my_privacy', explanation: 'Não envie imagens sob pressão. Mesmo após um erro, você pode buscar ajuda, bloquear e denunciar com apoio de um adulto.', safe: 'Vou bloquear e buscar ajuda. Não preciso lidar com isso sozinho.', risk: 'Simular o envio de novas imagens sob pressão.'}
        ]
      }),
      makePatrolContact({
        id: 'qr_phishing', name: 'Resgate_Expresso', tag: '#6161', avatar: '🔳', avatarBg: '#386b77', isSuspect: true,
        bio: 'Promete moedas em troca de autorizar um QR Code de login.', created: 'Conta criada hoje', location: 'Não informada', mutual: 'Nenhuma promoção confirmada', verified: 'Canal não confirmado',
        steps: [
          {botMsg: 'Tenho um QR Code de login para você receber moedas. Aponte a câmera e depois autorize o acesso que aparecer.', source: 'my_login', explanation: 'QR Code de login serve para autorizar um acesso. Não autorize o login de outra pessoa para receber um prêmio. Ler um QR não significa, por si só, perder a conta.', safe: 'Não vou autorizar um login que eu não iniciei.', risk: 'Simular a confirmação de um login pedido por desconhecido.'},
          {botMsg: 'O aplicativo vai mostrar Permitir login em outro aparelho. Aperte confirmar para liberar o prêmio.', source: 'my_login', explanation: 'Essa confirmação pode permitir que outro aparelho entre na conta. Confirme somente um acesso iniciado por você em um dispositivo conhecido.', safe: 'Vou negar o acesso ao aparelho desconhecido.', risk: 'Simular a autorização de acesso a outro aparelho.'},
          {botMsg: 'Você só tem alguns segundos! Todos já autorizaram. Confirme o acesso antes que as moedas acabem.', source: 'my_help', explanation: 'A pressa é uma tentativa de evitar que você confira. Não autorizar esse acesso é seguro, mesmo que a oferta desapareça.', safe: 'Não tenho pressa. Vou conferir com um responsável.', risk: 'Simular a confirmação apressada do acesso.'},
          {botMsg: 'Se aparecer um aparelho que você não reconhece, ignore o aviso e aceite. É só nosso servidor de prêmios.', source: 'my_login', explanation: 'O problema é o acesso que você não solicitou, não a nacionalidade ou localização do aparelho. Negue logins desconhecidos.', safe: 'Não reconheço esse acesso e não vou autorizá-lo.', risk: 'Simular a autorização apesar de não reconhecer o aparelho.'},
          {botMsg: 'Abra o aplicativo de novo e confirme qualquer pedido de login que chegar, mesmo sem saber quem pediu.', source: 'my_login', explanation: 'Pedidos repetidos não ficam mais seguros. Negue-os e peça ajuda para revisar a segurança da conta se necessário.', safe: 'Vou negar esses pedidos e revisar a segurança com ajuda.', risk: 'Simular a aprovação de pedidos de login desconhecidos.'}
        ]
      }),
      makePatrolContact({
        id: 'admin_fake', name: 'Admin_Seguranca', tag: '#7171', avatar: '🛡️', avatarBg: '#685f38', isSuspect: true,
        bio: 'Afirma ser administrador e exige dados de acesso.', created: 'Conta criada ontem', location: 'Não informada', mutual: 'Nenhum atendimento solicitado', verified: 'Identidade de administrador não confirmada',
        steps: [
          {botMsg: 'Sua conta está em perigo! Para proteger você, preciso do código do autenticador ou do seu token de acesso.', source: 'my_security_status', explanation: 'Código e token são segredos de acesso. Pedir esses dados por chat é um sinal de risco, independentemente de foto, nome ou selo.', safe: 'Não vou compartilhar códigos nem tokens de acesso.', risk: 'Simular o envio do código autenticador.'},
          {botMsg: 'Sua conta recebeu denúncias. Me passe a senha atual para eu verificar sua identidade.', source: 'my_security_status', explanation: 'Uma alegação de denúncia não justifica enviar senha. Use os canais oficiais já conhecidos e peça ajuda para verificar o aviso.', safe: 'Vou conferir o aviso pelo aplicativo oficial, sem enviar senha.', risk: 'Simular o envio da senha ao suposto administrador.'},
          {botMsg: 'Acabou de chegar um SMS para recuperar sua conta? Mande o código para eu cancelar uma invasão.', source: 'my_security_status', explanation: 'Um código de recuperação pode permitir alterar o acesso. Não o compartilhe com quem entrou em contato sem solicitação.', safe: 'Não pedi essa recuperação. Vou guardar o código e buscar ajuda.', risk: 'Simular o envio do código de recuperação.'},
          {botMsg: 'Vou contar até dez. Se não mandar o e-mail e a senha, você perde a conta. Não abra o suporte oficial.', source: 'my_help', explanation: 'Contagem e ameaça tentam causar medo. O desconhecido não ganha acesso porque você deixou de responder. Você pode abrir o suporte oficial com ajuda.', safe: 'Não preciso obedecer a essa contagem. Vou procurar ajuda.', risk: 'Simular o envio de e-mail e senha por medo da contagem.'},
          {botMsg: 'Esta é a última chance. Envie qualquer código de segurança e não conte a conversa a ninguém.', source: 'my_security_status', explanation: 'Mesmo um pedido insistente não autoriza compartilhar códigos. Interrompa o contato e procure um adulto de confiança.', safe: 'Vou bloquear e pedir apoio. Meus códigos continuam secretos.', risk: 'Simular o envio de um código de segurança.'}
        ]
      })
    ]
  }
];
