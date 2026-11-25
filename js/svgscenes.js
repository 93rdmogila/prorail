/* SVG-сцены: №2 «поезд едет на нас» и №4 «вагоны» (из файла «Анимации: поезда») */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let N = 0;
  const rg = (a, b) => [...Array(b - a + 1)].map((_, i) => a + i);
  const sky = (id, st, h = 900) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient><rect width="1600" height="${h}" fill="url(#${id})"/>`;
  const open = `<svg class="sv" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="${NS}">`;

  window.svScene2 = () => { const n = ++N; return open +
    sky("s2" + n, [[0, "#021812"], [.62, "#0b4a36"], [1, "#9a8456"]], 610) +
    `<radialGradient id="gl${n}"><stop offset="0" stop-color="#e8d3a0" stop-opacity=".55"/><stop offset="1" stop-color="#e8d3a0" stop-opacity="0"/></radialGradient><circle cx="1120" cy="480" r="270" fill="url(#gl${n})"/><circle cx="1120" cy="480" r="65" fill="#e8d3a0"/>
<path d="M0 610V608L240 565 520 585 780 555 920 552 1180 570 1440 550 1600 575V610Z" fill="#0f3324"/><rect y="610" width="1600" height="290" fill="#062218"/><g class="sl2"></g>
<path d="M950 610L220 900M970 610L540 900" stroke="#dcb470" stroke-width="5"/><polygon class="sv-beam" points="822,515 480,840 740,840" fill="#e6d3a0"/>
<g class="sv-tr"><path d="M780 525L795 505H905L925 525V635H780Z" fill="#021710"/><rect x="792" y="520" width="54" height="30" fill="#dcb470"/><rect x="855" y="520" width="50" height="30" fill="#dcb470"/><rect x="780" y="575" width="145" height="12" fill="#dcb470"/><ellipse class="sv-lamp" cx="825" cy="512" rx="6" ry="5" fill="#fff"/></g></svg>`; };

  window.svScene4 = () => { const n = ++N;
    const wag = rg(-3, 7).map(i => { const x = 60 + 240 * i, y = 360 + 14 * i, c = ((i % 2) + 2) % 2 ? "#8f6e48" : "#0a3b2c";
      return `<rect x="${x}" y="${y}" width="225" height="235" fill="${c}" stroke="#021710" stroke-width="3"/><rect x="${x}" y="${y}" width="225" height="235" fill="url(#rib${n})"/><rect x="${x}" y="${y + 235}" width="225" height="26" fill="#c8a870"/>` +
        [42, 86, 138, 182].map(d => `<circle cx="${x + d}" cy="${y + 285}" r="21" fill="#04170f" stroke="#d4b06f" stroke-width="3"/>`).join(""); }).join("");
    return open + `<defs><pattern id="rib${n}" width="16" height="10" patternUnits="userSpaceOnUse"><rect width="3" height="10" fill="#000" opacity=".3"/></pattern></defs>` +
      sky("s4" + n, [[0, "#05281e"], [.55, "#0d4a38"], [1, "#031710"]]) +
      [225, 685, 1145, 1525].map(x => `<rect x="${x - 5}" y="120" width="10" height="600" fill="#03150f"/><rect x="${x - 50}" y="180" width="100" height="3" fill="#8a7a50"/>`).join("") +
      `<path d="M0 195L1600 236M0 226L1600 266" stroke="#8a7a50" stroke-width="1" opacity=".7"/><g class="sv-r4">${wag}</g><rect y="700" width="1600" height="200" fill="#02140e"/><path d="M0 697L1600 745" stroke="#dcb470" stroke-width="5"/></svg>`; };

  /* шпалы сцены №2 анимируются через requestAnimationFrame, только пока сцена видна */
  window.svInit = root => root.querySelectorAll(".sl2").forEach(g => {
    const svg = g.ownerSVGElement, n = 24, k = .12, speed = -.28;
    const f = s => [950 - 730 * s - 8 - 60 * s, 970 - 430 * s + 8 + 60 * s, 610 + 290 * s, 2 + 8 * s];
    const els = rg(1, n).map(() => { const l = document.createElementNS(NS, "line"); l.setAttribute("stroke", "#7a6440"); g.appendChild(l); return l; });
    let vis = true;
    if ("IntersectionObserver" in window) new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(svg);
    const draw = t => { const ph = ((t / 1000 * speed) % 1 + 1) % 1;
      els.forEach((l, i) => { const u = (i + ph) / n, z = 1 - u * (1 - k), s = (k / z - k) / (1 - k), [a, b, y, w] = f(s);
        l.setAttribute("x1", a); l.setAttribute("x2", b); l.setAttribute("y1", y); l.setAttribute("y2", y); l.setAttribute("stroke-width", w); l.setAttribute("opacity", Math.min(1, u * 6) * .85); }); };
    draw(0); if (RED) return;
    (function loop(t) { if (!svg.isConnected) return; if (vis) draw(t); requestAnimationFrame(loop); })(0);
  });
})();
