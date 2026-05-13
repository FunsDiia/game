// ========================================
// РАНКОВИЙ РЕЖИМ - ОКРЕМИЙ ФАЙЛ
// ========================================

// Глобальні змінні
let rankedPPOList = [];
let rankedUpgrades = {};
let rankedStats = {
    shahedKilled: 0,
    heavyDroneKilled: 0,
    rocketKilled: 0,
    kalibrKilled: 0,
    waveReached: 0
};

// ========================================
// RANKED MODE КОНФІГУРАЦІЯ ХВИЛЬ
// ========================================

const RANKED_WAVE_CONFIG = {
    // Хвилі на яких з'являються нові об'єкти (БЕЗ 0 - стартовий об'єкт вже є)
    objectSpawnWaves: [5, 10, 15, 20, 25, 30, 35],
    
    // Хвилі на яких показується попередження про наступний об'єкт
    warningWaves: [4, 9, 14, 19, 24, 29, 34],
    
    // Ліміт ППО = 3 × кількість об'єктів
    ppoPerObject: 3,
    
    // Коли з'являються типи ворогів
    heavyDronesStartWave: 5,
    rocketsStartWave: 10,
    kalibrsStartWave: 15,
    kalibrSalvoInterval: 2,  // Калібри кожну другу хвилю (15, 17, 19...)
    
    // Максимум ворогів за хвилю (без урахування ракет крейсера!)
    maxEnemiesPerWave: 151,
    
    // Крейсер завжди випускає 6 ракет (НЕ впливає на ліміт 151)
    cruiserRockets: 6
};

// ========================================
// ФОРМУЛИ ХВИЛЬ (замість таблиці)
// ========================================

// ========================================
// ІНІЦІАЛІЗАЦІЯ ПЕРШОГО ОБ'ЄКТА (ВОЛНА 0)
// ========================================

/**
 * Створює перший об'єкт при старті ranked mode
 * Викликається з game.js при initializeMapAndGame
 */
window.initRankedFirstObject = function() {
    if (!window.rankedMode) return;
    
    console.log('🏗️ Ranked: створюємо перший об\'єкт (старт гри)');
    
    // Вибираємо випадкову область для першого об'єкта
    if (typeof regionSpawnPoints !== 'undefined') {
        const regions = Object.keys(regionSpawnPoints);
        const firstRegion = regions[Math.floor(Math.random() * regions.length)];
        
        if (typeof getRandomSpawnPoint === 'function') {
            const firstPoint = getRandomSpawnPoint(firstRegion);
            if (firstPoint) {
                // Ініціалізуємо масиви
                if (typeof allDefensePoints !== 'undefined') {
                    allDefensePoints.length = 0;
                    allDefensePoints.push(firstPoint);
                }
                if (typeof usedSpawnPoints !== 'undefined') {
                    usedSpawnPoints.length = 0;
                    usedSpawnPoints.push(firstPoint);
                }
                
                // Активуємо об'єкт
                if (typeof activateDefensePoint === 'function') {
                    activateDefensePoint(0, firstPoint);
                }
                
                // Оновлюємо лічильник
                rankedObjectCount = 1;
                window.updateRankedPVOLimit();
                
                console.log('✅ Ranked: перший об\'єкт створено, ліміт ППО = 3');
            }
        }
    }
};

/**
 * Розрахунок кількості ворогів за формулами
 * Ліміт: 151 ворог за хвилю (без калібрів крейсера)
 * 
 * Шахеди:    1-3: 10 | 4-28: зростання +3 | 29-53: падіння -3 | 54+: 9
 * Тяж.дрони: 1-4: 0  | 5-53: зростання +2 | 54-97: падіння -2
 * Ракети:    1-9: 0  | 10-53: зростання +1 | 54-97: зростання +2
 */
