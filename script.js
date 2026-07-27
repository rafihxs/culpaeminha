"use strict";

const APPS = [
  ["conversas","♡","Conversas"],
  ["acolhimento","✦","Acolher"],
  ["trabalho","⌁","Trabalho"],
  ["saudade","☾","Saudade"],
  ["erros","◌","Sinceridade"],
  ["cuidado","◇","Cuidado"],
  ["cartas","✉","Cartas"],
  ["momentos","⋯","Momentos"],
  ["futuro","∞","Futuro"],
  ["qualidades","✧","Qualidades"],
  ["diario","▤","Diário"],
  ["descanso","☁","Descansar"],
  ["memorias","◈","Memórias"],
  ["espelho","◐","Espelho"],
  ["promessas","✓","Promessas"],
  ["cura","✚","Cura"],
  ["abraco","◉","Abraço"],
  ["estrelas","✦","Estrelas"],
  ["dificil","☂","Dia difícil"],
  ["semana","7","Semana"],
  ["energia","⚡","Energia"],
  ["gratidao","❈","Gratidão"],
  ["apagadas","⌫","Apagadas"],
  ["verdades","!","Verdades"],
  ["constelacao","✵","Constelação"],
  ["segredo","⌁","Segredo"],
  ["nos","♥","Nós"]
];

const REQUIRED = APPS
  .map(item => item[0])
  .filter(id => !["segredo","nos"].includes(id));

const state = {
  currentApp:null,
  visited:new Set(),
  mood:null,
  energy:45,
  gameScores:{memory:0,sequence:0,words:0,choices:0,stars:0},
  touchStartY:null,
  toastTimer:null,
  chatRun:0
};

const el = {
  bootStage:document.getElementById("bootStage"),
  lockStage:document.getElementById("lockStage"),
  phoneStage:document.getElementById("phoneStage"),
  bootText:document.getElementById("bootText"),
  bootNumber:document.getElementById("bootNumber"),
  bootProgress:document.getElementById("bootProgress"),
  lockSmallTime:document.getElementById("lockSmallTime"),
  phoneSmallTime:document.getElementById("phoneSmallTime"),
  lockDate:document.getElementById("lockDate"),
  lockTime:document.getElementById("lockTime"),
  greeting:document.getElementById("greeting"),
  unlockButton:document.getElementById("unlockButton"),
  lockTouch:document.getElementById("lockTouch"),
  homePage:document.getElementById("homePage"),
  appPage:document.getElementById("appPage"),
  appsGrid:document.getElementById("appsGrid"),
  moodGrid:document.getElementById("moodGrid"),
  moodAnswer:document.getElementById("moodAnswer"),
  exploredText:document.getElementById("exploredText"),
  explorationNumber:document.getElementById("explorationNumber"),
  explorationProgress:document.getElementById("explorationProgress"),
  explorationMessage:document.getElementById("explorationMessage"),
  todayTitle:document.getElementById("todayTitle"),
  todayText:document.getElementById("todayText"),
  toast:document.getElementById("toast"),
  rainLayer:document.getElementById("rainLayer")
};

const DAILY = [
  [
    "Você é muito importante para mim.",
    "Mesmo nos dias difíceis, você continua sendo alguém que eu admiro, quero proteger e quero ter por perto."
  ],
  [
    "Você merece um carinho que não pesa.",
    "Um carinho que chega devagar, respeita seu silêncio e não transforma seu cansaço em obrigação."
  ],
  [
    "Seu descanso também importa.",
    "Você não precisa provar força o tempo inteiro. Pode apenas existir, respirar e ficar quietinha quando precisar."
  ],
  [
    "Eu gosto de você nos detalhes.",
    "No seu jeito, nas suas manias, na sua presença e até nos dias em que você mal tem energia para conversar."
  ],
  [
    "Você não precisa enfrentar tudo sozinha.",
    "Mesmo quando eu não puder tirar o peso do seu dia, quero que você sinta que existe alguém torcendo por você."
  ]
];

const MOODS = {
  cansada:[
    "Cansada",
    "Pode descansar um pouco aqui. Você não precisa responder, sorrir ou parecer forte."
  ],
  ansiosa:[
    "Ansiosa",
    "Respira devagar. Nada precisa ser resolvido inteiro agora. Só este momento importa."
  ],
  triste:[
    "Triste",
    "Sua tristeza não afasta meu carinho. Você continua sendo especial mesmo quando o dia perde a cor."
  ],
  tranquila:[
    "Mais tranquila",
    "Guarda esse pedacinho de calma. Você merece sentir leveza sem medo de que ela vá embora."
  ]
};

const storage = {
  get(key,fallback=null){
    try{
      const value=localStorage.getItem(key);
      return value===null?fallback:value;
    }catch{
      return fallback;
    }
  },
  set(key,value){
    try{
      localStorage.setItem(key,value);
    }catch{}
  },
  remove(key){
    try{
      localStorage.removeItem(key);
    }catch{}
  }
};

function showToast(message,duration=2400){
  clearTimeout(state.toastTimer);
  el.toast.textContent=message;
  el.toast.classList.add("show");
  state.toastTimer=setTimeout(()=>el.toast.classList.remove("show"),duration);
}

function updateClock(){
  const now=new Date();
  const time=now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
  const date=now.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
  const hour=now.getHours();
  const greeting=hour>=5&&hour<12?"Bom dia":hour>=12&&hour<18?"Boa tarde":"Boa noite";

  el.lockSmallTime.textContent=time;
  el.phoneSmallTime.textContent=time;
  el.lockTime.textContent=time;
  el.lockDate.textContent=date;
  el.greeting.textContent=`${greeting}, Gaby`;
}

function switchStage(target){
  [el.bootStage,el.lockStage,el.phoneStage].forEach(stage=>{
    stage.classList.toggle("stage-hidden",stage!==target);
  });
}

