//2025 DroneFall v.1.12.10// ========================================
// 🌍 УНІВЕРСАЛЬНИЙ ОНОВЛЮВАЧ МОВИ v3
// ========================================

console.log('🌍 language-updater.js v3 завантажується...');

// ========================================
// МАПА РЕЖИМІВ
// ========================================
var MODE_ICONS = {
  'tutorial': 'fas fa-graduation-cap mode-icon-grad',
  'circular': 'fas fa-sync mode-icon-sync',
  'against-russia': 'fas fa-arrow-right mode-icon-arrow',
  'hardcore': 'fas fa-fire mode-icon-fire',
  'radar': 'fas fa-satellite-dish mode-icon-radar',
  'sandbox': 'fas fa-palette mode-icon-palette',
  'ranked': 'fas fa-trophy mode-icon-trophy'
};

var MODE_TRANSLATION_KEYS = {
  'tutorial': 'tutorial',
  'circular': 'circular',
  'against-russia': 'againstRussia',
  'hardcore': 'hardcore',
  'radar': 'radar',
  'sandbox': 'sandbox',
  'ranked': 'ranked'
};

// ========================================
// ВИЗНАЧЕННЯ СТОРІНКИ
// ========================================
function getCurrentPage() {
  var path = window.location.pathname.toLowerCase();
  if (path.includes('inventory_chest') || path.includes('chest.html')) return 'chest';
  if (path.includes('inventory')) return 'inventory';
  if (path.includes('shop')) return 'shop';
  if (path.includes('leaderboard')) return 'leaderboard';
  if (path.includes('profile')) return 'profile';
  if (path.includes('login')) return 'login';
  if (path.includes('register_step1')) return 'register1';
  if (path.includes('register_step2')) return 'register2';
  if (path.includes('register_success')) return 'register3';
  if (path.includes('game')) return 'game';
  if (path.includes('index') || path === '/' || path.endsWith('/')) return 'index';
  return 'unknown';
}

// ========================================
// ФУНКЦІЯ ВИБОРУ РЕЖИМУ (ГЛОБАЛЬНА)
// ========================================
window.selectModeTranslated = function(mode) {
  console.log('🎮 selectModeTranslated:', mode);
  
  window.selectedMode = mode;
  
  // Оновлюємо currentMode
  var currentModeEl = document.getElementById('currentMode');
  if (currentModeEl) {
    var translatedName = translate(MODE_TRANSLATION_KEYS[mode] || mode, 'modes');
    var iconClass = MODE_ICONS[mode] || 'fas fa-arrow-right mode-icon-arrow';
    currentModeEl.innerHTML = '<i class="' + iconClass + '"></i> ' + translatedName;
    console.log('🎮 currentMode оновлено:', translatedName);
  }
  
  // Оновлюємо selected клас
  document.querySelectorAll('.mode-option').forEach(function(opt) {
    if (opt.dataset.mode === mode) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });
  
  // Закриваємо меню
  var modeMenu = document.getElementById('modeMenu');
  if (modeMenu) {
    modeMenu.style.display = 'none';
  }
  
  // Оновлюємо кнопку "До бою"
  window.updateLaunchButtonTranslated();
};

