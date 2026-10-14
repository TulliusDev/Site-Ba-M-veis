const company = {
  whatsapp: "5531986969877",
  phoneDisplay: "+55 31 98696-9877",
  instagram: "https://www.instagram.com/baudosmoveis/"
};

const projects = [
  { title: "Cozinha planejada", category: "cozinhas", image: "imagens_servico/image 3.jpg", alt: "Cozinha planejada com armários de madeira e bancada escura" },
  { title: "Cozinha sob medida", category: "cozinhas", image: "imagens_servico/image2.jpg", alt: "Cozinha planejada com armários cinza e bancada escura" },
  { title: "Bancada para banheiro", category: "banheiros", image: "imagens_servico/image4.jpg", alt: "Gabinete sob medida com cuba de apoio para banheiro" },
  { title: "Armário planejado", category: "guarda-roupas", image: "imagens_servico/image6.jpg", alt: "Montador instalando portas de um armário planejado" },
  { title: "Closet sob medida", category: "guarda-roupas", image: "imagens_servico/image5.jpg", alt: "Closet planejado com nichos, gavetas e espaço para roupas" },
  { title: "Painel e sala de estar", category: "outros", image: "imagens_servico/unnamed.jpg", alt: "Sala de estar com painel de TV e móveis planejados" }
];

const projectGrid = document.querySelector("#project-grid");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
let visibleProjects = projects;
let activeProjectIndex = 0;
let lastFocusedElement = null;

function renderProjects(filter = "todos") {
  visibleProjects = filter === "todos" ? projects : projects.filter((project) => project.category === filter);
  projectGrid.replaceChildren();

  if (visibleProjects.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-projects";
    emptyMessage.textContent = "Novas fotografias desta categoria serão adicionadas em breve.";
    projectGrid.append(emptyMessage);
    return;
  }

  visibleProjects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-card";
    const button = document.createElement("button");
    button.className = "project-open";
    button.type = "button";
    button.setAttribute("aria-label", `Ampliar fotografia: ${project.title}`);
    button.addEventListener("click", () => openLightbox(index));

    const imageWrap = document.createElement("span");
    imageWrap.className = "project-image-wrap";
    const image = document.createElement("img");
    image.src = project.image;
    image.alt = project.alt;
    image.loading = "lazy";
    image.decoding = "async";
    const viewIcon = document.createElement("span");
    viewIcon.className = "project-view";
    viewIcon.setAttribute("aria-hidden", "true");
    viewIcon.textContent = "↗";
    imageWrap.append(image, viewIcon);
    button.append(imageWrap);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const title = document.createElement("h3");
    title.textContent = project.title;
    const category = document.createElement("span");
    category.textContent = {
      cozinhas: "Cozinhas",
      banheiros: "Banheiros",
      "guarda-roupas": "Guarda-roupas",
      comerciais: "Comerciais",
      outros: "Outros"
    }[project.category];
    meta.append(title, category);
    article.append(button, meta);
    projectGrid.append(article);
  });
}

function setLightboxProject(index) {
  activeProjectIndex = (index + visibleProjects.length) % visibleProjects.length;
  const project = visibleProjects[activeProjectIndex];
  lightboxImage.src = project.image;
  lightboxImage.alt = project.alt;
  lightboxCaption.textContent = project.title;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  setLightboxProject(index);
  lightbox.showModal();
  lightbox.querySelector(".lightbox-close").focus();
}

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    filterButtons.forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderProjects(filterButton.dataset.filter);
  });
});

document.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
document.querySelector(".lightbox-prev").addEventListener("click", () => setLightboxProject(activeProjectIndex - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => setLightboxProject(activeProjectIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => lastFocusedElement?.focus());
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setLightboxProject(activeProjectIndex - 1);
  if (event.key === "ArrowRight") setLightboxProject(activeProjectIndex + 1);
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  siteNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  siteNav.classList.toggle("is-open", !isOpen);
});
siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

document.querySelector("#quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector("#form-error");
  error.hidden = true;

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const message = [
    "Olá! Vim pelo site da Baú Móveis e gostaria de solicitar um orçamento.",
    "",
    `Nome: ${formData.get("name").toString().trim()}`,
    `Ambiente: ${formData.get("environment") || "Não informado"}`,
    `Localização: ${formData.get("location").toString().trim()}`,
    `Prazo desejado: ${formData.get("timeline") || "Não informado"}`,
    `Descrição: ${formData.get("description").toString().trim() || "Não informado"}`
  ].join("\n");

  const whatsappUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank");
  if (!whatsappWindow) {
    error.textContent = "Não foi possível abrir o WhatsApp. Verifique se o navegador bloqueou a nova janela e tente novamente.";
    error.hidden = false;
  } else {
    whatsappWindow.opener = null;
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#contact-phone").textContent = company.phoneDisplay;
document.querySelector("#instagram-link").href = company.instagram;
document.querySelector("#whatsapp-link").href = `https://wa.me/${company.whatsapp}`;

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

renderProjects();