function runBoot(){
  const steps=[
    [8,"Preparando seu espaço..."],
    [21,"Guardando carinho..."],
    [36,"Organizando as mensagens..."],
    [53,"Acendendo as estrelas..."],
    [70,"Deixando tudo confortável..."],
    [86,"Quase pronto..."],
    [100,"Bem-vinda, Gaby."]
  ];

  let index=0;

  function next(){
    if(index>=steps.length){
      setTimeout(()=>switchStage(el.lockStage),500);
      return;
    }

    const [progress,text]=steps[index++];
    el.bootProgress.style.width=`${progress}%`;
    el.bootNumber.textContent=`${progress}%`;
    el.bootText.textContent=text;
    setTimeout(next,350);
  }

  setTimeout(next,250);
}

function unlock(){
  switchStage(el.phoneStage);
  showToast("Bem-vinda ao seu cantinho.");
}

function saveState(){
  storage.set("alwaysVisited",JSON.stringify([...state.visited]));
  storage.set("alwaysMood",state.mood||"");
  storage.set("alwaysEnergy",String(state.energy));
  storage.set("alwaysGameScores",JSON.stringify(state.gameScores));
}

function loadState(){
  try{
    const saved=JSON.parse(storage.get("alwaysVisited","[]"));
    if(Array.isArray(saved)){
      saved.forEach(id=>{
        if(REQUIRED.includes(id)) state.visited.add(id);
      });
    }
  }catch{}

  const mood=storage.get("alwaysMood","");
  if(Object.prototype.hasOwnProperty.call(MOODS,mood)){
    state.mood=mood;
  }

  const energy=Number(storage.get("alwaysEnergy","45"));
  if(Number.isFinite(energy)){
    state.energy=Math.max(0,Math.min(100,energy));
  }
  try{
    const scores=JSON.parse(storage.get("alwaysGameScores","{}"));
    if(scores&&typeof scores==="object") Object.assign(state.gameScores,scores);
  }catch{}
}

function renderApps(){
  el.appsGrid.innerHTML=APPS.map(([id,icon,name])=>{
    const locked=["segredo","nos"].includes(id);
    return `
      <button class="app-button ${locked?"locked":""}" data-app="${id}" type="button">
        <span class="app-icon">${icon}</span>
        <span class="app-name">${name}</span>
      </button>
    `;
  }).join("");

  el.appsGrid.querySelectorAll("[data-app]").forEach(button=>{
    button.addEventListener("click",()=>openApp(button.dataset.app));
  });

  updateProgress();
}

function renderMoods(){
  el.moodGrid.innerHTML=Object.entries(MOODS).map(([id,[label]])=>`
    <button class="mood-button ${state.mood===id?"selected":""}" data-mood="${id}" type="button">
      ${label}
    </button>
  `).join("");

  el.moodGrid.querySelectorAll("[data-mood]").forEach(button=>{
    button.addEventListener("click",()=>{
      state.mood=button.dataset.mood;
      el.moodGrid.querySelectorAll("[data-mood]").forEach(item=>{
        item.classList.toggle("selected",item===button);
      });
      el.moodAnswer.textContent=MOODS[state.mood][1];
      saveState();
    });
  });

  if(state.mood){
    el.moodAnswer.textContent=MOODS[state.mood][1];
  }
}

function updateProgress(){
  const count=REQUIRED.filter(id=>state.visited.has(id)).length;
  const percent=Math.round(count/REQUIRED.length*100);
  const secretUnlocked=count>=Math.ceil(REQUIRED.length*.65);
  const finalUnlocked=count===REQUIRED.length;

  el.exploredText.textContent=`${count} explorados`;
  el.explorationNumber.textContent=`${percent}%`;
  el.explorationProgress.style.width=`${percent}%`;

  const secretButton=el.appsGrid.querySelector('[data-app="segredo"]');
  const finalButton=el.appsGrid.querySelector('[data-app="nos"]');

  if(secretButton) secretButton.classList.toggle("locked",!secretUnlocked);
  if(finalButton) finalButton.classList.toggle("locked",!finalUnlocked);

  if(finalUnlocked){
    el.explorationMessage.textContent="O aplicativo Nós foi desbloqueado.";
  }else if(secretUnlocked){
    el.explorationMessage.textContent="Um aplicativo secreto apareceu.";
  }else{
    el.explorationMessage.textContent="Explore os aplicativos no seu ritmo.";
  }

  saveState();
}

function markVisited(id){
  if(REQUIRED.includes(id)){
    state.visited.add(id);
    updateProgress();
  }
}

function appHeader(title,subtitle){
  return `
    <header class="app-header">
      <button class="back-button" id="backButton" type="button" aria-label="Voltar">←</button>
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
    </header>
  `;
}

function bindBack(){
  const button=document.getElementById("backButton");
  if(button) button.addEventListener("click",openHome);
}

function openHome(){
  state.chatRun++;
  state.currentApp=null;
  el.appPage.hidden=true;
  el.homePage.hidden=false;
  el.homePage.scrollTop=0;
}

function openApp(id){
  const count=REQUIRED.filter(item=>state.visited.has(item)).length;

  if(id==="segredo"&&count<Math.ceil(REQUIRED.length*.65)){
    showToast("Explore mais um pouco para revelar este segredo.");
    return;
  }

  if(id==="nos"&&count!==REQUIRED.length){
    showToast("Visite todos os aplicativos antes de abrir Nós.");
    return;
  }

  const renderer=renderers[id];

  if(!renderer){
    showToast("Este aplicativo não está disponível.");
    return;
  }

  if(REQUIRED.includes(id)){
    markVisited(id);
  }

  renderer();
  state.currentApp=id;
  el.homePage.hidden=true;
  el.appPage.hidden=false;
  el.appPage.scrollTop=0;
}

