//if (location.hostname !== "dronefall.online" && location.hostname !== "www.dronefall.online") { window.location.href = "https://dronefall.online"; }

// ===== QUEST KILL TRACKER =====
window.trackQuestKill = function(enemyType) {
  if (!window.rankedMode) return;
  const typeMap = { 'shahed': 'shaheds', 'heavy': 'heavy_drones', 'rocket': 'rockets', 'kalibr': 'kalibrs' };
  const dbType = typeMap[enemyType];
  if (!dbType) return;
  const fd = new FormData();
  fd.append('enemy_type', dbType);
  fd.append('count', 1);
  fetch('update_quest_progress.php', { method: 'POST', body: fd }).catch(() => {});
};
// ===== END QUEST KILL TRACKER =====

let money = 3550;
let rightOnlyMode = false;
let hardcoreMode = false;
let radarMode = false;
let sandboxMode = false;
let tutorialMode = false;
let rankedMode = false;
window.rankedMode = false; // Для ranked-mode.js
let selectedPVO = null;
let selectedTarget = null;
let selectedAirport = null;
let nearestAirport = null;
let minDistAirport = Infinity;
let buyingMode = false;
let gameOver = false;
let gameWon = false;
let score = 0;
let movingPVO = null;
let moveMode = false;
let currentWave = 0;
let isWaveInProgress = false;
const PIXEL_TO_METERS = 1;
let MAX_PVO_COUNT = 20;
const TEMP_DEBUG_PVO_COUNTER = true; // Тимчасовий лічильник ППО для перевірки видалення
let allDefensePoints = [];
let kalibrs = [];
let isSoundOn = true;
let gameSpeed = 1;
let lastSpeedChangeTime = 1;
let accumulatedGameTime = 0;
let lastFrameTime = performance.now();
let isPaused = false;
let previousSpeed = 1;
let hudMenuOutsideListenerAttached = false;

// ========================================
// ВІЗУАЛЬНА ІНДИКАЦІЯ ЦІЛЕЙ
// ========================================

/**
 * Оновлює червоні іконки цілей на ворогах
 * Показує яку ціль атакує кожне ППО/літак
 */
function updateTargetIcons() {
  // Збираємо всі цілі, які атакуються
  const targetedEnemies = new Set();
  
  pvoList.forEach(pvo => {
    if (!pvo || pvo.hidden || !pvo.latlng) return;
    if (pvo.reb || pvo.radar) return; // РЕБ і радари не атакують
    
    // Для літаків
    if (pvo.isPlane && pvo.planeTarget && pvo.planeTarget.hp > 0 && pvo.planeTarget.marker) {
      targetedEnemies.add(pvo.planeTarget);
    }
    
    // Для звичайних ППО - підтримка масиву цілей (dual target)
    if (!pvo.isPlane && pvo.currentTargets) {
      pvo.currentTargets.forEach(target => {
        if (target && target.hp > 0 && target.marker) {
          targetedEnemies.add(target);
        }
      });
    }
  });
  
  // Функція для оновлення іконки
  const updateIcon = (enemy) => {
    if (!enemy || !enemy.marker) return;
    const el = enemy.marker.getElement();
    if (!el) return;
    
    let icon = el.querySelector('.target-icon');
    if (targetedEnemies.has(enemy)) {
      if (!icon) {
        icon = document.createElement('div');
        icon.className = 'target-icon';
        icon.innerHTML = '<i class="fas fa-crosshairs"></i>';
        icon.style.position = 'absolute';
        icon.style.top = '50%';
        icon.style.left = '50%';
        icon.style.transform = 'translate(-50%, -50%)';
        icon.style.fontSize = '15px';
        icon.style.color = '#ff0000';
        icon.style.zIndex = '9999';
        icon.style.pointerEvents = 'none';
        icon.style.textShadow = '0 0 4px #000, 0 0 4px #000';
        icon.style.lineHeight = '1';
        el.appendChild(icon);
      }
    } else if (icon) {
      icon.remove();
    }
  };
  
  // Оновлюємо всі дрони
  drones.forEach(updateIcon);
  
  // Оновлюємо ракети
  rockets.forEach(updateIcon);
  
  // Оновлюємо калібри
  kalibrs.forEach(updateIcon);
}
const PLANE_FUEL_COSTS = { // 7. Вартість переміщення літаків
  "Су-27": 2,
  "МіГ-29": 4,
  "F-16": 6
};

// ========================================
// КОНФІГУРАЦІЯ ЛІТАКІВ
// ========================================
const PLANE_CONFIG = {
  "F-16": {
    patrolSpeed: 0.6,
    chaseSpeed: 1.2,
    lockOnTime: 1000,        // 1 секунда
    turnSpeed: 0.03,
    attackRange: 300         // = радіус виявлення
  },
  "Су-27": {
    patrolSpeed: 0.5,
    chaseSpeed: 1.0,
    lockOnTime: 1500,        // 1.5 секунди
    turnSpeed: 0.025,
    attackRange: 260         // = радіус виявлення
  },
  "МіГ-29": {
    patrolSpeed: 0.5,
    chaseSpeed: 0.9,
    lockOnTime: 2000,        // 2 секунди
    turnSpeed: 0.02,
    attackRange: 220         // = радіус виявлення
  }
};

const chestBtn = document.getElementById("chestBtn");
if (chestBtn) {
  chestBtn.onclick = () => window.location.href = 'chest.html';
}

const KALIBR_CONFIG = {
  speed: (1.2 + Math.random() * 1.8) + currentWave * 0.01, // трохи швидше за стандартну ракету (2. Калібр)
  hp: 20 + currentWave * 16
};

const MISSILE_CATALOG = {
  rocket1: { img: "assets/rocket1.png", speed: 1.0, hp: 15, damage: 100, isKalibr: false, iconSize: [20, 5], iconAnchor: [10, 2.5] },
  kalibr: { img: "assets/kalibr.png", speed: KALIBR_CONFIG.speed, hp: KALIBR_CONFIG.hp, damage: 150, isKalibr: true, iconSize: [30, 8], iconAnchor: [15, 4] } // 2. Калібр. Збільшений розмір
};

function spawnRocket(startLat, startLng, targetLat, targetLng, targetObject = null) {
  const marker = L.marker([startLat, startLng], {
    icon: L.divIcon({
      className: "rotating-icon",
      html: `<img src="${MISSILE_CATALOG.rocket1.img}" width="40" height="40" />`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
  }).addTo(map);
  marker.setOpacity(radarMode ? 0 : 1);

  rockets.push({
    position: [startLat, startLng],
    target: [targetLat, targetLng],
    marker,
    speed: MISSILE_CATALOG.rocket1.speed,
    hp: MISSILE_CATALOG.rocket1.hp,
    visible: !radarMode
  });
  // Додаємо обробник кліку
}

function spawnKalibr(startLat, startLng, targetLat, targetLng, targetObject = null) {
  // випадкове відхилення до 50 px навколо точки спавну
  const offset = getRandomOffsetCoords(startLat, startLng, 50);
  const marker = L.marker([offset.lat, offset.lng], {
    icon: L.divIcon({
      className: "rotating-icon",
      html: `<img src="${MISSILE_CATALOG.kalibr.img}" width="40" height="40" />`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
  }).addTo(map);
  marker.setOpacity(radarMode ? 0 : 1);

  kalibrs.push({
    position: [offset.lat, offset.lng],
    target: [targetLat, targetLng],
    marker,
    speed: MISSILE_CATALOG.kalibr.speed,
    hp: MISSILE_CATALOG.kalibr.hp,
    damage: 25 + Math.floor(Math.random() * 21), // 25–45 по будівлях
    visible: !radarMode
  });
  // Додаємо обробник кліку
}



const KREISER_CONFIG = {
  startWave: 12,  // 5. Перший залп на 12 хвилі
  salvoIntervalWaves: 2, // 6. Кожен наступний залп — через 2 хвилі
  salvoStructure: [ 
    { type: 'kalibr', count: 2, interval: 1500 },
    { type: 'kalibr', count: 2, interval: 1600 },
    { type: 'kalibr', count: 2, interval: 1400 },
  ],
  hp: 100, // 1.1. Крейсер має hp bar 100
  spawnCoords: [300, 4250] // координата
};

// --- Налаштування атаки літаками по крейсеру ---
const ATTACK_CRUISER_COST = { fuel: 10, power: 25 };

// --- Конфіг фламінго (окремий тип ракет) ---
const FLAMINGO_CONFIG = {
  img: "assets/flamingo.png",
  speed: 2.5,
  damageMin: 20,
  damageMax: 35,
  scatterRadius: 20,      // спавнимо в радіусі 20 від літака
  launches: 4,            // усього 4 шт
  intervalMs: 1400,       // між пусками
  startDistance: 850,     // за 650 пікселів до крейсера почати пуски
  turnAwayDistance: 190   // за 200 пікселів — розворот на аеродром
};

// --- ППО крейсера ---
const KREISER_AA_CONFIG = {
  radius: 350,
  color: "#000",
  cdMs: 800,
  hitChance: 0.35
};

// Массив фламінго
let flamingos = [];


let kreiser = null; // 1. Глобальний об'єкт крейсера
let kreiserNextSalvoWave = KREISER_CONFIG.startWave; // Наступна хвиля для залпу

let airports = []; // Массив для хранения аэропортов
// Чи існує активна Аварійка на мапі
let avariikaActive = false;
// ---- Ремонт (Аварійка) ----
let repairState = null;  // { target, carMarker, phase: 'toTarget'|'repair'|'return', lastHpProbe, lastTick, carPos:[lat,lng], speed:1.0, avariika:{lat,lng}, cost:{money, bricks, power, fuel, distPxRounded10, fuelUnits}, hpToHeal }
function roundTo10(v){ return Math.round(v/10)*10; }           // 554 -> 550, 555 -> 560
function ceilTo100(v){ return Math.ceil(v/100)*100; }           // 203 -> 300 (для пояснень), а для пального беремо Math.ceil(v/100)
const REPAIR_CONFIG = {
  carSpeed: 0.85,              // швидкість авто аварійки (px/кадр умовно, множиться на gameSpeed)
  hpPerSec: 0.5,                // 1 HP/сек відновлення
  perHp: {                    // вартість за кожен відремонтований 1 HP
    money: 10,
    bricks: 2,
    power: 1
  },
  perDistance: {              // вартість за відстань між Аварійкою та ціллю
    moneyPer10px: 1,          // кожні 10 px -> 1 карбованець (відстань округляється до 10)
    fuelPer100px: 1           // кожні 100 px -> 1 бензин (заокруглення вгору за прикладом 203 px => 3)
  },
  ui: {
    woundedMsg: "Аварійна бригада потрапила під обстріл! Ремонт скасовано!",
  }
};
let nextTargetRegion = null; // Переменная для хранения выбранной области для следующей цели
let usedSpawnPoints = []; // Список использованных координат для целей
let isAirportSpawning = false; // Флаг, показывающий, что аэропорт в процессе спавна
let airportSpawnTimeout = null; // Для хранения таймера спавна
let progressBarMarker = null; // Для хранения маркера прогресс-бара
let fps = 0;
let frameCount = 0;
let fpsLastTime = performance.now();
let fpsDisplay = null; // Для хранения элемента отображения FPS
let frameCounter = 0; // Лічильник кадрів для оптимізації
const FIXED_TOTAL_ENEMIES = 100; // Общее количество врагов начиная с currentWave = 18
const INITIAL_LIGHT_DRONES = 70; // Начальное количество лёгких дронов на currentWave = 18
const INITIAL_HEAVY_DRONES = 10; // Начальное количество тяжёлых дронов на currentWave = 18
const INITIAL_ROCKETS = 20; // Начальное количество ракет на currentWave = 18
const LIGHT_DRONE_DECREMENT = 2; // Уменьшение лёгких дронов за волну
const HEAVY_DRONE_INCREMENT = 1; // Увеличение тяжёлых дронов за волну
const ROCKET_INCREMENT = 1; // Увеличение ракет за волну
const HEAVY_DRONE_DECREMENT = 2; // Уменьшение тяжёлых дронов за волну (когда лёгкие дроны = 0)
const ROCKET_INCREMENT_NO_LIGHT = 2; // Увеличение ракет за волну (когда лёгкие дроны = 0)

const regionSpawnPoints = {
  "Рівненській": [[2332, 1100], [2020, 815]],
  "Житомирській": [[1915, 1360], [2105, 1550]],
  "Київській": [[2030, 1875], [2240, 1760], [1740, 1780]],
  "Чернігівській": [[2400, 2200], [2050, 2300]],
  "Запорізькій": [[940, 2890]],
  "Кримській": [[460, 2400]],
  "Львівській": [[1920, 655], [1600, 320]],
  "Закарпатській": [[1440, 220]],
  "Івано-Франківській": [[1400, 635]],
  "Чернівецькій": [[1260, 910]],
  "Тернопільській": [[1600, 845], [1900, 870]],
  "Хмельницькій": [[1710, 1200], [1460, 1025]],
  "Вінницькій": [[1330, 1630], [1584, 1460]],
  "Кіровоградській": [[1450, 2400], [1240, 2240], [1365, 1800]],
  "Миколаївській": [[840, 2100], [1115, 2310], [1180, 2000]],
  "Херсонській": [[770, 2320], [1050, 2535]],
  "Донецькій": [[1370, 3255]],
  "Харківській": [[1690, 3005]],
  "Полтавській": [[1680, 2625], [1955, 2360]],
  "Сумській": [[2145, 2515]],
  "Черкаській": [[1560, 1800], [1650, 2060], [1830, 2205]],
  "Одеській": [[555, 1565], [1045, 1800]],
  "Дніпропетровській": [[1220, 2590], [1400, 2635], [1505, 2865], [1335, 3095]]
};
const waveSchedule = [5, 15, 30, 50, 75, 105, 145, ...Array.from({ length: 999 }, (_, i) => 195 + i * 50)];
const assetsToLoad = [
  "assets/map.png",
  "assets/drone.png",
  "assets/rocket1.png",
  "assets/heavy-drone.png",
  "assets/kulemet.png",
  "assets/madt.png",
  "assets/2k12kub.png",
  "assets/crotale90m.png",
  "assets/iristsml.png",
  "assets/patriot.png",
  "assets/reb.png",
  "assets/radar.png",
  "assets/f16.png",
  "assets/su27.png",
  "assets/mig29.png",
  "assets/tet.png",
  "assets/kilchen.png",
  "assets/explosion.gif",
  "assets/nuke.png",
  "assets/aeroport.png",
  "assets/gas.png",
  "assets/avariika.png",
  "assets/avariikacar1.png",
  "assets/avariikacar2.png",
  "assets/kreiser.png",
  "assets/kalibr.png",
  "assets/flamingo.png",
  "assets/kreiserdamage.png",
  "assets/kulemetrocket.png",
  "assets/madtrocket.png",
  "assets/2k12kubrocket.png",
  "assets/iristsmlrocket.png",
  "assets/kilchenrocket.png",
  "assets/patriotrocket.png",
  "assets/crotale90mrocket.png",
  "assets/planerocket.png",
];

const preMenu = document.getElementById("preMenu");
const startTutorialBtn = document.getElementById("tutorialBtn");
const startBtn = document.getElementById("startBtn");
const startRightBtn = document.getElementById("startRightBtn");
const startHardcoreBtn = document.getElementById("startHardcoreBtn");
const startRadarBtn = document.getElementById("startRadarBtn");
const startSandboxBtn = document.getElementById("startSandboxBtn");
const startRankedBtn = document.getElementById("startRankedBtn");
const modeButtons = [startTutorialBtn, startBtn, startRightBtn, startHardcoreBtn, startRadarBtn, startSandboxBtn, startRankedBtn].filter(Boolean);
let currentLoadingButton = null;
let loadingFillEl = null;
let loadingPercentEl = null;
let loadingDisplayedPercent = 0;
let loadingTargetPercent = 0;
let loadingIntervalId = null;
let loadingStartTime = 0;
let latestReportedPercent = 0;
const MIN_LOADING_DURATION_MS = 2600;
const PROGRESS_0_95_DURATION_MS = 1500;
let pvoMenu = document.getElementById("pvoMenu");
let waveDisplay = document.getElementById("waveDisplay");
let scoreDisplay = document.getElementById("scoreDisplay");
let moneyDisplay = document.getElementById("money");
let pvoCounterDisplay = document.getElementById("pvoCounterDisplay");
fpsDisplay = document.getElementById("fpsDisplay");
let targetNotificationEl = document.getElementById("targetNotification");
let hudNotificationHideTimeout = null;
const alarmIndicator = document.getElementById("alarmIndicator");
const alarmSound = document.getElementById("alarmSound");
const hudTop = document.getElementById("hudTop");
const hudMenuWrapper = document.getElementById("hudMenuWrapper");
const hudMenuToggle = document.getElementById("hudMenuToggle");
const hudMenu = document.getElementById("hudMenu");
const pauseButtonEl = document.getElementById("pauseButton");
const speedCycleButton = document.getElementById("speedCycleButton");
const soundToggleButton = document.getElementById("soundToggleButton");
const exitButton = document.getElementById("exitButton");
const exitConfirm = document.getElementById("exitConfirm");
const exitLeaveButton = document.getElementById("exitLeaveButton");
const exitStayButton = document.getElementById("exitStayButton");

function showHudNotification(message, type = "info") {
  const el = document.getElementById("targetNotification");
  if (!el) return;

  // скидаємо стани
  el.classList.remove("alert", "info", "show", "hide");
  el.textContent = message;
  el.classList.add(type === "alert" ? "alert" : "info", "show");

  // автозакриття через 4с
  clearTimeout(hudNotificationHideTimeout);
  hudNotificationHideTimeout = setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hide");
    // прибрати текст після анімації сховання
    setTimeout(() => {
      el.classList.remove("hide");
      el.textContent = "";
    }, 350);
  }, 4000);
}

function setGameSpeed(speed) {
  const oldSpeed = gameSpeed;
  gameSpeed = speed;

  if (speed > 0) {
    previousSpeed = speed;
  }

  const pausedNow = speed === 0;
  isPaused = pausedNow;
  renderPauseButton(pausedNow);
  renderSpeedButton(pausedNow ? (previousSpeed || 1) : speed, pausedNow);

  const now = performance.now();
  const elapsedSinceLastChange = oldSpeed === 0 ? 0 : (now - lastSpeedChangeTime) / 1000 / oldSpeed;
  lastSpeedChangeTime = now - (elapsedSinceLastChange * 1000 * gameSpeed);
}

function renderPauseButton(paused) {
  const button = document.getElementById("pauseButton");
  if (!button) return;
  const icon = paused ? 'fa-play' : 'fa-pause';
  const label = paused ? (typeof translate === 'function' ? translate('resume', 'game') : 'Продовжити') : (typeof translate === 'function' ? translate('pause', 'game') : 'Пауза');
  button.innerHTML = `<i class="fa ${icon}" aria-hidden="true"></i><span class="hud-sr-only">${label}</span>`;
}

function renderSpeedButton(speedValue, isPausedNow) {
  const button = document.getElementById("speedCycleButton");
  if (!button) return;
  const showTop = speedValue === 1 || speedValue === 2;
  const showBottom = speedValue === 2 || speedValue === 3;
  button.dataset.speed = String(speedValue);
  button.classList.toggle('paused', !!isPausedNow);
  const topIcon = showTop ? '<i class="fa fa-caret-up" aria-hidden="true"></i>' : '';
  const bottomIcon = showBottom ? '<i class="fa fa-caret-up" aria-hidden="true"></i>' : '';
  button.innerHTML = `
    <span class="hud-speed-icon hud-speed-icon-top">${topIcon}</span>
    <span class="hud-speed-value">${speedValue}x</span>
    <span class="hud-speed-icon hud-speed-icon-bottom">${bottomIcon}</span>
    <span class="hud-sr-only">آ褪³񲼠㰨 ${speedValue}x</span>
  `;
}

// ПІСЛЯ ЯКОГО РЯДКА ВСТАВЛЯЮ:
// let targetNotificationEl = document.getElementById("targetNotification");

function showHudNotification(message, style = "info", durationMs = 4000) {
  try {
    if (!targetNotificationEl) {
      targetNotificationEl = document.getElementById("targetNotification");
    }
    if (!targetNotificationEl) return;

    // Варіант з легким перефарбуванням під "alert", але без важких стилів
    targetNotificationEl.style.color = (style === "alert") ? "#ffd0d0" : "#ffe8a3";
    targetNotificationEl.style.borderColor = (style === "alert")
      ? "rgba(255,120,120,0.35)"
      : "rgba(255, 218, 106, 0.28)";
    targetNotificationEl.style.textShadow = (style === "alert")
      ? "0 0 6px rgba(255, 60, 60, 0.55)"
      : "0 0 6px rgba(255, 185, 61, 0.55)";

    targetNotificationEl.textContent = message;
    targetNotificationEl.classList.add("visible");

    if (window.hudNotificationHideTimeout) {
      clearTimeout(window.hudNotificationHideTimeout);
    }
    window.hudNotificationHideTimeout = setTimeout(() => {
      targetNotificationEl.classList.remove("visible");
    }, durationMs);
  } catch (e) {
    console.error("HUD notice error:", e);
  }
}


function renderSoundButton() {
  const button = document.getElementById("soundToggleButton");
  if (!button) return;
  const icon = isSoundOn ? 'fa-volume-up' : 'fa-volume-xmark';
  const label = isSoundOn ? 'Звук увімкнено' : 'Звук вимкнено';
  button.innerHTML = `<i class="fa ${icon}" aria-hidden="true"></i><span class="hud-sr-only">${label}</span>`;
}




function setHudMenuState(isOpen) {
  if (!hudMenuWrapper || !hudMenuToggle) return;
  hudMenuWrapper.classList.toggle('open', !!isOpen);
  hudMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}


function prepareModeButtonForLoading(button) {
  if (!button) return;
  if (!button.dataset.originalContent) {
    button.dataset.originalContent = button.innerHTML;
  }
  button.classList.add("mode-button-loading");
  button.innerHTML = `
    <div class="mode-progress-track">
      <div class="mode-progress-fill"></div>
    </div>
    <div class="mode-progress-label">${typeof translate === 'function' ? translate('loading', 'game') : 'Завантаження...'}<br><span class="mode-progress-percent">0%</span></div>
  `;
  loadingFillEl = button.querySelector(".mode-progress-fill");
  loadingPercentEl = button.querySelector(".mode-progress-percent");
  if (loadingFillEl) loadingFillEl.style.width = "0%";
  if (loadingPercentEl) loadingPercentEl.textContent = "0%";
}

function resetLoadingState() {
  if (currentLoadingButton) {
    const originalContent = currentLoadingButton.dataset.originalContent;
    if (typeof originalContent === "string") {
      currentLoadingButton.innerHTML = originalContent;
    }
    currentLoadingButton.classList.remove("mode-button-loading");
  }
  currentLoadingButton = null;
  loadingFillEl = null;
  loadingPercentEl = null;
  loadingDisplayedPercent = 0;
  loadingTargetPercent = 0;
  if (loadingIntervalId) {
    clearInterval(loadingIntervalId);
    loadingIntervalId = null;
  }
  latestReportedPercent = 0;
}

function setLoadingTarget(percent) {
  if (!loadingFillEl) return;
  const sanitizedPercent = Math.max(0, Math.min(100, Number(percent) || 0));
  latestReportedPercent = Math.max(latestReportedPercent, sanitizedPercent);
  let clamped = sanitizedPercent;
  const timeCap = getTimeBasedCap();
  if (clamped < 100 && clamped <= 95 && PROGRESS_0_95_DURATION_MS > 0) {
    clamped = Math.min(clamped, timeCap);
  }
  loadingTargetPercent = Math.max(loadingTargetPercent, clamped);
  loadingTargetPercent = Math.max(0, Math.min(100, loadingTargetPercent));
  if (!loadingIntervalId) {
    loadingIntervalId = setInterval(stepLoadingProgress, 30);
  }
}

function getTimeBasedCap() {
  if (PROGRESS_0_95_DURATION_MS <= 0) return 95;
  const elapsed = Math.max(0, performance.now() - loadingStartTime);
  const progress = (elapsed / PROGRESS_0_95_DURATION_MS) * 95;
  return Math.min(95, progress);
}

function stepLoadingProgress() {
  if (!loadingFillEl) {
    clearInterval(loadingIntervalId);
    loadingIntervalId = null;
    return;
  }

  if (latestReportedPercent > loadingTargetPercent && loadingTargetPercent < 95) {
    const timeCap = getTimeBasedCap();
    const desired = Math.min(latestReportedPercent, timeCap);
    if (desired > loadingTargetPercent) {
      loadingTargetPercent = desired;
      loadingTargetPercent = Math.max(0, Math.min(100, loadingTargetPercent));
    }
  }

  if (loadingDisplayedPercent < loadingTargetPercent) {
    const diff = loadingTargetPercent - loadingDisplayedPercent;
    const increment = Math.max(1, Math.ceil(diff / 4));
    loadingDisplayedPercent = Math.min(loadingTargetPercent, loadingDisplayedPercent + increment);
    loadingDisplayedPercent = Math.max(0, Math.min(100, loadingDisplayedPercent));
    loadingFillEl.style.width = `${loadingDisplayedPercent}%`;
    if (loadingPercentEl) {
      const displayPercent = Math.max(0, Math.min(100, Math.round(loadingDisplayedPercent)));
      loadingPercentEl.textContent = `${displayPercent}%`;
    }
  } else if (loadingTargetPercent >= 100 && loadingDisplayedPercent >= 100) {
    clearInterval(loadingIntervalId);
    loadingIntervalId = null;
  }
}

function waitForLoadingCompletion(callback) {
  const check = () => {
    if (loadingDisplayedPercent >= 100) {
      callback();
    } else {
      requestAnimationFrame(check);
    }
  };
  check();
}

// Додаємо функції для оновлення ресурсів

function updateBricksDisplay(bricks) {
  const bricksDisplay = document.getElementById("bricksDisplay");
  if (bricksDisplay) bricksDisplay.textContent = Math.round(bricks);
}
function updatePowerDisplay(power) {

  const powerDisplay = document.getElementById("powerDisplay");
  if (powerDisplay) powerDisplay.textContent = Math.round(power);
}
function updateFuelDisplay() {

  const fuelDisplay = document.getElementById("fuelDisplay");
  if (fuelDisplay) fuelDisplay.textContent = Math.round(fuel);
}

function buildControlPanel() {
  const hudPanel = document.getElementById("hudPanel");
  if (!hudPanel) return;

  const moneyValue = Number.isNaN(money) ? '?' : Math.round(money);
  const bricksValue = typeof bricks !== 'undefined' ? bricks : 0;
  const powerValue = typeof power !== 'undefined' ? power : 0;
  const fuelValue = typeof fuel !== 'undefined' ? fuel : 0;
  const debugBlock = TEMP_DEBUG_PVO_COUNTER ? `

  ` : '';

  hudPanel.innerHTML = `
    <div class="hud-section hud-money">
      <div class="hud-money-icon"><i class="fas fa-coins" style="color:#FFD700"></i></div>
      <div id="money" class="hud-money-value">${moneyValue}</div>
    </div>
    <div class="hud-divider"></div>
    <div class="hud-section hud-resources">
      <div class="hud-line"><span class="hud-label"><i class="fas fa-bolt" style="color:#FFD700"></i></span><span id="powerDisplay">${powerValue}</span></div>
      <div class="hud-line"><span class="hud-label"><i class="fas fa-gas-pump" style="color:#FF4444"></i></span><span id="fuelDisplay">${fuelValue}</span></div>
      <div class="hud-line"><span class="hud-label"><i class="fas fa-cubes" style="color:#FF9800"></i></span><span id="bricksDisplay">${bricksValue}</span></div>
    </div>
    <div class="hud-divider"></div>
    <div class="hud-section hud-stats">
      <div class="hud-line"><span class="hud-label"><i class="fas fa-crosshairs" style="color:#ff4444"></i></span><span id="scoreDisplay">${score}</span></div>
      <div class="hud-line"><span class="hud-label"><i class="fas fa-flag" style="color:#2196F3"></i></span><span id="waveDisplay">${currentWave}</span></div>
    </div>
    ${debugBlock}
  `;

  if (hudTop) hudTop.classList.add("hud-visible");
  setHudMenuState(false);
  const csBar = document.getElementById('cs-hud-bar');
  if (csBar) csBar.classList.add('hud-visible');
}







function preloadImages(assetList, onProgress, onComplete) {
  let loaded = 0;
  assetList.forEach(src => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      onProgress(Math.floor((loaded / assetList.length) * 100));
      if (loaded === assetList.length) onComplete();
    };
    img.onerror = () => {
      console.warn(`Failed to load asset: ${src}`);
      loaded++;
      onProgress(Math.floor((loaded / assetList.length) * 100));
      if (loaded === assetList.length) onComplete();
    };
    img.src = src;
  });
}

if (startTutorialBtn) {
  startTutorialBtn.innerHTML = `<i class="fas fa-graduation-cap" style="color:#9C27B0"></i><br>${typeof translate === 'function' ? translate('tutorial', 'game') : 'Туторіал'}`;
  startTutorialBtn.onclick = () => {
    tutorialMode = true;
    rightOnlyMode = false;
    hardcoreMode = false;
    radarMode = false;
    sandboxMode = false;
    launchGame(startTutorialBtn);
  };
}

startBtn.onclick = () => { tutorialMode = false; rightOnlyMode = false; hardcoreMode = false; radarMode = false; sandboxMode = false; launchGame(startBtn); };
startRightBtn.onclick = () => { tutorialMode = false; rightOnlyMode = true; hardcoreMode = false; radarMode = false; sandboxMode = false; launchGame(startRightBtn); };

startHardcoreBtn.onclick = () => { tutorialMode = false; rightOnlyMode = false; hardcoreMode = true; radarMode = false; sandboxMode = false; launchGame(startHardcoreBtn); };
startRadarBtn.onclick = () => { tutorialMode = false; rightOnlyMode = false; hardcoreMode = false; radarMode = true; sandboxMode = false; launchGame(startRadarBtn); };
startSandboxBtn.onclick = () => { tutorialMode = false; rightOnlyMode = false; hardcoreMode = false; radarMode = false; sandboxMode = true; money = NaN; launchGame(startSandboxBtn); };


function launchGame(triggerButton) {
  modeButtons.forEach(btn => { if (btn) btn.disabled = true; });
  // Сховати user widget при запуску гри
  const userWidget = document.getElementById('userWidget');
  if(userWidget) userWidget.style.display = 'none';

  resetLoadingState();
  currentLoadingButton = triggerButton || null;
  loadingStartTime = performance.now();

  if (currentLoadingButton) {
    prepareModeButtonForLoading(currentLoadingButton);
  }

  setLoadingTarget(5);

  preloadImages(assetsToLoad, (percent) => {
    const capped = Math.min(percent, 95);
    setLoadingTarget(capped);
  }, () => {
    const finalizeLaunch = () => {
      setLoadingTarget(100);
      waitForLoadingCompletion(() => {
        preMenu.style.display = "none";
        fps = 0;
        frameCount = 0;
        fpsLastTime = performance.now();
        
        // Синхронізуємо режими з глобальних змінних (встановлених в index.html)
        // Перевіряємо window об'єкт напряму
        if (window.tutorialMode === true) tutorialMode = true;
        if (window.rightOnlyMode === true) rightOnlyMode = true;
        if (window.hardcoreMode === true) hardcoreMode = true;
        if (window.radarMode === true) radarMode = true;
        if (window.sandboxMode === true) sandboxMode = true;
        console.log("🎮 Mode sync: tutorialMode =", tutorialMode, "window.tutorialMode =", window.tutorialMode);
        
        applyModeSettings();
        initializeMapAndGame();
        // Перевіряємо tutorialMode з різних джерел
        const isTutorial = tutorialMode || window.tutorialMode === true;
        console.log("🎮 Tutorial check: local=", tutorialMode, "window=", window.tutorialMode, "isTutorial=", isTutorial);
        if (isTutorial && typeof window.startTutorial === "function") {
          try {
            console.log("🎓 Starting tutorial...");
            window.startTutorial();
          } catch (err) {
            console.error("Tutorial launch error:", err);
          }
        }
        resetLoadingState();
      });
    };

    const elapsed = performance.now() - loadingStartTime;
    const remaining = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);
    if (remaining > 0) {
      setTimeout(finalizeLaunch, remaining);
    } else {
      finalizeLaunch();
    }
  });
}

