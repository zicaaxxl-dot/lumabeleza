const REVIEWS = [
  { name: "Yasmin Elisa Alves", text: "Recebi. Levou 11 dias e olha que moro no interior, então aprovado. Já usei a base e cobre muito bem, é igualzinho ao do vídeo. Podem comprar que é confiável.", photo: "images/avaliacoes/01.jpeg", stars: 5 },
  { name: "Maisa Tenório", text: "A minha chegou com atraso de 3 dias do prazo informado. Base de cobertura média, serve para o dia a dia. Pelo preço vale 100% a compra e veio a base com um refil. A embalagem é muito chic.", photo: "images/avaliacoes/02.jpeg", stars: 5 },
  { name: "Luiza Delgado", text: "Base excelente e vale o preço. Quando você vai batendo a esponjinha no rosto, ela vai se adaptando ao tom da pele. Esse é o maior diferencial. A entrega veio certa.", photo: "images/avaliacoes/03.jpeg", stars: 5 },
  { name: "Isabella Matos", text: "Recebi dentro do prazo, base excelente e ganhei o refil de brinde.", stars: 5 },
  { name: "Caroline Xavier", text: "Também recebi a minha compra. Vocês anunciam como compre 1 e ganhe 2, e no caso você compra 1 base e dentro vem 1 refil para quando acabar. Apenas isso. Recomendo de olhos fechados.", photo: "images/avaliacoes/04.jpeg", stars: 5 },
  { name: "Ana Rocha Nunes", text: "Disse que ia avisar quando chegasse e recebi as minhas bases. Gostei bastante. Embalagem linda, cobertura boa e chegou com uns 8 dias.", photo: "images/avaliacoes/05.jpeg", stars: 5 },
  { name: "Catarina Cunha", text: "Se você precisa de uma base corretiva que deixe a pele maravilhosa, esse é o produto certo. Vale cada centavo e a loja entregou certinha.", stars: 5 },
  { name: "Amanda Costa Silva", text: "Eu amei, superou minhas expectativas. Muito boa, super recomendo e comprei a minha aqui mesmo.", photo: "images/avaliacoes/06.jpeg", stars: 5 },
  { name: "Eloísa Almeida", text: "Base boa, cobre bem e eu indico para o dia a dia. Demorou menos de 10 dias para chegar e veio em uma embalagem linda com um refil. Nota 10.", stars: 5 },
  { name: "Francisca Santiago", text: "Entrega antes do prazo e veio a base com um refil em uma embalagem bem bonita.", photo: "images/avaliacoes/07.jpeg", stars: 5 },
  { name: "Helena Pereira", text: "Comprei 2 bases de uma vez e amei. A entrega foi feita aqui em casa com 9 dias e sou do interior do Paraná. Deu certinho com o tom da minha pele.", stars: 5 },
  { name: "Gabriela Souza", text: "Tirando um pequeno atraso, eu recomendo. A base é de alta cobertura e deixa o rosto natural. Peguei na promoção também.", photo: "images/avaliacoes/08.jpeg", stars: 4 },
  { name: "Eliane Moreira", text: "A minha veio bem certinha, não tenho nada a reclamar.", stars: 5 },
  { name: "Yana Oliveira", text: "Bom dia, a minha base chegou e gostaria de agradecer a moça que atende no WhatsApp por ter trocado meu tom. Parabéns e sucesso à loja.", stars: 5 },
  { name: "Adriana Ramos", text: "Realizei minha compra e recebi com 9 dias. Produto de excelente qualidade e boa cobertura, veio o refil e dois aplicadores. Nota 10 para a loja.", photo: "images/avaliacoes/09.jpeg", stars: 5 },
  { name: "Tânia Castro", text: "Compra honesta, pedido chegou e já usei. Afirmo que valeu a pena. Vou recomendar para todas as minhas amigas.", stars: 5 },
  { name: "Karine Marques", text: "Avalio a loja e a base muito bem. O suporte no WhatsApp é nota 1000 e a base chegou no tempo certo, com o refil prometido, em uma embalagem belíssima. Podem comprar que chega sim.", photo: "images/avaliacoes/10.jpeg", stars: 5 },
  { name: "Gabriela Costa", text: "Nada a reclamar. A compra chegou dentro do prazo e a base tem cobertura excelente, ideal para o dia a dia.", stars: 4 },
  { name: "Raquel Sabóia", text: "Fiz meu pedido baseada nos comentários e é real. Entregue em 6 dias em Salvador. Recebi a base com refil e o rímel de brinde. A loja é organizada.", stars: 5 },
  { name: "Juliana Santos", text: "Comprei porque vi os comentários. Chegou com 8 dias, veio a base na caixa junto com o refil, o aplicador e o rímel. Paguei no PIX e o atendimento no WhatsApp foi imediato.", stars: 5 },
];