function calculateWaveEnemies(wave) {
    // Обмежуємо хвилю 97 (далі значення заморожуються)
    const w = Math.min(wave, 97);
    
    let shaheds, heavyDrones, rockets;
    
    // === ШАХЕДИ ===
    if (w <= 3) {
        shaheds = 10;
    } else if (w <= 28) {
        // Зростання: 12 на 4 хвилі, +3 кожну хвилю
        shaheds = 12 + (w - 4) * 3;
    } else if (w <= 53) {
        // Падіння: 81 на 29 хвилі, -3 кожну хвилю
        shaheds = 84 - (w - 28) * 3;
    } else {
        // Константа з 54 хвилі
        shaheds = 9;
    }
    
    // === ТЯЖКІ ДРОНИ ===
    if (w <= 4) {
        heavyDrones = 0;
    } else if (w <= 53) {
        // Зростання: 2 на 5 хвилі, +2 кожну хвилю
        heavyDrones = (w - 4) * 2;
    } else {
        // Падіння: 96 на 54 хвилі, -2 кожну хвилю
        heavyDrones = 98 - (w - 53) * 2;
    }
    
    // === РАКЕТИ ===
    if (w <= 9) {
        rockets = 0;
    } else if (w <= 53) {
        // Зростання: 1 на 10 хвилі, +1 кожну хвилю
        rockets = w - 9;
    } else {
        // Зростання швидше: 46 на 54 хвилі, +2 кожну хвилю
        rockets = 44 + (w - 53) * 2;
    }
    
    return { shaheds, heavyDrones, rockets };
}

// Лічильник об'єктів на карті
let rankedObjectCount = 0;

// ========================================
// ІНІЦІАЛІЗАЦІЯ
// ========================================

async function initRankedMode() {
    try {
        console.log('Завантаження колоди з сервера...');
        
        // 1. Завантажити колоду
        const deckResponse = await fetch('get_ranked_deck.php', { credentials: 'include' });
        const deckData = await deckResponse.json();
        
        console.log('Колода:', deckData);
        
        if (!deckData.success || !deckData.deck || deckData.deck.length === 0) {
            console.error('Колода порожня!');
            return false;
        }
        
        // Фільтруємо аеродром - він НЕ ППО!
        rankedPPOList = deckData.deck.filter(id => id !== 'aerodrom');
        console.log('Колода завантажена (без аеродрому):', rankedPPOList);
        
        // 2. Завантажити покращення для кожного ППО в колоді
        const upgradesResponse = await fetch('get_ppo_upgrades.php', { credentials: 'include' });
        const upgradesData = await upgradesResponse.json();
        
        if (upgradesData.success) {
            rankedUpgrades = {};
            rankedPPOList.forEach(ppoId => {
                if (upgradesData.upgrades && upgradesData.upgrades[ppoId]) {
                    rankedUpgrades[ppoId] = upgradesData.upgrades[ppoId];
                } else {
                    rankedUpgrades[ppoId] = {
                        damage_level: 1,
                        speed_level: 1,
                        reload_level: 1,
                        radius_level: 1,
                        accuracy_level: 1
                    };
                }
            });
        }
        
        // Очистити статистику
        rankedStats = {
            shahedKilled: 0,
            heavyDroneKilled: 0,
            rocketKilled: 0,
            kalibrKilled: 0,
            waveReached: 0
        };
        
        // Скинути лічильник об'єктів (буде 1 після створення стартового)
        rankedObjectCount = 0;
        
        console.log('ППО з колоди:', rankedPPOList.length);
        console.log('Покращення:', Object.keys(rankedUpgrades).length);
        return true;
        
    } catch (error) {
        console.error('Помилка:', error);
        return false;
    }
}

// ========================================
// СТВОРЕННЯ ПОЧАТКОВОГО ОБ'ЄКТА (волна 0)
// ========================================

// ========================================
// КОНВЕРТЕР ID → НАЗВА КОНФІГУ
// ========================================

function getRankedConfigName(ppoId) {
    const mapping = {
        'kulemet': 'Кулемет',
        'madt': 'MADT',
        '2k12kub': '2K12 KUB',
        'crotale90m': 'Crotale 90M',
        'iristsml': 'IRIS-T SML',
        'kilchen': 'Кільчень',
        'patriot': 'Patriot',
        'f16': 'F-16',
        'mig29': 'МіГ-29',
        'su27': 'Су-27',
        'reb': 'РЕБ',
        'radar': 'Радар'
        // Аеродром видалено!
    };
    return mapping[ppoId] || ppoId;
}

// ========================================
// ЗАСТОСУВАННЯ ПОКРАЩЕНЬ
// ========================================

