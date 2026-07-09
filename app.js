const STORAGE_KEY = "lista-compras-items";

const form = document.getElementById("add-form");
const input = document.getElementById("item-input");
const list = document.getElementById("list");
const counter = document.getElementById("counter");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");

let items = loadItems();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  items.push({
    id: crypto.randomUUID(),
    text,
    done: false,
  });

  input.value = "";
  saveAndRender();
  input.focus();
});

clearCompletedBtn.addEventListener("click", () => {
  items = items.filter((item) => !item.done);
  saveAndRender();
});

clearAllBtn.addEventListener("click", () => {
  if (!items.length) return;

  const confirmed = window.confirm("Deseja remover todos os itens da lista?");
  if (!confirmed) return;

  items = [];
  saveAndRender();
});

function loadItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return getDefaultItems();

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : getDefaultItems();
  } catch {
    return [];
  }
}

function getDefaultItems() {
  const defaultTexts = [
    "Arroz", "Feijão", "Leite", "Pão", "Mussarela", "Café",
    "Banana", "Maçã", "Morango", "Cenoura", "Refrigerante",
    "Aveia", "Carne", "Verduras", "legumes", "Salgadinho",
  ];
  return defaultTexts.map((text) => ({
    id: crypto.randomUUID(),
    text,
    done: false,
  }));
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function saveAndRender() {
  saveItems();
  render();
}

function render() {
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = `list-item${item.done ? " done" : ""}`;
    li.dataset.id = item.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "item-checkbox";
    checkbox.checked = item.done;
    checkbox.setAttribute("aria-label", `Marcar ${item.text} como comprado`);
    checkbox.addEventListener("change", () => toggleItem(item.id));

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = item.text;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.setAttribute("aria-label", `Remover ${item.text}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeItem(item.id));

    li.append(checkbox, span, removeBtn);
    list.appendChild(li);
  });

  const pendingCount = items.filter((item) => !item.done).length;
  const completedCount = items.length - pendingCount;

  counter.textContent =
    items.length === 0
      ? "Nenhum item na lista"
      : pendingCount === 1
        ? "1 item pendente"
        : `${pendingCount} itens pendentes`;

  emptyState.classList.toggle("hidden", items.length > 0);
  clearCompletedBtn.disabled = completedCount === 0;
  clearAllBtn.disabled = items.length === 0;
}

function toggleItem(id) {
  items = items.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item
  );
  saveAndRender();
}

function removeItem(id) {
  items = items.filter((item) => item.id !== id);
  saveAndRender();
}

render();
input.focus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Falha silenciosa em origens sem suporte (ex.: file://).
    });
  });
}