function renderTimelineApp(title,subtitle,intro,items){
  el.appPage.innerHTML=
    appHeader(title,subtitle)+
    `
      <section class="hero-card">
        <h2>${title}</h2>
        <p>${intro}</p>
      </section>

      <div class="timeline">
        ${items.map(([heading,text])=>`
          <article class="timeline-card">
            <strong>${heading}</strong>
            <p>${text}</p>
          </article>
        `).join("")}
      </div>
    `;

  bindBack();
}

function renderConversas(){
  const messages=[
    ["system","Conversa: quando o dia pesa"],
    ["her","Hoje eu estou muito cansada."],
    ["me","Então hoje você não precisa ser nada além de você mesma."],
    ["her","Às vezes eu não tenho vontade de conversar."],
    ["me","Tudo bem. O seu silêncio não diminui o carinho que eu sinto por você."],
    ["me","Pode ficar quietinha. Eu continuo aqui, sem perguntas e sem cobrança."],
    ["her","E se eu só quiser descansar?"],
    ["me","Então descansa. Você merece um lugar onde não precisa se explicar."]
  ];

  el.appPage.innerHTML=
    appHeader("Conversas","Palavras para os dias mais delicados")+
    `
      <section class="hero-card">
        <h2>Quando o dia pesa</h2>
        <p>
          Uma conversa simples, sem respostas perfeitas.
          Só carinho, presença e respeito pelo seu tempo.
        </p>
      </section>

      <div class="chat" id="chatBox"></div>

      <div class="stack" id="chatChoices" hidden>
        <button class="choice-button" data-choice="quiet" type="button">
          <strong>Quero ficar quietinha.</strong>
          <small>Receber presença sem perguntas.</small>
        </button>

        <button class="choice-button" data-choice="talk" type="button">
          <strong>Quero falar um pouco.</strong>
          <small>Ser ouvida com calma.</small>
        </button>
      </div>
    `;

  bindBack();

  const box=document.getElementById("chatBox");
  const choices=document.getElementById("chatChoices");
  const run=++state.chatRun;
  let index=0;

  function addMessage(){
    if(run!==state.chatRun) return;

    if(index>=messages.length){
      choices.hidden=false;
      choices.querySelectorAll("[data-choice]").forEach(button=>{
        button.addEventListener("click",()=>continueConversation(button.dataset.choice,box,choices));
      });
      return;
    }

    const [speaker,text]=messages[index++];
    const item=document.createElement("div");
    item.className=`message ${speaker}`;
    item.textContent=text;
    box.appendChild(item);
    item.scrollIntoView({behavior:"smooth",block:"end"});
    setTimeout(addMessage,speaker==="system"?300:600);
  }

  addMessage();
}

function continueConversation(choice,box,choices){
  choices.hidden=true;

  const followup=choice==="quiet"
    ?[
      ["her","Quero ficar quietinha."],
      ["me","Fica. Você não precisa preencher o silêncio."],
      ["me","Eu só quero que você sinta que não está sozinha."],
      ["me","Pode descansar. O carinho continua aqui."]
    ]
    :[
      ["her","Quero falar um pouco."],
      ["me","Pode falar no seu ritmo."],
      ["me","Eu quero ouvir o que está no seu coração sem diminuir nada."],
      ["me","Você merece ser acolhida até nas partes mais difíceis."]
    ];

  followup.forEach(([speaker,text],index)=>{
    setTimeout(()=>{
      const item=document.createElement("div");
      item.className=`message ${speaker}`;
      item.textContent=text;
      box.appendChild(item);
      item.scrollIntoView({behavior:"smooth",block:"end"});
    },index*520);
  });
}

function renderAcolhimento(){
  const actions=[
    ["Receber carinho","Você é importante para mim, mesmo quando não consegue demonstrar nada."],
    ["Ficar em silêncio","Você não precisa falar para continuar sendo amada e querida."],
    ["Descansar","Pode soltar um pouco do peso. Nem tudo precisa ser resolvido hoje."],
    ["Respirar","Devagar. Este momento não exige nada de você."]
  ];

  el.appPage.innerHTML=
    appHeader("Acolhimento","Um lugar para respirar")+
    `
      <section class="hero-card">
        <h2>Você pode abaixar a guarda aqui.</h2>
        <p>
          Não precisa sorrir, responder rápido ou fingir força.
          Seu cansaço também merece carinho.
        </p>
      </section>

      <div class="stack">
        ${actions.map(([title,text],index)=>`
          <button class="action-button" data-comfort="${index}" type="button">
            <strong>${title}</strong>
            <small>Toque para receber uma mensagem.</small>
          </button>
        `).join("")}
      </div>

      <section class="content-card" id="comfortMessage" style="margin-top:13px">
        <h3>Você já é suficiente.</h3>
        <p>Mesmo nos dias em que só consegue continuar devagar.</p>
      </section>
      <section class="game-shell" id="choiceMiniGame"></section>
    `;

  bindBack();

  choiceGame("choiceMiniGame");

  el.appPage.querySelectorAll("[data-comfort]").forEach(button=>{
    button.addEventListener("click",()=>{
      const [title,text]=actions[Number(button.dataset.comfort)];
      document.getElementById("comfortMessage").innerHTML=`
        <h3>${title}</h3>
        <p>${text}</p>
      `;
    });
  });
}