// ========================================
// ФУНКЦІЯ ОНОВЛЕННЯ КНОПКИ "ДО БОЮ" (ГЛОБАЛЬНА)
// ========================================
window.updateLaunchButtonTranslated = function() {
  var launchBtn = document.getElementById('launchBtn');
  var launchText = document.getElementById('launchText');
  
  if (!launchBtn || !launchText) return;
  
  var isLoggedIn = window.isLoggedIn || false;
  var selectedMode = window.selectedMode || 'against-russia';
  var lang = typeof currentLanguage !== 'undefined' ? currentLanguage : 'ua';
  
  if (selectedMode === 'ranked' && !isLoggedIn) {
    launchBtn.disabled = true;
    launchBtn.style.opacity = '0.5';
    launchBtn.style.cursor = 'not-allowed';
    var lockedTexts = {
      ua: 'Недоступно без реєстрації',
      en: 'Unavailable without registration',
      kz: 'Тіркелусіз қолжетімсіз',
      pl: 'Niedostępne bez rejestracji',
      cs: 'Nedostupné bez registrace'
    };
    launchText.innerHTML = '<i class="fas fa-lock"></i> ' + (lockedTexts[lang] || lockedTexts['ua']);
  } else {
    launchBtn.disabled = false;
    launchBtn.style.opacity = '1';
    launchBtn.style.cursor = 'pointer';
    launchText.innerHTML = '<i class="fas fa-play"></i> ' + translate('toBattle', 'menu');
  }
};

// ========================================
// ГОЛОВНА ФУНКЦІЯ ОНОВЛЕННЯ (ГЛОБАЛЬНА)
// ========================================
window.updateAllTranslations = function() {
  var page = getCurrentPage();
  console.log('🌍 updateAllTranslations для:', page, 'мова:', typeof currentLanguage !== 'undefined' ? currentLanguage : 'ua');

  // Оновлюємо data-translate елементи
  if (typeof updatePageLanguage === 'function') {
    updatePageLanguage();
  }

  // Специфічні оновлення
  switch (page) {
    case 'index':
      updateIndexPage();
      break;
    case 'inventory':
      updateInventoryPage();
      break;
    case 'shop':
      updateShopPage();
      break;
    case 'leaderboard':
      updateLeaderboardPage();
      break;
    case 'profile':
      updateProfilePage();
      break;
    case 'chest':
      updateChestPage();
      break;
    case 'login':
      updateLoginPage();
      break;
    case 'register1':
    case 'register2':
    case 'register3':
      updateRegisterPage(page);
      break;
    case 'game':
      updateGamePage();
      break;
  }
};

// ========================================
// GAME.HTML (ТУТОРІАЛ)
// ========================================
function updateGamePage() {
  console.log('🎮 updateGamePage...');
  
  // Оновлюємо туторіал, якщо він активний
  if (window.tutorialModeActive) {
    updateTutorialUI();
  }
}

// ========================================
// ОНОВЛЕННЯ UI ТУТОРІАЛУ
// ========================================
function updateTutorialUI() {
  console.log('📚 updateTutorialUI...');
  
  // Оновлюємо кнопку туторіалу
  var tutorialButton = document.querySelector('.tutorial-button');
  if (tutorialButton) {
    var currentText = tutorialButton.textContent;
    
    // Визначаємо який переклад потрібен за поточним текстом
    var buttonKeys = {
      'Далі': 'btnNext',
      'Next': 'btnNext',
      'Kelesi': 'btnNext',
      'Dalej': 'btnNext',
      'Další': 'btnNext',
      'Починаємо!': 'btnStart',
      "Let's start!": 'btnStart',
      'До оборони!': 'btnToDefense',
      'To defense!': 'btnToDefense',
      'Наступний етап': 'btnNextStage',
      'Next stage': 'btnNextStage',
      'Героям Слава!': 'btnGloryToHeroes',
      'Glory to Heroes!': 'btnGloryToHeroes'
    };
    
    // Шукаємо відповідний ключ
    for (var text in buttonKeys) {
      if (currentText.includes(text) || currentText === text) {
        var newText = translate(buttonKeys[text], 'tutorial');
        if (newText && newText !== buttonKeys[text]) {
          tutorialButton.textContent = newText;
        }
        break;
      }
    }
  }
  
  // Примітка: контент панелі туторіалу динамічно генерується в tutorial.js
  // і вже використовує translate(), тому при зміні мови потрібен перезапуск туторіалу
}

