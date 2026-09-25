const STORE = {
  name: "Luma Beleza",
  product: "BASE COM REFIL + PINCEL MÁGICO E RÍMEL",
  oldPrice: 149.9,
  price: 89.9,
  whatsapp: "",
  email: "contato@lumabeleza.com",
};

const TONES = [
  { id: "claro", label: "Bege Claro", hint: "Peles claras", image: "images/seletor/claro.jpg" },
  { id: "medio", label: "Bege Médio", hint: "Peles morenas", image: "images/seletor/medio.jpg" },
  { id: "escuro", label: "Bege Escuro", hint: "Peles negras", image: "images/seletor/escuro.jpg" },
];

const GALLERY = [
  "images/carrossel/01.jpg",
  "images/carrossel/02.jpg",
  "images/carrossel/03.jpg",
  "images/carrossel/04.png",
  "images/carrossel/05.png",
  "images/carrossel/06.png",
];

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function readOrder() {
  try {
    return JSON.parse(localStorage.getItem("luma-order") || "null");
  } catch {
    return null;
  }
}

function saveOrder(order) {
  localStorage.setItem("luma-order", JSON.stringify(order));
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.style.display = "none"; }, 2200);
}

function onlyDigits(value) {
  return (value || "").replace(/\D/g, "");
}

function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length < 3) return d;
  if (d.length < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length < 11) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCpf(value) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function validCpf(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

function openWhatsApp(text) {
  const msg = encodeURIComponent(text || `Olá! Quero o ${STORE.product}`);
  const url = STORE.whatsapp
    ? `https://wa.me/${STORE.whatsapp}?text=${msg}`
    : `https://wa.me/?text=${msg}`;
  window.open(url, "_blank", "noopener");
}
