let activeMap = null;
let officeMap = null;
let animFrameId = null;

function destroyRailMap() {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (activeMap) {
    activeMap.remove();
    activeMap = null;
  }
  if (officeMap) {
    officeMap.remove();
    officeMap = null;
  }
}

function buildRouteSampler(coords) {
  const segLengths = [];
  let totalLen = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const dLat = coords[i + 1][0] - coords[i][0];
    const dLng = coords[i + 1][1] - coords[i][1];
    const len = Math.hypot(dLat, dLng) || 0.0001;
    segLengths.push(len);
    totalLen += len;
  }
  return function sampleAt(progress01) {
    const targetDist = ((progress01 % 1) + 1) % 1 * totalLen;
    let acc = 0;
    for (let i = 0; i < segLengths.length; i++) {
      const sLen = segLengths[i];
      if (acc + sLen >= targetDist || i === segLengths.length - 1) {
        const localT = Math.min(1, Math.max(0, (targetDist - acc) / sLen));
        const p1 = coords[i];
        const p2 = coords[i + 1];
        return {
          lat: p1[0] + (p2[0] - p1[0]) * localT,
          lng: p1[1] + (p2[1] - p1[1]) * localT
        };
      }
      acc += sLen;
    }
    return { lat: coords[0][0], lng: coords[0][1] };
  };
}