// ========================================
// INDEX.HTML
// ========================================
function updateIndexPage() {
  console.log('🏠 updateIndexPage...');

  // AI Note
  var aiNote = document.querySelector('.ai-note');
  if (aiNote) {
    aiNote.innerHTML = translate('aiNote', 'menu') + '<br>© 2025 DroneFall v.1.12.10';
  }

  // Опис гри
  var preview = document.getElementById('descriptionPreview');
  if (preview) {
    var fullText = translate('preview', 'description');
    var isMobile = window.innerWidth <= 768;
    preview.textContent = isMobile ? fullText.substring(0, 190) + "..." : fullText + "...";
  }

  var fullDesc = document.getElementById('descriptionFull');
  if (fullDesc) {
    fullDesc.innerHTML = 
      '<p><strong>DroneFall</strong> ' + translate('paragraph1', 'description') + '</p>' +
      '<p>' + translate('paragraph2', 'description') + '</p>' +
      '<p>' + translate('paragraph3', 'description') + '</p>' +
      '<p>' + translate('paragraph4', 'description') + '</p>' +
      '<p><strong>DroneFall</strong> ' + translate('paragraph5', 'description') + '</p>' +
      '<p><strong>DroneFall</strong> ' + translate('paragraph6', 'description') + '</p>';
  }

  // Кнопка "Читати далі"
  var readMoreText = document.getElementById('readMoreText');
  if (readMoreText) {
    var icon = document.getElementById('readMoreIcon');
    if (icon && icon.classList.contains('fa-chevron-up')) {
      readMoreText.textContent = translate('collapse', 'menu');
    } else {
      readMoreText.textContent = translate('readMore', 'menu');
    }
  }

  // *** РЕЖИМ: - шукаємо div з текстом ***
  var modeDropdown = document.getElementById('modeDropdown');
  if (modeDropdown && modeDropdown.previousElementSibling) {
    var modeLabel = modeDropdown.previousElementSibling;
    if (modeLabel.textContent.includes('РЕЖИМ') || modeLabel.textContent.includes('MODE')) {
      modeLabel.innerHTML = '<i class="fas fa-gamepad"></i> ' + translate('mode', 'menu');
      console.log('🎮 РЕЖИМ: перекладено');
    }
  }

  // *** ОБЕРІТЬ РЕЖИМ - заголовок меню ***
  var modeMenuTitle = document.querySelector('#modeMenu > div:first-child');
  if (modeMenuTitle) {
    modeMenuTitle.innerHTML = '<i class="fas fa-gamepad"></i> ' + translate('selectMode', 'menu');
    console.log('🎮 ОБЕРІТЬ РЕЖИМ перекладено');
  }

  // *** Режими в меню ***
  document.querySelectorAll('.mode-option').forEach(function(opt) {
    var mode = opt.dataset.mode;
    if (mode && MODE_TRANSLATION_KEYS[mode]) {
      var nameEl = opt.querySelector('.mode-name');
      var descEl = opt.querySelector('.mode-desc');
      if (nameEl) {
        nameEl.textContent = translate(MODE_TRANSLATION_KEYS[mode], 'modes');
      }
      if (descEl) {
        descEl.textContent = translate(MODE_TRANSLATION_KEYS[mode] + 'Desc', 'modes');
      }
    }
  });

  // *** currentMode (обраний режим) ***
  var currentModeEl = document.getElementById('currentMode');
  if (currentModeEl && window.selectedMode) {
    var translatedName = translate(MODE_TRANSLATION_KEYS[window.selectedMode] || window.selectedMode, 'modes');
    var iconClass = MODE_ICONS[window.selectedMode] || 'fas fa-arrow-right mode-icon-arrow';
    currentModeEl.innerHTML = '<i class="' + iconClass + '"></i> ' + translatedName;
  }

  // Кнопка До бою
  window.updateLaunchButtonTranslated();

  // Меню (Акаунт, Інвентар, Ліга, Магазин)
  var menuLinks = document.querySelectorAll('.menu-links a');
  menuLinks.forEach(function(link) {
    var href = link.getAttribute('href') || '';
    if (href.includes('profile')) {
      link.innerHTML = '<i class="fas fa-user"></i> ' + translate('account', 'menu');
    } else if (href.includes('inventory')) {
      link.innerHTML = '<i class="fas fa-box"></i> ' + translate('inventory', 'menu');
    } else if (href.includes('leaderboard')) {
      link.innerHTML = '<i class="fas fa-trophy"></i> ' + translate('league', 'menu');
    } else if (href.includes('shop')) {
      link.innerHTML = '<i class="fas fa-store"></i> ' + translate('shop', 'menu');
    }
  });

  // Нижнє меню
  var helpLink = document.querySelector('.help-link');
  if (helpLink) {
    helpLink.innerHTML = '<i class="fas fa-book"></i> ' + translate('help', 'menu');
  }

  var dailyLink = document.querySelector('.daily-link');
  if (dailyLink) {
    dailyLink.innerHTML = '<i class="fas fa-calendar-day"></i> ' + translate('daily', 'menu');
  }
}

