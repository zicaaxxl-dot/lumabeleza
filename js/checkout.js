const draft = readOrder() || {
  product: STORE.product,
  tone: "Bege Claro",
  toneId: "claro",
  image: "images/seletor/claro.jpg",
  qty: 1,
  price: STORE.price,
  oldPrice: STORE.oldPrice,
};

function renderSummary() {
  const total = draft.price * draft.qty;
  const old = draft.oldPrice * draft.qty;
  document.querySelector("#summary").innerHTML = `
    <h2>Resumo do pedido</h2>
    <div class="sum-top">
      <img src="${draft.image}" alt="${draft.product}">
      <div>
        <strong>${draft.product}</strong>
        <span class="tone-chip">${draft.tone} · ${draft.qty} un.</span>
      </div>
      <div class="vega-total"><s>${money(old)}</s>${money(total)}</div>
    </div>
    <div class="totals">
      <div><span>Produtos</span><span>${money(total)}</span></div>
      <div><span>Frete</span><span>Grátis</span></div>
      <div class="grand"><span>Total</span><span>${money(total)}</span></div>
    </div>
  `;
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
      document.querySelector("#err-addr").textContent = "CEP não encontrado.";
      return;
    }
    document.querySelector("#err-addr").textContent = "";
    document.querySelector("#rua").value = data.logradouro || "";
    document.querySelector("#bairro").value = data.bairro || "";
    document.querySelector("#cidade").value = data.localidade || "";
    document.querySelector("#uf").value = data.uf || "";
    document.querySelector("#numero").focus();
    refreshSteps();
  } catch {
    toast("Não foi possível buscar o CEP");
  }
}

function field(id) {
  return document.querySelector("#" + id).value.trim();
}

function identityOk() {
  const email = field("email");
  return field("nome").split(/\s+/).filter(Boolean).length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

const revealed = { entrega: false, pagamento: false };

function refreshSteps() {
  const idOk = identityOk();
  const addrOk = idOk && addressOk();
  const entrega = document.querySelector("#step-entrega");
  const pay = document.querySelector("#step-pay");
  entrega.classList.toggle("is-open", idOk);
  pay.classList.toggle("is-open", addrOk);
  if (idOk && !revealed.entrega) {
    revealed.entrega = true;
    entrega.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (!idOk) revealed.entrega = false;
  if (addrOk && !revealed.pagamento) {
    revealed.pagamento = true;
    pay.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (!addrOk) revealed.pagamento = false;
}

document.querySelector("#telefone").addEventListener("input", (event) => {
  event.target.value = maskPhone(event.target.value);
  refreshSteps();
});
document.querySelector("#cpf").addEventListener("input", (event) => {
  event.target.value = maskCpf(event.target.value);
  refreshSteps();
});
document.querySelector("#cep").addEventListener("input", (event) => {
  event.target.value = maskCep(event.target.value);
  if (onlyDigits(event.target.value).length === 8) buscarCep();
  refreshSteps();
});
document.querySelector("#buscar-cep").onclick = buscarCep;
["nome", "email", "rua", "numero", "bairro", "cidade", "uf"].forEach((id) => {
  document.querySelector("#" + id).addEventListener("input", refreshSteps);
});

document.querySelector("#checkout").onsubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  document.querySelector("#err-id").textContent = "";
  document.querySelector("#err-addr").textContent = "";

  if (!identityOk()) {
    document.querySelector("#err-id").textContent = "Preencha nome, e-mail, celular e um CPF válido.";
    document.querySelector("#nome").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (!addressOk()) {
    document.querySelector("#step-entrega").classList.add("is-open");
    document.querySelector("#err-addr").textContent = "Complete o endereço de entrega.";
    document.querySelector("#step-entrega").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const order = {
    ...draft,
    id: `LB${Date.now().toString().slice(-8)}`,
    nome: form.get("nome").trim(),
    email: form.get("email").trim(),
    telefone: form.get("telefone").trim(),
    cpf: form.get("cpf").trim(),
    endereco: {
      cep: form.get("cep").trim(),
      rua: form.get("rua").trim(),
      numero: form.get("numero").trim(),
      complemento: form.get("complemento").trim(),
      bairro: form.get("bairro").trim(),
      cidade: form.get("cidade").trim(),
      uf: form.get("uf").trim().toUpperCase(),
    },
    pagamento: "pix",
    total: draft.price * draft.qty,
    criadoEm: new Date().toISOString(),
  };
  saveOrder(order);
  location.href = "obrigado.html";
};

renderSummary();
