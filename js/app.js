const PAGES = ["home", "about", "services", "leadership", "careers", "contacts"];
let L_CODE = (() => {
  try { return localStorage.getItem("prorail_lang"); } catch (e) { return null; }
})() || "ru";
if (!T[L_CODE]) L_CODE = "ru";

const OFFICE_Q = encodeURIComponent("Астана, улица Туркестан 34Б");
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subHeader = (titleHtml, imgFile) => `
  <div class="sub bg-scene animated-train">
    <div class="bg-media" data-img="${imgFile}"></div>
    <div class="wrap">
      <span class="tag">ProRail Solutions</span>
      <h2>${titleHtml}</h2>
    </div>
  </div>
`;

const statsBar = (t) => `
  <div class="gn">
    <div class="wrap stats">
      ${["2016", "6", "5"].map((val, i) => `
        <div class="rv">
          <b data-n="${val}">${val}</b>
          <span>${t.st[i]}</span>
        </div>
      `).join("")}
    </div>
  </div>
`;

const ctaSection = (t) => `
  <section class="bg-scene train-strip cta-compact">
    <div class="bg-media" data-img="kash.jpg"></div>
    <div class="wrap rv cta-row">
      <h2>${t.ctat}</h2>
      <a class="btn" href="#/contacts">${t.cta}</a>
    </div>
  </section>
`;

const cardsGrid = (items) => `
  <div class="adv4 rv">
    ${items.map((item, i) => `
      <div>
        <span>0${i + 1}</span>
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
      </div>
    `).join("")}
  </div>
`;

const contactForm = (type, isResume = false) => {
  const f = T[L_CODE].f;
  return `
    <form data-k="${type}" novalidate>
      <input name="n" placeholder="${f.name}" autocomplete="name" required>
      <input name="p" placeholder="${f.phone}" type="tel" autocomplete="tel">
      <input name="e" placeholder="${f.email}" type="email" autocomplete="email">
      <textarea name="m" rows="4" placeholder="${f.msg}"></textarea>
      <div class="err"></div>
      <button type="submit" class="btn">${isResume ? f.resume : f.send}</button>
    </form>
  `;
};

const servicePanel = (srv, idx, imgFile) => `
  <div class="svc rv">
    <div class="svc-img bg-scene animated-train">
      <div class="bg-media" data-img="${imgFile}"></div>
    </div>
    <div class="tx">
      <h3>${srv[0]}</h3>
      <ul>${srv[1].map(li => `<li>${li}</li>`).join("")}</ul>
      <a class="btn" href="#/contacts?s=${idx}">${T[L_CODE].quote}</a>
    </div>
  </div>
`;