function initRailMap(lang) {
  const container = document.getElementById("rail-map");
  if (!container || typeof L === "undefined") return;

  destroyRailMap();

  const t = T[lang];
  const map = L.map("rail-map", {
    center: [45.0, 66.0],
    zoom: 4,
    minZoom: 3,
    maxZoom: 8,
    scrollWheelZoom: false,
    attributionControl: false
  });
  activeMap = map;

  const GridLayer = L.GridLayer.extend({
    createTile: function () {
      const tile = document.createElement("canvas");
      const size = this.getTileSize();
      tile.width = size.x;
      tile.height = size.y;
      const ctx = tile.getContext("2d");

      ctx.fillStyle = "#04261c";
      ctx.fillRect(0, 0, size.x, size.y);

      ctx.strokeStyle = "rgba(226, 184, 119, 0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, size.x - 1, size.y - 1);

      ctx.beginPath();
      ctx.moveTo(size.x / 2, 0);
      ctx.lineTo(size.x / 2, size.y);
      ctx.moveTo(0, size.y / 2);
      ctx.lineTo(size.x, size.y / 2);
      ctx.stroke();

      return tile;
    }
  });
  new GridLayer().addTo(map);

  const regionPolygons = [
    {
      color: "#0b5841",
      fillOpacity: 0.45,
      coords: [
        [55.4, 53.0], [54.3, 61.5], [55.1, 68.5], [54.2, 73.5], [51.0, 80.2],
        [49.1, 87.3], [45.2, 82.4], [42.8, 79.8], [42.3, 70.5], [40.9, 68.4],
        [43.5, 66.8], [45.1, 56.0], [46.4, 48.8], [48.5, 46.8], [51.5, 50.0], [54.0, 52.5]
      ]
    },
    {
      color: "#084231",
      fillOpacity: 0.32,
      coords: [
        [49.1, 87.3], [45.2, 82.4], [42.8, 79.8], [39.5, 73.5], [35.5, 78.0],
        [28.0, 86.0], [22.5, 100.0], [21.5, 108.5], [30.5, 121.8], [40.0, 124.0],
        [48.0, 122.0], [50.0, 115.0], [44.0, 111.0], [42.0, 96.0]
      ]
    },
    {
      color: "#073c2c",
      fillOpacity: 0.32,
      coords: [
        [45.1, 56.0], [43.5, 66.8], [40.9, 68.4], [42.3, 70.5], [42.9, 74.7],
        [40.2, 72.8], [37.2, 67.3], [37.5, 54.0], [41.5, 52.5]
      ]
    },
    {
      color: "#063527",
      fillOpacity: 0.32,
      coords: [
        [39.7, 44.8], [38.9, 48.5], [37.5, 54.0], [36.5, 61.2], [31.5, 61.5],
        [25.3, 61.0], [26.8, 56.3], [29.9, 50.2], [34.0, 45.6]
      ]
    },
    {
      color: "#073c2c",
      fillOpacity: 0.3,
      coords: [
        [36.5, 61.2], [37.2, 67.3], [38.4, 71.5], [36.9, 74.6], [34.5, 70.5],
        [31.5, 69.0], [29.5, 63.5], [31.5, 61.5]
      ]
    },
    {
      color: "#063527",
      fillOpacity: 0.25,
      coords: [
        [60.5, 21.0], [59.5, 28.5], [55.0, 38.0], [51.5, 50.0], [46.4, 48.8],
        [45.0, 37.5], [46.5, 30.8], [50.0, 23.5], [54.5, 19.0], [57.5, 21.5]
      ]
    }
  ];

  regionPolygons.forEach(reg => {
    L.polygon(reg.coords, {
      color: "rgba(226, 184, 119, 0.38)",
      weight: 1.5,
      fillColor: reg.color,
      fillOpacity: reg.fillOpacity
    }).addTo(map);
  });

  const hubCoords = [51.1694, 71.4491];
  const hubIcon = L.divIcon({ className: "hub-pin", iconSize: [18, 18], iconAnchor: [9, 9] });
  const hubMarker = L.marker(hubCoords, { icon: hubIcon, zIndexOffset: 1000 }).addTo(map);
  hubMarker.bindTooltip(t.hubName, {
    permanent: true,
    direction: "top",
    offset: [0, -10],
    className: "city-label hub"
  });

  const routeLayers = {};
  const trainAgents = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  ROUTES_DATA.forEach((r, idx) => {
    const polyline = L.polyline(r.coords, {
      color: "#E2B877",
      weight: 2.6,
      opacity: 0.88,
      dashArray: "9, 6"
    }).addTo(map);

    const destIcon = L.divIcon({ className: "dest-pin", iconSize: [14, 14], iconAnchor: [7, 7] });
    const marker = L.marker(r.dest, { icon: destIcon }).addTo(map);

    const shortLabel = t.geo[idx].split("(")[0].trim();
    marker.bindTooltip(shortLabel, {
      permanent: true,
      direction: r.labelDir || "right",
      offset: r.labelDir === "left" ? [-10, 0] : [10, 0],
      className: "city-label"
    });

    marker.bindPopup(
      `<b>${t.geo[idx]}</b><div>${r.station[lang]}</div><div style="margin-top:4px;opacity:.88">${r.cargo[lang]}</div>`
    );

    routeLayers[r.id] = { polyline, marker, coords: r.coords };

    if (!reduceMotion) {
      const sampler = buildRouteSampler(r.coords);
      for (let c = 0; c < 4; c++) {
        const isLoco = c === 0;
        const trainIcon = L.divIcon({
          html: isLoco
            ? '<div style="width:12px;height:12px;background:#F3CB8C;border:2px solid #021c14;border-radius:3px;box-shadow:0 0 10px #F3CB8C;"></div>'
            : '<div style="width:9px;height:9px;background:#E2B877;border:1.5px solid #021c14;border-radius:2px;"></div>',
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        const tMarker = L.marker(r.coords[0], { icon: trainIcon, interactive: false, zIndexOffset: isLoco ? 600 : 500 }).addTo(map);
        trainAgents.push({
          marker: tMarker,
          sampler,
          speed: 0.000072,
          phase: idx * 0.14 - c * 0.022
        });
      }
    }
  });

  if (!reduceMotion && trainAgents.length > 0) {
    let start = null;
    function animateTrains(ts) {
      if (!activeMap) return;
      if (!start) start = ts;
      const elapsed = ts - start;
      trainAgents.forEach(agent => {
        const p = (elapsed * agent.speed + agent.phase) % 1;
        const pos = agent.sampler(p);
        agent.marker.setLatLng([pos.lat, pos.lng]);
      });
      animFrameId = requestAnimationFrame(animateTrains);
    }
    animFrameId = requestAnimationFrame(animateTrains);
  }

  document.querySelectorAll(".geol button[data-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".geol button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = routeLayers[btn.dataset.route];
      if (target) {
        map.fitBounds(target.polyline.getBounds(), { padding: [55, 55], maxZoom: 5 });
        target.marker.openPopup();
      }
    });
  });
}

function initOfficeMap(lang) {
  const container = document.getElementById("office-map");
  if (!container || typeof L === "undefined") return;

  if (officeMap) {
    officeMap.remove();
    officeMap = null;
  }

  const officeCoords = [51.1118, 71.4282]; // Астана, ул. Түркістан, 34Б
  const map = L.map("office-map", {
    center: officeCoords,
    zoom: 16,
    scrollWheelZoom: false,
    attributionControl: false
  });
  officeMap = map;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: "hub-pin",
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const marker = L.marker(officeCoords, { icon: pinIcon }).addTo(map);
  const label = lang === "en"
    ? "ProRail Solutions · 34B Turkistan St."
    : lang === "kk"
      ? "ProRail Solutions · Түркістан к-сі, 34Б"
      : "ProRail Solutions · ул. Түркістан, 34Б";

  marker.bindTooltip(label, {
    permanent: true,
    direction: "top",
    offset: [0, -12],
    className: "city-label hub"
  });
}
