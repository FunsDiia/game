// ========================================
// КОНФІГУРАЦІЯ ВОРОГІВ
// ========================================

const ENEMIES_CONFIG = {
  shahed: {
    name: "Shahed-136",
    baseHP: 20,
    baseSpeed: 0.3,
    img: "assets/drone.png",
    iconSize: [35, 35], // Зменшено з 40
    iconAnchor: [17, 17]
  },

  heavyDrone: {
    name: "Heavy Drone",
    baseHP: 80,
    baseSpeed: 0.4,
    img: "assets/heavy-drone.png",
    iconSize: [45, 45],
    iconAnchor: [22, 22]
  },

  rocket: {
    name: "Rocket",
    baseHP: 150,
    baseSpeed: 0.5,
    img: "assets/rocket.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  },

  kalibr: {
    name: "Kalibr",
    baseHP: 120,
    baseSpeed: 0.6,
    img: "assets/kalibr.png",
    iconSize: [50, 50],
    iconAnchor: [25, 25]
  }
};

// ========================================
// ФОРМУЛИ МАСШТАБУВАННЯ
// ========================================

/**
 * Розрахунок HP ворога на певній хвилі
 * @param {number} baseHP - Базове HP
 * @param {number} wave - Номер хвилі (1, 2, 3...)
 * @returns {number} HP ворога
 */
function getEnemyHP(baseHP, wave) {
  return Math.floor(baseHP + baseHP * 0.2 * (wave - 1));
}

/**
 * Розрахунок швидкості ворога на певній хвилі
 * @param {number} baseSpeed - Базова швидкість
 * @param {number} wave - Номер хвилі
 * @returns {number} Швидкість ворога
 */
function getEnemySpeed(baseSpeed, wave) {
  return baseSpeed + baseSpeed * 0.04 * (wave - 1);
}

/**
 * Створення ворога з характеристиками для поточної хвилі
 * @param {string} type - Тип ворога (shahed, heavyDrone, rocket, kalibr)
 * @param {number} wave - Номер хвилі
 * @returns {object} Об'єкт з характеристиками ворога
 */
function createEnemy(type, wave) {
  const config = ENEMIES_CONFIG[type];
  if (!config) {
    console.error(`Невідомий тип ворога: ${type}`);
    return null;
  }

  return {
    type,
    name: config.name,
    hp: getEnemyHP(config.baseHP, wave),
    maxHP: getEnemyHP(config.baseHP, wave),
    speed: getEnemySpeed(config.baseSpeed, wave),
    img: config.img,
    iconSize: config.iconSize,
    iconAnchor: config.iconAnchor
  };
}

// ========================================
// ТАБЛИЦЯ ХАРАКТЕРИСТИК ПО ХВИЛЯМ
// ========================================

/**
 * Генерує таблицю характеристик для дебагу
 * @param {number} maxWave - Максимальна хвиля для відображення
 */
function debugEnemyStats(maxWave = 10) {
  console.log("=== ХАРАКТЕРИСТИКИ ВОРОГІВ ПО ХВИЛЯМ ===");
  
  for (let wave = 1; wave <= maxWave; wave++) {
    console.log(`\n--- ХВИЛЯ ${wave} ---`);
    
    Object.keys(ENEMIES_CONFIG).forEach(type => {
      const enemy = createEnemy(type, wave);
      console.log(`${enemy.name}: ${enemy.hp} HP, ${enemy.speed.toFixed(3)} швидкість`);
    });
  }
}