function renderView(page) {
  const t = T[L_CODE];

  if (page === "home") {
    return `
      <section class="hero bg-scene animated-train">
        <div class="bg-media" data-img="hero.jpg"></div>
        <div class="wrap">
          <span class="tag">ProRail Solutions · Astana</span>
          <h1>${t.h1}</h1>
          <p>${t.hs}</p>
          <div class="hero-btns">
            <a class="btn" href="#/contacts">${t.cta}</a>
            <a class="btn o" href="#/services">${t.services}</a>
          </div>
        </div>
      </section>

      ${statsBar(t)}

      <div class="mq" aria-hidden="true">
        <div class="mq-track">${t.geo.concat(t.geo, t.geo).map(g => `<span>${g}</span>`).join("")}</div>
      </div>

      <section class="feat bg-scene light-right animated-train">
        <div class="bg-media" data-img="loco.jpg"></div>
        <div class="wrap">
          <div class="card rv">
            <span class="tag" style="color:var(--br)">ProRail Solutions</span>
            <h2>${t.abt}</h2>
            <p>${t.abp[0]}</p>
            <p style="margin-top:14px">${t.abp[1]}</p>
            <a class="btn" href="#/about" style="margin-top:26px">${t.more}</a>
          </div>
        </div>
      </section>

      <section class="bg-scene train-strip" style="padding: 64px 0;">
        <div class="bg-media" data-img="cont.jpg"></div>
        <div class="wrap">
          <div class="tiles" style="gap: 28px;">
            ${t.srv.map(s => `
              <div class="tile" style="min-height: 340px; background: rgba(2, 28, 20, 0.74); border: 1px solid rgba(226, 184, 119, 0.42);">
                <div class="tile-inner rv">
                  <h3>${s[0]}</h3>
                  <ul>${s[1].slice(0, 3).map(li => `<li>${li}</li>`).join("")}</ul>
                  <a class="btn" href="#/services">${t.more}</a>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>

      <section class="gn">
        <div class="wrap rv">
          <div class="geo-head">
            <div>
              <h2>${t.gt}</h2>
              <p class="geo-sub">${t.gp}</p>
            </div>
          </div>
          <div class="map-shell">
            <div id="rail-map"></div>
          </div>
          <div class="geol">
            ${t.geo.map((label, idx) => `<button type="button" data-route="${ROUTES_DATA[idx].id}">${label}</button>`).join("")}
          </div>
        </div>
      </section>

      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="steppe.jpg"></div>
        <div class="wrap">
          <h2 class="rv">${t.at}</h2>
          ${cardsGrid(t.adv)}
        </div>
      </section>

      ${ctaSection(t)}
    `;
  }

  if (page === "about") {
    return `
      ${subHeader(t.abt, "kash.jpg")}
      ${statsBar(t)}
      <section class="wmk">
        <div class="wrap split">
          <div class="rv">
            <p>${t.abp[0]}</p><br>
            <p>${t.abp[1]}</p><br>
            <div class="ph light">${t.mis}</div>
          </div>
          <div class="frame bg-scene animated-train rv">
            <div class="bg-media" data-img="loco.jpg"></div>
          </div>
        </div>
      </section>
      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="steppe.jpg"></div>
        <div class="wrap">
          <h2 class="rv">${t.valt}</h2>
          ${cardsGrid(t.vals)}
        </div>
      </section>
      ${ctaSection(t)}
    `;
  }

  if (page === "services") {
    return `
      ${subHeader(t.srt, "kash.jpg")}
      ${t.srv.map((s, i) => servicePanel(s, i, ["cont.jpg", "steppe.jpg"][i])).join("")}
      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="track.jpg"></div>
        <div class="wrap rv">
          <h2>${t.fl}</h2>
          <div class="chips">${t.fleet.map(item => `<span>${item}</span>`).join("")}</div>
        </div>
      </section>
      ${ctaSection(t)}
    `;
  }

  if (page === "leadership") {
    const leaderImgs = ["track.jpg", "cont.jpg", "steppe.jpg"];
    return `
      ${subHeader(t.ldt, "kash.jpg")}
      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="hero.jpg"></div>
        <div class="wrap">
          <p class="rv" style="max-width:660px;margin-bottom:36px">${t.ldp}</p>
          <div class="leader-grid-soft">
            ${[0, 1, 2].map(idx => `
              <div class="leader-card-anim rv">
                <div class="card-bg" data-img="${leaderImgs[idx]}"></div>
                <div class="leader-card-content">
                  <div class="leader-avatar-ring"></div>
                  <div class="leader-name">${t.nm}</div>
                  <div class="leader-role">${t.role}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      ${ctaSection(t)}
    `;
  }

  if (page === "careers") {
    return `
      ${subHeader(t.cat, "steppe.jpg")}
      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="steppe.jpg"></div>
        <div class="wrap split">
          <div class="box rv">
            <p style="margin-bottom:24px">${t.cap}</p>
            ${contactForm("cv", true)}
          </div>
          <div class="frame careers-frame bg-scene animated-train rv">
            <div class="bg-media" data-img="hero.jpg"></div>
          </div>
        </div>
      </section>
    `;
  }

  if (page === "contacts") {
    return `
      ${subHeader(t.cot, "loco.jpg")}
      <section class="bg-scene dark-overlay animated-train">
        <div class="bg-media" data-img="loco.jpg"></div>
        <div class="wrap split">
          <div class="box rv">
            <p>
              <b class="m">${t.addr_t}</b><br>
              010000, г. Астана, район Есиль, ул. Түркістан, 34Б, н.п. 3<br><br>
              <a href="tel:+77017472444">+7 701 747 24 44</a><br>
              <a href="tel:+77775337633">+7 777 533-76-33</a> · <a href="https://wa.me/77775337633" target="_blank" rel="noopener">WhatsApp</a><br>
              <a href="mailto:sales@prsolutions.kz">sales@prsolutions.kz</a>
            </p><br>
            ${contactForm("c", false)}
          </div>
          <div class="office-map-wrap">
            <iframe title="Карта" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${OFFICE_Q}&hl=${L_CODE === "kk" ? "kk" : L_CODE}&z=16&output=embed"></iframe>
            <div class="map-links">
              <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${OFFICE_Q}">Google Maps</a>
              <a class="btn o" target="_blank" rel="noopener" href="https://2gis.kz/astana/search/${OFFICE_Q}">2GIS</a>
              <a class="btn o" target="_blank" rel="noopener" href="https://yandex.kz/maps/?text=${OFFICE_Q}">Яндекс Карты</a>
            </div>
          </div>
          </div>
        </div>
      </section>
    `;
  }
}

function updateNav() {
  const t = T[L_CODE];
  const cur = (location.hash.slice(2) || "home").split("?")[0];
  document.getElementById("nav").innerHTML = PAGES.map((p, i) =>
    `<a href="#/${p}" class="${p === cur ? "on" : ""}" style="--i:${i}"><em>0${i + 1}</em>${t[p]}</a>`
  ).join("") + `<div class="nav-foot"><a href="tel:+77017472444">+7 701 747 24 44</a><a href="https://wa.me/77775337633" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:sales@prsolutions.kz">sales@prsolutions.kz</a></div>`;
  document.getElementById("lang").innerHTML = ["kk", "ru", "en"].map(code =>
    `<button type="button" class="${code === L_CODE ? "on" : ""}" data-l="${code}">${code.toUpperCase()}</button>`
  ).join("");
}

function animateCounter(el) {
  const target = Number(el.dataset.n);
  if (REDUCED_MOTION || target > 1000) return;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    el.textContent = Math.round(target * step / 28);
    if (step >= 28) clearInterval(timer);
  }, 28);
}