// ========================================
// INVENTORY.HTML
// ========================================
function updateInventoryPage() {
  console.log('📦 updateInventoryPage...');
  
  // Заголовок
  var title = document.querySelector('.header h1');
  if (title) {
    title.innerHTML = '📦 ' + translate('title', 'inventory').toUpperCase();
  }
  
  // Кнопка Назад
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ';
  }
  
  // Таби
  var tabCards = document.querySelector('[data-tab="cards"]');
  var tabChests = document.querySelector('[data-tab="chests"]');
  if (tabCards) tabCards.textContent = translate('cardsTab', 'inventory');
  if (tabChests) tabChests.textContent = translate('chestsTab', 'inventory');
  
  // Селектор рарності
  var raritySelect = document.getElementById('rarityFilter');
  if (raritySelect) {
    var options = raritySelect.querySelectorAll('option');
    options.forEach(function(opt) {
      var val = opt.value;
      if (val === 'all') opt.textContent = translate('allRarities', 'inventory');
      else if (val === 'common') opt.textContent = translate('common', 'rarity');
      else if (val === 'rare') opt.textContent = translate('rare', 'rarity');
      else if (val === 'epic') opt.textContent = translate('epic', 'rarity');
      else if (val === 'legendary') opt.textContent = translate('legendary', 'rarity');
    });
  }
  
  // Порожній стан
  var emptyState = document.querySelector('.empty-state');
  if (emptyState) {
    var emptyTitle = emptyState.querySelector('h3');
    var emptyText = emptyState.querySelector('p');
    if (emptyTitle) emptyTitle.textContent = translate('emptyTitle', 'inventory');
    if (emptyText) emptyText.textContent = translate('emptyText', 'inventory');
  }
  
  // Картки (рарність)
  document.querySelectorAll('.card').forEach(function(card) {
    var rarityLabel = card.querySelector('.card-rarity');
    if (rarityLabel) {
      if (card.classList.contains('common')) {
        rarityLabel.textContent = translate('common', 'rarity');
      } else if (card.classList.contains('rare')) {
        rarityLabel.textContent = translate('rare', 'rarity');
      } else if (card.classList.contains('epic')) {
        rarityLabel.textContent = translate('epic', 'rarity');
      } else if (card.classList.contains('legendary')) {
        rarityLabel.textContent = translate('legendary', 'rarity');
      }
    }
  });
  
  // Сундуки
  document.querySelectorAll('.chest-card').forEach(function(chest) {
    var nameEl = chest.querySelector('.chest-name');
    var countEl = chest.querySelector('.chest-count');
    if (nameEl) {
      var isPremium = chest.classList.contains('premium');
      var chestType = isPremium ? 'premium' : 'normal';
      nameEl.textContent = translate(chestType, 'chest') + ' ' + translate('title', 'chest');
    }
    if (countEl) {
      var count = countEl.textContent.match(/\d+/);
      if (count) {
        countEl.textContent = translate('available', 'inventory') + ': ' + count[0];
      }
    }
  });
}