function applyRankedUpgrades(pvo, upgrades, baseConfig) {
    // Урон +10% за рівень
    const dmgBonus = (upgrades.damage_level - 1) * 0.1;
    pvo.damage = Math.floor(baseConfig.damage * (1 + dmgBonus));
    
    // Швидкість снаряда +8% за рівень
    if (baseConfig.projectile && baseConfig.projectile.speed) {
        const spdBonus = (upgrades.speed_level - 1) * 0.08;
        pvo.projectile.speed = baseConfig.projectile.speed * (1 + spdBonus);
    }
    
    // Перезарядка -2.5% за рівень
    const reloadBonus = (upgrades.reload_level - 1) * 0.025;
    pvo.cd = Math.floor(baseConfig.cd * (1 - reloadBonus));
    
    // Радіус +2.5% за рівень
    const radiusBonus = (upgrades.radius_level - 1) * 0.025;
    pvo.radius = Math.floor(baseConfig.radius * (1 + radiusBonus));
    
    // Точність +2.5% за рівень
    if (baseConfig.projectile && baseConfig.projectile.hitChance) {
        const accBonus = (upgrades.accuracy_level - 1) * 2.5;
        pvo.projectile.hitChance = Math.min(0.99, (baseConfig.projectile.hitChance * 100 + accBonus) / 100);
    }
    
    // РЕБ: замедління та шанс збиття
    if (pvo.reb) {
        const slowBonus = (upgrades.slow_level - 1) * 2.5;
        pvo.slowFactor = (baseConfig.slowFactor * 100 + slowBonus) / 100;
        pvo.rebKnockdownChance = 10 + (upgrades.knockdown_level - 1) * 2.5;
    }
}

// ========================================
// ГЕНЕРАЦІЯ СПИСКУ ППО
// ========================================

window.getRankedPPOList = function() {
    console.log('Генерація рангового списку ППО...');
    
    if (typeof PPO_CONFIG === 'undefined') {
        console.error('PPO_CONFIG не визначено!');
        return [];
    }
    
    const availablePPO = [];
    
    rankedPPOList.forEach(ppoId => {
        // Пропускаємо аеродром - він окрема будівля!
        if (ppoId === 'aerodrom') return;
        
        const configName = getRankedConfigName(ppoId);
        const config = PPO_CONFIG[configName];
        
        if (config) {
            const pvo = JSON.parse(JSON.stringify(config));
            
            const upgrades = rankedUpgrades[ppoId];
            if (upgrades) {
                applyRankedUpgrades(pvo, upgrades, config);
            }
            
            availablePPO.push(pvo);
        }
    });
    
    console.log(`Створено ${availablePPO.length} ППО (без аеродрому)`);
    return availablePPO;
};

// ========================================
// АЕРОДРОМ ТА АВАРІЙКА - БУДІВЛІ (ЗАВЖДИ ДОСТУПНІ)
// ========================================

/**
 * Аеродром та Аварійка - це будівлі, які:
 * - Завжди доступні для покупки
 * - МОЖУТЬ бути атаковані ворогами (це цілі!)
 * - Можуть бути знищені та побудовані знову
 * - НЕ є ППО (не впливають на ліміт ППО)
 * 
 * Логіка будівель знаходиться в buildings-config.js та game.js
 * Тут лише позначаємо що вони завжди доступні в ranked mode
 */
window.getRankedAvailableBuildings = function() {
    // Повертаємо список будівель які завжди доступні для покупки
    // (не ППО, не впливають на ліміт)
    return ['aerodrom', 'avariika'];
};

// ========================================
// ЛІМІТ ППО (ДИНАМІЧНИЙ)
// ========================================

window.getRankedMaxPVO = function() {
    // 3 ППО на кожен об'єкт на карті
    return Math.max(3, rankedObjectCount * RANKED_WAVE_CONFIG.ppoPerObject);
};

// Оновлення ліміту при зміні кількості об'єктів
window.updateRankedPVOLimit = function() {
    if (!window.rankedMode) return;
    
    const newLimit = window.getRankedMaxPVO();
    if (typeof MAX_PVO_COUNT !== 'undefined') {
        MAX_PVO_COUNT = newLimit;
    }
    
    console.log(`📊 Ліміт ППО оновлено: ${newLimit} (${rankedObjectCount} об'єктів × 3)`);
    
    // Оновити UI
    if (typeof updatePvoPurchaseAvailability === 'function') {
        updatePvoPurchaseAvailability();
    }
    if (typeof updateUI === 'function') {
        updateUI();
    }
};

// ========================================
// СПАВН ОБ'ЄКТІВ (ЯК У КРУГОВІЙ ОБОРОНІ)
// ========================================