let map;
let mapPixelCanvas;
const defensePoints = [];
const pvoList = [];
const drones = [];
const rockets = [];
const projectiles = []; // Массив для візуальних снарядів
const particles = []; // Массив для частинок

// ========================================
// <i class="fas fa-crosshairs" style="color:#ff4444"></i> СИСТЕМА АПГРЕЙДІВ ППО
// ========================================

/**
 * Ініціалізація об'єкту покращень для нового ППО
 */
function initPVOUpgrades() {
  return {
    reload: 0,
    radius: 0,
    accuracy: 0,
    damage: 0,
    speed: 0,
    dualTarget: false
  };
}

/**
 * Вартість покращення перезарядки
 */
function getReloadUpgradeCost(basePrice, currentLevel) {
  if (currentLevel >= 5) return Infinity;
  return Math.floor(basePrice * 0.3 * (currentLevel + 1));
}

/**
 * Застосування покращення перезарядки
 */
function applyReloadUpgrade(pvo) {
  const baseCd = pvo.baseCd || pvo.cd;
  const reduction = pvo.upgrades.reload * 0.08; // -8% за рівень
  return Math.floor(baseCd * (1 - reduction));
}

/**
 * Вартість покращення радіусу
 */
function getRadiusUpgradeCost(basePrice, currentLevel) {
  if (currentLevel >= 5) return Infinity;
  return Math.floor(basePrice * 0.25 * (currentLevel + 1));
}

/**
 * Застосування покращення радіусу
 */
function applyRadiusUpgrade(pvo) {
  const baseRadius = pvo.baseRadius || pvo.radius;
  const increase = pvo.upgrades.radius * 0.1; // +10% за рівень
  return Math.floor(baseRadius * (1 + increase));
}

/**
 * Вартість покращення точності
 */
function getAccuracyUpgradeCost(basePrice, currentLevel) {
  if (currentLevel >= 4) return Infinity;
  return Math.floor(basePrice * 0.35 * (currentLevel + 1));
}

/**
 * Вартість покращення урону
 */
function getDamageUpgradeCost(basePrice, currentLevel) {
  return Math.floor(basePrice * 0.2 * (currentLevel + 1));
}

/**
 * Застосування покращення урону
 */
function applyDamageUpgrade(pvo) {
  const baseDamage = pvo.baseDamage || pvo.damage;
  const increase = pvo.upgrades.damage * 0.15; // +15% за рівень
  return Math.floor(baseDamage * (1 + increase));
}

/**
 * Вартість покращення швидкості снаряда
 */
function getSpeedUpgradeCost(basePrice, currentLevel) {
  return Math.floor(basePrice * 0.2 * (currentLevel + 1));
}

/**
 * Вартість подвійної цілі
 */
function getDualTargetCost(basePrice) {
  return Math.floor(basePrice * 2);
}

/**
 * Перевірка чи можна покращити урон/швидкість (обмеження по хвилі)
 */
function canUpgradeDamageOrSpeed(currentLevel, wave) {
  return currentLevel < wave;
}

/**
 * Перевірка чи ППО може атакувати цей тип ворога
 * @param {object} pvo - об'єкт ППО
 * @param {string} enemyType - тип ворога: "shaheds", "heavy_drones", "rockets", "calibers"
 */
function canTargetEnemy(pvo, enemyType) {
  if (!pvo) return false;
  
  // РЕБ і Радар не стріляють
  if (pvo.reb || pvo.radar) return false;
  
  // Якщо canTarget - масив (новий формат з PPO_CONFIG)
  if (Array.isArray(pvo.canTarget)) {
    // Для calibers також перевіряємо rockets (Patriot може бити і те й інше)
    if (enemyType === "calibers") {
      return pvo.canTarget.includes("calibers") || pvo.canTarget.includes("rockets");
    }
    return pvo.canTarget.includes(enemyType);
  }
  
  // Старий формат (об'єкт) - для сумісності
  if (pvo.canTarget && typeof pvo.canTarget === 'object') {
    if (enemyType === "shaheds") return !!pvo.canTarget.drones;
    if (enemyType === "heavy_drones") return !!pvo.canTarget.drones;
    if (enemyType === "rockets") return !!pvo.canTarget.rockets;
    if (enemyType === "calibers") return !!(pvo.canTarget.kalibrs || pvo.canTarget.rockets);
  }
  
  // Fallback: старі поля targetableByDrones/targetableByRockets
  if (enemyType === "shaheds" || enemyType === "heavy_drones") {
    if (pvo.targetableByDrones !== undefined) return pvo.targetableByDrones;
  }
  if (enemyType === "rockets" || enemyType === "calibers") {
    if (pvo.targetableByRockets !== undefined) return pvo.targetableByRockets;
  }
  
  // Якщо нічого не визначено - ППО може стріляти по всьому (крім РЕБ/Радар які вже відфільтровані)
  return true;
}

// ========================================
// 🚀 СИСТЕМА СНАРЯДІВ
// ========================================

/**
 * Створення візуального снаряду
 */
function createProjectile(pvo, target) {
  if (!pvo || !target) return;
  
  const config = PPO_CONFIG[pvo.name];
  if (!config || !config.projectile) {
    const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
    target.hp -= actualDamage;
    return;
  }
  
  const startPos = pvo.latlng || pvo.center;
  const targetPos = target.position;
  
  if (!startPos || !targetPos || !Array.isArray(targetPos)) {
    const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
    target.hp -= actualDamage;
    return;
  }
  
  // Тип снаряду
  const projectileType = config.projectile.type || 'rocket';
  const isBullet = projectileType === 'bullet';
  
  // hitChance - спочатку з pvo.projectile (для туторіалу), потім з config
  const hitChance = (pvo.projectile && pvo.projectile.hitChance !== undefined) 
    ? pvo.projectile.hitChance 
    : (config.projectile.hitChance || 0.8);
  const accuracyBonus = pvo.upgrades ? pvo.upgrades.accuracy * 0.05 : 0;
  const finalHitChance = Math.min(hitChance + accuracyBonus, 0.99);
  const willHit = Math.random() < finalHitChance;
  
  // Урон (НЕ наносимо поки)
  const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
  
  // Для пуль - випередження
  let aimLat = targetPos[0];
  let aimLng = targetPos[1];
  if (isBullet && target.target) {
    const dirLat = target.target[0] - targetPos[0];
    const dirLng = target.target[1] - targetPos[1];
    const dirLen = Math.sqrt(dirLat * dirLat + dirLng * dirLng);
    if (dirLen > 0.0001) {
      aimLat += (dirLat / dirLen) * 0.006;
      aimLng += (dirLng / dirLen) * 0.006;
    }
  }
  
  // Кут
  const dx = aimLat - startPos.lat;
  const dy = aimLng - startPos.lng;
  const moveAngle = Math.atan2(dy, dx) * 180 / Math.PI; // реальний кут руху
  const rotationOffset = config.projectile.rotationOffset || 0;
  const visualAngle = moveAngle + rotationOffset; // кут для картинки
  
  // Фіксована швидкість снаряда - спочатку з pvo.projectile (для туторіалу), потім з config
  const projSpeed = (pvo.projectile && pvo.projectile.speed !== undefined)
    ? pvo.projectile.speed
    : (config.projectile.speed || 0.7);
  const speedInCoords = projSpeed * 3; // константна швидкість
  
  try {
    const size = config.projectile.size || [24, 24];
    const projectileMarker = L.marker([startPos.lat, startPos.lng], {
      icon: L.divIcon({
        className: 'projectile-icon',
        html: `<img src="${config.projectile.img}" style="width:${size[0]}px; height:${size[1]}px; transform:rotate(${visualAngle}deg); transform-origin:center;" />`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2]
      }),
      interactive: false,
      zIndexOffset: 2000
    }).addTo(map);
    
    projectiles.push({
      marker: projectileMarker,
      startPos: { lat: startPos.lat, lng: startPos.lng },
      targetPos: { lat: aimLat, lng: aimLng },
      currentPos: { lat: startPos.lat, lng: startPos.lng },
      speed: projSpeed,
      speedInCoords: speedInCoords, // швидкість для промаху (з конфіга PPO)
      progress: 0,
      moveAngle: moveAngle,         // реальний кут руху (для промаху)
      lastGoodAngle: moveAngle,     // останній нормальний кут (ініціалізуємо початковим)
      visualAngle: visualAngle,     // кут для картинки
      rotationOffset: rotationOffset,
      size: size,
      img: config.projectile.img,
      // Нові поля
      target: target,
      willHit: willHit,
      damage: actualDamage,
      isBullet: isBullet,
      damageDealt: false
    });
  } catch (e) {
    if (willHit) target.hp -= actualDamage;
  }
}

/**
 * Оновлення позицій снарядів
 */
function updateProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    
    // === РАКЕТИ СЛІДКУЮТЬ ЗА ЦІЛЛЮ ===
    if (!proj.isBullet && !proj.damageDealt && proj.target && proj.target.position && proj.target.hp > 0) {
      // Оновлюємо targetPos
      proj.targetPos = { lat: proj.target.position[0], lng: proj.target.position[1] };
      // Перераховуємо кут
      const dx = proj.targetPos.lat - proj.currentPos.lat;
      const dy = proj.targetPos.lng - proj.currentPos.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Оновлюємо кут тільки якщо відстань достатня (щоб уникнути випадкових кутів)
      if (dist > 0.005) {
        proj.moveAngle = Math.atan2(dy, dx) * 180 / Math.PI; // реальний кут руху
        proj.lastGoodAngle = proj.moveAngle; // зберігаємо останній нормальний кут
      }
      proj.visualAngle = (proj.moveAngle || proj.lastGoodAngle || 0) + (proj.rotationOffset || 0); // кут для картинки
      // Оновлюємо іконку
      try {
        proj.marker.setIcon(L.divIcon({
          className: 'projectile-icon',
          html: `<img src="${proj.img}" style="width:${proj.size[0]}px; height:${proj.size[1]}px; transform:rotate(${proj.visualAngle}deg); transform-origin:center;" />`,
          iconSize: proj.size,
          iconAnchor: [proj.size[0] / 2, proj.size[1] / 2]
        }));
      } catch(e) {}
    }
    
    // === РУХ (оригінальна логіка) ===
    proj.progress += proj.speed * 0.03 * gameSpeed;
    
    // === ЦІЛЬ ЗНИКЛА ПІД ЧАС ПОЛЬОТУ ===
    if (!proj.damageDealt && (!proj.target || proj.target.hp <= 0 || !proj.target.marker)) {
      proj.damageDealt = true;
      proj.missTimer = 0;
      // Фіксуємо РЕАЛЬНИЙ кут руху (від startPos до targetPos - це напрямок інтерполяції)
      const realDx = proj.targetPos.lat - proj.startPos.lat;
      const realDy = proj.targetPos.lng - proj.startPos.lng;
      proj.missAngle = Math.atan2(realDy, realDx) * 180 / Math.PI;
      // Пулі летять до 1 секунди (~60 кадрів), ракети 2-4 секунди (~120-240 кадрів)
      proj.missMaxTime = proj.isBullet ? 60 : (120 + Math.random() * 120);
    }
    
    // === ДОСЯГЛИ ЦІЛІ ===
    if (proj.progress >= 1 && !proj.damageDealt) {
      proj.damageDealt = true;
      
      // ВЛУЧЕННЯ - наносимо урон і видаляємо снаряд
      if (proj.willHit && proj.target && proj.target.hp > 0) {
        proj.target.hp -= proj.damage;
        
        // Якщо ціль знищена - видаляємо її з відповідного масиву
        if (proj.target.hp <= 0) {
          const deadEnemy = proj.target;

          // 💥 Анімація вибуху
          if (deadEnemy.position) {
            const explosion = L.marker(deadEnemy.position, {
              icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
            }).addTo(map);
            setTimeout(() => map.removeLayer(explosion), 600 / gameSpeed);
          }

          // Видаляємо маркер з карти
          if (deadEnemy.marker && map.hasLayer(deadEnemy.marker)) {
            map.removeLayer(deadEnemy.marker);
          }

          // Видаляємо з масиву drones
const droneIdx = drones.indexOf(deadEnemy);
if (droneIdx !== -1) {
  drones.splice(droneIdx, 1);
  money += deadEnemy.type === "heavy" ? 230 : 110;
  score++;
  if (typeof window.trackRankedKill === 'function') {
    window.trackRankedKill(deadEnemy.type === 'heavy' ? 'heavy' : 'shahed');
  }
  window.trackQuestKill(deadEnemy.type === 'heavy' ? 'heavy' : 'shahed');
  updateUI();
}

// Видаляємо з масиву rockets
const rocketIdx = rockets.indexOf(deadEnemy);
if (rocketIdx !== -1) {
  rockets.splice(rocketIdx, 1);
  money += 155;
  score++;
  if (typeof window.trackRankedKill === 'function') {
    window.trackRankedKill('rocket');
  }
  window.trackQuestKill('rocket');
  updateUI();
}

// Видаляємо з масиву kalibrs
const kalibrIdx = kalibrs.indexOf(deadEnemy);
if (kalibrIdx !== -1) {
  kalibrs.splice(kalibrIdx, 1);
  money += 200;
  score++;
  if (typeof window.trackRankedKill === 'function') {
    window.trackRankedKill('kalibr');
  }
  window.trackQuestKill('kalibr');
  updateUI();
}

          // Знімаємо мертву ціль з усіх ППО, щоб вони шукали нову
          pvoList.forEach(pvo => {
            if (!pvo || !pvo.currentTargets) return;
            for (let j = 0; j < pvo.currentTargets.length; j++) {
              if (pvo.currentTargets[j] === deadEnemy) pvo.currentTargets[j] = null;
            }
          });
        }
        
        if (proj.marker && map.hasLayer(proj.marker)) map.removeLayer(proj.marker);
        projectiles.splice(i, 1);
        continue;
      }
      
      // ПРОМАХ - встановлюємо таймер
      proj.missTimer = 0;
      // Фіксуємо РЕАЛЬНИЙ кут руху (від startPos до targetPos - це напрямок інтерполяції)
      const realDx = proj.targetPos.lat - proj.startPos.lat;
      const realDy = proj.targetPos.lng - proj.startPos.lng;
      proj.missAngle = Math.atan2(realDy, realDx) * 180 / Math.PI;
      // Пулі летять до 1 секунди (~60 кадрів), ракети 2-4 секунди (~120-240 кадрів)
      proj.missMaxTime = proj.isBullet ? 60 : (120 + Math.random() * 120);
    }
    
    // === ЛЕТИМО ДАЛІ ПІСЛЯ ПРОМАХУ ===
    if (proj.damageDealt && proj.missTimer !== undefined) {
      proj.missTimer += gameSpeed;
      
      // Продовжуємо рух прямо з тією ж швидкістю (з конфіга PPO)
      // Використовуємо missAngle - зафіксований кут в момент промаху
      const angleRad = (proj.missAngle !== undefined ? proj.missAngle : proj.moveAngle || 0) * Math.PI / 180;
      // Використовуємо збережену швидкість в координатах (та сама що й при польоті до цілі)
      const moveSpeed = (proj.speedInCoords || proj.speed * 0.003) * gameSpeed;
      proj.currentPos.lat += Math.cos(angleRad) * moveSpeed;
      proj.currentPos.lng += Math.sin(angleRad) * moveSpeed;
      
      // Час вийшов - видаляємо
      if (proj.missTimer >= proj.missMaxTime) {
        if (!proj.isBullet) {
          try {
            const exp = L.circleMarker([proj.currentPos.lat, proj.currentPos.lng], {
              radius: 10, color: '#ff6600', fillColor: '#ffaa00', fillOpacity: 0.8, weight: 2
            }).addTo(map);
            setTimeout(() => { if (map.hasLayer(exp)) map.removeLayer(exp); }, 200);
          } catch(e) {}
        }
        if (proj.marker && map.hasLayer(proj.marker)) map.removeLayer(proj.marker);
        projectiles.splice(i, 1);
        continue;
      }
      
      // Оновлюємо маркер
      if (proj.marker) {
        try {
          proj.marker.setLatLng([proj.currentPos.lat, proj.currentPos.lng]);
          // Оновлюємо візуальний кут на основі missAngle (тільки один раз)
          if (!proj.missVisualUpdated && !proj.isBullet) {
            const missVisualAngle = proj.missAngle + (proj.rotationOffset || 0);
            proj.marker.setIcon(L.divIcon({
              className: 'projectile-icon',
              html: `<img src="${proj.img}" style="width:${proj.size[0]}px; height:${proj.size[1]}px; transform:rotate(${missVisualAngle}deg); transform-origin:center;" />`,
              iconSize: proj.size,
              iconAnchor: [proj.size[0] / 2, proj.size[1] / 2]
            }));
            proj.missVisualUpdated = true;
          }
          if (Math.random() < 0.4) createParticle(proj.currentPos.lat, proj.currentPos.lng, 'smoke');
          if (Math.random() < 0.25) createParticle(proj.currentPos.lat, proj.currentPos.lng, 'spark');
        } catch(e) {}
      }
      continue;
    }
    
    // === ІНТЕРПОЛЯЦІЯ ПОЗИЦІЇ ===
    const lat = proj.startPos.lat + (proj.targetPos.lat - proj.startPos.lat) * proj.progress;
    const lng = proj.startPos.lng + (proj.targetPos.lng - proj.startPos.lng) * proj.progress;
    proj.currentPos = { lat, lng };
    
    // === ОНОВЛЮЄМО МАРКЕР ===
    if (proj.marker) {
      try {
        proj.marker.setLatLng([lat, lng]);
        
        // Частинки для ВСІХ снарядів
        if (Math.random() < 0.4) {
          createParticle(lat, lng, 'smoke');
        }
        if (Math.random() < 0.25) {
          createParticle(lat, lng, 'spark');
        }
      } catch (e) {
        projectiles.splice(i, 1);
      }
    }
  }
}

/**
 * Створення частинки (дим, іскри)
 */