const state = { tone: null, qty: 1, slide: 0, shown: 6, tonePicked: false, pendingBuy: false };

function slides() {
  const tone = TONES.find((item) => item.id === state.tone);
  if (!state.tonePicked) return GALLERY;
  return [GALLERY[0], tone.image, ...GALLERY.slice(1)];
}

function shortTone(label) {
  return label.replace(/^Bege\s+/i, "");
}

function renderGallery() {
  const list = slides();
  const stage = document.querySelector("#stage-img");
  const next = list[state.slide] || list[0];
  if ((stage.getAttribute("src") || "").split("?")[0] !== next) stage.src = next + ASSET;
  stage.alt = STORE.product;
  const dots = document.querySelector("#gallery-dots");
  dots.innerHTML = list.map((_, index) => `
    <button type="button" class="${index === state.slide ? "active" : ""}" data-slide="${index}" aria-label="Foto ${index + 1}"></button>
  `).join("");
}

function barsHtml() {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  REVIEWS.forEach((review) => { counts[review.stars] = (counts[review.stars] || 0) + 1; });
  return [5, 4, 3, 2, 1].map((star) => `
    <div class="bar-row"><span>${star} ★</span><i><b style="width:${Math.round((counts[star] / REVIEWS.length) * 100)}%"></b></i><em>${counts[star]}</em></div>
  `).join("");
}

function renderReviews() {
  document.querySelector("#review-list").innerHTML = REVIEWS.slice(0, state.shown).map((review) => `
    <article class="review-card">
      <header>
        <strong>${review.name}</strong>
        <span class="verified">Compra verificada</span>
      </header>
      <div class="stars">${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}</div>
      <p>${review.text}</p>
      ${review.photo ? `<img src="${review.photo}" alt="Foto enviada por ${review.name}" loading="lazy" decoding="async">` : ""}
    </article>
  `).join("");
  document.querySelector("#more-reviews").style.display = state.shown >= REVIEWS.length ? "none" : "block";
}

function focusTones() {
  if (document.activeElement) document.activeElement.blur();
  document.querySelector("#tones").classList.add("need-pick");
  document.querySelector("#tone-hint").textContent = "Escolha um tom para continuar a compra.";
  const label = document.querySelector("#tom-label");
  const top = label.getBoundingClientRect().top + window.scrollY - 78;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  toast("Escolha o tom da base");
}

function syncCart() {
  const tone = TONES.find((item) => item.id === state.tone);
  const cart = readCart();
  cart.toneId = state.tonePicked ? state.tone : "";
  cart.tone = tone ? tone.label : "";
  cart.qty = state.qty;
  cart.image = tone ? tone.image : GALLERY[0];
  saveCart(cart);
  const count = document.querySelector(".cart-count");
  const numbers = quote(cart);
  count.dataset.n = String(numbers.count);
  count.textContent = numbers.count ? String(numbers.count) : "";
  renderCart(cart, numbers);
}

