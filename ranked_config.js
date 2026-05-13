// ========================================
// 🎮 КОНФІГУРАЦІЯ РАНГОВОГО РЕЖИМУ
// ========================================
// Всі значення легко змінювати тут!

const RANKED_CONFIG = {
    
    // ========================================
    // ЛІМІТ ППО
    // ========================================
    PVO_LIMIT_MULTIPLIER: 3,  // Ліміт ППО = кількість цілей * це значення
    
    // ========================================
    // МАКСИМАЛЬНІ РІВНІ
    // ========================================
    MAX_LEVEL: 11,  // Максимальний рівень характеристик (1-11)
    
    // ========================================
    // РЕДКІСТЬ ППО
    // ========================================
    PPO_RARITIES: {
        kulemet: 'common',
        radar: 'common',
        madt: 'common',
        crotale90m: 'rare',
        iristsml: 'rare',
        reb: 'rare',
        mig29: 'rare',
        '2k12kub': 'epic',
        patriot: 'epic',
        su27: 'epic',
        kilchen: 'legendary',
        f16: 'legendary'
    },
    
    // ========================================
    // МНОЖНИКИ КАРТ ЗА РЕДКІСТЮ (УРОН + ШВИДКІСТЬ)
    // ========================================
    // ФОРМУЛА: рівень × множник
    // Рівень 1: 1×4=4, 1×3=3, 1×2=2, 1×1=1
    // Рівень 2: 2×4=8, 2×3=6, 2×2=4, 2×1=2
    CARD_MULTIPLIERS: {
        common: 4,
        rare: 3,
        epic: 2,
        legendary: 1
    },
    
    // ========================================
    // МНОЖНИКИ КАРТ (ПЕРЕЗАРЯДКА/ТОЧНІСТЬ/РАДІУС)
    // ========================================
    // ФОРМУЛА: рівень × множник
    // Рівень 1: leg=5, epic=15, rare=45, common=135
    // Рівень 2: leg=10, epic=30, rare=90, common=270
    SECONDARY_MULTIPLIERS: {
        common: 135,
        rare: 45,
        epic: 15,
        legendary: 5
    },
    
    // ========================================
    // ЦІНА ОДНІЄЇ КАРТИ
    // ========================================
    CARD_PRICES: {
        common: 30,
        rare: 90,
        epic: 270,
        legendary: 810
    },
    
    // ========================================
    // БОНУСИ ЗА РІВЕНЬ (у відсотках)
    // ========================================
    UPGRADE_BONUSES: {
        // Урон: +X% за рівень
        damage: {
            percentPerLevel: 10  // +10% урону за рівень
        },
        // Швидкість снаряда: +X% за рівень
        speed: {
            percentPerLevel: 8   // +8% швидкості за рівень
        },
        // Перезарядка: -X% за рівень (швидше)
        reload: {
            percentPerLevel: 2.5  // -2.5% CD за рівень
        },
        // Радіус: +X% за рівень
        radius: {
            percentPerLevel: 2.5  // +2.5% радіусу за рівень
        },
        // Точність: +X% за рівень (абсолютне значення)
        accuracy: {
            absolutePerLevel: 2.5  // +2.5% точності за рівень
        }
    },
    
    // ========================================
    // РЕБ - ОСОБЛИВІ ХАРАКТЕРИСТИКИ
    // ========================================
    REB_UPGRADES: {
        // Ефективність замедління: +X% за рівень
        slow: {
            absolutePerLevel: 2.5  // -60% → -62.5% → -65% ...
        },
        // Шанс збиття: +X% за рівень
        knockdown: {
            baseChance: 10,        // Базовий шанс збиття 10%
            absolutePerLevel: 2.5  // +2.5% за рівень
        },
        // Радіус (як у звичайних)
        radius: {
            percentPerLevel: 2.5
        }
    },
    
    // ========================================
    // БАЗОВІ ХАРАКТЕРИСТИКИ ППО
    // Автоматично генеруються з PPO_CONFIG!
    // ========================================
    BASE_STATS: {}  // Заповнюється автоматично нижче
};

// ========================================
// 🔄 АВТОМАТИЧНА СИНХРОНІЗАЦІЯ З PPO_CONFIG
// ========================================
function syncBaseStatsFromPPOConfig() {
    if (typeof PPO_CONFIG === 'undefined') {
        console.warn('⚠️ PPO_CONFIG не знайдено, використовую fallback');
        return;
    }
    
    // Маппінг назв до ID
    const nameToId = {
        'Кулемет': 'kulemet',
        '2K12 KUB': '2k12kub',
        'Crotale 90M': 'crotale90m',
        'IRIS-T SML': 'iristsml',
        'MADT': 'madt',
        'Кільчень': 'kilchen',
        'Patriot': 'patriot',
        'F-16': 'f16',
        'МіГ-29': 'mig29',
        'Су-27': 'su27',
        'РЕБ': 'reb',
        'Радар': 'radar',
    };
    
    for (const [ppoName, config] of Object.entries(PPO_CONFIG)) {
        const ppoId = nameToId[ppoName];
        if (!ppoId) continue;
        
        const baseStats = {
            name: config.name,
            damage: config.damage || 0,
            speed: config.projectile ? config.projectile.speed : 0,
            reload: config.cd || 0,
            radius: config.radius || 0,
            accuracy: config.projectile ? Math.round(config.projectile.hitChance * 100) : 0,
            img: config.img,
            rarity: RANKED_CONFIG.PPO_RARITIES[ppoId] || 'common'
        };
        
        if (config.isPlane) baseStats.isPlane = true;
        if (config.reb) {
            baseStats.isREB = true;
            baseStats.slowFactor = Math.round(config.slowFactor * 100);
            baseStats.knockdownChance = config.rebKnockdownChance || 10;
        }
        if (config.radar) baseStats.isRadar = true;
        if (config.isBuilding) baseStats.isAerodrom = true;
        
        RANKED_CONFIG.BASE_STATS[ppoId] = baseStats;
    }
    
    console.log('✅ BASE_STATS синхронізовано з PPO_CONFIG');
}