window.rankedSpawnObject = function(wave) {
    if (!window.rankedMode) return;
    
    // Перевіряємо чи потрібно спавнити об'єкт на цій хвилі
    if (!RANKED_WAVE_CONFIG.objectSpawnWaves.includes(wave)) return;
    
    console.log(`🏗️ Спавн об'єкта на хвилі ${wave}`);
    
    // Використовуємо логіку з game.js для спавну об'єкта
    if (typeof nextTargetRegion !== 'undefined' && nextTargetRegion) {
        const newPoint = getRandomSpawnPoint(nextTargetRegion);
        if (newPoint) {
            if (typeof allDefensePoints !== 'undefined') {
                allDefensePoints.push(newPoint);
            }
            if (typeof usedSpawnPoints !== 'undefined') {
                usedSpawnPoints.push(newPoint);
            }
            if (typeof activateDefensePoint === 'function') {
                activateDefensePoint(rankedObjectCount, newPoint);
            }
            rankedObjectCount++;
            window.updateRankedPVOLimit();
        }
    } else {
        // Fallback - випадкова область
        if (typeof regionSpawnPoints !== 'undefined') {
            const regions = Object.keys(regionSpawnPoints);
            const randomRegion = regions[Math.floor(Math.random() * regions.length)];
            
            if (typeof getRandomSpawnPoint === 'function') {
                const newPoint = getRandomSpawnPoint(randomRegion);
                if (newPoint) {
                    if (typeof activateDefensePoint === 'function') {
                        activateDefensePoint(rankedObjectCount, newPoint);
                    }
                    rankedObjectCount++;
                    window.updateRankedPVOLimit();
                }
            }
        }
    }
};

// ========================================
// ПОПЕРЕДЖЕННЯ ПРО НАСТУПНИЙ ОБ'ЄКТ
// ========================================

window.rankedShowObjectWarning = function(wave) {
    if (!window.rankedMode) return;
    
    // Перевіряємо чи потрібно показати попередження
    if (!RANKED_WAVE_CONFIG.warningWaves.includes(wave)) return;
    
    console.log(`⚠️ Ranked: попередження про новий об'єкт (волна ${wave}, спавн на волні ${wave + 1})`);
    
    // Вибираємо область для наступного об'єкта
    if (typeof regionSpawnPoints !== 'undefined') {
        const availableRegions = Object.keys(regionSpawnPoints).filter(region => {
            if (typeof usedSpawnPoints === 'undefined') return true;
            return regionSpawnPoints[region].some(
                point => !usedSpawnPoints.some(used => used[0] === point[0] && used[1] === point[1])
            );
        });
        
        if (availableRegions.length > 0) {
            nextTargetRegion = availableRegions[Math.floor(Math.random() * availableRegions.length)];
            
            if (typeof showTargetNotification === 'function') {
                showTargetNotification(nextTargetRegion);
            }
        }
    }
};

// ========================================
// ТРЕКІНГ СТАТИСТИКИ
// ========================================

window.trackRankedKill = function(enemyType) {
    if (!window.rankedMode) return;
    
    switch(enemyType) {
        case 'shahed':
            rankedStats.shahedKilled++;
            break;
        case 'heavy':
            rankedStats.heavyDroneKilled++;
            break;
        case 'rocket':
            rankedStats.rocketKilled++;
            break;
        case 'kalibr':
            rankedStats.kalibrKilled++;
            break;
    }
    
    console.log('Статистика:', rankedStats);
};

window.updateRankedWave = function(wave) {
    if (!window.rankedMode) return;
    rankedStats.waveReached = Math.max(rankedStats.waveReached, wave);
    
    // Перевіряємо чи потрібно спавнити об'єкт або показати попередження
    window.rankedShowObjectWarning(wave);
    window.rankedSpawnObject(wave);
};

// ========================================
// КОНФІГУРАЦІЯ ХВИЛІ (НОВА ЛОГІКА З ФОРМУЛАМИ)
// ========================================

