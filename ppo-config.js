// ========================================
// 🎯 КОНФІГУРАЦІЯ ППО (ПОВНА ВЕРСІЯ)
// ========================================

const PPO_CONFIG = {
  // ========================================
  // COMMON ППО (базові)
  // ========================================
  
  "Кулемет": {
    name: "Кулемет",
    price: 400,
    damage: 14,
    cd: 500,
    radius: 120,
    img: "assets/kulemet.png",
    iconSize: [55, 55],
    rarity: "common",
    canTarget: ["shaheds"],  // Тільки шахеди
    projectile: {
      speed: 0.8,
      hitChance: 0.55,
      type: "bullet",
      img: "assets/kulemetrocket.png",
      size: [20, 20],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "MADT": {
    name: "MADT",
    price: 600,
    damage: 40,
    cd: 2000,
    radius: 160,
    img: "assets/madt.png",
    iconSize: [55, 55],
    rarity: "common",
    canTarget: ["heavy_drones"],  // Тільки тяжкі дрони
    projectile: {
      speed: 0.75,
      hitChance: 0.55,
      type: "bullet",  // Пулемет
      img: "assets/kulemetrocket.png",
      size: [28, 28],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "Радар": {
    name: "Радар",
    price: 100,
    damage: 0,
    cd: 0,
    radius: 333,
    img: "assets/radar.png",
    iconSize: [35, 35],
    rarity: "common",
    radar: true,
    canTarget: ["shaheds", "heavy_drones", "rockets", "calibers"]  // Виявляє всіх
  },

  // ========================================
  // RARE ППО (спеціалізовані)
  // ========================================

  "Crotale 90M": {
    name: "Crotale 90M",
    price: 900,
    damage: 45,
    cd: 1800,
    radius: 155,
    img: "assets/crotale90m.png",
    iconSize: [55, 55],
    rarity: "rare",
    canTarget: ["shaheds", "heavy_drones"],  // Шахеди + тяж дрони
    projectile: {
      speed: 0.9,
      hitChance: 0.60,
      type: "rocket",
      img: "assets/crotale90mrocket.png",
      size: [26, 26],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "IRIS-T SML": {
    name: "IRIS-T SML",
    price: 1000,
    damage: 35,
    cd: 2200,
    radius: 165,
    img: "assets/iristsml.png",
    iconSize: [55, 55],
    rarity: "rare",
    canTarget: ["shaheds", "rockets"],  // Шахеди + ракети
    projectile: {
      speed: 0.8,
      hitChance: 0.60,
      type: "rocket",
      img: "assets/iristsmlrocket.png",
      size: [28, 28],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "РЕБ": {
    name: "РЕБ",
    price: 500,
    damage: 0,
    cd: 0,
    radius: 190,
    img: "assets/reb.png",
    iconSize: [45, 45],
    rarity: "rare",
    reb: true,
    slowFactor: 0.55,
    rebKnockdownChance: 10,
    canTarget: ["shaheds", "heavy_drones", "rockets", "calibers"]  // Уповільнює всіх
  },

  "МіГ-29": {
    name: "МіГ-29",
    price: 2000,
    damage: 225,
    cd: 1050,
    radius: 220,
    accuracy: 60,
    img: "assets/mig29.png",
    iconSize: [55, 55],
    rarity: "rare",
    isPlane: true,
    mobile: true,
    canTarget: ["shaheds", "heavy_drones"],  // Шахеди + тяж дрони
    projectile: {
      speed: 1.2,
      hitChance: 0.60,
      type: "missile",
      img: "assets/planerocket.png",
      size: [34, 34],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  // ========================================
  // EPIC ППО (потужні)
  // ========================================

  "2K12 KUB": {
    name: "2K12 KUB",
    price: 1100,
    damage: 27,
    cd: 2500,
    radius: 170,
    img: "assets/2k12kub.png",
    iconSize: [55, 55],
    rarity: "epic",
    canTarget: ["shaheds", "heavy_drones", "rockets"],  // Шахеди + дрони + ракети
    projectile: {
      speed: 0.7,
      hitChance: 0.65,
      type: "rocket",
      img: "assets/2k12kubrocket.png",
      size: [30, 30],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "Patriot": {
    name: "Patriot",
    price: 2400,
    damage: 50,
    cd: 1100,
    radius: 200,
    img: "assets/patriot.png",
    iconSize: [55, 55],
    rarity: "epic",
    canTarget: ["rockets", "calibers"],  // Тільки ракети + калібри
    projectile: {
      speed: 0.85,
      hitChance: 0.65,
      type: "rocket",
      img: "assets/patriotrocket.png",
      size: [34, 34],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "Су-27": {
    name: "Су-27",
    price: 1800,
    damage: 150,
    cd: 1400,
    radius: 260,
    accuracy: 65,
    img: "assets/su27.png",
    iconSize: [55, 55],
    rarity: "epic",
    isPlane: true,
    mobile: true,
    canTarget: ["shaheds", "heavy_drones", "rockets"],  // Шахеди + дрони + ракети
    projectile: {
      speed: 1.1,
      hitChance: 0.65,
      type: "missile",
      img: "assets/planerocket.png",
      size: [34, 34],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  // ========================================
  // LEGENDARY ППО (найкращі)
  // ========================================

  "Кільчень": {
    name: "Кільчень",
    price: 1800,
    damage: 78,
    cd: 925,
    radius: 175,
    img: "assets/kilchen.png",
    iconSize: [55, 55],
    rarity: "legendary",
    canTarget: ["shaheds", "heavy_drones", "rockets", "calibers"],  // ВСЕ крім крейсера
    projectile: {
      speed: 0.9,
      hitChance: 0.70,
      type: "rocket",
      img: "assets/kilchenrocket.png",
      size: [32, 32],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  "F-16": {
    name: "F-16",
    price: 3600,
    damage: 300,
    cd: 700,
    radius: 300,
    accuracy: 70,
    img: "assets/f16.png",
    iconSize: [55, 55],
    rarity: "legendary",
    isPlane: true,
    mobile: true,
    canTarget: ["shaheds", "heavy_drones", "rockets", "calibers", "cruiser"],  // ВСЕ + крейсер!
    projectile: {
      speed: 1.3,
      hitChance: 0.70,
      type: "missile",
      img: "assets/planerocket.png",
      size: [38, 38],
      hasVisual: true,
      rotationOffset: 0
    }
  },

  // ========================================
  // БУДІВЛІ
  // ========================================

  "Аеродром": {
    name: "Аеродром",
    price: 3000,
    damage: 0,
    cd: 0,
    radius: 200,
    img: "assets/aeroport.png",
    iconSize: [55, 55],
    rarity: "epic",
    noUpgrade: true,
    isBuilding: true,
    canTarget: []
  }
};

// ========================================
// 🌍 ФУНКЦІЯ ПЕРЕКЛАДУ НАЗВ ППО
// ========================================
function getTranslatedPPOName(name) {
  const translatable = ['Кулемет', 'Радар', 'РЕБ', 'Кільчень', 'Аеродром', 'Аварійка'];
  
  if (translatable.includes(name)) {
    // Використовуємо translations.js якщо доступний
    if (typeof translate === 'function') {
      return translate(name, 'ppo');
    }
  }
  
  // F-16, Patriot, 2K12 KUB, etc залишаються як є
  return name;
}

// ========================================
// 🌍 ФУНКЦІЯ ПЕРЕКЛАДУ РАРНОСТІ
// ========================================
function getTranslatedRarity(rarity) {
  if (typeof translate === 'function') {
    return translate(rarity, 'rarity');
  }
  
  // Fallback
  const rarityMap = {
    'common': 'Звичайний',
    'rare': 'Рідкісний',
    'epic': 'Епічний',
    'legendary': 'Легендарний'
  };
  
  return rarityMap[rarity] || rarity;
}

console.log('✅ ppo-config.js завантажено');