function renderCart(cart, numbers) {
  const body = document.querySelector("#cart-body");
  const dock = document.querySelector("#cart-dock");
  if (!cart.toneId) {
    body.innerHTML = `<p>Seu carrinho está vazio. Escolha o tom e toque em comprar agora.</p>`;
    dock.hidden = true;
    return;
  }
  body.innerHTML = `
    <div class="co-item">
      <img src="${cart.image}${ASSET}" alt="" width="72" height="90">
      <div><strong>${STORE.product}</strong><span>${cart.tone} · ${cart.qty} un.</span></div>
      <div class="co-item-price"><b>${money(numbers.total)}</b></div>
    </div>
  `;
  dock.hidden = false;
  dock.innerHTML = `
    <div class="dock-row"><span>Frete</span><b>Grátis</b></div>
    <div class="dock-row grand"><span>Total</span><b>${money(numbers.total)}</b></div>
    <button class="cart-buy" type="button" data-buy>Comprar agora</button>
  `;
  dock.querySelector("[data-buy]").onclick = () => {
    document.querySelector("#cart").classList.remove("open");
    goCheckout();
  };
}

function goCheckout() {
  if (!state.tonePicked) {
    state.pendingBuy = true;
    focusTones();
    return;
  }
  syncCart();
  const tone = TONES.find((item) => item.id === state.tone);
  saveOrder({
    product: STORE.product,
    tone: tone.label,
    toneId: tone.id,
    image: tone.image,
    qty: state.qty,
    price: STORE.price,
    oldPrice: STORE.oldPrice,
  });
  location.href = "checkout.html";
}

function bindChrome() {
  const menu = document.querySelector("#menu");
  const search = document.querySelector("#search");
  const cart = document.querySelector("#cart");
  document.querySelector("#open-menu").onclick = () => menu.classList.add("open");
  document.querySelector("#open-search").onclick = () => search.classList.add("open");
  document.querySelector("#open-cart").onclick = () => {
    syncCart();
    cart.classList.add("open");
  };
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.onclick = () => btn.closest(".drawer, .modal").classList.remove("open");
  });
  document.querySelectorAll(".drawer, .modal").forEach((layer) => {
    layer.addEventListener("click", (event) => {
      if (event.target === layer) layer.classList.remove("open");
    });
  });
  document.querySelector("#search-form").onsubmit = (event) => {
    event.preventDefault();
    const q = document.querySelector("#q").value.trim().toLowerCase();
    search.classList.remove("open");
    if (!q || STORE.product.toLowerCase().includes(q) || "base refil pincel rimel".includes(q)) {
      document.querySelector("#comprar").scrollIntoView();
      toast("Mostrando o kit da base");
      return;
    }
    toast("Nenhum outro produto encontrado");
  };
  document.querySelector("#wa").onclick = () => openWhatsApp();
  document.querySelector("#review-form").onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    REVIEWS.unshift({ name: data.get("name"), text: data.get("text"), stars: Number(data.get("stars")) });
    state.shown += 1;
    renderReviews();
    document.querySelector("#review-bars").innerHTML = barsHtml();
    document.querySelector("#pop-bars").innerHTML = barsHtml();
    document.querySelector("#review-modal").classList.remove("open");
    event.target.reset();
    toast("Avaliação publicada");
  };
  document.querySelector("#open-rating").onclick = () => {
    document.querySelector("#rating-pop").hidden = false;
  };
  document.querySelector("#close-pop").onclick = () => {
    document.querySelector("#rating-pop").hidden = true;
  };
  document.querySelector("#read-reviews").onclick = () => {
    document.querySelector("#rating-pop").hidden = true;
    document.querySelector("#avaliacoes").scrollIntoView();
  };
  document.querySelector("#open-shade").onclick = () => {
    document.querySelector("#duvidas").scrollIntoView();
  };
  document.querySelector("#ship-form").onsubmit = async (event) => {
    event.preventDefault();
    const cep = onlyDigits(document.querySelector("#cep").value);
    const box = document.querySelector("#ship-result");
    box.hidden = false;
    if (cep.length !== 8) {
      box.textContent = "Informe um CEP com 8 números.";
      return;
    }
    box.textContent = "Calculando...";
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        box.textContent = "CEP não encontrado.";
        return;
      }
      box.innerHTML = `<ul class="ship-option"><li><b class="ship-free">Frete grátis</b><span class="ship-when">${data.localidade}/${data.uf} · até 7 dias úteis</span></li></ul>`;
    } catch {
      box.textContent = "Não foi possível calcular agora. O frete continua grátis.";
    }
  };
  document.querySelector("#cep").addEventListener("input", (event) => {
    event.target.value = maskCep(event.target.value);
  });
  document.querySelector("#gallery-dots").onclick = (event) => {
    const btn = event.target.closest("[data-slide]");
    if (!btn) return;
    state.slide = Number(btn.dataset.slide);
    renderGallery();
  };
  document.querySelector("#prev-photo").onclick = () => {
    const total = slides().length;
    state.slide = (state.slide - 1 + total) % total;
    renderGallery();
  };
  document.querySelector("#next-photo").onclick = () => {
    state.slide = (state.slide + 1) % slides().length;
    renderGallery();
  };
}

