const apiUrl = "https://www.devosalliance.com/api/kbase";
const topicsContainer = document.getElementById("topicsContainer");
const commandsSection = document.getElementById("commandsSection");
const topicTitle = document.getElementById("topicTitle");
const topicDesc = document.getElementById("topicDesc");
const commandsList = document.getElementById("commandsList");
const searchInput = document.getElementById("searchInput");
const toggleThemeBtn = document.getElementById("toggleTheme");
const loader = document.getElementById("loader");

let allCommands = [];

// Buscar comandos
async function loadTopics() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    loader.classList.add("hidden"); 
    topicsContainer.classList.remove("hidden");

    Object.entries(data).forEach(([key, topic]) => {
      const card = document.createElement("div");
      card.className = "topic-card";
      card.innerHTML = `
        <img src="${topic.icon}" alt="${key}">
        <h3>${key.toUpperCase()}</h3>
      `;
      card.addEventListener("click", () => showCommands(key, topic));
      topicsContainer.appendChild(card);
    });
  } catch (err) {
    loader.textContent = "Não foi possível carregar os tópicos.";
    console.error("Erro ao carregar tópicos:", err);
  }
}

// Mostrar comandos
function showCommands(key, topic) {
  topicTitle.textContent = ` ${key.toUpperCase()}`;
  topicDesc.textContent = topic.descricao;
  allCommands = topic.comandos || [];
  renderCommands(allCommands);
  commandsSection.classList.remove("hidden");
}

// Renderizar comandos
function renderCommands(commands) {
  commandsList.innerHTML = "";
  commands.forEach(cmd => {
    const div = document.createElement("div");
    div.className = "command-card";
    div.innerHTML = `
      <pre><code>${cmd.comando}</code></pre>
      <p><b>Descrição:</b> ${cmd.descricao}</p>
      <p><b>Exemplo:</b> ${cmd.exemplo}</p>
      <button class="copyBtn">Copiar</button>
    `;
    div.querySelector(".copyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(cmd.comando);
      alert("Comando copiado!");
    });
    commandsList.appendChild(div);
  });
}

// barra de pesquisa
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = allCommands.filter(c => 
    c.comando.toLowerCase().includes(term) || 
    c.descricao.toLowerCase().includes(term) ||
    c.exemplo.toLowerCase().includes(term)
  );
  renderCommands(filtered);
});


// tema e ícone

const btnIcon = toggleThemeBtn.querySelector(".btn__icon");

function store(value) {
  localStorage.setItem("darkmode", value);
}

function loadTheme() {
  const darkmode = localStorage.getItem("darkmode");

  if (!darkmode) {
    store(false);
    btnIcon.classList.add("fa-sun");
  } else if (darkmode === "true") {
    document.body.classList.add("dark");
    btnIcon.classList.add("fa-moon");
  } else {
    btnIcon.classList.add("fa-sun");
  }
}

loadTheme();

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  btnIcon.classList.add("animated");

  store(document.body.classList.contains("dark"));

  if (document.body.classList.contains("dark")) {
    btnIcon.classList.remove("fa-sun");
    btnIcon.classList.add("fa-moon");
  } else {
    btnIcon.classList.remove("fa-moon");
    btnIcon.classList.add("fa-sun");
  }

  setTimeout(() => btnIcon.classList.remove("animated"), 500);
});


loadTopics();