// ========================================
// SHOP.HTML
// ========================================
function updateShopPage() {
  console.log('🛒 updateShopPage...');
  
  // Заголовок
  var title = document.querySelector('.header h1');
  if (title) {
    title.innerHTML = '🛒 ' + translate('title', 'shop').toUpperCase();
  }
  
  // Кнопка Назад
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ';
  }
  
  // Баланс
  var balanceLabel = document.querySelector('.balance-label');
  if (balanceLabel) {
    balanceLabel.textContent = translate('balance', 'shop') + ':';
  }
  
  // Картки товарів
  document.querySelectorAll('.shop-item').forEach(function(item) {
    var nameEl = item.querySelector('.item-name');
    var descEl = item.querySelector('.item-desc');
    var buyBtn = item.querySelector('.buy-btn');
    
    if (nameEl) {
      var itemType = item.dataset.type;
      if (itemType === 'normal_chest') {
        nameEl.textContent = translate('normalChest', 'shop');
      } else if (itemType === 'premium_chest') {
        nameEl.textContent = translate('premiumChest', 'shop');
      }
    }
    
    if (descEl) {
      var itemType = item.dataset.type;
      if (itemType === 'normal_chest') {
        descEl.textContent = translate('normalChestDesc', 'shop');
      } else if (itemType === 'premium_chest') {
        descEl.textContent = translate('premiumChestDesc', 'shop');
      }
    }
    
    if (buyBtn && !buyBtn.disabled) {
      var price = buyBtn.dataset.price || buyBtn.textContent.match(/\d+/);
      buyBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> ' + translate('buy', 'shop') + ' (' + price + ' ₴)';
    }
  });
}

// ========================================
// LEADERBOARD.HTML
// ========================================
function updateLeaderboardPage() {
  console.log('🏆 updateLeaderboardPage...');
  
  // Заголовок
  var title = document.querySelector('.header h1');
  if (title) {
    title.innerHTML = '🏆 ' + translate('title', 'leaderboard').toUpperCase();
  }
  
  // Кнопка Назад
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ';
  }
  
  // Таби періодів
  var tabDaily = document.querySelector('[data-period="daily"]');
  var tabWeekly = document.querySelector('[data-period="weekly"]');
  var tabAllTime = document.querySelector('[data-period="all_time"]');
  if (tabDaily) tabDaily.textContent = translate('daily', 'leaderboard');
  if (tabWeekly) tabWeekly.textContent = translate('weekly', 'leaderboard');
  if (tabAllTime) tabAllTime.textContent = translate('allTime', 'leaderboard');
  
  // Заголовки таблиці
  var headers = document.querySelectorAll('.leaderboard-header span');
  if (headers.length >= 3) {
    headers[0].textContent = translate('rank', 'leaderboard');
    headers[1].textContent = translate('player', 'leaderboard');
    headers[2].textContent = translate('score', 'leaderboard');
  }
  
  // Порожній стан
  var emptyState = document.querySelector('.empty-state');
  if (emptyState) {
    var emptyText = emptyState.querySelector('p');
    if (emptyText) emptyText.textContent = translate('noData', 'leaderboard');
  }
}

