let itensSalvos = [
  { id: 1, nome: "Verduras", quantidade: 0, unidade: "un", comprado: false },
  { id: 2, nome: "legumes", quantidade: 0, unidade: "un", comprado: false },
];

let idContador = 3;

const inputNome = document.getElementById("input-nome");
const inputQtd = document.getElementById("input-qtd");
const selectUnidade = document.getElementById("select-unidade");
const listaEl = document.getElementById("lista-compras");
const totalPendentes = document.getElementById("total-pendentes");

function renderizarLista() {
  listaEl.innerHTML = "";

  if (itensSalvos.length === 0) {
    listaEl.innerHTML = '<li class="lista-vazia">Nenhum item na lista</li>';
    totalPendentes.textContent = "0";
    return;
  }

  const pendentes = itensSalvos.filter((i) => !i.comprado).length;
  totalPendentes.textContent = pendentes;

  itensSalvos.forEach((item) => {
    const li = document.createElement("li");
    li.className = `item-compra${item.comprado ? " item-comprado" : ""}`;
    li.dataset.id = item.id;

    li.innerHTML = `
      <div class="item-checkbox">
        <input type="checkbox" ${item.comprado ? "checked" : ""}>
      </div>
      <span class="item-nome">${item.nome}</span>
      <input type="number" class="item-qtd-input" value="${item.quantidade}" min="0">
      <select class="item-unidade-select">
        <option value="un" ${item.unidade === "un" ? "selected" : ""}>un</option>
        <option value="kg" ${item.unidade === "kg" ? "selected" : ""}>kg</option>
        <option value="gr" ${item.unidade === "gr" ? "selected" : ""}>gr</option>
        <option value="L" ${item.unidade === "L" ? "selected" : ""}>L</option>
      </select>
      <button class="btn-excluir">&times;</button>
    `;

    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => alternarComprado(item.id));

    const qtdInput = li.querySelector(".item-qtd-input");
    qtdInput.addEventListener("change", () => {
      item.quantidade = Math.max(0, parseInt(qtdInput.value, 10) || 0);
    });

    const unidadeSelect = li.querySelector(".item-unidade-select");
    unidadeSelect.addEventListener("change", () => {
      item.unidade = unidadeSelect.value;
    });

    const btnExcluir = li.querySelector(".btn-excluir");
    btnExcluir.addEventListener("click", () => excluirItem(item.id));

    listaEl.appendChild(li);
  });
}

function adicionarItem() {
  const nome = inputNome.value.trim();
  if (!nome) {
    inputNome.focus();
    return;
  }

  const quantidade = Math.max(0, parseInt(inputQtd.value, 10) || 0);
  const unidade = selectUnidade.value;

  itensSalvos.push({
    id: idContador++,
    nome,
    quantidade,
    unidade,
    comprado: false,
  });

  inputNome.value = "";
  inputQtd.value = "0";
  inputNome.focus();
  renderizarLista();
}

function alternarComprado(id) {
  const item = itensSalvos.find((i) => i.id === id);
  if (item) {
    item.comprado = !item.comprado;
    renderizarLista();
  }
}

function excluirItem(id) {
  itensSalvos = itensSalvos.filter((i) => i.id !== id);
  renderizarLista();
}

function limparComprados() {
  itensSalvos = itensSalvos.filter((i) => !i.comprado);
  renderizarLista();
}

function limparTudo() {
  if (itensSalvos.length === 0) return;
  if (confirm("Tem certeza que deseja limpar todos os itens?")) {
    itensSalvos = [];
    renderizarLista();
  }
}

function sugerirItens() {
  const sugestoes = [
    "Arroz", "Feijão", "Macarrão", "Açúcar", "Café", "Leite",
    "Pão", "Manteiga", "Ovos", "Frango", "Carne moída", "Banana",
    "Maçã", "Alface", "Tomate", "Cebola", "Alho", "Batata",
    "Óleo de cozinha", "Sal", "Sabão em pó", "Detergente",
  ];

  const novas = sugestoes
    .filter(
      (s) => !itensSalvos.some((i) => i.nome.toLowerCase() === s.toLowerCase())
    )
    .slice(0, 5);

  novas.forEach((nome) => {
    itensSalvos.push({
      id: idContador++,
      nome,
      quantidade: 0,
      unidade: "un",
      comprado: false,
    });
  });

  renderizarLista();
}

document.getElementById("form-adicionar").addEventListener("submit", (e) => {
  e.preventDefault();
  adicionarItem();
});

document.getElementById("btn-sugerir").addEventListener("click", sugerirItens);
document.getElementById("btn-limpar-comprados").addEventListener("click", limparComprados);
document.getElementById("btn-limpar-tudo").addEventListener("click", limparTudo);

renderizarLista();
