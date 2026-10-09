let cart = readCart();
if (!cart.toneId) location.replace("index.html");
let numbers = quote(cart);
const DRAFT = "luma-checkout-draft";
let step = 1;

function renderSummary() {
  const saved = Math.max(0, Math.round((numbers.old - numbers.total) * 100) / 100);
  document.querySelector("#summary").innerHTML = `
    <div class="co-item">
      <img src="${String(cart.image).split("?")[0]}${ASSET}" alt="" width="72" height="90">
      <div>
        <strong>${STORE.product}</strong>
        <span>${cart.tone} · ${cart.qty} un.</span>
      </div>
      <div class="co-item-price"><s>${money(numbers.old)}</s><b>${money(numbers.base)}</b></div>
    </div>
    <div class="co-rows">
      <div><span>Subtotal</span><b>${money(numbers.base)}</b></div>
      ${numbers.couponOff ? `<div class="sub"><span>Cupom BEMVINDO10</span><span class="red">−${money(numbers.couponOff)}</span></div>` : ""}
      <div><span>Frete</span><b class="free">Grátis</b></div>
      <div class="total"><span>Total</span><b>${money(numbers.total)}</b></div>
    </div>
    ${saved ? `<p class="co-save">Você economiza <b>${money(saved)}</b></p>` : ""}
  `;
  document.querySelector("#sum-count").textContent = String(numbers.count);
  document.querySelector("#pix-amount").textContent = money(numbers.total);
}

function field(id) {
  return document.querySelector("#" + id).value.trim();
}

function identityOk() {
  return field("nome").split(/\s+/).filter(Boolean).length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email"))
    && onlyDigits(field("telefone")).length >= 10
    && validCpf(field("cpf"));
}

function addressOk() {
  return onlyDigits(field("cep")).length === 8
    && field("rua").length > 2
    && field("numero").length > 0
    && field("bairro").length > 1
    && field("cidade").length > 1
    && field("uf").length === 2;
}

function showStep(next) {
  step = next;
  document.querySelectorAll(".step-panel").forEach((panel) => {
    panel.hidden = Number(panel.dataset.step) !== step;
  });
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    const n = Number(btn.dataset.goto);
    const item = btn.closest("li");
    item.classList.toggle("on", n === step);
    item.classList.toggle("done", n < step);
  });
  document.querySelector("#finish").textContent = ["", "Ir para entrega", "Ir para pagamento", "Finalizar compra"][step];
  saveDraft();
  window.scrollTo(0, 0);
}

function focusInvalid(stepNumber) {
  const map = {
    1: ["nome", "email", "telefone", "cpf"],
    2: ["cep", "rua", "numero", "bairro", "cidade", "uf"],
  };
  const rules = {
    nome: () => field("nome").split(/\s+/).filter(Boolean).length >= 2,
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email")),
    telefone: () => onlyDigits(field("telefone")).length >= 10,
    cpf: () => validCpf(field("cpf")),
    cep: () => onlyDigits(field("cep")).length === 8,
    rua: () => field("rua").length > 2,
    numero: () => field("numero").length > 0,
    bairro: () => field("bairro").length > 1,
    cidade: () => field("cidade").length > 1,
    uf: () => field("uf").length === 2,
  };
  const id = (map[stepNumber] || []).find((key) => !rules[key]());
  if (id) document.querySelector("#" + id).focus();
}

async function buscarCep() {
  const cep = onlyDigits(document.querySelector("#cep").value);
  if (cep.length !== 8) {
    document.querySelector("#err-addr").textContent = "Informe um CEP com 8 números.";
    return;
  }
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) {
      document.querySelector("#err-addr").textContent = "CEP não encontrado. Preencha o endereço.";
      return;
    }
    document.querySelector("#err-addr").textContent = "";
    document.querySelector("#rua").value = data.logradouro || "";
    document.querySelector("#bairro").value = data.bairro || "";
    document.querySelector("#cidade").value = data.localidade || "";
    document.querySelector("#uf").value = data.uf || "";
    document.querySelector("#numero").focus();
    paintChecks();
    saveDraft();
  } catch {
    document.querySelector("#err-addr").textContent = "Não foi possível buscar o CEP. Preencha o endereço.";
  }
}

function saveDraft() {
  const data = {};
  ["nome", "email", "telefone", "cpf", "cep", "rua", "numero", "complemento", "bairro", "cidade", "uf", "destinatario"].forEach((id) => {
    data[id] = document.querySelector("#" + id).value;
  });
  data.step = step;
  sessionStorage.setItem(DRAFT, JSON.stringify(data));
}

function loadDraft() {
  try {
    const data = JSON.parse(sessionStorage.getItem(DRAFT) || "null");
    if (!data) return;
    Object.keys(data).forEach((id) => {
      const input = document.querySelector("#" + id);
      if (input && id !== "step") input.value = data[id];
    });
  } catch {
    sessionStorage.removeItem(DRAFT);
  }
}