function createParticle(lat, lng, type = 'smoke') {
  const colors = {
    smoke: '#888888',
    spark: '#ffcc00',
    fire: '#ff6600'
  };
  
  const size = type === 'spark' ? 5 : 7;
  const lifetime = type === 'spark' ? 500 : 700;
  
  // Більша початкова швидкість для кращого розльоту
  const speedMultiplier = type === 'spark' ? 0.0004 : 0.0002;
  
  try {
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'particle-icon',
        html: `<div style="width:${size}px; height:${size}px; background:${colors[type]}; border-radius:50%; box-shadow:0 0 ${size + 2}px ${colors[type]}; opacity:0.9;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      }),
      interactive: false,
      zIndexOffset: 1500
    }).addTo(map);
    
    particles.push({
      marker,
      lat,
      lng,
      createdAt: performance.now(),
      lifetime,
      velocityLat: (Math.random() - 0.5) * speedMultiplier,
      velocityLng: (Math.random() - 0.5) * speedMultiplier,
      type
    });
  } catch (e) {
    // Ігноруємо помилки
  }
}

/**
 * Оновлення частинок (ефекти вибухів тощо)
 */
function updateParticles() {
  const now = performance.now();
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    
    if (!particle || !particle.marker) {
      particles.splice(i, 1);
      continue;
    }
    
    const age = now - particle.createdAt;
    
    // Видаляємо старі частинки
    if (age >= particle.lifetime) {
      if (particle.marker && map.hasLayer(particle.marker)) {
        try {
          map.removeLayer(particle.marker);
        } catch (e) {}
      }
      particles.splice(i, 1);
      continue;
    }
    
    // Рухаємо частинку
    particle.lat += particle.velocityLat * gameSpeed;
    particle.lng += particle.velocityLng * gameSpeed;
    
    // Гравітація - іскри падають вниз, дим піднімається
    if (particle.type === 'spark') {
      particle.velocityLat -= 0.01 * gameSpeed; // падає вниз (lat зменшується)
    } else if (particle.type === 'smoke') {
      particle.velocityLat += 0.01 * gameSpeed; // піднімається вгору
      particle.velocityLng *= 0.78; // сповільнюється горизонтально
    }
    
    // Оновлюємо позицію
    if (particle.marker) {
      try {
        particle.marker.setLatLng([particle.lat, particle.lng]);
        
        // Fade out ефект
        const opacity = 1 - (age / particle.lifetime);
        const el = particle.marker.getElement();
        if (el) {
          el.style.opacity = opacity * 0.9;
        }
      } catch (e) {
        particles.splice(i, 1);
      }
    }
  }
}

// ========================================
// 🎮 ІНІЦІАЛІЗАЦІЯ КАРТИ ТА ГРИ
// ========================================

function initializeMapAndGame() {
  accumulatedGameTime = 0;
  lastFrameTime = performance.now();
  airports = [];
  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -3,
    maxZoom: 2,
    zoomControl: false
  });
  const imageBounds = [[0, 0], [2829, 4000]];
  L.imageOverlay("assets/map.png", imageBounds).addTo(map);
  map.fitBounds(imageBounds);
  map.setView([1414.5, 2000], -2);
  const mapImage = new Image();
  mapImage.src = "assets/map.png";
  mapPixelCanvas = document.createElement('canvas');
  const ctx = mapPixelCanvas.getContext('2d');
  mapImage.onload = () => {
    mapPixelCanvas.width = mapImage.width;
    mapPixelCanvas.height = mapImage.height;
    ctx.drawImage(mapImage, 0, 0);
  };
  const paddingTop = 1000;
  const paddingLeft = 1500;
  const paddingBottom = 1000;
  const paddingRight = 1500;
  const paddedBounds = [
    [-paddingTop, -paddingLeft],
    [2829 + paddingBottom, 4000 + paddingRight]
  ];
  map.setMaxBounds(paddedBounds);

  if ((hardcoreMode || rightOnlyMode || sandboxMode) && !tutorialMode) {
    activateKreiser(KREISER_CONFIG.spawnCoords);
  }

  console.log("🎮 initializeMapAndGame: tutorialMode =", tutorialMode, "sandboxMode =", sandboxMode);
  // Для ranked mode початковий об'єкт створюється в ranked-mode.js
  if (!sandboxMode && !tutorialMode && !window.rankedMode) {
    const firstRegion = Object.keys(regionSpawnPoints)[Math.floor(Math.random() * Object.keys(regionSpawnPoints).length)];
    const firstPoint = getRandomSpawnPoint(firstRegion);
    allDefensePoints = [firstPoint];
    usedSpawnPoints = [firstPoint];
    if (allDefensePoints.length > 0) {
      activateDefensePoint(0, allDefensePoints[0]);
    } else {
      console.error("No defense points available to initialize");
    }
  }
  
  // Ranked mode: створюємо початковий об'єкт через ranked-mode.js
  if (window.rankedMode && typeof window.initRankedFirstObject === 'function') {
    window.initRankedFirstObject();
  }
  buildControlPanel();

  moneyDisplay = document.getElementById("money");
  waveDisplay  = document.getElementById("waveDisplay");
  scoreDisplay = document.getElementById("scoreDisplay");
  fpsDisplay   = document.getElementById("fpsDisplay");
  pvoCounterDisplay = TEMP_DEBUG_PVO_COUNTER ? document.getElementById("pvoCounterDisplay") : null;

  renderPauseButton(false);
  renderSpeedButton(gameSpeed || 1, false);
  renderSoundButton();
  const _sirenOn  = localStorage.getItem('df_siren_on')  !== 'false';
  const _sirenVol = parseInt(localStorage.getItem('df_siren_vol') ?? '70') / 100;
  alarmSound.muted = !isSoundOn || !_sirenOn;
  alarmSound.volume = _sirenVol;
// Музика керується через index.html (startGameMusic/pauseGameMusic)
  if (typeof window.startGameMusic === 'function' && isSoundOn) {
    // Музика запуститься в кінці initializeMapAndGame
  }

  if (hudMenuWrapper && hudMenuToggle) {
    hudMenuWrapper.classList.remove("open");
    hudMenuToggle.setAttribute("aria-expanded", "false");
    hudMenuToggle.onclick = (event) => {
      event.stopPropagation();
      setHudMenuState(!hudMenuWrapper.classList.contains("open"));
    };
    if (!hudMenuOutsideListenerAttached) {
      document.addEventListener('click', (evt) => {
        if (hudMenuWrapper && !hudMenuWrapper.contains(evt.target)) {
          setHudMenuState(false);
        }
      });
      hudMenuOutsideListenerAttached = true;
    }
  }

  if (pauseButtonEl) {
    pauseButtonEl.onclick = (event) => {
      event.stopPropagation();
      // Блокуємо в режимі туторіалу
      if (window.tutorialModeActive) return;
      if (isPaused) {
        setGameSpeed(previousSpeed || 1);
      } else {
        previousSpeed = gameSpeed || 1;
        setGameSpeed(0);
      }
    };
  }

  if (speedCycleButton) {
    speedCycleButton.onclick = (event) => {
      event.stopPropagation();
      // Блокуємо в режимі туторіалу
      if (window.tutorialModeActive) return;
      const current = isPaused ? (previousSpeed || 1) : (gameSpeed || 1);
      const next = current === 1 ? 2 : current === 2 ? 3 : 1;
      setGameSpeed(next);
    };
  }

  if (soundToggleButton) {
    soundToggleButton.onclick = (event) => {
      event.stopPropagation();
      isSoundOn = !isSoundOn;
      renderSoundButton();
      const _sOn = localStorage.getItem('df_siren_on') !== 'false';
      alarmSound.muted = !isSoundOn || !_sOn;
      const bgMusicEl = document.getElementById("bgMusic");
      if (bgMusicEl) bgMusicEl.muted = !isSoundOn;
    };
  }

  if (exitButton) {
    exitButton.onclick = (event) => {
      event.stopPropagation();
      setHudMenuState(false);
      previousSpeed = gameSpeed || previousSpeed || 1;
      setGameSpeed(0);
      if (exitConfirm) exitConfirm.classList.remove("hidden");
    };
  }

  if (exitStayButton) {
    exitStayButton.onclick = () => {
      if (exitConfirm) exitConfirm.classList.add("hidden");
      setGameSpeed(previousSpeed || 1);
    };
  }

  if (exitLeaveButton) {
    exitLeaveButton.onclick = () => {
      if (exitConfirm) exitConfirm.classList.add("hidden");
      location.reload();
    };
  }

  if (exitConfirm) {
    exitConfirm.onclick = (event) => {
      if (event.target === exitConfirm) {
        exitConfirm.classList.add("hidden");
        setGameSpeed(previousSpeed || 1);
      }
    };
  }

  pvoMenu.style.display = "flex";
  pvoTypes = buildPvoTypesForMode();
  setupPvoMenu();
  if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") window.__tutorialPvoLock();

map.on("click", (e) => {
  // 1) Рух літака: кліком задаємо ціль, списуємо паливо
  if (moveMode && movingPVO) {
    if (!isPointOnMap(e.latlng.lat, e.latlng.lng)) {
      alert("✖ Не можна переміщувати літак поза межами України!");
      moveMode = false; movingPVO = null;
      return;
    }
    for (let dp of defensePoints) {
      const dx = e.latlng.lng - dp.lng;
      const dy = e.latlng.lat - dp.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && !window.tutorialModeActive) {
        alert("✖ Не можна переміщувати літак надто близько до цілі! Тримай відстань.");
        moveMode = false; movingPVO = null;
        return;
      }
    }
    const fuelCost = PLANE_FUEL_COSTS[movingPVO.name] || 0;
    if (fuel < fuelCost) {
      alert(`✖ Недостатньо палива! Потрібно ⛽${fuelCost}.`);
      moveMode = false; movingPVO = null;
      return;
    }
    fuel -= fuelCost; updateFuelDisplay();
    movingPVO.targetPosition = e.latlng;
    movingPVO.isMovingToTarget = true;
    movingPVO.center = e.latlng;
    moveMode = false; movingPVO = null;
    // захист від null: кнопка може ще не існувати
    if (typeof movePVOButton !== "undefined" && movePVOButton) {
      movePVOButton.classList?.remove('active');
      movePVOButton.disabled = true;
      movePVOButton.onclick = null;
    }
    return;
  }

  // 2) Режим покупки: ставимо вибраний елемент
if (buyingMode && selectedPVO) {
  // [TUTORIAL GUARD] Заборона встановлення ППО поза квадратиком-підказкою
if (window.tutorialModeActive && window.__tutorialIsPlacementLocked) {
  // Для Аварійки дозволяємо розміщення де завгодно
  if (selectedPVO.name !== "Аварійка" && selectedPVO.name !== "F-16") {
    const allow = (typeof window.__tutorialAllowPlacementAt === "function")
      ? window.__tutorialAllowPlacementAt(e.latlng.lat, e.latlng.lng)
      : false;

    if (!allow) {
      if (typeof window.__tutorialShowDenyCross === "function") {
        window.__tutorialShowDenyCross(e.latlng.lat, e.latlng.lng);
      }
      // Скасовуємо покупку КОНКРЕТНО цим кліком: нічого не ставимо
      return;
    }
  }
}

  // Аварійка
  if (selectedPVO.name === "Аварійка") {
    if (avariikaActive) { alert("✖ Аварійка вже встановлена. Дозволено лише одну."); return; }
    if (!isPointOnMap(e.latlng.lat, e.latlng.lng)) { alert("✖ Не можна встановлювати Аварійку поза межами карти України!"); return; }
    for (let dp of defensePoints) {
      const dx = e.latlng.lng - dp.lng;
      const dy = e.latlng.lat - dp.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && !window.tutorialModeActive) { alert("✖ Не можна ставити Аварійку надто близько до іншої цілі!"); return; }
    }
    const basePrice = 1500;
    const count = pvoPurchaseCounts["Аварійка"] || 0;
    const dynamicPrice = Math.floor(basePrice * Math.pow(1.2, count));
    if (!Number.isNaN(money) && money < dynamicPrice) { alert(`Недостатньо коштів, потрібно ${Math.round(dynamicPrice)} карбованців.`); return; }
    spendMoney(dynamicPrice);
    updateMoney();
    pvoPurchaseCounts["Аварійка"] = count + 1;
    updatePvoMenuPrice("Аварійка");

activateAvariika([e.latlng.lat, e.latlng.lng]);
    buyingMode = false; selectedPVO = null;
    document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
    setupPvoMenu();
    
    // В туторіалі блокуємо всі кнопки після setupPvoMenu
    if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") {
      window.__tutorialPvoLock();
    }
    
    return;
  }

  // РУЧНИЙ СПАВН ЦІЛІ (sandbox): коректна картинка та повноцінний об’єкт, як у activateDefensePoint
  if (selectedPVO.name === "TargetSpawner" && sandboxMode) {
    if (!isPointOnMap(e.latlng.lat, e.latlng.lng)) {
      alert("✖ Не можна спавнити ціль поза межами України!");
      return;
    }
    for (let dp of defensePoints) {
      const dx = e.latlng.lng - dp.lng;
      const dy = e.latlng.lat - dp.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) { alert("✖ Надто близько до іншої цілі!"); return; }
    }
    // ставимо ціль через штатну функцію, яка вже змінює іконку за циклом (tet→gas→zawod)
    activateDefensePoint(defensePoints.length, [e.latlng.lat, e.latlng.lng]);

    buyingMode = false; selectedPVO = null;
    setupPvoMenu();
    return;
  }

  // Аеродром у sandbox — ставимо як ППО
  if (selectedPVO.name === "Аеродром" && sandboxMode) {
    if (!isPointOnMap(e.latlng.lat, e.latlng.lng)) { alert("✖ Не можна встановлювати Аеродром поза межами карти України!"); return; }
    for (let dp of defensePoints) {
      const dx = e.latlng.lng - dp.lng;
      const dy = e.latlng.lat - dp.lat;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && !window.tutorialModeActive) { alert("✖ Не можна ставити Аеродром надто близько до цілі! Тримай відстань."); return; }
    }
    const count = pvoPurchaseCounts["Аеродром"] || 0;
    const dynamicPrice = Math.floor(selectedPVO.price * Math.pow(1.2, count));
    if (!Number.isNaN(money) && money < dynamicPrice) { alert(`Недостатньо коштів, потрібно ${Math.round(dynamicPrice)} карбованців.`); return; }
    spendMoney(dynamicPrice);
    updateMoney();
    pvoPurchaseCounts["Аеродром"] = count + 1;
    updatePvoMenuPrice("Аеродром");

    activateAirport([e.latlng.lat, e.latlng.lng]);
    buyingMode = false; selectedPVO = null;
    setupPvoMenu();
    return;
  }

  // Літаки — тільки в радіусі аеродрому (включно з МіГ-29)
  if (selectedPVO.name === "F-16" || selectedPVO.name === "Су-27" || selectedPVO.name === "МіГ-29") {
    let inRange = false;
    for (let a of airports) {
      if (a.alive && Math.hypot(e.latlng.lng - a.lng, e.latlng.lat - a.lat) <= a.radius) { inRange = true; break; }
    }
    if (!inRange) { alert("✖ Літаки можна ставити тільки в радіусі Аеродрому!"); return; }
  }

  // Загальне встановлення ППО
  if (!isPointOnMap(e.latlng.lat, e.latlng.lng)) { alert("✖ Не можна встановлювати ППО поза межами карти України!"); return; }
  for (let dp of defensePoints) {
    const dx = e.latlng.lng - dp.lng;
    const dy = e.latlng.lat - dp.lat;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100 && !window.tutorialModeActive) { alert("✖ Не можна ставити PPО надто близько до цілі! Тримай відстань."); return; }
  }
  if (pvoList.length >= MAX_PVO_COUNT) { 
    console.log(`❌ Ліміт ППО: ${pvoList.length}/${MAX_PVO_COUNT}`);
    alert(`Максимальна кількість ППО на карті — ${MAX_PVO_COUNT}. Покращи існуючі!`); 
    return; 
  }

  const count = pvoPurchaseCounts[selectedPVO.name] || 0;
  const dynamicPrice = Math.floor(selectedPVO.price * Math.pow(1.2, count));
  if (!Number.isNaN(money) && money < dynamicPrice) { alert(`Недостатньо коштів, потрібно ${Math.round(dynamicPrice)} карбованців.`); return; }
  spendMoney(dynamicPrice);
  updateMoney();
  pvoPurchaseCounts[selectedPVO.name] = count + 1;
  updatePvoMenuPrice(selectedPVO.name);

  const icon = L.divIcon({
    className: "rotating-icon",
    html: `<img src="${selectedPVO.img}" style="width:${selectedPVO.iconSize[0]}px; height:${selectedPVO.iconSize[1]}px;" />`,
    iconSize: selectedPVO.iconSize,
    iconAnchor: [selectedPVO.iconSize[0] / 2, selectedPVO.iconSize[1] / 2]
  });

  const zoneColor = pvoColorMap[selectedPVO.name] || "#00FF00";
  let rangeCircle, sectorLayer = null, radarHelpers = null;
  if (selectedPVO.radar) {
    rangeCircle = L.circle(e.latlng, { radius: selectedPVO.radius, color: zoneColor, fillColor: zoneColor, fillOpacity: 0.4 }).addTo(map);
    radarHelpers = createRadarSector(map, e.latlng, selectedPVO.radius, 40, 0);
    sectorLayer = radarHelpers.layer;
  } else {
    rangeCircle = L.circle(e.latlng, { radius: selectedPVO.radius, color: zoneColor, fillColor: zoneColor, fillOpacity: 0.2 }).addTo(map);
  }

  const marker = L.marker(e.latlng, { icon }).addTo(map);
  
  // Перевіряємо чи це літак
  const isPlane = selectedPVO.name === "F-16" || selectedPVO.name === "Су-27" || selectedPVO.name === "МіГ-29";
  const planeConf = isPlane ? PLANE_CONFIG[selectedPVO.name] : null;
  
const pvo = {
    latlng: e.latlng, center: e.latlng, ...selectedPVO,
    price: dynamicPrice,  // ЗБЕРІГАЄМО ціну за яку КУПИЛИ
    baseDamage: selectedPVO.damage, baseRadius: selectedPVO.radius, baseCd: selectedPVO.cd,
    lastShot: 0, lastShots: [0, 0], marker, rangeCircle, sectorLayer, radarHelpers, radarBearing: 0,
    upgradeCount: 0, patrolAngle: 0, speed: planeConf ? planeConf.patrolSpeed : 0.8, isMovingToTarget: false, targetPosition: null,
    targetableByDrones: selectedPVO.targetableByDrones, targetableByRockets: selectedPVO.targetableByRockets,
    upgrades: initPVOUpgrades(),  // Ініціалізація системи покращень
    // Поля для фіксації цілі (підтримка dual target)
    currentTargets: [null, null],  // Масив поточних цілей (для dual target)
    // Поля для літаків
    planeTarget: null,           // Поточна ціль літака
    planeState: isPlane ? 'patrol' : null,  // patrol, chase, lock, escape
    lockProgress: 0,             // Прогрес захвату 0-100
    currentAngle: Math.random() * 360,  // Поточний кут (градуси)
    lockStartTime: 0,
    turnProgress: 0,             // Прогрес розвороту
    exitAngle: 0,                // Кут виходу з розвороту
    currentSpeed: planeConf ? planeConf.patrolSpeed : 0.5  // Поточна швидкість (плавна)
  };
  
  // В режимі туторіалу застосовуємо кастомні характеристики
  if (window.tutorialModeActive && window.TUTORIAL_PVO_STATS) {
    const customStats = window.TUTORIAL_PVO_STATS[pvo.name];
    if (customStats) {
      // Мержимо projectile окремо (щоб не перезаписати весь об'єкт)
      if (customStats.projectile && pvo.projectile) {
        Object.assign(pvo.projectile, customStats.projectile);
      }
      // Мержимо інші поля (крім projectile)
      for (const key in customStats) {
        if (key !== 'projectile') {
          pvo[key] = customStats[key];
        }
      }
      // Оновлюємо базові значення якщо змінені
      if (customStats.damage) pvo.baseDamage = customStats.damage;
      if (customStats.radius) pvo.baseRadius = customStats.radius;
      if (customStats.cd) pvo.baseCd = customStats.cd;
    }
  }
  
  pvoList.push(pvo);
  if (TEMP_DEBUG_PVO_COUNTER) updateUI();

  buyingMode = false; 
  selectedPVO = null;
  document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
  setupPvoMenu();
  return;
}


  {
    let nearestDamaged = null, minD = Infinity;

    // Перебираємо всі стратегічні цілі (включно з будівлею Аварійки, вона в defensePoints з isAvariika)
    for (const dp of defensePoints) {
      if (!dp.alive || typeof dp.hp !== "number" || dp.hp >= 100) continue;
      const baseRadius = dp.isAvariika ? 150 : 100;
      const d = getDistance(e.latlng.lat, e.latlng.lng, dp.lat, dp.lng);
      if (d <= baseRadius && d < minD) { nearestDamaged = dp; minD = d; }
    }

    // Перебираємо аеродроми
    for (const a of airports) {
      if (!a.alive || typeof a.hp !== "number" || a.hp >= 100) continue;
      const d = getDistance(e.latlng.lat, e.latlng.lng, a.lat, a.lng);
      if (d <= 150 && d < minD) { nearestDamaged = a; minD = d; }
    }

    // Якщо знайшли пошкоджений поруч — відкриваємо діалог ремонту і завершуємо обробку кліку
    if (nearestDamaged) {
      showRepairModal(nearestDamaged);
      return;
    }
  }
    // 3) Sandbox: вибір цілі/аеродрому для кнопки "Видалити"
  if (sandboxMode) {
    let nearest = null, nearestType = null, minD = Infinity;

    // цели (включая Аварийку как цель)
    for (const dp of defensePoints) {
      if (!dp.alive) continue;
      const d = getDistance(e.latlng.lat, e.latlng.lng, dp.lat, dp.lng);
      const radius = dp.isAvariika ? 150 : 100;
      if (d <= radius && d < minD) { nearest = dp; nearestType = "target"; minD = d; }
    }

    // аэродромы
    for (const a of airports) {
      if (!a.alive) continue;
      const d = getDistance(e.latlng.lat, e.latlng.lng, a.lat, a.lng);
      if (d <= 150 && d < minD) { nearest = a; nearestType = "airport"; minD = d; }
    }

    // если попали кликом в объект — выбираем его, рисуем меню и включаем "Удалить"
    if (nearest) {
      selectedPVO = null; // чтобы не открывалось меню ПВО
      selectedTarget  = nearestType === "target"  ? nearest : null;
      selectedAirport = nearestType === "airport" ? nearest : null;

      setupPvoMenu(); // создаёт removeButton в песочнице

      if (typeof removeButton !== "undefined" && removeButton) {
        removeButton.disabled = false;
        removeButton.classList.add('active');
      }
      return; // клик обработан
    }
  }

// 3.2) Звичайний вибір ППО   в радіусі його кола
let nearestPVO = null;
let minDistPVO = Infinity;
pvoList.forEach(pvo => {
  if (!pvo || !pvo.latlng) return;
  const dx = e.latlng.lng - pvo.latlng.lng;
  const dy = e.latlng.lat - pvo.latlng.lat;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= pvo.radius && dist < minDistPVO) { nearestPVO = pvo; minDistPVO = dist; }
});

// Якщо клікнули біля крейсера — форсуємо вибір найближчого вільного літака у радіусі атаки (355px)
const clickNearKreiser = !!(kreiser && kreiser.alive && getDistance(e.latlng.lat, e.latlng.lng, kreiser.lat, kreiser.lng) <= 355);
if (!nearestPVO && clickNearKreiser) {
  let plane = null, bestToK = Infinity;
  for (const p of pvoList) {
    if (!p || !p.mobile || !p.latlng || p.hidden) continue;
    if (['attackRun','returning','cooldown','destroyed'].includes(p.aircraftState)) continue;
    const dToKreiser = getDistance(p.latlng.lat, p.latlng.lng, kreiser.lat, kreiser.lng);
    if (dToKreiser <= 355 && dToKreiser < bestToK) { plane = p; bestToK = dToKreiser; }
  }
  if (plane) nearestPVO = plane;
}


  // Якщо нічого не обрано — повертаємо стартове меню
  if (!nearestPVO) {
    buyingMode = false;
    selectedPVO = null;
    document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
    setupPvoMenu();
    if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") window.__tutorialPvoLock();
    return;
  }


  // Показуємо меню дій для вибраного ППО
  selectedPVO = nearestPVO;
  selectedTarget = null;
  selectedAirport = null;

  pvoMenu.innerHTML = "";

  // Кнопка ПРОДАТИ
  sellPVOButton = document.createElement("button");
  sellPVOButton.className = "pvo-button";
  sellPVOButton.id = "sellPVOButton";
  const baseUpgradeCost = 100;
  const totalUpgradeCost = selectedPVO.upgradeCount > 0 ? baseUpgradeCost * (Math.pow(1.75, selectedPVO.upgradeCount) - 1) / 0.75 : 0;
  const totalCost = selectedPVO.price + totalUpgradeCost;
  const sellValue = Math.floor(totalCost * 0.75);
  sellPVOButton.innerHTML = `
    <span class="upgrade-icon"><i class="fas fa-dollar-sign" style="color:#4CAF50"></i></span>
    <b>${typeof translate === 'function' ? translate('sellPVO', 'game') : 'Продати'}</b>
    <span class="pvo-price">+<i class="fas fa-coins" style="color:#FFD700"></i> ${sellValue}</span>
  `;
  sellPVOButton.onclick = () => {
    money += sellValue; updateMoney();
    try { map.removeLayer(selectedPVO.marker); } catch(e){}
    try { if (selectedPVO.rangeCircle) map.removeLayer(selectedPVO.rangeCircle); } catch(e){}
    try { if (selectedPVO.radarHelpers) selectedPVO.radarHelpers.remove(); } catch(e){}
    const idx = pvoList.indexOf(selectedPVO);
    if (idx !== -1) {
      pvoList.splice(idx, 1);
      if (TEMP_DEBUG_PVO_COUNTER) updateUI();
    }
    selectedPVO = null;
    setupPvoMenu();
    if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") {
      window.__tutorialPvoLock();
    }
  };
  pvoMenu.appendChild(sellPVOButton);

// Блокування кнопки продажу в режимі туторіалу (якщо не дозволено)
  if (window.tutorialModeActive && !window.tutorialAllowSell) {
    sellPVOButton.classList.add("tutorial-disabled");
    sellPVOButton.disabled = true;
  }

  // Кнопки ПОКРАЩЕНЬ (6 типів) - НЕ показувати в ранговому режимі!
  if (!selectedPVO.noUpgrade && !selectedPVO.mobile && selectedPVO.name !== "Аеродром" && !window.rankedMode) {
    // Ініціалізація upgrades якщо немає
    if (!selectedPVO.upgrades) {
      selectedPVO.upgrades = initPVOUpgrades();
    }

    const basePrice = selectedPVO.price; // Ціна за яку КУПИЛИ це ППО

    // 1. ПЕРЕЗАРЯДКА
    const reloadBtn = createUpgradeButton({
      icon: '<i class="fa-solid fa-bolt"></i>',
      name: typeof translate === 'function' ? translate('reload', 'game') : 'Перезарядка',
      currentLevel: selectedPVO.upgrades.reload,
      maxLevel: 5,
      cost: getReloadUpgradeCost(basePrice, selectedPVO.upgrades.reload),
      onClick: () => {
        const cost = getReloadUpgradeCost(basePrice, selectedPVO.upgrades.reload);
        if (canAfford(cost)) {
          spendMoney(cost);
          selectedPVO.upgrades.reload++;
          selectedPVO.cd = applyReloadUpgrade(selectedPVO);
          updateMoney();
          updateUpgradeButtons();
        }
      }
    });

    // 2. РАДІУС
    const radiusBtn = createUpgradeButton({
      icon: '<i class="fa-solid fa-circle-dot"></i>',
      name: typeof translate === 'function' ? translate('radius', 'game') : 'Радіус',
      currentLevel: selectedPVO.upgrades.radius,
      maxLevel: 5,
      cost: getRadiusUpgradeCost(basePrice, selectedPVO.upgrades.radius),
      onClick: () => {
        const cost = getRadiusUpgradeCost(basePrice, selectedPVO.upgrades.radius);
        if (canAfford(cost)) {
          spendMoney(cost);
          selectedPVO.upgrades.radius++;
          selectedPVO.radius = applyRadiusUpgrade(selectedPVO);
          // Оновити rangeCircle якщо є
          if (selectedPVO.rangeCircle) {
            selectedPVO.rangeCircle.setRadius(selectedPVO.radius);
          }
          updateMoney();
          updateUpgradeButtons();
        }
      }
    });

    // 3. ТОЧНІСТЬ
    const accuracyBtn = createUpgradeButton({
      icon: '<i class="fa-solid fa-crosshairs"></i>',
      name: typeof translate === 'function' ? translate('accuracy', 'game') : 'Точність',
      currentLevel: selectedPVO.upgrades.accuracy,
      maxLevel: 4,
      cost: getAccuracyUpgradeCost(basePrice, selectedPVO.upgrades.accuracy),
      onClick: () => {
        const cost = getAccuracyUpgradeCost(basePrice, selectedPVO.upgrades.accuracy);
        if (canAfford(cost)) {
          spendMoney(cost);
          selectedPVO.upgrades.accuracy++;
          updateMoney();
          updateUpgradeButtons();
        }
      }
    });

    // 4. УРОН
    const damageBtn = createUpgradeButton({
      icon: '<i class="fa-solid fa-burst"></i>',
      name: typeof translate === 'function' ? translate('damage', 'game') : 'Урон',
      currentLevel: selectedPVO.upgrades.damage,
      maxLevel: currentWave,
      cost: getDamageUpgradeCost(basePrice, selectedPVO.upgrades.damage),
      disabled: !canUpgradeDamageOrSpeed(selectedPVO.upgrades.damage, currentWave),
      onClick: () => {
        const cost = getDamageUpgradeCost(basePrice, selectedPVO.upgrades.damage);
        if (canAfford(cost) && canUpgradeDamageOrSpeed(selectedPVO.upgrades.damage, currentWave)) {
          spendMoney(cost);
          selectedPVO.upgrades.damage++;
          selectedPVO.damage = applyDamageUpgrade(selectedPVO);
          updateMoney();
          updateUpgradeButtons();
        }
      }
    });

    // 5. ШВИДКІСТЬ СНАРЯДА
    const speedBtn = createUpgradeButton({
      icon: '<i class="fa-solid fa-rocket"></i>',
      name: typeof translate === 'function' ? translate('projectileSpeed', 'game') : 'Швидкість',
      currentLevel: selectedPVO.upgrades.speed,
      maxLevel: currentWave,
      cost: getSpeedUpgradeCost(basePrice, selectedPVO.upgrades.speed),
      disabled: !canUpgradeDamageOrSpeed(selectedPVO.upgrades.speed, currentWave),
      onClick: () => {
        const cost = getSpeedUpgradeCost(basePrice, selectedPVO.upgrades.speed);
        if (canAfford(cost) && canUpgradeDamageOrSpeed(selectedPVO.upgrades.speed, currentWave)) {
          spendMoney(cost);
          selectedPVO.upgrades.speed++;
          updateMoney();
          updateUpgradeButtons();
        }
      }
    });

    // 6. ПОДВІЙНА ЦІЛЬ
    const dualBtn = document.createElement("button");
    dualBtn.className = "pvo-button upgrade-button";
    
    if (selectedPVO.upgrades.dualTarget) {
      dualBtn.innerHTML = `
        <span class="upgrade-icon"><i class="fa-solid fa-check" style="color:#4CAF50"></i></span>
        <b>${typeof translate === 'function' ? translate('dualTarget', 'game') : 'Подвійна ціль'}</b>
        <span class="upgrade-level">✓</span>
      `;
      dualBtn.disabled = true;
    } else {
      const cost = getDualTargetCost(basePrice);
      dualBtn.innerHTML = `
        <span class="upgrade-icon"><i class="fa-solid fa-bullseye" style="color:#ff4444"></i></span>
        <b>${typeof translate === 'function' ? translate('dualTarget', 'game') : 'Подвійна ціль'}</b>
        <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${cost}</span>
      `;
      dualBtn.onclick = () => {
        if (canAfford(cost)) {
          spendMoney(cost);
          selectedPVO.upgrades.dualTarget = true;
          updateMoney();
          updateUpgradeButtons();
        }
      };
      dualBtn.disabled = money < cost;
    }

pvoMenu.appendChild(reloadBtn);
    pvoMenu.appendChild(radiusBtn);
    pvoMenu.appendChild(accuracyBtn);
    pvoMenu.appendChild(damageBtn);
    pvoMenu.appendChild(speedBtn);
    pvoMenu.appendChild(dualBtn);
    
    // В режимі туторіалу блокуємо всі кнопки крім дозволеної
    if (window.tutorialModeActive) {
      const allowedStat = window.tutorialAllowUpgradeStat;
      const buttons = [reloadBtn, radiusBtn, accuracyBtn, damageBtn, speedBtn, dualBtn];
      const buttonStats = ['reload', 'radius', 'accuracy', 'damage', 'speed', 'dualTarget'];
      
      buttons.forEach((btn, idx) => {
        if (allowedStat && buttonStats[idx] === allowedStat) {
          // Дозволена кнопка - розблокувати
          btn.classList.remove("tutorial-disabled");
          btn.disabled = false;
        } else {
          // Всі інші - заблокувати
          btn.classList.add("tutorial-disabled");
          btn.disabled = true;
        }
      });
    }
  }

// Допоміжна функція для створення кнопок покращень
function createUpgradeButton({icon, name, currentLevel, maxLevel, cost, onClick, disabled}) {
  const btn = document.createElement("button");
  btn.className = "pvo-button upgrade-button";
  
  if (cost === null || currentLevel >= maxLevel || disabled) {
    btn.innerHTML = `
      <span class="upgrade-icon">${icon}</span>
      <b>${name}</b>
      <span class="upgrade-level">MAX</span>
    `;
    btn.disabled = true;
  } else {
    btn.innerHTML = `
      <span class="upgrade-icon">${icon}</span>
      <b>${name}</b>
      <span class="upgrade-level">${currentLevel}/${maxLevel}</span>
      <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${cost}</span>
    `;
    btn.onclick = onClick;
    btn.disabled = !canAfford(cost);
  }
  
  return btn;
}

// Оновлення кнопок покращень без закриття меню
function updateUpgradeButtons() {
  if (!selectedPVO || !selectedPVO.upgrades) return;
  
  // В ранговому режимі кнопки покращень не показуємо
  if (window.rankedMode) return;
  
  // Видаляємо старі кнопки покращень
  document.querySelectorAll('.upgrade-button').forEach(btn => btn.remove());
  
  const basePrice = selectedPVO.price; // Ціна за яку було КУПЛЕНО це конкретне ППО
  
  // Створюємо кнопки заново (копія коду з setupPvoMenu)
  const reloadBtn = createUpgradeButton({
    icon: '<i class="fa-solid fa-bolt"></i>',
    name: typeof translate === 'function' ? translate('reload', 'game') : 'Перезарядка',
    currentLevel: selectedPVO.upgrades.reload,
    maxLevel: 5,
    cost: getReloadUpgradeCost(basePrice, selectedPVO.upgrades.reload),
    onClick: () => {
      const cost = getReloadUpgradeCost(basePrice, selectedPVO.upgrades.reload);
      if (canAfford(cost)) {
        spendMoney(cost);
        selectedPVO.upgrades.reload++;
        selectedPVO.cd = applyReloadUpgrade(selectedPVO);
        updateMoney();
        updateUpgradeButtons();
      }
    }
  });
  
  const radiusBtn = createUpgradeButton({
    icon: '<i class="fa-solid fa-circle-dot"></i>',
    name: typeof translate === 'function' ? translate('radius', 'game') : 'Радіус',
    currentLevel: selectedPVO.upgrades.radius,
    maxLevel: 5,
    cost: getRadiusUpgradeCost(basePrice, selectedPVO.upgrades.radius),
    onClick: () => {
      const cost = getRadiusUpgradeCost(basePrice, selectedPVO.upgrades.radius);
      if (canAfford(cost)) {
        spendMoney(cost);
        selectedPVO.upgrades.radius++;
        selectedPVO.radius = applyRadiusUpgrade(selectedPVO);
        if (selectedPVO.rangeCircle) {
          selectedPVO.rangeCircle.setRadius(selectedPVO.radius);
        }
        updateMoney();
        updateUpgradeButtons();
      }
    }
  });
  
  const accuracyBtn = createUpgradeButton({
    icon: '<i class="fa-solid fa-crosshairs"></i>',
    name: typeof translate === 'function' ? translate('accuracy', 'game') : 'Точність',
    currentLevel: selectedPVO.upgrades.accuracy,
    maxLevel: 4,
    cost: getAccuracyUpgradeCost(basePrice, selectedPVO.upgrades.accuracy),
    onClick: () => {
      const cost = getAccuracyUpgradeCost(basePrice, selectedPVO.upgrades.accuracy);
      if (canAfford(cost)) {
        spendMoney(cost);
        selectedPVO.upgrades.accuracy++;
        updateMoney();
        updateUpgradeButtons();
      }
    }
  });
  
  const damageBtn = createUpgradeButton({
    icon: '<i class="fa-solid fa-burst"></i>',
    name: typeof translate === 'function' ? translate('damage', 'game') : 'Урон',
    currentLevel: selectedPVO.upgrades.damage,
    maxLevel: currentWave,
    cost: getDamageUpgradeCost(basePrice, selectedPVO.upgrades.damage),
    disabled: !canUpgradeDamageOrSpeed(selectedPVO.upgrades.damage, currentWave),
    onClick: () => {
      const cost = getDamageUpgradeCost(basePrice, selectedPVO.upgrades.damage);
      if (canAfford(cost) && canUpgradeDamageOrSpeed(selectedPVO.upgrades.damage, currentWave)) {
        spendMoney(cost);
        selectedPVO.upgrades.damage++;
        selectedPVO.damage = applyDamageUpgrade(selectedPVO);
        updateMoney();
        updateUpgradeButtons();
      }
    }
  });
  
  const speedBtn = createUpgradeButton({
    icon: '<i class="fa-solid fa-rocket"></i>',
    name: typeof translate === 'function' ? translate('projectileSpeed', 'game') : 'Швидкість',
    currentLevel: selectedPVO.upgrades.speed,
    maxLevel: currentWave,
    cost: getSpeedUpgradeCost(basePrice, selectedPVO.upgrades.speed),
    disabled: !canUpgradeDamageOrSpeed(selectedPVO.upgrades.speed, currentWave),
    onClick: () => {
      const cost = getSpeedUpgradeCost(basePrice, selectedPVO.upgrades.speed);
      if (canAfford(cost) && canUpgradeDamageOrSpeed(selectedPVO.upgrades.speed, currentWave)) {
        spendMoney(cost);
        selectedPVO.upgrades.speed++;
        updateMoney();
        updateUpgradeButtons();
      }
    }
  });
  
  const dualBtn = document.createElement("button");
  dualBtn.className = "pvo-button upgrade-button";
  
  if (selectedPVO.upgrades.dualTarget) {
    dualBtn.innerHTML = `
      <span class="upgrade-icon"><i class="fa-solid fa-check" style="color:#4CAF50"></i></span>
      <b>${typeof translate === 'function' ? translate('dualTarget', 'game') : 'Подвійна ціль'}</b>
      <span class="upgrade-level">✓</span>
    `;
    dualBtn.disabled = true;
  } else {
    const cost = getDualTargetCost(basePrice);
    dualBtn.innerHTML = `
      <span class="upgrade-icon"><i class="fa-solid fa-bullseye" style="color:#ff4444"></i></span>
      <b>${typeof translate === 'function' ? translate('dualTarget', 'game') : 'Подвійна ціль'}</b>
      <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${cost}</span>
    `;
    dualBtn.onclick = () => {
      if (canAfford(cost)) {
        spendMoney(cost);
        selectedPVO.upgrades.dualTarget = true;
        updateMoney();
        updateUpgradeButtons();
      }
    };
    dualBtn.disabled = money < cost;
  }
  
  pvoMenu.appendChild(reloadBtn);
  pvoMenu.appendChild(radiusBtn);
  pvoMenu.appendChild(accuracyBtn);
  pvoMenu.appendChild(damageBtn);
  pvoMenu.appendChild(speedBtn);
  pvoMenu.appendChild(dualBtn);
  
  // В режимі туторіалу блокуємо всі кнопки крім дозволеної
  if (window.tutorialModeActive) {
    const allowedStat = window.tutorialAllowUpgradeStat;
    const buttons = [reloadBtn, radiusBtn, accuracyBtn, damageBtn, speedBtn, dualBtn];
    const buttonStats = ['reload', 'radius', 'accuracy', 'damage', 'speed', 'dualTarget'];
    
    buttons.forEach((btn, idx) => {
      if (allowedStat && buttonStats[idx] === allowedStat) {
        // Дозволена кнопка - розблокувати
        btn.classList.remove("tutorial-disabled");
        btn.disabled = false;
      } else {
        // Всі інші - заблокувати
        btn.classList.add("tutorial-disabled");
        btn.disabled = true;
      }
    });
  }
}

  // ЛІТАК: спрощене меню — Перемістити та (для F-16) Атакувати крейсер
  if (selectedPVO.mobile) {
    movePVOButton = document.createElement("button");
    movePVOButton.className = "pvo-button";
    movePVOButton.id = "movePVOButton";

    const fuelMoveCost = PLANE_FUEL_COSTS[selectedPVO.name] || 0;
    const busy = ['attackRun','returning','cooldown'].includes(selectedPVO.aircraftState) || selectedPVO.hidden;

    movePVOButton.innerHTML = `
      <span class="upgrade-icon"><i class="fas fa-plane" style="color:#2196F3"></i></span>
      <b>${typeof translate === 'function' ? translate('movePlane', 'game') : 'Перемістити'}</b>
      <span class="pvo-price"><i class="fas fa-gas-pump" style="color:#FF4444"></i> ${fuelMoveCost}</span>
    `;
    movePVOButton.disabled = !!selectedPVO.aircraftButtonsDisabled || (fuel < fuelMoveCost) || busy;
    movePVOButton.onclick = () => {
      if (movePVOButton.disabled) return;
      movingPVO = selectedPVO;
      moveMode = true;
      movePVOButton.classList.add('active');
    };
    pvoMenu.appendChild(movePVOButton);

    // Блокування кнопки переміщення в режимі туторіалу
    if (window.tutorialModeActive) {
      movePVOButton.classList.add("tutorial-disabled");
      movePVOButton.disabled = true;
    }

    if (selectedPVO.name === "F-16") {
      attackKreiserButton = document.createElement("button");
      attackKreiserButton.className = "pvo-button";
      attackKreiserButton.id = "attackKreiserButton";
      attackKreiserButton.innerHTML = `
        <span class="upgrade-icon"><i class="fas fa-crosshairs" style="color:#ff4444"></i></span>
        <b>${typeof translate === 'function' ? translate('attackCruiser', 'game') : 'Атакувати'}</b>
        <span class="pvo-price"><i class="fas fa-gas-pump" style="color:#FF4444"></i> ${ATTACK_CRUISER_COST.fuel} <i class="fas fa-bolt" style="color:#FFD700"></i> ${ATTACK_CRUISER_COST.power}</span>
      `;
      const canAttack = kreiser && kreiser.alive && fuel >= ATTACK_CRUISER_COST.fuel && power >= ATTACK_CRUISER_COST.power && !(['attackRun','returning','cooldown'].includes(selectedPVO.aircraftState)) && !selectedPVO.hidden;
      attackKreiserButton.disabled = !!selectedPVO.aircraftButtonsDisabled || !canAttack;
      attackKreiserButton.onclick = () => {
        if (attackKreiserButton.disabled) return;
        // вимикаємо обидві кнопки поки літак в атаці/повертається
        selectedPVO.aircraftButtonsDisabled = true;
        try { if (movePVOButton) movePVOButton.disabled = true; } catch(e){}
        try { if (attackKreiserButton) attackKreiserButton.disabled = true; } catch(e){}
        if (!kreiser || !kreiser.alive) return;
        if (fuel < ATTACK_CRUISER_COST.fuel || power < ATTACK_CRUISER_COST.power) return;
        fuel -= ATTACK_CRUISER_COST.fuel; updateFuelDisplay();
        power -= ATTACK_CRUISER_COST.power; updatePowerDisplay();
        startAircraftAttack(selectedPVO);
      };
      pvoMenu.appendChild(attackKreiserButton);

      // Блокування кнопки атаки крейсера в режимі туторіалу
    if (window.tutorialModeActive) {
      attackKreiserButton.classList.add("tutorial-disabled");
      attackKreiserButton.disabled = true;
    }
    }
  }

});

// Запуск ігрового циклу
  updateProjectiles();
  updateParticles();
  requestAnimationFrame(gameLoop);
  requestAnimationFrame(moveDrones);
  requestAnimationFrame(moveRockets);
  requestAnimationFrame(moveKalibrs);
  requestAnimationFrame(moveMobilePVO);
  requestAnimationFrame(animateRadarSectors);
  
  // 🎵 Запуск музики при старті гри
  if (typeof window.startGameMusic === 'function') {
    window.startGameMusic();
  }
}

function attachStructureMarkerClick(structure) {
  if (!structure || !structure.marker || typeof structure.marker.on !== "function") return;

  structure.marker.on("click", (evt) => {
    if (structure.alive === false) return;

    const original = evt?.originalEvent;
    if (original) {
      if (typeof original.preventDefault === "function") original.preventDefault();
      if (typeof original.stopPropagation === "function") original.stopPropagation();
    }

    if (typeof structure.marker.closePopup === "function") {
      try { structure.marker.closePopup(); } catch (e) {}
    }

    if (!map || typeof map.fire !== "function") return;

    const latlng =
      evt?.latlng ??
      (typeof structure.marker.getLatLng === "function" ? structure.marker.getLatLng() : null) ??
      ((typeof L !== "undefined" && typeof L.latLng === "function" && structure.lat != null && structure.lng != null)
        ? L.latLng(structure.lat, structure.lng)
        : null);

    if (!latlng) return;

    map.fire("click", {
      latlng,
      layerPoint: evt?.layerPoint,
      containerPoint: evt?.containerPoint,
      originalEvent: original || evt
    });
  });
}

function activateDefensePoint(index, coords) {
  const [lat, lng] = coords;
  // масив із картинками цілей у потрібному порядку
const targetIcons = ["assets/tet.png", "assets/gas.png", "assets/zawod.png"];

// глобальний індекс для вибору картинки
if (typeof window.targetIconIndex === "undefined") {
  window.targetIconIndex = 0;
}

// беремо наступну картинку по порядку
const iconUrl = targetIcons[window.targetIconIndex % targetIcons.length];
let kind = "zawod";
if (iconUrl.includes("tet")) kind = "tet";
else if (iconUrl.includes("gas")) kind = "gas";

// збільшуємо індекс для наступної цілі
window.targetIconIndex++;


  const myIcon = L.icon({
    iconUrl: iconUrl,
    iconSize: [60, 60],
    iconAnchor: [30, 40],
    popupAnchor: [0, -30]
  });

  const marker = L.marker([lat, lng], { icon: myIcon }).addTo(map).bindPopup("<i class='fas fa-crosshairs' style='color:#ff4444'></i> Ціль");

  const hpHtml = `
  <div class="hp-container">
    <div class="hp-bar"></div>
    <div class="hp-text">100</div>
  </div>
`;

const hpMarker = L.marker([lat, lng], {
  icon: L.divIcon({
    html: hpHtml,
    className: "",
    iconSize: [50, 20],          // розмір контейнера
    iconAnchor: [0, -20]        // центр і зсув (x, y)
  })
}).addTo(map);

  const defensePoint = {
    lat,
    lng,
    marker,
    noBuildCircle: L.circle([lat, lng], {
      radius: 100, color: "red", fillColor: "#ff4444", fillOpacity: 0.2, dashArray: "4, 4", interactive: false
    }).addTo(map),
    alive: true,
    hp: 100,
    hpMarker,
    // 🆕 для производства ресурсов
    kind,                 // 'tet' | 'gas' | 'zawod'
    prodAccum: 0          // накопленное игровое время до следующей выдачи ресурса
  };

  defensePoints.push(defensePoint);
  attachStructureMarkerClick(defensePoint);

}

function activateAirport(coords) {
  const [lat, lng] = coords;
  const myIcon = L.icon({
    iconUrl: 'assets/aeroport.png',
    iconSize: [60, 60],
    iconAnchor: [30, 40],
    popupAnchor: [0, -30]
  });

  const marker = L.marker([lat, lng], { icon: myIcon }).addTo(map).bindPopup("<i class='fas fa-plane' style='color:#2196F3'></i> Аеродром");
  const noBuildCircle = L.circle([lat, lng], {
    radius: 150,
    color: "#1f8cff",
    fillColor: "#1f8cff",
    fillOpacity: 0.2,
    dashArray: "4, 4",
    interactive: false
  }).addTo(map);

  // HP бар для аеродрому
  const hpHtml = `
    <div class="hp-container">
      <div class="hp-bar"></div>
      <div class="hp-text">100</div>
    </div>
  `;
  const hpMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: hpHtml,
      className: "",
      iconSize: [50, 20],
      iconAnchor: [0, -20]
    })
  }).addTo(map);

  const newAirport = { lat, lng, marker, noBuildCircle, alive: true, hp: 100, hpMarker, radius: 150 };
  airports.push(newAirport);
  attachStructureMarkerClick(newAirport);

  if (!sandboxMode) {
    isAirportSpawning = false;
  }
  console.log(`Activated airport at [${lat}, ${lng}]`);
  updatePvoPurchaseAvailability();
}

function destroyPlanesDockedAtAirport(airport) {
  if (!airport) return;
  const planesToRemove = pvoList.filter(p => p && p.mobile && p.dockedAirport === airport);
  planesToRemove.forEach(plane => {
    destroyPlane(plane);
  });
}

function activateAvariika(coords) {
  const [lat, lng] = coords;
  const myIcon = L.icon({
    iconUrl: 'assets/avariika.png',
    iconSize: [60, 60],
    iconAnchor: [30, 40],
    popupAnchor: [0, -30]
  });

  const marker = L.marker([lat, lng], { icon: myIcon })
    .addTo(map)
    .bindPopup("🚧 Аварійка");

  const hpHtml = `
    <div class="hp-container">
      <div class="hp-bar"></div>
      <div class="hp-text">100</div>
    </div>
  `;
  const hpMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: hpHtml,
      className: "",
      iconSize: [50, 20],
      iconAnchor: [0, -20]
    })
  }).addTo(map);

  const noBuildCircle = L.circle([lat, lng], {
    radius: 150,
    color: "#ff661fff",
    fillColor: "#ffa21fff",
    fillOpacity: 0.2,
    dashArray: "4, 4",
    interactive: false
  }).addTo(map);

  const avariikaPoint = {
    lat,
    lng,
    marker,
    noBuildCircle,
    alive: true,
    hp: 100,
    hpMarker,
    isAvariika: true,
  };

  defensePoints.push(avariikaPoint);
  attachStructureMarkerClick(avariikaPoint);

  // У режимі туторіалу НЕ показуємо автоматично меню ремонту
  if (window.tutorialModeActive) {
    selectedTarget = null;
  }

  avariikaActive = true;
  updatePvoPurchaseAvailability?.();

  // Блокуємо всі кнопки в туторіалі після розміщення Аварійки
  if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") {
    window.__tutorialPvoLock();
  }
}

// Функція для оновлення HP об'єктів (цілей, аеродромів, крейсера)
function updateHpDisplay(obj) {
  if (!obj.hpMarker) return;
  const hpBar = obj.hpMarker.getElement().querySelector('.hp-bar');
  const hpText = obj.hpMarker.getElement().querySelector('.hp-text');
  const maxHp = obj.maxHp || 100;

  if (obj.hp <= 0 && obj.alive) {
    obj.alive = false;

    if (obj.kind === 'kreiser') {
      // Змінюємо іконку на пошкоджений крейсер
      try {
        obj.marker.setIcon(L.icon({
          iconUrl: 'assets/kreiserdamage.png',
          iconSize: [100, 80],
          iconAnchor: [50, 40],
          popupAnchor: [0, -30]
        }));
      } catch(e){}

      // Прибираємо HP-бар крейсера
      try { obj.hpMarker && map.removeLayer(obj.hpMarker); } catch(e){}

      // Вимикаємо ППО крейсера
      try { obj.aaRangeCircle && map.removeLayer(obj.aaRangeCircle); } catch(e){}
      obj.aaTarget = null;

      // Зупиняємо атаки калібрами
      obj.salvoStage = 0;
      obj.salvoTargetPoint = null;

      return;
    }

    // Для звичайних будівель — забираємо і маркер, і hpMarker
    obj.hpMarker.remove();
    obj.marker.remove();

    // 🔧 якщо цей об'єкт був у меню — повертаємо список ППО
    if (selectedPVO === obj) {
      selectedPVO = null;
      setupPvoMenu();
    }

  }


  if (hpBar) {
    const percent = (obj.hp / maxHp) * 100;
    hpBar.style.width = `${Math.max(0, percent)}%`;
    if (percent < 25) hpBar.style.backgroundColor = '#dc3545';
    else if (percent < 50) hpBar.style.backgroundColor = '#ffc107';
    else hpBar.style.backgroundColor = '#28a745';
  }
  if (hpText) {
    hpText.textContent = Math.max(0, Math.round(obj.hp));
  }
}


function getRandomOffsetCoords(lat, lng, radius) {
  const angle = Math.random() * 2 * Math.PI;
  const dx = radius * Math.cos(angle); // по X (lng)
  const dy = radius * Math.sin(angle); // по Y (lat)
  return { lat: lat + dy, lng: lng + dx };
}

function generateCurvedBezierForReturn(p0, p3) {
  // напрямок на базу
  const vx = p3.x - p0.x, vy = p3.y - p0.y;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len,  uy = vy / len;
  // перпендикуляр
  const px = -uy, py = ux;

  // більше варіативності: довжина, «бік», фаза шуму
  const k = 180 + Math.random() * 280;
  const side = Math.random() < 0.5 ? -1 : 1;
  const jitter1 = (Math.random() - 0.5) * 120;
  const jitter2 = (Math.random() - 0.5) * 140;

  const c1 = {
    x: p0.x + vx * 0.33 + px * (k * 0.7 + jitter1) * side,
    y: p0.y + vy * 0.33 + py * (k * 0.7 + jitter1) * side
  };
  const c2 = {
    x: p0.x + vx * 0.66 + px * (k + jitter2) * side,
    y: p0.y + vy * 0.66 + py * (k + jitter2) * side
  };
  return { c1, c2 };
}


function getFallbackReturnPoint(plane) {
  // Якщо немає аеродрому — тягнемо точку «позаду» літака, щоб зробити дугу назад
  const dirX = plane.latlng ? (kreiser ? (plane.latlng.lng - kreiser.lng) : 1) : 1;
  const dirY = plane.latlng ? (plane.latlng.lat - (kreiser ? kreiser.lat : plane.latlng.lat)) : 0;
  const len = Math.hypot(dirX, dirY) || 1;
  const bx = plane.latlng ? plane.latlng.lng + (-dirX / len) * (300 + Math.random() * 200) : 0;
  const by = plane.latlng ? plane.latlng.lat + (-dirY / len) * (300 + Math.random() * 200) : 0;
  return { x: bx, y: by };
}



// Універсальна евклідова відстань у пікселях (CRS.Simple)
// Порядок аргументів: (lat1, lng1, lat2, lng2)
function getDistance(lat1, lng1, lat2, lng2) {
  const dx = lng2 - lng1;
  const dy = lat2 - lat1;
  return Math.hypot(dx, dy);
}


// Функція для пошуку найближчого аеродрому (виправляє ReferenceError)
function getNearestAirport(lat, lng, maxDistance = 50) {
  let nearest = null;
  let minDistance = Infinity;
  for (const airport of airports) {
    if (!airport.alive) continue;
    // getDistance має бути доступна з інших частин вашого коду
    const distance = getDistance(lat, lng, airport.lat, airport.lng); 
    if (distance < minDistance) {
      minDistance = distance;
      nearest = airport;
    }
  }
  // Перевірка, що аеродром в радіусі кліку
  if (minDistance > maxDistance) return null; 
  return nearest;
}

function activateKreiser(coords) {
  const [lat, lng] = coords;
  const myIcon = L.icon({
    iconUrl: 'assets/kreiser.png',
    iconSize: [100, 80],
    iconAnchor: [50, 40],
    popupAnchor: [0, -30]
  });

  const marker = L.marker([lat, lng], { icon: myIcon })
    .addTo(map)
    .bindPopup("🚢 Крейсер");

  // HP bar для крейсера
  const hpHtml = `
    <div class="hp-container">
      <div class="hp-bar"></div>
      <div class="hp-text">${KREISER_CONFIG.hp}</div>
    </div>
  `;
  const hpMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      html: hpHtml,
      className: "enemy-hp-marker",
      iconSize: [50, 20],
      iconAnchor: [0, -40]
    })
  }).addTo(map);

    // Кільце ППО крейсера
  const aaRangeCircle = L.circle([lat, lng], {
    radius: KREISER_AA_CONFIG.radius,
    color: KREISER_AA_CONFIG.color,
    fillColor: KREISER_AA_CONFIG.color,
    fillOpacity: 0.08,
    interactive: false
  }).addTo(map);

  kreiser = {
    lat, lng, marker, hpMarker,
    alive: true,
    hp: KREISER_CONFIG.hp,
    maxHp: KREISER_CONFIG.hp,
    kind: 'kreiser',
    targetableByDrones: false, targetableByRockets: false, targetableByKalibrs: false,

    // Залпи "Калібр"
    lastSalvo: 0,
    salvoStage: 0,
    salvoTargetPoint: null,
    salvoDelay: 0,

    // ППО крейсера
    aaRangeCircle,
    aaTarget: null,
    aaCooldownMs: 0
  };

}


function handleKreiserAttack(delta) {
  if (!kreiser || !kreiser.alive) return;
  if (!(hardcoreMode || rightOnlyMode || sandboxMode)) return;
  
  // В ranked режимі крейсер атакує ТІЛЬКИ з 15 хвилі!
  if (window.rankedMode) {
    if (currentWave < 15) return;
  } else {
    if (currentWave < KREISER_CONFIG.startWave) return;
  }

    // Якщо в зоні ППО є повітряні цілі — зупиняємо/не починаємо залп
  if (kreiserHasAirThreatInRange()) {
    kreiser.salvoStage = 0;
    kreiser.salvoTargetPoint = null;
    kreiserNextSalvoWave = currentWave + 1;
    return;
  }


  if (kreiser.salvoStage === 0 && currentWave >= kreiserNextSalvoWave) {
    const targets = defensePoints.filter(dp => dp.alive && !dp.isAvariika);
    const avariika = defensePoints.filter(dp => dp.alive && dp.isAvariika);
    const airportsAlive = airports.filter(a => a.alive);
    const availableTargets = [...targets, ...avariika, ...airportsAlive];
    if (availableTargets.length === 0) { kreiserNextSalvoWave = currentWave + 1; return; }

    const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    kreiser.salvoTargetPoint = { lat: target.lat, lng: target.lng, targetObject: target };

    kreiser.salvoStage = 1;
    const firstSalvo = KREISER_CONFIG.salvoStructure[0];
    kreiser.missilesLeftInStage = firstSalvo.count;
    kreiser.cooldownMs = 0; // первый выстрел — сразу
  }

  if (kreiser.salvoStage > 0) {
    const dtMs = (delta || 0) * 1000 * Math.max(gameSpeed || 1, 0.0001);
    kreiser.cooldownMs -= dtMs;

    if (kreiser.cooldownMs <= 0) {
      const stageIdx = kreiser.salvoStage - 1;
      const salvo = KREISER_CONFIG.salvoStructure[stageIdx];

          if (kreiserHasAirThreatInRange()) {
      kreiser.salvoStage = 0;
      kreiser.salvoTargetPoint = null;
      kreiserNextSalvoWave = currentWave + 1;
      return;
    }


      let tgt = kreiser.salvoTargetPoint?.targetObject;
      if (!tgt || !tgt.alive) {
        const targets = defensePoints.filter(dp => dp.alive && !dp.isAvariika);
        const avariika = defensePoints.filter(dp => dp.alive && dp.isAvariika);
        const airportsAlive = airports.filter(a => a.alive);
        const availableTargets = [...targets, ...avariika, ...airportsAlive];
        if (availableTargets.length === 0) {
          kreiser.salvoStage = 0;
          kreiser.salvoTargetPoint = null;
          kreiserNextSalvoWave = currentWave + 1;
          return;
        }
        tgt = availableTargets[Math.floor(Math.random() * availableTargets.length)];
        kreiser.salvoTargetPoint = { lat: tgt.lat, lng: tgt.lng, targetObject: tgt };
      }

      if (salvo.type === 'kalibr') {
        spawnKalibr(kreiser.lat, kreiser.lng, kreiser.salvoTargetPoint.lat, kreiser.salvoTargetPoint.lng, kreiser.salvoTargetPoint.targetObject);
      } else {
        spawnRocket(kreiser.lat, kreiser.lng, kreiser.salvoTargetPoint.lat, kreiser.salvoTargetPoint.lng, kreiser.salvoTargetPoint.targetObject);
      }

      kreiser.missilesLeftInStage--;

      if (kreiser.missilesLeftInStage > 0) {
        // пауза между СЛЕДУЮЩИМИ снарядами текущей стадии
        kreiser.cooldownMs = salvo.interval;
      } else {
        // переход к следующей стадии
        kreiser.salvoStage++;
        if (kreiser.salvoStage <= KREISER_CONFIG.salvoStructure.length) {
          const nextSalvo = KREISER_CONFIG.salvoStructure[kreiser.salvoStage - 1];
          kreiser.missilesLeftInStage = nextSalvo.count;
          // пауза между стадиями — используем тот же interval текущей стадии
          kreiser.cooldownMs = salvo.interval;
        } else {
          // залп завершён
          kreiser.salvoStage = 0;
          kreiser.salvoTargetPoint = null;
          kreiserNextSalvoWave = currentWave + KREISER_CONFIG.salvoIntervalWaves;
        }
      }
    }
  }
}

function kreiserHasAirThreatInRange() {
  if (!kreiser || !kreiser.alive) return false;
  // Перевіряємо літаки
  for (const p of pvoList) {
    if (!p.mobile) continue;
    if (p.aircraftState === 'cooldown' || p.hidden) continue;
    const d = getDistance(kreiser.lat, kreiser.lng, p.latlng.lat, p.latlng.lng);
    if (d <= KREISER_AA_CONFIG.radius) return true;
  }
  // Перевіряємо фламінго
  for (const fl of flamingos) {
    if (!fl.alive) continue;
    const d = getDistance(kreiser.lat, kreiser.lng, fl.lat, fl.lng);
    if (d <= KREISER_AA_CONFIG.radius) return true;
  }
  return false;
}

function handleKreiserAA(delta) {
  if (!kreiser || !kreiser.alive) return;

  // Якщо ціль втрачена/знищена/вийшла з радіусу — скидаємо
  if (kreiser.aaTarget) {
    const tt = kreiser.aaTarget;
    const tAlive = tt.type === 'flamingo' ? tt.alive
                 : (tt.marker && !tt.hidden && tt.aircraftState !== 'cooldown');
    const tx = tt.type === 'flamingo' ? tt.lat : tt.latlng.lat;
    const ty = tt.type === 'flamingo' ? tt.lng : tt.latlng.lng;
    const dist = getDistance(kreiser.lat, kreiser.lng, tx, ty);
    if (!tAlive || dist > KREISER_AA_CONFIG.radius) {
      kreiser.aaTarget = null;
    }
  }

  // Вибір цілі: пріоритет літак → фламінго
  if (!kreiser.aaTarget) {
    let best = null, bestD = Infinity;

    for (const p of pvoList) {
      if (!p.mobile) continue;
      if (p.hidden || p.aircraftState === 'cooldown') continue;
      const d = getDistance(kreiser.lat, kreiser.lng, p.latlng.lat, p.latlng.lng);
      if (d <= KREISER_AA_CONFIG.radius && d < bestD) {
        best = p; bestD = d;
      }
    }
    if (!best) {
      for (const fl of flamingos) {
        if (!fl.alive) continue;
        const d = getDistance(kreiser.lat, kreiser.lng, fl.lat, fl.lng);
        if (d <= KREISER_AA_CONFIG.radius && d < bestD) {
          best = fl; bestD = d;
        }
      }
    }
    if (best) kreiser.aaTarget = best;
  }

  // Стріляємо по одній цілі з КД і шансом 25%
  if (kreiser.aaTarget) {
    kreiser.aaCooldownMs -= delta * 1000 * gameSpeed;
    if (kreiser.aaCooldownMs <= 0) {
      kreiser.aaCooldownMs = KREISER_AA_CONFIG.cdMs;
      const t = kreiser.aaTarget;
      const targetLat = t.type === 'flamingo' ? t.lat : t.latlng.lat;
      const targetLng = t.type === 'flamingo' ? t.lng : t.latlng.lng;
      const bulletLine = L.polyline([[kreiser.lat, kreiser.lng], [targetLat, targetLng]], { color: KREISER_AA_CONFIG.color || "#000", weight: 2, dashArray: '4, 6' }).addTo(map);
      setTimeout(() => { try { map.removeLayer(bulletLine); } catch(e){} }, 200 / Math.max(gameSpeed, 0.01));
      // В туторіалі ППО крейсера не працює
      const hitChance = window.tutorialModeActive ? 0 : KREISER_AA_CONFIG.hitChance;
      if (Math.random() < hitChance) {
        if (t.type === 'flamingo') {
          t.alive = false;
          try { map.removeLayer(t.marker); } catch(e){}
          kreiser.aaTarget = null;
        } else {
          destroyPlane(t);
kreiser.aaTarget = null;




        }
      }
    }
  }

}

function spawnFlamingo(startLat, startLng, targetLat, targetLng) {
  const marker = L.marker([startLat, startLng], {
    icon: L.divIcon({
      className: "rotating-icon",
      html: `<img src="${FLAMINGO_CONFIG.img}" width="40" height="40" style="transform:rotate(0deg);" />`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
  }).addTo(map);
  marker.setOpacity(radarMode ? 0 : 1);
  const obj = {
    type: 'flamingo',
    marker,
    lat: startLat,
    lng: startLng,
    alive: true,
    targetLat,
    targetLng
  };
  flamingos.push(obj);
  return obj;
}
function updateFlamingos(delta) {
  if (!flamingos.length) return;
  for (const fl of flamingos) {
    if (!fl.alive) continue;
    const tx = (kreiser && kreiser.alive) ? kreiser.lat : (fl.targetLat ?? fl.lat);
    const ty = (kreiser && kreiser.alive) ? kreiser.lng : (fl.targetLng ?? fl.lng);
    const dx = tx - fl.lat, dy = ty - fl.lng;
    const dist = Math.hypot(dx, dy);
    const step = FLAMINGO_CONFIG.speed * Math.max(gameSpeed, 0.0001);
    if (dist <= step) {
      fl.alive = false;
      try { map.removeLayer(fl.marker); } catch(e){}
      if (kreiser && kreiser.alive) {
        // В туторіалі більший урон
        const minDmg = window.tutorialModeActive ? 50 : FLAMINGO_CONFIG.damageMin;
        const maxDmg = window.tutorialModeActive ? 60 : FLAMINGO_CONFIG.damageMax;
        const dmg = minDmg + Math.floor(Math.random() * (maxDmg - minDmg + 1));
        kreiser.hp = Math.max(0, kreiser.hp - dmg);
        updateHpDisplay(kreiser);
      }
      continue;
    }
    fl.lat += (dx / dist) * step;
    fl.lng += (dy / dist) * step;
    fl.marker.setLatLng([fl.lat, fl.lng]);
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
    const img = fl.marker.getElement()?.querySelector("img");
    if (img) img.style.transform = `rotate(${angleDeg}deg)`;
  }
  flamingos = flamingos.filter(f => f.alive);
}
function startAircraftAttack(plane) {
  if (!plane) return;
  if (!kreiser) return;
  if (plane.aircraftState === 'destroyed' || plane.hidden) return;

  plane.isMovingToTarget = false;
  plane.targetPosition   = null;
  plane.center = plane.latlng;
  plane.aircraftState = 'attackRun';
  plane.attack = { launched: 0, cd: 0, started: false };
  plane.attackPoint = { lat: kreiser.lat, lng: kreiser.lng };
}


function updateAircraftAttack(delta) {
  for (const p of pvoList) {
    if (!p.mobile) continue;
    if (p.hidden) {
      if (p.aircraftState === 'cooldown') {
        // Якщо літак "у сховищі" в аеродромі, а аеродром знищили — літак теж гине і НЕ респавниться
        if (p.dockedAirport && !p.dockedAirport.alive) {
          p.aircraftState = 'destroyed';
          p.hidden = true;
          p.respawnMs = undefined;
          p.dockedAirport = null;
          // захисне прибирання залишків зон/радарів
          if (p.rangeCircle) { try { map.removeLayer(p.rangeCircle); } catch(e){} p.rangeCircle = null; }
          if (p.sectorLayer) { try { map.removeLayer(p.sectorLayer); } catch(e){} p.sectorLayer = null; }
          continue;
        }

        p.respawnMs -= delta * 1000 * gameSpeed;
        if (p.respawnMs <= 0) {
          // Відпрацьовано 30с у сховищі — повертаємо літак на карту
          // Пріоритет: той самий аеродром, де сховався; якщо його нема — будь-який живий
          let home = null;
          if (p.dockedAirport && p.dockedAirport.alive) {
            home = p.dockedAirport;
          } else {
            home = getNearestAirport(p.center?.lat || 0, p.center?.lng || 0) || airports.find(a => a.alive);
          }

          if (home) {
            const rnd = getRandomOffsetCoords(home.lat, home.lng, 30 + Math.random() * 50);
            p.latlng = L.latLng(rnd.lat, rnd.lng);
            p.center = p.latlng;
          } else {
destroyPlane(p);
continue;

          }

          const icon = L.divIcon({
            className: "rotating-icon",
            html: `<img src="${p.img}" style="width:${p.iconSize[0]}px;height:${p.iconSize[1]}px;" />`,
            iconSize: p.iconSize,
            iconAnchor: [p.iconSize[0]/2, p.iconSize[1]/2]
          });
          p.marker = L.marker(p.latlng, { icon }).addTo(map);
          p.marker.setOpacity(radarMode ? 0 : 1);

          const zoneColor = pvoColorMap[p.name] || "#00FF00";
          if (p.radar) {
            p.rangeCircle = L.circle(p.latlng, {
              radius: p.baseRadius,
              color: zoneColor,
              fillColor: zoneColor,
              fillOpacity: 0.4
            }).addTo(map);
            const radarHelpers = createRadarSector(map, p.latlng, p.baseRadius, 40, 0);
            p.sectorLayer = radarHelpers.layer;
            p.radarHelpers = radarHelpers;
          } else {
            p.rangeCircle = L.circle(p.latlng, {
              radius: p.baseRadius,
              color: zoneColor,
              fillColor: zoneColor,
              fillOpacity: 0.2
            }).addTo(map);
          }
          // Вийшли з "сховища": тепер можна знову натискати "Перемістити літак" і "Атакувати крейсер"
          p.hidden = false;
          p.aircraftState = undefined;
          p.dockedAirport = null;

          // 🔓 повертаємо можливість жати кнопки
          p.aircraftButtonsDisabled = false;

          // якщо цей літак зараз обраний у меню — одразу оновлюємо UI
          if (selectedPVO === p) {
            try { setupPvoMenu(); } catch(e){}
          }

        }
      }
      continue;
    }


    if (p.aircraftState === 'attackRun') {
      if (!p.attackPoint) { p.aircraftState = undefined; return; }
      const dx = p.attackPoint.lng - p.latlng.lng;
      const dy = p.attackPoint.lat - p.latlng.lat;
      const dist = Math.hypot(dx, dy);
      const step = p.speed * 1.4 * Math.max(gameSpeed, 0.0001);
      if (dist <= FLAMINGO_CONFIG.startDistance) {
        if (!p.attack.started) { p.attack.started = true; p.attack.cd = 0; }
        p.attack.cd -= delta * 1000 * gameSpeed;
        if (p.attack.launched < FLAMINGO_CONFIG.launches && p.attack.cd <= 0) {
          const rnd = getRandomOffsetCoords(p.latlng.lat, p.latlng.lng, FLAMINGO_CONFIG.scatterRadius);
          spawnFlamingo(rnd.lat, rnd.lng, p.attackPoint.lat, p.attackPoint.lng);
          p.attack.launched += 1;
          p.attack.cd = FLAMINGO_CONFIG.intervalMs;
        }
      }
      if (dist <= FLAMINGO_CONFIG.turnAwayDistance) {
        const base =
          airports
            .filter(a => a.alive)
            .sort((a, b) => getDistance(p.latlng.lat, p.latlng.lng, a.lat, a.lng) - getDistance(p.latlng.lat, p.latlng.lng, b.lat, b.lng))[0]
          || airports.find(a => a.alive)
          || null;
        const p0 = { x: p.latlng.lng, y: p.latlng.lat };
        const p3 = base ? { x: base.lng, y: base.lat } : getFallbackReturnPoint(p);
        // кожного разу нові контрольні точки + невеличкий шум
        const { c1, c2 } = generateCurvedBezierForReturn(p0, p3);
        c1.x += (Math.random() - 0.5) * 60; c1.y += (Math.random() - 0.5) * 60;
        c2.x += (Math.random() - 0.5) * 80; c2.y += (Math.random() - 0.5) * 80;
        p.returnBezier = { p0, c1, c2, p3, t: 0 };
        p.aircraftState = 'returning';

      } else {
        const nx = p.latlng.lng + (dx / dist) * step;
        const ny = p.latlng.lat + (dy / dist) * step;
        const prevPos = { lat: p.latlng.lat, lng: p.latlng.lng };
        p.latlng = L.latLng(ny, nx);
        p.marker.setLatLng(p.latlng);
        p.center = p.latlng;
        if (p.rangeCircle) p.rangeCircle.setLatLng(p.latlng);
        if (p.sectorLayer) p.sectorLayer.setLatLng(p.latlng);
        const dxMove = p.latlng.lng - prevPos.lng;
        const dyMove = p.latlng.lat - prevPos.lat;
        const angleDeg = Math.atan2(dxMove, dyMove) * (180 / Math.PI) + 90;
        const img = p.marker.getElement()?.querySelector("img");
        if (img) img.style.transform = `rotate(${angleDeg}deg)`;
      }
    } 
 else 
 if (p.aircraftState === 'returning') {
      if (p.returnBezier) {
        const { p0, c1, c2, p3 } = p.returnBezier;
        const speed = p.speed * 0.5;
        p.returnBezier.t = Math.min(1, p.returnBezier.t + (delta * gameSpeed) * 0.12 * Math.max(speed, 0.0001));
        const t = p.returnBezier.t;
        const x = Math.pow(1-t,3)*p0.x + 3*Math.pow(1-t,2)*t*c1.x + 3*(1-t)*Math.pow(t,2)*c2.x + Math.pow(t,3)*p3.x;
        const y = Math.pow(1-t,3)*p0.y + 3*Math.pow(1-t,2)*t*c1.y + 3*(1-t)*Math.pow(t,2)*c2.y + Math.pow(t,3)*p3.y;

        const prevPos = { lat: p.latlng.lat, lng: p.latlng.lng };
        p.latlng = L.latLng(y, x);
        p.marker.setLatLng(p.latlng);
        p.center = p.latlng;
        if (p.rangeCircle) p.rangeCircle.setLatLng(p.latlng);
        if (p.sectorLayer) p.sectorLayer.setLatLng(p.latlng);

const dxMove = p.latlng.lng - prevPos.lng;
const dyMove = p.latlng.lat - prevPos.lat;
if (Math.abs(dxMove) + Math.abs(dyMove) > 0.000001) {
  const angleDeg = Math.atan2(dxMove, dyMove) * (180 / Math.PI) + 90;
  const img = p.marker.getElement()?.querySelector("img");
  if (img) img.style.transform = `rotate(${angleDeg}deg)`;
}

        const distEnd = Math.hypot(p3.x - x, p3.y - y);
        if (t >= 1 || distEnd < 10) {
          // Знайти аеродром, у межах якого ми "сіли"
          let dock = null;
          for (const a of airports) {
            if (!a.alive) continue;
            const dToA = getDistance(p.latlng.lat, p.latlng.lng, a.lat, a.lng);
            if (dToA <= (a.radius || 150)) { dock = a; break; }
          }
          // Прибираємо літак з карти — "повністю сховався в аеродромі"
try { map.removeLayer(p.marker); } catch(e){}
if (p.rangeCircle) { try{ map.removeLayer(p.rangeCircle); } catch(e){} p.rangeCircle = null; }
if (p.sectorLayer) { try{ map.removeLayer(p.sectorLayer); } catch(e){} p.sectorLayer = null; }

p.hidden = true;
p.aircraftState = 'cooldown';
p.respawnMs = 30000;
p.returnBezier = null;
p.dockedAirport = dock || null;
// критично: чтобы «невидимка» не вела огонь по координатам
p.latlng = null;

        }
      } else {
        // Без кривої: все одно "ховаємо" на 30с
        // Прив’язка до найближчого живого аеродрому, якщо є
        let dock = null;
        for (const a of airports) {
          if (!a.alive) continue;
          const dToA = getDistance(p.latlng.lat, p.latlng.lng, a.lat, a.lng);
          if (dToA <= (a.radius || 150)) { dock = a; break; }
        }
        try { map.removeLayer(p.marker); } catch(e){}
        p.hidden = true;
        p.aircraftState = 'cooldown';
        p.respawnMs = 30000;
        p.dockedAirport = dock || null;
      }

    }
  }
}

// 2) Які типи доступні в кожному режимі + перезаписи (overrides)
const MODE_LOADOUTS = {
  default: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Аеродром"],
    maxPvoCount: 30,
  },
  tutorial: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Аеродром"],
    maxPvoCount: 30,
  },
  rightOnly: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Аеродром"],
    maxPvoCount: 30,
  },
  hardcore: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Аеродром"],
    overrides: {},
    maxPvoCount: 35,
  },
  radar: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Радар","Аеродром"],
    maxPvoCount: 40,
  },
  sandbox: {
    include: ["Кулемет","MADT","2K12 KUB","Crotale 90M","IRIS-T SML","Кільчень","Patriot","F-16","МіГ-29","Су-27","РЕБ","Аеродром"],
    maxPvoCount: 999,
  }
};

let bricks = 5;   // Цегла
let power  = 5;   // Енергія
let fuel   = 5;   // Пальне
// Матеріал
const PRODUCTION_RULES = {
  tet:   { amount: 1, intervalSec: 5, icon: '<i class="fas fa-bolt" style="color:#FFD700"></i>', targetKey: "power"  },
  gas:   { amount: 1, intervalSec: 10, icon: '<i class="fas fa-gas-pump" style="color:#FF4444"></i>', targetKey: "fuel"   },
  zawod: { amount: 2, intervalSec: 5, icon: '<i class="fas fa-cubes" style="color:#FF9800"></i>', targetKey: "bricks" }
};

// +<i class="fas fa-bolt" style="color:#FFD700"></i>/<i class="fas fa-gas-pump" style="color:#FF4444"></i>/<i class="fas fa-cubes" style="color:#FF9800"></i>
function ensureResAnimCSS() {
  if (document.getElementById("res-float-style")) return;
  const style = document.createElement("style");
  style.id = "res-float-style";
  style.textContent = `
    @keyframes dfFloatUp {
      0%   { transform: translate(-15px, -20px); opacity: 0; }
      10%  { transform: translate(-15px, -50px); opacity: 1; }
      100% { transform: translate(-15px, -70px); opacity: 0; }
    }
    .df-res-float {
      position: relative;
      left: 50%;
      transform: translate(-15px, -20px);
      color: #fff;
      font-weight: 700;
      text-shadow: 0 1px 2px rgba(0,0,0,0.7);
      animation: dfFloatUp 2s ease-out forwards;
      pointer-events: none;
      white-space: nowrap;
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);
}

function spawnResourceFloat(lat, lng, text) {
  ensureResAnimCSS();
  const div = document.createElement("div");
  div.className = "df-res-float";
  div.innerHTML = `+${text}`;
  const m = L.marker([lat, lng], {
    icon: L.divIcon({ html: div, className: "", iconSize: [1,1], iconAnchor: [0, 0] }),
    interactive: false
  }).addTo(map);

  setTimeout(() => { try { map.removeLayer(m); } catch(e){} }, 1000 / Math.max(gameSpeed, 0.01));
}

function updateResourcesUI() {

  const b = document.getElementById("bricksDisplay");
  const p = document.getElementById("powerDisplay");
  const f = document.getElementById("fuelDisplay");
  if (b) b.textContent = bricks;
  if (p) p.textContent = power;
  if (f) f.textContent = fuel;
}
function updateHpUIForPoint(dp){
  const el = dp.hpMarker?.getElement?.();
  if (!el) return;
  const bar = el.querySelector(".hp-bar");
  const txt = el.querySelector(".hp-text");
  if (bar) {
    bar.style.width = `${(Math.max(dp.hp,0) / 100) * 50}px`;
    if (dp.hp > 75) bar.style.background = "limegreen";
    else if (dp.hp > 50) bar.style.background = "yellow";
    else if (dp.hp > 25) bar.style.background = "orange";
    else bar.style.background = "red";
  }
  if (txt) txt.textContent = Math.max(0, Math.min(100, Math.round(dp.hp)));
}

// ---- Розрахунок вартості ремонту для цілі dp ----
function calcRepairCost(dp){
  // Знайти Аварійку
  const av = defensePoints.find(p => p.isAvariika && p.alive);
  if (!av) return null;

  const dx = dp.lng - av.lng;
  const dy = dp.lat - av.lat;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const dist10 = roundTo10(dist);
  const moneyDistance = Math.floor(dist10 / 10) * REPAIR_CONFIG.perDistance.moneyPer10px;
  const fuelUnits = Math.ceil(dist / 100) * REPAIR_CONFIG.perDistance.fuelPer100px;
  const needHp = Math.max(0, 100 - Math.round(dp.hp));
  const perHp = REPAIR_CONFIG.perHp;
  const moneyForHp = needHp * perHp.money;
  const bricksForHp = needHp * perHp.bricks;
  const powerForHp = needHp * perHp.power;

  return {
    distPx: dist,
    distPxRounded10: dist10,
    money: moneyDistance + moneyForHp,
    fuel: fuelUnits,
    bricks: bricksForHp,
    power: powerForHp,
    hpToHeal: needHp,
    avariika: { lat: av.lat, lng: av.lng }
  };
}

// ---- Модалка виклику аварійки ----
function showRepairModal(dp){
  if (!dp || !dp.alive || dp.hp >= 100) return;

  const cost = calcRepairCost(dp);
  const hasAvariika = !!cost;
  const canOnlyOne = !repairState;

  const enough =
    hasAvariika &&
    canOnlyOne &&
    canAfford(cost.money) &&
    bricks >= cost.bricks &&
    power  >= cost.power &&
    fuel   >= cost.fuel;

  // Компонування
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.55); z-index:10010;
    display:flex; align-items:center; justify-content:center;
  `;
  const box = document.createElement("div");
  box.style.cssText = `
    background:#111; color:#fff; border:1px solid #444; border-radius:10px;
    padding:14px 16px; width:320px; font-size:14px; box-shadow:0 0 20px rgba(0,0,0,.6);
  `;
  // Підсвітка дефіциту (червоний)
  const moneyOk  = !cost || canAfford(cost.money);
  const bricksOk = cost && bricks >= cost.bricks;
  const powerOk  = cost && power  >= cost.power;
  const fuelOk   = cost && fuel   >= cost.fuel;

  box.innerHTML = `
    <div style="font-weight:700; font-size:18px; margin-bottom:6px; text-align:center;">Ремонт стратегічного об'єкту.</div>

    <div style="margin:6px 0 8px 0;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span>Міцність споруди:</span>
        <div id="modalHpContainer" style="position:relative;width:120px;height:10px;background:#222;border:1px solid #555;border-radius:4px;overflow:hidden;">
          <div id="modalHpBar" style="height:100%;width:0;background:limegreen;transition:width .15s;"></div>
        </div>
        <span id="modalHpText" style="min-width:36px;text-align:right;display:inline-block;">--%</span>
      </div>
    </div>

    <div>Матеріал, необхідний для ремонту:</div>
    <div style="line-height:1.7;">
      <div><i class="fas fa-coins" style="color:#FFD700"></i> Карбованці: <b id="costMoney">—</b></div>
      <div><i class="fas fa-cubes" style="color:#FF9800"></i> Цегла: <b id="costBricks">—</b></div>
      <div><i class="fas fa-bolt" style="color:#FFD700"></i> Енергія: <b id="costPower">—</b></div>
      <div><i class="fas fa-gas-pump" style="color:#FF4444"></i> Пальне: <b id="costFuel">—</b></div>
    </div>

    <div style="margin-top:10px; display:flex; gap:8px; justify-content:space-between;">
      <button id="dfCallAvariika" style="flex:1; padding:8px; border-radius:8px; border:1px solid #2e7d32; background:#1b5e20; color:#fff; cursor:${enough?'pointer':'not-allowed'}; opacity:${enough?1:0.5};">Викликати Аварійку</button>
      <button id="dfLater" style="flex:1; padding:8px; border-radius:8px; border:1px solid #555; background:#333; color:#fff; cursor:pointer;">Можливо, пізніше…</button>
    </div>

    <div id="repairHint" style="margin-top:8px; color:#f55; font-size:12px; min-height:16px;">
      ${!hasAvariika ? "Спочатку потрібно збудувати Аварійку!" : (!canOnlyOne ? "Зараз уже ремонтують інший об'єкт." : "&nbsp;")}
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const btnOk   = box.querySelector("#dfCallAvariika");
  const btnLater= box.querySelector("#dfLater");
  const hpBar   = box.querySelector("#modalHpBar");
  const hpText  = box.querySelector("#modalHpText");
  const elMoney = box.querySelector("#costMoney");
  const elBr    = box.querySelector("#costBricks");
  const elPow   = box.querySelector("#costPower");
  const elFuel  = box.querySelector("#costFuel");
  const hintEl  = box.querySelector("#repairHint");

  let closed = false;
  function cleanup(){
    if (closed) return;
    closed = true;
    try { clearInterval(ticker); } catch(e){}
    try { document.body.removeChild(overlay); } catch(e){}
  }

  function paintValue(el, val, ok){
    if (!el) return;
    el.textContent = (val ?? "—");
    el.style.color = ok ? "#0f0" : "#f55";
  }

  function updateUI(){
    // якщо ціль мертва/здорова/зникла — закриваємо вікно
    if (!dp || !dp.alive) { cleanup(); return; }
    if (dp.hp >= 100)     { cleanup(); return; }
    const avAlive = defensePoints.some(p => p.isAvariika && p.alive);
    if (!avAlive)         { cleanup(); return; }

    // перерахунок вартості «тут і зараз»
    const c = calcRepairCost(dp);
    if (!c) { cleanup(); return; }

    // HP бар
    const hp = Math.max(0, Math.min(100, Math.round(dp.hp)));
    if (hpBar){
      hpBar.style.width = hp + "%";
      hpBar.style.background = hp > 75 ? "limegreen" : (hp > 50 ? "yellow" : (hp > 25 ? "orange" : "red"));
    }
    if (hpText){ hpText.textContent = hp + "%"; }

    // ресурси (онлайн-оновлення + підсвітка дефіциту)
    const moneyOk  = canAfford(c.money);
    const bricksOk = bricks >= c.bricks;
    const powerOk  = power  >= c.power;
    const fuelOk   = fuel   >= c.fuel;

    paintValue(elMoney, c.money,  moneyOk);
    paintValue(elBr,    c.bricks, bricksOk);
    paintValue(elPow,   c.power,  powerOk);
    paintValue(elFuel,  c.fuel,   fuelOk);

    const canOnlyOneNow = !repairState;
    const enoughNow = (Number.isNaN(money) || moneyOk) && bricksOk && powerOk && fuelOk && canOnlyOneNow && avAlive;

    // кнопки живі/мертві
    if (btnOk){
      btnOk.disabled = !enoughNow;
      btnOk.style.background = enoughNow ? "#28a745" : "#333";
      btnOk.style.cursor = enoughNow ? "pointer" : "not-allowed";
    }
    if (hintEl){
      hintEl.style.color = (!hasAvariika || !canOnlyOneNow) ? "#f55" : "#aaa";
      hintEl.innerHTML =
        !avAlive ? "Аварійка знищена." :
        (!hasAvariika ? "Спочатку потрібно збудувати Аварійку!" :
         (!canOnlyOneNow ? "Зараз уже ремонтують інший об'єкт." : "&nbsp;"));
    }
  }

  // перший малюнок і тікер
  updateUI();
  const ticker = setInterval(updateUI, 150);

  btnLater.onclick = cleanup;

  btnOk.onclick = () => {
    // перед стартом — ще раз звіряємо вартість і наявність ресурсів
    const c = calcRepairCost(dp);
    if (!c) { cleanup(); return; }

    const moneyOk  = canAfford(c.money);
    const bricksOk = bricks >= c.bricks;
    const powerOk  = power  >= c.power;
    const fuelOk   = fuel   >= c.fuel;
    const canOnlyOneNow = !repairState;

    if (!( (Number.isNaN(money) || moneyOk) && bricksOk && powerOk && fuelOk && canOnlyOneNow )) return;

    spendMoney(c.money);
    bricks -= c.bricks;
    power  -= c.power;
    fuel   -= c.fuel;
    updateMoney();
    updateResourcesUI();

    startRepair(dp, c);
    cleanup();
  };
}

