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

// Grow Buddy: playful on-site assistant for Grow Advertising
(function () {
  if (document.querySelector('.grow-chat-launcher')) return;

  const whatsappNumber = '919921107234';
  const state = {
    service: '',
    business: '',
    lastIntent: ''
  };

  const services = [
    'Meta Ads & Lead Generation',
    'Social Media Management',
    'Graphic Designing',
    'Video / Reels & Shoot',
    'Branding & Packaging',
    'Website Development',
    'Google Business & SEO'
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function normalize(text) {
    return (text || '').toLowerCase().trim();
  }

  function hasAny(text, words) {
    return words.some(function (word) { return text.indexOf(word) !== -1; });
  }

  function serviceFromText(text) {
    const t = normalize(text);
    if (hasAny(t, ['meta', 'facebook ad', 'instagram ad', 'lead', 'ads', 'campaign'])) return 'Meta Ads & Lead Generation';
    if (hasAny(t, ['social media', 'instagram management', 'posting', 'content management'])) return 'Social Media Management';
    if (hasAny(t, ['graphic', 'post design', 'creative', 'poster'])) return 'Graphic Designing';
    if (hasAny(t, ['video', 'reel', 'shoot', 'motion', 'ai video'])) return 'Video / Reels & Shoot';
    if (hasAny(t, ['branding', 'logo', 'identity', 'packaging', 'package design'])) return 'Branding & Packaging';
    if (hasAny(t, ['website', 'web development', 'landing page', 'site'])) return 'Website Development';
    if (hasAny(t, ['seo', 'google business', 'gmb', 'search ranking'])) return 'Google Business & SEO';
    return '';
  }

  const launcher = el('button', 'grow-chat-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Grow Buddy assistant');
  launcher.innerHTML = '<span class="grow-chat-spark">✦</span><span class="grow-chat-launch-copy"><strong>Grow Buddy</strong><small>Ask me anything</small></span>';

  const panel = el('section', 'grow-chat-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Grow Advertising assistant');
  panel.setAttribute('aria-hidden', 'true');

  const head = el('div', 'grow-chat-head');
  head.innerHTML = '<div class="grow-chat-avatar">G</div><div><strong>Grow Buddy <span>AI Assistant</span></strong><small><i></i> Online • usually replies instantly</small></div>';
  const close = el('button', 'grow-chat-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close assistant');
  head.appendChild(close);

  const messages = el('div', 'grow-chat-messages');
  const quick = el('div', 'grow-chat-quick');
  const form = el('form', 'grow-chat-form');
  const input = el('input', 'grow-chat-input');
  input.type = 'text';
  input.placeholder = 'Type your question…';
  input.autocomplete = 'off';
  input.setAttribute('aria-label', 'Message Grow Buddy');
  const send = el('button', 'grow-chat-send', '➜');
  send.type = 'submit';
  send.setAttribute('aria-label', 'Send message');
  form.appendChild(input);
  form.appendChild(send);

  const footer = el('div', 'grow-chat-foot');
  footer.innerHTML = '<span>Powered by Grow Advertising</span><a href="https://wa.me/' + whatsappNumber + '" target="_blank" rel="noopener">WhatsApp human ↗</a>';

  panel.appendChild(head);
  panel.appendChild(messages);
  panel.appendChild(quick);
  panel.appendChild(form);
  panel.appendChild(footer);
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  function openChat() {
    panel.classList.add('open');
    launcher.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'false');
    window.setTimeout(function () { input.focus(); }, 180);
  }

  function closeChat() {
    panel.classList.remove('open');
    launcher.classList.remove('hidden');
    panel.setAttribute('aria-hidden', 'true');
  }

  function addMessage(text, who, html) {
    const row = el('div', 'grow-chat-row ' + who);
    const bubble = el('div', 'grow-chat-bubble');
    if (html) bubble.innerHTML = text;
    else bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function setQuickReplies(items) {
    quick.innerHTML = '';
    (items || []).forEach(function (item) {
      const btn = el('button', 'grow-chat-chip', item.label || item);
      btn.type = 'button';
      btn.dataset.message = item.message || item.label || item;
      quick.appendChild(btn);
    });
  }

  function whatsappLink(message) {
    return 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
  }

  function handoffMessage() {
    const parts = ['Hello Grow Advertising, I came from the website assistant.'];
    if (state.business) parts.push('Business: ' + state.business + '.');
    if (state.service) parts.push('Interested in: ' + state.service + '.');
    parts.push('Please guide me with the next step.');
    return parts.join(' ');
  }

  function answer(raw) {
    const text = normalize(raw);
    const detected = serviceFromText(text);
    if (detected) state.service = detected;

    if (hasAny(text, ['hi', 'hello', 'hey', 'hii', 'namaste'])) {
      state.lastIntent = 'greeting';
      return {
        text: 'Hey! 👋 I’m Grow Buddy. Tell me what you want to grow — leads, branding, social media, videos, website or visibility?',
        quick: ['Get more leads', 'Social media', 'Branding', 'Website']
      };
    }

    if (hasAny(text, ['price', 'pricing', 'cost', 'charges', 'package', 'packages', 'budget'])) {
      state.lastIntent = 'pricing';
      return {
        html: true,
        text: 'We have ready-made monthly packages plus custom plans based on your goals. <a href="services.html#packages">View packages →</a><br><br>If you tell me the service you need, I can point you to the right option.',
        quick: ['Meta Ads', 'Social Media', 'Branding', 'Talk on WhatsApp']
      };
    }

    if (hasAny(text, ['portfolio', 'work', 'projects', 'samples', 'designs', 'show me'])) {
      state.lastIntent = 'portfolio';
      return {
        html: true,
        text: 'Absolutely 😎 You can explore our logo, social media, packaging, reels, video and ads work here: <a href="portfolio.html">View Portfolio →</a>',
        quick: ['Logo work', 'Social posts', 'Packaging', 'Reels']
      };
    }

    if (hasAny(text, ['contact', 'call', 'phone', 'whatsapp', 'talk', 'human', 'team'])) {
      state.lastIntent = 'contact';
      return {
        html: true,
        text: 'Want a human? Easy. <a href="' + whatsappLink(handoffMessage()) + '" target="_blank" rel="noopener">Chat with our team on WhatsApp →</a><br><br>You can also call us at <a href="tel:+919921107234">+91 9921107234</a>.',
        quick: ['Book consultation', 'View services']
      };
    }

    if (hasAny(text, ['what do you do', 'services', 'service', 'help me', 'help'])) {
      state.lastIntent = 'services';
      return {
        text: 'We help with Meta Ads & lead generation, social media management, graphic design, reels/video shoots, branding & packaging, websites, Google Business and SEO. Pick one and I’ll guide you.',
        quick: ['Meta Ads', 'Social Media', 'Video / Reels', 'Website']
      };
    }

    if (state.service || detected) {
      state.lastIntent = 'service';
      const current = state.service || detected;
      let detail = '';
      if (current === 'Meta Ads & Lead Generation') detail = 'We plan targeting, creatives, campaign setup, testing and optimization to generate better enquiries and leads.';
      if (current === 'Social Media Management') detail = 'We can handle content planning, creatives, posting support and account consistency for your brand.';
      if (current === 'Graphic Designing') detail = 'We create social posts, ad creatives, promotional designs and marketing visuals aligned with your brand.';
      if (current === 'Video / Reels & Shoot') detail = 'We work on reels, product/showroom shoots, edits, motion graphics, typography and AI-led video formats.';
      if (current === 'Branding & Packaging') detail = 'We work on logos, brand identity systems and packaging that look distinctive and market-ready.';
      if (current === 'Website Development') detail = 'We build responsive business websites and landing pages designed to explain your offer clearly and drive enquiries.';
      if (current === 'Google Business & SEO') detail = 'We help improve local visibility through Google Business Profile support and search-focused website improvements.';
      return {
        text: detail + ' Want pricing, examples, or a quick WhatsApp consultation?',
        quick: ['Show pricing', 'Show portfolio', 'WhatsApp consultation']
      };
    }

    if (hasAny(text, ['restaurant', 'shop', 'store', 'clinic', 'salon', 'real estate', 'school', 'business', 'company', 'brand'])) {
      state.business = raw.trim().slice(0, 80);
      return {
        text: 'Nice — that gives me context. What result matters most right now: more leads, stronger branding, better social media, or a new website?',
        quick: ['More leads', 'Better social media', 'Branding', 'Website']
      };
    }

    return {
      text: 'I can help with services, packages, portfolio, leads, branding, social media, videos, websites and contact details. Try asking something like “I need more leads” or “show pricing”.',
      quick: ['I need more leads', 'Show pricing', 'View portfolio', 'Talk to team']
    };
  }

  function handleMessage(message) {
    if (!message || !message.trim()) return;
    addMessage(message.trim(), 'user');
    input.value = '';
    setQuickReplies([]);

    const typing = el('div', 'grow-chat-row bot');
    typing.innerHTML = '<div class="grow-chat-bubble grow-chat-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    window.setTimeout(function () {
      typing.remove();
      const response = answer(message);
      addMessage(response.text, 'bot', response.html);
      setQuickReplies((response.quick || []).map(function (label) {
        if (label === 'Talk on WhatsApp' || label === 'WhatsApp consultation' || label === 'Talk to team' || label === 'Book consultation') {
          return {label: label, message: label};
        }
        return label;
      }));
    }, 420);
  }

  launcher.addEventListener('click', openChat);
  close.addEventListener('click', closeChat);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    handleMessage(input.value);
  });

  quick.addEventListener('click', function (e) {
    const btn = e.target.closest('.grow-chat-chip');
    if (!btn) return;
    const message = btn.dataset.message || btn.textContent;
    if (/whatsapp|talk to team|book consultation/i.test(message)) {
      window.open(whatsappLink(handoffMessage()), '_blank', 'noopener');
      return;
    }
    handleMessage(message);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
  });

  addMessage('Hey! 👋 I’m Grow Buddy — your quick guide to Grow Advertising. What are you looking for today?', 'bot');
  setQuickReplies(['Get more leads', 'View services', 'Show pricing', 'See portfolio']);
})();
