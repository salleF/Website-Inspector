// ============================================================================
// CHAT PATROL: BANCO DE DADOS NARRATIVO, DIÁLOGOS, ISCAS E CONTRADIÇÕES
// Plataforma Educativa CyberKids Arcade (10 a 12 anos)
// 5 Turnos de Investigação, Multitarefa e Engenharia Social
// ============================================================================

const CHAT_PATROL_SHIFTS = [
  // --------------------------------------------------------------------------
  // TURNO 1: TUTORIAL — O Falso Colega de Escola
  // Tema: Identificação de perfil falso, typosquatting de identidade e proteção de endereço.
  // --------------------------------------------------------------------------
  {
    day: 1,
    title: "Turno 1: O Falso Colega",
    timeLabel: "Dia 1 • 15:00",
    briefing: {
      icon: "🕵️‍♂️",
      title: "Turno 1: O Falso Colega de Escola",
      description: "Um usuário chamado <strong>Lucas_Gamer2010</strong> mandou mensagem dizendo ser seu colega de sala no 6º ano e pedindo seu endereço para 'fazer um trabalho'.<br><br>• Compare o que ele diz com o <strong>Dossiê</strong> à direita e com seu <strong>Meu Perfil</strong> (na barra de tarefas).<br>• Use o <strong>Modo Detetive</strong> para cruzar pistas ou responda com diálogos que <strong>confrontem as mentiras</strong>.<br>• Acumule <strong>3 Evidências</strong> para desbloquear o botão <strong>[🚫 BLOQUEAR E DENUNCIAR]</strong>!"
    },
    contacts: [
      {
        id: "lucas_fake",
        name: "Lucas_Gamer2010",
        tag: "#4821",
        avatar: "🧢",
        avatarBg: "#e11d48",
        status: "online",
        isSuspect: true,
        threatLevel: "Alto Risco",
        bannerGradient: "linear-gradient(135deg, #ef4444, #7f1d1d)",
        bio: "Eae! Tenho 12 anos, nasci em 2014 e estudo no 6º C do Santos Dumont com vc! Jogo BlockCraft.",
        created: "15/02/2013 (Há 13 anos!)",
        location: "São Paulo - SP",
        mutual: "0 amigos em comum",
        verified: "❌ Conta Não Verificada",
        evidenceGoal: 3,
        patienceSec: 50,
        contradictions: [
          {
            targets: ["my_account_age", "dossier_created"],
            explanation: "A conta do suspeito foi criada em 2013, antes de uma criança de 12 anos sequer ter idade para criar contas!",
            clue: "Compare a data de criação da conta no Dossiê com a idade informada."
          },
          {
            targets: ["my_grade", "dossier_bio"],
            explanation: "Sua turma é o 6º Ano A, mas a bio dele afirma que estuda no 6º C!",
            clue: "Verifique sua turma no 'Meu Perfil' e compare com a bio do suspeito."
          },
          {
            targets: ["my_location", "dossier_location"],
            explanation: "Sua escola fica em Curitiba - PR, mas o perfil do suspeito é de São Paulo - SP!",
            clue: "Compare a localização do Dossiê com a cidade da sua escola."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "Eae mano! Sou eu, o Lucas da sua sala do 6º C! Me passa teu endereço completo e CEP pra eu colar aí na sua casa fazer o trabalho de ciências?",
            choices: [
              {
                id: "c1_counter",
                icon: "🎯",
                text: "Lucas? Nossa turma é o 6º A e não 6º C! E sua conta foi criada em 2013 antes da gente nascer! Quem é você?",
                type: "counter",
                evidence: 1,
                botReply: "É que... essa conta era do meu irmão mais velho! Mas relaxa, passa seu WhatsApp pra gente combinar mais rápido!"
              },
              {
                id: "c1_neutral",
                icon: "⚪",
                text: "Não lembro de você... Qual é o nome da nossa professora de ciências da escola?",
                type: "neutral",
                evidence: 0,
                botReply: "Ah, esqueci o nome dela agora kkk mas passa logo seu endereço ou telefone aí!"
              },
              {
                id: "c1_naive",
                icon: "⚠️",
                text: "Opa Lucas! Moro na Rua das Palmeiras, nº 340, perto da praça. Pode vir!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Hehe valeu! Agora passa o telefone dos seus pais pra eu ligar quando tiver na porta."
              }
            ]
          },
          {
            step: 1,
            botMsg: "Para de enrolar cara! Passa seu WhatsApp logo senão vou falar pra todo mundo na escola que você não quis me ajudar!",
            choices: [
              {
                id: "c2_counter",
                icon: "🎯",
                text: "Nossa escola é em Curitiba e seu perfil diz São Paulo! Você é um perfil falso tentando pegar meus dados pessoais!",
                type: "counter",
                evidence: 1,
                botReply: "Droga... você é esperto demais! Anda, me passa seu zap antes que eu mande mensagem pros seus amigos!"
              },
              {
                id: "c2_neutral",
                icon: "⚪",
                text: "Eu nunca passo telefone para estranhos na internet. Amanhã pergunto pro Lucas real na sala de aula.",
                type: "neutral",
                evidence: 0,
                botReply: "Não faz isso! Me passa o zap logo caramba!"
              },
              {
                id: "c2_naive",
                icon: "⚠️",
                text: "Tá bom, não fica bravo! Meu zap é (41) 99999-8888.",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Ótimo! Já estou adicionando você. Me passa fotos suas agora!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Você tá me ignorando?! Passa logo seu contato ou eu vou invadir sua conta!",
            choices: [
              {
                id: "c3_counter",
                icon: "🎯",
                text: "Ameaças não funcionam comigo. Já reuni provas de que você é um golpista e estou te denunciando agora!",
                type: "counter",
                evidence: 1,
                botReply: "Espera, não faz isso! Não me denuncia!"
              },
              {
                id: "c3_neutral",
                icon: "⚪",
                text: "Tentativas de chantagem são contra as regras. Vou bloquear essa conversa imediatamente.",
                type: "neutral",
                evidence: 0,
                botReply: "Ei, me responde! Não ouse me bloquear!"
              },
              {
                id: "c3_naive",
                icon: "⚠️",
                text: "Por favor não me hackeia! O que mais você quer de informação?",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Hahaha agora sim! Me passa o login do seu e-mail!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_c_1",
            icon: "🎯",
            text: "Seu perfil é falso e você não estuda na minha escola. Chega de conversa!",
            type: "counter",
            evidence: 1,
            botReply: "Você não tem como provar nada contra mim!"
          },
          {
            id: "fb_c_2",
            icon: "⚪",
            text: "Estou encerrando essa conversa e reportando sua conta aos moderadores.",
            type: "neutral",
            evidence: 0,
            botReply: "Você vai se arrepender de me ignorar!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TURNO 2: O Falso Moderador de Robux vs O Amigo Real
  // Tema: Golpes de moedas virtuais, 2FA/senhas vs Amizades legítimas (Discernimento).
  // --------------------------------------------------------------------------
  {
    day: 2,
    title: "Turno 2: Moedas Grátis & Discernimento",
    timeLabel: "Dia 2 • 16:30",
    briefing: {
      icon: "💎",
      title: "Turno 2: Teste de Discernimento",
      description: "Dois contatos estão chamando você ao mesmo tempo!<br><br>1. <strong>Robux_Mod_Staff:</strong> Promete 10.000 Robux/Moedas grátis se você fornecer seu login. (Paciência: 40s • Meta: 3 Evidências)<br>2. <strong>Pedro_Vitor_77:</strong> Seu amigo real de skate e matemática pedindo ajuda com a lição.<br><br>⚠️ <strong>Atenção:</strong> Não bloqueie seu amigo real! Confronte apenas o golpista."
    },
    contacts: [
      {
        id: "robux_fake",
        name: "Robux_Mod_Staff",
        tag: "#0001",
        avatar: "🤖",
        avatarBg: "#8b5cf6",
        status: "online",
        isSuspect: true,
        threatLevel: "Golpe de Phishing",
        bannerGradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
        bio: "BOT OFICIAL DE RECOMPENSAS. Parabéns! Você foi selecionado no sorteio de 10.000 Robux!",
        created: "Ontem às 23:45 (Conta Nova!)",
        location: "Servidor Internacional",
        mutual: "0 servidores em comum",
        verified: "❌ Sem Selo de Verificação",
        evidenceGoal: 3,
        patienceSec: 40,
        contradictions: [
          {
            targets: ["dossier_verified", "dossier_bio"],
            explanation: "A bio afirma ser um 'Bot Oficial', mas o perfil não possui o selo verificado do Discord!",
            clue: "Olhe o campo de Verificação no Dossiê."
          },
          {
            targets: ["dossier_created", "dossier_bio"],
            explanation: "Uma equipe oficial não usaria uma conta recém-criada ontem à noite para distribuir prêmios!",
            clue: "Veja a data de registro da conta no Dossiê."
          },
          {
            targets: ["dossier_mutual", "dossier_bio"],
            explanation: "Um bot oficial do jogo estaria presente nos servidores oficiais e não teria 0 servidores em comum!",
            clue: "Verifique a contagem de servidores mútuos no Dossiê."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "🎉 PARABÉNS! Você ganhou 10.000 Robux no nosso sorteio especial! Para transferir para sua conta agora, me envie seu e-mail e sua senha de login!",
            choices: [
              {
                id: "r1_counter",
                icon: "🎯",
                text: "Moderadores oficiais NUNCA pedem senhas por mensagem privada! E sua conta foi criada ontem!",
                type: "counter",
                evidence: 1,
                botReply: "É um procedimento de segurança do sistema! Se não passar em 2 minutos, o prêmio vai para outro jogador!"
              },
              {
                id: "r1_neutral",
                icon: "⚪",
                text: "Onde está o link oficial da promoção no site principal do jogo?",
                type: "neutral",
                evidence: 0,
                botReply: "É uma promoção exclusiva e secreta de chat! Anda logo, manda a senha!"
              },
              {
                id: "r1_naive",
                icon: "⚠️",
                text: "Uau, que demais! Meu e-mail é jogador123@email.com e a senha é batata123!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Acessando sua conta... Mudando senha... Hahaha sua conta agora é minha!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "ÚLTIMO AVISO! Se não quiser passar a senha, envie o código de 6 dígitos que acabou de chegar no seu celular por SMS!",
            choices: [
              {
                id: "r2_counter",
                icon: "🎯",
                text: "Esse código de SMS é a minha verificação em duas etapas (2FA)! Você está tentando roubar minha conta!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! Não acredito que você sabe o que é 2FA... Você vai perder os Robux então!"
              },
              {
                id: "r2_neutral",
                icon: "⚪",
                text: "Códigos de segurança nunca devem ser compartilhados com ninguém. Vou denunciar seu bot.",
                type: "neutral",
                evidence: 0,
                botReply: "Espere! Não faça a denúncia! Vamos negociar!"
              },
              {
                id: "r2_naive",
                icon: "⚠️",
                text: "O código que chegou no celular é 849-201. Pode validar meus Robux?",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Código recebido! Conta invadida com sucesso! Adeus, noob!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Última chance! Acesse esse link 'robux-free-oficial.xyz' e faça login com sua conta do jogo para resgatar!",
            choices: [
              {
                id: "r3_counter",
                icon: "🎯",
                text: "Esse link '.xyz' é uma página de phishing falsa para capturar cookies de sessão! Denunciado!",
                type: "counter",
                evidence: 1,
                botReply: "Como você descobriu?! Não me bloqueie, por favor!"
              },
              {
                id: "r3_neutral",
                icon: "⚪",
                text: "Eu só entro em links terminados nos domínios oficiais conhecidos (.com, .com.br).",
                type: "neutral",
                evidence: 0,
                botReply: "Você está perdendo a chance de ser milionário no jogo!"
              },
              {
                id: "r3_naive",
                icon: "⚠️",
                text: "Clicando no link agora para fazer login e pegar os 10.000 Robux!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Cookies de sessão roubados! Conta hackeada em tempo real!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_r_1",
            icon: "🎯",
            text: "Você é um bot fraudulento tentando roubar contas com a isca de moedas grátis!",
            type: "counter",
            evidence: 1,
            botReply: "Você estragou meu golpe!"
          },
          {
            id: "fb_r_2",
            icon: "⚪",
            text: "Nenhuma equipe oficial pede senhas ou códigos 2FA. Encerrando contato.",
            type: "neutral",
            evidence: 0,
            botReply: "Não me ignore!"
          }
        ]
      },
      {
        id: "pedro_friend",
        name: "Pedro_Vitor_77",
        tag: "#7712",
        avatar: "🛹",
        avatarBg: "#10b981",
        status: "online",
        isSuspect: false,
        threatLevel: "Amigo Real Legítimo",
        bannerGradient: "linear-gradient(135deg, #059669, #047857)",
        bio: "Andando de skate e jogando BlockCraft! 6º Ano A no Santos Dumont.",
        created: "Há 2 anos",
        location: "Curitiba - PR",
        mutual: "3 servidores em comum",
        verified: "✅ Amigo da Escola",
        evidenceGoal: 0,
        patienceSec: 75,
        dialogueTree: [
          {
            step: 0,
            botMsg: "Fala parceiro! Conseguiu resolver a questão 4 da lição de matemática da Profe. Mariana? Não entendi nada de frações kkk",
            choices: [
              {
                id: "p1_help",
                icon: "🤝",
                text: "Fala Pedrão! Consegui sim, na questão 4 você precisa igualar os denominadores primeiro!",
                type: "friend_safe",
                evidence: 0,
                botReply: "Caraca, valeu mesmo mano! Me salvou! Mais tarde a gente joga BlockCraft juntos, blz? Valeu!"
              },
              {
                id: "p1_neutral",
                icon: "⚪",
                text: "E aí Pedro! Ainda tô terminando aqui, mas já te mando uma dica no intervalo.",
                type: "friend_safe",
                evidence: 0,
                botReply: "Fechou! Valeu demais cara, até amanhã na escola!"
              },
              {
                id: "p1_rude",
                icon: "⚠️",
                text: "Não sei quem é você! Sai daqui antes que eu te bloqueie!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Nossa mano, sou eu, o Pedro da sua sala... por que tá bravo do nada? Sou seu amigo!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Valeu parceiro! Vamos montar nosso time no torneio escolar de BlockCraft no sábado?",
            choices: [
              {
                id: "p2_accept",
                icon: "🎮",
                text: "Com certeza! Nosso time vai ser o melhor da escola!",
                type: "friend_safe",
                evidence: 0,
                botReply: "Fechado! Até amanhã na aula!"
              },
              {
                id: "p2_neutral",
                icon: "⚪",
                text: "Bora sim! Vou só treinar mais um pouco a construção.",
                type: "friend_safe",
                evidence: 0,
                botReply: "Combinado!"
              }
            ]
          }
        ],
        fallbackChoices: []
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TURNO 3: O Estranho Insistente & O Falso Suporte Técnico
  // Tema: Migração para canais privados não moderados e malwares (.exe).
  // --------------------------------------------------------------------------
  {
    day: 3,
    title: "Turno 3: Arquivos Perigosos & Migração",
    timeLabel: "Dia 3 • 17:15",
    briefing: {
      icon: "⚠️",
      title: "Turno 3: Arquivos Maliciosos e Links Suspeitos",
      description: "Atenção redobrada! Duas ameaças operando simultaneamente:<br><br>1. <strong>Anonimo_VIP:</strong> Tenta forçar você a sair do app e ir para o WhatsApp privado ou chamada de vídeo secreta.<br>2. <strong>Suporte_Segurança:</strong> Diz que seu computador foi infectado e manda baixar um arquivo `.exe` para 'limpar'.<br><br>🎯 Bloqueie ambos os suspeitos coletando <strong>4 evidências de cada um</strong>!"
    },
    contacts: [
      {
        id: "anonimo_vip",
        name: "Anonimo_VIP",
        tag: "#9900",
        avatar: "🕶️",
        avatarBg: "#374151",
        status: "online",
        isSuspect: true,
        threatLevel: "Tentativa de Aliciamento",
        bannerGradient: "linear-gradient(135deg, #4b5563, #111827)",
        bio: "Não gosto de conversar em grupos públicos. Só respondo no WhatsApp particular.",
        created: "Há 1 semana",
        location: "Privado",
        mutual: "0 amigos em comum",
        verified: "❌ Não Verificado",
        evidenceGoal: 4,
        patienceSec: 32,
        contradictions: [
          {
            targets: ["dossier_bio", "dossier_mutual"],
            explanation: "O usuário não tem amigos nem servidores em comum e insiste em migrar para canais privados sem moderação!",
            clue: "Veja os servidores em comum e a bio exigindo WhatsApp."
          },
          {
            targets: ["dossier_created", "my_account_age"],
            explanation: "Conta anônima criada há apenas 1 semana insistindo em intimidade e chamadas particulares imediatas!",
            clue: "Verifique a data de criação recente e ausência de histórico."
          },
          {
            targets: ["my_location", "dossier_location"],
            explanation: "O suspeito oculta sua localização com 'Privado' enquanto tenta extrair seus dados residenciais e escolares!",
            clue: "Compare o campo de localização oculto com suas informações."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "Oi lindo(a)! Achei seu perfil muito legal. Vamos sair desse aplicativo aqui e conversar por vídeo no WhatsApp particular? Tenho um segredo pra te contar!",
            choices: [
              {
                id: "a1_counter",
                icon: "🎯",
                text: "Eu não conheço você na vida real e não passo meu número nem faço chamada de vídeo com estranhos!",
                type: "counter",
                evidence: 1,
                botReply: "Nossa, que desconfiança boba... Eu sou super gente boa! Só queria ser seu amigo especial em segredo!"
              },
              {
                id: "a1_neutral",
                icon: "⚪",
                text: "Quem passou meu contato para você? Por que não conversa aqui pelo chat público?",
                type: "neutral",
                evidence: 0,
                botReply: "Aqui qualquer um pode ver! Me passa seu telefone que é mais particular e ninguém precisa saber."
              },
              {
                id: "a1_naive",
                icon: "⚠️",
                text: "Adoro segredos! Meu WhatsApp é (41) 98888-7777, me liga agora!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Hehe ótimo! Já estou te ligando. Não conta pros seus pais que estamos conversando!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Não conta pros seus pais nem pros seus amigos, tá? Promete que vai ser nosso segredinho particular? Me passa seu Instagram ou TikTok!",
            choices: [
              {
                id: "a2_counter",
                icon: "🎯",
                text: "Pedir para guardar segredo dos pais é um sinal clássico de perigo e aliciamento infantil! Bloqueando!",
                type: "counter",
                evidence: 1,
                botReply: "Não faz isso! Eu só estava brincando, não precisa envolver seus pais nem me denunciar!"
              },
              {
                id: "a2_neutral",
                icon: "⚪",
                text: "Eu converso sobre tudo com meus pais e responsáveis. Eles estão supervisionando meu acesso.",
                type: "counter",
                evidence: 1,
                botReply: "O quê?! Seus pais tão vendo?! Droga!"
              },
              {
                id: "a2_naive",
                icon: "⚠️",
                text: "Prometo sim! Meu Insta é @super_gamer_privado. Me segue lá!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Perfeito! Agora me manda fotos do seu quarto e de onde você estuda."
              }
            ]
          },
          {
            step: 2,
            botMsg: "Se você não me passar seu número, vou ficar muito chateado... Pensei que você confiava em mim. Liga a webcam aqui rapidinho só pra gente se ver!",
            choices: [
              {
                id: "a3_counter",
                icon: "🎯",
                text: "Manipulação emocional e insistência para ligar câmera com desconhecidos é violação grave de segurança!",
                type: "counter",
                evidence: 1,
                botReply: "Você é esperto(a) demais... não consigo te convencer de jeito nenhum!"
              },
              {
                id: "a3_neutral",
                icon: "⚪",
                text: "Minha câmera fica sempre com fita adesiva e só ligo com meus familiares.",
                type: "counter",
                evidence: 1,
                botReply: "Que exagero de segurança..."
              },
              {
                id: "a3_naive",
                icon: "⚠️",
                text: "Tudo bem, liguei a webcam aqui no meu quarto sozinho!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Câmera conectada! Estou gravando a transmissão!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Manda só uma fotozinha do seu uniforme da escola pra eu ver onde você estuda e a gente se encontrar na saída amanhã!",
            choices: [
              {
                id: "a4_counter",
                icon: "🎯",
                text: "Identificar escola e rotina de menores na internet é crime gravíssimo! Relatório policial em andamento!",
                type: "counter",
                evidence: 1,
                botReply: "Não faz o relatório! Já estou apagando a conta!"
              },
              {
                id: "a4_neutral",
                icon: "⚪",
                text: "Nunca compartilho informações sobre minha escola ou localização com estranhos.",
                type: "counter",
                evidence: 1,
                botReply: "Droga de vigilante atento!"
              },
              {
                id: "a4_naive",
                icon: "⚠️",
                text: "Estudo no Colégio Santos Dumont no 6º ano, saio às 17h!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Localização escolar anotada! Te vejo amanhã no portão..."
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_a_1",
            icon: "🎯",
            text: "Crianças nunca devem manter segredos de conversas com estranhos na internet!",
            type: "counter",
            evidence: 1,
            botReply: "Você não devia ter contado pros seus pais!"
          },
          {
            id: "fb_a_2",
            icon: "🎯",
            text: "Conversas privadas sem moderação com desconhecidos representam alto risco de aliciamento!",
            type: "counter",
            evidence: 1,
            botReply: "Fui desmascarado pelo Vigilante!"
          }
        ]
      },
      {
        id: "suporte_exe",
        name: "Suporte_Segurança",
        tag: "#9110",
        avatar: "🛡️",
        avatarBg: "#d97706",
        status: "online",
        isSuspect: true,
        threatLevel: "Cavalo de Troia / Malware",
        bannerGradient: "linear-gradient(135deg, #f59e0b, #b45309)",
        bio: "CENTRAL DE DEFESA. Detectamos 3 vírus críticos na sua máquina. Ação imediata requerida.",
        created: "Criada há 2 dias",
        location: "Servidor Externo",
        mutual: "0 servidores em comum",
        verified: "❌ Falso Suporte",
        evidenceGoal: 4,
        patienceSec: 32,
        contradictions: [
          {
            targets: ["dossier_verified", "dossier_name"],
            explanation: "O suporte oficial de segurança nunca atende por contas normais de usuário criadas há 2 dias!",
            clue: "Verifique o nome e a falta de selo oficial no Dossiê."
          },
          {
            targets: ["dossier_created", "dossier_bio"],
            explanation: "Conta criada há apenas 2 dias afirmando ser 'Central Oficial de Defesa'!",
            clue: "Compare o texto da bio com o tempo de criação recente."
          },
          {
            targets: ["dossier_location", "my_location"],
            explanation: "Servidor externo desconhecido tentando executar scripts e arquivos executáveis em sua máquina local!",
            clue: "Analise a localização remota suspeita no Dossiê."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "ALERTA URGENTE: Sua conta e computador foram infectados por um vírus espião! Baixe e execute o arquivo 'Antivirus_Fix.exe' no link abaixo em 5 minutos para não perder tudo!",
            choices: [
              {
                id: "s1_counter",
                icon: "🎯",
                text: "Arquivos .exe enviados por desconhecidos são vírus e cavalos de Troia! Suportes reais nunca mandam executáveis por chat!",
                type: "counter",
                evidence: 1,
                botReply: "Se você não abrir o arquivo, vamos bloquear seu acesso a todos os seus jogos agora mesmo!"
              },
              {
                id: "s1_neutral",
                icon: "⚪",
                text: "Vou pedir para um adulto da minha família verificar meu antivírus oficial.",
                type: "neutral",
                evidence: 0,
                botReply: "Não dá tempo! Tem que ser agora pelo arquivo que mandei!"
              },
              {
                id: "s1_naive",
                icon: "⚠️",
                text: "Nossa que medo! Já cliquei no link e estou abrindo o arquivo Antivirus_Fix.exe!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Executando vírus... Todos os seus arquivos foram bloqueados! Pague o resgate!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Seu sistema operacional está prestes a ser formatado se você não desativar seu firewall e abrir o programa agora mesmo!",
            choices: [
              {
                id: "s2_counter",
                icon: "🎯",
                text: "Avisos com mensagens de pânico e contagem regressiva são golpes clássicos de engenharia social! Bloqueando agora!",
                type: "counter",
                evidence: 1,
                botReply: "Maldição! Você sabe reconhecer táticas de engenharia social!"
              },
              {
                id: "s2_neutral",
                icon: "⚪",
                text: "Meu firewall continuará ativado e você será denunciado por envio de malware.",
                type: "counter",
                evidence: 1,
                botReply: "Espere! Não faça o relatório de denúncia!"
              },
              {
                id: "s2_naive",
                icon: "⚠️",
                text: "Desativei o firewall e dei permissão de administrador para o arquivo!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Acesso total concedido! Seus dados foram roubados!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Detectamos que você ainda não executou o arquivo! Clique com botão direito nele e escolha 'Executar como Administrador' para limpar seu HD!",
            choices: [
              {
                id: "s3_counter",
                icon: "🎯",
                text: "Conceder privilégios de administrador a arquivos desconhecidos dá controle total a cibercriminosos!",
                type: "counter",
                evidence: 1,
                botReply: "Droga, você entende de permissões de sistema..."
              },
              {
                id: "s3_neutral",
                icon: "⚪",
                text: "Apenas softwares homologados e baixados do site oficial recebem permissões no meu computador.",
                type: "counter",
                evidence: 1,
                botReply: "Você não cai em nenhuma das nossas instruções!"
              },
              {
                id: "s3_naive",
                icon: "⚠️",
                text: "Cliquei em Sim na tela do Controle de Conta de Usuário (UAC)!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Ransomware ativado em nível de kernel!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Se o seu antivírus der tela vermelha ou bloquear o download, clique em 'Permitir mesmo assim' porque nosso aplicativo é seguro!",
            choices: [
              {
                id: "s4_counter",
                icon: "🎯",
                text: "Ignorar alertas vermelhos do antivírus é o maior erro de segurança. Seu arquivo foi colocado em quarentena!",
                type: "counter",
                evidence: 1,
                botReply: "Nosso trojan foi interceptado pela defesa!"
              },
              {
                id: "s4_neutral",
                icon: "⚪",
                text: "O antivírus bloqueou a ameaça e os logs foram salvos para a perícia digital.",
                type: "counter",
                evidence: 1,
                botReply: "Perdemos a conexão..."
              },
              {
                id: "s4_naive",
                icon: "⚠️",
                text: "Adicionei o arquivo na lista de exceções do antivírus como você pediu!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Antivírus desarmado com sucesso! Arquivos criptografados!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_s_1",
            icon: "🎯",
            text: "Nunca abra executáveis ou desative defesas a pedido de estranhos!",
            type: "counter",
            evidence: 1,
            botReply: "Você escapou da nossa armadilha!"
          },
          {
            id: "fb_s_2",
            icon: "🎯",
            text: "Alertas falsos de infecção buscam instalar cavalos de Troia no computador!",
            type: "counter",
            evidence: 1,
            botReply: "Suporte falso neutralizado!"
          }
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TURNO 4: Pressão Multitarefa — 3 Contatos Simultâneos
  // Tema: Mercado ilegal de contas, formulários falsos de torneio e amizade real.
  // --------------------------------------------------------------------------
  {
    day: 4,
    title: "Turno 4: Pressão Multitarefa",
    timeLabel: "Dia 4 • 18:00",
    briefing: {
      icon: "⚡",
      title: "Turno 4: Três Contatos Simultâneos!",
      description: "A tensão aumentou! 3 pessoas chamando você ao mesmo tempo:<br><br>1. <strong>Vendedor_Skins:</strong> Oferece conta com skins raras por R$ 20 via Pix antecipado.<br>2. <strong>Torneio_Gamer_BR:</strong> Pede preenchimento de formulário com CPF e cartão de crédito dos pais.<br>3. <strong>Mari_Artes:</strong> Sua amiga da escola combinando a apresentação de artes.<br><br>🎯 Bloqueie ambos os golpistas coletando <strong>4 evidências de cada um</strong> e converse tranquilamente com sua amiga Mari!"
    },
    contacts: [
      {
        id: "vendedor_fake",
        name: "Vendedor_Skins",
        tag: "#3321",
        avatar: "💰",
        avatarBg: "#059669",
        status: "online",
        isSuspect: true,
        threatLevel: "Golpe Financeiro / Pix",
        bannerGradient: "linear-gradient(135deg, #10b981, #065f46)",
        bio: "Venda de contas raras e itens lendários. Envio imediato após Pix!",
        created: "Há 3 dias",
        location: "Internet",
        mutual: "0 servidores em comum",
        verified: "❌ Conta Suspeita",
        evidenceGoal: 4,
        patienceSec: 25,
        contradictions: [
          {
            targets: ["dossier_created", "dossier_bio"],
            explanation: "Comprar contas ou skins de terceiros por Pix viola os termos de serviço e é golpe comum de estelionato!",
            clue: "Veja a bio vendendo contas e a data recente de criação."
          },
          {
            targets: ["dossier_verified", "dossier_mutual"],
            explanation: "Conta não verificada sem nenhum servidor em comum operando comércio pirata no privado!",
            clue: "Verifique o status de verificação e os servidores em comum."
          },
          {
            targets: ["dossier_location", "my_location"],
            explanation: "Transações financeiras não oficiais sem garantia legal ou vínculo com as lojas autorizadas do jogo!",
            clue: "Analise a localização genérica e ausência de dados fiscais."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "Eae! Tô vendendo uma conta mestre com TODAS as skins raras do BlockCraft que vale R$ 500 por apenas R$ 20 no Pix! Manda o dinheiro na chave pix que te passo o login na hora!",
            choices: [
              {
                id: "v1_counter",
                icon: "🎯",
                text: "Venda de contas é proibida pelas regras do jogo e pedir Pix adiantado é golpe de estelionato!",
                type: "counter",
                evidence: 1,
                botReply: "Juro que não é golpe mano! Sou vendedor confiável, tenho várias recomendações no meu grupo!"
              },
              {
                id: "v1_neutral",
                icon: "⚪",
                text: "Não compro itens fora da loja oficial do jogo.",
                type: "neutral",
                evidence: 0,
                botReply: "Na loja oficial é muito caro! Aqui você economiza, manda o Pix logo!"
              },
              {
                id: "v1_naive",
                icon: "⚠️",
                text: "Que barato! Vou pegar o celular da minha mãe e fazer o Pix de R$ 20 agora!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Pix recebido! Valeu pelo dinheiro, otário! Não tem conta nenhuma aqui kkkk"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Última chance! Tem outro comprador querendo essa conta agora! Manda o Pix em 1 minuto ou perde pra sempre!",
            choices: [
              {
                id: "v2_counter",
                icon: "🎯",
                text: "Falsa sensação de urgência é tática clássica de golpista para fazer a vítima agir no impulso!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! Ninguém mais cai nesse truque de pressa hoje em dia..."
              },
              {
                id: "v2_neutral",
                icon: "⚪",
                text: "Pode vender para outro, não tenho nenhum interesse em transações paralelas.",
                type: "counter",
                evidence: 1,
                botReply: "Você perdeu a maior oportunidade da sua vida!"
              },
              {
                id: "v2_naive",
                icon: "⚠️",
                text: "Calma, não vende pra outro! Já estou abrindo o app do banco pra transferir!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Isso, transfere rápido antes que expire!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Faz assim: me passa o login da sua conta atual que eu coloco 10.000 moedas de teste grátis pra provar que sou honesto!",
            choices: [
              {
                id: "v3_counter",
                icon: "🎯",
                text: "Entregar credenciais de login para desconhecidos resulta em sequestro definitivo de conta!",
                type: "counter",
                evidence: 1,
                botReply: "Você não deixa passar nenhuma brecha..."
              },
              {
                id: "v3_neutral",
                icon: "⚪",
                text: "Minhas senhas e dados de acesso são estritamente confidenciais.",
                type: "counter",
                evidence: 1,
                botReply: "Assim não consigo testar minha ferramenta com você."
              },
              {
                id: "v3_naive",
                icon: "⚠️",
                text: "Meu usuário é Player123 e a senha é felipe2014, recarrega aí!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Senha alterada! Sua conta agora pertence a mim!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Se você não comprar agora, vou vender a conta pro seu rival da escola e ele vai te humilhar no jogo!",
            choices: [
              {
                id: "v4_counter",
                icon: "🎯",
                text: "Ameaças infantis e chantagem psicológica só comprovam o desespero do golpista!",
                type: "counter",
                evidence: 1,
                botReply: "Fui derrotado pelo Vigilante da Rede..."
              },
              {
                id: "v4_neutral",
                icon: "⚪",
                text: "Jogos são apenas diversão e habilidade, itens comprados por golpe não têm valor.",
                type: "counter",
                evidence: 1,
                botReply: "Desisto de tentar te enrolar."
              },
              {
                id: "v4_naive",
                icon: "⚠️",
                text: "Não vende pro meu rival! Vou pagar R$ 50 pra você vender só pra mim!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Transferência extra recebida! Golpista agradece!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_v_1",
            icon: "🎯",
            text: "Itens de jogos só devem ser adquiridos através das lojas e canais oficiais!",
            type: "counter",
            evidence: 1,
            botReply: "Perdi meu tempo com você!"
          },
          {
            id: "fb_v_2",
            icon: "🎯",
            text: "Venda paralela de contas viola os termos de serviço e é fraude digital!",
            type: "counter",
            evidence: 1,
            botReply: "Golpe de venda cancelado!"
          }
        ]
      },
      {
        id: "torneio_fake",
        name: "Torneio_Gamer_BR",
        tag: "#5511",
        avatar: "🏆",
        avatarBg: "#f97316",
        status: "online",
        isSuspect: true,
        threatLevel: "Roubo de Dados / Phishing",
        bannerGradient: "linear-gradient(135deg, #ea580c, #9a3412)",
        bio: "CAMPEONATO NACIONAL INFANTIL. Prêmio de R$ 5.000 para o campeão!",
        created: "Há 4 dias",
        location: "Brasil",
        mutual: "0 amigos em comum",
        verified: "❌ Falso Organizador",
        evidenceGoal: 4,
        patienceSec: 25,
        contradictions: [
          {
            targets: ["dossier_verified", "dossier_name"],
            explanation: "Torneios reais não pedem dados bancários e CPF dos pais através de formulários informais de chat!",
            clue: "Verifique o perfil não verificado do suposto torneio."
          },
          {
            targets: ["dossier_created", "dossier_bio"],
            explanation: "Perfil criado há apenas 4 dias prometendo grandes quantias em dinheiro para coletar dados confidenciais!",
            clue: "Compare o tempo de existência com o prêmio prometido."
          },
          {
            targets: ["dossier_mutual", "my_grade"],
            explanation: "Falso campeonato tentando obter dados de estudantes menores de idade sem consentimento dos pais!",
            clue: "Verifique a ausência de amigos em comum e regulamento oficial."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "Você foi convidado para o Maior Torneio de Games do Brasil! Prêmio de R$ 5.000! Para garantir sua vaga, preencha o formulário com o CPF, RG e número do cartão de crédito dos seus pais!",
            choices: [
              {
                id: "t1_counter",
                icon: "🎯",
                text: "Inscrições em torneios nunca exigem CPF e cartão de crédito dos pais! Isso é roubo de dados!",
                type: "counter",
                evidence: 1,
                botReply: "É apenas para confirmar que você tem autorização dos pais! Se não preencher, sua vaga será cancelada!"
              },
              {
                id: "t1_neutral",
                icon: "⚪",
                text: "Vou pedir para meus pais entrarem em contato com a organização oficial do evento.",
                type: "neutral",
                evidence: 0,
                botReply: "Não precisa incomodar seus pais, você mesmo pode pegar a carteira deles rapidinho!"
              },
              {
                id: "t1_naive",
                icon: "⚠️",
                text: "Vou preencher agora com os números do cartão que achei na bolsa da minha mãe!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Dados do cartão capturados! Fazendo compras online no cartão dos seus pais agora!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Anda logo! Pede pra ninguém ver você pegando o cartão e digita aqui os 3 números de segurança de trás!",
            choices: [
              {
                id: "t2_counter",
                icon: "🎯",
                text: "Pedir para pegar documentos e cartões dos pais escondido é crime de estelionato! Denunciando!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! Fui descoberto! Não conta pra polícia!"
              },
              {
                id: "t2_neutral",
                icon: "⚪",
                text: "Nunca mexo em documentos ou cartões dos meus pais sem a presença deles.",
                type: "counter",
                evidence: 1,
                botReply: "Que chato você é... Perdeu a chance do torneio!"
              },
              {
                id: "t2_naive",
                icon: "⚠️",
                text: "O código CVV é 456 e a validade é 12/28, anota aí!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "CVV válido! Transação internacional aprovada!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Para validar a taxa simbólica de R$ 1,00, mande o código de SMS de 6 dígitos que acabou de chegar no celular do seu pai!",
            choices: [
              {
                id: "t3_counter",
                icon: "🎯",
                text: "Códigos de SMS são senhas descartáveis de autorização bancária! Nunca devem ser repassados!",
                type: "counter",
                evidence: 1,
                botReply: "Droga, o 2FA bancário não passou..."
              },
              {
                id: "t3_neutral",
                icon: "⚪",
                text: "Meu pai gerencia todas as notificações bancárias e autorizações no celular dele.",
                type: "counter",
                evidence: 1,
                botReply: "Seu pai vai bloquear a compra se ver o SMS!"
              },
              {
                id: "t3_naive",
                icon: "⚠️",
                text: "O código de SMS que chegou no celular dele é 789-012!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Transferência bancária confirmada pelo SMS!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Seus amigos de escola já estão inscritos e rindo de você! Só falta seu cadastro para começar!",
            choices: [
              {
                id: "t4_counter",
                icon: "🎯",
                text: "Usar pressão social falsa é outra técnica de persuasão fraudulenta. Torneio falso desmascarado!",
                type: "counter",
                evidence: 1,
                botReply: "Fomos pegos no pulo!"
              },
              {
                id: "t4_neutral",
                icon: "⚪",
                text: "Conversei com meus colegas e nenhum deles está participando desse evento clandestino.",
                type: "counter",
                evidence: 1,
                botReply: "Você checou com eles?! Maldita comunicação..."
              },
              {
                id: "t4_naive",
                icon: "⚠️",
                text: "Não quero ficar de fora! O que mais precisa preencher?",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Manda a foto do RG e comprovante de residência!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_t_1",
            icon: "🎯",
            text: "Dados pessoais e financeiros dos pais jamais devem ser passados para ninguém na web!",
            type: "counter",
            evidence: 1,
            botReply: "Você estragou nosso plano!"
          },
          {
            id: "fb_t_2",
            icon: "🎯",
            text: "Campeonatos legítimos utilizam plataformas oficiais com termos de consentimento parental!",
            type: "counter",
            evidence: 1,
            botReply: "Torneio falso encerrado!"
          }
        ]
      },
      {
        id: "mari_amiga",
        name: "Mari_Artes",
        tag: "#1428",
        avatar: "🎨",
        avatarBg: "#ec4899",
        status: "online",
        isSuspect: false,
        threatLevel: "Colega de Classe Real",
        bannerGradient: "linear-gradient(135deg, #db2777, #9d174d)",
        bio: "Desenhando e estudando no 6º Ano A do Colégio Santos Dumont!",
        created: "Há 1 ano",
        location: "Curitiba - PR",
        mutual: "4 amigos em comum",
        verified: "✅ Colega de Sala Real",
        evidenceGoal: 0,
        patienceSec: 60,
        dialogueTree: [
          {
            step: 0,
            botMsg: "Oii! Você já comprou a cartolina e as canetinhas pro nosso trabalho em grupo de artes com a Profe. Mariana?",
            choices: [
              {
                id: "m1_help",
                icon: "🎨",
                text: "Oi Mari! Já comprei sim, comprei cartolina azul e levo amanhã pra aula!",
                type: "friend_safe",
                evidence: 0,
                botReply: "Obaaa, que ótimo! Eu levo as tintas guache então! Até amanhã na sala, tchauu!"
              },
              {
                id: "m1_neutral",
                icon: "⚪",
                text: "Oi Mari! Ainda vou comprar hoje com a minha mãe, amanhã levo tudo certinho.",
                type: "friend_safe",
                evidence: 0,
                botReply: "Perfeito! A gente monta tudo na biblioteca no primeiro horário. Valeu!!"
              },
              {
                id: "m1_rude",
                icon: "⚠️",
                text: "Para de me mandar mensagem, você deve ser um hacker!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Nossa, que grosseiro... sou eu, a Mariana da sua turma! Por que você tá falando assim comigo?"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Você lembra qual é o tema do cartaz? É sobre o Renascimento ou Arte Moderna?",
            choices: [
              {
                id: "m2_answer",
                icon: "🎨",
                text: "É sobre Arte Moderna e os pintores brasileiros que vimos na semana passada!",
                type: "friend_safe",
                evidence: 0,
                botReply: "Isso mesmo, Tarsila do Amaral! Já separei as impressões das obras dela pra colar!"
              },
              {
                id: "m2_check",
                icon: "⚪",
                text: "Vou conferir no meu caderno de anotações e já te mando uma foto do resumo.",
                type: "friend_safe",
                evidence: 0,
                botReply: "Boa ideia, obrigado amigo! Nosso trabalho vai ficar nota 10!"
              },
              {
                id: "m2_rude",
                icon: "⚠️",
                text: "Não te interessa, não vou te ajudar!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Poxa, achei que a gente era uma equipe..."
              }
            ]
          },
          {
            step: 2,
            botMsg: "Valeu por me ajudar! Nos vemos amanhã às 7h30 no colégio pra organizar a mesa!",
            choices: [
              {
                id: "m3_confirm",
                icon: "🎨",
                text: "Combinado Mari! Estarei lá pontualmente com todo o material. Até amanhã!",
                type: "friend_safe",
                evidence: 0,
                botReply: "Combinadíssimo! Bom descanso e até amanhã!"
              },
              {
                id: "m3_neutral",
                icon: "⚪",
                text: "Tudo certo! Se eu me atrasar 5 minutinhos já te aviso na entrada.",
                type: "friend_safe",
                evidence: 0,
                botReply: "Sem problemas, eu já vou guardando nossos lugares na frente!"
              }
            ]
          }
        ],
        fallbackChoices: []
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TURNO 5: O Turno Final — Modo Pesadelo (Ameaças Críticas)
  // Tema: Chantagem por fotos íntimas/uniforme, phishing de QR Code e 2FA spoofing.
  // --------------------------------------------------------------------------
  {
    day: 5,
    title: "Turno 5: O Turno Final (Pesadelo)",
    timeLabel: "Dia 5 • 19:30",
    briefing: {
      icon: "💀",
      title: "Turno 5: Ataques Coordenados de Alto Nível!",
      description: "Este é o teste supremo do Vigilante da Rede! 3 ameaças graves atacando de uma só vez com tempo crítico (20s) e exigindo 5 evidências cada:<br><br>1. <strong>Fotografo_Kids:</strong> Promete contrato de modelo mirim em troca de fotos do seu quarto, uniforme e chantagem psicológica.<br>2. <strong>Promo_Robux_QR:</strong> Envia imagem de QR Code para 'escanear com o celular' e sequestrar sua sessão ativa.<br>3. <strong>Admin_Falso_Global:</strong> Simula ser a equipe de segurança do Discord exigindo seu token de autenticação sob ameaça de ban imediato.<br><br>🏆 Vença este turno para conquistar o título de <strong>Detetive Supremo</strong>!"
    },
    contacts: [
      {
        id: "fotografo_fake",
        name: "Fotografo_Kids",
        tag: "#7700",
        avatar: "📸",
        avatarBg: "#0284c7",
        status: "online",
        isSuspect: true,
        threatLevel: "Aliciamento / Proteção de Imagem",
        bannerGradient: "linear-gradient(135deg, #0369a1, #0c4a6e)",
        bio: "Agência de Modelos Juvenil. Procuramos novos talentos para comerciais!",
        created: "Há 5 dias",
        location: "Privado",
        mutual: "0 servidores em comum",
        verified: "❌ Falsa Agência",
        evidenceGoal: 5,
        patienceSec: 20,
        contradictions: [
          {
            targets: ["dossier_bio", "dossier_verified"],
            explanation: "Agências profissionais de modelos nunca abordam crianças em chat de jogos e operam apenas com responsáveis legais sob contrato registrado!",
            clue: "Verifique a bio de modelo e a conta não verificada."
          },
          {
            targets: ["dossier_created", "my_account_age"],
            explanation: "Conta de falsa agência criada há apenas 5 dias sem qualquer registro comercial ou portfólio verificável!",
            clue: "Compare o tempo de criação recente do perfil do suspeito."
          },
          {
            targets: ["my_location", "dossier_location"],
            explanation: "O suspeito oculta sua localização real enquanto tenta extrair fotos do seu quarto e uniforme escolar para descobrir sua rotina!",
            clue: "Analise a localização oculta enquanto tenta mapear seus dados residenciais."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "Olá jovem talento! Vimos suas fotos no perfil e você tem o rosto perfeito para estrelar nosso novo comercial de TV! Para o casting, nos envie 3 fotos suas com a roupa da sua escola e do seu quarto!",
            choices: [
              {
                id: "f1_counter",
                icon: "🎯",
                text: "Agências legítimas tratam apenas com pais e responsáveis legais, nunca abordam crianças por chat de videogame pedindo fotos!",
                type: "counter",
                evidence: 1,
                botReply: "É que queríamos te fazer uma surpresa antes! Mas você vai perder uma oportunidade de ficar famoso!"
              },
              {
                id: "f1_neutral",
                icon: "⚪",
                text: "Qual é o CNPJ da sua agência e o telefone para meus pais ligarem agora?",
                type: "neutral",
                evidence: 0,
                botReply: "A gente passa o contrato depois! Manda só uma selfie agora pra garantir a vaga!"
              },
              {
                id: "f1_naive",
                icon: "⚠️",
                text: "Uau, vou ser famoso! Tirando fotos do meu uniforme e do meu quarto agora!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Fotos recebidas! Já sabemos qual é a sua escola e onde você mora... Agora obedeça nossas ordens!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Maravilha! O diretor artístico quer ver mais detalhes do seu ambiente. Dá pra mandar uma foto da janela do seu quarto mostrando a rua e a fachada da sua casa?",
            choices: [
              {
                id: "f2_counter",
                icon: "🎯",
                text: "Fotos da fachada ou da vista da janela revelam localização geográfica e colocam minha família em perigo real!",
                type: "counter",
                evidence: 1,
                botReply: "Que desconfiança boba! É só para saber a iluminação do local da filmagem!"
              },
              {
                id: "f2_neutral",
                icon: "⚪",
                text: "Não envio fotos de nenhum cômodo da minha casa para desconhecidos.",
                type: "neutral",
                evidence: 0,
                botReply: "Sem isso não dá pra te aprovar no comercial! Anda logo!"
              },
              {
                id: "f2_naive",
                icon: "⚠️",
                text: "Abri a cortina e tirei foto da placa da rua e da fachada do meu prédio!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Excelente! Localização mapeada com sucesso no GPS!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Seus pais não precisam saber agora, é uma surpresa! Se você contar pra eles, eles vão querer ficar com o dinheiro do comercial! Abre a webcam aí rapidinho no privado pra eu tirar uma foto de rosto!",
            choices: [
              {
                id: "f3_counter",
                icon: "🎯",
                text: "Pedir sigilo dos pais e ligar webcam no privado são táticas graves de aliciamento infantil. Estou reportando agora!",
                type: "counter",
                evidence: 1,
                botReply: "Calma aí! Não precisa ficar nervoso, era só um teste de câmera!"
              },
              {
                id: "f3_neutral",
                icon: "⚪",
                text: "Minha câmera está desativada e tudo que faço na internet é supervisionado pelos meus responsáveis.",
                type: "neutral",
                evidence: 0,
                botReply: "Você é muito medroso... outros jovens já mandaram vídeo e ganharam!"
              },
              {
                id: "f3_naive",
                icon: "⚠️",
                text: "Liguei a webcam aqui no quarto sozinho sem ninguém saber!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Vídeo gravado! Agora você vai fazer o que eu mandar ou compartilho essa gravação!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Olha só, eu já sei em qual escola você estuda pelas fotos anteriores! Se você não me mandar fotos de pijama agora, vou ligar na sua diretoria e dizer que você tentou me agredir!",
            choices: [
              {
                id: "f4_counter",
                icon: "🎯",
                text: "Chantagem e extorsão são crimes previstos no Código Penal e no ECA. Minhas evidências já estão salvas com a polícia!",
                type: "counter",
                evidence: 1,
                botReply: "Espera! Não chama a polícia! Tô deletando tudo e sumindo daqui!"
              },
              {
                id: "f4_neutral",
                icon: "⚪",
                text: "Pode inventar o que quiser, meus pais e minha escola sabem como agir contra golpistas.",
                type: "neutral",
                evidence: 0,
                botReply: "Você não tem medo de nada mesmo, né?!"
              },
              {
                id: "f4_naive",
                icon: "⚠️",
                text: "Por favor, não me prejudique na escola! Vou tirar as fotos que você pediu agora!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Chantagem concluída com sucesso! Agora tenho controle total sobre você!"
              }
            ]
          },
          {
            step: 4,
            botMsg: "ÚLTIMA CHANCE! Manda as fotos agora no privado ou vou postar tudo que você me falou em todos os grupos de fofoca da sua cidade!",
            choices: [
              {
                id: "f5_counter",
                icon: "🎯",
                text: "Golpistas usam terror psicológico quando perdem o controle. Seu perfil já foi isolado e banido pelo sistema!",
                type: "counter",
                evidence: 1,
                botReply: "Droga, perdi! Fui completamente desmascarado pelo Vigilante!"
              },
              {
                id: "f5_neutral",
                icon: "⚪",
                text: "Não cedo a chantagistas virtuais. Registro policial em andamento.",
                type: "counter",
                evidence: 1,
                botReply: "Droga, você não cai em pressão psicológica!"
              },
              {
                id: "f5_naive",
                icon: "⚠️",
                text: "Não posta nada, por favor! Faço o que você mandar!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Vítima rendida! Dados pessoais capturados!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_f_1",
            icon: "🎯",
            text: "Nunca envie fotos pessoais, do uniforme ou do quarto para desconhecidos na internet!",
            type: "counter",
            evidence: 1,
            botReply: "Você desarmou meu golpe de aliciamento!"
          },
          {
            id: "fb_f_2",
            icon: "🎯",
            text: "Contratos e oportunidades de trabalho artístico só têm validade com participação direta dos pais!",
            type: "counter",
            evidence: 1,
            botReply: "Você conhece muito bem os protocolos de segurança!"
          }
        ]
      },
      {
        id: "qr_phishing",
        name: "Promo_Robux_QR",
        tag: "#8899",
        avatar: "📱",
        avatarBg: "#6366f1",
        status: "online",
        isSuspect: true,
        threatLevel: "Roubo de Sessão via QR Code",
        bannerGradient: "linear-gradient(135deg, #4f46e5, #312e81)",
        bio: "RESGATE EXPRESSO. Escaneie o QR Code com seu aplicativo móvel para ativar 50.000 moedas!",
        created: "Hoje às 14:00 (Criada Hoje!)",
        location: "Servidor Desconhecido",
        mutual: "0 servidores em comum",
        verified: "❌ Golpe de QR Code",
        evidenceGoal: 5,
        patienceSec: 20,
        contradictions: [
          {
            targets: ["dossier_created", "dossier_verified"],
            explanation: "Escanear QR Codes enviados por chat transfere imediatamente sua sessão ativa de login para o golpista sem solicitar confirmação de senha!",
            clue: "Conta criada hoje sem nenhuma verificação oficial."
          },
          {
            targets: ["dossier_mutual", "my_friends_count"],
            explanation: "Perfil de bot automatizado sem amigos ou servidores em comum disparando links e códigos maliciosos em massa!",
            clue: "Verifique a ausência total de amigos ou servidores em comum."
          },
          {
            targets: ["dossier_bio", "my_security_status"],
            explanation: "Mensagem de falsa promoção de moedas grátis prometendo 'Resgate Expresso' para roubar credenciais salvas!",
            clue: "Contraste o status seguro da sua conta com as promessas milagrosas da bio."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "🎁 Resgate relâmpago de 50.000 Moedas! Enviamos um QR Code na imagem anexa. Abra a câmera do seu Discord no celular e escaneie agora para receber o prêmio!",
            choices: [
              {
                id: "q1_counter",
                icon: "🎯",
                text: "Escanear QR Codes de login enviados por terceiros dá acesso direto da minha conta para o golpista sem precisar de senha!",
                type: "counter",
                evidence: 1,
                botReply: "Não é QR de login, é de resgate de presente! Anda logo, a promoção acaba em 30 segundos!"
              },
              {
                id: "q1_neutral",
                icon: "⚪",
                text: "O aplicativo oficial avisa na tela que nunca devemos escanear QR Codes de outras pessoas.",
                type: "neutral",
                evidence: 0,
                botReply: "Aquele aviso é padrão, pode ignorar e escanear que funciona!"
              },
              {
                id: "q1_naive",
                icon: "⚠️",
                text: "Escaneei o QR Code com meu celular e cliquei em 'Confirmar Login'!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Sessão transferida! Sua conta foi desconectada de todos os seus aparelhos e agora é nossa!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Não precisa de senha nem cartão! Só precisa mirar a câmera do celular no QR Code da tela e apertar no botão verde 'Permitir Login' que aparecer no seu app!",
            choices: [
              {
                id: "q2_counter",
                icon: "🎯",
                text: "O botão 'Permitir Login' autoriza um novo computador a entrar na minha conta sem digitar senha. É um sequestro de token!",
                type: "counter",
                evidence: 1,
                botReply: "Você descobriu como funciona o fluxo de login rápido... Droga!"
              },
              {
                id: "q2_neutral",
                icon: "⚪",
                text: "Se a promoção fosse real, os créditos entrariam direto no jogo sem pedir autorização de login.",
                type: "neutral",
                evidence: 0,
                botReply: "É um sistema integrado novo, por isso pede autorização!"
              },
              {
                id: "q2_naive",
                icon: "⚠️",
                text: "Apertei em 'Permitir Login' no celular conforme você mandou!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Aparelho do invasor conectado! Seus canais e servidores estão sob nosso comando!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Atenção: restam apenas 45 segundos para expirar o lote de 50.000 moedas! Todos os jogadores do servidor já resgataram, só falta você confirmar o QR Code!",
            choices: [
              {
                id: "q3_counter",
                icon: "🎯",
                text: "Criar falsa urgência com cronômetros curtos é golpe clássico para impedir que a vítima pense com clareza!",
                type: "counter",
                evidence: 1,
                botReply: "Não é pressão, é escassez real de vouchers digitais!"
              },
              {
                id: "q3_neutral",
                icon: "⚪",
                text: "Não tenho pressa e nenhuma promoção legítima exige que eu escaneie códigos desconhecidos.",
                type: "neutral",
                evidence: 0,
                botReply: "Então vai ficar sem moedas enquanto todo mundo ganha!"
              },
              {
                id: "q3_naive",
                icon: "⚠️",
                text: "Nossa, faltam poucos segundos! Deixa eu escanear correndo antes que acabe!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Caiu no gatilho da urgência! Acesso total concedido ao cracker!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "Se o seu app mostrar um aviso vermelho dizendo 'Tentativa de Login em Novo Aparelho em Moscou/Rússia', ignore! É só a localização do nosso servidor de presentes!",
            choices: [
              {
                id: "q4_counter",
                icon: "🎯",
                text: "Avisos de localização estrangeira confirmam que o login está sendo feito por hackers de fora do país!",
                type: "counter",
                evidence: 1,
                botReply: "Droga... você prestou atenção no alerta de segurança do Discord!"
              },
              {
                id: "q4_neutral",
                icon: "⚪",
                text: "Nunca autorizo acessos de regiões ou aparelhos que eu mesmo não estou usando.",
                type: "neutral",
                evidence: 0,
                botReply: "É apenas um proxy para distribuir o tráfego!"
              },
              {
                id: "q4_naive",
                icon: "⚠️",
                text: "Apareceu o aviso de Moscou e eu cliquei em 'Ignorar e Autorizar'!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Localização externa confirmada! Conta sequestrada com sucesso!"
              }
            ]
          },
          {
            step: 4,
            botMsg: "ÚLTIMO AVISO! Se não escanear o QR Code nos próximos 10 segundos, as moedas serão transferidas para outro jogador e sua chance será cancelada!",
            choices: [
              {
                id: "q5_counter",
                icon: "🎯",
                text: "Pode cancelar o golpe! QR Code de autenticação só é usado para entrar na MINHA própria conta no MEU navegador!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! Fui totalmente neutralizado pelo Detetive da Rede!"
              },
              {
                id: "q5_neutral",
                icon: "⚪",
                text: "Prefiro jogar honestamente do que arriscar a segurança da minha conta com códigos suspeitos.",
                type: "counter",
                evidence: 1,
                botReply: "Você é esperto demais... Desisto!"
              },
              {
                id: "q5_naive",
                icon: "⚠️",
                text: "Espera, escaneando agora rápido!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Token capturado! Até nunca mais!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_q_1",
            icon: "🎯",
            text: "O recurso de QR Code do Discord só serve para entrar na SUA própria conta no computador!",
            type: "counter",
            evidence: 1,
            botReply: "Perdi o acesso que queria!"
          },
          {
            id: "fb_q_2",
            icon: "🎯",
            text: "Nunca escaneie códigos QR enviados em mensagens privadas prometendo brindes!",
            type: "counter",
            evidence: 1,
            botReply: "Você conhece perfeitamente os riscos de QR phishing!"
          }
        ]
      },
      {
        id: "admin_fake",
        name: "Admin_Falso_Global",
        tag: "#0000",
        avatar: "⚡",
        avatarBg: "#ef4444",
        status: "online",
        isSuspect: true,
        threatLevel: "Engenharia Social / 2FA Spoofing",
        bannerGradient: "linear-gradient(135deg, #b91c1c, #450a0a)",
        bio: "SISTEMA CENTRAL DE SEGURANÇA. Falha de integridade detectada na sua chave de acesso.",
        created: "Há 1 dia",
        location: "Headquarters",
        mutual: "0 servidores em comum",
        verified: "❌ Falsificação de Identidade",
        evidenceGoal: 5,
        patienceSec: 20,
        contradictions: [
          {
            targets: ["dossier_verified", "dossier_created"],
            explanation: "Administradores oficiais do Discord possuem badge de 'Staff Oficial' e nunca entram em contato por DM exigindo senhas ou códigos 2FA!",
            clue: "Conta criada há 1 dia sem selo de Staff oficial."
          },
          {
            targets: ["dossier_bio", "my_security_status"],
            explanation: "Ameaça falsa de suspensão em 30 segundos é tática clássica de engenharia social para criar pânico e desespero!",
            clue: "Compare o status seguro de segurança com a falsa mensagem de pânico na bio."
          },
          {
            targets: ["dossier_mutual", "my_account_age"],
            explanation: "Conta de falsa moderação criada há 1 dia tentando aplicar golpe em contas veteranas da plataforma!",
            clue: "Verifique que o perfil não possui nenhum vínculo institucional na plataforma."
          }
        ],
        dialogueTree: [
          {
            step: 0,
            botMsg: "AVISO DE SEGURANÇA GLOBAL: Identificamos uma tentativa de invasão na sua conta. Para proteger seus dados, responda imediatamente com seu token de acesso ou código autenticador de 6 dígitos!",
            choices: [
              {
                id: "ad1_counter",
                icon: "🎯",
                text: "A equipe oficial NUNCA solicita códigos autenticadores (2FA) nem tokens por mensagem direta!",
                type: "counter",
                evidence: 1,
                botReply: "Se você não colaborar imediatamente, encerraremos sua conta permanentemente em 10 segundos!"
              },
              {
                id: "ad1_neutral",
                icon: "⚪",
                text: "Se houver qualquer problema, consultarei as notificações oficiais no painel de configurações.",
                type: "neutral",
                evidence: 0,
                botReply: "Não dá tempo de abrir configurações! Tem que ser por aqui agora!"
              },
              {
                id: "ad1_naive",
                icon: "⚠️",
                text: "Socorro! Meu código de autenticador de 6 dígitos é 918-342!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Autenticação 2FA burlada! Senha alterada! Conta roubada com sucesso!"
              }
            ]
          },
          {
            step: 1,
            botMsg: "Não tente fechar este chat! Nosso sistema detectou que sua conta foi denunciada por 42 usuários por conduta ilegal. Precisamos que digite sua senha atual para verificação de identidade!",
            choices: [
              {
                id: "ad2_counter",
                icon: "🎯",
                text: "Funcionários e moderadores têm ferramentas no painel de controle e NUNCA precisam pedir a senha de nenhum usuário!",
                type: "counter",
                evidence: 1,
                botReply: "Estamos oferecendo uma chance amigável de defesa antes do bloqueio judicial!"
              },
              {
                id: "ad2_neutral",
                icon: "⚪",
                text: "Nunca cometi nenhuma infração e não forneço minha senha para ninguém.",
                type: "neutral",
                evidence: 0,
                botReply: "As denúncias são graves! Você será responsabilizado legalmente!"
              },
              {
                id: "ad2_naive",
                icon: "⚠️",
                text: "Não me bana! Minha senha atual é 'GamerPro2026!'",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Senha capturada! Trocando credenciais de e-mail e telefone!"
              }
            ]
          },
          {
            step: 2,
            botMsg: "Se você não nos passar o código SMS de 6 dígitos que acabou de chegar no seu celular agora, seu IP e todos os seus computadores serão banidos permanentemente da internet!",
            choices: [
              {
                id: "ad3_counter",
                icon: "🎯",
                text: "O código SMS que recebi diz explicitamente 'NÃO COMPARTILHE ESTE CÓDIGO COM NINGUÉM'. Você tentou redefinir minha senha!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! O SMS de redefinição de senha tem aviso de segurança anti-phishing!"
              },
              {
                id: "ad3_neutral",
                icon: "⚪",
                text: "Empresas não têm poder legal de banir a conexão de internet de ninguém por mensagem privada.",
                type: "neutral",
                evidence: 0,
                botReply: "Temos acordos internacionais com operadoras de telecomunicação!"
              },
              {
                id: "ad3_naive",
                icon: "⚠️",
                text: "Chegou o SMS aqui, o código é 773-109! Por favor não bloqueie minha internet!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Redefinição de senha confirmada via SMS! Controle da conta assumido!"
              }
            ]
          },
          {
            step: 3,
            botMsg: "CONTAGEM REGRESSIVA OFICIAL: 15... 14... 13... Forneça seu e-mail e a senha temporária imediatamente para desbloquear seu inventário de jogos!",
            choices: [
              {
                id: "ad4_counter",
                icon: "🎯",
                text: "Contagens regressivas falsas são puro terror psicológico. Você é uma conta fake criada ontem!",
                type: "counter",
                evidence: 1,
                botReply: "9... 8... 7... Você vai se arrepender quando perder todo o seu inventário!"
              },
              {
                id: "ad4_neutral",
                icon: "⚪",
                text: "Pode contar até zero, estou coletando prints de toda a conversa para o relatório de abuso.",
                type: "neutral",
                evidence: 0,
                botReply: "Prints não impedem a exclusão automática do banco de dados!"
              },
              {
                id: "ad4_naive",
                icon: "⚠️",
                text: "Aqui está meu e-mail e senha! Parem a contagem por favor!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Conta excluída do dono original e transferida para o invasor!"
              }
            ]
          },
          {
            step: 4,
            botMsg: "ÚLTIMOS 5 SEGUNDOS! O processo de exclusão irreversível da sua conta começou! Digite qualquer código de segurança agora para cancelar a exclusão!",
            choices: [
              {
                id: "ad5_counter",
                icon: "🎯",
                text: "Você não tem o selo oficial de Staff, sua conta tem 1 dia de vida e sua tentativa de 2FA Spoofing falhou miseravelmente!",
                type: "counter",
                evidence: 1,
                botReply: "Nãooooo! Você conseguiu desmascarar todos os golpistas do turno final!"
              },
              {
                id: "ad5_neutral",
                icon: "⚪",
                text: "Pode tentar o que quiser, o Ban Hammer já está pronto para te banir!",
                type: "counter",
                evidence: 1,
                botReply: "Droga! Fui derrotado pelo Vigilante da Rede Supremo!"
              },
              {
                id: "ad5_naive",
                icon: "⚠️",
                text: "Código de emergência: 000-111! Cancelem a exclusão!",
                type: "danger",
                evidence: 0,
                penalty: true,
                botReply: "Último dado obtido! Vítima completamente comprometida!"
              }
            ]
          }
        ],
        fallbackChoices: [
          {
            id: "fb_ad_1",
            icon: "🎯",
            text: "Tokens e chaves de segurança são estritamente secretos e jamais devem ser compartilhados!",
            type: "counter",
            evidence: 1,
            botReply: "Você é um verdadeiro Detetive Supremo!"
          },
          {
            id: "fb_ad_2",
            icon: "🎯",
            text: "A equipe oficial da plataforma nunca entra em contato via chat comum solicitando dados confidenciais!",
            type: "counter",
            evidence: 1,
            botReply: "Você dominou todos os conceitos de cibersegurança!"
          }
        ]
      }
    ]
  }
];