function startRepair(dp, cost){
  if (!cost) return;

  // Вибір спрайта за горизонталлю
  const dLng0 = dp.lng - cost.avariika.lng;
  const carImg = dLng0 > 0 ? "assets/avariikacar2.png" : "assets/avariikacar1.png";

  const icon = L.divIcon({
    className: "rotating-icon",
    html: `<img id="avariikaCarImg" src="${carImg}" style="width:42px;height:42px;transition:transform 0.2s;" />`,
    iconSize: [50,50],
    iconAnchor: [25,25]
  });

  // Старт із бази аварійки
  const carMarker = L.marker([cost.avariika.lat, cost.avariika.lng], { icon }).addTo(map);

  // Критично: правильне збереження координат аварійки
  repairState = {
    target: dp,
    carMarker,
    phase: 'toTarget',
    lastHpProbe: dp.hp,
    lastTick: performance.now(),
    carPos: [cost.avariika.lat, cost.avariika.lng],
    speed: REPAIR_CONFIG.carSpeed,
    avariika: { lat: cost.avariika.lat, lng: cost.avariika.lng },
    cost,
    hpToHeal: cost.hpToHeal
  };

  // (Необов’язково) Тригер для туторіалу/логіки, якщо захочеш слухати події
  try { window.dispatchEvent(new CustomEvent('repair:started', { detail: { targetId: dp?.id ?? null } })); } catch(e){}

  requestAnimationFrame(repairTick);
}