// ========================================
// PROFILE.HTML
// ========================================
function updateProfilePage() {
  console.log('👤 updateProfilePage...');
  
  // Заголовок
  var title = document.querySelector('.header h1');
  if (title) {
    title.innerHTML = '👤 ' + translate('title', 'profile').toUpperCase();
  }
  
  // Кнопка Назад
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ';
  }
  
  // Кнопка Інвентар
  var inventoryBtn = document.querySelector('.btn[onclick*="inventory"]');
  if (inventoryBtn) {
    inventoryBtn.innerHTML = '<i class="fas fa-box"></i> ' + translate('inventory', 'profile');
  }
  
  // Лейбли форми
  var labels = document.querySelectorAll('.label');
  labels.forEach(function(label) {
    var text = label.textContent.trim();
    if (text.includes("Ім'я") || text.includes('First Name') || text.includes('Аты')) {
      label.innerHTML = '<i class="fas fa-signature"></i> ' + translate('firstName', 'profile');
    } else if (text.includes('Дата') || text.includes('Birth') || text.includes('Туған')) {
      label.innerHTML = '<i class="fas fa-birthday-cake"></i> ' + translate('birthdate', 'profile');
    } else if (text.includes('Email')) {
      label.innerHTML = '<i class="fas fa-envelope"></i> ' + translate('email', 'profile');
    } else if (text.includes('Промокод') || text.includes('Promo')) {
      label.innerHTML = '<i class="fas fa-ticket-alt"></i> ' + translate('promoCode', 'profile');
    }
  });
  
  // Placeholder для імені
  var firstNameInput = document.getElementById('firstName');
  if (firstNameInput) {
    firstNameInput.placeholder = translate('firstNamePlaceholder', 'profile');
  }
  
  // Placeholder для промокоду
  var promoInput = document.getElementById('promoCode');
  if (promoInput) {
    promoInput.placeholder = translate('promoPlaceholder', 'profile');
  }
  
  // Кнопка Зберегти
  var saveBtn = document.querySelector('.save-btn');
  if (saveBtn) {
    saveBtn.innerHTML = '<i class="fas fa-save"></i> ' + translate('saveChanges', 'profile');
  }
  
  // Кнопка Активувати
  var activateBtn = document.querySelector('.promo-group button');
  if (activateBtn) {
    activateBtn.textContent = translate('activate', 'profile');
  }
  
  // Кнопка Вийти
  var logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> ' + translate('logout', 'profile');
  }
  
  // Модальні вікна
  var successTitle = document.querySelector('#successModal h3');
  if (successTitle) {
    successTitle.textContent = translate('success', 'common');
  }
  
  var errorTitle = document.querySelector('#errorModal h3');
  if (errorTitle) {
    errorTitle.textContent = translate('error', 'common');
  }
}

function updateChestPage() {
  console.log('🎁 updateChestPage...');
  
  // Визначити тип сундука з URL
  var params = new URLSearchParams(window.location.search);
  var chestType = params.get('type') || 'normal';
  
  // Заголовок
  var title = document.getElementById('chestTitle') || document.querySelector('.header h1');
  if (title) {
    var chestName = translate(chestType === 'premium' ? 'premium' : 'normal', 'chest');
    var chestWord = translate('title', 'chest');
    title.innerHTML = '🎁 ' + chestName.toUpperCase() + ' ' + chestWord.toUpperCase();
  }
  
  // Кнопка Назад
  var backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ';
  }
  
  // Лейбл сундука
  var chestLabel = document.getElementById('chestLabel');
  if (chestLabel && chestLabel.textContent.trim()) {
    var text = chestLabel.textContent.toLowerCase();
    // Якщо сундук ще не відкритий (будь-яка мова)
    if (text.includes('натисни') || text.includes('click') || text.includes('ашу') || text.includes('басы') || text.includes('відкрити') || text.includes('open')) {
      chestLabel.textContent = translate('clickToOpen', 'chest');
    }
    // Якщо сундук відкритий (будь-яка мова)
    else if (text.includes('клікни') || text.includes('receive') || text.includes('алу') || text.includes('отримати')) {
      chestLabel.textContent = translate('clickToReceive', 'chest');
    }
  }
  
  // Кнопка "Назад до інвентаря"
  var backToInvBtn = document.getElementById('backBtn');
  if (backToInvBtn) {
    backToInvBtn.innerHTML = '<i class="fas fa-arrow-left"></i> ' + translate('backToInventory', 'chest');
  }
  
  // Оновити рарність на картках
  var rarityLabels = document.querySelectorAll('.card-rarity');
  rarityLabels.forEach(function(label) {
    var card = label.closest('.card');
    if (card) {
      if (card.classList.contains('common')) {
        label.textContent = translate('common', 'rarity');
      } else if (card.classList.contains('rare')) {
        label.textContent = translate('rare', 'rarity');
      } else if (card.classList.contains('epic')) {
        label.textContent = translate('epic', 'rarity');
      } else if (card.classList.contains('legendary')) {
        label.textContent = translate('legendary', 'rarity');
      }
    }
  });
}

