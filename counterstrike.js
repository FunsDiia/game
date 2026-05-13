/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║   DRONEFALL — COUNTERSTRIKE SYSTEM v3.0                     ║
 * ║   Система Відповідного Удару — Повна переробка              ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  АРХІТЕКТУРА:                                               ║
 * ║  • Снаряди летять на реальній Leaflet карті (Безьє)         ║
 * ║  • Пуск з аеродромів України (потрібен живий аеродром)      ║
 * ║  • Цілі рандомно генеруються за правим краєм карти (РФ)     ║
 * ║  • Балансна система очків за збиті вороги                   ║
 * ║  • 4 класи зброї, 7 типів цілей, 3 рівні ефектів           ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════
  // ⚙️  БАЛАНС — всі числа в одному місці
  // ═══════════════════════════════════════════════
  const CFG = {
    // Очки за збиття (накопичення шкали удару)
    killPts: { shahed: 8, heavy: 20, rocket: 35, kalibr: 55 },

    // Шкала: скільки очок потрібно для удару
    strikeThreshold: 300,

    // Кулдаун між ударами (мс) — не можна спамити
    strikeCooldownMs: 45000,

    // Макс. кількість одночасних снарядів в польоті
    maxSimultaneousStrikes: 3,

    // Pixel-to-km коефіцієнт карти (1300 км / 4000 px ≈ 0.325 км/px)
    pxPerKm: 3.077,

    // Зброя: кожна категорія потребує активного аеродрому
    requireAirport: true,

    // Ефект буфу ППО: збільшує hitChance всіх ППО
    ppoBuffHitBonus: 0.12,

    // Редукція хвилі: макс. 65% (навіть найкраща зброя + HQ не дає більше)
    maxWaveReduction: 0.65,
  };

  // ═══════════════════════════════════════════════
  // 🔫  КОНФІГ ЗБРОЇ
  // ═══════════════════════════════════════════════
  // rangeKm    — дальність від аеродрому
  // flightSpd  — швидкість на карті (px/frame при gameSpeed=1)
  // strikePts  — скільки очок витрачається при пуску
  // effects    — що дає влучання
  //   waveReduce  — % редукції наступної хвилі (base)
  //   goldBase    — золото при влученні (масштабується з типом цілі)
  //   buffMs      — час буфу ППО (мс)
  //   buffHit     — бонус hitChance під час буфу
  //   multiStrike — кількість снарядів у залпі (для деяких видів)

  const WEAPONS = {
    fpv_f1: {
      id: 'fpv_f1', name: 'FPV F-1', cat: 'fpv',
      img: 'assets/cs_fpv_f1.png', emoji: '🔴', color: '#ff4444',
      desc: 'Дешевий FPV-дрон. Близька дія, точний удар.',
      rangeKm: 80, flightSpd: 4.5, strikePts: 300,
      goodVs: ['troops','vehicle','depot'],
      effects: { waveReduce: 0.08, goldBase: 120, buffMs: 0, buffHit: 0, multiStrike: 1 }
    },
    fpv_f2: {
      id: 'fpv_f2', name: 'FPV F-2', cat: 'fpv',
      img: 'assets/cs_fpv_f2.png', emoji: '🟠', color: '#ff8c00',
      desc: 'FPV із тепловізором. Підвищена дальність.',
      rangeKm: 110, flightSpd: 4.5, strikePts: 300,
      goodVs: ['troops','vehicle','radar','depot'],
      effects: { waveReduce: 0.10, goldBase: 160, buffMs: 0, buffHit: 0, multiStrike: 1 }
    },
    fpv_f5: {
      id: 'fpv_f5', name: 'FPV F-5', cat: 'fpv',
      img: 'assets/cs_fpv_f5.png', emoji: '🟡', color: '#ffd700',
      desc: 'Бронебійний FPV. Знищує техніку та склади.',
      rangeKm: 130, flightSpd: 5.0, strikePts: 300,
      goodVs: ['vehicle','depot','base','radar'],
      effects: { waveReduce: 0.13, goldBase: 220, buffMs: 12000, buffHit: 0.05, multiStrike: 1 }
    },
    flamingo: {
      id: 'flamingo', name: 'Flamingo', cat: 'drone',
      img: 'assets/cs_flamingo.png', emoji: '🦩', color: '#ff69b4',
      desc: 'Розвідувально-ударний дрон. Велика дальність.',
      rangeKm: 200, flightSpd: 5.5, strikePts: 300,
      goodVs: ['radar','depot','base','airport'],
      effects: { waveReduce: 0.18, goldBase: 320, buffMs: 18000, buffHit: 0.07, multiStrike: 1 }
    },
    fpv_f7: {
      id: 'fpv_f7', name: 'FPV FP-7', cat: 'fpv',
      img: 'assets/cs_fpv_f7.png', emoji: '🔵', color: '#1e90ff',
      desc: 'Кумулятивна БЧ. Проникає у укріплення.',
      rangeKm: 150, flightSpd: 5.0, strikePts: 300,
      goodVs: ['base','depot','hq','fort'],
      effects: { waveReduce: 0.15, goldBase: 260, buffMs: 20000, buffHit: 0.08, multiStrike: 1 }
    },
    fpv_f9: {
      id: 'fpv_f9', name: 'FPV FP-9', cat: 'fpv',
      img: 'assets/cs_fpv_f9.png', emoji: '🟢', color: '#00d278',
      desc: 'Термобарична БЧ. Масова поразка живої сили.',
      rangeKm: 140, flightSpd: 4.8, strikePts: 300,
      goodVs: ['troops','fort','base','depot'],
      effects: { waveReduce: 0.17, goldBase: 290, buffMs: 16000, buffHit: 0.06, multiStrike: 1 }
    },
    atacms: {
      id: 'atacms', name: 'ATACMS', cat: 'ballistic',
      img: 'assets/cs_atacms.png', emoji: '🚀', color: '#ff6b35',
      desc: 'Балістична ракета. Дальність 300 км. Знищує аеродроми.',
      rangeKm: 300, flightSpd: 9.0, strikePts: 300,
      goodVs: ['airport','base','depot','hq','radar'],
      effects: { waveReduce: 0.30, goldBase: 650, buffMs: 25000, buffHit: 0.10, multiStrike: 1 }
    },
    storm_shadow: {
      id: 'storm_shadow', name: 'Storm Shadow', cat: 'cruise',
      img: 'assets/cs_storm_shadow.png', emoji: '✈️', color: '#00d4ff',
      desc: 'Крилата ракета з Су-24. Проникаюча БЧ.',
      rangeKm: 260, flightSpd: 7.0, strikePts: 300,
      goodVs: ['airport','depot','base','hq','fort'],
      effects: { waveReduce: 0.38, goldBase: 500, buffMs: 35000, buffHit: 0.12, multiStrike: 1 }
    },
    neptune: {
      id: 'neptune', name: 'Нептун', cat: 'cruise',
      img: 'assets/cs_neptune.png', emoji: '🌊', color: '#00e5ff',
      desc: 'Протикорабельна/наземна ракета. Знищує штаби.',
      rangeKm: 290, flightSpd: 7.5, strikePts: 300,
      goodVs: ['hq','base','airport','depot'],
      effects: { waveReduce: 0.45, goldBase: 900, buffMs: 45000, buffHit: 0.14, multiStrike: 1 }
    },
    scalp: {
      id: 'scalp', name: 'SCALP-EG', cat: 'cruise',
      img: 'assets/cs_scalp.png', emoji: '⚡', color: '#e0f8ff',
      desc: 'Максимальна дальність. Найбільший ефект по штабу.',
      rangeKm: 360, flightSpd: 8.0, strikePts: 300,
      goodVs: ['hq','airport','base','depot','radar','fort'],
      effects: { waveReduce: 0.55, goldBase: 1200, buffMs: 55000, buffHit: 0.16, multiStrike: 1 }
    },
  };

  // Порядок відображення зброї в категоріях
  const WEAPON_CATS = [
    { id: 'fpv',      label: '🔴 FPV Дрони',        ids: ['fpv_f1','fpv_f2','fpv_f5','fpv_f7','fpv_f9'] },
    { id: 'drone',    label: '🦩 Ударні дрони',      ids: ['flamingo'] },
    { id: 'ballistic',label: '🚀 Балістика',          ids: ['atacms'] },
    { id: 'cruise',   label: '✈️ Крилаті ракети',    ids: ['storm_shadow','neptune','scalp'] },
  ];

  // ═══════════════════════════════════════════════
  // 🎯  ТИПИ ЦІЛЕЙ НА КАРТІ РФ
  // ═══════════════════════════════════════════════
  // goldMult   — множник золота при влученні (+ goodVs бонус)
  // waveBonus  — додатковий % редукції хвилі понад базовий зброї
  // hp         — HP цілі (не використовується в боротьбі, лише для відображення)

  const TARGET_TYPES = {
    troops:  { label: 'Живасила',       emoji: '👥', img: 'assets/cs_rf_troops.png',  goldMult: 0.6,  waveBonus: 0.00, hp: 50  },
    vehicle: { label: 'Техніка',        emoji: '🚛', img: 'assets/cs_rf_vehicle.png', goldMult: 0.8,  waveBonus: 0.02, hp: 80  },
    radar:   { label: 'Радар',          emoji: '📡', img: 'assets/cs_rf_radar.png',   goldMult: 1.0,  waveBonus: 0.04, hp: 100 },
    depot:   { label: 'Склад БЧ',       emoji: '📦', img: 'assets/cs_rf_depot.png',   goldMult: 1.2,  waveBonus: 0.05, hp: 150 },
    fort:    { label: 'Укріплення',     emoji: '🏰', img: 'assets/cs_rf_fort.png',    goldMult: 1.0,  waveBonus: 0.03, hp: 200 },
    base:    { label: 'Військова база', emoji: '🏭', img: 'assets/cs_rf_base.png',    goldMult: 1.4,  waveBonus: 0.07, hp: 300 },
    airport: { label: 'Аеродром РФ',    emoji: '✈', img: 'assets/cs_rf_airport.png', goldMult: 1.6,  waveBonus: 0.10, hp: 350 },
    hq:      { label: 'Штаб',           emoji: '⭐', img: 'assets/cs_rf_hq.png',      goldMult: 2.0,  waveBonus: 0.15, hp: 500 },
  };

  // Зони спавну цілей (Leaflet координати: за правим краєм карти — РФ)
  // Карта України: lat 0-2829, lng 0-4000
  // РФ: lng > 3500, lat > 2000 (Бєлгород, Курськ, Воронеж, Ростов...)
  const RF_SPAWN_ZONES = [
    { name: 'Бєлгород',   latMin: 2550, latMax: 2820, lngMin: 3000, lngMax: 3700, types: ['troops','vehicle','depot','radar','base','fort'] },
    { name: 'Курськ',      latMin: 2500, latMax: 2820, lngMin: 2500, lngMax: 3000, types: ['troops','vehicle','depot','base','fort','airport'] },
    { name: 'Воронеж',    latMin: 2200, latMax: 2550, lngMin: 3000, lngMax: 3800, types: ['depot','base','airport','hq','radar'] },
    { name: 'Брянськ',    latMin: 2500, latMax: 2820, lngMin: 2000, lngMax: 2500, types: ['troops','vehicle','depot','fort'] },
    { name: 'Орел',       latMin: 2350, latMax: 2600, lngMin: 2400, lngMax: 3100, types: ['vehicle','depot','base','radar'] },
    { name: 'Ростов',     latMin: 1900, latMax: 2200, lngMin: 3500, lngMax: 4200, types: ['base','airport','depot','hq'] },
    { name: 'Таганрог',   latMin: 2000, latMax: 2300, lngMin: 3800, lngMax: 4400, types: ['airport','depot','radar'] },
    { name: 'Ліпецьк',   latMin: 2000, latMax: 2300, lngMin: 2700, lngMax: 3400, types: ['depot','base','hq','airport'] },
    { name: 'Тамбов',     latMin: 1900, latMax: 2200, lngMin: 3200, lngMax: 3900, types: ['base','depot','radar','fort'] },
  ];

  const RF_TARGET_COUNT = 14;  // Скільки цілей генерується одночасно

  // ═══════════════════════════════════════════════
  // 📌  ПОЗИЦІЇ АЕРОДРОМІВ (Leaflet-координати)
  //     Відповідають regionSpawnPoints у game.js
  // ═══════════════════════════════════════════════
  // rangeBonus — додаткові км дальності з цієї позиції
  const AIRPORTS_UA = [
    { id: 'kyiv',    name: 'Київ',       lat: 2030, lng: 1875, rangeBonus: 0   },
    { id: 'lviv',    name: 'Львів',      lat: 1920, lng: 655,  rangeBonus: 80  },
    { id: 'odesa',   name: 'Одеса',      lat: 555,  lng: 1565, rangeBonus: 20  },
    { id: 'kharkiv', name: 'Харків',     lat: 1690, lng: 3005, rangeBonus: -20 },
    { id: 'sumy',    name: 'Суми',       lat: 2145, lng: 2515, rangeBonus: 10  },
    { id: 'zaporizhzhia', name: 'Запоріжжя', lat: 940, lng: 2890, rangeBonus: -10 },
    { id: 'dnipro',  name: 'Дніпро',     lat: 1400, lng: 2635, rangeBonus: 0   },
  ];

  // ═══════════════════════════════════════════════
  // 🗃️  ГЛОБАЛЬНИЙ СТАН
  // ═══════════════════════════════════════════════
  const CS = {
    pts: 0,                   // Поточні очки накопичення
    ready: false,             // Шкала заповнена
    cooldownUntil: 0,         // Кулдаун між пусками
    inFlight: 0,              // Кількість снарядів у польоті
    selectedWeaponId: null,
    selectedAirportId: null,
    rfTargets: [],            // Активні цілі на карті РФ
    projectiles: [],          // Снаряди в польоті
    buffEnd: 0,               // Кінець буфу ППО
    buffHitBonus: 0,
    pendingWaveReduction: 0,  // Накопичена редукція наступної хвилі
    totalStrikes: 0,
    // Маркери точок пуску на карті
    airportMarkers: {},
    rangeCircle: null,
    // Режим: idle | pickAirport | pickTarget | flying
    mode: 'idle',
  };

  // ═══════════════════════════════════════════════
  // 🔗  ІНТЕГРАЦІЯ З GAME.JS
  // ═══════════════════════════════════════════════

  // Реєстрація збиття ворога (викликається з game.js або автопатчем)
  window.csRegisterKill = function (type) {
    if (typeof gameOver !== 'undefined' && gameOver) return;
    const pts = CFG.killPts[type] || CFG.killPts.shahed;
    CS.pts = Math.min(CS.pts + pts, CFG.strikeThreshold);
    csUpdateBar();
    if (CS.pts >= CFG.strikeThreshold && !CS.ready) {
      CS.ready = true;
      _onReady();
    }
  };

  // Редукція хвилі — викликати з startWave() у game.js перед spawnWave()
  window.csGetWaveReduction = function () {
    const r = CS.pendingWaveReduction;
    CS.pendingWaveReduction = 0;
    return Math.min(r, CFG.maxWaveReduction);
  };

  // Бонус влучання ППО під час буфу
  window.csGetPPOHitBonus = function () {
    return Date.now() < CS.buffEnd ? CS.buffHitBonus : 0;
  };

  // Автопатч game.js: перехоплюємо нарахування очок/грошей при збитті
  function _hookKills() {
    let lastScore = 0;
    // Стежимо за зміною score через scoreDisplay
    const scoreEl = document.getElementById('scoreDisplay');
    if (scoreEl) {
      new MutationObserver(() => {
        const cur = parseInt(scoreEl.textContent) || 0;
        if (cur > lastScore) {
          csRegisterKill(window._lastKilledType || 'shahed');
          lastScore = cur;
        }
      }).observe(scoreEl, { childList: true, subtree: true, characterData: true });
    } else {
      // fallback polling
      setInterval(() => {
        if (typeof score === 'undefined') return;
        if (score > lastScore) {
          csRegisterKill(window._lastKilledType || 'shahed');
          lastScore = score;
        }
      }, 100);
    }

    // Патчимо moveDrones/moveRockets щоб встановлювати _lastKilledType
    const _origMoveDrones = window.moveDrones;
    // Патч через MutationObserver на money — визначаємо тип за приростом
    // (110 = shahed, 230 = heavy, 400 = rocket, 500 = kalibr)
    let lastMoney = 0;
    setInterval(() => {
      if (typeof money === 'undefined') return;
      const diff = money - lastMoney;
      if (diff >= 450) window._lastKilledType = 'kalibr';
      else if (diff >= 350) window._lastKilledType = 'rocket';
      else if (diff >= 180) window._lastKilledType = 'heavy';
      else if (diff > 0) window._lastKilledType = 'shahed';
      lastMoney = money;
    }, 80);
  }

  // Буф тікер
  function _startBuffTicker() {
    clearInterval(window._csBuffTick);
    window._csBuffTick = setInterval(() => {
      const rem = CS.buffEnd - Date.now();
      const el = document.getElementById('cs-buff-display');
      if (rem <= 0) {
        CS.buffHitBonus = 0;
        clearInterval(window._csBuffTick);
        if (el) el.style.display = 'none';
      } else if (el) {
        el.style.display = 'flex';
        el.querySelector('.cs-buff-sec').textContent = Math.ceil(rem / 1000) + 'с';
      }
    }, 400);
  }

  // ═══════════════════════════════════════════════
  // 🗺️  ЦІЛІ НА КАРТІ РФ
  // ═══════════════════════════════════════════════

  function spawnRFTargets() {
    clearRFTargets();
    for (let i = 0; i < RF_TARGET_COUNT; i++) {
      const zone = RF_SPAWN_ZONES[Math.floor(Math.random() * RF_SPAWN_ZONES.length)];
      const typeName = zone.types[Math.floor(Math.random() * zone.types.length)];
      const tDef = TARGET_TYPES[typeName];
      const lat = zone.latMin + Math.random() * (zone.latMax - zone.latMin);
      const lng = zone.lngMin + Math.random() * (zone.lngMax - zone.lngMin);

      const iconHtml = `
        <div class="cs-rf-icon" data-alive="1">
          <img src="${tDef.img}" width="30" height="30"
            onerror="this.style.display='none';this.nextSibling.style.display='block'">
          <span class="cs-rf-emoji" style="display:none">${tDef.emoji}</span>
          <div class="cs-rf-label">${tDef.label}</div>
          <div class="cs-rf-zone">${zone.name}</div>
        </div>`;

      let marker;
      try {
        marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'cs-rf-target',
            html: iconHtml,
            iconSize: [56, 52],
            iconAnchor: [28, 26]
          }),
          interactive: true,
          zIndexOffset: 600
        }).addTo(map);
      } catch(e) { continue; }

      // Пульсуючий круг-маркер
      let pulse;
      try {
        pulse = L.circle([lat, lng], {
          radius: 35, color: '#ff2222', fillColor: '#ff3333',
          fillOpacity: 0.12, weight: 1.2, dashArray: '3,3', interactive: false
        }).addTo(map);
      } catch(e) {}

      const target = {
        lat, lng, marker, pulse, zone: zone.name,
        type: typeName, tDef,
        alive: true,
        id: 'rf_' + i + '_' + Date.now()
      };

      marker.on('click', () => _onTargetClick(target));
      CS.rfTargets.push(target);
    }
  }

  function clearRFTargets() {
    CS.rfTargets.forEach(t => {
      try { map.removeLayer(t.marker); } catch(e) {}
      try { if (t.pulse) map.removeLayer(t.pulse); } catch(e) {}
    });
    CS.rfTargets = [];
  }

  function destroyRFTarget(target) {
    target.alive = false;
    try { map.removeLayer(target.marker); } catch(e) {}
    try { if (target.pulse) map.removeLayer(target.pulse); } catch(e) {}
    // Якщо мало живих цілей — регенеруємо через 3 с
    const alive = CS.rfTargets.filter(t => t.alive).length;
    if (alive < 4) setTimeout(spawnRFTargets, 3000);
  }

  // ═══════════════════════════════════════════════
  // 🚀  ЛОГІКА ПУСКУ
  // ═══════════════════════════════════════════════

  function _onReady() {
    const btn = document.getElementById('cs-hud-btn');
    if (btn) btn.classList.add('cs-ready');
    csNotify('⚡ ВІДПОВІДНИЙ УДАР ГОТОВИЙ! Натисни кнопку 🚀', 'ready');
    try {
      const s = document.getElementById('alarmSound');
      if (s && window.isSoundOn) { s.currentTime = 0; s.play().catch(() => {}); }
    } catch(e) {}
  }

  // Відкриття панелі вибору зброї
  window.csOpenPanel = function () {
    if (!CS.ready) {
      csNotify(`Збивай ворогів! (${Math.round(CS.pts)}/${CFG.strikeThreshold})`, 'warn');
      return;
    }
    const coolRemain = CS.cooldownUntil - Date.now();
    if (coolRemain > 0) {
      csNotify(`Кулдаун: ще ${Math.ceil(coolRemain/1000)}с`, 'warn');
      return;
    }
    if (CS.inFlight >= CFG.maxSimultaneousStrikes) {
      csNotify('Максимум снарядів у польоті!', 'warn');
      return;
    }
    // Потрібен живий аеродром
    const aliveAirports = (typeof airports !== 'undefined') ? airports.filter(a => a.alive) : [];
    if (CFG.requireAirport && aliveAirports.length === 0) {
      csNotify('Потрібен живий Аеродром для запуску!', 'warn');
      return;
    }
    // Генеруємо цілі якщо ще немає
    if (CS.rfTargets.filter(t => t.alive).length === 0) spawnRFTargets();
    _openWeaponPanel();
  };

  // Вибір зброї
  window.csPickWeapon = function (id) {
    CS.selectedWeaponId = id;
    document.querySelectorAll('.cs-wcard').forEach(c =>
      c.classList.toggle('cs-wcard--sel', c.dataset.wid === id)
    );
    _closeWeaponPanel();
    _enterAirportPickMode();
  };

  // Режим вибору аеродрому
  function _enterAirportPickMode() {
    CS.mode = 'pickAirport';
    csNotify('🛫 Клікни на маркер аеродрому (🇺🇦) для вибору місця пуску', 'info');
    _showAirportMarkers();
    _updateStatus();
  }

  // Вибір аеродрому
  function _pickAirport(apId) {
    CS.selectedAirportId = apId;
    // Виділяємо вибраний
    Object.entries(CS.airportMarkers).forEach(([id, m]) => {
      const el = m.getElement();
      if (el) el.querySelector('.cs-ap-dot')?.classList.toggle('cs-ap-dot--sel', id === apId);
    });
    _showWeaponRange();
    CS.mode = 'pickTarget';
    const ap = AIRPORTS_UA.find(a => a.id === apId);
    csNotify(`✅ ${ap?.name || apId} — тепер оберіть ціль 🎯 на карті РФ`, 'info');
    _updateStatus();
  }

  // Кліку по цілі РФ
  function _onTargetClick(target) {
    if (CS.mode !== 'pickTarget') return;
    if (!target.alive) { csNotify('Ціль вже знищена!', 'warn'); return; }
    const weapon = WEAPONS[CS.selectedWeaponId];
    const ap = AIRPORTS_UA.find(a => a.id === CS.selectedAirportId);
    if (!weapon || !ap) return;
    if (!_inRange(weapon, ap, target)) {
      csNotify(`⚠️ ${weapon.name} не дістає до ${target.tDef.label} з ${ap.name}!`, 'warn');
      return;
    }
    _fireMissile(weapon, ap, target);
  }

  // Перевірка дальності
  function _inRange(weapon, ap, target) {
    const dx = target.lat - ap.lat;
    const dy = target.lng - ap.lng;
    const distPx = Math.sqrt(dx*dx + dy*dy);
    const rangePx = (weapon.rangeKm + (ap.rangeBonus || 0)) * CFG.pxPerKm;
    return distPx <= rangePx;
  }

  // ═══════════════════════════════════════════════
  // 🎬  ПУСК СНАРЯДУ (Leaflet Bezier)
  // ═══════════════════════════════════════════════

  function _fireMissile(weapon, ap, target) {
    // Списуємо ресурси
    CS.pts = 0;
    CS.ready = false;
    CS.cooldownUntil = Date.now() + CFG.strikeCooldownMs;
    CS.inFlight++;
    CS.totalStrikes++;
    CS.mode = 'flying';

    const btn = document.getElementById('cs-hud-btn');
    if (btn) btn.classList.remove('cs-ready');
    csUpdateBar();
    _cleanupAirportUI();
    _updateStatus();
    csNotify(`🚀 ${weapon.name} → ${target.tDef.label} (${target.zone})`, 'launch');

    // Іконка снаряду
    const iconHtml = `
      <div class="cs-proj-icon">
        <img src="${weapon.img}" width="38" height="22"
          style="object-fit:contain;filter:drop-shadow(0 0 8px ${weapon.color})"
          onerror="this.style.display='none';this.nextSibling.style.display='block'">
        <span style="display:none;font-size:1.4rem">${weapon.emoji}</span>
      </div>`;

    let projMarker;
    try {
      projMarker = L.marker([ap.lat, ap.lng], {
        icon: L.divIcon({ className: 'cs-proj-marker', html: iconHtml, iconSize: [38,22], iconAnchor: [19,11] }),
        interactive: false, zIndexOffset: 2500
      }).addTo(map);
    } catch(e) {
      CS.inFlight--;
      CS.mode = 'idle';
      return;
    }

    // Траєкторія Безьє (як у game.js)
    const start   = [ap.lat, ap.lng];
    const end     = [target.lat, target.lng];
    const control = _genControl(start, end);
    const totalLen = _bezierLen(start, control, end);

    const proj = {
      marker: projMarker,
      start, control, end, totalLen,
      t: 0,
      speed: weapon.flightSpd,
      weapon, ap, target,
      done: false,
    };
    CS.projectiles.push(proj);

    // Показати лінію траєкторії (пунктир)
    let trailLine;
    try {
      const pts = [];
      for (let t = 0; t <= 1; t += 0.05) pts.push(_bezierPt(start, control, end, t));
      trailLine = L.polyline(pts, {
        color: weapon.color, weight: 1.5, opacity: 0.35, dashArray: '5,5', interactive: false
      }).addTo(map);
      proj.trailLine = trailLine;
    } catch(e) {}

    // Pan до траєкторії
    try { map.fitBounds([[Math.min(start[0],end[0]), Math.min(start[1],end[1])],
                         [Math.max(start[0],end[0]), Math.max(start[1],end[1])]], { padding: [60,60], maxZoom: map.getZoom() }); } catch(e) {}
  }

  // ═══════════════════════════════════════════════
  // 🎞️  АНІМАЦІЙНИЙ ЦИКЛ СНАРЯДІВ
  // ═══════════════════════════════════════════════

  function _updateProjectiles() {
    const spd = (typeof gameSpeed !== 'undefined') ? gameSpeed : 1;

    for (let i = CS.projectiles.length - 1; i >= 0; i--) {
      const p = CS.projectiles[i];
      if (p.done) { CS.projectiles.splice(i, 1); continue; }

      p.t += (p.speed * spd) / Math.max(p.totalLen, 1);
      if (p.t >= 1) { p.t = 1; p.done = true; }

      const pos = _bezierPt(p.start, p.control, p.end, p.t);

      // Поворот іконки по дотичній
      if (p.t < 0.97) {
        const nextPos = _bezierPt(p.start, p.control, p.end, Math.min(1, p.t + 0.03));
        const angle = Math.atan2(nextPos[1]-pos[1], nextPos[0]-pos[0]) * 180 / Math.PI;
        try {
          const el = p.marker.getElement();
          if (el) {
            const img = el.querySelector('img');
            if (img) img.style.transform = `rotate(${angle}deg)`;
          }
        } catch(e) {}
      }

      try { p.marker.setLatLng(pos); } catch(e) {}

      // Влучання
      if (p.done) _onHit(p);
    }

    requestAnimationFrame(_updateProjectiles);
  }

  function _onHit(p) {
    // Вибух
    _spawnExplosion(p.target.lat, p.target.lng);
    try { map.removeLayer(p.marker); } catch(e) {}
    try { if (p.trailLine) map.removeLayer(p.trailLine); } catch(e) {}

    if (p.target.alive) {
      destroyRFTarget(p.target);
      _applyEffects(p.weapon, p.target);
    }

    CS.inFlight = Math.max(0, CS.inFlight - 1);
    CS.mode = 'idle';
    _updateStatus();
  }

  // ═══════════════════════════════════════════════
  // 💥  ВИБУХ ТА ЕФЕКТИ
  // ═══════════════════════════════════════════════

  function _spawnExplosion(lat, lng) {
    const html = `<div class="cs-boom-fx">💥</div>`;
    let m;
    try {
      m = L.marker([lat, lng], {
        icon: L.divIcon({ className: '', html, iconSize: [70,70], iconAnchor: [35,35] }),
        interactive: false, zIndexOffset: 3500
      }).addTo(map);
    } catch(e) { return; }

    // Тряска карти
    try {
      const mapEl = document.getElementById('map');
      if (mapEl) { mapEl.classList.add('cs-map-shake'); setTimeout(() => mapEl.classList.remove('cs-map-shake'), 450); }
    } catch(e) {}

    // Pan до вибуху
    try { map.panTo([lat, lng], { animate: true, duration: 0.3 }); } catch(e) {}
    setTimeout(() => { try { map.removeLayer(m); } catch(e) {} }, 1600);
  }

  function _applyEffects(weapon, target) {
    const fx = weapon.effects;
    const tDef = target.tDef;

    // Бонус за відповідність зброї типу цілі
    const isGoodMatch = weapon.goodVs.includes(target.type);
    const matchMult = isGoodMatch ? 1.3 : 1.0;

    // Золото
    const gold = Math.floor(fx.goldBase * tDef.goldMult * matchMult);
    if (gold > 0) {
      if (typeof money !== 'undefined') {
        window.money = (window.money || 0) + gold;
        if (typeof updateMoney === 'function') updateMoney();
      }
    }

    // Редукція хвилі
    const wr = Math.min(CFG.maxWaveReduction,
      (fx.waveReduce + tDef.waveBonus) * matchMult
    );
    CS.pendingWaveReduction = Math.min(CFG.maxWaveReduction, CS.pendingWaveReduction + wr);

    // Буф ППО
    if (fx.buffMs > 0 && fx.buffHit > 0) {
      CS.buffEnd = Date.now() + fx.buffMs * matchMult;
      CS.buffHitBonus = fx.buffHit * matchMult;
      _startBuffTicker();
    }

    _showResultModal(weapon, target, gold, wr, isGoodMatch, matchMult);
  }

  // ═══════════════════════════════════════════════
  // 📊  РЕЗУЛЬТАТ
  // ═══════════════════════════════════════════════

  function _showResultModal(weapon, target, gold, wr, isGoodMatch, mult) {
    const modal = document.getElementById('cs-result-modal');
    if (!modal) return;
    const wPct = Math.round(wr * 100);
    const buffSec = CS.buffEnd > Date.now() ? Math.ceil((CS.buffEnd-Date.now())/1000) : 0;
    const buffPct = Math.round(CS.buffHitBonus * 100);

    modal.innerHTML = `
      <div class="cs-result-box">
        <div class="cs-res-boom">💥</div>
        <div class="cs-res-title">ЦІЛЬ ЗНИЩЕНО!</div>
        <div class="cs-res-sub">${weapon.emoji} ${weapon.name} → ${target.tDef.emoji} ${target.tDef.label}</div>
        <div class="cs-res-zone">${target.zone}</div>
        ${isGoodMatch ? '<div class="cs-res-match">⭐ Ідеальне влучання ×1.3!</div>' : ''}
        <div class="cs-res-rewards">
          ${gold    > 0 ? `<div class="cs-rw cs-rw--gold">💰 +${gold}₴</div>` : ''}
          ${wPct    > 0 ? `<div class="cs-rw cs-rw--wave">🌊 Наступна хвиля −${wPct}%</div>` : ''}
          ${buffSec > 0 ? `<div class="cs-rw cs-rw--buff">⚔️ Буф ППО +${buffPct}% влучань на ${buffSec}с</div>` : ''}
        </div>
        <button class="cs-res-close" onclick="document.getElementById('cs-result-modal').classList.remove('cs-result--active')">
          🇺🇦 ДО БОЮ!
        </button>
      </div>`;
    modal.classList.add('cs-result--active');
    setTimeout(() => modal?.classList.remove('cs-result--active'), 8000);
  }

  // ═══════════════════════════════════════════════
  // 🗺️  МАРКЕРИ АЕРОДРОМІВ НА КАРТІ
  // ═══════════════════════════════════════════════

  function _showAirportMarkers() {
    // Очищаємо старі
    Object.values(CS.airportMarkers).forEach(m => { try { map.removeLayer(m); } catch(e) {} });
    CS.airportMarkers = {};

    // Лише живі аеродроми зі списку game.js + статичні AIRPORTS_UA
    const aliveGameAirports = (typeof airports !== 'undefined') ? airports.filter(a => a.alive) : [];

    AIRPORTS_UA.forEach(ap => {
      // Перевіряємо чи є живий аеродром поруч (±200 px)
      const hasGameAirport = aliveGameAirports.some(ga =>
        Math.hypot(ga.lat - ap.lat, ga.lng - ap.lng) < 200
      );
      // Якщо requireAirport і немає game-аеродрому — пропускаємо
      if (CFG.requireAirport && aliveGameAirports.length > 0 && !hasGameAirport) return;

      const html = `
        <div class="cs-ap-marker" title="${ap.name}">
          <div class="cs-ap-dot"></div>
          <div class="cs-ap-label">${ap.name}</div>
        </div>`;
      try {
        const m = L.marker([ap.lat, ap.lng], {
          icon: L.divIcon({ className: 'cs-ap-div', html, iconSize: [64, 44], iconAnchor: [32, 22] }),
          interactive: true, zIndexOffset: 1200
        }).addTo(map);
        m.on('click', e => { L.DomEvent.stopPropagation(e); _pickAirport(ap.id); });
        CS.airportMarkers[ap.id] = m;
      } catch(e) {}
    });
  }

  function _showWeaponRange() {
    if (CS.rangeCircle) { try { map.removeLayer(CS.rangeCircle); } catch(e) {} CS.rangeCircle = null; }
    const weapon = WEAPONS[CS.selectedWeaponId];
    const ap = AIRPORTS_UA.find(a => a.id === CS.selectedAirportId);
    if (!weapon || !ap) return;

    const rangePx = (weapon.rangeKm + (ap.rangeBonus || 0)) * CFG.pxPerKm;
    try {
      CS.rangeCircle = L.circle([ap.lat, ap.lng], {
        radius: rangePx,
        color: weapon.color, fillColor: weapon.color,
        fillOpacity: 0.06, weight: 1.5, dashArray: '6,4', interactive: false
      }).addTo(map);
    } catch(e) {}

    // Підсвічуємо доступні/недоступні цілі
    CS.rfTargets.forEach(t => {
      if (!t.alive) return;
      const ok = _inRange(weapon, ap, t);
      try {
        const el = t.marker.getElement();
        if (el) {
          el.classList.toggle('cs-rf--out', !ok);
          el.classList.toggle('cs-rf--in',   ok);
        }
      } catch(e) {}
    });
  }

  function _cleanupAirportUI() {
    Object.values(CS.airportMarkers).forEach(m => { try { map.removeLayer(m); } catch(e) {} });
    CS.airportMarkers = {};
    if (CS.rangeCircle) { try { map.removeLayer(CS.rangeCircle); } catch(e) {} CS.rangeCircle = null; }
    CS.rfTargets.forEach(t => {
      try {
        const el = t.marker?.getElement?.();
        if (el) { el.classList.remove('cs-rf--out', 'cs-rf--in'); }
      } catch(e) {}
    });
  }

  // ═══════════════════════════════════════════════
  // 🖥️  HUD та ПАНЕЛІ
  // ═══════════════════════════════════════════════

  function csUpdateBar() {
    const pct = Math.min(100, Math.round(CS.pts / CFG.strikeThreshold * 100));
    const fill = document.getElementById('cs-bar-fill');
    const pctEl = document.getElementById('cs-bar-pct');
    const bar = document.getElementById('cs-hud-bar');
    const btn = document.getElementById('cs-hud-btn');

    if (fill) {
      fill.style.width = pct + '%';
      fill.style.background = pct >= 100
        ? 'linear-gradient(90deg,#ff6b35,#ffd700,#ff6b35)'
        : 'linear-gradient(90deg,#00d278,#00e5ff)';
    }
    if (pctEl) pctEl.textContent = pct + '%';
    if (bar) { bar.classList.add('cs-hud--visible'); bar.classList.toggle('cs-hud--ready', pct >= 100); }
    if (btn) btn.style.opacity = pct >= 100 ? '1' : '0.5';
  }

  function csNotify(text, type = 'info') {
    const el = document.getElementById('cs-notif');
    if (!el) return;
    el.textContent = text;
    el.className = `cs-notif cs-notif--${type} cs-notif--visible`;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('cs-notif--visible'), 4500);
  }

  function _updateStatus() {
    const el = document.getElementById('cs-status');
    if (!el) return;
    const msgs = {
      idle:        '',
      pickAirport: '🛫 Оберіть аеродром пуску (🇺🇦 на карті)',
      pickTarget:  '🎯 Оберіть ціль (червона іконка) на карті РФ',
      flying:      '🚀 Снаряд у польоті...',
    };
    el.textContent = msgs[CS.mode] || '';
    el.style.display = msgs[CS.mode] ? 'block' : 'none';
  }

  // ─── Панель зброї ──────────────────────────────
  function _openWeaponPanel() {
    document.getElementById('cs-wpanel')?.classList.add('cs-wpanel--open');
    document.getElementById('cs-overlay')?.classList.add('cs-ov--active');
  }

  function _closeWeaponPanel() {
    document.getElementById('cs-wpanel')?.classList.remove('cs-wpanel--open');
    document.getElementById('cs-overlay')?.classList.remove('cs-ov--active');
  }

  window.csClosePanel = _closeWeaponPanel;

  // ─── Будова UI ─────────────────────────────────
  function _buildUI() {
    // HUD Bar
    const hud = document.createElement('div');
    hud.id = 'cs-hud-bar';
    hud.innerHTML = `
      <div class="cs-hud-label">⚡ УДАР</div>
      <div class="cs-hud-track">
        <div id="cs-bar-fill" class="cs-hud-fill"></div>
        <span id="cs-bar-pct" class="cs-hud-pct">0%</span>
      </div>
      <button id="cs-hud-btn" class="cs-hud-btn" onclick="csOpenPanel()" title="Відповідний удар по РФ">🚀</button>`;
    document.body.appendChild(hud);

    // Buff display
    const buff = document.createElement('div');
    buff.id = 'cs-buff-display';
    buff.style.display = 'none';
    buff.innerHTML = `<span>⚔️ Буф ППО</span><span class="cs-buff-sec">0с</span>`;
    document.body.appendChild(buff);

    // Status bar
    const status = document.createElement('div');
    status.id = 'cs-status';
    status.className = 'cs-status';
    status.style.display = 'none';
    document.body.appendChild(status);

    // Notification
    const notif = document.createElement('div');
    notif.id = 'cs-notif';
    notif.className = 'cs-notif';
    document.body.appendChild(notif);

    // Result modal
    const res = document.createElement('div');
    res.id = 'cs-result-modal';
    res.className = 'cs-result-modal';
    document.body.appendChild(res);

    // Overlay
    const ov = document.createElement('div');
    ov.id = 'cs-overlay';
    ov.className = 'cs-overlay';
    ov.onclick = _closeWeaponPanel;
    document.body.appendChild(ov);

    // Weapon panel
    const wp = document.createElement('div');
    wp.id = 'cs-wpanel';
    wp.className = 'cs-wpanel';
    wp.innerHTML = _buildWeaponPanelHTML();
    document.body.appendChild(wp);

    // Cooldown display (маленький таймер під HUD)
    const cd = document.createElement('div');
    cd.id = 'cs-cd-display';
    cd.className = 'cs-cd-display';
    cd.style.display = 'none';
    document.body.appendChild(cd);

    // Cooldown ticker
    setInterval(() => {
      const rem = CS.cooldownUntil - Date.now();
      const el = document.getElementById('cs-cd-display');
      if (!el) return;
      if (rem > 0) {
        el.style.display = 'block';
        el.textContent = `⏳ Кулдаун: ${Math.ceil(rem/1000)}с`;
      } else {
        el.style.display = 'none';
      }
    }, 500);
  }

  function _buildWeaponPanelHTML() {
    const sections = WEAPON_CATS.map(cat => {
      const weapons = cat.ids.map(id => WEAPONS[id]).filter(Boolean);
      return `
        <div class="cs-wcat">
          <div class="cs-wcat-label">${cat.label}</div>
          <div class="cs-wcards">
            ${weapons.map(w => `
              <div class="cs-wcard" data-wid="${w.id}" onclick="csPickWeapon('${w.id}')" style="--wc:${w.color}">
                <div class="cs-wcard-img">
                  <img src="${w.img}" alt="${w.name}"
                    onerror="this.style.display='none';this.nextSibling.style.display='block'">
                  <span style="display:none;font-size:2rem">${w.emoji}</span>
                </div>
                <div class="cs-wcard-name">${w.name}</div>
                <div class="cs-wcard-meta">
                  <span title="Дальність">📏 ${w.rangeKm}км</span>
                  <span title="Редукція хвилі">🌊 −${Math.round(w.effects.waveReduce*100)}%</span>
                </div>
                <div class="cs-wcard-gold">💰 +${w.effects.goldBase}₴</div>
                ${w.effects.buffMs > 0 ? `<div class="cs-wcard-buff">⚔️ Буф ${Math.round(w.effects.buffMs/1000)}с</div>` : ''}
                <div class="cs-wcard-desc">${w.desc}</div>
                <div class="cs-wcard-good">
                  ${w.goodVs.map(t => TARGET_TYPES[t] ? `<span title="${TARGET_TYPES[t].label}">${TARGET_TYPES[t].emoji}</span>` : '').join('')}
                  <span class="cs-wcard-good-hint">+30% бонус</span>
                </div>
              </div>`).join('')}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="cs-wpanel-inner">
        <div class="cs-wpanel-hdr">
          <div class="cs-wpanel-title">🇺🇦 ВІДПОВІДНИЙ УДАР</div>
          <button class="cs-wpanel-close" onclick="csClosePanel()">✕</button>
        </div>
        <div class="cs-wpanel-hint">
          Обери зброю → клікни аеродром пуску (🇺🇦) → клікни ціль на карті РФ
        </div>
        <div class="cs-wpanel-body">${sections}</div>
      </div>`;
  }

  // ═══════════════════════════════════════════════
  // 📐  МАТЕМАТИКА (Безьє — ідентично game.js)
  // ═══════════════════════════════════════════════

  function _bezierPt(p0, p1, p2, t) {
    const u = 1 - t;
    return [
      u*u*p0[0] + 2*u*t*p1[0] + t*t*p2[0],
      u*u*p0[1] + 2*u*t*p1[1] + t*t*p2[1]
    ];
  }

  function _bezierLen(p0, p1, p2, steps = 16) {
    let len = 0, prev = p0;
    for (let i = 1; i <= steps; i++) {
      const cur = _bezierPt(p0, p1, p2, i/steps);
      len += Math.hypot(cur[0]-prev[0], cur[1]-prev[1]);
      prev = cur;
    }
    return len;
  }

  function _genControl(start, end) {
    const mx = (start[0]+end[0])/2, my = (start[1]+end[1])/2;
    const len = Math.hypot(end[0]-start[0], end[1]-start[1]);
    // Контрольна точка завжди вгору (до РФ летимо "дугою вгору" = менший lat)
    const perpLat = -(end[1]-start[1]) / Math.max(len,1);
    const perpLng =  (end[0]-start[0]) / Math.max(len,1);
    const off = (0.25 + Math.random() * 0.3) * len;
    return [mx + perpLat * off, my + perpLng * off];
  }

  // ═══════════════════════════════════════════════
  // 🚀  INIT
  // ═══════════════════════════════════════════════

  function init() {
    _buildUI();
    _hookKills();
    csUpdateBar();
    _updateStatus();
    requestAnimationFrame(_updateProjectiles);
    // Генеруємо перші цілі коли гра стартує
    const trySpawn = () => {
      if (typeof map !== 'undefined' && map) { spawnRFTargets(); }
      else setTimeout(trySpawn, 500);
    };
    setTimeout(trySpawn, 1500);
    console.log('✅ CounterStrike v3.0 — initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 350);
  }

})();