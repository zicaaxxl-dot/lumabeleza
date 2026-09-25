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

const COLORS = ["#c45c8a", "#7b5ea7", "#3d8b7a", "#bf5d30", "#3b6ea5", "#b08968", "#8a5a44"];
const state = { tone: TONES[0].id, qty: 1, slide: 0, shown: 6, tonePicked: false };

function slides() {
  const tone = TONES.find((item) => item.id === state.tone);
  if (!state.tonePicked) return GALLERY;
  return [GALLERY[0], tone.image, ...GALLERY.slice(1)];
}

function renderGallery() {
  const list = slides();
  const stage = document.querySelector("#stage-img");
  stage.src = list[state.slide];
  stage.alt = STORE.product;
  const thumbs = document.querySelector("#thumbs");
  thumbs.innerHTML = list.map((src, index) => `
    <button type="button" class="${index === state.slide ? "active" : ""}" data-slide="${index}">
      <img src="${src}" alt="Foto ${index + 1} do produto">
    </button>
  `).join("");
}

function renderReviews() {
  const box = document.querySelector("#review-list");
  box.innerHTML = REVIEWS.slice(0, state.shown).map((review) => `
    <article class="review">
      <div class="review-head">
        <div class="avatar" style="background:${COLORS[review.name.charCodeAt(0) % COLORS.length]}">${review.name[0]}</div>
        <div>
          <h3>${review.name} <span class="verified" title="Compra verificada">✓</span></h3>
          <div class="stars">${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}</div>
        </div>
      </div>
      <p>${review.text}</p>
      ${review.photo ? `<img class="review-photo" src="${review.photo}" alt="Foto enviada por ${review.name}">` : ""}
    </article>
  `).join("");
  document.querySelector("#more-reviews").style.display = state.shown >= REVIEWS.length ? "none" : "block";
}

function goCheckout() {
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
  document.querySelector("#open-cart").onclick = () => cart.classList.add("open");
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
      document.querySelector(".product").scrollIntoView();
      toast("Mostrando o kit da base");
      return;
    }
    toast("Nenhum outro produto encontrado");
  };
  document.querySelector("#wa").onclick = () => openWhatsApp();
  document.querySelectorAll(".acc").forEach((btn) => {
    btn.onclick = () => btn.nextElementSibling.classList.toggle("open");
  });
  document.querySelector("#news").onsubmit = (event) => {
    event.preventDefault();
    event.target.reset();
    toast("E-mail cadastrado");
  };
  document.querySelector("#review-form").onsubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    REVIEWS.unshift({
      name: data.get("name"),
      text: data.get("text"),
      stars: Number(data.get("stars")),
    });
    state.shown += 1;
    renderReviews();
    document.querySelector("#review-modal").classList.remove("open");
    event.target.reset();
    toast("Avaliação publicada");
  };
}

document.querySelector("#old-price").textContent = money(STORE.oldPrice);
document.querySelector("#price").textContent = money(STORE.price);
document.querySelector("#installments").textContent = `Em até 10x de ${money(STORE.price / 10)}`;
document.querySelector("#tones").innerHTML = TONES.map((tone) => `
  <button type="button" class="tone ${tone.id === state.tone ? "active" : ""}" data-tone="${tone.id}">${tone.label}</button>
`).join("");
document.querySelector("#extra-tones").innerHTML = TONES.map((tone) => `<li>${tone.label} — ${tone.hint}</li>`).join("");

document.querySelector("#tones").onclick = (event) => {
  const btn = event.target.closest("[data-tone]");
  if (!btn) return;
  state.tone = btn.dataset.tone;
  state.tonePicked = true;
  state.slide = 1;
  document.querySelectorAll(".tone").forEach((el) => el.classList.toggle("active", el.dataset.tone === state.tone));
  renderGallery();
};
document.querySelector("#thumbs").onclick = (event) => {
  const btn = event.target.closest("[data-slide]");
  if (!btn) return;
  state.slide = Number(btn.dataset.slide);
  renderGallery();
};
document.querySelector("#qty").value = state.qty;
document.querySelector("#minus").onclick = () => {
  state.qty = Math.max(1, state.qty - 1);
  document.querySelector("#qty").value = state.qty;
};
document.querySelector("#plus").onclick = () => {
  state.qty = Math.min(5, state.qty + 1);
  document.querySelector("#qty").value = state.qty;
};
document.querySelector("#qty").onchange = (event) => {
  state.qty = Math.min(5, Math.max(1, Number(event.target.value) || 1));
  event.target.value = state.qty;
};
document.querySelectorAll("[data-buy]").forEach((btn) => { btn.onclick = goCheckout; });
document.querySelector("#open-review").onclick = () => document.querySelector("#review-modal").classList.add("open");
document.querySelector("#more-reviews").onclick = () => {
  state.shown = REVIEWS.length;
  renderReviews();
};

renderGallery();
renderReviews();
bindChrome();
