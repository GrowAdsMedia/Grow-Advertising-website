const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Portfolio filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project[data-category]');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projects.forEach(project => {
      const show = filter === 'all' || project.dataset.category === filter;
      project.style.display = show ? '' : 'none';
    });
  });
});

// Static-site contact form -> WhatsApp
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const phone = data.get('phone') || '';
    const business = data.get('business') || '';
    const service = data.get('service') || '';
    const message = data.get('message') || '';

    const text = `Hello Grow Advertising,\n\nName: ${name}\nPhone: ${phone}\nBusiness: ${business}\nInterested in: ${service}\n\nRequirement: ${message}`;
    const url = `https://wa.me/919921107234?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

// Grow Advertising: service chooser popup + portfolio lightbox
(function () {
  const services = [
    ["Graphic Designing", "Posts, ads, social creatives & marketing design"],
    ["Meta Ads & Lead Generation", "Facebook & Instagram performance campaigns"],
    ["Social Media Management", "Planning, creatives, posting & page management"],
    ["Video / Reels & Shoot", "Showroom, product, reel and ad video production"],
    ["Branding & Packaging", "Brand identity, logo systems & product packaging"],
    ["Website Development", "Responsive websites & landing pages"],
    ["Google Business & SEO", "Local search visibility & Google Business support"]
  ];

  function pageName() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function closeModal(modal) {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function buildServicePopup() {
    if (pageName() === "contact.html") return;
    if (sessionStorage.getItem("growServicePopupDismissed") === "1") return;

    const overlay = document.createElement("div");
    overlay.className = "service-popup";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Choose services");

    const card = document.createElement("div");
    card.className = "service-popup-card";

    const head = document.createElement("div");
    head.className = "service-popup-head";
    head.innerHTML = '<div><span class="eyebrow">Quick requirement</span><h2>What can we help you with?</h2><p>Select one or more services. You can also skip this and continue browsing.</p></div>';

    const close = document.createElement("button");
    close.className = "modal-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    head.appendChild(close);

    const options = document.createElement("div");
    options.className = "service-options";

    services.forEach(function (item) {
      const label = document.createElement("label");
      label.className = "service-choice";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = item[0];

      const tick = document.createElement("span");
      tick.className = "service-tick";
      tick.textContent = "✓";

      const textWrap = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = item[0];
      const small = document.createElement("small");
      small.textContent = item[1];
      textWrap.appendChild(strong);
      textWrap.appendChild(small);

      label.appendChild(input);
      label.appendChild(tick);
      label.appendChild(textWrap);
      options.appendChild(label);
    });

    const actions = document.createElement("div");
    actions.className = "service-popup-actions";

    const note = document.createElement("span");
    note.className = "selection-note";
    note.textContent = "No service selected yet";

    const row = document.createElement("div");
    row.className = "action-row";

    const skip = document.createElement("button");
    skip.className = "btn-text";
    skip.type = "button";
    skip.textContent = "Not now";

    const cont = document.createElement("button");
    cont.className = "btn btn-primary";
    cont.type = "button";
    cont.disabled = true;
    cont.textContent = "Continue";

    row.appendChild(skip);
    row.appendChild(cont);
    actions.appendChild(note);
    actions.appendChild(row);

    card.appendChild(head);
    card.appendChild(options);
    card.appendChild(actions);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const checkboxes = Array.from(options.querySelectorAll('input[type="checkbox"]'));

    function selected() {
      return checkboxes.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
    }

    function refresh() {
      const picked = selected();
      cont.disabled = picked.length === 0;
      note.textContent = picked.length ? (picked.length + " service" + (picked.length > 1 ? "s" : "") + " selected") : "No service selected yet";
      return picked;
    }

    function dismiss() {
      closeModal(overlay);
      sessionStorage.setItem("growServicePopupDismissed", "1");
      window.setTimeout(function () { overlay.remove(); }, 220);
    }

    checkboxes.forEach(function (cb) { cb.addEventListener("change", refresh); });
    close.addEventListener("click", dismiss);
    skip.addEventListener("click", dismiss);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) dismiss(); });

    cont.addEventListener("click", function () {
      const picked = refresh();
      if (!picked.length) return;
      sessionStorage.setItem("growSelectedServices", JSON.stringify(picked));
      sessionStorage.setItem("growServicePopupDismissed", "1");
      window.location.href = "contact.html?services=" + encodeURIComponent(picked.join("|"));
    });

    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape" && document.body.contains(overlay)) {
        dismiss();
        document.removeEventListener("keydown", esc);
      }
    });

    window.setTimeout(function () {
      overlay.classList.add("open");
      document.body.classList.add("modal-open");
    }, 600);
  }

  function buildPortfolioLightbox() {
    const images = Array.from(document.querySelectorAll(".project img"));
    if (!images.length) return;

    const overlay = document.createElement("div");
    overlay.className = "image-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "lightbox-card";

    const close = document.createElement("button");
    close.className = "lightbox-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close preview");
    close.textContent = "×";

    const wrap = document.createElement("div");
    wrap.className = "lightbox-image-wrap";
    const preview = document.createElement("img");
    preview.alt = "";
    wrap.appendChild(preview);

    const caption = document.createElement("div");
    caption.className = "lightbox-caption";
    const title = document.createElement("strong");
    const hint = document.createElement("span");
    hint.textContent = "Click outside or press Esc to close";
    caption.appendChild(title);
    caption.appendChild(hint);

    card.appendChild(close);
    card.appendChild(wrap);
    card.appendChild(caption);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function hide() { closeModal(overlay); }

    images.forEach(function (img) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", (img.alt || "Portfolio image") + " — open full size");

      function show() {
        preview.src = img.currentSrc || img.src;
        preview.alt = img.alt || "Portfolio preview";
        const project = img.closest(".project");
        const heading = project ? project.querySelector("h3") : null;
        title.textContent = heading ? heading.textContent.trim() : (img.alt || "Grow Advertising portfolio");
        overlay.classList.add("open");
        document.body.classList.add("modal-open");
      }

      img.addEventListener("click", show);
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show();
        }
      });
    });

    close.addEventListener("click", hide);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) hide(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("open")) hide();
    });
  }

  function prefillContact() {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("services");
    let picked = [];

    if (fromUrl) {
      picked = fromUrl.split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    } else {
      try { picked = JSON.parse(sessionStorage.getItem("growSelectedServices") || "[]"); }
      catch (e) { picked = []; }
    }

    if (!picked.length) return;

    const select = form.querySelector("#service");
    const message = form.querySelector("#message");
    const values = Array.from(select.options).map(function (o) { return o.value || o.textContent; });

    if (picked.length === 1 && values.indexOf(picked[0]) !== -1) {
      select.value = picked[0];
    } else if (values.indexOf("Custom Package") !== -1) {
      select.value = "Custom Package";
    }

    if (message && !message.value) {
      message.value = "I am interested in: " + picked.join(", ") + ".";
    }
  }

  buildServicePopup();
  buildPortfolioLightbox();
  prefillContact();
})();