function renderCartas(){
  const letters={
    cansada:[
      "Quando você estiver cansada",
      "Gaby, se hoje tudo estiver pesado, não se cobre tanto. Você não precisa chegar ao fim do dia inteira, sorrindo e forte. Pode só chegar. Pode descansar. Pode se recolher. Meu carinho por você não depende da energia que você consegue oferecer."
    ],
    triste:[
      "Quando você estiver triste",
      "Gaby, sua tristeza não me afasta. Ela não faz você ser menos bonita, menos especial ou menos amada. Mesmo quando o mundo parece cinza, eu ainda enxergo tudo de bonito que existe em você."
    ],
    trabalho:[
      "Para uma quarta ou sexta difícil",
      "Gaby, eu sei que esses dias costumam ser mais pesados. Então hoje eu só queria te lembrar que você não precisa transformar cansaço em culpa. Faça o que conseguir. Respire quando puder. E quando o dia acabar, deixe o peso cair aos poucos."
    ],
    saudade:[
      "Quando estiver com saudade",
      "Gaby, quando a saudade apertar, lembra que em muitos momentos do meu dia eu penso em você sem nem perceber. Seu nome aparece no meio da correria, seu jeito volta na minha cabeça e sua presença faz falta nos detalhes."
    ],
    insegura:[
      "Quando você duvidar de si",
      "Gaby, você é muito maior do que a insegurança que aparece nos dias ruins. Você é dedicada, sensível, bonita, forte e cheia de coisas que talvez nem perceba. Eu percebo. E guardo cada uma delas com carinho."
    ]
  };

  el.appPage.innerHTML=
    appHeader("Cartas","Palavras para momentos diferentes")+
    `
      <div class="cards-list">
        ${Object.entries(letters).map(([id,[title]])=>`
          <button class="list-button" data-letter="${id}" type="button">
            <strong>${title}</strong>
            <small>Toque para abrir.</small>
          </button>
        `).join("")}
      </div>

      <article class="letter-paper" id="letterPaper">
        <p>Escolha uma carta para abrir.</p>
      </article>
      <section class="game-shell" id="wordMiniGame"></section>
    `;

  bindBack();

  wordGame("wordMiniGame");

  el.appPage.querySelectorAll("[data-letter]").forEach(button=>{
    button.addEventListener("click",()=>{
      const [title,text]=letters[button.dataset.letter];
      document.getElementById("letterPaper").innerHTML=`
        <p>Gaby,</p>
        <p>${text}</p>
        <p style="color:#d6ceff">Com carinho, Rafihx.</p>
      `;
    });
  });
}

function renderQualidades(){
  const qualities=[
    "Dedicada","Sensível","Bonita","Carinhosa","Forte",
    "Especial","Inteligente","Persistente","Admirável","Única",
    "Verdadeira","Importante","Inesquecível","Gentil","Corajosa",
    "Trabalhadora","Cuidadosa","Autêntica"
  ];

  el.appPage.innerHTML=
    appHeader("Qualidades","Coisas bonitas que eu vejo em você")+
    `
      <section class="hero-card">
        <h2>Você continua sendo incrível até nos dias difíceis.</h2>
        <p>
          O cansaço pode esconder seu brilho de você,
          mas não consegue esconder de quem olha com carinho.
        </p>
      </section>

      <div class="chip-wrap">
        ${qualities.map(item=>`<span class="chip">${item}</span>`).join("")}
      </div>
      <section class="game-shell" id="memoryMiniGame"></section>
    `;

  bindBack();
  memoryGame("memoryMiniGame");
}

function renderDescanso(){
  el.appPage.innerHTML=
    appHeader("Descansar","Um minuto sem cobrança")+
    `
      <section class="hero-card" style="text-align:center">
        <h2>Por alguns instantes, nada precisa de você.</h2>
        <p>
          Não precisa resolver, responder ou pensar no próximo passo.
          Só respira no seu ritmo.
        </p>

        <div class="breath-circle">Respire</div>

        <p>
          Você merece um momento que não cobre nada em troca.
        </p>
      </section>
    `;

  bindBack();
}

function renderDiaDificil(){
  createRain();

  el.appPage.innerHTML=
    appHeader("Hoje foi difícil","Você não precisa esconder")+
    `
      <section class="hero-card">
        <h2>Eu acredito no seu cansaço.</h2>
        <p>
          Você não precisa provar que o dia foi pesado.
          Não precisa organizar tudo o que sentiu para merecer acolhimento.
          Pode apenas admitir: hoje doeu, cansou e foi demais.
        </p>
      </section>

      <section class="content-card" style="margin-top:13px">
        <h3>E ainda assim, você chegou até aqui.</h3>
        <p>
          Talvez devagar, talvez sem forças, talvez em silêncio.
          Mas chegou. E isso já é muito.
        </p>
      </section>

      <button class="choice-button" id="rainAgain" type="button" style="margin-top:13px">
        <strong>Deixar a chuva cair mais uma vez</strong>
        <small>Uma animação silenciosa.</small>
      </button>
    `;

  bindBack();
  document.getElementById("rainAgain").addEventListener("click",createRain);
}

function createRain(){
  el.rainLayer.innerHTML="";

  for(let i=0;i<50;i++){
    const drop=document.createElement("i");
    drop.className="raindrop";
    drop.style.left=`${Math.random()*100}%`;
    drop.style.animationDuration=`${.7+Math.random()*1.1}s`;
    drop.style.animationDelay=`${Math.random()*.8}s`;
    el.rainLayer.appendChild(drop);
  }

  setTimeout(()=>{el.rainLayer.innerHTML="";},2300);
}

function renderEspelho(){
  el.appPage.innerHTML=
    appHeader("Espelho","O que eu queria que você enxergasse")+
    `
      <section class="hero-card" style="text-align:center">
        <div class="breath-circle">Gaby</div>
        <h2>Você não perde seu valor quando está cansada.</h2>
        <p>
          Você continua bonita quando não se sente bonita.
          Continua importante quando se sente distante.
          Continua especial quando o dia faz você esquecer disso.
        </p>
      </section>
      <section class="game-shell" id="sequenceMiniGame"></section>
    `;

  bindBack();
  sequenceGame("sequenceMiniGame");
}

function renderAbraco(){
  el.appPage.innerHTML=
    appHeader("Abraço","Sem perguntas e sem pressão")+
    `
      <section class="hero-card" style="text-align:center">
        <div class="breath-circle">◉</div>
        <h2>Um abraço também pode ser silêncio.</h2>
        <p>
          Sem resolver nada. Sem pedir explicações.
          Só um lugar para você encostar o peso do dia por alguns instantes.
        </p>
      </section>
    `;

  bindBack();
}

