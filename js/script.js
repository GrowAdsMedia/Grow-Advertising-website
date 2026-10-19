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
    lastIntent: '',
    lastUserMessage: ''
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
    if (hasAny(t, ['meta', 'facebook ad', 'instagram ad', 'lead', 'leads', 'ads', 'campaign', 'customer chahiye', 'enquiry', 'inquiry'])) return 'Meta Ads & Lead Generation';
    if (hasAny(t, ['social media', 'instagram management', 'posting', 'content management', 'page manage', 'instagram handle'])) return 'Social Media Management';
    if (hasAny(t, ['graphic', 'post design', 'creative', 'poster', 'banner', 'social post'])) return 'Graphic Designing';
    if (hasAny(t, ['video', 'reel', 'reels', 'shoot', 'motion', 'ai video', 'editing', 'video edit'])) return 'Video / Reels & Shoot';
    if (hasAny(t, ['branding', 'logo', 'identity', 'packaging', 'package design', 'brand design'])) return 'Branding & Packaging';
    if (hasAny(t, ['website', 'web development', 'landing page', 'site', 'web banani', 'website banana'])) return 'Website Development';
    if (hasAny(t, ['seo', 'google business', 'gmb', 'search ranking', 'google map', 'google maps'])) return 'Google Business & SEO';
    return '';
  }

  const launcher = el('button', 'grow-chat-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Grow Buddy assistant');
  launcher.innerHTML = '<span class="grow-chat-spark">✦</span><span class="grow-chat-launch-copy"><strong>Grow Assistant</strong><small>Services • Pricing • Support</small></span>';

  const panel = el('section', 'grow-chat-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Grow Advertising assistant');
  panel.setAttribute('aria-hidden', 'true');

  const head = el('div', 'grow-chat-head');
  head.innerHTML = '<div class="grow-chat-avatar">G</div><div><strong>Grow Assistant <span>AI Assistant</span></strong><small><i></i> Online • instant website guidance</small></div>';
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
    if (state.lastUserMessage) parts.push('My question: ' + state.lastUserMessage + '.');
    parts.push('Please guide me with the right next step.');
    return parts.join(' ');
  }

  function answer(raw) {
    const text = normalize(raw);
    state.lastUserMessage = raw.trim().slice(0, 220);
    const detected = serviceFromText(text);
    if (detected) state.service = detected;

    if (hasAny(text, ['robot dance', 'dance robot', 'make robot dance', 'robot nacho', 'robot naacho'])) {
      if (window.GrowRobot) window.GrowRobot.do('dance');
      return { text: 'Dance mode on 💃🤖 Grow Bot is showing off a few moves, then he’ll return to normal.', quick: ['Robot spin', 'Robot greet', 'Service tip'] };
    }

    if (hasAny(text, ['robot spin', 'spin robot', 'make robot spin', 'robot ghoomo', 'robot ghumao'])) {
      if (window.GrowRobot) window.GrowRobot.do('spin');
      return { text: 'Spinning up 🌀 Grow Bot will do a quick spin and reset.', quick: ['Robot dance', 'Robot greet', 'Service tip'] };
    }

    if (hasAny(text, ['robot greet', 'greet visitor', 'greet me', 'say hello robot', 'robot hello', 'robot welcome'])) {
      if (window.GrowRobot) window.GrowRobot.do('greet');
      return { text: 'Greeting mode activated 👋 Grow Bot is welcoming the visitor.', quick: ['Robot dance', 'Robot spin', 'Service tip'] };
    }

    if (hasAny(text, ['service tip', 'robot tip', 'show service tip', 'marketing tip', 'give me a tip'])) {
      if (window.GrowRobot) window.GrowRobot.do('tip');
      return { text: 'Tip incoming 💡 Grow Bot is sharing a quick Grow Advertising service tip.', quick: ['Robot dance', 'Robot greet', 'Robot run'] };
    }

    if (hasAny(text, ['robot run', 'run robot', 'run around', 'bhago robot', 'robot bhago'])) {
      if (window.GrowRobot) window.GrowRobot.do('run');
      return { text: 'Done 😄 Our little Grow Bot is running around the screen.', quick: ['Robot laugh', 'Robot play', 'Robot cry'] };
    }

    if (hasAny(text, ['robot laugh', 'laugh robot', 'robot haso', 'robot hanso', 'make robot laugh'])) {
      if (window.GrowRobot) window.GrowRobot.do('laugh');
      return { text: 'Haha 😄 Grow Bot is laughing now.', quick: ['Robot play', 'Robot run', 'Kick robot'] };
    }

    if (hasAny(text, ['robot cry', 'cry robot', 'robot ro', 'make robot cry'])) {
      if (window.GrowRobot) window.GrowRobot.do('cry');
      return { text: 'Aww 😢 Grow Bot is crying for a moment. He’ll be fine again in a few seconds.', quick: ['Robot laugh', 'Robot play', 'Robot run'] };
    }

    if (hasAny(text, ['robot play', 'play robot', 'make robot play', 'robot khelo'])) {
      if (window.GrowRobot) window.GrowRobot.do('play');
      return { text: 'Play mode on 🎮 Grow Bot is bouncing around.', quick: ['Robot run', 'Robot laugh', 'Kick robot'] };
    }

    if (hasAny(text, ['kick robot', 'robot kick', 'kick him', 'kick bot'])) {
      if (window.GrowRobot) window.GrowRobot.do('kick');
      return { text: 'Oops 😅 You kicked Grow Bot — he’ll cry for a second, then recover and go back to normal.', quick: ['Robot laugh', 'Robot play', 'Robot run'] };
    }

    if (hasAny(text, ['hi', 'hello', 'hey', 'hii', 'namaste', 'good morning', 'good evening'])) {
      state.lastIntent = 'greeting';
      return {
        text: 'Hello 👋 Welcome to Grow Advertising. I can help you choose the right service, check packages, view relevant work, or connect you with our team. What would you like help with?',
        quick: ['Get more leads', 'View services', 'Show pricing', 'See portfolio']
      };
    }

    if (hasAny(text, ['price', 'pricing', 'cost', 'charges', 'charge', 'package', 'packages', 'budget', 'kitna', 'rate'])) {
      state.lastIntent = 'pricing';
      return {
        html: true,
        text: 'Our pricing depends on the service scope and campaign requirements. You can review our current packages here: <a href="services.html#packages">View Packages →</a><br><br>If you tell me which service you need, I can guide you to the most relevant option.',
        quick: ['Meta Ads', 'Social Media', 'Branding', 'WhatsApp consultation']
      };
    }

    if (hasAny(text, ['portfolio', 'work', 'projects', 'samples', 'designs', 'show me', 'example', 'examples', 'kaam dikhao'])) {
      state.lastIntent = 'portfolio';
      return {
        html: true,
        text: 'Certainly. Our portfolio includes brand identity, social media creatives, packaging, reels, video work and advertising projects. <a href="portfolio.html">View Our Portfolio →</a>',
        quick: ['Logo work', 'Social posts', 'Packaging', 'Reels']
      };
    }

    if (hasAny(text, ['contact', 'call', 'phone', 'whatsapp', 'talk', 'human', 'team se baat', 'person se baat', 'consultation'])) {
      state.lastIntent = 'contact';
      return {
        html: true,
        text: 'Of course. You can speak directly with the Grow Advertising team on WhatsApp for personalised guidance. <a href="' + whatsappLink(handoffMessage()) + '" target="_blank" rel="noopener">Start WhatsApp Chat →</a><br><br>Call: <a href="tel:+919921107234">+91 9921107234</a>',
        quick: ['View services', 'Show pricing']
      };
    }

    if (hasAny(text, ['what do you do', 'services', 'service', 'help me', 'help', 'kya karte', 'kya service'])) {
      state.lastIntent = 'services';
      return {
        text: 'Grow Advertising provides Meta Ads & lead generation, social media management, graphic design, reels and video production, branding & packaging, website development, Google Business support and SEO. Select an area and I’ll guide you further.',
        quick: ['Meta Ads', 'Social Media', 'Video / Reels', 'Website']
      };
    }

    if (hasAny(text, ['time', 'days', 'delivery', 'deliver', 'kitne din', 'turnaround'])) {
      state.lastIntent = 'timeline';
      return {
        text: 'Delivery time depends on the service and scope. Design tasks can often move quickly, while branding, websites, shoots and campaign work require a defined timeline. For an exact commitment, I’ll connect you with the team on WhatsApp.',
        quick: ['WhatsApp consultation', 'View services']
      };
    }

    if (state.service || detected) {
      state.lastIntent = 'service';
      const current = state.service || detected;
      let detail = '';
      if (current === 'Meta Ads & Lead Generation') detail = 'For Meta Ads, we focus on campaign strategy, audience targeting, ad creatives, testing and ongoing optimisation to generate quality enquiries and leads.';
      if (current === 'Social Media Management') detail = 'For social media management, we support content planning, creative production, posting and consistent brand communication across your pages.';
      if (current === 'Graphic Designing') detail = 'Our graphic design service covers social media posts, ad creatives, promotional designs and branded marketing communication.';
      if (current === 'Video / Reels & Shoot') detail = 'Our video service includes reels, product and showroom shoots, editing, motion graphics, typography and selected AI-assisted formats.';
      if (current === 'Branding & Packaging') detail = 'Our branding service covers logos, visual identity systems and packaging designed to make your brand more distinctive and market-ready.';
      if (current === 'Website Development') detail = 'We build responsive business websites and landing pages focused on clear communication, credibility and lead generation.';
      if (current === 'Google Business & SEO') detail = 'We support local visibility through Google Business Profile optimisation and search-focused website improvements.';
      return {
        text: detail + ' Would you like to see pricing, relevant work, or speak with our team?',
        quick: ['Show pricing', 'Show portfolio', 'WhatsApp consultation']
      };
    }

    if (hasAny(text, ['restaurant', 'shop', 'store', 'clinic', 'salon', 'real estate', 'school', 'business', 'company', 'brand', 'startup'])) {
      state.business = raw.trim().slice(0, 80);
      return {
        text: 'Thank you — that gives me useful context. What is your main priority right now: more leads, stronger branding, better social media, video content, or a new website?',
        quick: ['More leads', 'Better social media', 'Branding', 'Website']
      };
    }

    state.lastIntent = 'handoff';
    const handoffUrl = whatsappLink(handoffMessage());
    return {
      html: true,
      redirect: true,
      text: 'Sorry — I couldn’t clearly understand your request, and I don’t want to give you the wrong information.<br><br>I’m taking you to our Grow Advertising team on WhatsApp for personalised help. <strong>Your message will be included automatically</strong>, so you won’t need to type it again.<br><br><a href="' + handoffUrl + '">Continue on WhatsApp →</a>'
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
      if (response.redirect) {
        setQuickReplies([]);
        window.setTimeout(function () {
          window.location.href = whatsappLink(handoffMessage());
        }, 1600);
        return;
      }
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

  addMessage('Hello 👋 Welcome to Grow Advertising. I’m your website assistant for services, pricing, portfolio and quick support. How may I help you today?', 'bot');
  setQuickReplies(['Get more leads', 'View services', 'Show pricing', 'See portfolio']);
})();