window.getRankedWaveConfig = function(wave) {
    // Отримуємо кількість ворогів з формул
    const config = calculateWaveEnemies(wave);
    
    // Калібри з 15 хвилі, кожну другу хвилю
    // Крейсер випускає 6 ракет (НЕ впливає на ліміт 151!)
    let kalibrs = 0;
    if (wave >= RANKED_WAVE_CONFIG.kalibrsStartWave) {
        const wavesSinceStart = wave - RANKED_WAVE_CONFIG.kalibrsStartWave;
        if (wavesSinceStart % RANKED_WAVE_CONFIG.kalibrSalvoInterval === 0) {
            kalibrs = RANKED_WAVE_CONFIG.cruiserRockets;  // Завжди 6 ракет
        }
    }
    
    const total = config.shaheds + config.heavyDrones + config.rockets;
    console.log(`📊 Хвиля ${wave}: ${config.shaheds} шахедів, ${config.heavyDrones} тяж.дронів, ${config.rockets} ракет = ${total} ворогів` + 
                (kalibrs > 0 ? ` + ${kalibrs} калібрів (крейсер)` : ''));
    
    return { 
        shaheds: config.shaheds, 
        heavyDrones: config.heavyDrones, 
        rockets: config.rockets, 
        kalibrs: kalibrs 
    };
};

// ========================================
// ЗБЕРЕЖЕННЯ СТАТИСТИКИ
// ========================================

async function saveRankedStats() {
    try {
        const response = await fetch('save_ranked_stats.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(rankedStats)
        });
        const data = await response.json();
        
        if (data.success) {
            console.log('Статистика збережена');
            return true;
        } else {
            console.error('Помилка збереження:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Помилка:', error);
        return false;
    }
}

// ========================================
// РОЗРАХУНОК НАГОРОД
// ========================================

function calculateRankedRewards() {
    const hryvnias = rankedStats.shahedKilled * 2 + 
                     rankedStats.heavyDroneKilled * 4 + 
                     rankedStats.rocketKilled * 6 + 
                     rankedStats.kalibrKilled * 6;
    
    const points = Math.floor(rankedStats.waveReached / 5);
    const premiumChests = Math.floor(points / 3);
    const normalChests = points % 3;
    
    return { hryvnias, premiumChests, normalChests };
}

// ========================================
// ЗБЕРЕЖЕННЯ НАГОРОД В ІНВЕНТАР
// ========================================

async function saveRankedRewards(rewards) {
    try {
        const response = await fetch('save_ranked_rewards.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                hryvnias: rewards.hryvnias,
                normal_chests: rewards.normalChests,
                premium_chests: rewards.premiumChests
            })
        });
        const data = await response.json();
        
        if (data.success) {
            console.log('Нагороди збережено');
            return true;
        } else {
            console.error('Помилка збереження нагород:', data.error);
            return false;
        }
    } catch (error) {
        console.error('Помилка:', error);
        return false;
    }
}

// ========================================
// GAME OVER ЕКРАН
// ========================================