function renderConstelacao(){
  const letters=["G","A","B","Y","R","A","F","I","H","X"];

  el.appPage.innerHTML=
    appHeader("Constelação","Nomes que viram estrelas")+
    `
      <section class="hero-card" style="text-align:center">
        <div class="chip-wrap" style="justify-content:center">
          ${letters.map(letter=>`<span class="chip">${letter}</span>`).join("")}
        </div>

        <h2 style="margin-top:20px">GABY + RAFIHX</h2>
        <p>
          Algumas histórias começam com nomes.
          Outras continuam nos pequenos gestos que fazem alguém se sentir querido.
        </p>
      </section>
    `;

  bindBack();
}


function score(name){return Number(state.gameScores[name]||0)}
function saveScore(name,value){state.gameScores[name]=Math.max(score(name),value);saveState()}

function memoryGame(id){
  const host=document.getElementById(id);if(!host)return;
  const symbols=["♡","✦","☾","∞","♡","✦","☾","∞"].sort(()=>Math.random()-.5);
  host.innerHTML=`<div class="game-top"><div><h3>Memórias em pares</h3><p>Encontre todos os pares usando poucos movimentos.</p></div><span class="game-score">Melhor: ${score("memory")||"—"}</span></div><div class="game-board memory-board">${symbols.map((s,i)=>`<button class="memory-card" data-mi="${i}" data-mv="${s}" type="button">?</button>`).join("")}</div><p class="game-feedback" id="mf">Movimentos: 0</p><div class="game-actions"><button class="game-button secondary" id="mr" type="button">Misturar</button></div>`;
  let first=null,lock=false,moves=0,pairs=0;
  host.querySelectorAll('[data-mi]').forEach(card=>card.addEventListener('click',()=>{
    if(lock||card.dataset.done||card===first)return;card.textContent=card.dataset.mv;card.classList.add('revealed');
    if(!first){first=card;return}moves++;document.getElementById('mf').textContent=`Movimentos: ${moves}`;
    if(first.dataset.mv===card.dataset.mv){first.dataset.done=card.dataset.done='1';first.classList.add('matched');card.classList.add('matched');first=null;pairs++;if(pairs===4){saveScore('memory',moves);document.getElementById('mf').textContent=`Todos os pares em ${moves} movimentos.`;showToast('Todas as memórias foram encontradas.')}}
    else{lock=true;const old=first;setTimeout(()=>{old.textContent=card.textContent='?';old.classList.remove('revealed');card.classList.remove('revealed');first=null;lock=false},650)}
  }));document.getElementById('mr').addEventListener('click',()=>memoryGame(id));
}

function sequenceGame(id){
  const host=document.getElementById(id);if(!host)return;const icons=["♡","✦","☾","∞","◇","◉","☁","✉","✧"];
  host.innerHTML=`<div class="game-top"><div><h3>Sequência de carinho</h3><p>Observe as luzes e repita a ordem.</p></div><span class="game-score">Recorde: ${score('sequence')}</span></div><div class="game-board sequence-board">${icons.map((x,i)=>`<button class="sequence-cell" data-sc="${i}" type="button">${x}</button>`).join('')}</div><div class="streak-row" id="ss">${Array.from({length:5},()=>'<i class="streak-dot"></i>').join('')}</div><p class="game-feedback" id="sf">Toque em começar.</p><div class="game-actions"><button class="game-button" id="sb" type="button">Começar</button></div>`;
  const cells=[...host.querySelectorAll('[data-sc]')];let seq=[],input=[],level=1,showing=false;
  function flash(i,d){setTimeout(()=>{cells[i].classList.add('active');setTimeout(()=>cells[i].classList.remove('active'),300)},d)}
  function show(){showing=true;input=[];document.getElementById('sf').textContent='Observe...';seq.forEach((v,i)=>flash(v,i*500));setTimeout(()=>{showing=false;document.getElementById('sf').textContent='Agora repita.'},seq.length*500+250)}
  function next(){seq.push(Math.floor(Math.random()*cells.length));document.querySelectorAll('#ss .streak-dot').forEach((d,i)=>d.classList.toggle('on',i<Math.min(level,5)));show()}
  cells.forEach((cell,i)=>cell.addEventListener('click',()=>{if(showing||!seq.length)return;cell.classList.add('active');setTimeout(()=>cell.classList.remove('active'),150);input.push(i);const n=input.length-1;if(input[n]!==seq[n]){document.getElementById('sf').textContent=`Quase. Você chegou ao nível ${level}.`;saveScore('sequence',level);seq=[];input=[];level=1;return}if(input.length===seq.length){level++;saveScore('sequence',level);document.getElementById('sf').textContent='Perfeito. Mais uma.';setTimeout(next,600)}}));
  document.getElementById('sb').addEventListener('click',()=>{seq=[];input=[];level=1;next()});
}

function wordGame(id){
  const host=document.getElementById(id);if(!host)return;const target=["VOCÊ","MERECE","CARINHO","SEM","COBRANÇA"],mix=[...target].sort(()=>Math.random()-.5);let built=[];
  host.innerHTML=`<div class="game-top"><div><h3>Monte a mensagem</h3><p>Coloque as palavras na ordem especial.</p></div><span class="game-score">Vitórias: ${score('words')}</span></div><div class="game-board word-bank">${mix.map(w=>`<button class="word-token" data-w="${w}" type="button">${w}</button>`).join('')}</div><div class="phrase-drop" id="pd">Sua frase aparecerá aqui.</div><p class="game-feedback" id="wf"></p><div class="game-actions"><button class="game-button secondary" id="wr" type="button">Misturar</button></div>`;
  host.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('click',()=>{if(b.classList.contains('used'))return;b.classList.add('used');built.push(b.dataset.w);document.getElementById('pd').textContent=built.join(' ');if(built.length===target.length){if(built.join(' ')===target.join(' ')){state.gameScores.words=score('words')+1;saveState();document.getElementById('wf').textContent='Você merece carinho sem cobrança.';showToast('Mensagem completa.')}else document.getElementById('wf').textContent='Quase. Existe uma ordem ainda mais especial.'}}));document.getElementById('wr').addEventListener('click',()=>wordGame(id));
}

