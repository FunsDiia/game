/**
 * ============================================================
 * 🔧 DRONEFALL BUGFIX PATCH — game-bugfix.js
 * Підключати ПІСЛЯ game.js у index.html:
 *   <script src="game-bugfix.js?v=1"></script>
 *
 * ВИПРАВЛЕНІ БАГИ:
 *  1. ППО не ставиться на карту — canvas ще не завантажений
 *     при першому кліку (isPointOnMap повертає false)
 *  2. CSS-змінні були відсутні в :root (style.css)
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // БАГ 1: isPointOnMap — canvas race condition
  //
  // Проблема: mapPixelCanvas створюється з new Image(), але
  // mapImage.onload спрацьовує асинхронно. Якщо гравець
  // натискає на карту до завантаження зображення —
  // canvas.width === 0 → isPointOnMap() повертає false → ППО
  // не встановлюється, жодного повідомлення не показується.
  //
  // Рішення: перевизначаємо isPointOnMap(), щоб при width===0
  // повертати true (дозволяємо розміщення), а не false.
  // ============================================================

  function patchIsPointOnMap() {
    // Чекаємо поки game.js визначить функцію
    if (typeof isPointOnMap !== 'function') {
      setTimeout(patchIsPointOnMap, 100);
      return;
    }

    const originalIsPointOnMap = window.isPointOnMap || isPointOnMap;

    window.isPointOnMap = function(lat, lng) {
      // Якщо canvas ще не готовий — перевіряємо тільки bounds
      if (typeof mapPixelCanvas === 'undefined' ||
          !mapPixelCanvas ||
          !mapPixelCanvas.width ||
          mapPixelCanvas.width === 0) {

        // Fallback: перевірка за межами imageBounds
        const imageBounds = [[0, 0], [2829, 4000]];
        const inBounds = lat >= imageBounds[0][0] && lat <= imageBounds[1][0] &&
                         lng >= imageBounds[0][1] && lng <= imageBounds[1][1];

        if (inBounds) {
          // Canvas ще не готовий, але координата в межах — дозволяємо
          // (pixel-precise перевірка буде доступна після завантаження)
          console.log('🔧 isPointOnMap: canvas not ready, using bounds fallback → true');
          return true;
        }
        return false;
      }

      // Canvas готовий — використовуємо оригінальну логіку
      try {
        return originalIsPointOnMap(lat, lng);
      } catch(e) {
        console.warn('🔧 isPointOnMap fallback after error:', e);
        return true;
      }
    };

    console.log('✅ [Bugfix] isPointOnMap patched — canvas timing fix applied');
  }

  // ============================================================
  // БАГ 2: Відсутні CSS-змінні — додаємо програмно як запасний варіант
  // (style.css вже має :root блок, але якщо кеш старий — цей код
  // встановить змінні через JS як fallback)
  // ============================================================

  function patchCSSVariables() {
    const root = document.documentElement;
    const style = getComputedStyle(root);

    // Перевіряємо чи є хоча б одна змінна
    if (!style.getPropertyValue('--font-main').trim()) {
      console.log('🔧 [Bugfix] CSS variables missing — injecting via JS');

      root.style.setProperty('--font-main', "'Rajdhani', 'Orbitron', 'Segoe UI', system-ui, sans-serif");
      root.style.setProperty('--bg-dark', '#050810');
      root.style.setProperty('--panel-bg', 'rgba(8, 14, 26, 0.92)');
      root.style.setProperty('--glass-border', 'rgba(0, 210, 120, 0.25)');
      root.style.setProperty('--accent-green', '#00d278');
      root.style.setProperty('--accent-cyan', '#00e5ff');
      root.style.setProperty('--accent-gold', '#ffd700');
      root.style.setProperty('--accent-red', '#ff3b3b');
      root.style.setProperty('--danger-red', '#ff2222');
      root.style.setProperty('--text-primary', '#d4f0e8');
      root.style.setProperty('--text-secondary', 'rgba(180, 220, 200, 0.7)');
      root.style.setProperty('--surface-1', 'rgba(0, 30, 20, 0.85)');
      root.style.setProperty('--surface-2', 'rgba(0, 45, 30, 0.7)');
      root.style.setProperty('--border-glow', '0 0 12px rgba(0, 210, 120, 0.3)');

      console.log('✅ [Bugfix] CSS variables injected');
    }
  }

  // ============================================================
  // БАГ 3: alert() при невдалому розміщенні — робимо тихе
  // повідомлення замість alert (покращення UX)
  // ============================================================

  function patchAlerts() {
    // Замінюємо alert на in-game notification якщо доступний
    const originalAlert = window.alert;

    window.alert = function(msg) {
      // Спробуємо показати через HUD notification
      const notifEl = document.getElementById('targetNotification');
      if (notifEl && typeof msg === 'string') {
        notifEl.textContent = msg;
        notifEl.classList.add('visible');

        clearTimeout(window._alertNotifTimeout);
        window._alertNotifTimeout = setTimeout(() => {
          notifEl.classList.remove('visible');
        }, 3000);

        console.warn('🔔 [Game Alert]:', msg);
        return; // Не показуємо системний alert
      }

      // Fallback до оригінального alert якщо HUD недоступний
      originalAlert(msg);
    };

    console.log('✅ [Bugfix] alert() replaced with HUD notification');
  }

  // ============================================================
  // ІНІЦІАЛІЗАЦІЯ
  // ============================================================

  // Патчимо CSS одразу
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchCSSVariables);
  } else {
    patchCSSVariables();
  }

  // Патчимо ігрові функції після завантаження DOM
  document.addEventListener('DOMContentLoaded', function() {
    // Невелика затримка щоб game.js встиг ініціалізуватись
    setTimeout(() => {
      patchIsPointOnMap();
      patchAlerts();
    }, 50);
  });

  // Додатковий виклик для надійності
  window.addEventListener('load', function() {
    patchIsPointOnMap();
    patchCSSVariables();
  });

  console.log('🔧 DroneFall BugFix Patch v1.0 — loaded');
})();
