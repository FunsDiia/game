(() => {
  const STYLE_ID = "tutorial-style";
  const HIGHLIGHT_CLASS = "tutorial-highlight";
  const DISABLED_CLASS = "tutorial-disabled";
  const PANEL_CLASS = "tutorial-panel";

  // ========================================
  // ФУНКЦІЯ ПЕРЕКЛАДУ ДЛЯ ТУТОРІАЛУ
  // ========================================
  function t(key) {
    if (typeof translate === 'function') {
      return translate(key, 'tutorial');
    }
    // Fallback якщо translate недоступна
    console.warn('[Tutorial] translate() not available, using key:', key);
    return key;
  }

  // Фіксовані координати для туторіалу
  const TUTORIAL_COORDS = {
    firstTarget: [1420, 1980],
    secondTarget: [1680, 2140],
    firstDroneStart: [1420, 4100],
    heavyDroneStart: [1420, -200],
    rocketStart: [1420, 4200],
    kreiserPos: [300, 4250],
    // Позиції для встановлення ППО
    kulemetPos: [1480, 2150],
    kubPos: [1500, 1800],
    kilchenPos: [1720, 2330],
    rebPos: [1640, 2400],
    patriotPos: [1700, 2030],
    airportPos: [2150, 750]
  };

  // Кастомні характеристики ППО для туторіалу (швидше стріляють, точніше попадають)
  window.TUTORIAL_PVO_STATS = {
    "Кулемет": {
      cd: 300,          // Було 500
      damage: 50,
      projectile: {
        speed: 1.5,     // Було 0.8
        hitChance: 1 // Було 0.55
      }
    },
    "2K12 KUB": {
      cd: 800,         // Було 2500
      projectile: {
        speed: 1.5,     // Було 0.7
        hitChance: 0.0 // Було 0.65
      }
    },
    "Кільчень": {
      cd: 1000,          // Було 925
      damage: 60,
      projectile: {
        speed: 1.7,     // Було 0.9
        hitChance: 1 // Було 0.70
      }
    },
    "РЕБ": {
      // РЕБ не має projectile, тільки slowFactor і rebKnockdownChance
      rebKnockdownChance: 10  
    },
    "Patriot": {
      cd: 1000,          // Було 1100
      damage: 25,
      projectile: {
        speed: 1.7,     // Було 0.85
        hitChance: 1 // Було 0.65
      }
    },
    "F-16": {
      cd: 800,          // Було 700 - швидша перезарядка
      damage: 1000,     // 1000 урона - збиває все з одного пострілу
      projectile: {
        speed: 1.2,     // Було 1.3 - швидший снаряд
        hitChance: 1    // 100% влучення
      }
    }
  };

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes tutorialPulse {
        0%, 100% { 
          box-shadow: 0 0 0 0 rgba(139, 0, 0, 0.8);
          border-color: rgba(139, 0, 0, 0.9);
        }
        50% { 
          box-shadow: 0 0 15px 5px rgba(139, 0, 0, 0.35);
          border-color: rgba(180, 0, 0, 1);
        }
      }
      
      .${HIGHLIGHT_CLASS} {
        z-index: 10001 !important;
        outline: 2px solid rgba(139, 0, 0, 0.95);
        outline-offset: 3px;
        animation: tutorialPulse 1.8s ease-in-out infinite;
        border-radius: 6px;
      }
      
      .${PANEL_CLASS} {
        position: fixed;
        bottom: 150px;
        left: 50%;
        transform: translateX(-50%);
        min-width: 420px;
        max-width: 520px;
background: rgba(14, 17, 29, 0.95);
        border: 2px solid rgba(100, 149, 237, 0.6);
        border-radius: 16px;
        padding: 20px 24px;
        color: #f5f7ff;
        font-family: "Segoe UI", sans-serif;
        font-size: 14px;
        line-height: 1.6;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        z-index: 10003;
        display: flex;
        flex-direction: column;
        max-width: 500px;
      }
      
      .tutorial-content {
        flex: 1;
        margin-bottom: 16px;
      }


      
.tutorial-button {
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 24px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        align-self: flex-end;
        min-width: 140px;
        max-width: 200px;
        white-space: nowrap;
      }

      #hudMenu {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      right: auto !important;
      margin-top: 5px !important;
      flex-direction: column !important;
      }
      
      .tutorial-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
      }
      
      .tutorial-button.exit-style {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
      }
      
      .${DISABLED_CLASS} {
        pointer-events: none !important;
        opacity: 0.4 !important;
        filter: grayscale(0.8);
      }
      
      .tutorial-marker {
        animation: tutorialPulse 1.8s ease-in-out infinite;
      }
      
      .tutorial-trajectory {
        stroke: rgba(139, 0, 0, 0.6);
        stroke-width: 2;
        stroke-dasharray: 10 5;
        fill: none;
      }
      
      @media (max-width: 600px) {
        .${PANEL_CLASS} {
          bottom: 130px;
          min-width: 280px;
          max-width: calc(100vw - 24px);
          padding: 14px 16px;
          font-size: 12px;
          line-height: 1.5;
          border-radius: 14px;
        }

        .tutorial-content {
          margin-bottom: 12px;
        }

        .tutorial-button {
          padding: 8px 18px;
          font-size: 13px;
          min-width: 110px;
          max-width: 160px;
        }

        .tutorial-hud-legend {
          gap: 10px;
        }

        .tutorial-hud-row {
          gap: 10px;
        }

        .tutorial-hud-label {
          font-size: 12px;
        }
      }

      .tutorial-frame-inner {
        z-index: 10004;
      }

      #pvoMenu.tutorial-outline::after,
      #pvoMenu.tutorial-highlight::after { content: none !important; }

      #pvoMenu.tutorial-outline {
        outline: 2px solid rgba(139, 0, 0, 0.95) !important;
        outline-offset: 6px;
        box-shadow: 0 0 12px 4px rgba(139, 0, 0, 0.3);
        animation: tutorialPulse 1.8s ease-in-out infinite;
      }


    `;
    document.head.appendChild(style);
  }

  function waitForGameReady(timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const check = () => {
        try {
          const ready = 
            typeof map !== "undefined" && map !== null &&
            typeof window.L !== "undefined" &&
            document.getElementById("hudPanel") &&
            document.getElementById("pvoMenu");
          
          if (ready) {
            resolve();
            return;
          }
          
          if (performance.now() - startTime > timeoutMs) {
            reject(new Error("Не вдалося ініціалізувати туторіал"));
            return;
          }
          
          requestAnimationFrame(check);
        } catch (e) {
          reject(e);
        }
      };
      check();
    });
  }

  class TutorialUI {
    constructor() {
      injectStyles();
      this.panel = this.createPanel();
      this.nextResolvers = [];
      this.highlightedElements = [];
    }

    createPanel() {
      const panel = document.createElement("div");
      panel.className = PANEL_CLASS;
      panel.innerHTML = `
        <div class="tutorial-content"></div>
        <button class="tutorial-button">${t('btnNext')}</button>
      `;
      document.body.appendChild(panel);

      const button = panel.querySelector(".tutorial-button");
      button.addEventListener("click", () => {
        const resolver = this.nextResolvers.shift();
        if (resolver) resolver();

         // Якщо кнопка "Наступний етап" або "Перша хвиля" - збільшуємо лічильник
        const buttonText = button.textContent;
        if (buttonText === t('btnNextStage') || buttonText === t('btnToDefense')) {
          // Ініціалізуємо currentWave якщо потрібно
         if (typeof currentWave === "undefined" || isNaN(currentWave)) {
  currentWave = 0;
}
          currentWave++;  // Змінюємо глобальну змінну з game.js, а не window.currentWave
          
          // Оновлюємо відображення хвилі в HUD
          const waveDisplay = document.getElementById("waveDisplay");
          if (waveDisplay) {
            waveDisplay.textContent = String(currentWave);
          }
        }
      });

      return panel;
    }

    showMessage(text, buttonText = null, buttonClass = "") {
      const content = this.panel.querySelector(".tutorial-content");
      const button = this.panel.querySelector(".tutorial-button");
      
      content.innerHTML = text;
      button.textContent = buttonText || t('btnNext');
      button.className = `tutorial-button ${buttonClass}`;
      button.style.display = "block";
    }

    hideButton() {
      const button = this.panel.querySelector(".tutorial-button");
      button.style.display = "none";
    }

    waitForNext() {
      return new Promise(resolve => {
        this.nextResolvers.push(resolve);
      });
    }

    highlight(selector) {
      this.clearHighlights();
      const element = typeof selector === "string" 
        ? document.querySelector(selector)
        : selector;
      
      if (element) {
        element.classList.add(HIGHLIGHT_CLASS);
        this.highlightedElements.push(element);
      }
      return element;
    }

    // Додати підсвітку БЕЗ очищення попередніх
    addHighlight(selector) {
      const element = typeof selector === "string" 
        ? document.querySelector(selector)
        : selector;
      
      if (element) {
        element.classList.add(HIGHLIGHT_CLASS);
        this.highlightedElements.push(element);
      }
      return element;
    }

    highlightFrame(selector) {
  this.clearHighlights();
  const el = typeof selector === "string" ? document.querySelector(selector) : selector;
  if (!el) return null;

  // Для PVO-меню — тільки зовнішня outline-рамка
  if (el.id === "pvoMenu") {
    el.classList.add("tutorial-outline");
  } else {
    // Для решти — внутрішня рамка (::after)
    el.classList.add("tutorial-frame-inner");
  }

  this.highlightedElements.push(el);
  return el;
}
  clearHighlights() {
  this.highlightedElements.forEach(el => {
    el.classList.remove("tutorial-highlight");
    el.classList.remove("tutorial-frame-inner");
    el.classList.remove("tutorial-outline");   // ← додано
  });
  this.highlightedElements = [];
}

    destroy() {
      this.panel.remove();
      this.clearHighlights();
    }
  }

  class TutorialManager {
    constructor() {
      this.ui = new TutorialUI();
      this.trajectories = [];
      this.tutorialEntities = [];
      this.allowedPvoButtons = new Set();
      this.started = false;
      this.checkpoint = null; // Збережений стан для відкату
      this.checkpointMonitor = null; // Інтервал для моніторингу
    }

    

    async start() {
      if (this.started) return;
      this.started = true;

      try {
              await waitForGameReady();
      this.prepareEnvironment();
      this.startTrajectoryUpdater();
        await this.runTutorial();
      } catch (error) {
        console.error("[Tutorial] Помилка:", error);
        alert("Не вдалося запустити туторіал. Спробуйте перезавантажити сторінку.");
      }
    }

prepareEnvironment() {
  // Встановлюємо прапорець туторіалу
  window.tutorialModeActive = true;

  // Перевизначаємо глобальну змінну money
money = 17000;
bricks = 250;
power = 250;
fuel = 250;
score = 0;
currentWave = 0;
  
  // Встановлюємо початкові значення для туторіалу
  window.money = 17000;
  window.bricks = 250;
  window.power = 250;
  window.fuel = 250;
  window.score = 0;
  window.currentWave = 0;
  
  // Оновлюємо відображення
  const moneyEl = document.getElementById("money");
  const bricksEl = document.getElementById("bricksDisplay");
  const powerEl = document.getElementById("powerDisplay");
  const fuelEl = document.getElementById("fuelDisplay");
  const scoreEl = document.getElementById("scoreDisplay");
  const waveEl = document.getElementById("waveDisplay");
  
  if (moneyEl) {
    const value = Math.round(window.money).toString();
    moneyEl.textContent = value;
    const digitsOnly = value.replace(/[^0-9]/g, '');
    moneyEl.classList.toggle('long', digitsOnly.length > 5);
  }
  if (bricksEl) bricksEl.textContent = window.bricks;
  if (powerEl) powerEl.textContent = window.power;
  if (fuelEl) fuelEl.textContent = window.fuel;
  if (scoreEl) scoreEl.textContent = 0;
  if (waveEl) waveEl.textContent = 0;
  
  // Перехоплюємо кліки по карті для блокування встановлення ПВО
  if (typeof map !== "undefined" && map) {
    this.originalMapClick = map._events?.click || [];
    map.on('click', (e) => {
      if (window.tutorialModeActive) {
        // Дозволяємо клік тільки якщо є дозволена кнопка ПВО
        if (typeof placingPvo !== "undefined" && placingPvo) {
          const allowed = this.allowedPvoButtons.has(placingPvo);
          if (!allowed) {
            e.originalEvent.stopPropagation();
            e.originalEvent.preventDefault();
            return false;
          }
        }
      }
    }, this);
  }
  
  // Зупиняємо гру
  if (typeof setGameSpeed === "function") setGameSpeed(0);
  
  // Блокуємо всі кнопки ППО
  this.disableAllPvoButtons();
  
  // Очищуємо карту
  this.clearMap();
}

    disableAllPvoButtons() {
      const pvoMenu = document.getElementById("pvoMenu");
      if (pvoMenu) {
        const items = pvoMenu.querySelectorAll(".pvo-item, .pvo-button");
        items.forEach(item => item.classList.add(DISABLED_CLASS));
      }
      
      // Блокуємо кнопки покращення та продажу
      const upgradeButtons = document.querySelectorAll(".upgrade-button");
      const sellButton = document.getElementById("sellPVOButton");
      upgradeButtons.forEach(btn => btn.classList.add(DISABLED_CLASS));
      if (sellButton) sellButton.classList.add(DISABLED_CLASS);
    }

    enablePvoButton(name) {
      this.allowedPvoButtons.add(name);
      const pvoMenu = document.getElementById("pvoMenu");
      if (!pvoMenu) return;
      
      const items = Array.from(pvoMenu.querySelectorAll(".pvo-item, .pvo-button"));
      items.forEach(item => {
        const itemName = item.querySelector("b")?.textContent || item.textContent;
        if (itemName.includes(name)) {
          item.classList.remove(DISABLED_CLASS);
        }
      });
    }

    clearMap() {
      // Очищаємо дрони
      if (typeof drones !== "undefined" && Array.isArray(drones)) {
        drones.forEach(d => {
          try { if (d.marker) map.removeLayer(d.marker); } catch(e) {}
        });
        drones.length = 0;
      }
      
      // Очищаємо ракети
      if (typeof rockets !== "undefined" && Array.isArray(rockets)) {
        rockets.forEach(r => {
          try { if (r.marker) map.removeLayer(r.marker); } catch(e) {}
        });
        rockets.length = 0;
      }
      
      // Очищаємо калібри
      if (typeof kalibrs !== "undefined" && Array.isArray(kalibrs)) {
        kalibrs.forEach(k => {
          try { if (k.marker) map.removeLayer(k.marker); } catch(e) {}
        });
        kalibrs.length = 0;
      }
    }

    focusCamera(lat, lng, zoom = 1, duration = 1.5) {
      if (typeof map === "undefined" || !map) return;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      // На телефонах робимо зум меншим для кращої видимості
      const isMobile = window.innerWidth <= 600;
      let defaultZoom = isMobile ? -1 : 1;
      
      // Якщо zoom передано явно, використовуємо його
      const z = Number.isFinite(zoom) && zoom !== 1 ? zoom : defaultZoom;

      try {
        if (duration && duration > 0 && typeof map.flyTo === "function") {
          map.flyTo([lat, lng], z, { duration, animate: true, easeLinearity: 0.2 });
        } else if (typeof map.setView === "function") {
          map.setView([lat, lng], z, { animate: true });
        }
      } catch (e) {
        console.error("Camera focus error:", e);
      }
    }

async followEntity(entity, duration = 5000, sampleMs = 0, firstFlyDuration = 1.5, desiredZoom = 1) {
  const prevSpeed = (typeof getGameSpeed === "function") ? getGameSpeed() : null;
  if (typeof setGameSpeed === "function" && (!prevSpeed || prevSpeed === 0)) setGameSpeed(1);

  const getPos = () => {
    if (!entity) return null;
    if (Array.isArray(entity.position) && Number.isFinite(entity.position[0])) return [entity.position[0], entity.position[1]];
    if (entity.latlng && Number.isFinite(entity.latlng.lat)) return [entity.latlng.lat, entity.latlng.lng];
    if (entity.marker && typeof entity.marker.getLatLng === "function") {
      const p = entity.marker.getLatLng(); return [p.lat, p.lng];
    }
    return null;
  };

  const startPos = getPos();
  if (!startPos) return;

  // На телефонах робимо зум меншим для кращої видимості
  const isMobile = window.innerWidth <= 600;
  let defaultZoom = isMobile ? -1 : 1;
  
  // Якщо desiredZoom передано явно, використовуємо його
  const z = Number.isFinite(desiredZoom) && desiredZoom !== 1 ? desiredZoom : defaultZoom;

 try {
    if (typeof map.flyTo === "function") {
      map.flyTo(startPos, z, { duration: firstFlyDuration, animate: true, easeLinearity: 0.2 });
    } else if (typeof map.setView === "function") {
      map.setView(startPos, z, { animate: true });
    }
  } catch (_) {}

  // ЧЕКАЄМО завершення першої анімації перед початком слідкування!
  await new Promise(r => setTimeout(r, firstFlyDuration * 1000 + 100));

  const tEnd = performance.now() + duration;

  const advanceIfStuck = (now) => {
    if (!entity || typeof entity.t !== "number") return;
    if (typeof entity._lastT === "undefined") entity._lastT = entity.t;
    if (typeof entity._lastManualAdvance === "undefined") entity._lastManualAdvance = now;

    const moved = entity.t !== entity._lastT;
    if (!moved) {
      if (!entity._stuckSince) entity._stuckSince = now;
      const stuckFor = now - (entity._stuckSince || now);
      if (stuckFor > 80) {
        const dtMs = now - entity._lastManualAdvance;
        const base = (entity.speed || 0.3);
        const total = Math.max(1, entity.totalLength || 1000);
        const step = Math.max(0.001, (base / total) * (dtMs / 16.7));
        entity.t = Math.min(1, entity.t + step);
        if (entity.start && entity.control && entity.target && typeof this.bezierPoint === "function") {
          const [nx, ny] = this.bezierPoint(entity.start, entity.control, entity.target, entity.t);
          entity.position = [nx, ny];
          if (entity.marker && typeof entity.marker.setLatLng === "function") {
            entity.marker.setLatLng([nx, ny]);
          }
        }
        entity._lastManualAdvance = now;
      }
    } else {
      entity._stuckSince = null;
    }
    entity._lastT = entity.t;
  };

  return new Promise(resolve => {
    const smooth = 0.14; // силу згладжування можна підкрутити: 0.10–0.20
    const tick = () => {
      const now = performance.now();
      if (now >= tEnd) {
        if (typeof setGameSpeed === "function" && prevSpeed !== null) setGameSpeed(prevSpeed);
        resolve();
        return;
      }

      const pos = getPos();
      if (pos && Number.isFinite(pos[0]) && Number.isFinite(pos[1])) {
        try {
          const c = (typeof map.getCenter === "function") ? map.getCenter() : {lat: pos[0], lng: pos[1]};
          const nx = c.lat + (pos[0] - c.lat) * smooth;
          const ny = c.lng + (pos[1] - c.lng) * smooth;
          // ВАЖЛИВО: без анімації, щоб не переривати наш LERP
          map.setView([nx, ny], z, { animate: true });
        } catch (_) {}
      }

      advanceIfStuck(now);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}




    spawnTarget(coords) {
      if (typeof activateDefensePoint !== "function") return null;
      
      const index = typeof defensePoints !== "undefined" ? defensePoints.length : 0;
      activateDefensePoint(index, coords);
      
      return typeof defensePoints !== "undefined" && defensePoints[index]
        ? defensePoints[index]
        : null;
    }

    spawnDrone(type, startCoords, targetCoords, customHp = null, customSpeed = null) {
      if (typeof window.L === "undefined" || !map) return null;

      const iconSize = type === "heavy" ? [45, 45] : [40, 40];
      const img = type === "heavy" ? "assets/heavy-drone.png" : "assets/drone.png";
      
const marker = window.L.marker(startCoords, {
  icon: window.L.divIcon({
    className: "rotating-icon",
    html: `<img src="${img}" width="${iconSize[0]}" height="${iconSize[1]}" />`,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1] / 2]
  })
}).addTo(map);


      // Створюємо трасер (траєкторію)
      const trajectory = this.drawTrajectory(startCoords, targetCoords);

      const control = this.generateControlPoint(startCoords, targetCoords);
      // если в game.js есть approximateBezierLength/bezierPoint — пусть считает длину как в игре
      const totalLen = (typeof approximateBezierLength === "function")
        ? approximateBezierLength(startCoords, control, targetCoords)
        : 1000;

      // Базова швидкість або кастомна
      const baseSpeed = type === "heavy" ? 0.4 : 0.3;
      const v = customSpeed !== null ? customSpeed : baseSpeed;

      // Базове HP або кастомне
      const baseHp = type === "heavy" ? 400 : 120;
      const hp = customHp !== null ? customHp : baseHp;

      const drone = {
        type,
        position: startCoords.slice(),
        start: startCoords.slice(),
        control,
        target: targetCoords.slice(),
        marker,
        trajectory,
        speed: v,
        speedOriginal: v,
        hp: hp,
        t: 0,
        totalLength: Math.max(1, totalLen)
      };


      if (typeof drones !== "undefined") {
        drones.push(drone);
      }

      this.tutorialEntities.push(drone);
      return drone;
    }

    spawnRocket(startCoords, targetCoords, customHp = null, customSpeed = null) {
      if (typeof window.L === "undefined" || !map) return null;

      const marker = window.L.marker(startCoords, {
        icon: window.L.divIcon({
          className: "rotating-icon",
          html: `<img src="assets/rocket1.png" width="40" height="40" />`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(map);

      // Трасер для ракети (пряма лінія)
      const trajectory = window.L.polyline([startCoords, targetCoords], {
        color: "rgba(139, 0, 0, 0.6)",
        weight: 3,
        dashArray: "8 6",
        className: "tutorial-trajectory"
      }).addTo(map);

      trajectory._origPoints = [startCoords.slice(), targetCoords.slice()];

      // Базова швидкість або кастомна
      const baseSpeed = 2.0;
      const v = customSpeed !== null ? customSpeed : baseSpeed;

      // Базове HP або кастомне
      const baseHp = 50;
      const hp = customHp !== null ? customHp : baseHp;

      const rocket = {
        type: "rocket",
        position: startCoords.slice(),
        target: targetCoords.slice(),
        marker,
        trajectory,
        speed: v,
        speedOriginal: v,
        hp: hp,
        t: 0
      };

      // Додаємо оновлення t для ракети вручну (оскільки ракети не мають Bezier)
      const updateRocketT = () => {
        if (!rocket || rocket.hp <= 0) return;
        const dx = rocket.target[0] - rocket.position[0];
        const dy = rocket.target[1] - rocket.position[1];
        const totalDist = Math.sqrt(
          Math.pow(rocket.start[0] - rocket.target[0], 2) + 
          Math.pow(rocket.start[1] - rocket.target[1], 2)
        );
        const currentDist = Math.sqrt(dx * dx + dy * dy);
        rocket.t = Math.max(0, Math.min(1, 1 - (currentDist / totalDist)));
        requestAnimationFrame(updateRocketT);
      };
      rocket.start = startCoords.slice();
      requestAnimationFrame(updateRocketT);
      if (typeof rockets !== "undefined") {

        rockets.push(rocket);
      }

      this.tutorialEntities.push(rocket);
      return rocket;
    }

    spawnKalibr(startCoords, targetCoords) {
      if (typeof spawnKalibr === "function") {
        spawnKalibr(startCoords[0], startCoords[1], targetCoords[0], targetCoords[1]);
        
        // Калібри без трасера
        if (typeof kalibrs !== "undefined" && kalibrs.length > 0) {
          return kalibrs[kalibrs.length - 1];
        }
      }
      return null;
    }

    generateControlPoint(start, target) {
      const midX = (start[0] + target[0]) / 2;
      const midY = (start[1] + target[1]) / 2;
      const offset = 300;
      return [midX + offset, midY + offset];
    }

    drawTrajectory(start, target) {
      if (typeof window.L === "undefined" || !map) return null;

      // Оцінюємо довжину для вибору щільності
      const control = this.generateControlPoint(start, target);
      const approxLen = (typeof approximateBezierLength === "function")
        ? approximateBezierLength(start, control, target)
        : 1800;

      // Адаптивна щільність відстань/8, в межах 120..600
      const SEGMENTS = Math.max(120, Math.min(600, Math.round(approxLen / 8)));

      const points = [];
      for (let i = 0; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS;
        points.push(this.bezierPoint(start, control, target, t));
      }

      const trajectory = window.L.polyline(points, {
        color: "rgba(139, 0, 0, 0.6)",
        weight: 3,
        dashArray: "8 6",
        className: "tutorial-trajectory"
      }).addTo(map);

      trajectory._origPoints = points.slice();  // зберігаємо еталон для обрізки
      this.trajectories.push(trajectory);
      return trajectory;
    }

      updateTrajectories() {
  try {
    for (let i = this.tutorialEntities.length - 1; i >= 0; i--) {
      const ent = this.tutorialEntities[i];
      if (!ent || !ent.trajectory) continue;

      const poly = ent.trajectory;

      let removedFromMap = false;
      try {
        if (ent.marker && typeof map?.hasLayer === "function" && !map.hasLayer(ent.marker)) {
          removedFromMap = true;
        }
      } catch (_) {}

      const notInArrays =
        (ent.type === "rocket" && typeof rockets !== "undefined" && !rockets.includes(ent)) ||
        (ent.type !== "rocket" && typeof drones !== "undefined" && !drones.includes(ent));

      const dead = (ent.hp !== undefined && ent.hp <= 0) || ent.alive === false || removedFromMap || notInArrays;

      if (dead) {
        try { map.removeLayer(poly); } catch (e) {}
        ent.trajectory = null;
        const idx = this.trajectories.indexOf(poly);
        if (idx !== -1) this.trajectories.splice(idx, 1);
        continue;
      }

      const orig = poly._origPoints || poly.getLatLngs();
      if (!orig || orig.length < 2) continue;

      const t = Math.max(0, Math.min(1, typeof ent.t === "number" ? ent.t : 0));
      const fIndex = t * (orig.length - 1);
      const i0 = Math.floor(fIndex);
      const i1 = Math.min(orig.length - 1, i0 + 1);
      const alpha = fIndex - i0;

      const p0 = orig[i0], p1 = orig[i1];
      const cutPoint = [
        p0[0] + (p1[0] - p0[0]) * alpha,
        p0[1] + (p1[1] - p0[1]) * alpha
      ];

      const newPoints = [cutPoint, ...orig.slice(i1)];

      if (newPoints.length <= 1 || t >= 0.9999) {
        try { map.removeLayer(poly); } catch (e) {}
        ent.trajectory = null;
        const idx2 = this.trajectories.indexOf(poly);
        if (idx2 !== -1) this.trajectories.splice(idx2, 1);
        continue;
      }

      try { poly.setLatLngs(newPoints); } catch (e) {}
    }
  } catch (e) {}
}


    startTrajectoryUpdater() {
      if (this._trajUpdaterRunning) return;
      this._trajUpdaterRunning = true;
      const loop = () => {
        if (!this._trajUpdaterRunning) return;
        this.updateTrajectories();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }

    stopTrajectoryUpdater() {
      this._trajUpdaterRunning = false;
    }


    bezierPoint(p0, p1, p2, t) {
      const u = 1 - t;
      return [
        u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
        u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
      ];
    }

    waitForPvoPlacement(pvoName, nearCoords = null, radius = 100) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof pvoList === "undefined") return;
          
          const placed = pvoList.find(pvo => {
            if (!pvo || pvo.name !== pvoName) return false;
            
            if (nearCoords && pvo.latlng) {
              const dx = pvo.latlng.lat - nearCoords[0];
              const dy = pvo.latlng.lng - nearCoords[1];
              const dist = Math.sqrt(dx * dx + dy * dy);
              return dist < radius;
            }
            
            return true;
          });

          if (placed) {
            clearInterval(checkInterval);
            resolve(placed);
          }
        }, 100);
      });
    }

    waitForPvoStatUpgrade(pvo, statName, level) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!pvo) {
            clearInterval(checkInterval);
            resolve();
            return;
          }
          const currentLevel = pvo.upgrades?.[statName] || 0;
          if (currentLevel >= level) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    waitForPvoUpgrade(pvo, level) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!pvo || (pvo.upgradeCount || 0) >= level) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    waitForPvoSold(pvo) {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof pvoList === "undefined" || !pvoList.includes(pvo)) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    waitForAllEnemiesDestroyed() {
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          const dronesCount = typeof drones !== "undefined" ? drones.length : 0;
          const rocketsCount = typeof rockets !== "undefined" ? rockets.length : 0;
          const kalibrsCount = typeof kalibrs !== "undefined" ? kalibrs.length : 0;
          
          if (dronesCount === 0 && rocketsCount === 0 && kalibrsCount === 0) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    showPlacementMarker(coords, sizePx = 40) {
  if (typeof window.L === "undefined" || !map) return null;

  // зона дозволеного розміщення
  if (typeof window.__tutorialSetPlacementArea === "function") {
    window.__tutorialSetPlacementArea(coords[0], coords[1], sizePx);
  }

  // тільки підсвітка в стилі this.ui.highlight (анімація з CSS)
  const marker = window.L.marker(coords, {
    icon: window.L.divIcon({
      className: "tutorial-highlight", // саме цей клас
      html: "",
      iconSize: [sizePx, sizePx],
      iconAnchor: [sizePx / 2, sizePx / 2]
    })
  }).addTo(map);

  return marker;
}

    // Функція для зміни швидкості сутностей
    setEntitySpeed(entity, newSpeed) {
      if (entity) {
        entity.speed = newSpeed;
        entity.speedOriginal = newSpeed;
      }
    }

    // Функція для зміни швидкості всіх активних сутностей
    setAllEntitiesSpeed(newSpeed) {
      this.tutorialEntities.forEach(entity => {
        if (entity && entity.hp > 0) {
          entity.speed = newSpeed;
          entity.speedOriginal = newSpeed;
        }
      });
    }

    // Функція для зміни характеристик існуючого ППО
    setPvoStats(pvo, stats) {
      if (!pvo) return;
      
      // Якщо є projectile - мержимо його окремо
      if (stats.projectile && pvo.projectile) {
        Object.assign(pvo.projectile, stats.projectile);
      }
      
      // Мержимо інші поля
      for (const key in stats) {
        if (key !== 'projectile') {
          pvo[key] = stats[key];
          // Оновлюємо базові значення
          if (key === 'damage') pvo.baseDamage = stats.damage;
          if (key === 'radius') pvo.baseRadius = stats.radius;
          if (key === 'cd') pvo.baseCd = stats.cd;
        }
      }
    }


    async runTutorial() {
      // Крок 1: Вітання
      this.ui.showMessage(
        `<strong>${t('welcomeTitle')}</strong><br><br>
        ${t('welcomeText')}`,
        t('btnStart')
      );
      await this.ui.waitForNext();

      // Крок 2: Гроші
      this.ui.highlight(".hud-money");
      this.ui.showMessage(
        `<strong>${t('moneyTitle')}</strong><br><br>
        ${t('moneyText')}`
      );
      await this.ui.waitForNext();

      // Крок 3: Ресурси
      this.ui.clearHighlights();
      this.ui.highlight(".hud-resources");
      this.ui.showMessage(
        `<strong>${t('resourcesTitle')}</strong><br><br>
        ${t('resourcesText')}`
      );
      await this.ui.waitForNext();

      // Крок 4: Статистика
      this.ui.clearHighlights();
      this.ui.highlight(".hud-stats");
      this.ui.showMessage(
        `<strong>${t('statsTitle')}</strong><br><br>
        ${t('statsText')}`
      );
      await this.ui.waitForNext();

      // Крок 5: HUD меню (кнопка)
      this.ui.clearHighlights();
      this.ui.highlight("#hudMenuToggle");
      this.ui.showMessage(
        `<strong>${t('menuTitle')}</strong><br><br>
        ${t('menuText')}`
      );
      this.ui.hideButton();

      await new Promise(resolve => {
        const button = document.getElementById("hudMenuToggle");
        const handler = () => {
          button.removeEventListener("click", handler);
          resolve();
        };
        button.addEventListener("click", handler);
      });

// Крок 6: HUD меню (пояснення)
this.ui.clearHighlights();
this.ui.highlight("#hudMenu");
this.ui.showMessage(
  `<strong>${t('controlPanelTitle')}</strong><br><br>
  <div class="tutorial-hud-legend">
    <div class="tutorial-hud-row">
      <span class="hud-icon-button hud-pause" aria-hidden="true">
        <i class="fa fa-pause" aria-hidden="true"></i>
      </span>
      <span class="tutorial-hud-label">${t('controlPause')}</span>
    </div>
    <div class="tutorial-hud-row">
      <span class="hud-icon-button hud-speed speed" aria-hidden="true">
        <span class="hud-speed-icon hud-speed-icon-top"><i class="fa fa-caret-up" aria-hidden="true"></i></span>
        <span class="hud-speed-value">1x</span>
        <span class="hud-speed-icon hud-speed-icon-bottom"><i class="fa fa-caret-up" aria-hidden="true"></i></span>
      </span>
      <span class="tutorial-hud-label">${t('controlSpeed')}</span>
    </div>
    <div class="tutorial-hud-row">
      <span class="hud-icon-button hud-sound" aria-hidden="true">
        <i class="fa fa-volume-up" aria-hidden="true"></i>
      </span>
      <span class="tutorial-hud-label">${t('controlSound')}</span>
    </div>
    <div class="tutorial-hud-row">
      <span class="hud-icon-button hud-exit" aria-hidden="true">
        <i class="fa fa-sign-out" aria-hidden="true"></i>
      </span>
      <span class="tutorial-hud-label">${t('controlExit')}</span>
    </div>
  </div>`
);
      await this.ui.waitForNext();

      // Крок 7: ППО меню
      this.ui.clearHighlights();
      this.ui.highlightFrame("#pvoMenu");
      this.ui.showMessage(
        `<strong>${t('mainPanelTitle')}</strong><br><br>
        ${t('mainPanelText')}`
      );
      await this.ui.waitForNext();

      // Крок 8: Перша ціль
this.ui.clearHighlights();
const firstTarget = this.spawnTarget(TUTORIAL_COORDS.firstTarget);
this.focusCamera(TUTORIAL_COORDS.firstTarget[0], TUTORIAL_COORDS.firstTarget[1]);

if (firstTarget && firstTarget.marker) {
  const markerElement = firstTarget.marker._icon || firstTarget.marker.getElement();
  if (markerElement) {
    this.ui.highlight(markerElement);
  }
}

      this.ui.showMessage(
        `<strong>${t('targetTitle')}</strong><br><br>
        ${t('targetText')}`,
        t('btnToDefense')
      );
      await this.ui.waitForNext();

      // Крок 9: Перший дрон (HP: 120, Speed: 1.0 під час спостереження)
      this.ui.clearHighlights();
      
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      const firstDrone = this.spawnDrone("light", TUTORIAL_COORDS.firstDroneStart, TUTORIAL_COORDS.firstTarget, 120, 1.0);
      
      if (firstDrone && firstDrone.marker) {
        this.ui.highlight(firstDrone.marker.getElement());
      }


this.ui.showMessage(
  `<strong>${t('shahedTitle')}</strong><br><br>
   ${t('shahedText')}`
  );
  this.ui.hideButton();
  await this.followEntity(firstDrone);



      // Крок 10: Встановлення Кулемета
      this.ui.clearHighlights();
      this.focusCamera(TUTORIAL_COORDS.firstTarget[0], TUTORIAL_COORDS.firstTarget[1]);
      
const kulemetMarker = this.showPlacementMarker(TUTORIAL_COORDS.kulemetPos);
this.ui.highlightFrame("#pvoMenu");

this.enablePvoButton("Кулемет");
if (typeof setGameSpeed === "function") setGameSpeed(0);

this.ui.showMessage(
  `<strong>${t('machineGunTitle')}</strong><br><br>
  ${t('machineGunText')}`
);
this.ui.hideButton();


await this.waitForPvoPlacement("Кулемет", TUTORIAL_COORDS.kulemetPos, 150);

// Після встановлення: прибираємо маркер та знову блокуємо кнопку Кулемета
if (kulemetMarker) {
  try { map.removeLayer(kulemetMarker); } catch(e) {}
}
if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
  this.allowedPvoButtons.delete("Кулемет");
}
// Блокуємо кнопки покращення та продажу після установки Кулемета
this.disableAllPvoButtons();
this.ui.clearHighlights();

      // Після встановлення: гра x1, дрон швидкість 2.5
      this.setEntitySpeed(firstDrone, 1.0);
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      await this.waitForAllEnemiesDestroyed();

      // Крок 11: Успіх
      this.ui.clearHighlights();
      this.ui.showMessage(
        `<strong>${t('machineGunSuccessTitle')}</strong><br><br>
        ${t('machineGunSuccessText')}`,
        t('btnNextStage')
      );
      await this.ui.waitForNext();

      // Крок 12: Важкий дрон (HP: 10000, Speed: 1.0 під час спостереження)
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      const heavyDrone = this.spawnDrone("heavy", TUTORIAL_COORDS.heavyDroneStart, TUTORIAL_COORDS.firstTarget, 10000, 1.0);
      
      if (heavyDrone && heavyDrone.marker) {
        this.ui.highlight(heavyDrone.marker.getElement());
      }

      this.ui.showMessage(
        `<strong>${t('heavyDroneTitle')}</strong><br><br>
        ${t('heavyDroneText')}`
      );
      this.ui.hideButton();

      await this.followEntity(heavyDrone);

      // Крок 13: Встановлення 2K12 KUB
      this.ui.clearHighlights();
      this.focusCamera(TUTORIAL_COORDS.firstTarget[0], TUTORIAL_COORDS.firstTarget[1]);
      
      const kubMarker = this.showPlacementMarker(TUTORIAL_COORDS.kubPos);
      this.ui.highlightFrame("#pvoMenu");
      
      this.enablePvoButton("2K12 KUB");
      
      this.ui.showMessage(
        `<strong>${t('kubTitle')}</strong><br><br>
        ${t('kubText')}`
      );
      this.ui.hideButton();
      if (typeof setGameSpeed === "function") setGameSpeed(0);

      const kub = await this.waitForPvoPlacement("2K12 KUB", TUTORIAL_COORDS.kubPos, 150);
      
      if (kubMarker) {
        try { map.removeLayer(kubMarker); } catch(e) {}
      }
      
      // Після встановлення: знову блокуємо кнопку 2K12 KUB та кнопки управління
      if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
        this.allowedPvoButtons.delete("2K12 KUB");
      }
      if (typeof window.__tutorialPvoLock === "function") {
        window.__tutorialPvoLock();
      }
      this.disableAllPvoButtons();

      // Після встановлення: гра x1, дрон швидкість 2.0
      this.setEntitySpeed(heavyDrone, 2.0);
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      await this.waitForAllEnemiesDestroyed();

      // Крок 14: Прорив - покращення
      if (typeof setGameSpeed === "function") setGameSpeed(0);
      this.ui.clearHighlights();

// 1) Повідомлення про прорив — гравець натискає "Далі"
this.ui.showMessage(
  `<strong>${t('breakthroughTitle')}</strong><br><br>
  ${t('breakthroughText')}`
);
await this.ui.waitForNext();

// Підсвічуємо меню ППО (це очистить попередні підсвітки)
this.ui.highlightFrame("#pvoMenu");
// Додаємо підсвітку KUB без очищення
if (kub && kub.marker) {
  this.ui.addHighlight(kub.marker.getElement());
}

// Встановлюємо волну = 2, щоб можна було покращити урон до 2 рівня
if (typeof currentWave !== 'undefined') currentWave = 2;
if (typeof window.currentWave !== 'undefined') window.currentWave = 2;
// Оновлюємо UI волни
const waveDisplay = document.getElementById("waveDisplay");
if (waveDisplay) waveDisplay.textContent = "2";

// СПОЧАТКУ встановлюємо флаги - ДО показу повідомлення!
window.tutorialAllowUpgradeFor = "2K12 KUB";
window.tutorialAllowUpgradeStat = "damage"; // дозволяємо тільки урон

// Примусово вибираємо KUB і оновлюємо меню (тепер з правильним флагом)
// setupPvoMenu сам розблокує потрібну upgrade-button завдяки флагу tutorialAllowUpgradeStat
if (kub && typeof selectedPVO !== 'undefined') {
  selectedPVO = kub;
  if (typeof setupPvoMenu === 'function') setupPvoMenu();
}

// КРИТИЧНО: Блокуємо ТІЛЬКИ pvo-item і pvo-button (кнопки ППО внизу), НЕ чіпаємо upgrade-button!
const pvoMenuForDamage = document.getElementById("pvoMenu");
if (pvoMenuForDamage) {
  pvoMenuForDamage.querySelectorAll(".pvo-item, .pvo-button:not(.upgrade-button)").forEach(item => {
    item.classList.add(DISABLED_CLASS);
  });
}

// 2) Покращення УРОНУ до 2 рівня
this.ui.showMessage(
  `<strong>${t('upgradeDamageTitle')}</strong><br><br>
  ${t('upgradeDamageText')}`
);
this.ui.hideButton();

// Функція для розблокування ТІЛЬКИ потрібної кнопки покращення
const waitForSpecificUpgradeButton = (statName) => {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      const upgradeButtons = document.querySelectorAll('.upgrade-button');
      if (upgradeButtons.length > 0) {
        clearInterval(checkInterval);
        
        // Блокуємо ВСІ кнопки покращення
        upgradeButtons.forEach(btn => {
          btn.classList.add(DISABLED_CLASS);
          btn.classList.add("tutorial-disabled");
          btn.disabled = true;
        });
        
        // Шукаємо потрібну кнопку по тексту і розблоковуємо ТІЛЬКИ її
        const buttonTexts = {
          'damage': ['Урон', 'Damage'],
          'accuracy': ['Влучність', 'Accuracy', 'Шанс', 'Точність']
        };
        const searchTexts = buttonTexts[statName] || [];
        
        upgradeButtons.forEach(btn => {
          const btnText = btn.textContent || btn.innerText;
          const isTargetButton = searchTexts.some(text => btnText.includes(text));
          if (isTargetButton) {
            btn.classList.remove(DISABLED_CLASS);
            btn.classList.remove("tutorial-disabled");
            btn.disabled = false;
          }
        });
        
        resolve();
      }
    }, 100);
  });
};

// Функція що постійно блокує всі кнопки крім потрібної
const keepOnlyButtonEnabled = (statName) => {
  const buttonTexts = {
    'damage': ['Урон', 'Damage'],
    'accuracy': ['Влучність', 'Accuracy', 'Шанс', 'Точність']
  };
  const searchTexts = buttonTexts[statName] || [];
  
  return setInterval(() => {
    // Блокуємо pvo-item і pvo-button (кнопки ППО внизу) ПОСТІЙНО
    const pvoMenu = document.getElementById("pvoMenu");
    if (pvoMenu) {
      pvoMenu.querySelectorAll(".pvo-item, .pvo-button:not(.upgrade-button)").forEach(item => {
        item.classList.add(DISABLED_CLASS);
      });
    }
    
    // Блокуємо ТІЛЬКИ upgrade-button крім потрібної
    document.querySelectorAll('.upgrade-button').forEach(btn => {
      const btnText = btn.textContent || btn.innerText;
      const isTargetButton = searchTexts.some(text => btnText.includes(text));
      if (isTargetButton) {
        btn.classList.remove(DISABLED_CLASS);
        btn.classList.remove("tutorial-disabled");
        btn.disabled = false;
      } else {
        btn.classList.add(DISABLED_CLASS);
        btn.classList.add("tutorial-disabled");
        btn.disabled = true;
      }
    });
  }, 50);
};

await waitForSpecificUpgradeButton('damage');
// Запускаємо постійну блокировку всіх кнопок крім "Урон"
const damageBlocker = keepOnlyButtonEnabled('damage');
await this.waitForPvoStatUpgrade(kub, "damage", 2);
// Зупиняємо блокування
clearInterval(damageBlocker);

// Скидаємо флаг після улучшения урону
window.tutorialAllowUpgradeStat = null;

// 3) Тепер покращення ШАНСУ ПОПАДАННЯ до 2 рівня
this.ui.highlightFrame("#pvoMenu");
if (kub && kub.marker) {
  this.ui.addHighlight(kub.marker.getElement());
}

// СПОЧАТКУ встановлюємо флаг - ДО показу повідомлення!
window.tutorialAllowUpgradeStat = "accuracy"; // дозволяємо тільки влучність

// Оновлюємо меню для нових кнопок (тепер з правильним флагом)
if (kub && typeof selectedPVO !== 'undefined') {
  selectedPVO = kub;
  if (typeof setupPvoMenu === 'function') setupPvoMenu();
}

// КРИТИЧНО: Блокуємо ТІЛЬКИ pvo-item і pvo-button (кнопки ППО внизу), НЕ чіпаємо upgrade-button!
const pvoMenuForAccuracy = document.getElementById("pvoMenu");
if (pvoMenuForAccuracy) {
  pvoMenuForAccuracy.querySelectorAll(".pvo-item, .pvo-button:not(.upgrade-button)").forEach(item => {
    item.classList.add(DISABLED_CLASS);
  });
}

this.ui.showMessage(
  `<strong>${t('upgradeAccuracyTitle')}</strong><br><br>
  ${t('upgradeAccuracyText')}`
);
this.ui.hideButton();

await waitForSpecificUpgradeButton('accuracy');
// Запускаємо постійну блокировку всіх кнопок крім "Влучність"
const accuracyBlocker = keepOnlyButtonEnabled('accuracy');
await this.waitForPvoStatUpgrade(kub, "accuracy", 2);
// Зупиняємо блокування
clearInterval(accuracyBlocker);

// Блокуємо ВСІ кнопки після улучшения точности
this.disableAllPvoButtons();

// Після покращення - знову блокуємо кнопки
const upgradeButtonsAfter = document.querySelectorAll(".upgrade-button");
upgradeButtonsAfter.forEach(btn => {
  btn.classList.add(DISABLED_CLASS);
  btn.classList.add("tutorial-disabled");
  btn.disabled = true;
});

// Забороняємо покращення після виконання завдання
window.tutorialAllowUpgradeFor = null;
window.tutorialAllowUpgradeStat = null;

      // Крок 15: Пояснення покращення
      this.ui.clearHighlights();
      this.ui.showMessage(
        `<strong>${t('upgradeSuccessTitle')}</strong><br><br>
        ${t('upgradeSuccessText')}`,
        t('btnNextStage')
      );
      await this.ui.waitForNext();

      // Крок 16: Сповіщення про область
      this.ui.showMessage(
        `<strong>${t('intelTitle')}</strong><br><br>
        ${t('intelText')}`
      );
      
      // Показуємо системний HUD-тост під панеллю
      const notificationText = t('nextTargetInRegion').replace('{region}', t('cherkasyRegion'));
      showHudNotification(notificationText, "info", 999999999);

      // на підсвітку беремо сам тост (він під HUD)
      const hudToastEl = document.getElementById("targetNotification");
      if (hudToastEl && this.ui && typeof this.ui.highlight === "function") {
        this.ui.highlight(hudToastEl);
      }

      await this.ui.waitForNext();

      // Ховаємо повідомлення після натискання "Далі"
      if (hudToastEl) {
        hudToastEl.classList.remove("visible");
      }



      // Крок 17: 3 важкі дрони (HP: 400, Speed: 1.0 під час спостереження)
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      const heavy1 = this.spawnDrone("heavy", [1900, +110], TUTORIAL_COORDS.firstTarget, 400, 1.0);
      const heavy2 = this.spawnDrone("heavy", [2100, +350], TUTORIAL_COORDS.firstTarget, 400, 1.0);
      const heavy3 = this.spawnDrone("heavy", [1760, +200], TUTORIAL_COORDS.firstTarget, 400, 1.0);

      this.ui.clearHighlights();
      this.ui.showMessage(
        `<strong>${t('droneGroupTitle')}</strong><br><br>
        ${t('droneGroupText')}`
      );
      this.ui.hideButton();

      await this.followEntity(heavy1);

      // Після спостереження: гра x1, дрони швидкість 2.0
      this.setEntitySpeed(heavy1, 2.0);
      this.setEntitySpeed(heavy2, 2.0);
      this.setEntitySpeed(heavy3, 2.0);
      
      // Змінюємо характеристики KUB напряму (window.TUTORIAL_PVO_STATS працює тільки при створенні)
      this.setPvoStats(kub, {
        cd: 800,
        damage: 1000,
        projectile: {
          speed: 1.5,
          hitChance: 1
        }
      });
      
      this.focusCamera(TUTORIAL_COORDS.firstTarget[0], TUTORIAL_COORDS.firstTarget[1]);
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      
      await this.waitForAllEnemiesDestroyed();

      // Крок 18: Вітання
      if (typeof setGameSpeed === "function") setGameSpeed(0);
      this.ui.showMessage(
        `<strong>${t('droneGroupSuccessTitle')}</strong><br><br>
        ${t('droneGroupSuccessText')}`,
        t('btnNextStage')
      );
      await this.ui.waitForNext();

      // Крок 19: Друга ціль
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      const secondTarget = this.spawnTarget(TUTORIAL_COORDS.secondTarget);
      this.focusCamera(TUTORIAL_COORDS.secondTarget[0], TUTORIAL_COORDS.secondTarget[1]);

      this.ui.showMessage(
        `<strong>${t('secondTargetTitle')}</strong><br><br>
        ${t('secondTargetText')}`
      );
      await this.ui.waitForNext();

      // Крок 20: Ракета (HP: 50, Speed: 3.0 - швидка, не перехопити)
      const rocket = this.spawnRocket(TUTORIAL_COORDS.rocketStart, TUTORIAL_COORDS.firstTarget, 50, 3.0);

      this.ui.showMessage(
        `<strong>${t('rocketTitle')}</strong><br><br>
        ${t('rocketText')}`
      );
      this.ui.hideButton();
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      
      // Слідкуємо за ракетою 5 секунд
      await this.followEntity(rocket);
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      
      // Після 5 секунд переключаємо камеру на об'єкт
      this.focusCamera(TUTORIAL_COORDS.firstTarget[0], TUTORIAL_COORDS.firstTarget[1]);
      this.ui.showMessage(
        `<strong>${t('rocketMissTitle')}</strong><br><br>
        ${t('rocketMissText')}`
      );
      this.ui.hideButton();
      await this.waitForAllEnemiesDestroyed();

      // Крок 22: Продаж ППО
      this.ui.clearHighlights();
      
      // Знаходимо кулемет і 2K12 KUB
      const kulemet = typeof pvoList !== "undefined" 
        ? pvoList.find(p => p.name === "Кулемет")
        : null;

      // Підсвічуємо множинно: кулемет + 2K12 KUB + меню
      if (kulemet && kulemet.marker) {
        const kulemetEl = kulemet.marker._icon || kulemet.marker.getElement();
        if (kulemetEl) this.ui.addHighlight(kulemetEl);
      }
      if (kub && kub.marker) {
        const kubEl = kub.marker._icon || kub.marker.getElement();
        if (kubEl) this.ui.addHighlight(kubEl);
      }
      
      // Підсвічуємо PVO меню
      const pvoMenu = document.getElementById("pvoMenu");
      if (pvoMenu) {
        pvoMenu.classList.add("tutorial-outline");
        this.ui.highlightedElements.push(pvoMenu);
      }

      // Дозволяємо продаж на весь час завдання
      window.tutorialAllowSell = true;

      this.ui.showMessage(
        `<strong>${t('sellTitle')}</strong><br><br>
        ${t('sellText')}`
      );
      this.ui.hideButton();

      // Чекаємо продажу обох
      if (kulemet) await this.waitForPvoSold(kulemet);
      if (kub) await this.waitForPvoSold(kub);
      // Забороняємо продаж після виконання завдання
      window.tutorialAllowSell = false;

      // Після продажу - блокуємо кнопку продажу назад
      const sellButtonAfter = document.getElementById("sellPVOButton");
      if (sellButtonAfter) {
        sellButtonAfter.classList.add(DISABLED_CLASS);
        sellButtonAfter.classList.add("tutorial-disabled");
        sellButtonAfter.disabled = true;
      }

      // Крок 23: Кільчень і Patriot
      this.ui.clearHighlights();
      this.focusCamera(TUTORIAL_COORDS.secondTarget[0], TUTORIAL_COORDS.secondTarget[1]);

      const kilchenMarker = this.showPlacementMarker(TUTORIAL_COORDS.kilchenPos);
      this.enablePvoButton("Кільчень");

      this.ui.showMessage(
        `<strong>${t('kilchenTitle')}</strong><br><br>
        ${t('kilchenText')}`
      );
      this.ui.hideButton();

      await this.waitForPvoPlacement("Кільчень", TUTORIAL_COORDS.kilchenPos, 150);
      
      if (kilchenMarker) {
        try { map.removeLayer(kilchenMarker); } catch(e) {}
      }

      // Після встановлення Кільченя - блокуємо кнопку назад
      if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
        this.allowedPvoButtons.delete("Кільчень");
      }
      if (typeof window.__tutorialPvoLock === "function") {
        window.__tutorialPvoLock();
      }
      this.disableAllPvoButtons();

      // РЕБ
      const rebMarker = this.showPlacementMarker(TUTORIAL_COORDS.rebPos);
      this.enablePvoButton("РЕБ");

      this.ui.showMessage(
        `<strong>${t('rebTitle')}</strong><br><br>
        ${t('rebText')}`
      );
      this.ui.hideButton();

      await this.waitForPvoPlacement("РЕБ", TUTORIAL_COORDS.rebPos, 150);
      
      if (rebMarker) {
        try { map.removeLayer(rebMarker); } catch(e) {}
      }

      // Після встановлення РЕБ - блокуємо кнопку назад
      if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
        this.allowedPvoButtons.delete("РЕБ");
      }
      if (typeof window.__tutorialPvoLock === "function") {
        window.__tutorialPvoLock();
      }
      this.disableAllPvoButtons();

      // Patriot
      const patriotMarker = this.showPlacementMarker(TUTORIAL_COORDS.patriotPos);
      this.enablePvoButton("Patriot");

      this.ui.showMessage(
        `<strong>${t('patriotTitle')}</strong><br><br>
        ${t('patriotText')}`
      );
      this.ui.hideButton();

      await this.waitForPvoPlacement("Patriot", TUTORIAL_COORDS.patriotPos, 150);
      
      if (patriotMarker) {
        try { map.removeLayer(patriotMarker); } catch(e) {}
      }

      // Після встановлення Patriot - блокуємо кнопку назад
      if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
        this.allowedPvoButtons.delete("Patriot");
      }
      if (typeof window.__tutorialPvoLock === "function") {
        window.__tutorialPvoLock();
      }
      this.disableAllPvoButtons();

      // Крок 24: Змішана атака
      this.ui.showMessage(
        `<strong>${t('checkDefenseTitle')}</strong><br><br>
        ${t('checkDefenseText')}`,
        t('btnNextStage')
      );
      await this.ui.waitForNext();

      // Крок 25: 2 дрони + 3 ракети з двох сторін (Speed: 1.5 для всіх)
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      // Зліва (Patriot збиває) - HP: 120 дрони, HP: 50 ракети, Speed: 1.5
      const leftDrone1 = this.spawnDrone("light", [TUTORIAL_COORDS.secondTarget[0], -200], TUTORIAL_COORDS.secondTarget, 120, 1.5);
      const leftDrone2 = this.spawnDrone("light", [TUTORIAL_COORDS.secondTarget[0] + 200, -100], TUTORIAL_COORDS.secondTarget, 120, 1.5);
      const leftRocket1 = this.spawnRocket([TUTORIAL_COORDS.secondTarget[0], -50], TUTORIAL_COORDS.secondTarget, 50, 1.5);
      const leftRocket2 = this.spawnRocket([TUTORIAL_COORDS.secondTarget[0] + 100, -200], TUTORIAL_COORDS.secondTarget, 50, 1.5);
      const leftRocket3 = this.spawnRocket([TUTORIAL_COORDS.secondTarget[0] + 400, -450], TUTORIAL_COORDS.secondTarget, 50, 1.5);

      // Справа (Кільчень збиває) - HP: 120 дрони, HP: 50 ракети, Speed: 1.5
      const rightDrone1 = this.spawnDrone("light", [TUTORIAL_COORDS.secondTarget[0], 4200], TUTORIAL_COORDS.secondTarget, 120, 1.5);
      const rightDrone2 = this.spawnDrone("light", [TUTORIAL_COORDS.secondTarget[0] + 550, 3900], TUTORIAL_COORDS.secondTarget, 120, 1.5);
      const rightRocket1 = this.spawnRocket([TUTORIAL_COORDS.secondTarget[0], 4100], TUTORIAL_COORDS.secondTarget, 50, 1.5);
      const rightRocket2 = this.spawnRocket([TUTORIAL_COORDS.secondTarget[0] + 200, 4000], TUTORIAL_COORDS.secondTarget, 50, 1.5);

      this.ui.showMessage(
        `<strong>${t('massAttackTitle')}</strong><br><br>
        ${t('massAttackText')}`
      );
      this.ui.hideButton();


      await this.waitForAllEnemiesDestroyed();

      // Крок 26: Пояснення про Patriot
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      this.ui.showMessage(
        `<strong>${t('resultTitle')}</strong><br><br>
        ${t('resultText')}`
      );
      await this.ui.waitForNext();

      this.ui.showMessage(
        `<strong>${t('specializationTitle')}</strong><br><br>
        ${t('specializationText')}`
      );
      await this.ui.waitForNext();

      // Крок 27: Аварійка
this.ui.clearHighlights();
this.enablePvoButton("Аварійка");
this.ui.highlightFrame("#pvoMenu");

this.ui.showMessage(
  `<strong>${t('emergencyTitle')}</strong><br><br>
  ${t('emergencyText')}`
);
this.ui.hideButton();

await new Promise(resolve => {
  const checkInterval = setInterval(() => {
    if (typeof avariikaActive !== "undefined" && avariikaActive) {
      clearInterval(checkInterval);
      resolve();
    }
  }, 100);
});

// После установки Аварийки - блокируем все кнопки ПВО
if (this.allowedPvoButtons && this.allowedPvoButtons.delete) {
  this.allowedPvoButtons.delete("Аварійка");
}
this.disableAllPvoButtons();
if (typeof window.__tutorialPvoLock === "function") {
  window.__tutorialPvoLock();
}

      // Крок 28: Ремонт
      this.ui.clearHighlights();
      
      if (secondTarget && secondTarget.marker) {
        this.ui.highlight(secondTarget.marker.getElement());
      }

      this.ui.showMessage(
        `<strong>${t('repairSelectTitle')}</strong><br><br>
        ${t('repairSelectText')}`
      );
      this.ui.hideButton();

      // Чекаємо кліку на об'єкт і виклику ремонту
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof repairState !== "undefined" && repairState !== null) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      // Крок 29: Пояснення ремонту
      this.ui.showMessage(
        `<strong>${t('repairWarningTitle')}</strong><br><br>
        ${t('repairWarningText')}`
      );
      await this.ui.waitForNext();

      // Крок 30: Аеродром
      this.ui.clearHighlights();
      this.enablePvoButton("Аеродром");
      this.ui.highlightFrame("#pvoMenu");

      this.ui.showMessage(
        `<strong>${t('airfieldTitle')}</strong><br><br>
        ${t('airfieldText')}`
      );
      this.ui.hideButton();

      // Чекаємо побудови аеродрому
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof airports !== "undefined" && airports.some(a => a.alive)) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      // Крок 31: Крейсер
      
      
      if (typeof activateKreiser === "function") {
        activateKreiser(TUTORIAL_COORDS.kreiserPos);
      }

      // Підсвічуємо крейсер
      const kreiserObj = typeof kreiser !== "undefined" ? kreiser : null;
      if (kreiserObj && kreiserObj.marker) {
        this.ui.highlight(kreiserObj.marker.getElement());
      }

      // Блокуємо всі кнопки ППО під час атаки крейсера
this.allowedPvoButtons.clear();
this.disableAllPvoButtons();
if (typeof window.__tutorialPvoLock === "function") {
  window.__tutorialPvoLock();
}
this.focusCamera(TUTORIAL_COORDS.kreiserPos[0], TUTORIAL_COORDS.kreiserPos[1]);
      this.ui.showMessage(
        `<strong>${t('cruiserTitle')}</strong><br><br>
        ${t('cruiserText')}`
      );
      await this.ui.waitForNext();
      // Переключаємо камеру на аеропорт
      this.focusCamera(TUTORIAL_COORDS.airportPos[0], TUTORIAL_COORDS.airportPos[1]);

// Крок 32: Покупка F-16
this.ui.clearHighlights();
this.allowedPvoButtons.clear();
this.allowedPvoButtons.add("F-16");
if (typeof window.__tutorialPvoLock === "function") {
  window.__tutorialPvoLock();
}
this.ui.highlightFrame("#pvoMenu");
// Дозволяємо встановлення F-16 де завгодно в туторіалі
window.__tutorialClearPlacementArea();

this.ui.showMessage(
  `<strong>${t('f16Title')}</strong><br><br>
  ${t('f16Text')}`
);
this.ui.hideButton();

const f16 = await this.waitForPvoPlacement("F-16");

// Блокируем все кнопки после покупки
this.allowedPvoButtons.clear();
this.disableAllPvoButtons();
if (typeof window.__tutorialPvoLock === "function") {
  window.__tutorialPvoLock();
}

// Очищаем ограничение на размещение
window.__tutorialClearPlacementArea();

      // Блокуємо F-16 після покупки
this.allowedPvoButtons.clear();
this.disableAllPvoButtons();
if (typeof window.__tutorialPvoLock === "function") {
  window.__tutorialPvoLock();
}

      // Крок 33a: Натисни на F-16
      this.ui.clearHighlights();
      
      if (f16 && f16.marker) {
        this.ui.highlight(f16.marker.getElement());
      }

      this.ui.showMessage(
        `<strong>${t('moveSelectTitle')}</strong><br><br>
        ${t('moveSelectText')}`
      );
      this.ui.hideButton();

      // Чекаємо поки гравець натисне на F-16
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof selectedPVO !== "undefined" && selectedPVO === f16) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      // Крок 33b: Тепер переміщення
      this.ui.clearHighlights();
      
      const targetPos = [
        (TUTORIAL_COORDS.secondTarget[0] + TUTORIAL_COORDS.kreiserPos[0]) / 2,
        (TUTORIAL_COORDS.secondTarget[1] + TUTORIAL_COORDS.kreiserPos[1]) / 2
      ];
      const moveMarker = this.showPlacementMarker(targetPos);
      this.ui.highlightFrame("#pvoMenu");

      this.ui.showMessage(
        `<strong>${t('moveOrderTitle')}</strong><br><br>
        ${t('moveOrderText')}`
      );
      this.ui.hideButton();

      // Постійно розблоковуємо кнопку переміщення
      const unlockMoveButton = setInterval(() => {
        const moveButton = document.getElementById("movePVOButton");
        if (moveButton && !f16.isMovingToTarget) {
          moveButton.classList.remove(DISABLED_CLASS);
          moveButton.classList.remove("tutorial-disabled");
          moveButton.disabled = false;
        }
      }, 100);

      // Чекаємо початку переміщення
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (f16 && f16.isMovingToTarget) {
            clearInterval(checkInterval);
            clearInterval(unlockMoveButton);
            resolve();
          }
        }, 100);
      });

      // Крок 33c: Очікування прильоту
      this.ui.clearHighlights();
      if (moveMarker) {
        try { map.removeLayer(moveMarker); } catch(e) {}
      }

      this.ui.showMessage(
        `<strong>${t('moveWaitTitle')}</strong><br><br>
        ${t('moveWaitText')}`
      );
      this.ui.hideButton();

      // Чекаємо завершення переміщення
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (f16 && !f16.isMovingToTarget) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      // Блокуємо кнопку переміщення після виконання
      const moveButtonAfter = document.getElementById("movePVOButton");
      if (moveButtonAfter) {
        moveButtonAfter.classList.add(DISABLED_CLASS);
        moveButtonAfter.classList.add("tutorial-disabled");
        moveButtonAfter.disabled = true;
      }

      // Крок 34: Пояснення про переміщення
      this.ui.showMessage(
        `<strong>${t('moveSuccessTitle')}</strong><br><br>
        ${t('moveSuccessText')}`,
        t('btnNextStage')
      );
      await this.ui.waitForNext();

      // Прибираємо підсвітку F-16 після пояснення про переміщення
      this.ui.clearHighlights();

      // Крок 35: Залп калібрів
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      // Запускаємо 6 калібрів
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (secondTarget) {
            this.spawnKalibr(TUTORIAL_COORDS.kreiserPos, [secondTarget.lat, secondTarget.lng]);
          }
        }, i * 1500);
      }

      this.ui.showMessage(
        `<strong>${t('kalibrSalvoTitle')}</strong><br><br>
        ${t('kalibrSalvoText')}`
      );
      this.ui.hideButton();

      await this.waitForAllEnemiesDestroyed();

      // Крок 36: Успіх
      if (typeof setGameSpeed === "function") setGameSpeed(1);
      this.ui.showMessage(
        `<strong>${t('kalibrSuccessTitle')}</strong><br><br>
        ${t('kalibrSuccessText')}`
      );
      await this.ui.waitForNext();

      // Крок 37: Атака крейсера
      this.ui.clearHighlights();
      
      if (f16 && f16.marker) {
        this.ui.highlight(f16.marker.getElement());
      }


      this.ui.showMessage(
        `<strong>${t('attackCruiserTitle')}</strong><br><br>
        ${t('attackCruiserText')}`
      );
      this.ui.hideButton();

      // Постійно розблоковуємо кнопку атаки поки гравець не почне атаку
      const unlockAttackButton = setInterval(() => {
        const attackButton = document.getElementById("attackKreiserButton");
        if (attackButton && f16 && f16.aircraftState !== "attackRun") {
          attackButton.classList.remove(DISABLED_CLASS);
          attackButton.classList.remove("tutorial-disabled");
          attackButton.disabled = false;
        }
      }, 100);

      // Чекаємо початку атаки
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (f16 && f16.aircraftState === "attackRun") {
            clearInterval(checkInterval);
            resolve();
            
            clearInterval(unlockAttackButton);

          }
        }, 100);
      });

// Прибираємо підсвітку літака після початку атаки
      this.ui.clearHighlights();

      if (typeof setGameSpeed === "function") setGameSpeed(1);

      // Чекаємо знищення крейсера (БЕЗ слідкування за літаком)
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (typeof kreiser === "undefined" || !kreiser || !kreiser.alive) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });

      // Крок 38: Повернення F-16
      if (typeof setGameSpeed === "function") setGameSpeed(1);

      this.ui.showMessage(
        `<strong>${t('cruiserDestroyedTitle')}</strong><br><br>
        ${t('cruiserDestroyedText')}`
      );
      await this.ui.waitForNext();

      this.ui.showMessage(
        `<strong>${t('congratsTitle')}</strong><br><br>
        ${t('congratsText')}`
      );
      await this.ui.waitForNext();

      // Крок 39: Довідка
      this.ui.showMessage(
        `<strong>${t('helpTitle')}</strong><br><br>
        ${t('helpText')}`
      );
      await this.ui.waitForNext();

      // Крок 40: Завершення
      this.ui.showMessage(
        `<strong>${t('endTitle')}</strong><br><br>
        ${t('endText')}`,
        t('btnGloryToHeroes'),
        "exit-style"
      );
      await this.ui.waitForNext();

      // Завершення туторіалу
      this.cleanup();
      location.reload();
    }

cleanup() {
  // Очищаємо трасери
  this.trajectories.forEach(t => {
    try { if (t) map.removeLayer(t); } catch(e) {}
  });
  
  // Відновлюємо обробники карти
  if (typeof map !== "undefined" && map) {
    map.off('click');
  }
  
  // Очищуємо UI
  this.ui.destroy();
  
  // Скидаємо прапорець
  if (typeof window.tutorialModeActive !== "undefined") {
    window.tutorialModeActive = false;
  }
    }
  }

  // Експорт функції запуску
  window.startTutorial = function() {
  const manager = new TutorialManager();
  window.__tutorialManager = manager;
  // [TUTORIAL GUARD] Глобальні утиліти контролю зони дозволеного розміщення ППО
window.__tutorialIsPlacementLocked = true; // під час туторіалу — так
let __placementArea = null; // {minLat,maxLat,minLng,maxLng}

window.__tutorialSetPlacementArea = function (centerLat, centerLng, sizePx = 120) {
  const half = Math.max(20, sizePx / 2);
  __placementArea = {
    minLat: centerLat - half,
    maxLat: centerLat + half,
    minLng: centerLng - half,
    maxLng: centerLng + half
  };
};

window.__tutorialClearPlacementArea = function () { __placementArea = null; };

window.__tutorialAllowPlacementAt = function (lat, lng) {
  if (!window.tutorialModeActive || !window.__tutorialIsPlacementLocked) return true;
  if (!__placementArea) return false; // доки не показали квадратик — ніде не дозволено
  return (
    lat >= __placementArea.minLat &&
    lat <= __placementArea.maxLat &&
    lng >= __placementArea.minLng &&
    lng <= __placementArea.maxLng
  );
};

window.__tutorialShowDenyCross = function(lat, lng) {
  if (!window.map || typeof window.L === "undefined" || typeof window.map.addLayer !== "function") {
    console.warn("[Tutorial] Карта не ініціалізована або недоступна для __tutorialShowDenyCross");
    return;
  }
  
  try {
    const marker = window.L.marker([lat, lng], {
      icon: window.L.divIcon({
        className: "tutorial-deny",
        html: `<svg width="26" height="26" viewBox="0 0 26 26" style="filter:drop-shadow(0 0 3px rgba(0,0,0,.6))">
                 <circle cx="13" cy="13" r="12" fill="#e74c3c" stroke="#fff" stroke-width="2"/>
                 <line x1="8" y1="8" x2="18" y2="18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
                 <line x1="18" y1="8" x2="8" y2="18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
               </svg>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        className: ''
      })
    }).addTo(window.map);
    setTimeout(() => { 
      try { 
        if (window.map && window.map.hasLayer(marker)) {
          window.map.removeLayer(marker); 
        }
      } catch(e) {
        console.warn("[Tutorial] Помилка при видаленні deny cross:", e);
      }
    }, 800);
  } catch(e) {
    console.warn("[Tutorial] Не вдалося показати deny cross:", e);
  }
};


  window.__tutorialPvoLock = function() {
    const pvoMenu = document.getElementById("pvoMenu");
    if (!pvoMenu) return;
    const items = Array.from(pvoMenu.querySelectorAll(".pvo-item, .pvo-button"));
    items.forEach(item => item.classList.add("tutorial-disabled"));
    if (window.__tutorialManager && window.__tutorialManager.allowedPvoButtons) {
      window.__tutorialManager.allowedPvoButtons.forEach(name => {
        items.forEach(item => {
          const label = item.querySelector("b")?.textContent || item.textContent || "";
          if (label.includes(name)) item.classList.remove("tutorial-disabled");
        });
      });
    }
  };
  manager.start();
};


})();