// ---- Головний цикл аварійки ----
function repairTick(now){
  if (!repairState) return;
  const s = repairState;

  // Умови скасування
  const avAlive = defensePoints.some(p => p.isAvariika && p.alive);
  if (!avAlive) return stopRepair("destroyedBase");
  if (!s.target.alive) return stopRepair("targetLost");

  // якщо під час ремонту ціль була пошкоджена (hp < lastHpProbe) — скасувати
  if (s.phase === 'repair' && s.target.hp < s.lastHpProbe - 0.1) {
    return stopRepair("wounded");
  }
  s.lastHpProbe = s.target.hp;

  if (s.phase === 'toTarget') {
    // рух до цілі по прямій
    const dx = s.target.lat - s.carPos[0];
    const dy = s.target.lng - s.carPos[1];
    const dist = Math.hypot(dx, dy);
    if (dist < 20) {
      s.phase = 'repair';
      s.lastTick = now;
    } else {
      const k = (s.speed * gameSpeed) / Math.max(dist, 0.0001);
      s.carPos[0] += dx * k;
      s.carPos[1] += dy * k;
      s.carMarker.setLatLng(s.carPos);
      // Перевіряємо напрямок і міняємо спрайт за квадрантом
const imgEl = s.carMarker._icon?.querySelector("#avariikaCarImg");
if (imgEl) {
  // Орієнтуємось тільки по довготі: якщо ціль правіше — беримо спрайт, що дивиться вправо
  const dLng = s.target.lng - s.carPos[1];
  const needSrc = dLng > 0 ? "assets/avariikacar2.png" : "assets/avariikacar1.png";
  if (imgEl.getAttribute("src") !== needSrc) imgEl.setAttribute("src", needSrc);
}



    }
  } else if (s.phase === 'repair') {
    // відновлення 1 HP/сек
    const dt = Math.max(0, (now - s.lastTick) / 1000) * gameSpeed;
    const inc = REPAIR_CONFIG.hpPerSec * dt;
    if (inc >= 1) {
      const add = Math.floor(inc);
      s.target.hp = Math.min(100, s.target.hp + add);
      updateHpUIForPoint(s.target);
      s.lastTick = now;
      if (s.target.hp >= 100) {
        s.phase = 'return';
      }
    }
  } else if (s.phase === 'return') {
    // поїхали назад
    const dx = s.avariika.lat - s.carPos[0];
    const dy = s.avariika.lng - s.carPos[1];
    const dist = Math.hypot(dx, dy);
    if (dist < 2) {
      // прибули — зникаємо
      try { map.removeLayer(s.carMarker); } catch(e){}
      repairState = null;
      return;
    } else {
      const k = (s.speed * gameSpeed) / Math.max(dist, 0.0001);
      s.carPos[0] += dx * k;
      s.carPos[1] += dy * k;
      s.carMarker.setLatLng(s.carPos);
      // Перевіряємо напрямок і міняємо спрайт за квадрантом
const imgEl = s.carMarker._icon?.querySelector("#avariikaCarImg");
if (imgEl) {
  // Повертаємось до бази: дивимось, де база по довготі відносно поточної позиції
  const dLngBack = s.avariika.lng - s.carPos[1];
  const needSrc = dLngBack > 0 ? "assets/avariikacar2.png" : "assets/avariikacar1.png";
  if (imgEl.getAttribute("src") !== needSrc) imgEl.setAttribute("src", needSrc);
}

    }
  }

  requestAnimationFrame(repairTick);
}

// ---- Зупинка ремонту та нотифікація (для випадку поранення) ----
function stopRepair(reason){
  if (!repairState) return;
  try { map.removeLayer(repairState.carMarker); } catch(e){}
  repairState = null;

  if (reason === "wounded" || reason === "targetLost") {
    const woundedMessage = (REPAIR_CONFIG.ui && REPAIR_CONFIG.ui.woundedMsg)
      ? REPAIR_CONFIG.ui.woundedMsg
      : "Бригада аварійки поранена! Дайте їм час на відновлення.";
    showHudNotification(woundedMessage, "alert");
  }
}

function getCurrentMode() {
  if (tutorialMode) return "tutorial";
  if (sandboxMode) return "sandbox";
  if (radarMode) return "radar";
  if (hardcoreMode) return "hardcore";
  if (rightOnlyMode) return "rightOnly";
  return "default";
}
function applyModeSettings() {
  const mode = getCurrentMode();
  const cfg = MODE_LOADOUTS[mode] || MODE_LOADOUTS.default;
  pvoTypes = buildPvoTypesForMode();
  
  // Для ranked mode лимит ППО = кількість об'єктів × 3
  if (window.rankedMode && typeof window.getRankedMaxPVO === 'function') {
    MAX_PVO_COUNT = window.getRankedMaxPVO();
    console.log(`🏆 Ranked MAX_PVO_COUNT = ${MAX_PVO_COUNT}`);
  } else {
    MAX_PVO_COUNT = cfg.maxPvoCount || 20;
  }
  updatePvoPurchaseAvailability?.();
}
let pvoTypes = [];
function _clone(obj){ return JSON.parse(JSON.stringify(obj)); }


function buildPvoTypesForMode() {
  if (window.rankedMode) {
    const list = window.getRankedPPOList();
    if (list && list.length > 0) {
      console.log('🏆 Ранковий список активовано');
      // Додаємо Аеродром для ranked mode (завжди доступний)
      const aerodrom = PPO_CONFIG['Аеродром'];
      if (aerodrom && !list.find(p => p.name === 'Аеродром')) {
        list.push(_clone(aerodrom));
        console.log('✈️ Аеродром додано до ranked mode');
      }
      return list;
    }
  }
  const mode = tutorialMode
    ? "tutorial"
    : sandboxMode
      ? "sandbox"
      : radarMode
        ? "radar"
        : hardcoreMode
          ? "hardcore"
          : rightOnlyMode
            ? "rightOnly"
            : "default";
  const cfg = MODE_LOADOUTS[mode] || MODE_LOADOUTS.default;
  let arr = cfg.include
    .map(name => PPO_CONFIG[name] ? _clone(PPO_CONFIG[name]) : null)
    .filter(x => x !== null);
  if (cfg.overrides) {
    Object.entries(cfg.overrides).forEach(([name, ov]) => {
      const t = arr.find(x => x.name === name);
      if (t) Object.assign(t, ov);
    });
  }
  return arr;
}
const pvoColorMap = {
  "Кулемет": "#c5ff50ff",
  "MADT": "#8B4513",
  "2K12 KUB": "#00c28eff",
  "Crotale 90M": "#FF6B35",
  "IRIS-T SML": "#00CED1",
  "Кільчень": "#ff5555ff",
  "Patriot": "#228B22",
  "РЕБ": "#9403c9ff",
  "F-16": "#00ffb7ff",
  "МіГ-29": "#585858ff",
  "Су-27": "#00aeffff",
  "Аеродром": "#1f8cff",
  "Радар": "#00ff15ff",
};
const pvoPurchaseCounts = {};
let sellPVOButton, movePVOButton, upgradePVOButton, upgradeInfo, removeButton;
function setupPvoMenu() {
  // Рендеримо стартовий список доступних ППО/елементів (без кнопок дій)
  pvoMenu.innerHTML = "";
  sellPVOButton = null;
  movePVOButton = null;
  upgradePVOButton = null;
  upgradeInfo = null;
  removeButton = null;
  // selectedTarget / selectedAirport НЕ трогаем — нужны для работы кнопки "Удалить"


  const aliveAirports = airports.filter(a => a.alive);
  const airportExists = aliveAirports.length > 0;
  const showPlanes = airportExists; // літаки видно тільки коли аеродром живий

  // Грід ППО (фільтруємо те, що дозволено показувати зараз)
  pvoTypes.forEach(type => {
    // 1) Ховаємо літаки, якщо немає аеродрому
    if ((type.name === "F-16" || type.name === "Су-27" || type.name === "МіГ-29") && !showPlanes) return;
    // 2) Кнопка аеродрому — не в гріді (внизу окремою кнопкою), не малюємо тут
    if (type.name === "Аеродром") return;
    // 3) Радар — лише в radarMode/sandbox (якщо buildPvoTypesForMode не відсік)
    if (type.name === "Радар" && !radarMode && !sandboxMode) return;

    const div = document.createElement("div");
    div.className = "pvo-item";
    const count = pvoPurchaseCounts[type.name] || 0;
    const dynamicPrice = Math.floor(type.price * Math.pow(1.2, count));

    div.innerHTML = `
      <img src="${type.img}" />
      <b>${type.name}</b>
      <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${dynamicPrice}</span>
    `;

    div.onclick = () => {
      // Тогл вибору: другий клік по тій самій кнопці скасовує покупку
      if (buyingMode && selectedPVO && selectedPVO.name === type.name) {
        buyingMode = false;
        selectedPVO = null;
        document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
        return;
      }

      // Перевірки доступності
      if ((type.name === "F-16" || type.name === "Су-27" || type.name === "МіГ-29") && !showPlanes) {
        alert("✖ Спочатку побудуй Аеродром!");
        return;
      }
      if (!sandboxMode) {
        const canPay = canAfford(dynamicPrice);
        if (!canPay) {
          alert(`Недостатньо коштів, потрібно: ${Math.round(dynamicPrice)} карбованців.`);
          return;
        }
      }

      selectedPVO = type;
      buyingMode = true;
      document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
    };

    pvoMenu.appendChild(div);
  });

  // Кнопка "Аеродром": показуємо лише якщо його немає на карті і він не в процесі спавну
    // --- Пісочниця: кнопки спавну ворогів і цілей у стилі поточних pvo-item ---
  if (sandboxMode) {
    currentWave = 12;

    // 100 Шахедів
    const droneSpawnerDiv = document.createElement("div");
    droneSpawnerDiv.className = "pvo-item sandbox-button";
    droneSpawnerDiv.innerHTML = `
      <img src="assets/drone.png" />
      <b>100 Шахедів</b><br/>
    `;
    droneSpawnerDiv.onclick = () => { spawnWave(100, 0, 0); };
    pvoMenu.appendChild(droneSpawnerDiv);

    // 100 Ракет
    const rocketSpawnerDiv = document.createElement("div");
    rocketSpawnerDiv.className = "pvo-item sandbox-button";
    rocketSpawnerDiv.innerHTML = `
      <img src="assets/rocket1.png" />
      <b>100 Ракет</b><br/>
    `;
    rocketSpawnerDiv.onclick = () => { spawnWave(0, 100, 0); };
    pvoMenu.appendChild(rocketSpawnerDiv);

    // 100 Дронів (важких)
    const heavyDronesSpawnerDiv = document.createElement("div");
    heavyDronesSpawnerDiv.className = "pvo-item sandbox-button";
    heavyDronesSpawnerDiv.innerHTML = `
      <img src="assets/heavy-drone.png" />
      <b>100 Дронів</b><br/>
    `;
    heavyDronesSpawnerDiv.onclick = () => { spawnWave(0, 0, 100); };
    pvoMenu.appendChild(heavyDronesSpawnerDiv);

    // Ручний спавн цілі
    const targetSpawnerDiv = document.createElement("div");
    targetSpawnerDiv.className = "pvo-item sandbox-button";
    targetSpawnerDiv.innerHTML = `
      <img src="assets/tet.png" />
      <b>Ціль</b><br/>
    `;
    targetSpawnerDiv.onclick = () => {
      selectedPVO = { name: "TargetSpawner", price: 0, radius: 0, img: "", iconSize: [0, 0] };
      buyingMode = true;
      document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
      targetSpawnerDiv.classList.add('selected');
      if (sellPVOButton) sellPVOButton.disabled = true;
      if (upgradePVOButton) upgradePVOButton.disabled = true;
      if (upgradeInfo) upgradeInfo.textContent = "";
      if (removeButton) removeButton.disabled = true;
    };
    pvoMenu.appendChild(targetSpawnerDiv);

    // Кнопка видалення вибраної цілі/аеродрому у пісочниці
    removeButton = document.createElement("button");
    removeButton.className = "pvo-button";
    removeButton.innerHTML = `🗑️<br>${typeof translate === 'function' ? translate('delete', 'game') : 'Видалити'}`;
    removeButton.disabled = true;
    removeButton.onclick = () => {
      if (selectedTarget) {
        try { map.removeLayer(selectedTarget.marker); } catch(e){}
        try { if (selectedTarget.noBuildCircle) map.removeLayer(selectedTarget.noBuildCircle); } catch(e){}
        try { if (selectedTarget.hpMarker) map.removeLayer(selectedTarget.hpMarker); } catch(e){}
        const idx = defensePoints.indexOf(selectedTarget);
        if (selectedTarget.isAvariika) {
          avariikaActive = false;
          updatePvoPurchaseAvailability?.();
        }
        if (idx !== -1) defensePoints.splice(idx, 1);
        const allIdx = allDefensePoints.indexOf([selectedTarget.lat, selectedTarget.lng]);
        if (allIdx !== -1) allDefensePoints.splice(allIdx, 1);
        selectedTarget = null;
      } else if (selectedAirport) {
        destroyPlanesDockedAtAirport(selectedAirport);
        try { map.removeLayer(selectedAirport.marker); } catch(e){}
        try { if (selectedAirport.noBuildCircle) map.removeLayer(selectedAirport.noBuildCircle); } catch(e){}
        try { if (selectedAirport.hpMarker) map.removeLayer(selectedAirport.hpMarker); } catch(e){}
        const idx = airports.indexOf(selectedAirport);
        if (idx !== -1) airports.splice(idx, 1);
        selectedAirport = null;
        updatePvoPurchaseAvailability?.();
      }
      removeButton.disabled = true;
      selectedPVO = null;
      if (sellPVOButton) sellPVOButton.disabled = true;
      if (upgradePVOButton) upgradePVOButton.disabled = true;
      if (upgradeInfo) upgradeInfo.textContent = "";
      document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
    };
    pvoMenu.appendChild(removeButton);
  }

  const airportType = pvoTypes.find(t => t.name === "Аеродром");
  const canShowAirportButton = !!airportType && !airportExists && !isAirportSpawning;
  if (canShowAirportButton) {
    const airportCount = pvoPurchaseCounts[airportType.name] || 0;
    const airportPrice = Math.floor(airportType.price * Math.pow(1.2, airportCount));
    const airportButton = document.createElement("button");
    airportButton.className = "pvo-button";
    airportButton.id = "airportButton";
    airportButton.innerHTML = `
      <img src="assets/aeroport.png" alt="Аеродром" />
      <b>Аеродром</b>
      <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${airportPrice}</span>
    `.trim();

    airportButton.onclick = () => {
      if (sandboxMode) {
        selectedPVO = airportType;
        buyingMode = true;
        document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
        airportButton.classList.add('selected');
        return;
      }
      const count = pvoPurchaseCounts[airportType.name] || 0;
      const dynamicPrice = Math.floor(airportType.price * Math.pow(1.2, count));
      if (!Number.isNaN(money) && money < dynamicPrice) {
        alert(`Недостатньо коштів, потрібно ${Math.round(dynamicPrice)} карбованців.`);
        return;
      }
      spendMoney(dynamicPrice);
      updateMoney();
      pvoPurchaseCounts[airportType.name] = count + 1;
      updatePvoMenuPrice(airportType.name);

      const airportCoords = [2250, 700];
      const progressBarContainer = document.createElement("div");
      progressBarContainer.className = "progress-bar-container";
      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";
      progressBarContainer.appendChild(progressBar);
      progressBarMarker = L.marker(airportCoords, {
        icon: L.divIcon({ html: progressBarContainer, className: "", iconSize: [60, 8], iconAnchor: [30, 4] })
      }).addTo(map);
      isAirportSpawning = true;
      updatePvoPurchaseAvailability?.();

      const spawnDuration = 5000;
      let lastUpdateTime = performance.now();
      let accumulatedTime = 0;
      function updateProgressBar(currentTime) {
        const deltaTime = (currentTime - lastUpdateTime) * gameSpeed;
        accumulatedTime += deltaTime;
        lastUpdateTime = currentTime;
        const progress = Math.min((accumulatedTime / spawnDuration) * 100, 100);
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
          if (progressBarMarker) { try { map.removeLayer(progressBarMarker); } catch(e){} progressBarMarker = null; }
          activateAirport(airportCoords);
          setupPvoMenu();
        } else {
          requestAnimationFrame(updateProgressBar);
        }
      }
      requestAnimationFrame(updateProgressBar);
    };

    pvoMenu.appendChild(airportButton);
  }

  // Кнопка "Аварійка": показуємо тільки якщо її ще немає
  if (!avariikaActive) {
    const avBase = 1500;
    const avCount = pvoPurchaseCounts["Аварійка"] || 0;
    const avPrice = Math.floor(avBase * Math.pow(1.2, avCount));
    const avBtn = document.createElement("button");
    avBtn.className = "pvo-button";
    avBtn.id = "avariikaButton";
    avBtn.innerHTML = `
      <img src="assets/avariika.png" alt="Аварійка" />
      <b>Аварійка</b>
      <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${avPrice}</span>
    `.trim();

    avBtn.onclick = () => {
      if (avariikaActive) {
        alert("✖ Аварійка вже встановлена. Дозволено лише одну.");
        return;
      }
      selectedPVO = { name: "Аварійка", price: avBase, radius: 150, img: "assets/avariika.png", iconSize: [60,60] };
      buyingMode = true;
      document.querySelectorAll('.pvo-item, .pvo-button').forEach(el => el.classList.remove('selected'));
      avBtn.classList.add('selected');
    };

    pvoMenu.appendChild(avBtn);
  }
}