document.querySelector("#old-price").textContent = money(STORE.oldPrice);
document.querySelector("#price").textContent = money(STORE.price);
document.querySelector("#bar-old").textContent = money(STORE.oldPrice);
document.querySelector("#bar-now").textContent = money(STORE.price);
document.querySelector("#review-bars").innerHTML = barsHtml();
document.querySelector("#pop-bars").innerHTML = barsHtml();
document.querySelector("#tones").innerHTML = TONES.map((tone) => `
  <button type="button" class="tone" data-tone="${tone.id}">
    <img src="${(THUMBS[tone.image] || tone.image) + ASSET}" alt="">
    <strong>${shortTone(tone.label)}</strong>
  </button>
`).join("");

document.querySelector("#tones").onclick = (event) => {
  const btn = event.target.closest("[data-tone]");
  if (!btn) return;
  state.tone = btn.dataset.tone;
  state.tonePicked = true;
  state.slide = 1;
  const tone = TONES.find((item) => item.id === state.tone);
  document.querySelector("#tones").classList.remove("need-pick");
  document.querySelector("#tone-hint").textContent = tone.hint;
  document.querySelectorAll(".tone").forEach((el) => el.classList.toggle("active", el.dataset.tone === state.tone));
  renderGallery();
  syncCart();
  if (state.pendingBuy) {
    state.pendingBuy = false;
    goCheckout();
  }
};
document.querySelector("#qty").value = state.qty;
document.querySelector("#minus").onclick = () => {
  state.qty = Math.max(1, state.qty - 1);
  document.querySelector("#qty").value = state.qty;
  if (state.tonePicked) syncCart();
};
document.querySelector("#plus").onclick = () => {
  state.qty = Math.min(5, state.qty + 1);
  document.querySelector("#qty").value = state.qty;
  if (state.tonePicked) syncCart();
};
document.querySelector("#qty").onchange = (event) => {
  state.qty = Math.min(5, Math.max(1, Number(event.target.value) || 1));
  event.target.value = state.qty;
  if (state.tonePicked) syncCart();
};
document.querySelectorAll("[data-buy]").forEach((btn) => {
  btn.onclick = () => {
    btn.blur();
    goCheckout();
  };
});
document.querySelector("#open-review").onclick = () => document.querySelector("#review-modal").classList.add("open");
document.querySelector("#more-reviews").onclick = () => {
  state.shown = REVIEWS.length;
  renderReviews();
};

const savedCart = readCart();
if (savedCart.toneId && TONES.some((item) => item.id === savedCart.toneId)) {
  state.tone = savedCart.toneId;
  state.tonePicked = true;
  state.qty = savedCart.qty;
  state.slide = 1;
  document.querySelector("#qty").value = state.qty;
  document.querySelector("#tone-hint").textContent = TONES.find((item) => item.id === state.tone).hint;
  document.querySelectorAll(".tone").forEach((el) => el.classList.toggle("active", el.dataset.tone === state.tone));
}

renderGallery();
renderReviews();
bindChrome();
syncCart();
