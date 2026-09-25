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
  document.querySelector("#summary").innerHTML = `
    <h2><span class="step-n">4</span> Resumo</h2>
    <div class="summary-item">
      <img src="${draft.image}" alt="${draft.product}">
      <div>
        <strong>${draft.product}</strong>
        <div class="muted">${draft.tone} · Qtd ${draft.qty}</div>
        <div>${money(total)}</div>
      </div>
    </div>
    <div class="totals">
      <div><span>Subtotal</span><span>${money(total)}</span></div>
      <div><span>Frete</span><span>Grátis</span></div>
      <div class="grand"><span>Total</span><span>${money(total)}</span></div>
    </div>
  `;
}

function selectedPay() {
  return document.querySelector('input[name="pagamento"]:checked').value;
}

document.querySelectorAll('input[name="pagamento"]').forEach((input) => {
  input.onchange = () => {
    document.querySelectorAll(".pay-opt").forEach((box) => {
      const radio = box.querySelector('input[name="pagamento"]');
      if (!radio) return;
      box.classList.toggle("active", radio.checked);
    });
  };
});

document.querySelector("#telefone").addEventListener("input", (event) => {
  event.target.value = maskPhone(event.target.value);
});
document.querySelector("#cpf").addEventListener("input", (event) => {
  event.target.value = maskCpf(event.target.value);
});
document.querySelector("#cep").addEventListener("input", async (event) => {
  event.target.value = maskCep(event.target.value);
  const cep = onlyDigits(event.target.value);
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return;
    document.querySelector("#rua").value = data.logradouro || "";
    document.querySelector("#bairro").value = data.bairro || "";
    document.querySelector("#cidade").value = data.localidade || "";
    document.querySelector("#uf").value = data.uf || "";
  } catch {
    toast("Não foi possível buscar o CEP");
  }
});

document.querySelector("#checkout").onsubmit = (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  document.querySelector("#err-id").textContent = "";
  document.querySelector("#err-addr").textContent = "";
  document.querySelector("#err-pay").textContent = "";

  if (form.get("nome").trim().split(" ").length < 2) {
    document.querySelector("#err-id").textContent = "Informe nome e sobrenome.";
    return;
  }
  if (onlyDigits(form.get("telefone")).length < 10) {
    document.querySelector("#err-id").textContent = "Informe um celular válido.";
    return;
  }
  if (!validCpf(form.get("cpf"))) {
    document.querySelector("#err-id").textContent = "CPF inválido.";
    return;
  }
  if (onlyDigits(form.get("cep")).length !== 8) {
    document.querySelector("#err-addr").textContent = "CEP inválido.";
    return;
  }

  const pagamento = selectedPay();
  if (pagamento === "cartao") {
    const numero = onlyDigits(document.querySelector("#cartao").value);
    const validade = document.querySelector("#validade").value.trim();
    const cvv = onlyDigits(document.querySelector("#cvv").value);
    const nomeCartao = document.querySelector("#nome-cartao").value.trim();
    if (numero.length < 13 || !/^\d{2}\/\d{2}$/.test(validade) || cvv.length < 3 || nomeCartao.length < 3) {
      document.querySelector("#err-pay").textContent = "Confira os dados do cartão. Eles não são armazenados.";
      return;
    }
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
    pagamento,
    total: draft.price * draft.qty,
    criadoEm: new Date().toISOString(),
  };
  saveOrder(order);
  location.href = "obrigado.html";
};

renderSummary();