function renderApp() {
  destroyRailMap();
  const rawHash = location.hash.slice(2) || "home";
  const pageKey = rawHash.split("?")[0];
  const page = PAGES.includes(pageKey) ? pageKey : "home";

  document.documentElement.lang = L_CODE;
  document.title = `ProRail Solutions · ${T[L_CODE][page]}`;
  document.getElementById("app").innerHTML = `<div class="pg">${renderView(page)}</div>`;

  updateNav();
  document.querySelectorAll("[data-i]").forEach(el => {
    if (T[L_CODE][el.dataset.i]) el.textContent = T[L_CODE][el.dataset.i];
  });
  document.getElementById("yr").textContent = new Date().getFullYear();
  document.getElementById("nav").classList.remove("open");document.getElementById("bg").classList.remove("open");document.body.classList.remove("menu-open");
  window.scrollTo(0, 0);

  if (page === "home") {
    initRailMap(L_CODE);
  }
  if (page === "contacts") {
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("v");
        entry.target.querySelectorAll("[data-n]").forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  initScenes();
  document.querySelectorAll(".rv").forEach(el => revealObserver.observe(el));

  const bgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".bg-scene").forEach(el => bgObserver.observe(el));

  if (rawHash.includes("?s=")) {
    const idx = Number(rawHash.split("=")[1]);
    const textarea = document.querySelector("textarea[name=m]");
    if (textarea && T[L_CODE].srv[idx]) {
      textarea.value = `${T[L_CODE].srv[idx][0]}: ${T[L_CODE].quote}`;
    }
  }
}

window.addEventListener("hashchange", renderApp);

document.addEventListener("click", e => {
  const langBtn = e.target.closest("[data-l]");
  if (langBtn) {
    L_CODE = langBtn.dataset.l;
    try { localStorage.setItem("prorail_lang", L_CODE); } catch (err) {}
    renderApp();
  }
});

document.getElementById("bg").addEventListener("click", () => {
  const o = document.getElementById("nav").classList.toggle("open");
  document.getElementById("bg").classList.toggle("open", o);
  document.body.classList.toggle("menu-open", o);
});