function choiceGame(id){
  const host=document.getElementById(id);if(!host)return;const rounds=[
    ['Gaby chega exausta depois de uma sexta pesada. O que combina mais com carinho?',['Cobrar uma conversa longa.','Dar espaço, oferecer presença e não exigir resposta.','Dizer que ela está exagerando.'],1,'Carinho também é permitir que ela apenas descanse.'],
    ['Ela diz que quer ficar quietinha. Qual gesto é mais acolhedor?',['Respeitar o silêncio e continuar por perto sem pressão.','Insistir até ela falar.','Fazer ela se sentir culpada.'],0,'O silêncio dela também merece cuidado.'],
    ['Ela está ansiosa e sem energia. O que deixa o momento mais leve?',['Pedir que resolva tudo agora.','Comparar com outras pessoas.','Lembrar que ela não precisa enfrentar tudo de uma vez.'],2,'Acolher é diminuir o peso, não aumentar.']
  ];let round=0,total=0;
  function draw(){const [q,choices,correct,msg]=rounds[round];host.innerHTML=`<div class="game-top"><div><h3>Escolhas de carinho</h3><p>Escolha a resposta mais acolhedora.</p></div><span class="game-score">${round+1}/${rounds.length}</span></div><p style="margin-top:14px;color:#e9e4f2;font-size:.84rem;line-height:1.55">${q}</p><div class="choice-game-grid">${choices.map((c,i)=>`<button class="choice-game-button" data-ca="${i}" type="button">${c}</button>`).join('')}</div><p class="game-feedback" id="cf"></p>`;host.querySelectorAll('[data-ca]').forEach(b=>b.addEventListener('click',()=>{const chosen=Number(b.dataset.ca);host.querySelectorAll('[data-ca]').forEach(x=>x.disabled=true);if(chosen===correct){b.classList.add('correct');total++}else{b.classList.add('wrong');host.querySelector(`[data-ca="${correct}"]`).classList.add('correct')}document.getElementById('cf').textContent=msg;setTimeout(()=>{round++;if(round<rounds.length)draw();else{saveScore('choices',total);host.innerHTML=`<div class="game-top"><div><h3>Fim das escolhas</h3><p>Você completou todas as situações.</p></div><span class="game-score">${total}/${rounds.length}</span></div><section class="content-card" style="margin-top:14px"><h3>Carinho é presença sem peso.</h3><p>Você terminou com ${total} escolhas acolhedoras.</p></section><div class="game-actions"><button class="game-button" id="cr" type="button">Jogar novamente</button></div>`;document.getElementById('cr').addEventListener('click',()=>{round=0;total=0;draw()})}},1000)}))}
  draw();
}

function starGame(id){
  const host=document.getElementById(id);if(!host)return;const stars=[['G',12,20],['A',35,12],['B',58,24],['Y',80,14],['R',70,52],['A',47,62],['F',23,55],['I',14,78],['H',43,84],['X',77,80]],target='GABYRAFIHX';let built='';
  host.innerHTML=`<div class="game-top"><div><h3>Constelação dos nomes</h3><p>Toque nas estrelas para formar GABYRAFIHX.</p></div><span class="game-score">Tentativas: ${score('stars')}</span></div><div class="star-board">${stars.map(([l,x,y],i)=>`<button class="star-button" data-sl="${l}" style="left:${x}%;top:${y}%" type="button">${l}</button>`).join('')}</div><div class="phrase-drop" id="sp">Toque na primeira estrela.</div><p class="game-feedback" id="sfb"></p><div class="game-actions"><button class="game-button secondary" id="sr" type="button">Recomeçar</button></div>`;
  host.querySelectorAll('[data-sl]').forEach(b=>b.addEventListener('click',()=>{built+=b.dataset.sl;b.classList.add('selected');b.disabled=true;document.getElementById('sp').textContent=built;if(!target.startsWith(built)){state.gameScores.stars=score('stars')+1;saveState();document.getElementById('sfb').textContent='Essa estrela veio cedo demais. Recomece.'}else if(built===target){document.getElementById('sfb').textContent='Constelação completa: GABY + RAFIHX.';showToast('Constelação completa.')}}));document.getElementById('sr').addEventListener('click',()=>starGame(id));
}

function renderSegredo(){
  el.appPage.innerHTML=
    appHeader("Segredo","Uma parte escondida")+
    `
      <section class="hero-card final-card">
        <h2>O segredo é simples.</h2>
        <p>
          Eu gosto de você até nos momentos em que você não tem nada para oferecer.
        </p>
        <p>
          Gosto de você quando está animada,
          quando está cansada, quando conversa muito
          e quando prefere ficar quietinha.
        </p>
        <p style="color:#d6ceff">
          Você não precisa merecer carinho. Você já merece.
        </p>
      </section>
    `;

  bindBack();
}