window.showRankedGameOver = async function() {
    console.log('Показуємо ранковий game over...');
    
    const rewards = calculateRankedRewards();
    
    // Зберігаємо статистику та нагороди
    const statsOk = await saveRankedStats();
    const rewardsOk = await saveRankedRewards(rewards);
    
    if (!statsOk) {
        console.error('❌ Не вдалося зберегти статистику!');
    }
    if (!rewardsOk) {
        console.error('❌ Не вдалося зберегти нагороди!');
    }
    
    const lang = localStorage.getItem('selectedLanguage') || 'ua';
    const t = (key, section = 'ranked') => {
        if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[section] && TRANSLATIONS[section][key]) {
            return TRANSLATIONS[section][key][lang] || TRANSLATIONS[section][key]['ua'];
        }
        return key;
    };
    
    const overlay = document.createElement('div');
    overlay.id = 'rankedGameOverOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        color: #fff;
        padding: 24px 20px;
        border-radius: 16px;
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
        border: 2px solid #FFD700;
        width: 100%;
        max-width: 380px;
        max-height: 90vh;
        overflow-y: auto;
        text-align: center;
        box-sizing: border-box;
    `;
    
    let rewardsHTML = '';
    if (rewards.hryvnias > 0) {
        rewardsHTML += `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
                <img src="assets/hryvnya.png" style="height: 25px; width: auto;">
                <span style="font-size: 18px; font-weight: bold; color: #4CAF50;">+${rewards.hryvnias}</span>
                <span style="color: #ccc;">${t('hryvnias')}</span>
            </div>
        `;
    }
    if (rewards.normalChests > 0) {
        rewardsHTML += `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
                <img src="assets/chest_closed.png" style="height: 25px; width: auto;">
                <span style="font-size: 18px; font-weight: bold; color: #4CAF50;">+${rewards.normalChests}</span>
                <span style="color: #ccc;">${t('normalChest')}</span>
            </div>
        `;
    }
    if (rewards.premiumChests > 0) {
        rewardsHTML += `
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
                <img src="assets/chest_closed2.png" style="height: 25px; width: auto;">
                <span style="font-size: 18px; font-weight: bold; color: #9C27B0;">+${rewards.premiumChests}</span>
                <span style="color: #ccc;">${t('premiumChest')}</span>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #FFD700; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <i class="fas fa-trophy" style="font-size: 24px;"></i>
            <span>${t('battleComplete')}</span>
        </div>
        
        <div style="background: rgba(255,255,255,0.08); padding: 16px; border-radius: 12px; margin-bottom: 16px;">
            <div style="font-size: 16px; margin-bottom: 12px; color: #FFD700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-chart-bar"></i>
                <span>${t('statistics')}</span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 10px 15px; text-align: left; font-size: 14px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="assets/drone.png" style="width: 24px; height: 24px;">
                    <span>${t('shaheds')}:</span>
                </div>
                <div style="font-weight: bold; color: #4CAF50; text-align: right;">${rankedStats.shahedKilled}</div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="assets/heavy-drone.png" style="width: 24px; height: 24px;">
                    <span>${t('heavyDrones')}:</span>
                </div>
                <div style="font-weight: bold; color: #4CAF50; text-align: right;">${rankedStats.heavyDroneKilled}</div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="assets/rocket1.png" style="width: 24px; height: 24px;">
                    <span>${t('rockets')}:</span>
                </div>
                <div style="font-weight: bold; color: #4CAF50; text-align: right;">${rankedStats.rocketKilled}</div>
                
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="assets/kalibr.png" style="width: 24px; height: 24px;">
                    <span>${t('kalibrs')}:</span>
                </div>
                <div style="font-weight: bold; color: #4CAF50; text-align: right;">${rankedStats.kalibrKilled}</div>
            </div>
            
            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.15);">
                <div style="font-size: 16px; color: #FFD700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-flag"></i>
                    <span>${t('phaseReached')}:</span>
                    <span style="font-weight: bold; font-size: 22px;">${rankedStats.waveReached}</span>
                </div>
            </div>
        </div>
        
        ${rewardsHTML ? `
        <div style="background: rgba(76, 175, 80, 0.15); padding: 14px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(76, 175, 80, 0.3);">
            <div style="font-size: 15px; margin-bottom: 10px; color: #4CAF50; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-gift"></i>
                <span>${t('rewards')}</span>
            </div>
            ${rewardsHTML}
        </div>
        ` : ''}
        
        <button id="rankedHomeBtn" style="
            width: 100%;
            padding: 14px 24px;
            font-size: 16px;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #1a1a2e;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
            <i class="fas fa-home"></i>
            <span>${t('mainMenu', 'common')}</span>
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    const homeBtn = document.getElementById('rankedHomeBtn');
    homeBtn.onmouseenter = () => {
        homeBtn.style.transform = 'scale(1.03)';
        homeBtn.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.6)';
    };
    homeBtn.onmouseleave = () => {
        homeBtn.style.transform = 'scale(1)';
        homeBtn.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
    };
    homeBtn.onclick = () => {
        window.location.href = 'index.html';
    };
};

// ========================================
// ПРИКРІПЛЕННЯ КНОПКИ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('startRankedBtn');
    if (btn) {
        btn.onclick = async (e) => {
            e.preventDefault();
            
            // Скинути всі режими
            if (typeof window.tutorialMode !== 'undefined') window.tutorialMode = false;
            if (typeof window.rightOnlyMode !== 'undefined') window.rightOnlyMode = false;
            if (typeof window.hardcoreMode !== 'undefined') window.hardcoreMode = true;
            if (typeof window.radarMode !== 'undefined') window.radarMode = false;
            if (typeof window.sandboxMode !== 'undefined') window.sandboxMode = false;
            if (typeof window.rankedMode !== 'undefined') window.rankedMode = true;
            
            const success = await initRankedMode();
            if (success && typeof window.launchGame === 'function') {
                window.launchGame(btn);
            }
        };
        console.log('Кнопка рангового режиму прикріплена');
    }
});

console.log('ranked-mode.js завантажено (v4 - власна логіка спавну об\'єктів, ліміт ППО)');