document.addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const fText = T[L_CODE].f;
  const errEl = form.querySelector(".err");

  if (!fd.get("n").trim() || !(fd.get("p").trim() || fd.get("e").trim())) {
    errEl.textContent = fText.req;
    return;
  }

  errEl.textContent = fText.ok;
  const subject = form.dataset.k === "cv" ? "Резюме с сайта ProRail" : "Заявка на перевозку с сайта ProRail";
  const body = `Имя: ${fd.get("n")}
Телефон: ${fd.get("p")}
Email: ${fd.get("e")}

${fd.get("m")}`;
  window.location.href = `mailto:sales@prsolutions.kz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});


// Анимированные сцены: двигаются сами объекты на картинке (transform/opacity, на GPU)
const px = (l, t, w, h) => `left:${l}%;top:${t}%;width:${w}%;height:${h}%`;
const stars = () => Array.from({ length: 22 }, (_, i) =>
  `<i class="star" style="left:${(i * 37 + 11) % 97}%;top:${(i * 53 + 7) % 34}%;animation-delay:${(i % 7) * .45}s"></i>`).join("");
const mist = (t, d = 0) => `<i class="mist" style="top:${t}%;animation-delay:-${d}s"></i>`;
const SCENES = {
  "hero.jpg": () => svScene2(),
  "track.jpg": () => `
    <div class="z" style="transform-origin:49% 36%;animation:zB 24s ease-in-out infinite alternate">
      <img src="img/track.jpg" alt="">
      <div class="glow" style="${px(75.3, 25.6, 2.6, 4.4)};background:#0b2a1f;animation:blk2 7s steps(1) infinite"></div>
      <div class="glow" style="${px(75.3, 25.6, 2.6, 4.4)};background:radial-gradient(closest-side,#3fe08f,transparent);animation:blk 7s steps(1) infinite"></div>
      <div class="glow" style="${px(75.3, 30.4, 2.6, 4.4)};background:radial-gradient(closest-side,#ff5a4a,transparent);animation:blk2 7s steps(1) infinite"></div>
      ${[0, 1, 2, 3].map(i => `<div class="glow" style="left:46.6%;top:36%;width:1.8%;height:3.2%;background:radial-gradient(closest-side,#ffe7a8,transparent);--dx:-${20 + 0}%;--dy:60%;animation:rail 4s ease-in infinite;animation-delay:${i}s;left:${i%2?52:46}%;${i%2?'--dx:20%':''}"></div>`).join("")}
      ${mist(55)}
    </div>`,
  "kash.jpg": () => `
    <div class="z" style="animation:zA 30s ease-in-out infinite alternate;transform-origin:50% 70%">
      <img src="img/kash-base.jpg" alt="">
      <img class="mv" src="img/kash-strip.png" alt="" style="top:66.0%;height:4.72%;width:121%;--sx:-17.4%;animation:slide 5s linear infinite">
      ${mist(30)}${mist(46, 9)}${mist(82, 4)}
    </div>`,
  "steppe.jpg": () => `
    <div class="z" style="animation:zA 30s ease-in-out infinite alternate;transform-origin:50% 60%">
      <img src="img/steppe-base.jpg" alt="">
      <img class="mv" src="img/steppe-strip.png" alt="" style="top:51.5%;height:14.9%;width:111.6%;--sx:-10.4%;animation:slide 2.6s linear infinite">
      ${mist(34)}${mist(66, 8)}
    </div>`,
  "loco.jpg": () => svScene4(),
  "cont.jpg": () => `
    <div class="z" style="animation:zA 30s ease-in-out infinite alternate;transform-origin:50% 40%">
      <img src="img/cont-base.jpg" alt="">
      <div class="mv" style="left:81.9%;top:14.5%;width:.3%;height:17.2%;background:#d9b878;transform-origin:top;animation:cable 8s ease-in-out infinite"></div>
      <img class="mv" src="img/cont-box.png" alt="" style="${px(71.9, 31.4, 20, 15.3)};animation:lift 8s ease-in-out infinite">
      <div class="glow" style="${px(35, 52, 6, 5.5)};background:rgba(255,226,150,.45);animation:flk 1.2s linear infinite"></div>
      <div class="glow" style="${px(95, 10, 1.8, 3.2)};background:radial-gradient(closest-side,#ff4a3a,transparent);animation:blk 2s steps(1) infinite"></div>
      ${mist(20)}${mist(70, 7)}
    </div>`
};

function initScenes() {
  document.querySelectorAll("[data-img]").forEach(el => {
    const f = SCENES[el.dataset.img];
    if (f) { el.innerHTML = `<div class="stage">${f()}</div>`; if (window.svInit) svInit(el); }
  });
}

renderApp();