function renderNos(){
  el.appPage.innerHTML=
    appHeader("Nós","O final depois de tudo")+
    `
      <section class="content-card final-card">
        <h2>Gaby, este lugar inteiro é sobre carinho.</h2>

        <p>
          Sobre o carinho que eu sinto quando penso em você no meio do trabalho.
          Sobre a saudade que aparece nos detalhes.
          Sobre a vontade de te ver descansando sem culpa.
        </p>

        <p>
          Você é importante para mim nos dias bons,
          nos dias cansados, nas quartas difíceis,
          nas sextas pesadas e nos domingos em que tudo pode ficar um pouco mais lento.
        </p>

        <p>
          Eu gosto do seu jeito, da sua presença,
          da sua sensibilidade e de tudo aquilo que faz você ser você.
        </p>

        <p>
          Quando você estiver triste, eu quero que este celular te lembre:
          você continua sendo especial.
          Quando estiver cansada, você continua sendo querida.
          Quando estiver em silêncio, o carinho continua aqui.
        </p>

        <p style="color:#d6ceff;font-weight:700">
          Eu amo você, Gaby.<br>
          Com carinho, Rafihx.
        </p>

        <button class="reset-button" id="resetButton" type="button">
          Reiniciar experiência
        </button>
      </section>
    `;

  bindBack();

  document.getElementById("resetButton").addEventListener("click",()=>{
    if(window.confirm("Deseja apagar o progresso e começar novamente?")){
      ["alwaysVisited","alwaysMood","alwaysEnergy","alwaysGameScores"].forEach(storage.remove);
      location.reload();
    }
  });
}

const renderers = {
  conversas:renderConversas,
  acolhimento:renderAcolhimento,
  trabalho:()=>renderTimelineApp(
    "Dias de trabalho",
    "Especialmente quarta e sexta",
    "Eu sei que alguns dias exigem muito de você. Por isso, estas mensagens existem só para te lembrar que o seu esforço é visto.",
    [
      ["Antes de começar","Você não precisa ser perfeita para ser admirada."],
      ["No meio da correria","Se você responder pouco, isso não diminui o carinho que sinto por você."],
      ["Quando tudo parece demais","Seu valor não depende de aguentar tudo sem parar."],
      ["Quando chegar em casa","Você merece terminar o dia em paz, sem mais cobranças."]
    ]
  ),
  saudade:()=>renderTimelineApp(
    "Saudade",
    "O que eu sinto durante o dia",
    "Nem sempre eu falo no momento, mas você aparece em muitos pequenos intervalos do meu dia.",
    [
      ["No começo do trabalho","Eu já imagino como está sendo o seu dia."],
      ["No meio da correria","Lembro de uma frase sua, de um jeito seu ou de algo que queria te contar."],
      ["Quando o cansaço aparece","Penso em como seria bom ficar perto de você, mesmo sem fazer nada grandioso."],
      ["Quando finalmente paro","Percebo que sentir sua falta é sentir falta da sua presença."]
    ]
  ),
  erros:()=>renderTimelineApp(
    "Sinceridade",
    "Palavras que não escondem o que importa",
    "Eu não quero diminuir o que já machucou você. Quero apenas deixar claro que sua dor importa e que você não precisa fingir que esqueceu.",
    [
      ["O que aconteceu importa","O que te machucou não vira pequeno só porque o tempo passou."],
      ["Seu sentimento é legítimo","Você não precisa justificar o que sentiu."],
      ["Seu tempo merece respeito","Você não precisa se sentir pronta antes da hora."],
      ["Seu coração merece cuidado","Carinho também é não pressionar aquilo que ainda dói."]
    ]
  ),
  cuidado:()=>renderTimelineApp(
    "Cuidado",
    "Carinho que respeita",
    "Você merece um carinho que não invade, não cobra e não transforma afeto em obrigação.",
    [
      ["Perguntar","Seu conforto importa em cada momento."],
      ["Escutar","Seu silêncio também diz coisas e merece respeito."],
      ["Parar","Você pode mudar de ideia sem sentir culpa."],
      ["Permanecer","Mesmo quando você precisa de espaço, o carinho não desaparece."]
    ]
  ),
  cartas:renderCartas,
  momentos:()=>renderTimelineApp(
    "Momentos",
    "Pequenas coisas que ficam",
    "Nem tudo precisa ser grandioso para se tornar importante.",
    [
      ["Uma conversa simples","Às vezes uma frase sua fica comigo o dia inteiro."],
      ["Um silêncio confortável","Nem sempre precisamos preencher tudo com palavras."],
      ["Uma saudade inesperada","Seu jeito aparece na minha cabeça no meio da rotina."],
      ["Um domingo tranquilo","A ideia de descansar ao seu lado já parece especial."]
    ]
  ),
  futuro:()=>renderTimelineApp(
    "Futuro",
    "Sonhos simples e bonitos",
    "Eu penso menos em coisas perfeitas e mais em dias tranquilos ao seu lado.",
    [
      ["Uma casa calma","Um lugar onde os dois possam respirar."],
      ["Domingos lentos","Sem pressa, sem obrigação e com companhia."],
      ["Conversas honestas","Um espaço onde nenhum sentimento precise ser escondido."],
      ["Dias comuns","Porque até a rotina fica bonita quando existe carinho."]
    ]
  ),
  qualidades:renderQualidades,
  diario:()=>renderTimelineApp(
    "Diário",
    "Capítulos do que eu sinto",
    "Alguns sentimentos ficam mais bonitos quando são guardados com cuidado.",
    [
      ["Quando você se tornou importante","Foi na soma dos detalhes, não em um único momento."],
      ["Quando percebi sua força","Não só quando você aguenta, mas também quando admite que está cansada."],
      ["Quando sinto saudade","Seu nome aparece no meio do dia sem pedir licença."],
      ["O que quero guardar","A sensação de que sua presença torna tudo mais bonito."]
    ]
  ),
  descanso:renderDescanso,
  memorias:()=>renderTimelineApp(
    "Memórias",
    "Coisas que eu guardaria para sempre",
    "Algumas lembranças são simples, mas continuam aquecendo o coração.",
    [
      ["Seu jeito de falar","Pequenos detalhes que só você tem."],
      ["Uma conversa que ficou","Palavras que voltam quando o dia fica quieto."],
      ["Uma risada sua","Daquelas que mudam o clima inteiro."],
      ["A vontade de estar perto","Mesmo quando não existe nada especial acontecendo."]
    ]
  ),
  espelho:renderEspelho,
  promessas:()=>renderTimelineApp(
    "Promessas",
    "Coisas simples que importam",
    "Não são promessas grandiosas. São formas de carinho que você merece sentir.",
    [
      ["Seu tempo será respeitado","Você não precisa responder antes de estar pronta."],
      ["Seu cansaço será levado a sério","Você não precisa provar que está exausta."],
      ["Seu silêncio será acolhido","Nem toda ausência de palavras significa distância."],
      ["Seu coração será tratado com delicadeza","Porque aquilo que você sente importa."]
    ]
  ),
  cura:()=>renderTimelineApp(
    "Cura",
    "Um espaço onde a dor pode respirar",
    "Cura não é esquecer. É poder olhar para o que doeu sem sentir que precisa esconder.",
    [
      ["Você pode sentir","Nada precisa ser diminuído."],
      ["Você pode parar","Nem todo dia precisa ser produtivo."],
      ["Você pode se proteger","Colocar limites também é cuidado."],
      ["Você pode voltar devagar","Nenhum coração precisa correr."]
    ]
  ),
  abraco:renderAbraco,
  estrelas:()=>renderTimelineApp(
    "Estrelas",
    "Pequenas luzes para lembrar",
    "Quando o dia escurecer, estas frases continuam aqui.",
    [
      ["Você importa","Mesmo quando se sente distante de tudo."],
      ["Você merece descanso","Sem culpa e sem explicação."],
      ["Você merece respeito","Em cada palavra, gesto e silêncio."],
      ["Você merece carinho","Sem precisar pedir o mínimo."]
    ]
  ),
  dificil:renderDiaDificil,
  semana:()=>renderTimelineApp(
    "Semana",
    "Uma mensagem para cada dia",
    "Cada dia tem um peso diferente. Nenhum deles muda o quanto você é especial.",
    [
      ["Segunda","Começa devagar. Você não precisa vencer a semana inteira hoje."],
      ["Terça","Respira. Você já está fazendo o possível."],
      ["Quarta","Eu sei que costuma ser pesado. Seja gentil com você mesma."],
      ["Quinta","Você chegou até aqui. Isso já diz muito."],
      ["Sexta","Mais um dia difícil, mas você não precisa carregá-lo sozinha."],
      ["Sábado","Seu esforço merece ser reconhecido."],
      ["Domingo","Descansa sem culpa. O mundo pode esperar um pouco."]
    ]
  ),
  energia:()=>renderTimelineApp(
    "Energia",
    "Seu ritmo merece respeito",
    "Você não é menos importante nos dias em que sua energia está baixa.",
    [
      ["Energia alta","Aproveita sem se cobrar manter tudo perfeito."],
      ["Energia média","Faça apenas o que couber dentro de você."],
      ["Energia baixa","Seu corpo está pedindo cuidado, não culpa."],
      ["Sem energia","Hoje, existir já é suficiente."]
    ]
  ),
  gratidao:()=>renderTimelineApp(
    "Gratidão",
    "Coisas que eu valorizo em você",
    "Existem muitas coisas em você que tornam minha vida mais bonita.",
    [
      ["Sua presença","Mesmo os momentos simples ficam especiais."],
      ["Seu jeito","Pequenos detalhes seus ficam na memória."],
      ["Sua sinceridade","Ela torna tudo mais verdadeiro."],
      ["Seu carinho","Ele aquece até os dias mais comuns."]
    ]
  ),
  apagadas:()=>renderTimelineApp(
    "Mensagens apagadas",
    "Coisas que ficaram no rascunho",
    "Algumas mensagens foram apagadas, mas o sentimento continuou existindo.",
    [
      ["Eu estava com saudade","Mesmo sem saber como dizer."],
      ["Pensei em você no trabalho","No meio de uma tarefa qualquer."],
      ["Queria te abraçar","Sem perguntar nada, só ficar perto."],
      ["Queria dizer que você importa","Mesmo quando o dia está confuso."]
    ]
  ),
  verdades:()=>renderTimelineApp(
    "Verdades",
    "Coisas simples e sinceras",
    "Sem frases perfeitas. Apenas sentimentos que continuam aqui.",
    [
      ["Eu sinto sua falta","Nos detalhes e nos intervalos do dia."],
      ["Eu me importo com seu cansaço","Não quero que você esconda para parecer bem."],
      ["Eu admiro você","Inclusive quando você não consegue enxergar isso."],
      ["Eu quero você bem","Mesmo quando isso significa silêncio, espaço e descanso."]
    ]
  ),
  constelacao:renderConstelacao,
  segredo:renderSegredo,
  nos:renderNos
};