function spawnWave(droneCount = 3, rocketCount = 0, heavyDroneCount = 0) {
  if (rightOnlyMode) {
    spawnFromRightOnly(droneCount, rocketCount, heavyDroneCount);
    return;
  }
  for (let i = 0; i < droneCount; i++) {
    let startLat, startLng;
    let spawnDirections = ["right"];
    if (currentWave >= 4) spawnDirections.push("bottom");
    if (currentWave >= 8) spawnDirections.push("top");
    if (currentWave >= 12) spawnDirections.push("left");
    const chosenDirection = spawnDirections[Math.floor(Math.random() * spawnDirections.length)];
    if (chosenDirection === "right") {
      startLat = Math.random() * 2829;
      startLng = 4000 + Math.random() * 200;
    } else if (chosenDirection === "bottom") {
      startLat = 2829 + Math.random() * 200;
      startLng = Math.random() * 4000;
    } else if (chosenDirection === "top") {
      startLat = -100 + Math.random() * 100;
      startLng = Math.random() * 4000;
    } else if (chosenDirection === "left") {
      startLat = Math.random() * 2829;
      startLng = -100 + Math.random() * 100;
    }
    const target = getRandomTarget(true, true);
    let end;
    if (!target) {
      if (sandboxMode) {
        end = [Math.random() * 2829, Math.random() * 4000];
      } else {
        console.warn(`No valid target available for light drone spawn (wave ${currentWave + 1})`);
        continue;
      }
    } else {
      end = [target.lat, target.lng];
    }
// Використовуємо конфігурацію з enemies-config.js
    const enemyConfig = createEnemy('shahed', currentWave + 1);
    
    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="${enemyConfig.img}" width="${enemyConfig.iconSize[0]}" height="${enemyConfig.iconSize[1]}" />`,
        iconSize: enemyConfig.iconSize,
        iconAnchor: enemyConfig.iconAnchor
      })
    }).addTo(map);
    const initialOpacity = radarMode ? 0 : 1;
    marker.setOpacity(initialOpacity);
    const start = [startLat, startLng];
    const control = generateControlPoint(start, end);
    const totalLength = approximateBezierLength(start, control, end);
    drones.push({
      type: "light",
      position: start,
      start: start.slice(),
      control: control,
      target: end.slice(),
      totalLength: totalLength,
      t: 0,
      marker,
      speed: enemyConfig.speed,
      speedOriginal: enemyConfig.speed,
      hp: enemyConfig.hp,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }
  // Similar for heavyDroneCount and rocketCount, but for brevity, assume similar logic for them if needed
  for (let i = 0; i < heavyDroneCount; i++) {
    // ... similar to light, with heavy params
    let startLat, startLng;
    let spawnDirections = ["right"];
    if (currentWave >= 4) spawnDirections.push("bottom");
    if (currentWave >= 8) spawnDirections.push("top");
    if (currentWave >= 12) spawnDirections.push("left");
    const chosenDirection = spawnDirections[Math.floor(Math.random() * spawnDirections.length)];
    if (chosenDirection === "right") {
      startLat = Math.random() * 2829;
      startLng = 4000 + Math.random() * 200;
    } else if (chosenDirection === "bottom") {
      startLat = 2829 + Math.random() * 200;
      startLng = Math.random() * 4000;
    } else if (chosenDirection === "top") {
      startLat = -100 + Math.random() * 100;
      startLng = Math.random() * 4000;
    } else if (chosenDirection === "left") {
      startLat = Math.random() * 2829;
      startLng = -100 + Math.random() * 100;
    }
    const target = getRandomTarget(true, true);
    let end;
    if (!target) {
      if (sandboxMode) {
        end = [Math.random() * 2829, Math.random() * 4000];
      } else {
        console.warn(`No valid target available for heavy drone spawn (wave ${currentWave + 1})`);
        continue;
      }
    } else {
      end = [target.lat, target.lng];
    }
// Використовуємо конфігурацію з enemies-config.js
    const enemyConfig = createEnemy('heavyDrone', currentWave + 1);
    
    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="${enemyConfig.img}" width="${enemyConfig.iconSize[0]}" height="${enemyConfig.iconSize[1]}" />`,
        iconSize: enemyConfig.iconSize,
        iconAnchor: enemyConfig.iconAnchor
      })
    }).addTo(map);
    const initialOpacity = radarMode ? 0 : 1;
    marker.setOpacity(initialOpacity);
    const start = [startLat, startLng];
    const control = generateControlPoint(start, end);
    const totalLength = approximateBezierLength(start, control, end);
    drones.push({
      type: "heavy",
      position: start.slice(),
      start: start.slice(),
      control: control,
      target: end.slice(),
      totalLength: totalLength,
      t: 0,
      marker,
      speed: enemyConfig.speed,
      speedOriginal: enemyConfig.speed,
      hp: enemyConfig.hp,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }
  for (let i = 0; i < rocketCount; i++) {
    let startLat, startLng;
    const direction = ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)];
    if (direction === "left") {
      startLat = Math.random() * 2829;
      startLng = -200;
    } else if (direction === "right") {
      startLat = Math.random() * 2829;
      startLng = 4000 + 200;
    } else if (direction === "top") {
      startLat = -200;
      startLng = Math.random() * 4000;
    } else if (direction === "bottom") {
      startLat = 2829 + 200;
      startLng = Math.random() * 4000;
    }
    const target = getRandomTarget(false, true);
    let end;
    if (!target) {
      if (sandboxMode) {
        end = [Math.random() * 2829, Math.random() * 4000];
      } else {
        console.warn(`No valid target available for rocket spawn (wave ${currentWave + 1})`);
        continue;
      }
    } else {
      end = [target.lat, target.lng];
    }
    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="assets/rocket1.png" width="40" height="40" />`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
    }).addTo(map);
    const initialOpacity = radarMode ? 0 : 1;
    marker.setOpacity(initialOpacity);
    rockets.push({
      position: [startLat, startLng],
      marker,
      target: end,
      speed: (1.2 + Math.random() * 1.6) + currentWave * 0.01,
      speedOriginal: (1.2 + Math.random() * 1.6) + currentWave * 0.01,
      hp: 25 + currentWave * 15,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }
}
function spawnFromRightOnly(droneCount, rocketCount, heavyDroneCount = 0) {
  const targetPoints = defensePoints.filter(p => p.alive);

  // ---- ЛЕГКІ ДРОНИ ----
  for (let i = 0; i < droneCount; i++) {
    const [startLat, startLng] = spawnRight();

    // вибір цілі: інколи аеродром, інколи ППО, інакше – ціль
    let target, targetLat, targetLng;
    const rand = Math.random();
    if (rand < 0.1 && airports.some(a => a.alive)) {
      const aliveAirports = airports.filter(a => a.alive);
      target = aliveAirports[Math.floor(Math.random() * aliveAirports.length)];
      targetLat = target.lat; targetLng = target.lng;
    } else if (rand < 0.3 && pvoList.length > 0) {
      const targetablePVOs = pvoList.filter(pvo => pvo.targetableByDrones);
      if (targetablePVOs.length > 0) {
        target = targetablePVOs[Math.floor(Math.random() * targetablePVOs.length)];
        if (target.latlng) { targetLat = target.latlng.lat; targetLng = target.latlng.lng; }
      }
    }
    if (targetLat == null || targetLng == null) {
      if (targetPoints.length > 0) {
        const t = targetPoints[Math.floor(Math.random() * targetPoints.length)];
        targetLat = t.lat; targetLng = t.lng;
      } else if (sandboxMode) {
        targetLat = Math.random() * 2829; targetLng = Math.random() * 4000;
      } else {
        console.warn(`No valid target for light drone (rightOnly, wave ${currentWave + 1})`);
        continue;
      }
    }

// Використовуємо конфігурацію з enemies-config.js
    const enemyConfig = createEnemy('shahed', currentWave + 1);
    
    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="${enemyConfig.img}" width="${enemyConfig.iconSize[0]}" height="${enemyConfig.iconSize[1]}" />`,
        iconSize: enemyConfig.iconSize,
        iconAnchor: enemyConfig.iconAnchor
      })
    }).addTo(map);
    marker.setOpacity(radarMode ? 0 : 1);

    const start = [startLat, startLng];
    const end = [targetLat, targetLng];
    const control = generateControlPoint(start, end);
    const totalLength = approximateBezierLength(start, control, end);

    drones.push({
      type: "light",
      position: start.slice(),
      start: start.slice(),
      control,
      target: end.slice(),
      totalLength,
      t: 0,
      marker,
      speed: enemyConfig.speed,
      speedOriginal: enemyConfig.speed,
      hp: enemyConfig.hp,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }

  // ---- ВАЖКІ ДРОНИ ----
  for (let i = 0; i < heavyDroneCount; i++) {
    const [startLat, startLng] = spawnRight();

    let target, targetLat, targetLng;
    const rand = Math.random();
    if (rand < 0.1 && airports.some(a => a.alive)) {
      const aliveAirports = airports.filter(a => a.alive);
      target = aliveAirports[Math.floor(Math.random() * aliveAirports.length)];
      targetLat = target.lat; targetLng = target.lng;
    } else if (rand < 0.3 && pvoList.length > 0) {
      const targetablePVOs = pvoList.filter(pvo => pvo.targetableByDrones);
      if (targetablePVOs.length > 0) {
        target = targetablePVOs[Math.floor(Math.random() * targetablePVOs.length)];
        if (target.latlng) { targetLat = target.latlng.lat; targetLng = target.latlng.lng; }
      }
    }
    if (targetLat == null || targetLng == null) {
      if (targetPoints.length > 0) {
        const t = targetPoints[Math.floor(Math.random() * targetPoints.length)];
        targetLat = t.lat; targetLng = t.lng;
      } else if (sandboxMode) {
        targetLat = Math.random() * 2829; targetLng = Math.random() * 4000;
      } else {
        console.warn(`No valid target for heavy drone (rightOnly, wave ${currentWave + 1})`);
        continue;
      }
    }

// Використовуємо конфігурацію з enemies-config.js
    const enemyConfig = createEnemy('heavyDrone', currentWave + 1);
    
    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="${enemyConfig.img}" width="${enemyConfig.iconSize[0]}" height="${enemyConfig.iconSize[1]}" />`,
        iconSize: enemyConfig.iconSize,
        iconAnchor: enemyConfig.iconAnchor
      })
    }).addTo(map);
    marker.setOpacity(radarMode ? 0 : 1);

    const start = [startLat, startLng];
    const end = [targetLat, targetLng];
    const control = generateControlPoint(start, end);
    const totalLength = approximateBezierLength(start, control, end);

    drones.push({
      type: "heavy",
      position: start.slice(),
      start: start.slice(),
      control,
      target: end.slice(),
      totalLength,
      t: 0,
      marker,
      speed: enemyConfig.speed,
      speedOriginal: enemyConfig.speed,
      hp: enemyConfig.hp,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }

  // ---- РАКЕТИ ----
  for (let i = 0; i < rocketCount; i++) {
    // все одно з ПРАВОГО краю
    const totalHeight = 2829;
    const startLat = Math.random() * totalHeight;
    const startLng = 4000 + 200;

    let t = getRandomTarget(false, true);
    let end;
    if (!t) {
      if (sandboxMode) end = [Math.random() * 2829, Math.random() * 4000];
      else {
        console.warn(`No valid target for rocket (rightOnly, wave ${currentWave + 1})`);
        continue;
      }
    } else end = [t.lat, t.lng];

    const marker = L.marker([startLat, startLng], {
      icon: L.divIcon({
        className: "rotating-icon",
        html: `<img src="assets/rocket1.png" width="40" height="40" />`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
    }).addTo(map);
    marker.setOpacity(radarMode ? 0 : 1);

    rockets.push({
      position: [startLat, startLng],
      marker,
      target: end,
      speed: (1.2 + Math.random() * 1.6) + currentWave * 0.01,
      speedOriginal: (1.2 + Math.random() * 1.6) + currentWave * 0.01,
      hp: 25 + currentWave * 15,
      visible: !radarMode
    });
    // Додаємо обробник кліку
  }
}
function spawnRight() {
  const totalHeight = 2829;
  const rnd = Math.random();
  let lat = rnd < 0.3 ? Math.random() * (totalHeight * 0.3) : totalHeight * 0.3 + Math.random() * (totalHeight * 0.7);
  const lng = 4000 + Math.random() * 200;
  return [lat, lng];
}
function triggerWaveAlarm() {
  if (isSoundOn) {
    alarmSound.currentTime = 0;
    alarmSound.play();
  }
}

// Mapping українських назв регіонів на ключі перекладу
const REGION_KEYS = {
  "Рівненській": "regionRivne",
  "Житомирській": "regionZhytomyr",
  "Київській": "regionKyiv",
  "Чернігівській": "regionChernihiv",
  "Запорізькій": "regionZaporizhzhia",
  "Кримській": "regionCrimea",
  "Львівській": "regionLviv",
  "Закарпатській": "regionZakarpattia",
  "Івано-Франківській": "regionIvanoFrankivsk",
  "Чернівецькій": "regionChernivtsi",
  "Тернопільській": "regionTernopil",
  "Хмельницькій": "regionKhmelnytskyi",
  "Вінницькій": "regionVinnytsia",
  "Кіровоградській": "regionKirovohrad",
  "Миколаївській": "regionMykolaiv",
  "Херсонській": "regionKherson",
  "Донецькій": "regionDonetsk",
  "Харківській": "regionKharkiv",
  "Полтавській": "regionPoltava",
  "Сумській": "regionSumy",
  "Черкаській": "regionCherkasy",
  "Одеській": "regionOdesa",
  "Дніпропетровській": "regionDnipro"
};

function showTargetNotification(region) {
  const nextTarget = typeof translate === 'function' ? translate('nextTargetIn', 'game') : 'Наступна ціль в';
  const regionText = typeof translate === 'function' ? translate('region', 'game') : 'області';
  
  // Перекласти назву регіону
  let translatedRegion = region;
  if (typeof translate === 'function' && REGION_KEYS[region]) {
    translatedRegion = translate(REGION_KEYS[region], 'game');
  }
  
  const msg = `${nextTarget} ${translatedRegion} ${regionText}`;
  showHudNotification(msg, "info");
}


function getRandomSpawnPoint(region) {
  const availablePoints = regionSpawnPoints[region].filter(
    point => !usedSpawnPoints.some(used => used[0] === point[0] && used[1] === point[1])
  );
  if (availablePoints.length === 0) {
    console.warn(`No available spawn points in ${region}, falling back to any available point`);
    const allPoints = Object.values(regionSpawnPoints).flat().filter(
      point => !usedSpawnPoints.some(used => used[0] === point[0] && used[1] === point[1])
    );
    return allPoints[Math.floor(Math.random() * allPoints.length)];
  }
  return availablePoints[Math.floor(Math.random() * availablePoints.length)];
}
function getRandomTarget(isDrone = true, allowPVO = true) {
  const alivePoints = defensePoints.filter(p => p.alive && !p.isAvariika);
  const aliveAirports = airports.filter(a => a.alive);
  if (alivePoints.length === 0 && aliveAirports.length === 0) {
  if (allowPVO && pvoList.length > 0) {
    const targetableField = isDrone ? 'targetableByDrones' : 'targetableByRockets';
    const targetablePVOs = pvoList.filter(pvo => pvo[targetableField]);
    if (targetablePVOs.length > 0) {
      const pvo = targetablePVOs[Math.floor(Math.random() * targetablePVOs.length)];
      return { lat: pvo.latlng.lat, lng: pvo.latlng.lng };
    }
  }
  return null;
}
  const targets = [...alivePoints];
  if (allowPVO && pvoList.length > 0) {
    const pvoChance = isDrone ? 0.2 : 0.3;
    if (Math.random() < pvoChance) {
      const targetableField = isDrone ? 'targetableByDrones' : 'targetableByRockets';
      const targetablePVOs = pvoList.filter(pvo => pvo[targetableField]);
      if (targetablePVOs.length > 0) {
        const pvo = targetablePVOs[Math.floor(Math.random() * targetablePVOs.length)];
        if (pvo.latlng && !isNaN(pvo.latlng.lat) && !isNaN(pvo.latlng.lng)) {
          return { lat: pvo.latlng.lat, lng: pvo.latlng.lng };
        }
      }
    }
  }
  if (aliveAirports.length > 0 && Math.random() < 0.1) {
    const airport = aliveAirports[Math.floor(Math.random() * aliveAirports.length)];
    return { lat: airport.lat, lng: airport.lng };
  }
  if (alivePoints.length === 0) {
    if (allowPVO && pvoList.length > 0) {
      const targetableField = isDrone ? 'targetableByDrones' : 'targetableByRockets';
      const targetablePVOs = pvoList.filter(pvo => pvo[targetableField]);
      if (targetablePVOs.length > 0) {
        const pvo = targetablePVOs[Math.floor(Math.random() * targetablePVOs.length)];
        if (pvo.latlng && !isNaN(pvo.latlng.lat) && !isNaN(pvo.latlng.lng)) {
          // <i class="fas fa-bomb" style="color:#ff6600"></i> одразу вбиваємо ППО
          map.removeLayer(pvo.marker);
          if (pvo.rangeCircle) map.removeLayer(pvo.rangeCircle);
          if (pvo.radarHelpers) pvo.radarHelpers.remove();
          const idx = pvoList.indexOf(pvo);
          if (idx !== -1) {
            pvoList.splice(idx, 1);
            if (TEMP_DEBUG_PVO_COUNTER) updateUI();
          }
          return { lat: pvo.latlng.lat, lng: pvo.latlng.lng };
        }
      }
    }
    if (aliveAirports.length > 0) {
      const airport = aliveAirports[Math.floor(Math.random() * aliveAirports.length)];
      return { lat: airport.lat, lng: airport.lng };
    }
    return null;
  }
  return alivePoints[Math.floor(Math.random() * alivePoints.length)];
}
function getRandomTargets(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function isPointOnMap(lat, lng) {
  const width = mapPixelCanvas.width;
  const height = mapPixelCanvas.height;
  if (!width || !height) {
    // Canvas ще не готовий - забороняємо встановлення
    return false;
  }
  const imageBounds = [[0, 0], [2829, 4000]];
  const [minLat, minLng] = imageBounds[0];
  const [maxLat, maxLng] = imageBounds[1];
  const x = Math.floor((lng - minLng) / (maxLng - minLng) * width);
  const y = Math.floor((1 - (lat - minLat) / (maxLat - minLat)) * height);
  if (x < 0 || x >= width || y < 0 || y >= height) return false;
  const ctx = mapPixelCanvas.getContext('2d');
  if (!ctx) return true;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return pixel[3] > 0;
}
function updatePvoMenuPrice(name) {
  const baseObj = pvoTypes.find(t => t.name === name);
  const basePrice = baseObj ? baseObj.price : (name === "Аварійка" ? 1500 : 0);
  const count = pvoPurchaseCounts[name] || 0;
  const dynamicPrice = Math.floor(basePrice * Math.pow(1.2, count));

  // Оновити картки у гріді (для тих, що є в pvoTypes)
  if (baseObj) {
    document.querySelectorAll('.pvo-item').forEach(div => {
      const divName = div.querySelector('b')?.textContent;
      if (divName === name) {
        div.innerHTML = `
          <img src="${baseObj.img}" />
          <b>${name}</b>
          <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${dynamicPrice}</span>
        `;
      }
    });
  }

  // Окремі кнопки під грідом
  if (name === "Аеродром") {
    const airportButton = document.getElementById('airportButton');
    if (airportButton) {
      airportButton.innerHTML = `
        <img src="assets/aeroport.png" alt="Аеродром" />
        <b>Аеродром</b>
        <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${dynamicPrice}</span>
      `.trim();
    }
  }
  if (name === "Аварійка") {
    const avariikaButton = document.getElementById('avariikaButton');
    if (avariikaButton) {
      avariikaButton.innerHTML = `
        <img src="assets/avariika.png" alt="Аварійка" />
        <b>Аварійка</b>
        <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${dynamicPrice}</span>
      `.trim();
    }
  }
}
function updatePvoPurchaseAvailability() {
  const disable = pvoList.length >= MAX_PVO_COUNT;
  const aliveAirports = airports.filter(a => a.alive);
  const airportExists = !sandboxMode && aliveAirports.length > 0;
  document.querySelectorAll('.pvo-item').forEach(div => {
    const typeName = div.querySelector("b")?.textContent;
    const type = pvoTypes.find(t => t.name === typeName);
    if (!type) return;
    if (type.name === "Аеродром") {
      if (airportExists || (!sandboxMode && isAirportSpawning)) {
        div.classList.add('disabled');
      } else {
        div.classList.remove('disabled');
      }
      return;
    }
    if (disable) {
      div.classList.add('disabled');
      div.onclick = () => alert(`✖ Досягнуто ліміт ${MAX_PVO_COUNT} ППО. Покращи вже створені.`);
        } else if ((type.name === "F-16" || type.name === "Су-27") && aliveAirports.length === 0) {
      div.classList.add('disabled');
      div.onclick = () => alert("✖ Для покупки F-16 спочатку потрібно збудувати Аеродром!");
    } else if (type.name === "Радар" && !radarMode && !sandboxMode) {
      div.classList.add('disabled');
      div.onclick = () => alert("✖ Радар доступен тільки в режимі 'Радар'!");
    } else {
      div.classList.remove('disabled');
      div.onclick = () => {
        const count = pvoPurchaseCounts[type.name] || 0;
        const dynamicPrice = Math.floor(type.price * Math.pow(1.2, count));
        if (money < dynamicPrice) {
          alert(`Недостатньо коштів. Потрібно ${Math.round(dynamicPrice)} карбованців.`);
          return;
        }
        selectedPVO = type;
        buyingMode = true;
        document.querySelectorAll('.pvo-item').forEach(item => item.classList.remove('selected'));
        div.classList.add('selected');
        // кнопок може ще не існувати — захист від null
        if (typeof sellPVOButton !== "undefined" && sellPVOButton) sellPVOButton.disabled = true;
        if (typeof upgradePVOButton !== "undefined" && upgradePVOButton) upgradePVOButton.disabled = true;
        if (sandboxMode && typeof removeButton !== "undefined" && removeButton) removeButton.disabled = true;

      };
    }
  });
  const airportButton = document.getElementById('airportButton');
  if (airportButton) {
    if (airportExists || (!sandboxMode && isAirportSpawning)) {
      airportButton.disabled = true;
      airportButton.classList.add('disabled');
    } else {
      airportButton.disabled = false;
      airportButton.classList.remove('disabled');
    }
  }
    const avariikaButton = document.getElementById('avariikaButton');
  if (avariikaButton) {
    if (avariikaActive) {
      avariikaButton.disabled = true;
      avariikaButton.classList.add('disabled');
    } else {
      avariikaButton.disabled = false;
      avariikaButton.classList.remove('disabled');
    }
  }
  if (sandboxMode) {
    const droneSpawner = document.querySelector('.sandbox-button:nth-of-type(1)');
    if (droneSpawner) droneSpawner.classList.remove('disabled'); // Always enable
    const targetSpawner = document.querySelector('.sandbox-button:nth-of-type(2)');
    if (targetSpawner) {
      if (defensePoints.length >= 20) {
        targetSpawner.classList.add('disabled');
        targetSpawner.onclick = () => alert("✖ Максимум 20 цілей на карті!");
      } else {
        targetSpawner.classList.remove('disabled');
      }
    }
  }
  const radarDiv = Array.from(document.querySelectorAll('.pvo-item')).find(div => div.querySelector('b')?.textContent === 'Радар');
  if (radarDiv) {
    if (disable || (!radarMode && !sandboxMode)) {
      radarDiv.classList.add('disabled');
    } else {
      radarDiv.classList.remove('disabled');
    }
  }
}
function updateMoney() {
  if (!moneyDisplay) {
    moneyDisplay = document.getElementById("money");
    if (!moneyDisplay) return;
  }
  const value = Number.isNaN(money) ? '?' : Math.round(money).toString();
  moneyDisplay.textContent = value;
  const digitsOnly = value.replace(/[^0-9]/g, '');
  moneyDisplay.classList.toggle('long', digitsOnly.length > 5);
  updatePvoPurchaseAvailability();
}

// Helper функція для перевірки чи можна дозволити собі покращення
function canAfford(cost) {
  if (sandboxMode) return true; // В sandbox режимі все безкоштовно
  return money >= cost;
}

// Helper функція для витрати грошей
function spendMoney(amount) {
  if (sandboxMode) return; // В sandbox режимі нічого не витрачаємо
  money -= amount;
}

function updateUI() {
  updateMoney();
  if (waveDisplay)  waveDisplay.textContent  = String(currentWave);
  if (scoreDisplay) {
    scoreDisplay.textContent = String(score);
    console.log('📊 Score updated:', score); // ДЕБАГ
  } else {
    console.warn('⚠️ scoreDisplay is null!'); // ДЕБАГ
  }
  if (TEMP_DEBUG_PVO_COUNTER && pvoCounterDisplay) {
    pvoCounterDisplay.textContent = `${pvoList.length}/${MAX_PVO_COUNT}`;
  }
}
function updateUpgradeButtonText() {
  if (!selectedPVO) return;
  const baseUpgradeCost = 100;
  const upgradeCost = Math.round(baseUpgradeCost * Math.pow(1.75, selectedPVO.upgradeCount));
  upgradePVOButton.innerHTML = `
    <span class="upgrade-icon"><i class="fas fa-arrow-up" style="color:#4CAF50"></i></span>
    <b>${typeof translate === 'function' ? translate('upgradePVO', 'game') : 'Покращити'}</b>
    <span class="pvo-price"><i class="fas fa-coins" style="color:#FFD700"></i> ${upgradeCost}</span>
  `;
}

function destroyPlane(p) {
  try { p.marker && map.removeLayer(p.marker); } catch(e){}
  if (p.rangeCircle) { try { map.removeLayer(p.rangeCircle); } catch(e){} p.rangeCircle = null; }
  if (p.sectorLayer) { try { map.removeLayer(p.sectorLayer); } catch(e){} p.sectorLayer = null; }
  try {
    if (p.radarHelpers) {
      p.radarHelpers.layer && map.removeLayer(p.radarHelpers.layer);
      if (Array.isArray(p.radarHelpers.rays)) {
        p.radarHelpers.rays.forEach(r => { try { map.removeLayer(r); } catch(e){} });
      }
    }
  } catch(e){}
  p.hidden = true;
  p.aircraftState = 'destroyed';
  p.aircraftButtonsDisabled = false;  // Скидаємо флаг кнопок
  p.respawnMs = undefined;
  p.dockedAirport = null;
  p.latlng = null; // важливо: щоб жодні цикли стрільби не використовували старі координати

  const idx = pvoList.indexOf(p);
  if (idx !== -1) {
    pvoList.splice(idx, 1);
    if (TEMP_DEBUG_PVO_COUNTER) updateUI();
  }

  if (selectedPVO === p) { 
  selectedPVO = null; 
  try { 
    setupPvoMenu(); 
    if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") window.__tutorialPvoLock();
  } catch(e){} 
}

}

function showVictoryScreen(text) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.padding = "30px";
  modal.style.background = "#111";
  modal.style.color = "#fff";
  modal.style.borderRadius = "12px";
  modal.style.zIndex = "10000";
  modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.7)";
  modal.style.fontSize = "18px";
  modal.style.textAlign = "center";
  modal.innerHTML = text;
  document.body.appendChild(modal);
}
function makeDraggable(panel, handle) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  handle.onmousedown = function(e) {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.onmousemove = function(e) {
      if (!isDragging) return;
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
    };
    document.onmouseup = function() {
      isDragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}
function bezierPoint(p0, p1, p2, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const x = uu * p0[0] + 2 * u * t * p1[0] + tt * p2[0];
  const y = uu * p0[1] + 2 * u * t * p1[1] + tt * p2[1];
  return [x, y];
}
function bezierTangent(p0, p1, p2, t) {
  const u = 1 - t;
  const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return [dx, dy];
}
function approximateBezierLength(p0, p1, p2, segments = 10) {
  let length = 0;
  let prev = bezierPoint(p0, p1, p2, 0);
  for (let i = 1; i <= segments; i++) {
    const curr = bezierPoint(p0, p1, p2, i / segments);
    const dx = curr[0] - prev[0];
    const dy = curr[1] - prev[1];
    length += Math.sqrt(dx * dx + dy * dy);
    prev = curr;
  }
  return length;
}
function generateControlPoint(start, target) {
  const vecX = target[0] - start[0];
  const vecY = target[1] - start[1];
  const len = Math.sqrt(vecX * vecX + vecY * vecY);
  const midX = start[0] + vecX / 2;
  const midY = start[1] + vecY / 2;
  const perpX = -vecY / len;
  const perpY = vecX / len;
  const offset = (Math.random() * 0.7 + 0.1) * len;
  const side = Math.random() < 0.5 ? 1 : -1;
  return [midX + perpX * offset * side, midY + perpY * offset * side];
}
function _sectorPoints(center, radius, halfAngleDeg, bearingDeg, segments = 24) {
  const pts = [[center.lat, center.lng]];
  const start = (bearingDeg - halfAngleDeg) * Math.PI / 180;
  const end = (bearingDeg + halfAngleDeg) * Math.PI / 180;
  const step = (end - start) / segments;
  for (let a = start; a <= end + 1e-6; a += step) {
    const lat = center.lat + Math.sin(a) * radius;
    const lng = center.lng + Math.cos(a) * radius;
    pts.push([lat, lng]);
  }
  return pts;
}
function createRadarSector(map, center, radius, sweepWidthDeg = 25, bearingDeg = 0) {
  let _center = L.latLng(center.lat, center.lng);
  let _radius = radius;
  let _bearing = bearingDeg;
  const _half = sweepWidthDeg / 2;
  const layer = L.polygon(
    _sectorPoints(_center, _radius, _half, _bearing),
    {
      color: 'rgba(1, 97, 1, 0.6)',
      weight: 1,
      fillColor: 'rgba(3, 96, 3, 0.4)',
      fillOpacity: 0.4,
      interactive: false
    }
  ).addTo(map);
  return {
    layer,
    setCenter(newCenter) {
      _center = L.latLng(newCenter.lat, newCenter.lng);
      layer.setLatLngs(_sectorPoints(_center, _radius, _half, _bearing));
    },
    setRadius(newR) {
      _radius = newR;
      layer.setLatLngs(_sectorPoints(_center, _radius, _half, _bearing));
    },
    updateBearing(newBearingDeg) {
      _bearing = newBearingDeg;
      layer.setLatLngs(_sectorPoints(_center, _radius, _half, _bearing));
    },
    remove() { map.removeLayer(layer); }
  };
}
function animateRadarSectors() {
  pvoList.forEach(pvo => {
    if (pvo.radar && pvo.radarHelpers) {
      pvo.radarBearing = (pvo.radarBearing - 0.6 * gameSpeed + 360) % 360;
      pvo.radarHelpers.updateBearing(pvo.radarBearing);
    }
  });
  requestAnimationFrame(animateRadarSectors);
}
function startWave() {
  if (sandboxMode || tutorialMode) return;
  triggerWaveAlarm();
  console.log(`🔥 Starting wave ${currentWave + 1}`);
  let droneCount, rocketCount, heavyDroneCount;
  
  // === RANKED MODE: використовуємо getRankedWaveConfig ===
  if (window.rankedMode && typeof window.getRankedWaveConfig === 'function') {
    const config = window.getRankedWaveConfig(currentWave + 1);
    droneCount = config.shaheds;
    heavyDroneCount = config.heavyDrones;
    rocketCount = config.rockets;
    // Калібри обробляються окремо через крейсер
  } else if (currentWave < 18) {
    droneCount = 5 + currentWave * 4;
    rocketCount = currentWave >= 7 ? currentWave - 1 : 0;
    heavyDroneCount = currentWave >= 4 ? Math.floor(currentWave / 2) * 1 : 0;
  } else {
    const wavesSince18 = currentWave - 18;
    let lightDrones = Math.max(0, INITIAL_LIGHT_DRONES - wavesSince18 * LIGHT_DRONE_DECREMENT);
    let heavyDrones, rockets;
    if (lightDrones > 0) {
      heavyDrones = INITIAL_HEAVY_DRONES + wavesSince18 * HEAVY_DRONE_INCREMENT;
      rockets = INITIAL_ROCKETS + wavesSince18 * ROCKET_INCREMENT;
    } else {
      const wavesSinceLightDronesZero = Math.floor((INITIAL_LIGHT_DRONES + LIGHT_DRONE_DECREMENT - 1) / LIGHT_DRONE_DECREMENT);
      const heavyWaves = wavesSince18 - wavesSinceLightDronesZero;
      heavyDrones = Math.max(0, INITIAL_HEAVY_DRONES + wavesSinceLightDronesZero * HEAVY_DRONE_INCREMENT - heavyWaves * HEAVY_DRONE_DECREMENT);
      rockets = INITIAL_ROCKETS + wavesSinceLightDronesZero * ROCKET_INCREMENT + heavyWaves * ROCKET_INCREMENT_NO_LIGHT;
    }
    const currentTotal = lightDrones + heavyDrones + rockets;
    if (currentTotal !== FIXED_TOTAL_ENEMIES) {
      const diff = FIXED_TOTAL_ENEMIES - currentTotal;
      if (lightDrones > 0) {
        lightDrones = Math.max(0, lightDrones + diff);
      } else if (heavyDrones > 0) {
        heavyDrones = Math.max(0, heavyDrones + diff);
      } else {
        rockets += diff;
      }
    }
    droneCount = lightDrones;
    heavyDroneCount = heavyDrones;
    rocketCount = rockets;
  }
  spawnWave(droneCount, rocketCount, heavyDroneCount);
  isWaveInProgress = true;
}
function gameLoop(ts) {
  if (gameOver || gameWon) return;
  const now = performance.now();
  frameCount++;
  if (now - fpsLastTime >= 1000) {
    fps = Math.round(frameCount * 1000 / (now - fpsLastTime));
    frameCount = 0;
    fpsLastTime = now;
    if (fpsDisplay) {
      fpsDisplay.textContent = `FPS: ${fps}`;
    }
  }
  frameCounter++;
  const deltaReal = (now - lastFrameTime) / 1000;
  const delta = (now - lastFrameTime) / 1000;
  handleKreiserAttack(delta);
  handleKreiserAA(delta);
  updateFlamingos(delta);
  updateAircraftAttack(delta);

  // --- UI safety: если выбранное ПВО/самолёт исчез, меню мгновенно возвращаем к списку ПВО
  if (typeof selectedPVO !== 'undefined' && selectedPVO) {
    const markerGone = selectedPVO.marker && typeof map?.hasLayer === 'function'
      ? !map.hasLayer(selectedPVO.marker)
      : false;

    const isDeadOrHidden =
      selectedPVO.hidden === true ||
      selectedPVO.aircraftState === 'destroyed' ||
      markerGone;

    if (isDeadOrHidden) {
      selectedPVO = null;
      setupPvoMenu();
      if (window.tutorialModeActive && typeof window.__tutorialPvoLock === "function") window.__tutorialPvoLock();
    }
  }
  // --- /UI safety
  
  accumulatedGameTime += deltaReal * gameSpeed;
  lastFrameTime = now;

  // ---------- Производство ресурсов целями ----------
defensePoints.forEach(dp => {
  if (!dp.alive) return;
  const rule = PRODUCTION_RULES[dp.kind];
  if (!rule) return;

  dp.prodAccum += deltaReal * gameSpeed; // скорость влияет на производство

  const interval = rule.intervalSec;
  if (dp.prodAccum >= interval) {
    // сколько раз успели "тикнуть"
    const ticks = Math.floor(dp.prodAccum / interval);
    dp.prodAccum -= ticks * interval;

    // начисляем ресурсы и показываем анимацию
    for (let i = 0; i < ticks; i++) {
      if (rule.targetKey === "power")  power  += rule.amount;
      if (rule.targetKey === "fuel")   fuel   += rule.amount;
      if (rule.targetKey === "bricks") bricks += rule.amount;
      spawnResourceFloat(dp.lat, dp.lng, rule.icon);
    }
    updateResourcesUI();
  }
});
  if (!sandboxMode && !tutorialMode && (rightOnlyMode || !hardcoreMode || radarMode) && currentWave >= 25 && drones.length === 0 && rockets.length === 0) {
    checkVictory();
    return;
  }
  if (!sandboxMode && !tutorialMode) {
    if (accumulatedGameTime >= waveSchedule[currentWave] && (!(rightOnlyMode || !hardcoreMode || radarMode) || currentWave < 25)) {
      console.log(`Game Loop: Wave ${currentWave + 1}, defensePoints=${defensePoints.length}, alive=${defensePoints.filter(p => p.alive).length}`);
      // Уведомлення про цілі тільки для НЕ-ranked режиму
      if (!window.rankedMode && [1, 4, 6, 9, 11].includes(currentWave)) {
        const availableRegions = Object.keys(regionSpawnPoints).filter(
          region => regionSpawnPoints[region].some(
            point => !usedSpawnPoints.some(used => used[0] === point[0] && used[1] === point[1])
          )
        );
        if (availableRegions.length > 0) {
          nextTargetRegion = availableRegions[Math.floor(Math.random() * availableRegions.length)];
          showTargetNotification(nextTargetRegion);
        } else {
          nextTargetRegion = null;
        }
      }
      // Спавн об'єктів тільки для НЕ-ranked режиму (ranked має свою логіку)
      if (!window.rankedMode) {
        if (currentWave === 2 && allDefensePoints.length < 2 && nextTargetRegion) {
          const newPoint = getRandomSpawnPoint(nextTargetRegion);
          allDefensePoints.push(newPoint);
          usedSpawnPoints.push(newPoint);
          activateDefensePoint(1, newPoint);
        }
        if (currentWave === 5 && allDefensePoints.length < 3 && nextTargetRegion) {
          const newPoint = getRandomSpawnPoint(nextTargetRegion);
          allDefensePoints.push(newPoint);
          usedSpawnPoints.push(newPoint);
          activateDefensePoint(2, newPoint);
        }
        if (currentWave === 7 && allDefensePoints.length < 4 && nextTargetRegion) {
          const newPoint = getRandomSpawnPoint(nextTargetRegion);
          allDefensePoints.push(newPoint);
          usedSpawnPoints.push(newPoint);
          activateDefensePoint(3, newPoint);
        }
        if (currentWave === 10 && allDefensePoints.length < 5 && nextTargetRegion) {
          const newPoint = getRandomSpawnPoint(nextTargetRegion);
          allDefensePoints.push(newPoint);
          usedSpawnPoints.push(newPoint);
          activateDefensePoint(4, newPoint);
        }
        if (currentWave === 12 && allDefensePoints.length < 6 && nextTargetRegion) {
          const newPoint = getRandomSpawnPoint(nextTargetRegion);
          allDefensePoints.push(newPoint);
          usedSpawnPoints.push(newPoint);
          activateDefensePoint(5, newPoint);
        }
      }
      
      // Ranked mode: оновлюємо волну ПЕРЕД startWave (попередження та спавн об'єктів)
      // currentWave починається з 0, тому передаємо currentWave + 1
      if (window.rankedMode && typeof window.updateRankedWave === 'function') {
        window.updateRankedWave(currentWave + 1);
      }
      
      startWave();
      money += (currentWave + 1) * 150;
      currentWave++;
      updateUI();
    }
  }
  updateProjectiles();
  updateParticles();
  requestAnimationFrame(gameLoop);
}
function moveDrones(ts = 0) {
  if (gameOver) return;
  frameCounter++;
  
  drones.forEach((drone, index) => {
    if (drone.hp <= 0) {
      const explosion = L.marker(drone.position, {
        icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
      }).addTo(map);
      setTimeout(() => map.removeLayer(explosion), 600 / gameSpeed);
      map.removeLayer(drone.marker);
      drones.splice(index, 1);
      
      // ========================================
      // ВИПРАВЛЕННЯ БАГА: ОЧИЩАЄМО ЗНИЩЕНИЙ ДРОН З ВСІХ ППО
      // Коли дрон знищується, видаляємо його з currentTargets усіх ППО
      // Інакше ППО застрягає з мертвою ціллю
      // ========================================
      pvoList.forEach(pvo => {
        if (!pvo || !pvo.currentTargets) return;
        for (let i = 0; i < pvo.currentTargets.length; i++) {
          if (pvo.currentTargets[i] === drone) {
            pvo.currentTargets[i] = null;
          }
        }
      });
      // ========================================
      
      money += drone.type === "heavy" ? 230 : 110;
      // Трекінг для рангового режиму
      if (typeof window.trackRankedKill === 'function') {
        window.trackRankedKill(drone.type === "heavy" ? 'heavy' : 'shahed');
      }
      window.trackQuestKill(drone.type === "heavy" ? 'heavy' : 'shahed');
      score++;
      updateUI();
      return;
    }
    if (frameCounter % 10 === 0) {
const targetAlive =
  (drone.target && defensePoints.some(p => p.alive && p.lat === drone.target[0] && p.lng === drone.target[1])) ||
  (drone.target && pvoList.some(pvo =>
      pvo && pvo.latlng && !pvo.hidden && pvo.aircraftState !== 'cooldown' &&
      pvo.latlng.lat === drone.target[0] && pvo.latlng.lng === drone.target[1]
  )) ||
  (drone.target && airports.some(a => a.alive && a.lat === drone.target[0] && a.lng === drone.target[1]));

      if (!drone.target || isNaN(drone.target[0]) || isNaN(drone.target[1]) || !targetAlive) {
        const newTarget = getRandomTarget(true, true);
        if (!newTarget) {
          console.warn(`No valid target for drone redirect (wave ${currentWave + 1})`);
          map.removeLayer(drone.marker);
          drone.hp = -1;
          pvoList.forEach(p => { if (p && p.currentTargets) { for (let i = 0; i < p.currentTargets.length; i++) { if (p.currentTargets[i] === drone) p.currentTargets[i] = null; } } });
          drones.splice(index, 1);
          return;
        }
        drone.target = [newTarget.lat, newTarget.lng];
        drone.start = drone.position.slice();
        drone.control = generateControlPoint(drone.start, drone.target);
        drone.totalLength = approximateBezierLength(drone.start, drone.control, drone.target);
        drone.t = 0;
      }
    }
    if (drone.t >= 1) {
      handleEnemyImpact(drone, index);
      return;
    }
    let slowed = false;
    if (frameCounter % 1 === 0) {
const nearbyPVOs = pvoList
  .filter(pvo => pvo && pvo.latlng && pvo.reb)
  .map(pvo => ({ pvo, dist: Math.hypot(drone.position[1] - pvo.latlng.lng, drone.position[0] - pvo.latlng.lat) }))
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 10)
  .filter(item => item.dist < 500);
      nearbyPVOs.forEach(({ pvo, dist }) => {
        if (dist < pvo.radius) {
          slowed = true;
          if (!drone.lastRebCheck || ts - drone.lastRebCheck >= 1000 / gameSpeed) {
            if (Math.random() < 0.03) {
              const explosion = L.marker(drone.position, {
                icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
              }).addTo(map);
              setTimeout(() => map.removeLayer(explosion), 600 / gameSpeed);
              map.removeLayer(drone.marker);
              drones.splice(index, 1);
              money += drone.type === "heavy" ? 115 : 55;
              score++;
              // Трекінг для рангового режиму (РЕБ збиття)
if (typeof window.trackRankedKill === 'function') {
  window.trackRankedKill(drone.type === "heavy" ? 'heavy' : 'shahed');
}
window.trackQuestKill(drone.type === "heavy" ? 'heavy' : 'shahed');
              // Знімаємо збитий дрон з цілей усіх ППО
              pvoList.forEach(p => {
                if (!p || !p.currentTargets) return;
                for (let j = 0; j < p.currentTargets.length; j++) {
                  if (p.currentTargets[j] === drone) p.currentTargets[j] = null;
                }
              });
              updateUI();
              return;
            }
            drone.lastRebCheck = ts;
          }
        }
      });
    }
    drone.speed = slowed ? drone.speedOriginal * 0.55 : drone.speedOriginal;
    const step = (drone.speed * gameSpeed) / drone.totalLength;
    drone.t = Math.min(drone.t + step, 1);
    drone.position = bezierPoint(drone.start, drone.control, drone.target, drone.t);
    if (isNaN(drone.position[0]) || isNaN(drone.position[1])) {
      console.warn("Invalid drone position:", drone.position);
      map.removeLayer(drone.marker);
      drone.hp = -1;
      pvoList.forEach(p => { if (p && p.currentTargets) { for (let i = 0; i < p.currentTargets.length; i++) { if (p.currentTargets[i] === drone) p.currentTargets[i] = null; } } });
      drones.splice(index, 1);
      return;
    }
    drone.marker.setLatLng(drone.position);
    const tangent = bezierTangent(drone.start, drone.control, drone.target, drone.t);
    const angleRad = Math.atan2(tangent[1], tangent[0]);
    const angleDeg = angleRad * (180 / Math.PI);
    if (frameCounter % 10 === 0) {
      const img = drone.marker.getElement()?.querySelector('img');
      if (img) img.style.transform = `rotate(${angleDeg}deg)`;
    }
    if (radarMode && frameCounter % 2 === 0) {
      const radars = pvoList.filter(p => p.radar);
      drone.visible = radars.some(radar => Math.hypot(drone.position[1] - radar.latlng.lng, drone.position[0] - radar.latlng.lat) < radar.radius);
      drone.marker.setOpacity(drone.visible ? 1 : 0);
    }
    if (frameCounter % 2 === 0) {
// ========================================
// ВИПРАВЛЕННЯ БАГА: ГЛОБАЛЬНЕ ОЧИЩЕННЯ МЕРТВИХ ЦІЛЕЙ
// Очищаємо мертві/невалідні цілі з ВСІХ ППО перед стрільбою
// Це запобігає застряганню ППО з мертвими ціллями
// ========================================
pvoList.forEach(pvo => {
  if (!pvo || !pvo.currentTargets) return;
  
  const maxTargets = (pvo.upgrades && pvo.upgrades.dualTarget) ? 2 : 1;
  
  for (let i = 0; i < maxTargets; i++) {
    const target = pvo.currentTargets[i];
    if (!target) continue;
    
    // Очищаємо якщо: мертвий, без маркера, без позиції
    if (target.hp <= 0 || !target.marker || !target.position) {
      pvo.currentTargets[i] = null;
      continue;
    }
    
    // Очищаємо якщо вийшов за радіус
    if (pvo.latlng) {
      const dist = Math.hypot(
        target.position[0] - pvo.latlng.lat, 
        target.position[1] - pvo.latlng.lng
      ) * PIXEL_TO_METERS;
      
      if (dist >= pvo.radius) {
        pvo.currentTargets[i] = null;
      }
    }
  }
});
// ========================================

const nearbyPVOs = pvoList
  .filter(pvo => pvo && pvo.marker && pvo.latlng && !pvo.hidden && pvo.aircraftState !== 'destroyed' && pvo.aircraftState !== 'cooldown')
  .map(pvo => ({ pvo, dist: Math.hypot(drone.position[1] - pvo.latlng.lng, drone.position[0] - pvo.latlng.lat) }))
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 10)
  .filter(item => item.dist < 500);

nearbyPVOs.forEach(({ pvo, dist }) => {
  if (pvo.hidden || !pvo.latlng || pvo.aircraftState === 'destroyed' || pvo.aircraftState === 'cooldown') return;
  
  // Літаки стріляють через свою власну логіку
  if (pvo.planeState) return;
  
  // РЕБ не стріляє
  if (pvo.reb) return;
  
  // Ініціалізуємо масиви якщо їх немає
  if (!pvo.currentTargets) pvo.currentTargets = [null, null];
  if (!pvo.lastShots) pvo.lastShots = [0, 0];
  
  // Максимум цілей: 1 або 2 (якщо є подвійна ціль)
  const maxTargets = (pvo.upgrades && pvo.upgrades.dualTarget) ? 2 : 1;
  
  const r = dist * PIXEL_TO_METERS;
  if (r >= pvo.radius) return;
  if (!canTargetEnemy(pvo, drone.type === "heavy" ? "heavy_drones" : "shaheds")) return;
  if (radarMode && !drone.visible) return;
  
  // Шукаємо цей дрон серед наших цілей
  let existingSlot = -1;
  for (let i = 0; i < maxTargets; i++) {
    if (pvo.currentTargets[i] === drone) {
      existingSlot = i;
      break;
    }
  }
  
  if (existingSlot !== -1) {
    // Дрон вже наша ціль - перевіряємо кулдаун і стріляємо
    if (ts - pvo.lastShots[existingSlot] >= pvo.cd / Math.max(gameSpeed, 0.0001)) {
      pvo.lastShots[existingSlot] = ts;
      const config = PPO_CONFIG[pvo.name];
      if (config && config.projectile && config.projectile.hasVisual) {
        createProjectile(pvo, drone);
      } else {
        const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
        drone.hp -= actualDamage;
      }
    }
    return;
  }
  
  // Очищаємо невалідні цілі
  for (let i = 0; i < maxTargets; i++) {
    const target = pvo.currentTargets[i];
    if (target) {
      if (target.hp <= 0 || !target.marker) {
        pvo.currentTargets[i] = null;
      } else {
        const ctDist = Math.hypot(target.position[0] - pvo.latlng.lat, target.position[1] - pvo.latlng.lng) * PIXEL_TO_METERS;
        if (ctDist >= pvo.radius) {
          pvo.currentTargets[i] = null;
        }
      }
    }
  }
  
  // Шукаємо вільний слот для нової цілі
  for (let slot = 0; slot < maxTargets; slot++) {
    if (pvo.currentTargets[slot] !== null) continue;
    if (ts - pvo.lastShots[slot] < pvo.cd / Math.max(gameSpeed, 0.0001)) continue;
    
    // Додаємо нову ціль і стріляємо
    pvo.currentTargets[slot] = drone;
    pvo.lastShots[slot] = ts;
    
    const config = PPO_CONFIG[pvo.name];
    if (config && config.projectile && config.projectile.hasVisual) {
      createProjectile(pvo, drone);
    } else {
      const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
      drone.hp -= actualDamage;
    }
    return;
  }
});
    }
  });
  
  // Оновлюємо іконки цілей
  if (frameCounter % 5 === 0) {
    updateTargetIcons();
  }
  
  requestAnimationFrame(moveDrones);
}
function moveRockets(ts = 0) {
  if (gameOver) return;
  frameCounter++;
  rockets.forEach((rocket, index) => {
    if (rocket.hp <= 0) {
      const explosion = L.marker(rocket.position, {
        icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
      }).addTo(map);
      setTimeout(() => map.removeLayer(explosion), 600 / gameSpeed);
      map.removeLayer(rocket.marker);
      rockets.splice(index, 1);
      
      // ========================================
      // ВИПРАВЛЕННЯ БАГА: ОЧИЩАЄМО ЗНИЩЕНУ РАКЕТУ З ВСІХ ППО
      // Коли ракета знищується, видаляємо її з currentTargets усіх ППО
      // ========================================
      pvoList.forEach(pvo => {
        if (!pvo || !pvo.currentTargets) return;
        for (let i = 0; i < pvo.currentTargets.length; i++) {
          if (pvo.currentTargets[i] === rocket) {
            pvo.currentTargets[i] = null;
          }
        }
      });
      // ========================================
      
      money += 155;
      // Трекінг для рангового режиму
      if (typeof window.trackRankedKill === 'function') {
        window.trackRankedKill('rocket');
      }
      window.trackQuestKill('rocket');
      score++;
      updateUI();
      return;
    }
    if (frameCounter % 10 === 0) {
const targetAlive =
  (rocket.target && defensePoints.some(p => p.alive && p.lat === rocket.target[0] && p.lng === rocket.target[1])) ||
  (rocket.target && pvoList.some(pvo => pvo && pvo.latlng && pvo.latlng.lat === rocket.target[0] && pvo.latlng.lng === rocket.target[1])) ||
  (rocket.target && airports.some(a => a.alive && a.lat === rocket.target[0] && a.lng === rocket.target[1]));
      if (!rocket.target || isNaN(rocket.target[0]) || isNaN(rocket.target[1]) || !targetAlive) {
        const newTarget = getRandomTarget(false, true);
        if (!newTarget) {
          console.warn(`No valid target for rocket redirect (wave ${currentWave + 1})`);
          map.removeLayer(rocket.marker);
          rockets.splice(index, 1);
          return;
        }
        rocket.target = [newTarget.lat, newTarget.lng];
      }
    }
    const dx = rocket.target[0] - rocket.position[0];
    const dy = rocket.target[1] - rocket.position[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 10) {
      handleEnemyImpact(rocket, index);
      return;
    }
    const normDx = dx / dist;
    const normDy = dy / dist;
    if (isNaN(normDx) || isNaN(normDy)) {
      console.warn(`Invalid rocket movement calculation (wave ${currentWave + 1}):`, rocket.position, rocket.target);
      map.removeLayer(rocket.marker);
      rockets.splice(index, 1);
      return;
    }
    let slowed = false;
    if (frameCounter % 1 === 0) {
const nearbyPVOs = pvoList
  // Ensure PVO exists, has coordinates, and is active before distance calc
  .filter(pvo => pvo && pvo.marker && pvo.latlng && !pvo.hidden && pvo.aircraftState !== 'destroyed' && pvo.aircraftState !== 'cooldown')
  .map(pvo => ({ pvo, dist: Math.hypot(rocket.position[1] - pvo.latlng.lng, rocket.position[0] - pvo.latlng.lat) }))
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 10)
  .filter(item => item.dist < 500 && item.pvo.reb);
      nearbyPVOs.forEach(({ pvo, dist }) => {
        if (dist < pvo.radius) {
          slowed = true;
          if (!rocket.lastRebCheck || ts - rocket.lastRebCheck >= 1000 / gameSpeed) {
            if (Math.random() < 0.09) {
              const explosion = L.marker(rocket.position, {
                icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
              }).addTo(map);
              setTimeout(() => map.removeLayer(explosion), 600 / gameSpeed);
              map.removeLayer(rocket.marker);
              rockets.splice(index, 1);
              money += 310;
              score++;
              // Знімаємо збиту ракету з цілей усіх ППО
              pvoList.forEach(p => {
                if (!p || !p.currentTargets) return;
                for (let j = 0; j < p.currentTargets.length; j++) {
                  if (p.currentTargets[j] === rocket) p.currentTargets[j] = null;
                }
              });
              updateUI();
              return;
            }
            rocket.lastRebCheck = ts;
          }
        }
      });
    }
    rocket.speed = slowed ? rocket.speedOriginal * 0.55 : rocket.speedOriginal;
    rocket.position[0] += normDx * rocket.speed * gameSpeed;
    rocket.position[1] += normDy * rocket.speed * gameSpeed;
    if (isNaN(rocket.position[0]) || isNaN(rocket.position[1])) {
      console.warn(`Invalid rocket position (wave ${currentWave + 1}):`, rocket.position);
      map.removeLayer(rocket.marker);
      rockets.splice(index, 1);
      return;
    }
    rocket.marker.setLatLng(rocket.position);
const angleRad = Math.atan2(normDy, normDx);
const angleDeg = angleRad * (180 / Math.PI);
const img = rocket.marker.getElement()?.querySelector("img");
if (img) img.style.transform = `rotate(${angleDeg}deg)`;


    if (radarMode && frameCounter % 10 === 0) {
      // Only consider radars with valid position
      const radars = pvoList.filter(p => p && p.radar && p.latlng);
      rocket.visible = radars.some(radar => Math.hypot(rocket.position[1] - radar.latlng.lng, rocket.position[0] - radar.latlng.lat) < radar.radius);
      rocket.marker.setOpacity(rocket.visible ? 1 : 0);
    }
    if (frameCounter % 10 === 0) {
      // ========================================
      // ВИПРАВЛЕННЯ БАГА: ГЛОБАЛЬНЕ ОЧИЩЕННЯ МЕРТВИХ ЦІЛЕЙ (РАКЕТИ)
      // Очищаємо мертві/невалідні цілі з ВСІХ ППО перед стрільбою
      // ========================================
      pvoList.forEach(pvo => {
        if (!pvo || !pvo.currentTargets) return;
        
        const maxTargets = (pvo.upgrades && pvo.upgrades.dualTarget) ? 2 : 1;
        
        for (let i = 0; i < maxTargets; i++) {
          const target = pvo.currentTargets[i];
          if (!target) continue;
          
          // Очищаємо якщо: мертвий, без маркера, без позиції
          if (target.hp <= 0 || !target.marker || !target.position) {
            pvo.currentTargets[i] = null;
            continue;
          }
          
          // Очищаємо якщо вийшов за радіус
          if (pvo.latlng) {
            const dist = Math.hypot(
              target.position[0] - pvo.latlng.lat, 
              target.position[1] - pvo.latlng.lng
            ) * PIXEL_TO_METERS;
            
            if (dist >= pvo.radius) {
              pvo.currentTargets[i] = null;
            }
          }
        }
      });
      // ========================================
      
      const nearbyPVOs = pvoList
        // Guard against null/invalid PVO entries before accessing lat/lng
        .filter(pvo => pvo && pvo.marker && pvo.latlng && !pvo.hidden && pvo.aircraftState !== 'destroyed' && pvo.aircraftState !== 'cooldown')
        .map(pvo => ({ pvo, dist: Math.hypot(rocket.position[1] - pvo.latlng.lng, rocket.position[0] - pvo.latlng.lat) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 10)
        .filter(item => item.dist < 500);
      nearbyPVOs.forEach(({ pvo, dist }) => {
        // Літаки стріляють через свою власну логіку
        if (pvo.planeState) return;
        
        // РЕБ не стріляє
        if (pvo.reb) return;
        
        // Ініціалізуємо масиви якщо їх немає
        if (!pvo.currentTargets) pvo.currentTargets = [null, null];
        if (!pvo.lastShots) pvo.lastShots = [0, 0];
        
        // Максимум цілей: 1 або 2 (якщо є подвійна ціль)
        const maxTargets = (pvo.upgrades && pvo.upgrades.dualTarget) ? 2 : 1;
        
        const r = dist * PIXEL_TO_METERS;
        if (r >= pvo.radius) return;
        if (!canTargetEnemy(pvo, "rockets")) return;
        if (radarMode && !rocket.visible) return;
        
        // Шукаємо цю ракету серед наших цілей
        let existingSlot = -1;
        for (let i = 0; i < maxTargets; i++) {
          if (pvo.currentTargets[i] === rocket) {
            existingSlot = i;
            break;
          }
        }
        
        if (existingSlot !== -1) {
          // Ракета вже наша ціль - перевіряємо кулдаун і стріляємо
          if (ts - pvo.lastShots[existingSlot] >= pvo.cd / Math.max(gameSpeed, 0.0001)) {
            pvo.lastShots[existingSlot] = ts;
            const config = PPO_CONFIG[pvo.name];
            if (config && config.projectile && config.projectile.hasVisual) {
              createProjectile(pvo, rocket);
            } else {
              rocket.hp -= pvo.damage;
            }
          }
          return;
        }
        
        // Очищаємо невалідні цілі
        for (let i = 0; i < maxTargets; i++) {
          const target = pvo.currentTargets[i];
          if (target) {
            if (target.hp <= 0 || !target.marker) {
              pvo.currentTargets[i] = null;
            } else {
              const ctDist = Math.hypot(target.position[0] - pvo.latlng.lat, target.position[1] - pvo.latlng.lng) * PIXEL_TO_METERS;
              if (ctDist >= pvo.radius) {
                pvo.currentTargets[i] = null;
              }
            }
          }
        }
        
        // Шукаємо вільний слот для нової цілі
        for (let slot = 0; slot < maxTargets; slot++) {
          if (pvo.currentTargets[slot] !== null) continue;
          if (ts - pvo.lastShots[slot] < pvo.cd / Math.max(gameSpeed, 0.0001)) continue;
          
          pvo.currentTargets[slot] = rocket;
          pvo.lastShots[slot] = ts;
          
          const config = PPO_CONFIG[pvo.name];
          if (config && config.projectile && config.projectile.hasVisual) {
            createProjectile(pvo, rocket);
          } else {
            rocket.hp -= pvo.damage;
          }
          return;
        }
      });
    }
  });
  requestAnimationFrame(moveRockets);
}

function moveKalibrs(ts = 0) {
  if (gameOver || gameWon) return;

  for (let i = kalibrs.length - 1; i >= 0; i--) {
    const k = kalibrs[i];

    // якщо ціль втрачена або мертва — вибрати нову, а НЕ зависати
    let targetAlive =
      (k.target && defensePoints.some(p => p.alive && p.lat === k.target[0] && p.lng === k.target[1])) ||
      (k.target && airports.some(a => a.alive && a.lat === k.target[0] && a.lng === k.target[1]));

    if (!targetAlive) {
      // спробувати знайти нову ціль (живі цілі + аеродроми)
      const availTargets = [
        ...defensePoints.filter(p => p.alive).map(p => [p.lat, p.lng]),
        ...airports.filter(a => a.alive).map(a => [a.lat, a.lng])
      ];
      if (availTargets.length > 0) {
        const [tlat, tlng] = availTargets[Math.floor(Math.random() * availTargets.length)];
        k.target = [tlat, tlng];
        targetAlive = true;
      } else {
        // нема куди летіти — видаляємо, щоб не висів
        try { map.removeLayer(k.marker); } catch(e){}
        kalibrs.splice(i, 1);
        continue;
      }
    }

    // якщо вилетів за межі карти — видалити
    if (k.position[0] < -400 || k.position[0] > 2829 + 400 || k.position[1] < -400 || k.position[1] > 4000 + 400) {
      try { map.removeLayer(k.marker); } catch(e){}
      kalibrs.splice(i, 1);
      continue;
    }


    if (!k.target || isNaN(k.target[0]) || isNaN(k.target[1]) || !targetAlive) {
      const newTarget = getRandomTarget(false, false); // не цілимось у ППО
      if (!newTarget) {
        // нема куди летіти — прибираємо з карти
        try { map.removeLayer(k.marker); } catch(e){}
        kalibrs.splice(i, 1);
        continue;
      }
      k.target = [newTarget.lat, newTarget.lng];
    }

    // рух по прямій на k.target
    const dx = k.target[0] - k.position[0];
    const dy = k.target[1] - k.position[1];
    const dist = Math.hypot(dx, dy);

    if (dist < 12) {
  // ВЛУЧАННЯ: знайти об'єкт поруч із точкою цілі (будівля/аеродром)
  const candidates = [
    ...defensePoints.filter(p => p.alive),
    ...airports.filter(a => a.alive)
  ];
  let hitObj = null;
  let best = Infinity;
  for (const obj of candidates) {
    const d = Math.hypot(obj.lat - k.target[0], obj.lng - k.target[1]);
    if (d < 40 && d < best) { best = d; hitObj = obj; }
  }

  if (hitObj) {
    // Наносимо шкоду 25–35
    hitObj.hp = Math.max(0, (hitObj.hp ?? 100) - (k.damage ?? 30));

    if (hitObj.hp <= 0 && hitObj.alive) {
      // ТОЧНО як у handleEnemyImpact: <i class="fas fa-bomb" style="color:#ff6600"></i> замість іконки, зняти коло і HP-бар
      hitObj.alive = false;
      try { hitObj.marker.setIcon(L.divIcon({ html: "<i class='fas fa-bomb' style='color:#ff6600'></i>", className: "" })); } catch(e){}
      if (hitObj.noBuildCircle) { try { map.removeLayer(hitObj.noBuildCircle); } catch(e){} hitObj.noBuildCircle = null; }
      try { map.removeLayer(hitObj.hpMarker); } catch(e){}

      // спецвипадок: якщо це Аварійка — оновити прапорець
      if (hitObj.isAvariika) { avariikaActive = false; updatePvoPurchaseAvailability?.(); }

      // якщо треба — перевірити кінець гри (як у твоєму коді)
      if (!sandboxMode && !tutorialMode && defensePoints.filter(p => p.alive && !p.isAvariika).length === 0) endGame?.();
    } else {
      // просто оновити HP UI, якщо живий
      updateHpUIForPoint?.(hitObj);
    }
  }

  // вибух «Калібра» і видалення
  const explosion = L.marker([k.position[0], k.position[1]], {
    icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
  }).addTo(map);
  setTimeout(() => { try { map.removeLayer(explosion); } catch(e){} }, 600 / Math.max(gameSpeed, 0.01));

  try { map.removeLayer(k.marker); } catch(e){}
  kalibrs.splice(i, 1);
  score++;
  updateUI?.();
  continue;
}


    const nx = dx / dist;
    const ny = dy / dist;
    k.position[0] += nx * k.speed * gameSpeed;
    k.position[1] += ny * k.speed * gameSpeed;

    if (Number.isNaN(k.position[0]) || Number.isNaN(k.position[1])) {
      try { map.removeLayer(k.marker); } catch(e){}
      kalibrs.splice(i, 1);
      continue;
    }

    k.marker.setLatLng(k.position);

    // повернути спрайт за курсом
    const angle = Math.atan2(ny, nx) * 180 / Math.PI;
    const img = k.marker.getElement()?.querySelector('img');
    if (img) img.style.transform = `rotate(${angle}deg)`;

    // видимість у радар-режимі
    if (radarMode) {
      const radars = pvoList.filter(p => p.radar);
      k.visible = radars.some(r => Math.hypot(k.position[1] - r.latlng.lng, k.position[0] - r.latlng.lat) < r.radius);
      k.marker.setOpacity(k.visible ? 1 : 0);
    }

    // ППО може збивати «Калібри», якщо вміє бити ракети/калiбри
    for (const pvo of pvoList) {
      if (!pvo.latlng) continue;
      // Літаки стріляють через свою власну логіку
      if (pvo.planeState) continue;
      
      // РЕБ не стріляє
      if (pvo.reb) continue;
      
      // Ініціалізуємо масиви якщо їх немає
      if (!pvo.currentTargets) pvo.currentTargets = [null, null];
      if (!pvo.lastShots) pvo.lastShots = [0, 0];
      
      // Максимум цілей: 1 або 2 (якщо є подвійна ціль)
      const maxTargets = (pvo.upgrades && pvo.upgrades.dualTarget) ? 2 : 1;
      
      const r = Math.hypot(k.position[1] - pvo.latlng.lng, k.position[0] - pvo.latlng.lat) * PIXEL_TO_METERS;
      if (r >= pvo.radius) continue;
      if (!canTargetEnemy(pvo, "calibers")) continue;
      if (radarMode && !k.visible) continue;
      
      // Шукаємо цей калібр серед наших цілей
      let existingSlot = -1;
      for (let j = 0; j < maxTargets; j++) {
        if (pvo.currentTargets[j] === k) {
          existingSlot = j;
          break;
        }
      }
      
      if (existingSlot !== -1) {
        // Калібр вже наша ціль - перевіряємо кулдаун і стріляємо
        if (ts - pvo.lastShots[existingSlot] >= (pvo.cd || 0) / 2 / Math.max(gameSpeed, 0.0001)) {
          pvo.lastShots[existingSlot] = ts;
          const config = PPO_CONFIG[pvo.name];
          if (config && config.projectile && config.projectile.hasVisual) {
            createProjectile(pvo, k);
          } else {
            k.hp -= pvo.damage;
          }
          
          if (k.hp <= 0) {
            const explosion = L.marker([k.position[0], k.position[1]], {
              icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
            }).addTo(map);
            setTimeout(() => { try { map.removeLayer(explosion); } catch(e){} }, 600 / Math.max(gameSpeed, 0.01));
            try { map.removeLayer(k.marker); } catch(e){}
            kalibrs.splice(i, 1);
            money += 400;
            if (typeof window.trackRankedKill === 'function') {
              window.trackRankedKill('kalibr');
            }
            window.trackQuestKill('kalibr');
            score++;
            updateUI?.();
            break;
          }
        }
        continue;
      }
      
      // Очищаємо невалідні цілі
      for (let j = 0; j < maxTargets; j++) {
        const target = pvo.currentTargets[j];
        if (target) {
          if (target.hp <= 0 || !target.marker) {
            pvo.currentTargets[j] = null;
          } else {
            const ctDist = Math.hypot(target.position[0] - pvo.latlng.lat, target.position[1] - pvo.latlng.lng) * PIXEL_TO_METERS;
            if (ctDist >= pvo.radius) {
              pvo.currentTargets[j] = null;
            }
          }
        }
      }
      
      // Шукаємо вільний слот для нової цілі
      for (let slot = 0; slot < maxTargets; slot++) {
        if (pvo.currentTargets[slot] !== null) continue;
        if (ts - pvo.lastShots[slot] < (pvo.cd || 0) / 2 / Math.max(gameSpeed, 0.0001)) continue;
        
        pvo.currentTargets[slot] = k;
        pvo.lastShots[slot] = ts;
        
        const config = PPO_CONFIG[pvo.name];
        if (config && config.projectile && config.projectile.hasVisual) {
          createProjectile(pvo, k);
        } else {
          k.hp -= pvo.damage;
        }

        if (k.hp <= 0) {
          const explosion = L.marker([k.position[0], k.position[1]], {
            icon: L.icon({ iconUrl: "assets/explosion.gif", iconSize: [40, 40], iconAnchor: [20, 20] })
          }).addTo(map);
          setTimeout(() => { try { map.removeLayer(explosion); } catch(e){} }, 600 / Math.max(gameSpeed, 0.01));
          try { map.removeLayer(k.marker); } catch(e){}
          kalibrs.splice(i, 1);
          money += 400;
          if (typeof window.trackRankedKill === 'function') {
            window.trackRankedKill('kalibr');
          }
          window.trackQuestKill('kalibr');
          score++;
          updateUI?.();
        }
        break;
      }
    }
  }

  requestAnimationFrame(moveKalibrs);
}

function moveMobilePVO(ts = 0) {
  const now = ts || performance.now();
  
  pvoList.forEach(pvo => {
    if (!pvo.mobile || !pvo.center) return;
    
    // Якщо літак у спеціальному стані атаки крейсера
    if (pvo.hidden || pvo.aircraftState === 'attackRun' || pvo.aircraftState === 'returning' || pvo.aircraftState === 'cooldown') {
      return;
    }
    
    const conf = PLANE_CONFIG[pvo.name];
    if (!conf) return; // Не літак
    
    // === ПЕРЕМІЩЕННЯ НА ЗАДАНУ ГРАВЦЕМ ТОЧКУ ===
    if (pvo.isMovingToTarget && pvo.targetPosition) {
      const dx = pvo.targetPosition.lat - pvo.latlng.lat;
      const dy = pvo.targetPosition.lng - pvo.latlng.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 5) {
        pvo.latlng = L.latLng(pvo.targetPosition.lat, pvo.targetPosition.lng);
        pvo.isMovingToTarget = false;
        pvo.targetPosition = null;
        pvo.planeState = 'patrol';
        pvo.patrolAngle = Math.atan2(dy, dx);
      } else {
        // Плавний рух до точки
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        smoothRotate(pvo, targetAngle, conf.turnSpeed * 2);
        
        const speed = conf.chaseSpeed * 1.5 * gameSpeed;
        const rad = (pvo.currentAngle - 90) * Math.PI / 180;
        pvo.latlng = L.latLng(
          pvo.latlng.lat + Math.cos(rad) * speed,
          pvo.latlng.lng + Math.sin(rad) * speed
        );
      }
      updatePlaneVisuals(pvo);
      return;
    }
    
    // === ОСНОВНА ЛОГІКА ЛІТАКА ===
    
    // Ініціалізація поточної швидкості якщо немає
    if (pvo.currentSpeed === undefined) pvo.currentSpeed = conf.chaseSpeed;
    
    // === ФІКСАЦІЯ ЦІЛІ ===
    // Якщо є поточна ціль - перевіряємо чи вона ще валідна
    let target = pvo.planeTarget;
    if (target) {
      const tDist = Math.hypot(target.position[0] - pvo.latlng.lat, target.position[1] - pvo.latlng.lng);
      
      // Перевіряємо радіус
      if (target.hp <= 0 || !target.marker || tDist > conf.attackRange) {
        // Ціль знищена або вийшла з радіусу - шукаємо нову
        target = null;
        pvo.planeTarget = null;
        pvo.planeState = 'chase';
        pvo.lockStartTime = 0;
        pvo.lockProgress = 0;
      }
    }
    
    // Якщо немає цілі - шукаємо нову
    if (!target) {
      target = findPlaneTarget(pvo, conf);
      pvo.planeTarget = target;
    }
    
    if (target) {
      const targetPos = target.position;
      const dx = targetPos[0] - pvo.latlng.lat;
      const dy = targetPos[1] - pvo.latlng.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const distPercent = dist / conf.attackRange;
      
      // Швидкість цілі
      const targetSpeed = target.speed || 0.3;
      
      // === РЕЖИМ ВІДЛЬОТУ (escape) ===
      // Якщо занадто близько (<40%) і НЕ в режимі захвату - відлітаємо ВІД ЦІЛІ
      if (distPercent < 0.4 && pvo.planeState !== 'lock') {
        
        // Кут ВІД цілі до літака (протилежний напрямок)
        const angleFromTarget = Math.atan2(-dy, -dx) * 180 / Math.PI + 90;
        
        // Якщо тільки почали відліт - запам'ятовуємо
        if (pvo.planeState !== 'escape') {
          pvo.planeState = 'escape';
          pvo.escapeStartDist = dist;
        }
        
        // Плавно повертаємо ВІД цілі
        smoothRotate(pvo, angleFromTarget, conf.turnSpeed * 1.5);
        
        // Плавно прискорюємось (швидше за ціль)
        const desiredSpeed = conf.chaseSpeed * 1.3;
        pvo.currentSpeed += (desiredSpeed - pvo.currentSpeed) * 0.05 * gameSpeed;
        
        // Рух
        const rad = (pvo.currentAngle - 90) * Math.PI / 180;
        pvo.latlng = L.latLng(
          pvo.latlng.lat + Math.cos(rad) * pvo.currentSpeed * gameSpeed,
          pvo.latlng.lng + Math.sin(rad) * pvo.currentSpeed * gameSpeed
        );
        
        updatePlaneVisuals(pvo);
        
        // Виходимо з escape коли відлетіли достатньо (>60%)
        if (distPercent > 0.6) {
          pvo.planeState = 'chase';
        }
        
        return;
      }
      
      // === РЕЖИМ ЗАХВАТУ (lock) ===
      if (dist < conf.attackRange) {
        // Якщо ще не в режимі lock - входимо
        if (pvo.planeState !== 'lock') {
          pvo.planeState = 'lock';
          pvo.lockStartTime = now;
        }
        
        // Накопичуємо час захвату
        const lockTime = now - pvo.lockStartTime;
        pvo.lockProgress = Math.min(100, (lockTime / conf.lockOnTime) * 100);
        
        // Стріляємо коли захват завершено
        if (pvo.lockProgress >= 100) {
          const cdMs = pvo.cd / Math.max(gameSpeed, 0.001);
          if (now - pvo.lastShot >= cdMs) {
            pvo.lastShot = now;
            firePlaneRocket(pvo, target);
          }
        }
        
        // Кут до цілі
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        smoothRotate(pvo, targetAngle, conf.turnSpeed);
        
        // === ШВИДКІСТЬ В РЕЖИМІ ЗАХВАТУ ===
        let desiredSpeed;
        if (distPercent < 0.4) {
          // Занадто близько - підлаштовуємось під швидкість цілі
          desiredSpeed = targetSpeed * 1.0;
        } else if (distPercent < 0.6) {
          // Трохи близько - трохи швидше за ціль
          desiredSpeed = targetSpeed * 1.2;
        } else {
          // Нормальна дистанція - переслідуємо швидко
          desiredSpeed = conf.chaseSpeed;
        }
        
        // Плавна зміна швидкості
        pvo.currentSpeed += (desiredSpeed - pvo.currentSpeed) * 0.03 * gameSpeed;
        
        // Рух
        const rad = (pvo.currentAngle - 90) * Math.PI / 180;
        pvo.latlng = L.latLng(
          pvo.latlng.lat + Math.cos(rad) * pvo.currentSpeed * gameSpeed,
          pvo.latlng.lng + Math.sin(rad) * pvo.currentSpeed * gameSpeed
        );
        
      } else {
        // === РЕЖИМ ПЕРЕСЛІДУВАННЯ (chase) ===
        pvo.planeState = 'chase';
        pvo.lockStartTime = 0;
        pvo.lockProgress = 0;
        
        // Кут до цілі
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        smoothRotate(pvo, targetAngle, conf.turnSpeed);
        
        // Плавно набираємо швидкість переслідування
        pvo.currentSpeed += (conf.chaseSpeed - pvo.currentSpeed) * 0.05 * gameSpeed;
        
        // Рух
        const rad = (pvo.currentAngle - 90) * Math.PI / 180;
        pvo.latlng = L.latLng(
          pvo.latlng.lat + Math.cos(rad) * pvo.currentSpeed * gameSpeed,
          pvo.latlng.lng + Math.sin(rad) * pvo.currentSpeed * gameSpeed
        );
      }
      
      updatePlaneVisuals(pvo);
      
    } else {
      // Немає цілі - патрулюємо
      pvo.planeTarget = null;
      pvo.planeState = 'patrol';
      pvo.lockProgress = 0;
      
      // Патруль по колу
      pvo.patrolAngle += conf.patrolSpeed * 0.015 * gameSpeed;
      const patrolRadius = 50;
      const targetLat = pvo.center.lat + Math.sin(pvo.patrolAngle) * patrolRadius;
      const targetLng = pvo.center.lng + Math.cos(pvo.patrolAngle) * patrolRadius;
      
      const dx = targetLat - pvo.latlng.lat;
      const dy = targetLng - pvo.latlng.lng;
      const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      
      smoothRotate(pvo, targetAngle, conf.turnSpeed * 0.5);
      
      // Плавно сповільнюємось до швидкості патруля
      pvo.currentSpeed += (conf.patrolSpeed - pvo.currentSpeed) * 0.03 * gameSpeed;
      
      // Рух у напрямку погляду
      const rad = (pvo.currentAngle - 90) * Math.PI / 180;
      pvo.latlng = L.latLng(
        pvo.latlng.lat + Math.cos(rad) * pvo.currentSpeed * gameSpeed,
        pvo.latlng.lng + Math.sin(rad) * pvo.currentSpeed * gameSpeed
      );
    }
    
    updatePlaneVisuals(pvo);
  });
  
  requestAnimationFrame(moveMobilePVO);
}

/**
 * Плавний поворот літака
 */
function smoothRotate(pvo, targetAngle, speed) {
  if (pvo.currentAngle === undefined) pvo.currentAngle = targetAngle;
  
  // Нормалізуємо кути до 0-360
  while (targetAngle < 0) targetAngle += 360;
  while (targetAngle >= 360) targetAngle -= 360;
  while (pvo.currentAngle < 0) pvo.currentAngle += 360;
  while (pvo.currentAngle >= 360) pvo.currentAngle -= 360;
  
  // Знаходимо найкоротший шлях
  let diff = targetAngle - pvo.currentAngle;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  // Плавний поворот
  pvo.currentAngle += diff * speed * gameSpeed;
}

/**
 * Оновлення візуалів літака
 */
function updatePlaneVisuals(pvo) {
  if (pvo.marker) pvo.marker.setLatLng(pvo.latlng);
  if (pvo.rangeCircle) pvo.rangeCircle.setLatLng(pvo.latlng);
  if (pvo.radarHelpers) pvo.radarHelpers.setCenter(pvo.latlng);
  
  const img = pvo.marker?.getElement()?.querySelector("img");
  if (img) img.style.transform = `rotate(${pvo.currentAngle}deg)`;
}

/**
 * Пошук цілі для літака
 */
function findPlaneTarget(pvo, conf) {
  let best = null;
  let bestDist = conf.attackRange; // СТРОГО в радіусі!
  
  // Дрони
  drones.forEach(d => {
    if (d.hp <= 0 || !d.marker) return;
    const type = d.type === "heavy" ? "heavy_drones" : "shaheds";
    if (!canTargetEnemy(pvo, type)) return;
    
    const dist = Math.hypot(d.position[0] - pvo.latlng.lat, d.position[1] - pvo.latlng.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  });
  
  // Ракети
  rockets.forEach(r => {
    if (r.hp <= 0 || !r.marker) return;
    if (!canTargetEnemy(pvo, "rockets")) return;
    
    const dist = Math.hypot(r.position[0] - pvo.latlng.lat, r.position[1] - pvo.latlng.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = r;
    }
  });
  
  // Калібри
  kalibrs.forEach(k => {
    if (k.hp <= 0 || !k.marker) return;
    if (!canTargetEnemy(pvo, "calibers")) return;
    
    const dist = Math.hypot(k.position[0] - pvo.latlng.lat, k.position[1] - pvo.latlng.lng);
    if (dist < bestDist) {
      bestDist = dist;
      best = k;
    }
  });
  
  return best;
}

/**
 * Постріл ракетою з літака
 */
function firePlaneRocket(pvo, target) {
  if (!pvo || !target || !target.position) return;
  
  const startPos = pvo.latlng;
  const targetPos = target.position;
  
  // Точка випередження
  let aimLat = targetPos[0];
  let aimLng = targetPos[1];
  if (target.target) {
    const dirX = target.target[0] - targetPos[0];
    const dirY = target.target[1] - targetPos[1];
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY);
    if (dirLen > 0.01) {
      aimLat += (dirX / dirLen) * 15;
      aimLng += (dirY / dirLen) * 15;
    }
  }
  
  const dx = aimLat - startPos.lat;
  const dy = aimLng - startPos.lng;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const moveAngle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Урон та шанс влучення
  const config = PPO_CONFIG[pvo.name];
  // hitChance - спочатку з pvo.projectile (для туторіалу), потім з config
  const hitChance = (pvo.projectile && pvo.projectile.hitChance !== undefined)
    ? pvo.projectile.hitChance
    : (config?.projectile?.hitChance || 0.85);
  const accuracyBonus = pvo.upgrades ? pvo.upgrades.accuracy * 0.05 : 0;
  const willHit = Math.random() < Math.min(hitChance + accuracyBonus, 0.99);
  const actualDamage = pvo.upgrades ? applyDamageUpgrade(pvo) : pvo.damage;
  
  // Використовуємо planerocket.png або з конфіга
  const projImg = "assets/planerocket.png";
  const projSize = config?.projectile?.size || [30, 30];
  // speed - спочатку з pvo.projectile, потім з config
  const projSpeed = (pvo.projectile && pvo.projectile.speed !== undefined)
    ? pvo.projectile.speed
    : (config?.projectile?.speed || 1.2);
  
  try {
    const projectileMarker = L.marker([startPos.lat, startPos.lng], {
      icon: L.divIcon({
        className: 'projectile-icon',
        html: `<img src="${projImg}" style="width:${projSize[0]}px; height:${projSize[1]}px; transform:rotate(${moveAngle}deg); transform-origin:center;" />`,
        iconSize: projSize,
        iconAnchor: [projSize[0] / 2, projSize[1] / 2]
      }),
      interactive: false,
      zIndexOffset: 2000
    }).addTo(map);
    
    projectiles.push({
      marker: projectileMarker,
      startPos: { lat: startPos.lat, lng: startPos.lng },
      targetPos: { lat: aimLat, lng: aimLng },
      currentPos: { lat: startPos.lat, lng: startPos.lng },
      speed: projSpeed,
      speedInCoords: projSpeed * 3.5, // Фіксована швидкість (не залежить від відстані)
      progress: 0,
      moveAngle: moveAngle,
      lastGoodAngle: moveAngle,
      visualAngle: moveAngle,
      rotationOffset: 0,
      size: projSize,
      img: projImg,
      target: target,
      willHit: willHit,
      damage: actualDamage,
      isBullet: false,
      damageDealt: false
    });
  } catch (e) {
    console.warn('Plane rocket error:', e);
    if (willHit) target.hp -= actualDamage;
  }
}


function handleEnemyImpact(enemy, index) {
  // 1) Цілі
  let target = defensePoints.find(p => p.lat === enemy.target[0] && p.lng === enemy.target[1]);
  if (target && target.alive) {
    let damage = 0;
    if (enemy.type === "light") damage = Math.round(15 + Math.random() * 10);
    if (enemy.type === "heavy") damage = Math.round(25 + Math.random() * 10);
    if (rockets.includes(enemy)) damage = Math.round(75 + Math.random() * 10);

    target.hp -= damage;
    if (target.hp <= 0) {
      target.alive = false;
      target.marker.setIcon(L.divIcon({ html: "<i class='fas fa-bomb' style='color:#ff6600'></i>", className: "" }));
      if (target.noBuildCircle) {
        map.removeLayer(target.noBuildCircle);
        target.noBuildCircle = null;
      }
            if (target.isAvariika) {
        avariikaActive = false;
        updatePvoPurchaseAvailability?.();
      }

      map.removeLayer(target.hpMarker);
      if (!sandboxMode && !tutorialMode && defensePoints.filter(p => p.alive && !p.isAvariika).length === 0) endGame();
          } else {
      updateHpUIForPoint(target);
    }

    map.removeLayer(enemy.marker);
    enemy.hp = -1;
    pvoList.forEach(p => { if (p && p.currentTargets) { for (let i = 0; i < p.currentTargets.length; i++) { if (p.currentTargets[i] === enemy) p.currentTargets[i] = null; } } });
    if (enemy.type === "light" || enemy.type === "heavy") drones.splice(index, 1);
    else rockets.splice(index, 1);
    return;
  }

  // 2) Аеродром
  let airport = airports.find(a => a.lat === enemy.target[0] && a.lng === enemy.target[1] && a.alive);
  if (airport) {
    let damage = 0;
    if (enemy.type === "light") damage = Math.round(15 + Math.random() * 10);
    if (enemy.type === "heavy") damage = Math.round(25 + Math.random() * 10);
    if (rockets.includes(enemy)) damage = Math.round(75 + Math.random() * 10);

    airport.hp -= damage;
    if (airport.hp <= 0) {
      airport.alive = false;
      airport.marker.setIcon(L.divIcon({ html: "<i class='fas fa-bomb' style='color:#ff6600'></i>", className: "" }));
      map.removeLayer(airport.noBuildCircle);
      map.removeLayer(airport.hpMarker);
      destroyPlanesDockedAtAirport(airport);
    } else {
      updateHpUIForPoint(airport);
    }

    map.removeLayer(enemy.marker);
    enemy.hp = -1;
    pvoList.forEach(p => { if (p && p.currentTargets) { for (let i = 0; i < p.currentTargets.length; i++) { if (p.currentTargets[i] === enemy) p.currentTargets[i] = null; } } });
    if (enemy.type === "light" || enemy.type === "heavy") drones.splice(index, 1);
    else rockets.splice(index, 1);
    return;
  }

  // 3) ППО – знищуються з одного удару
  // Guard against PVOs without coordinates (e.g., destroyed/cooldown)
  const pvo = pvoList.find(p => p && p.latlng && p.latlng.lat === enemy.target[0] && p.latlng.lng === enemy.target[1]);
  if (pvo) {
    map.removeLayer(pvo.marker);
    if (pvo.rangeCircle) map.removeLayer(pvo.rangeCircle);
    if (pvo.radarHelpers) pvo.radarHelpers.remove();
    const pvoIdx = pvoList.indexOf(pvo);
    if (pvoIdx !== -1) {
      pvoList.splice(pvoIdx, 1);
      if (TEMP_DEBUG_PVO_COUNTER) updateUI();
    }
  }

  map.removeLayer(enemy.marker);
  enemy.hp = -1;
  pvoList.forEach(p => { if (p && p.currentTargets) { for (let i = 0; i < p.currentTargets.length; i++) { if (p.currentTargets[i] === enemy) p.currentTargets[i] = null; } } });
  if (enemy.type === "light" || enemy.type === "heavy") drones.splice(index, 1);
  else rockets.splice(index, 1);
}

function checkVictory() {
  if (gameWon || gameOver || sandboxMode || tutorialMode) return;
  const aliveTargets = defensePoints.filter(p => p.alive && !p.isAvariika);
  if (aliveTargets.length > 0) {
    gameWon = true;
    let message = typeof translate === 'function' ? translate('victoryMain', 'game') : '<i class="fas fa-trophy" style="color:#FFD700"></i> Перемога! Ти захистив Україну!';
    if (aliveTargets.length === 6) {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory6', 'game') : '<i class="fas fa-trophy" style="color:#FFD700"></i> Усі 6 цілей - недоторкані.<br>Небо трималось на тобі. І ти не впав.') + "</b>";
    } else if (aliveTargets.length === 5) {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory5', 'game') : '<i class="fas fa-circle" style="color:#4CAF50"></i> 5 з 6 вціліли.<br>Майже ідеально. Навіть зорі аплодують тобі сьогодні.') + "</b>";
    } else if (aliveTargets.length === 4) {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory4', 'game') : '<i class="fas fa-circle" style="color:#FFEB3B"></i> 4 цілі витримали бурю.<br>Ти був щитом, і щитом залишився.') + "</b>";
    } else if (aliveTargets.length === 3) {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory3', 'game') : '<i class="fas fa-circle" style="color:#FF9800"></i> Половина цілей вистояла.<br>Іноді перемога - це не тріумф, а виживання. Але це теж героїзм.') + "</b>";
    } else if (aliveTargets.length === 2) {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory2', 'game') : '<i class="fas fa-circle" style="color:#f44336"></i> Лишилось дві. Вони горять, але стоять.<br>І памятають, хто їх врятував.') + "</b>";
    } else {
      message += "<br><b>" + (typeof translate === 'function' ? translate('victory1', 'game') : '✖ Лишилась одна серед попелу. Змучена. Самотня.<br>Та цього достатньо, аби сказати: Ми встояли.') + "</b>";
    }
    const supportText = typeof translate === 'function' ? translate('supportGame', 'game') : '<i class="fas fa-heart" style="color:#4CAF50"></i> Підтримати гру';
    const tryAgainText = typeof translate === 'function' ? translate('tryAgain', 'game') : '<i class="fas fa-redo" style="color:#2196F3"></i> Спробувати ще!';
    message += `<br><br><button onclick="window.open('https://send.monobank.ua/jar/z1H8hEA96', '_blank')" style="padding:10px 20px; font-size:16px; background-color:#28a745; color:#fff; border:none; border-radius:8px; cursor:pointer;">${supportText}</button>`;
    message += `<br><br><button onclick="location.reload()" style="padding:10px 20px; font-size:16px; background-color:#555; color:#fff; border:none; border-radius:8px; cursor:pointer;">${tryAgainText}</button>`;
    showVictoryScreen(message);
  }
}

function endGame() {
  gameOver = true;
  
  // Якщо ранговий режим - показати спеціальний екран
  if (window.rankedMode && typeof window.showRankedGameOver === 'function') {
    window.showRankedGameOver();
    return;
  }
  
  // Звичайний game over
  const message = `
    <div style="font-size:18px; text-align:center;">
      ✖ <b>Гра закінчена!</b><br>Всі цілі було знищено...
      <br><br>
      <button onclick="window.open('https://send.monobank.ua/jar/z1H8hEA96', '_blank')" style="padding:10px 20px; font-size:16px; background-color:#28a745; color:#fff; border:none; border-radius:8px; cursor:pointer; margin-bottom:10px;">♥️ Підтримати авторів гри</button>
      <br>
      <button onclick="location.reload()" style="padding:10px 20px; font-size:16px; background-color:#555; color:#fff; border:none; border-radius:8px; cursor:pointer;"><i class='fas fa-redo' style='color:#2196F3'></i> Спробувати ще!</button>
    </div>
  `;
  const modal = document.createElement('div');
  modal.innerHTML = message;
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#111';
  modal.style.color = '#fff';
  modal.style.padding = '30px';
  modal.style.borderRadius = '12px';
  modal.style.zIndex = '10000';
  modal.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
  document.body.appendChild(modal);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // вкладка скрыта → ставим игру на паузу
    previousSpeed = gameSpeed;
    setGameSpeed(0);
  } else {
    // вкладка снова видна → сбрасываем lastFrameTime чтобы не накопился огромный delta
    lastFrameTime = performance.now();
    setGameSpeed(previousSpeed || 1);
  }
});

// User System

// Перевірка авторизації при завантаженні
window.addEventListener('load', function() {
    checkAuth();
});

async function checkAuth() {
    try {
        const response = await fetch('check_login.php', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data && data.logged_in) {
            currentUser = {
                id: data.user_id,
                username: data.username,
                email: data.email
            };
            // НЕ викликаємо updateUserIcon() — нею керує checkLoginStatus() в index.html
        } else {
            currentUser = null;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        // НЕ скидаємо UI — нею керує checkLoginStatus() в index.html
    }
}

function toggleUserMenu() {
    if (!currentUser) {
        window.location.href = 'login.php';
        return;
    }

    const modal = document.getElementById('userModal');
    if (!modal) return;

    modal.classList.add('active');
    loadUserProfile();
}

function closeUserMenu() {
    const modal = document.getElementById('userModal');
    if (!modal) return;

    modal.classList.remove('active');
}


async function loadUserProfile() {
    if (!currentUser) return;
    
    // Оновити аватар і ім'я
    document.getElementById('userAvatarLarge').textContent = currentUser.username.charAt(0).toUpperCase();
    document.getElementById('userUsername').textContent = currentUser.username;
    document.getElementById('userEmail').value = currentUser.email;
    
    // Завантажити дані профілю
    try {
        const response = await fetch('get_profile.php');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('firstName').value = data.profile.first_name || '';
            document.getElementById('birthdate').value = data.profile.birthdate || '';
        }
    } catch (error) {
        console.error('Profile load error:', error);
    }
}

async function activatePromo() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim();
    
    if (!code) {
        alert('Введи промокод!');
        return;
    }
    
    try {
        const response = await fetch('activate_promo.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'code=' + encodeURIComponent(code)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showPromoReward(data.reward);
            promoInput.value = '';
        } else {
            alert(data.error || 'Помилка активації');
        }
    } catch (error) {
        console.error('Promo activation error:', error);
        alert('Помилка активації промокоду');
    }
}

function showPromoReward(reward) {
    // Створити модальне вікно анімації
    const modal = document.createElement('div');
    modal.className = 'promo-reward-modal';
    modal.innerHTML = `
        <div class="promo-reward-content">
            <div class="promo-confetti" id="promoConfetti"></div>
            <div class="promo-icon-container">
                <div class="promo-icon-glow"></div>
                <i class="fas fa-gift promo-icon"></i>
            </div>
            <h2 class="promo-title">ВІТАЄМО!</h2>
            <p class="promo-subtitle">Промокод активовано</p>
            <div class="promo-rewards" id="promoRewards"></div>
            <button class="promo-btn" onclick="closePromoReward()">
                <i class="fas fa-check"></i> Прийняти
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Додати конфетті
    createPromoConfetti();
    
    // Показати нагороди з анімацією
    setTimeout(() => {
        displayPromoRewards(reward);
    }, 800);
}

function createPromoConfetti() {
    const container = document.getElementById('promoConfetti');
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'promo-confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }, i * 20);
    }
}

function displayPromoRewards(reward) {
    const container = document.getElementById('promoRewards');
    const items = reward.description.split(', ');
    
    container.innerHTML = items.map((item, index) => `
        <div class="promo-reward-item" style="animation-delay: ${index * 0.2}s">
            <i class="fas fa-${getRewardIcon(item)}"></i>
            <span>${item}</span>
        </div>
    `).join('');
}

function getRewardIcon(itemText) {
    if (itemText.includes('сундук') || itemText.includes('Сундук')) return 'treasure-chest';
    if (itemText.includes('Patriot')) return 'shield-alt';
    if (itemText.includes('F-16') || itemText.includes('МіГ') || itemText.includes('Су-')) return 'fighter-jet';
    if (itemText.includes('РЕБ')) return 'satellite-dish';
    if (itemText.includes('Радар')) return 'radar';
    return 'layer-group';
}

function closePromoReward() {
    const modal = document.querySelector('.promo-reward-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

async function logout() {
    try {
        await fetch('logout.php');
        currentUser = null;
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Закрити модалку при кліку поза нею
document.getElementById('userModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeUserMenu();
    }
});

updateUI();
updateResourcesUI();