function updateLoginPage() {
  // Handled by data-translate
}

function updateRegisterPage(step) {
  console.log('📝 updateRegisterPage:', step);
  
  // Step 2 - обработка чекбоксов
  if (step === 'register2') {
    // Чекбокс условий использования
    var termsLabel = document.getElementById('termsLabel');
    if (termsLabel) {
      var iAccept = translate('iAccept', 'register');
      var termsText = translate('acceptTermsText', 'register');
      termsLabel.innerHTML = iAccept + ' <a href="#" onclick="openLocalizedPage(\'terms\'); return false;">' + termsText + '</a>';
    }
    
    // Чекбокс политики конфиденциальности
    var privacyLabel = document.getElementById('privacyLabel');
    if (privacyLabel) {
      var iAccept = translate('iAccept', 'register');
      var privacyText = translate('acceptPrivacyText', 'register');
      privacyLabel.innerHTML = iAccept + ' <a href="#" onclick="openLocalizedPage(\'privacy\'); return false;">' + privacyText + '</a>';
    }
    
    // Сообщение об ошибке чекбоксов
    var checkboxError = document.getElementById('checkboxError');
    if (checkboxError) {
      var errorText = translate('checkboxRequired', 'register');
      checkboxError.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + errorText;
    }
    
    // Текст под кнопкой подтверждения
    var termsNotice = document.getElementById('termsNotice');
    if (termsNotice) {
      var noticeText = translate('termsNoticeText', 'register');
      var termsLink = translate('termsLink', 'register');
      var andWord = translate('andWord', 'register');
      var privacyLink = translate('privacyLink', 'register');
      termsNotice.innerHTML = '<i class="fas fa-info-circle"></i> ' + noticeText + ' <a href="#" onclick="openLocalizedPage(\'terms\'); return false;">' + termsLink + '</a> ' + andWord + ' <a href="#" onclick="openLocalizedPage(\'privacy\'); return false;">' + privacyLink + '</a> DroneFall';
    }
  }
}

// ========================================
// ІНІЦІАЛІЗАЦІЯ
// ========================================

// При завантаженні DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 DOMContentLoaded');
    window.updateAllTranslations();
  });
} else {
  console.log('🌍 DOM вже готовий');
  window.updateAllTranslations();
}

// При зміні мови (backup)
window.addEventListener('languageChanged', function() {
  console.log('🌍 languageChanged event отримано');
  window.updateAllTranslations();
});

// ========================================
// ВІДКРИТТЯ ЛОКАЛІЗОВАНИХ СТОРІНОК
// ========================================
window.openLocalizedPage = function(page) {
  var lang = localStorage.getItem('dronefall_language') || 'ua';
  var suffix = '';
  
  // ua, kz -> terms.html, privacy.html (без суфікса)
  // en -> terms_en.html, privacy_en.html
  // pl -> terms_pl.html, privacy_pl.html
  // cs -> terms_cz.html, privacy_cz.html
  if (lang === 'en') {
    suffix = '_en';
  } else if (lang === 'pl') {
    suffix = '_pl';
  } else if (lang === 'cs') {
    suffix = '_cz';
  }
  // ua, kz - без суфікса (основні файли українською)
  
  var url = page + suffix + '.html';
  console.log('📄 openLocalizedPage:', page, 'lang:', lang, 'url:', url);
  window.open(url, '_blank');
};

console.log('🌍 language-updater.js v3 завантажено');