function bindGlobalEvents(){
  el.unlockButton.addEventListener("click",unlock);

  el.lockTouch.addEventListener("touchstart",event=>{
    state.touchStartY=event.touches?.[0]?.clientY??null;
  },{passive:true});

  el.lockTouch.addEventListener("touchend",event=>{
    if(state.touchStartY===null) return;

    const endY=event.changedTouches?.[0]?.clientY??state.touchStartY;
    const distance=state.touchStartY-endY;
    state.touchStartY=null;

    if(distance>55) unlock();
  },{passive:true});

  document.addEventListener("keydown",event=>{
    if(["Enter","ArrowUp"," "].includes(event.key)&&!el.lockStage.classList.contains("stage-hidden")){
      event.preventDefault();
      unlock();
    }

    if(event.key==="Escape"&&state.currentApp){
      openHome();
    }
  });
}

function initialize(){
  updateClock();
  setInterval(updateClock,15000);

  loadState();
  renderApps();
  renderMoods();
  bindGlobalEvents();

  const daily=DAILY[new Date().getDate()%DAILY.length];
  el.todayTitle.textContent=daily[0];
  el.todayText.textContent=daily[1];

  runBoot();

  window.addEventListener("error",event=>{
    console.error("Erro capturado:",event.error||event.message);
  });

  window.addEventListener("unhandledrejection",event=>{
    console.error("Promessa rejeitada:",event.reason);
  });
}

document.addEventListener("DOMContentLoaded",initialize);