// Викликаємо синхронізацію при завантаженні
if (typeof PPO_CONFIG !== 'undefined') {
    syncBaseStatsFromPPOConfig();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof PPO_CONFIG !== 'undefined') {
            syncBaseStatsFromPPOConfig();
        }
    });
}

// ========================================
// ФУНКЦІЇ РОЗРАХУНКУ
// ========================================

/**
 * Отримати рівень карточки (мінімум з damage та speed)
 */
function getCardLevel(damageLevel, speedLevel) {
    return Math.min(damageLevel, speedLevel);
}

/**
 * Перевірити чи можна покращити характеристику
 */
function canUpgrade(targetStat, currentLevels) {
    const targetLevel = currentLevels[targetStat];
    
    // Урон та швидкість - БЕЗЛІМІТНІ!
    if (targetStat === 'damage_level' || targetStat === 'speed_level') {
        const damageLevel = currentLevels.damage_level;
        const speedLevel = currentLevels.speed_level;
        
        // Можна покращити якщо різниця не більше 1
        if (targetStat === 'damage_level') {
            return damageLevel <= speedLevel;
        } else {
            return speedLevel <= damageLevel;
        }
    }
    
    // Перезарядка/Точність/Радіус - макс MAX_LEVEL
    if (targetLevel >= RANKED_CONFIG.MAX_LEVEL) return false;
    
    const otherStats = ['reload_level', 'radius_level', 'accuracy_level'];
    const relevantStats = otherStats.filter(s => s !== targetStat);
    
    for (const stat of relevantStats) {
        if (currentLevels[targetStat] >= currentLevels[stat] + 1) {
            return false;
        }
    }
    
    return true;
}

/**
 * Отримати ціну покращення
 * 
 * УРОН та ШВИДКІСТЬ: карти = рівень × CARD_MULTIPLIERS
 * ПЕРЕЗАРЯДКА/ТОЧНІСТЬ/РАДІУС: карти = рівень × SECONDARY_MULTIPLIERS
 * 
 * @param {string} stat - Назва характеристики
 * @param {number} currentLevel - Поточний рівень
 * @param {string} ppoId - ID ППО (для визначення редкості)
 */
function getUpgradeCost(stat, currentLevel, ppoId) {
    // Визначити редкість
    const rarity = RANKED_CONFIG.PPO_RARITIES[ppoId] || 'common';
    const cardPrice = RANKED_CONFIG.CARD_PRICES[rarity];
    
    let cards;
    
    if (stat === 'damage_level' || stat === 'speed_level') {
        // Урон та швидкість: карти = рівень × множник_редкості
        const cardMultiplier = RANKED_CONFIG.CARD_MULTIPLIERS[rarity];
        cards = currentLevel * cardMultiplier;
    } else {
        // Перезарядка/Точність/Радіус: карти = рівень × secondary_множник
        // legendary=5, epic=15, rare=45, common=135
        const secondaryMultiplier = RANKED_CONFIG.SECONDARY_MULTIPLIERS[rarity];
        cards = currentLevel * secondaryMultiplier;
    }
    
    // Гривні = карти × ціна_карти × 2
    const currency = cards * cardPrice * 2;
    
    return { cards, currency };
}

/**
 * Розрахувати фінальне значення характеристики
 */
function calculateStat(ppoId, stat, level) {
    const base = RANKED_CONFIG.BASE_STATS[ppoId];
    if (!base) return 0;
    
    const bonusLevels = level - 1;
    
    switch (stat) {
        case 'damage':
            return Math.floor(base.damage * (1 + RANKED_CONFIG.UPGRADE_BONUSES.damage.percentPerLevel / 100 * bonusLevels));
        case 'speed':
            return base.speed * (1 + RANKED_CONFIG.UPGRADE_BONUSES.speed.percentPerLevel / 100 * bonusLevels);
        case 'reload':
            return Math.floor(base.reload * (1 - RANKED_CONFIG.UPGRADE_BONUSES.reload.percentPerLevel / 100 * bonusLevels));
        case 'radius':
            return Math.floor(base.radius * (1 + RANKED_CONFIG.UPGRADE_BONUSES.radius.percentPerLevel / 100 * bonusLevels));
        case 'accuracy':
            return Math.min(99, base.accuracy + RANKED_CONFIG.UPGRADE_BONUSES.accuracy.absolutePerLevel * bonusLevels);
        case 'slow':
            return base.slowFactor + RANKED_CONFIG.REB_UPGRADES.slow.absolutePerLevel * bonusLevels;
        case 'knockdown':
            return base.knockdownChance + RANKED_CONFIG.REB_UPGRADES.knockdown.absolutePerLevel * bonusLevels;
        default:
            return 0;
    }
}

// Export для Node.js (якщо потрібно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RANKED_CONFIG, getCardLevel, canUpgrade, getUpgradeCost, calculateStat };
}

console.log('✅ ranked_config.js v3.1 - РІЗНІ ФОРМУЛИ: урон/швидкість vs перезарядка/точність/радіус!');