function paintChecks() {
  const rules = {
    nome: () => field("nome").split(/\s+/).filter(Boolean).length >= 2,
    email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email")),
    telefone: () => onlyDigits(field("telefone")).length >= 10,
    cpf: () => validCpf(field("cpf")),
    cep: () => onlyDigits(field("cep")).length === 8,
    rua: () => field("rua").length > 2,
    numero: () => field("numero").length > 0,
    bairro: () => field("bairro").length > 1,
    cidade: () => field("cidade").length > 1,
    uf: () => field("uf").length === 2,
    destinatario: () => field("destinatario").length > 2,
  };
  Object.keys(rules).forEach((id) => {
    const input = document.querySelector("#" + id);
    const wrap = input && input.closest(".field");
    if (wrap) wrap.classList.toggle("is-ok", rules[id]());
  });
}

function paintCoupon() {
  const on = cart.coupon === "BEMVINDO10";
  document.querySelector("#use-welcome").classList.toggle("on", on);
  if (on) document.querySelector("#coupon").value = "BEMVINDO10";
  document.querySelector("#apply-coupon").textContent = on ? "Aplicado" : "Aplicar";
  const msg = document.querySelector("#coupon-msg");
  msg.textContent = on ? "Cupom BEMVINDO10 aplicado." : "";
  msg.classList.toggle("ok", on);
}

function applyWelcome() {
  document.querySelector("#coupon").value = "BEMVINDO10";
  cart.coupon = "BEMVINDO10";
  saveCart(cart);
  numbers = quote(cart);
  renderSummary();
  paintCoupon();
}

document.querySelector("#telefone").addEventListener("input", (event) => {
  event.target.value = maskPhone(event.target.value);
});
document.querySelector("#cpf").addEventListener("input", (event) => {
  event.target.value = maskCpf(event.target.value);
});
document.querySelector("#cep").addEventListener("input", (event) => {
  event.target.value = maskCep(event.target.value);
  if (onlyDigits(event.target.value).length === 8) buscarCep();
});
document.querySelector("#buscar-cep").onclick = () => {
  if (onlyDigits(document.querySelector("#cep").value).length === 8) buscarCep();
  else window.open("https://buscacepinter.correios.com.br/app/endereco/index.php", "_blank", "noopener");
};
document.querySelector("#checkout").addEventListener("input", () => {
  if (!field("destinatario") && field("nome")) document.querySelector("#destinatario").value = field("nome");
  paintChecks();
  saveDraft();
});
document.querySelectorAll("[data-goto]").forEach((btn) => {
  btn.onclick = () => {
    const target = Number(btn.dataset.goto);
    if (target <= step) showStep(target);
  };
});
document.querySelector("#toggle-summary").onclick = () => {
  const body = document.querySelector("#summary");
  body.hidden = !body.hidden;
  document.querySelector("#toggle-summary").setAttribute("aria-expanded", String(!body.hidden));
};
document.querySelector("#apply-coupon").onclick = () => {
  const code = document.querySelector("#coupon").value.trim().toUpperCase();
  if (code === "BEMVINDO10") {
    applyWelcome();
    return;
  }
  cart.coupon = "";
  saveCart(cart);
  numbers = quote(cart);
  renderSummary();
  paintCoupon();
  const msg = document.querySelector("#coupon-msg");
  msg.textContent = code ? "Esse cupom não existe." : "";
  msg.classList.remove("ok");
};
document.querySelector("#use-welcome").onclick = applyWelcome;

document.querySelector("#finish").onclick = () => {
  document.querySelector("#err-id").textContent = "";
  document.querySelector("#err-addr").textContent = "";
  document.querySelector("#pix-err").textContent = "";
  if (step === 1) {
    if (!identityOk()) {
      document.querySelector("#err-id").textContent = "Preencha nome completo, e-mail, telefone e um CPF válido.";
      focusInvalid(1);
      return;
    }
    showStep(2);
    return;
  }
  if (step === 2) {
    if (!addressOk()) {
      document.querySelector("#err-addr").textContent = "Complete o endereço de entrega.";
      focusInvalid(2);
      return;
    }
    showStep(3);
    return;
  }
  saveOrder({
    product: STORE.product,
    tone: cart.tone,
    toneId: cart.toneId,
    image: cart.image,
    qty: cart.qty,
    price: STORE.price,
    oldPrice: STORE.oldPrice,
    coupon: cart.coupon,
    id: `LB${Date.now().toString().slice(-8)}`,
    nome: field("nome"),
    email: field("email"),
    telefone: field("telefone"),
    cpf: field("cpf"),
    endereco: {
      cep: field("cep"),
      rua: field("rua"),
      numero: field("numero"),
      complemento: field("complemento"),
      bairro: field("bairro"),
      cidade: field("cidade"),
      uf: field("uf").toUpperCase(),
      destinatario: field("destinatario") || field("nome"),
    },
    pagamento: "pix",
    status: "pending",
    total: numbers.total,
    criadoEm: new Date().toISOString(),
  });
  location.href = "obrigado.html";
};

loadDraft();
paintChecks();
renderSummary();
paintCoupon();
showStep(1);