// Tiny floating Grow Bot mascot
(function () {
  if (document.querySelector('.grow-bot')) return;

  const bot = document.createElement('div');
  bot.className = 'grow-bot';
  bot.setAttribute('role', 'group');
  bot.setAttribute('aria-label', 'Interactive Grow Bot');

  bot.innerHTML =
    '<div class="grow-bot-speech" aria-live="polite">Hi! Tap me 👋</div>' +
    '<button class="grow-bot-body" type="button" aria-label="Open Grow Bot controls">' +
      '<span class="grow-bot-antenna"><i></i></span>' +
      '<span class="grow-bot-head">' +
        '<span class="grow-bot-eye left"></span>' +
        '<span class="grow-bot-eye right"></span>' +
        '<span class="grow-bot-mouth"></span>' +
        '<span class="grow-bot-tear left"></span>' +
        '<span class="grow-bot-tear right"></span>' +
      '</span>' +
      '<span class="grow-bot-torso"><b>G</b></span>' +
      '<span class="grow-bot-arm left"></span>' +
      '<span class="grow-bot-arm right"></span>' +
      '<span class="grow-bot-leg left"></span>' +
      '<span class="grow-bot-leg right"></span>' +
    '</button>' +
    '<div class="grow-bot-actions" aria-label="Grow Bot actions">' +
      '<button type="button" data-bot-action="play">🎮 Play</button>' +
      '<button type="button" data-bot-action="run">🏃 Run</button>' +
      '<button type="button" data-bot-action="laugh">😄 Laugh</button>' +
      '<button type="button" data-bot-action="cry">😢 Cry</button>' +
      '<button type="button" data-bot-action="kick">🦶 Kick</button>' +
      '<button type="button" data-bot-action="dance">💃 Dance</button>' +
      '<button type="button" data-bot-action="spin">🌀 Spin</button>' +
      '<button type="button" data-bot-action="greet">👋 Greet</button>' +
      '<button type="button" data-bot-action="tip">💡 Tip</button>' +
    '</div>';

  document.body.appendChild(bot);

  const body = bot.querySelector('.grow-bot-body');
  const speech = bot.querySelector('.grow-bot-speech');
  const actions = bot.querySelector('.grow-bot-actions');
  let stateTimer = null;
  let runTimer = null;
  let idleTimer = null;
  let idleMoodTimer = null;
  let drag = null;
  let moved = false;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clearBotState() {
    ['is-running','is-laughing','is-crying','is-playing','is-kicked','is-dancing','is-spinning','is-greeting','is-tip','is-waving','is-looking-left','is-looking-right','is-blinking','is-idle-mood'].forEach(function (name) {
      bot.classList.remove(name);
    });
    window.clearTimeout(stateTimer);
    window.clearInterval(runTimer);
    stateTimer = null;
    runTimer = null;
  }

  function stopIdleCycle() {
    window.clearTimeout(idleTimer);
    window.clearTimeout(idleMoodTimer);
    idleTimer = null;
    idleMoodTimer = null;
  }

  function isBusy() {
    return !!drag ||
      actions.classList.contains('open') ||
      bot.classList.contains('is-running') ||
      bot.classList.contains('is-playing') ||
      bot.classList.contains('is-kicked') ||
      bot.classList.contains('is-crying') ||
      bot.classList.contains('is-dancing') ||
      bot.classList.contains('is-spinning') ||
      bot.classList.contains('is-greeting') ||
      bot.classList.contains('is-tip');
  }

  function finishIdleMood() {
    ['is-waving','is-looking-left','is-looking-right','is-laughing','is-blinking','is-idle-mood'].forEach(function (name) {
      bot.classList.remove(name);
    });
    scheduleIdle();
  }

  function playIdleMood() {
    if (reducedMotion || document.hidden || isBusy()) {
      scheduleIdle();
      return;
    }

    const moods = ['wave','look-left','look-right','laugh','blink'];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    bot.classList.add('is-idle-mood');

    if (mood === 'wave') {
      bot.classList.add('is-waving');
      if (Math.random() > 0.55) say('Hey there 👋', 1300);
    } else if (mood === 'look-left') {
      bot.classList.add('is-looking-left');
    } else if (mood === 'look-right') {
      bot.classList.add('is-looking-right');
    } else if (mood === 'laugh') {
      bot.classList.add('is-laughing');
      if (Math.random() > 0.6) say('Hehe 😄', 1200);
    } else {
      bot.classList.add('is-blinking');
    }

    idleMoodTimer = window.setTimeout(finishIdleMood, mood === 'laugh' ? 1500 : 1250);
  }

  function scheduleIdle() {
    window.clearTimeout(idleTimer);
    if (reducedMotion) return;
    const wait = 6500 + Math.random() * 6500;
    idleTimer = window.setTimeout(playIdleMood, wait);
  }

  function say(message, ms) {
    speech.textContent = message;
    bot.classList.add('show-speech');
    window.clearTimeout(speech._timer);
    speech._timer = window.setTimeout(function () {
      bot.classList.remove('show-speech');
    }, ms || 2200);
  }

  function keepOnScreen(x, y) {
    const maxX = Math.max(8, window.innerWidth - bot.offsetWidth - 8);
    const maxY = Math.max(86, window.innerHeight - bot.offsetHeight - 8);
    return {
      x: Math.min(maxX, Math.max(8, x)),
      y: Math.min(maxY, Math.max(86, y))
    };
  }

  function moveTo(x, y, animate) {
    const p = keepOnScreen(x, y);
    bot.style.left = p.x + 'px';
    bot.style.top = p.y + 'px';
    bot.style.right = 'auto';
    bot.style.bottom = 'auto';
    bot.classList.toggle('bot-moving', !!animate);
  }

  function randomSpot() {
    const x = 12 + Math.random() * Math.max(20, window.innerWidth - bot.offsetWidth - 24);
    const y = 92 + Math.random() * Math.max(20, window.innerHeight - bot.offsetHeight - 110);
    return keepOnScreen(x, y);
  }

  function doAction(action) {
    stopIdleCycle();
    clearBotState();
    actions.classList.remove('open');

    if (action === 'dance') {
      bot.classList.add('is-dancing');
      say('Dance break! 💃🤖', 2200);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('Back to business 😎', 1500);
        scheduleIdle();
      }, 2600);
      return;
    }

    if (action === 'spin') {
      bot.classList.add('is-spinning');
      say('Wheee! 🌀', 1700);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('Stable again 😄', 1400);
        scheduleIdle();
      }, 1900);
      return;
    }

    if (action === 'greet') {
      bot.classList.add('is-greeting', 'is-waving');
      say('Welcome to Grow Advertising! 👋 How can we help your brand grow?', 3200);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        scheduleIdle();
      }, 3400);
      return;
    }

    if (action === 'tip') {
      const tips = [
        'Meta Ads tip: strong creative + clear offer usually improves lead quality.',
        'Branding tip: keep your logo, colours and visual style consistent everywhere.',
        'Social tip: short hooks and clear value help people stop scrolling.',
        'Website tip: one clear CTA on every key section makes enquiries easier.',
        'Local SEO tip: keep your Google Business profile complete and regularly updated.',
        'Reels tip: show the product or result early instead of waiting for the end.'
      ];
      bot.classList.add('is-tip', 'is-waving');
      say('💡 ' + tips[Math.floor(Math.random() * tips.length)], 4300);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('Tip delivered ✅', 1300);
        scheduleIdle();
      }, 4500);
      return;
    }

    if (action === 'kick') {
      bot.classList.add('is-kicked', 'is-crying');
      say('Ouch! 😭 I’m okay…', 2300);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('All good again 😌', 1800);
        scheduleIdle();
      }, 2400);
      return;
    }

    if (action === 'cry') {
      bot.classList.add('is-crying');
      say('Why me? 😭', 2400);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('I feel better now 🙂', 1600);
        scheduleIdle();
      }, 2800);
      return;
    }

    if (action === 'laugh') {
      bot.classList.add('is-laughing');
      say('Hahaha! 😂', 2000);
      stateTimer = window.setTimeout(function () {
        clearBotState();
        say('Back to work 😎', 1500);
        scheduleIdle();
      }, 2200);
      return;
    }

    if (action === 'play') {
      bot.classList.add('is-playing');
      say('Play time! 🎮✨', 2200);
      let hops = 0;
      runTimer = window.setInterval(function () {
        const p = randomSpot();
        moveTo(p.x, p.y, true);
        hops += 1;
        if (hops >= 5) {
          clearBotState();
          say('That was fun! 😄', 1700);
          scheduleIdle();
        }
      }, 650);
      return;
    }

    if (action === 'run') {
      bot.classList.add('is-running');
      say('Catch me if you can! 🏃💨', 2200);
      let steps = 0;
      runTimer = window.setInterval(function () {
        const p = randomSpot();
        moveTo(p.x, p.y, true);
        steps += 1;
        if (steps >= 7) {
          clearBotState();
          say('Phew! I’m back 😅', 1700);
          scheduleIdle();
        }
      }, 520);
      return;
    }
  }

  window.GrowRobot = {
    do: doAction,
    say: say
  };

  body.addEventListener('click', function () {
    if (moved) {
      moved = false;
      scheduleIdle();
      return;
    }
    stopIdleCycle();
    clearBotState();
    actions.classList.toggle('open');
    say(actions.classList.contains('open') ? 'Choose my task 🤖' : 'Ready when you are!', 1600);
    if (!actions.classList.contains('open')) scheduleIdle();
  });

  actions.addEventListener('click', function (event) {
    const btn = event.target.closest('[data-bot-action]');
    if (!btn) return;
    doAction(btn.dataset.botAction);
  });

  function dragStart(event) {
    if (event.button !== undefined && event.button !== 0) return;
    stopIdleCycle();
    clearBotState();
    moved = false;
    const rect = bot.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    drag = {
      dx: point.clientX - rect.left,
      dy: point.clientY - rect.top,
      sx: point.clientX,
      sy: point.clientY
    };
    bot.classList.add('is-dragging');
    actions.classList.remove('open');
  }

  function dragMove(event) {
    if (!drag) return;
    const point = event.touches ? event.touches[0] : event;
    if (Math.abs(point.clientX - drag.sx) > 5 || Math.abs(point.clientY - drag.sy) > 5) moved = true;
    moveTo(point.clientX - drag.dx, point.clientY - drag.dy, false);
    if (event.cancelable) event.preventDefault();
  }

  function dragEnd() {
    if (!drag) return;
    drag = null;
    bot.classList.remove('is-dragging');
    if (moved) say('Nice parking spot 😎', 1300);
    scheduleIdle();
  }

  body.addEventListener('mousedown', dragStart);
  body.addEventListener('touchstart', dragStart, { passive: true });
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: false });
  window.addEventListener('mouseup', dragEnd);
  window.addEventListener('touchend', dragEnd);

  body.addEventListener('dblclick', function () {
    doAction('kick');
  });

  window.addEventListener('resize', function () {
    const rect = bot.getBoundingClientRect();
    moveTo(rect.left, rect.top, false);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopIdleCycle();
      finishIdleMood();
    } else {
      scheduleIdle();
    }
  });

  window.setTimeout(function () {
    say('Hi! I’m Grow Bot 🤖 Drag me, tap me, or give me a task in chat.', 4200);
    scheduleIdle();
  }, 1300);
})();
