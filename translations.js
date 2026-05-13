// ========================================
// 🌍 МУЛЬТИМОВНА СИСТЕМА - DRONEFALL
// ========================================
// Підтримка: Українська (UA), English (EN), Қазақша (KZ), Polski (PL), Čeština (CS)
// Мова зберігається в localStorage і застосовується на ВСІХ сторінках

const TRANSLATIONS = {
  
  // ========================================
  // ЗАГАЛЬНІ ЕЛЕМЕНТИ (всі сторінки)
  // ========================================
  common: {
    back: {
      ua: 'Назад',
      en: 'Back',
      kz: 'Артқа',
      pl: 'Wstecz',
      cs: 'Zpět'
    },
    close: {
      ua: 'Закрити',
      en: 'Close',
      kz: 'Жабу',
      pl: 'Zamknij',
      cs: 'Zavřít'
    },
    selectLanguage: {
      ua: 'Оберіть мову',
      en: 'Select Language',
      kz: 'Тілді таңдаңыз',
      pl: 'Wybierz język',
      cs: 'Vyberte jazyk'
    },
    save: {
      ua: 'Зберегти',
      en: 'Save',
      kz: 'Сақтау',
      pl: 'Zapisz',
      cs: 'Uložit'
    },
    cancel: {
      ua: 'Скасувати',
      en: 'Cancel',
      kz: 'Болдырмау',
      pl: 'Anuluj',
      cs: 'Zrušit'
    },
    confirm: {
      ua: 'Підтвердити',
      en: 'Confirm',
      kz: 'Растау',
      pl: 'Potwierdź',
      cs: 'Potvrdit'
    },
    loading: {
      ua: 'Завантаження...',
      en: 'Loading...',
      kz: 'Жүктелуде...',
      pl: 'Ładowanie...',
      cs: 'Načítání...'
    },
    error: {
      ua: 'Помилка',
      en: 'Error',
      kz: 'Қате',
      pl: 'Błąd',
      cs: 'Chyba'
    },
    success: {
      ua: 'Успішно!',
      en: 'Success!',
      kz: 'Сәтті!',
      pl: 'Sukces!',
      cs: 'Úspěch!'
    },
    yes: {
      ua: 'Так',
      en: 'Yes',
      kz: 'Иә',
      pl: 'Tak',
      cs: 'Ano'
    },
    no: {
      ua: 'Ні',
      en: 'No',
      kz: 'Жоқ',
      pl: 'Nie',
      cs: 'Ne'
    },
    home: {
      ua: 'Головна',
      en: 'Home',
      kz: 'Басты бет',
      pl: 'Strona główna',
      cs: 'Domů'
    },
    mainMenu: {
      ua: 'Головне меню',
      en: 'Main Menu',
      kz: 'Басты мәзір',
      pl: 'Menu główne',
      cs: 'Hlavní menu'
    },
    or: {
      ua: 'або',
      en: 'or',
      kz: 'немесе',
      pl: 'lub',
      cs: 'nebo'
    }
  },
  
  // ========================================
// ПЕРЕКЛАДИ ДЛЯ СТОРІНКИ ПІДТРИМКИ
// Додай цю секцію в TRANSLATIONS об'єкт у translations.js
// ========================================

support: {
    // Заголовки
    supportTitle: {
        ua: 'Служба підтримки',
        en: 'Support Center',
        kz: 'Қолдау орталығы',
        pl: 'Centrum wsparcia',
        cs: 'Centrum podpory'
    },
    supportSubtitle: {
        ua: 'Ми відповімо протягом 24 годин',
        en: 'We will respond within 24 hours',
        kz: '24 сағат ішінде жауап береміз',
        pl: 'Odpowiemy w ciągu 24 godzin',
        cs: 'Odpovíme do 24 hodin'
    },
    
    // Поля форми
    yourName: {
        ua: "Ваше ім'я",
        en: 'Your name',
        kz: 'Сіздің атыңыз',
        pl: 'Twoje imię',
        cs: 'Vaše jméno'
    },
    namePlaceholder: {
        ua: 'Як до вас звертатися?',
        en: 'How should we call you?',
        kz: 'Сізге қалай хабарласайық?',
        pl: 'Jak się do Ciebie zwracać?',
        cs: 'Jak vás máme oslovovat?'
    },
    yourEmail: {
        ua: 'Ваш Email',
        en: 'Your Email',
        kz: 'Сіздің Email',
        pl: 'Twój Email',
        cs: 'Váš Email'
    },
    emailPlaceholder: {
        ua: 'example@email.com',
        en: 'example@email.com',
        kz: 'example@email.com',
        pl: 'example@email.com',
        cs: 'example@email.com'
    },
    category: {
        ua: 'Категорія',
        en: 'Category',
        kz: 'Санат',
        pl: 'Kategoria',
        cs: 'Kategorie'
    },
    subject: {
        ua: 'Тема',
        en: 'Subject',
        kz: 'Тақырып',
        pl: 'Temat',
        cs: 'Předmět'
    },
    subjectPlaceholder: {
        ua: 'Коротко опишіть проблему',
        en: 'Briefly describe the issue',
        kz: 'Мәселені қысқаша сипаттаңыз',
        pl: 'Krótko opisz problem',
        cs: 'Stručně popište problém'
    },
    message: {
        ua: 'Повідомлення',
        en: 'Message',
        kz: 'Хабарлама',
        pl: 'Wiadomość',
        cs: 'Zpráva'
    },
    messagePlaceholder: {
        ua: 'Детально опишіть ваше питання або проблему...',
        en: 'Describe your question or issue in detail...',
        kz: 'Сұрағыңызды немесе мәселеңізді толық сипаттаңыз...',
        pl: 'Szczegółowo opisz swoje pytanie lub problem...',
        cs: 'Podrobně popište svůj dotaz nebo problém...'
    },
    
    // Категорії
    catGeneral: {
        ua: 'Загальне питання',
        en: 'General question',
        kz: 'Жалпы сұрақ',
        pl: 'Pytanie ogólne',
        cs: 'Obecný dotaz'
    },
    catBug: {
        ua: 'Повідомити про баг',
        en: 'Report a bug',
        kz: 'Қате туралы хабарлау',
        pl: 'Zgłoś błąd',
        cs: 'Nahlásit chybu'
    },
    catAccount: {
        ua: 'Проблема з акаунтом',
        en: 'Account issue',
        kz: 'Аккаунт мәселесі',
        pl: 'Problem z kontem',
        cs: 'Problém s účtem'
    },
    catPayment: {
        ua: 'Оплата / Донат',
        en: 'Payment / Donation',
        kz: 'Төлем / Донат',
        pl: 'Płatność / Donacja',
        cs: 'Platba / Donace'
    },
    catSuggestion: {
        ua: 'Пропозиція',
        en: 'Suggestion',
        kz: 'Ұсыныс',
        pl: 'Sugestia',
        cs: 'Návrh'
    },
    catOther: {
        ua: 'Інше',
        en: 'Other',
        kz: 'Басқа',
        pl: 'Inne',
        cs: 'Jiné'
    },
    
    // Кнопки
    sendTicket: {
        ua: 'Надіслати звернення',
        en: 'Send ticket',
        kz: 'Өтінішті жіберу',
        pl: 'Wyślij zgłoszenie',
        cs: 'Odeslat požadavek'
    },
    backToGame: {
        ua: 'Повернутися до гри',
        en: 'Back to game',
        kz: 'Ойынға оралу',
        pl: 'Powrót do gry',
        cs: 'Zpět do hry'
    },
    
    // Успішна відправка
    ticketSent: {
        ua: 'Звернення надіслано!',
        en: 'Ticket sent!',
        kz: 'Өтініш жіберілді!',
        pl: 'Zgłoszenie wysłane!',
        cs: 'Požadavek odeslán!'
    },
    ticketSentText: {
        ua: 'Ми отримали ваше звернення і відповімо на вказаний email протягом 24 годин.',
        en: 'We have received your ticket and will respond to your email within 24 hours.',
        kz: 'Біз сіздің өтінішіңізді алдық және 24 сағат ішінде email-ге жауап береміз.',
        pl: 'Otrzymaliśmy Twoje zgłoszenie i odpowiemy na wskazany email w ciągu 24 godzin.',
        cs: 'Obdrželi jsme váš požadavek a odpovíme na uvedený email do 24 hodin.'
    },
    
    // FAQ
    faqTitle: {
        ua: 'Часті питання:',
        en: 'FAQ:',
        kz: 'Жиі қойылатын сұрақтар:',
        pl: 'FAQ:',
        cs: 'Časté dotazy:'
    },
    faqHelp: {
        ua: 'Як грати?',
        en: 'How to play?',
        kz: 'Қалай ойнау керек?',
        pl: 'Jak grać?',
        cs: 'Jak hrát?'
    },
    faqTerms: {
        ua: 'Умови',
        en: 'Terms',
        kz: 'Шарттар',
        pl: 'Regulamin',
        cs: 'Podmínky'
    },
    faqPrivacy: {
        ua: 'Конфіденційність',
        en: 'Privacy',
        kz: 'Құпиялылық',
        pl: 'Prywatność',
        cs: 'Soukromí'
    }
},

  // ========================================
  // НАЗВИ ППО
  // ========================================
  ppo: {
    'Кулемет': { ua: 'Кулемет', en: 'Machine Gun', kz: 'Пулемет', pl: 'Karabin maszynowy', cs: 'Kulomet' },
    'kulemet': { ua: 'Кулемет', en: 'Machine Gun', kz: 'Пулемет', pl: 'Karabin maszynowy', cs: 'Kulomet' },
    'Радар': { ua: 'Радар', en: 'Radar', kz: 'Радар', pl: 'Radar', cs: 'Radar' },
    'radar': { ua: 'Радар', en: 'Radar', kz: 'Радар', pl: 'Radar', cs: 'Radar' },
    'РЕБ': { ua: 'РЕБ', en: 'EW', kz: 'ЭБ', pl: 'WE', cs: 'REB' },
    'reb': { ua: 'РЕБ', en: 'EW', kz: 'ЭБ', pl: 'WE', cs: 'REB' },
    'Кільчень': { ua: 'Кільчень', en: 'Kilchen', kz: 'Кільчень', pl: 'Kilchen', cs: 'Kilchen' },
    'kilchen': { ua: 'Кільчень', en: 'Kilchen', kz: 'Кільчень', pl: 'Kilchen', cs: 'Kilchen' },
    'Аеродром': { ua: 'Аеродром', en: 'Airfield', kz: 'Әуежай', pl: 'Lotnisko', cs: 'Letiště' },
    'aerodrom': { ua: 'Аеродром', en: 'Airfield', kz: 'Әуежай', pl: 'Lotnisko', cs: 'Letiště' },
    'Аварійка': { ua: 'Аварійка', en: 'Emergency', kz: 'Авариялық', pl: 'Awaryjny', cs: 'Pohotovost' },
    '2K12 KUB': { ua: '2K12 KUB', en: '2K12 KUB', kz: '2K12 KUB', pl: '2K12 KUB', cs: '2K12 KUB' },
    '2k12kub': { ua: '2K12 KUB', en: '2K12 KUB', kz: '2K12 KUB', pl: '2K12 KUB', cs: '2K12 KUB' },
    'Crotale 90M': { ua: 'Crotale 90M', en: 'Crotale 90M', kz: 'Crotale 90M', pl: 'Crotale 90M', cs: 'Crotale 90M' },
    'crotale90m': { ua: 'Crotale 90M', en: 'Crotale 90M', kz: 'Crotale 90M', pl: 'Crotale 90M', cs: 'Crotale 90M' },
    'IRIS-T SML': { ua: 'IRIS-T SML', en: 'IRIS-T SML', kz: 'IRIS-T SML', pl: 'IRIS-T SML', cs: 'IRIS-T SML' },
    'iristsml': { ua: 'IRIS-T SML', en: 'IRIS-T SML', kz: 'IRIS-T SML', pl: 'IRIS-T SML', cs: 'IRIS-T SML' },
    'МіГ-29': { ua: 'МіГ-29', en: 'MiG-29', kz: 'МиГ-29', pl: 'MiG-29', cs: 'MiG-29' },
    'mig29': { ua: 'МіГ-29', en: 'MiG-29', kz: 'МиГ-29', pl: 'MiG-29', cs: 'MiG-29' },
    'Су-27': { ua: 'Су-27', en: 'Su-27', kz: 'Су-27', pl: 'Su-27', cs: 'Su-27' },
    'su27': { ua: 'Су-27', en: 'Su-27', kz: 'Су-27', pl: 'Su-27', cs: 'Su-27' },
    'Patriot': { ua: 'Patriot', en: 'Patriot', kz: 'Patriot', pl: 'Patriot', cs: 'Patriot' },
    'patriot': { ua: 'Patriot', en: 'Patriot', kz: 'Patriot', pl: 'Patriot', cs: 'Patriot' },
    'F-16': { ua: 'F-16', en: 'F-16', kz: 'F-16', pl: 'F-16', cs: 'F-16' },
    'f16': { ua: 'F-16', en: 'F-16', kz: 'F-16', pl: 'F-16', cs: 'F-16' }
  },

  // ========================================
  // РАРНОСТІ
  // ========================================
  rarity: {
    common: { ua: 'Звичайний', en: 'Common', kz: 'Қарапайым', pl: 'Zwykły', cs: 'Běžný' },
    rare: { ua: 'Рідкісний', en: 'Rare', kz: 'Сирек', pl: 'Rzadki', cs: 'Vzácný' },
    epic: { ua: 'Епічний', en: 'Epic', kz: 'Эпикалық', pl: 'Epicki', cs: 'Epický' },
    legendary: { ua: 'Легендарний', en: 'Legendary', kz: 'Аңызды', pl: 'Legendarny', cs: 'Legendární' }
  },

  // ========================================
  // АВТОРИЗАЦІЯ (login.php)
  // ========================================
  auth: {
    loginTitle: { ua: 'Вхід', en: 'Login', kz: 'Кіру', pl: 'Logowanie', cs: 'Přihlášení' },
    welcome: { ua: 'Вітаємо!', en: 'Welcome!', kz: 'Қош келдіңіз!', pl: 'Witamy!', cs: 'Vítejte!' },
    login: { ua: 'Логін', en: 'Login', kz: 'Логин', pl: 'Login', cs: 'Přihlašovací jméno' },
    loginPlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    password: { ua: 'Пароль', en: 'Password', kz: 'Құпия сөз', pl: 'Hasło', cs: 'Heslo' },
    passwordPlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    enter: { ua: 'Увійти', en: 'Sign In', kz: 'Кіру', pl: 'Zaloguj się', cs: 'Přihlásit se' },
    registration: { ua: 'Реєстрація', en: 'Registration', kz: 'Тіркелу', pl: 'Rejestracja', cs: 'Registrace' },
    wrongCredentials: { ua: 'Невірний логін або пароль!', en: 'Wrong login or password!', kz: 'Логин немесе құпия сөз қате!', pl: 'Nieprawidłowy login lub hasło!', cs: 'Špatné přihlašovací jméno nebo heslo!' },
    noAccount: { ua: 'Немає акаунту?', en: 'No account?', kz: 'Тіркелгіңіз жоқ па?', pl: 'Nie masz konta?', cs: 'Nemáte účet?' },
    ipBlocked: { ua: 'Ваш IP тимчасово заблоковано', en: 'Your IP is temporarily blocked', kz: 'Сіздің IP уақытша бұғатталған', pl: 'Twój IP jest tymczasowo zablokowany', cs: 'Vaše IP je dočasně zablokována' },
    tooManyAttempts: { ua: 'Забагато спроб. Спробуйте через 30 хвилин.', en: 'Too many attempts. Try again in 30 minutes.', kz: 'Тым көп әрекет. 30 минуттан кейін қайталаңыз.', pl: 'Zbyt wiele prób. Spróbuj za 30 minut.', cs: 'Příliš mnoho pokusů. Zkuste to za 30 minut.' },
    recoverAccount: { ua: 'Відновити акаунт', en: 'Recover account', kz: 'Аккаунтты қалпына келтіру', pl: 'Odzyskaj konto', cs: 'Obnovit účet' }
  },

  // ========================================
  // РЕЄСТРАЦІЯ (register_step1.php, register_step2.php, register_success.php)
  // ========================================
  register: {
    step1Title: { ua: 'Реєстрація', en: 'Registration', kz: 'Тіркелу', pl: 'Rejestracja', cs: 'Registrace' },
    step1of3: { ua: 'Крок 1 з 3', en: 'Step 1 of 3', kz: '3-тен 1-қадам', pl: 'Krok 1 z 3', cs: 'Krok 1 ze 3' },
    step2of3: { ua: 'Крок 2 з 3', en: 'Step 2 of 3', kz: '3-тен 2-қадам', pl: 'Krok 2 z 3', cs: 'Krok 2 ze 3' },
    step3of3: { ua: 'Крок 3 з 3', en: 'Step 3 of 3', kz: '3-тен 3-қадам', pl: 'Krok 3 z 3', cs: 'Krok 3 ze 3' },
    username: { ua: 'Нікнейм', en: 'Username', kz: 'Пайдаланушы аты', pl: 'Nazwa użytkownika', cs: 'Uživatelské jméno' },
    usernamePlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    usernameHint: { ua: '3-20 символів, латиниця та цифри', en: '3-20 characters, letters and numbers', kz: '3-20 таңба, әріптер мен сандар', pl: '3-20 znaków, litery i cyfry', cs: '3-20 znaků, písmena a čísla' },
    password: { ua: 'Пароль', en: 'Password', kz: 'Құпия сөз', pl: 'Hasło', cs: 'Heslo' },
    passwordPlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    passwordHint: { ua: 'Мінімум 8 символів', en: 'Minimum 8 characters', kz: 'Кемінде 8 таңба', pl: 'Minimum 8 znaków', cs: 'Minimálně 8 znaků' },
    confirmPassword: { ua: 'Повторіть пароль', en: 'Confirm password', kz: 'Құпия сөзді растаңыз', pl: 'Potwierdź hasło', cs: 'Potvrdit heslo' },
    confirmPasswordPlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    next: { ua: 'Далі', en: 'Next', kz: 'Келесі', pl: 'Dalej', cs: 'Další' },
    haveAccount: { ua: 'Вже є акаунт?', en: 'Already have an account?', kz: 'Тіркелгіңіз бар ма?', pl: 'Masz już konto?', cs: 'Již máte účet?' },
    
    // Step 2 - Email verification
    emailVerification: { ua: 'Підтвердження email', en: 'Email Verification', kz: 'Email растау', pl: 'Weryfikacja email', cs: 'Ověření e-mailu' },
    enterEmail: { ua: 'Введіть email', en: 'Enter email', kz: 'Email енгізіңіз', pl: 'Wprowadź email', cs: 'Zadejte e-mail' },
    emailPlaceholder: { ua: ' ', en: ' ', kz: ' ', pl: ' ', cs: ' ' },
    sendCode: { ua: 'Надіслати код', en: 'Send Code', kz: 'Код жіберу', pl: 'Wyślij kod', cs: 'Odeslat kód' },
    enterCode: { ua: 'Введіть код', en: 'Enter code', kz: 'Кодты енгізіңіз', pl: 'Wprowadź kod', cs: 'Zadejte kód' },
    codePlaceholder: { ua: '6-значний код', en: '6-digit code', kz: '6 санды код', pl: '6-cyfrowy kod', cs: '6místný kód' },
    verify: { ua: 'Підтвердити', en: 'Verify', kz: 'Растау', pl: 'Potwierdź', cs: 'Potvrdit' },
    resendIn: { ua: 'Надіслати знову через', en: 'Resend in', kz: 'Қайта жіберу', pl: 'Wyślij ponownie za', cs: 'Znovu odeslat za' },
    seconds: { ua: 'сек', en: 'sec', kz: 'сек', pl: 'sec', cs: 'sec' },
    codeSent: { ua: 'Код надіслано на', en: 'Code sent to', kz: 'Код жіберілді', pl: 'Kod wysłany do', cs: 'Kód odeslán na' },
    wrongCode: { ua: 'Невірний код!', en: 'Wrong code!', kz: 'Код қате!', pl: 'Błędny kod!', cs: 'Špatný kód!' },
    
    // Step 3 - Success
    successTitle: { ua: 'Вітаємо!', en: 'Congratulations!', kz: 'Құттықтаймыз!', pl: 'Gratulacje!', cs: 'Gratulujeme!' },
    accountCreated: { ua: 'Акаунт успішно створено!', en: 'Account successfully created!', kz: 'Тіркелгі сәтті жасалды!', pl: 'Konto pomyślnie utworzone!', cs: 'Účet úspěšně vytvořen!' },
    yourUsername: { ua: 'Твій нікнейм:', en: 'Your username:', kz: 'Сіздің пайдаланушы атыңыз:', pl: 'Twoja nazwa:', cs: 'Vaše jméno:' },
    startPlaying: { ua: 'Почати гру', en: 'Start Playing', kz: 'Ойнауды бастау', pl: 'Rozpocznij grę', cs: 'Začít hru' },
    
    // Errors
    usernameTaken: { ua: 'Цей нікнейм вже зайнятий', en: 'This username is already taken', kz: 'Бұл пайдаланушы аты бос емес', pl: 'Ta nazwa użytkownika jest już zajęta', cs: 'Toto uživatelské jméno je již obsazeno' },
    emailTaken: { ua: 'Цей email вже зареєстрований', en: 'This email is already registered', kz: 'Бұл email тіркелген', pl: 'Ten email jest już zarejestrowany', cs: 'Tento e-mail je již registrován' },
    passwordMismatch: { ua: 'Паролі не співпадають', en: 'Passwords do not match', kz: 'Құпия сөздер сәйкес келмейді', pl: 'Hasła nie są zgodne', cs: 'Hesla se neshodují' },
    passwordWeak: { ua: 'Пароль занадто слабкий', en: 'Password is too weak', kz: 'Құпия сөз тым әлсіз', pl: 'Hasło jest za słabe', cs: 'Heslo je příliš slabé' },
    fillAllFields: { ua: 'Заповни всі поля!', en: 'Fill all fields!', kz: 'Барлық өрістерді толтырыңыз!', pl: 'Wypełnij wszystkie pola!', cs: 'Vyplňte všechna pole!' },
    passwordMin8: { ua: 'Пароль мінімум 8 символів!', en: 'Password minimum 8 characters!', kz: 'Құпия сөз кемінде 8 таңба!', pl: 'Hasło minimum 8 znaków!', cs: 'Heslo minimálně 8 znaků!' },
    wrongCode: { ua: 'Невірний код!', en: 'Wrong code!', kz: 'Код қате!', pl: 'Błędny kod!', cs: 'Špatný kód!' },
    registrationError: { ua: 'Помилка реєстрації', en: 'Registration error', kz: 'Тіркелу қатесі', pl: 'Błąd rejestracji', cs: 'Chyba registrace' },
    codeValid10min: { ua: 'Дійсний 10 хвилин', en: 'Valid for 10 minutes', kz: '10 минут жарамды', pl: 'Ważny przez 10 minut', cs: 'Platný 10 minut' },
    
    // Terms & Privacy checkboxes (Step 2)
    acceptTermsText: { ua: 'Умови використання DroneFall', en: 'DroneFall Terms of Service', kz: 'DroneFall қолдану шарттары', pl: 'Regulamin DroneFall', cs: 'Podmínky služby DroneFall' },
    acceptPrivacyText: { ua: 'Політику конфіденційності DroneFall', en: 'DroneFall Privacy Policy', kz: 'DroneFall құпиялылық саясаты', pl: 'Politykę prywatności DroneFall', cs: 'Zásady ochrany osobních údajů DroneFall' },
    iAccept: { ua: 'Я приймаю', en: 'I accept', kz: 'Мен қабылдаймын', pl: 'Akceptuję', cs: 'Přijímám' },
    checkboxRequired: { ua: 'Необхідно прийняти Умови Використання та Політику Конфіденційності', en: 'You must accept Terms of Service and Privacy Policy', kz: 'Қолдану шарттары мен Құпиялылық саясатын қабылдау қажет', pl: 'Musisz zaakceptować Regulamin i Politykę Prywatności', cs: 'Musíte přijmout Podmínky služby a Zásady ochrany osobních údajů' },
    termsNoticeText: { ua: 'Натискаючи "Підтвердити", ви погоджуєтесь з', en: 'By clicking "Verify", you agree to', kz: '"Растау" түймесін басу арқылы сіз келісесіз', pl: 'Klikając "Potwierdź", zgadzasz się z', cs: 'Kliknutím na "Potvrdit" souhlasíte s' },
    termsLink: { ua: 'Умовами використання', en: 'Terms of Service', kz: 'Қолдану шарттары', pl: 'Regulamin', cs: 'Podmínky služby' },
    privacyLink: { ua: 'Політикою конфіденційності', en: 'Privacy Policy', kz: 'Құпиялылық саясаты', pl: 'Polityka prywatności', cs: 'Zásady ochrany osobních údajů' },
    andWord: { ua: 'та', en: 'and', kz: 'және', pl: 'i', cs: 'a' }
  },

  // ========================================
  // ПРОФІЛЬ (profile.html)
  // ========================================
  profile: {
    title: { ua: 'Профіль', en: 'Profile', kz: 'Профиль', pl: 'Profil', cs: 'Profil' },
    username: { ua: 'Нікнейм', en: 'Username', kz: 'Пайдаланушы аты', pl: 'Nazwa użytkownika', cs: 'Uživatelské jméno' },
    email: { ua: 'Email', en: 'Email', kz: 'Email', pl: 'Email', cs: 'Email' },
    firstName: { ua: 'Ім\'я', en: 'Name', kz: 'Аты', pl: 'Imię', cz: 'Jméno' },
    firstNamePlaceholder: { ua: 'Ім\'я', en: 'Name', kz: 'Аты', pl: 'Imię', cz: 'Jméno' },
    birthdate: { ua: 'Дата народження', en: 'Birth Date', kz: 'Туған күні', pl: 'Data urodzenia', cs: 'Datum narození' },
    promoCode: { ua: 'Промокод', en: 'Promo Code', kz: 'Промокод', pl: 'Kod promocyjny', cs: 'Promo kód' },
    promoPlaceholder: { ua: 'Введи промокод', en: 'Enter promo code', kz: 'Промокодты енгізіңіз', pl: 'Wprowadź kod promocyjny', cs: 'Zadejte promo kód' },
    activate: { ua: 'Активувати', en: 'Activate', kz: 'Белсендіру', pl: 'Aktywuj', cs: 'Aktivovat' },
    logout: { ua: 'Вийти', en: 'Log Out', kz: 'Шығу', pl: 'Wyloguj', cs: 'Odhlásit' },
    logoutConfirm: { ua: 'Вийти з акаунту?', en: 'Log out from account?', kz: 'Аккаунттан шығу керек пе?', pl: 'Wylogować się z konta?', cs: 'Odhlásit se z účtu?' },
    saveChanges: { ua: 'Зберегти зміни', en: 'Save Changes', kz: 'Өзгерістерді сақтау', pl: 'Zapisz zmiany', cs: 'Uložit změny' },
    changesSaved: { ua: 'Профіль успішно збережено!', en: 'Profile saved successfully!', kz: 'Профиль сәтті сақталды!', pl: 'Profil zapisany pomyślnie!', cs: 'Profil úspěšně uložen!' },
    saveError: { ua: 'Помилка збереження профілю', en: 'Failed to save profile', kz: 'Профильді сақтау қатесі', pl: 'Nie udało się zapisać profilu', cs: 'Nepodařilo se uložit profil' },
    promoSuccess: { ua: 'Промокод активовано!', en: 'Promo code activated!', kz: 'Промокод белсендірілді!', pl: 'Kod promocyjny aktywowany!', cs: 'Promo kód aktivován!' },
    promoError: { ua: 'Помилка активації промокоду', en: 'Failed to activate promo code', kz: 'Промокодты белсендіру қатесі', pl: 'Nie udało się aktywować kodu', cs: 'Nepodařilo se aktivovat kód' },
    promoEmpty: { ua: 'Введи промокод!', en: 'Enter promo code!', kz: 'Промокодты енгізіңіз!', pl: 'Wprowadź kod promocyjny!', cs: 'Zadejte promo kód!' },
    promoUsed: { ua: 'Ти вже використав цей промокод', en: 'You already used this promo code', kz: 'Сіз бұл промокодты қолдандыңыз', pl: 'Już wykorzystałeś ten kod promocyjny', cs: 'Tento promo kód jste již použili' },
    loading: { ua: 'Завантаження...', en: 'Loading...', kz: 'Жүктелуде...', pl: 'Ładowanie...', cs: 'Načítání...' },
    statistics: { ua: 'Статистика', en: 'Statistics', kz: 'Статистика', pl: 'Statystyki', cs: 'Statistiky' },
    gamesPlayed: { ua: 'Зіграно ігор', en: 'Games Played', kz: 'Ойналған ойындар', pl: 'Rozegrane gry', cs: 'Odehrané hry' },
    enemiesKilled: { ua: 'Знищено ворогів', en: 'Enemies Killed', kz: 'Жойылған жаулар', pl: 'Zabici wrogowie', cs: 'Zabití nepřátelé' },
    highestWave: { ua: 'Найвища хвиля', en: 'Highest Wave', kz: 'Ең жоғары толқын', pl: 'Najwyższa fala', cs: 'Nejvyšší vlna' },
    termsOfService: { ua: 'Умови використання', en: 'Terms of Service', kz: 'Қолдану шарттары', pl: 'Regulamin', cs: 'Podmínky služby' },
    privacyPolicy: { ua: 'Політика конфіденційності', en: 'Privacy Policy', kz: 'Құпиялылық саясаты', pl: 'Polityka prywatności', cs: 'Zásady ochrany osobních údajů' },
    avatarUploaded: { ua: 'Аватар оновлено!', en: 'Avatar updated!', kz: 'Аватар жаңартылды!', pl: 'Awatar zaktualizowany!', cs: 'Avatar aktualizován!' },
    avatarTooLarge: { ua: 'Файл занадто великий (макс 5MB)', en: 'File too large (max 5MB)', kz: 'Файл тым үлкен (макс 5MB)', pl: 'Plik za duży (maks. 5MB)', cs: 'Soubor příliš velký (max 5MB)' },
    avatarWrongType: { ua: 'Дозволені лише зображення', en: 'Only images allowed', kz: 'Тек суреттерге рұқсат', pl: 'Dozwolone tylko obrazy', cs: 'Povoleny pouze obrázky' },
    settings:        { ua: 'Налаштування', en: 'Settings', kz: 'Параметрлер', pl: 'Ustawienia', cs: 'Nastavení' },
    music:           { ua: 'Музика', en: 'Music', kz: 'Музыка', pl: 'Muzyka', cs: 'Hudba' },
    siren:           { ua: 'Сирена', en: 'Siren', kz: 'Сирена', pl: 'Syrena', cs: 'Siréna' }
  },

  // ========================================
  // ІНВЕНТАР (inventory.html)
  // ========================================
  inventory: {
    title: { ua: 'Інвентар', en: 'Inventory', kz: 'Инвентарь', pl: 'Ekwipunek', cs: 'Inventář' },
    myChests: { ua: 'Мої скрині', en: 'My Chests', kz: 'Менің сандықтарым', pl: 'Moje skrzynie', cs: 'Mé truhly' },
    ppoCards: { ua: 'Карточки ППО', en: 'ADS Cards', kz: 'ӘШҚҚ карталары', pl: 'Karty OPL', cs: 'Karty PVO' },
    cards: { ua: 'Картки', en: 'Cards', kz: 'Карталар', pl: 'Karty', cs: 'Karty' },
    chests: { ua: 'Сундуки', en: 'Chests', kz: 'Сандықтар', pl: 'Skrzynie', cs: 'Truhly' },
    level: { ua: 'Рівень', en: 'Level', kz: 'Деңгей', pl: 'Poziom', cs: 'Úroveň' },
    cardsCount: { ua: 'Карток', en: 'Cards', kz: 'Карта', pl: 'Karty', cs: 'Karty' },
    quantity: { ua: 'Кількість', en: 'Quantity', kz: 'Саны', pl: 'Ilość', cs: 'Množství' },
    upgradeStats: { ua: 'Покращити', en: 'Upgrade', kz: 'Жақсарту', pl: 'Ulepsz', cs: 'Vylepšit' },
    damage: { ua: 'Урон', en: 'Damage', kz: 'Зиян', pl: 'Obrażenia', cs: 'Poškození' },
    speed: { ua: 'Швидкість', en: 'Speed', kz: 'Жылдамдық', pl: 'Prędkość', cs: 'Rychlost' },
    reload: { ua: 'Перезарядка', en: 'Reload', kz: 'Қайта жүктеу', pl: 'Przeładowanie', cs: 'Přebíjení' },
    radius: { ua: 'Радіус', en: 'Range', kz: 'Радиус', pl: 'Zasięg', cs: 'Dosah' },
    accuracy: { ua: 'Точність', en: 'Accuracy', kz: 'Дәлдік', pl: 'Celność', cs: 'Přesnost' },
    slow: { ua: 'Замедлення', en: 'Slow', kz: 'Баяулату', pl: 'Spowolnienie', cs: 'Zpomalení' },
    knockdown: { ua: 'Шанс збиття', en: 'Knockdown', kz: 'Түсіру мүмкіндігі', pl: 'Szansa zestrzelenia', cs: 'Šance sestřelu' },
    maxLevel: { ua: 'МАКС', en: 'MAX', kz: 'МАКС', pl: 'MAX', cs: 'MAX' },
    notEnoughCards: { ua: 'Недостатньо карток', en: 'Not enough cards', kz: 'Карталар жеткіліксіз', pl: 'Za mało kart', cs: 'Nedostatek karet' },
    notEnoughMoney: { ua: 'Недостатньо коштів', en: 'Not enough money', kz: 'Ақша жеткіліксіз', pl: 'Za mało środków', cs: 'Nedostatek prostředků' },
    openChest: { ua: 'Відкрити', en: 'Open', kz: 'Ашу', pl: 'Otwórz', cs: 'Otevřít' },
    openAllChests: { ua: 'Відкрити всі', en: 'Open All', kz: 'Барлығын ашу', pl: 'Otwórz wszystkie', cs: 'Otevřít vše' },
    noChests: { ua: 'Немає сундуків', en: 'No chests', kz: 'Сандықтар жоқ', pl: 'Brak skrzyń', cs: 'Žádné truhly' },
    normalChest: { ua: 'Звичайний', en: 'Normal', kz: 'Қарапайым', pl: 'Zwykły', cs: 'Běžný' },
    premiumChest: { ua: 'Преміум', en: 'Premium', kz: 'Премиум', pl: 'Premium', cs: 'Premium' },
    empty: { ua: 'Інвентар порожній', en: 'Inventory is empty', kz: 'Инвентарь бос', pl: 'Ekwipunek jest pusty', cs: 'Inventář je prázdný' },
    getFromChests: { ua: 'Відкривай сундуки щоб отримати картки!', en: 'Open chests to get cards!', kz: 'Карталар алу үшін сандықтарды ашыңыз!', pl: 'Otwieraj skrzynie, aby zdobyć karty!', cs: 'Otevírejte truhly pro získání karet!' },
    // Колода для рейтингу
    rankedDeck: { ua: 'Колода для рейтингу', en: 'Ranked Deck', kz: 'Рейтинг колодасы', pl: 'Talia rankingowa', cs: 'Hodnocený balíček' },
    deckEmpty: { ua: 'Колода порожня!', en: 'Deck is empty!', kz: 'Колода бос!', pl: 'Talia jest pusta!', cs: 'Balíček je prázdný!' },
    deckReady: { ua: 'Колода готова', en: 'Deck ready', kz: 'Колода дайын', pl: 'Talia gotowa', cs: 'Balíček připraven' },
    selectPPO: { ua: 'Обери ППО', en: 'Select Unit', kz: 'Бірлікті таңдаңыз', pl: 'Wybierz jednostkę', cs: 'Vybrat jednotku' }
  },

  // ========================================
  // МАГАЗИН (shop.html)
  // ========================================
  shop: {
    title: { ua: 'Магазин', en: 'Shop', kz: 'Дүкен', pl: 'Sklep', cs: 'Obchod' },
    buy: { ua: 'Купити', en: 'Buy', kz: 'Сатып алу', pl: 'Kup', cs: 'Koupit' },
    purchased: { ua: 'Куплено!', en: 'Purchased!', kz: 'Сатып алынды!', pl: 'Kupione!', cs: 'Zakoupeno!' },
    dailyOffers: { ua: 'Щоденні пропозиції', en: 'Daily Offers', kz: 'Күнделікті ұсыныстар', pl: 'Codzienne oferty', cs: 'Denní nabídky' },
    freeChestSection: { ua: 'Безкоштовна скриня', en: 'Free Chest', kz: 'Тегін сандық', pl: 'Darmowa skrzynia', cs: 'Truhla zdarma' },
    freeChest: { ua: 'Безкоштовний сундук', en: 'Free Chest', kz: 'Тегін сандық', pl: 'Darmowa skrzynia', cs: 'Truhla zdarma' },
    free: { ua: 'БЕЗКОШТОВНО', en: 'FREE', kz: 'ТЕГІН', pl: 'ZA DARMO', cs: 'ZDARMA' },
    available: { ua: 'Доступно!', en: 'Available!', kz: 'Қолжетімді!', pl: 'Dostępne!', cs: 'Dostupné!' },
    claim: { ua: 'Забрати', en: 'Claim', kz: 'Алу', pl: 'Odbierz', cs: 'Získat' },
    nextIn: { ua: 'Наступний через', en: 'Next in', kz: 'Келесі', pl: 'Następny za', cs: 'Další za' },
    hours: { ua: 'год', en: 'h', kz: 'сағ', pl: 'h', cs: 'h' },
    minutes: { ua: 'хв', en: 'm', kz: 'мин', pl: 'm', cs: 'm' },
    notEnoughMoney: { ua: 'Недостатньо коштів!', en: 'Not enough money!', kz: 'Ақша жеткіліксіз!', pl: 'Za mało środków!', cs: 'Nedostatek prostředků!' },
    purchaseSuccess: { ua: 'Покупка успішна!', en: 'Purchase successful!', kz: 'Сатып алу сәтті!', pl: 'Zakup udany!', cs: 'Nákup úspěšný!' },
    youGot: { ua: 'Ви отримали:', en: 'You got:', kz: 'Сіз алдыңыз:', pl: 'Otrzymałeś:', cs: 'Získali jste:' },
    sold: { ua: 'ПРОДАНО', en: 'SOLD', kz: 'САТЫЛДЫ', pl: 'SPRZEDANE', cs: 'PRODÁNO' },
    shopEmpty: { ua: 'Магазин порожній. Зачекайте до опівночі!', en: 'Shop is empty. Wait until midnight!', kz: 'Дүкен бос. Түн ортасына дейін күтіңіз!', pl: 'Sklep jest pusty. Poczekaj do północy!', cs: 'Obchod je prázdný. Počkejte do půlnoci!' },
    chestAdded: { ua: 'Скриню додано в інвентар!', en: 'Chest added to inventory!', kz: 'Сандық инвентарьға қосылды!', pl: 'Skrzynia dodana do ekwipunku!', cs: 'Truhla přidána do inventáře!' },
    success: { ua: 'Успіх!', en: 'Success!', kz: 'Сәтті!', pl: 'Sukces!', cs: 'Úspěch!' },
    error: { ua: 'Помилка', en: 'Error', kz: 'Қате', pl: 'Błąd', cs: 'Chyba' },
    purchaseError: { ua: 'Помилка покупки', en: 'Purchase error', kz: 'Сатып алу қатесі', pl: 'Błąd zakupu', cs: 'Chyba nákupu' },
    refreshInfo: { ua: 'Асортимент оновлюється щодня о 00:00', en: 'Assortment updates daily at 00:00', kz: 'Ассортимент күн сайын 00:00-де жаңарады', pl: 'Asortyment aktualizowany codziennie o 00:00', cs: 'Sortiment se aktualizuje denně v 00:00' },
    adventCalendar: { ua: 'Щоденні нагороди', en: 'Daily Rewards', kz: 'Күнделікті сыйлықтар', pl: 'Codzienne nagrody', cs: 'Denní odměny' },
    adventDay: { ua: 'День', en: 'Day', kz: 'Күн', pl: 'Dzień', cs: 'Den' },
    adventComplete: { ua: 'Завершено!', en: 'Complete!', kz: 'Аяқталды!', pl: 'Ukończono!', cs: 'Dokončeno!' },
    adventTomorrow: { ua: 'Завтра', en: 'Tomorrow', kz: 'Ертең', pl: 'Jutro', cs: 'Zítra' },
    adventWaitReset: { ua: 'Нова тиждень!', en: 'New week!', kz: 'Жаңа апта!', pl: 'Nowy tydzień!', cs: 'Nový týden!' },
    normalChests: { ua: 'скринь', en: 'chests', kz: 'сандық', pl: 'skrzyń', cs: 'truhel' },
    premiumChest: { ua: 'преміум скриня', en: 'premium chest', kz: 'премиум сандық', pl: 'skrzynia premium', cs: 'prémiová truhla' },
    chestsAdded: { ua: 'скринь додано!', en: 'chests added!', kz: 'сандық қосылды!', pl: 'skrzyń dodano!', cs: 'truhel přidáno!' },
    // Бойові завдання
    battleQuests:        { ua: 'Бойові завдання', en: 'Battle Quests', kz: 'Жауынгерлік тапсырмалар', pl: 'Zadania bojowe', cs: 'Bojové úkoly' },
    questShaheds:        { ua: 'Збити Шахедів', en: 'Shoot down Shaheds', kz: 'Шахедтерді атып түсіру', pl: 'Zestrzel Shahedów', cs: 'Sestřelte Shahedy' },
    questHeavy:          { ua: 'Збити Важких дронів', en: 'Shoot down Heavy Drones', kz: 'Ауыр дрондарды атып түсіру', pl: 'Zestrzel ciężkie drony', cs: 'Sestřelte těžké drony' },
    questRockets:        { ua: 'Збити Ракети', en: 'Shoot down Rockets', kz: 'Зымырандарды атып түсіру', pl: 'Zestrzel rakiety', cs: 'Sestřelte rakety' },
    questKalibrs:        { ua: 'Збити Калібри', en: 'Shoot down Kalibrs', kz: 'Калибрларды атып түсіру', pl: 'Zestrzel Kalibry', cs: 'Sestřelte Kalibry' },
    questClaim:          { ua: 'Забрати', en: 'Claim', kz: 'Алу', pl: 'Odbierz', cs: 'Získat' },
    questClaimed:        { ua: 'Отримано', en: 'Claimed', kz: 'Алынды', pl: 'Odebrano', cs: 'Získáno' },
    questResetsAt:       { ua: 'Оновлення о 00:00', en: 'Resets at 00:00', kz: '00:00-де жаңарады', pl: 'Reset o 00:00', cs: 'Obnovení v 00:00' },
    // Weekly Loyalty
    weeklyLoyalty:       { ua: 'Тижнева вірність', en: 'Weekly Loyalty', kz: 'Апталық адалдық', pl: 'Tygodniowa lojalność', cs: 'Týdenní věrnost' },
    loyaltyDays:         { ua: 'днів', en: 'days', kz: 'күн', pl: 'dni', cs: 'dní' },
    loyaltyHint:         { ua: 'День зараховується якщо забрав щоденну нагороду та виконав усі 3 бойових завдання. Пропущений день скидає прогрес.', en: 'A day counts if you claimed the daily reward and completed all 3 battle quests. Missing a day resets your progress.', kz: 'Күнделікті сыйлықты алып, 3 тапсырманы орындасаңыз, күн есептеледі. Бір күнді өткізіп алу прогресті нөлге шығарады.', pl: 'Dzień jest liczony, jeśli odebrałeś dzienną nagrodę i ukończyłeś wszystkie 3 zadania bojowe. Pominięcie dnia resetuje postęp.', cs: 'Den se počítá, pokud jste si vzali denní odměnu a splnili všechny 3 bojové úkoly. Vynechání dne resetuje postup.' },
    loyaltyClaim:        { ua: 'Забрати', en: 'Claim', kz: 'Алу', pl: 'Odbierz', cs: 'Získat' },
    loyaltyClaimed:      { ua: 'Отримано', en: 'Claimed', kz: 'Алынды', pl: 'Odebrano', cs: 'Získáno' },
    loyaltyLocked:       { ua: 'Недоступно', en: 'Locked', kz: 'Жабық', pl: 'Zablokowane', cs: 'Uzamčeno' },
  },

  // ========================================
  // ТАБЛИЦЯ ЛІДЕРІВ (leaderboard.html)
  // ========================================
  leaderboard: {
    title: { ua: 'Глобальний рейтинг', en: 'Global Leaderboard', kz: 'Жаһандық рейтинг', pl: 'Ranking globalny', cs: 'Globální žebříček' },
    dailyTitle: { ua: 'Щоденний рейтинг', en: 'Daily Leaderboard', kz: 'Күнделікті рейтинг', pl: 'Ranking dzienny', cs: 'Denní žebříček' },
    rank: { ua: '#', en: '#', kz: '#', pl: '#', cs: '#' },
    player: { ua: 'Гравець', en: 'Player', kz: 'Ойыншы', pl: 'Gracz', cs: 'Hráč' },
    wave: { ua: 'Хвиля', en: 'Wave', kz: 'Толқын', pl: 'Fala', cs: 'Vlna' },
    sortBy: { ua: 'Сортувати за', en: 'Sort by', kz: 'Сұрыптау', pl: 'Sortuj według', cs: 'Seřadit podle' },
    sortWave: { ua: 'Хвиля', en: 'Wave', kz: 'Толқын', pl: 'Fala', cs: 'Vlna' },
    sortShaheds: { ua: 'Шахеди', en: 'Shaheds', kz: 'Шахедтер', pl: 'Shahedy', cs: 'Shahedy' },
    sortHeavy: { ua: 'Важкі дрони', en: 'Heavy Drones', kz: 'Ауыр дрондар', pl: 'Ciężkie drony', cs: 'Těžké drony' },
    sortRockets: { ua: 'Ракети', en: 'Rockets', kz: 'Зымырандар', pl: 'Rakiety', cs: 'Rakety' },
    sortKalibrs: { ua: 'Калібри', en: 'Kalibrs', kz: 'Калибрлер', pl: 'Kalibry', cs: 'Kalibry' },
    yourPlace: { ua: 'Твоє місце:', en: 'Your place:', kz: 'Сіздің орныңыз:', pl: 'Twoje miejsce:', cs: 'Vaše místo:' },
    yourPosition: { ua: 'Твоя позиція', en: 'Your position', kz: 'Сіздің позиция', pl: 'Twoja pozycja', cs: 'Vaše pozice' },
    playRanked: { ua: 'Зіграй в ранговому режимі щоб з\'явитись в рейтингу', en: 'Play ranked mode to appear in the leaderboard', kz: 'Рейтингте пайда болу үшін рангілі режимде ойнаңыз' },
    empty: { ua: 'Рейтинг ще порожній. Зіграй першим!', en: 'Leaderboard is empty. Be the first!', kz: 'Рейтинг бос. Бірінші болыңыз!', pl: 'Ranking jest pusty. Bądź pierwszy!', cs: 'Žebříček je prázdný. Buďte první!' },
    loading: { ua: 'Завантаження...', en: 'Loading...', kz: 'Жүктелуде...', pl: 'Ładowanie...', cs: 'Načítání...' },
    loadError: { ua: 'Помилка завантаження рейтингу', en: 'Failed to load leaderboard', kz: 'Рейтингті жүктеу қатесі', pl: 'Nie udało się załadować tabeli wyników', cs: 'Nepodařilo se načíst žebříček' },
    connectionError: { ua: 'Помилка з\'єднання з сервером', en: 'Server connection error', kz: 'Сервермен байланыс қатесі' },
    phase: { ua: 'Фаза', en: 'Phase', kz: 'Фаза', pl: 'Faza', cs: 'Fáze' },
    inTop10: { ua: 'Ви в топ-10! Ваше місце:', en: 'You\'re in top 10! Your place:', kz: 'Сіз топ-10-да! Сіздің орныңыз:' },
    // Дневной лидерборд
    prizes: { ua: 'Призи', en: 'Prizes', kz: 'Жүлделер', pl: 'Nagrody', cs: 'Ceny' },
    atTime: { ua: 'о 23:59 UTC', en: 'at 23:59 UTC', kz: '23:59 UTC', pl: 'o 23:59 UTC', cs: 'v 23:59 UTC' },
    premChests: { ua: 'прем.', en: 'prem.', kz: 'прем.', pl: 'prem.', cs: 'prém.' },
    normChests: { ua: 'звич.', en: 'norm.', kz: 'қар.', pl: 'zw.', cs: 'ob.' },
    legendary: { ua: 'легенд.', en: 'legend.', kz: 'аңыз.', pl: 'legend.', cs: 'legend.' },
    epic: { ua: 'епік.', en: 'epic', kz: 'эпик.', pl: 'epicki', cs: 'epické' },
    rare: { ua: 'рідк.', en: 'rare', kz: 'сирек', pl: 'rzadkie', cs: 'vzácné' },
    participation: { ua: 'за участь', en: 'for participation', kz: 'қатысу үшін', pl: 'za udział', cs: 'za účast' },
    keepPlaying: { ua: 'Продовжуй грати!', en: 'Keep playing!', kz: 'Ойнауды жалғастырыңыз!', pl: 'Graj dalej!', cs: 'Hraj dál!' },
    yourRewards: { ua: 'Твої нагороди!', en: 'Your rewards!', kz: 'Сіздің сыйлықтарыңыз!', pl: 'Twoje nagrody!', cs: 'Vaše odměny!' },
    claimRewards: { ua: 'Забрати нагороди', en: 'Claim rewards', kz: 'Сыйлықтарды алу', pl: 'Odbierz nagrody', cs: 'Vyzvednout odměny' },
    total: { ua: 'Загалом:', en: 'Total:', kz: 'Барлығы:', pl: 'Razem:', cs: 'Celkem:' },
    place1st: { ua: '1 місце', en: '1st place', kz: '1 орын', pl: '1 miejsce', cs: '1. místo' },
    place2nd: { ua: '2 місце', en: '2nd place', kz: '2 орын', pl: '2 miejsce', cs: '2. místo' },
    place3rd: { ua: '3 місце', en: '3rd place', kz: '3 орын', pl: '3 miejsce', cs: '3. místo' }
  },

  // ========================================
  // ДОВІДКА (guide.html)
  // ========================================
  guide: {
    guideTitle: { ua: 'Довідка', en: 'Guide', kz: 'Анықтама', pl: 'Przewodnik', cs: 'Průvodce' },
    tabIntro: { ua: 'Вступ', en: 'Intro', kz: 'Кіріспе', pl: 'Wstęp', cs: 'Úvod' },
    tabPPO: { ua: 'ППО', en: 'ADS', kz: 'ӘШҚҚ', pl: 'OPL', cs: 'PVO' },
    tabEnemies: { ua: 'Вороги', en: 'Enemies', kz: 'Жаулар', pl: 'Wrogowie', cs: 'Nepřátelé' },
    tabBuildings: { ua: "Об'єкти", en: 'Objects', kz: 'Нысандар', pl: 'Obiekty', cs: 'Objekty' },
    tabModes: { ua: 'Режими', en: 'Modes', kz: 'Режимдер', pl: 'Tryby', cs: 'Režimy' },
    aboutGame: { ua: 'Про гру', en: 'About the game', kz: 'Ойын туралы', pl: 'O grze', cs: 'O hře' },
    introP1: { 
      ua: '<span class="highlight">Ви - командир</span>, і від Ваших рішень залежить доля країни. На Ваші плечі лягає оборона від навали ворожих <span class="highlight">Шахедів</span>, <span class="highlight">Важких Дронів</span>, <span class="highlight">Ракет</span> та <span class="highlight">Калібрів</span>. Вони атакують безперервно, націлені на критичну інфраструктуру.',
      en: '<span class="highlight">You are the commander</span>, and the fate of the country depends on your decisions. You must defend against waves of enemy <span class="highlight">Shaheds</span>, <span class="highlight">Heavy Drones</span>, <span class="highlight">Rockets</span> and <span class="highlight">Kalibrs</span>. They attack continuously, targeting critical infrastructure.',
      kz: '<span class="highlight">Сіз - қолбасшысыз</span>, және елдің тағдыры сіздің шешімдеріңізге байланысты. <span class="highlight">Шахедтер</span>, <span class="highlight">Ауыр дрондар</span>, <span class="highlight">Зымырандар</span> және <span class="highlight">Калибрлер</span> толқындарынан қорғану сіздің иығыңызда. Олар үздіксіз шабуылдап, маңызды инфрақұрылымды нысанаға алады.', pl: '<span class="highlight">Jesteś dowódcą</span>, a los kraju zależy od Twoich decyzji. Musisz bronić się przed falami wrogich <span class="highlight">Shahedów</span>, <span class="highlight">Ciężkich dronów</span>, <span class="highlight">Rakiet</span> i <span class="highlight">Kalibrów</span>. Atakują nieprzerwanie, celując w krytyczną infrastrukturę.', cs: '<span class="highlight">Jste velitel</span> a osud země závisí na vašich rozhodnutích. Musíte bránit proti vlnám nepřátelských <span class="highlight">Shahedů</span>, <span class="highlight">Těžkých dronů</span>, <span class="highlight">Raket</span> a <span class="highlight">Kalibrů</span>. Útočí nepřetržitě a cílí na kritickou infrastrukturu.' },
    introP2: { 
      ua: 'У вашому арсеналі - різні <span class="highlight">системи ППО</span>, здатні перехоплювати загрози з повітря. Ви можете купувати та модернізувати їх, щоб створити гнучку й ефективну оборону. Кожен вибір - це можливість зупинити ворога або пропустити удар.',
      en: 'Your arsenal includes various <span class="highlight">air defense systems</span> capable of intercepting aerial threats. You can buy and upgrade them to create flexible and effective defense. Every choice is an opportunity to stop the enemy or miss a hit.',
      kz: 'Сіздің арсеналыңызда әуе қауіптерін ұстауға қабілетті әртүрлі <span class="highlight">ӘҚК жүйелері</span> бар. Икемді және тиімді қорғаныс құру үшін оларды сатып алып, жаңарта аласыз. Әрбір таңдау - жауды тоқтату немесе соққыны жіберіп алу мүмкіндігі.', pl: 'Twój arsenał zawiera różne <span class="highlight">systemy OPL</span> zdolne do przechwytywania zagrożeń powietrznych. Możesz je kupować i ulepszać, aby stworzyć elastyczną i skuteczną obronę.', cs: 'Váš arzenál zahrnuje různé <span class="highlight">systémy PVO</span> schopné zachycovat vzdušné hrozby. Můžete je kupovat a vylepšovat pro vytvoření flexibilní a účinné obrany.' },
    introP3: { 
      ua: '<span class="highlight">Карбованці</span>, зароблені за знищення Дронів та Ракет, потрібно витрачати з розумом: інвестуйте у вдосконалення вже існуючих систем ППО чи купуйте нові. Але пам\'ятайте - ресурсів завжди обмаль, а загроза стає сильнішою з кожною секундою.',
      en: '<span class="highlight">Coins</span> earned for destroying Drones and Rockets must be spent wisely: invest in upgrading existing air defense systems or buy new ones. But remember - resources are always scarce, and the threat grows stronger every second.',
      kz: 'Дрондар мен зымырандарды жою үшін табылған <span class="highlight">тиындарды</span> ақылмен жұмсау керек: бар ӘҚК жүйелерін жаңартуға инвестициялаңыз немесе жаңаларын сатып алыңыз. Бірақ есте сақтаңыз - ресурстар әрқашан жетіспейді, ал қауіп әр секунд сайын күшейеді.'
    },
    introP4: { 
      ua: 'Захистіть усі <span class="highlight">6 стратегічних об\'єктів</span>, які з\'являються у різних областях України. Їх знищення означатиме поразку, а ваша місія - зробити так, щоб цього не сталося.',
      en: 'Protect all <span class="highlight">6 strategic objects</span> that appear in different regions of Ukraine. Their destruction means defeat, and your mission is to prevent that from happening.',
      kz: 'Украинаның әртүрлі аймақтарында пайда болатын барлық <span class="highlight">6 стратегиялық нысанды</span> қорғаңыз. Олардың жойылуы жеңіліс дегенді білдіреді, ал сіздің міндетіңіз - оған жол бермеу.'
    },
    tips: { ua: 'Поради', en: 'Tips', kz: 'Кеңестер', pl: 'Porady', cs: 'Tipy' },
    tip1: { ua: 'Почніть з <span class="highlight">3500 Карбованців</span>', en: 'Start with <span class="highlight">3500 Coins</span>', kz: '<span class="highlight">3500 тиынмен</span> бастаңыз', pl: 'Zacznij z <span class="highlight">3500 monetami</span>', cs: 'Začněte s <span class="highlight">3500 mincemi</span>' },
    tip2: { ua: 'Ціна ППО зростає з кожною покупкою на <span class="highlight">20%</span>', en: 'Air defense price increases by <span class="highlight">20%</span> with each purchase', kz: 'ӘҚК бағасы әр сатып алу сайын <span class="highlight">20%</span>-ға артады', pl: 'Cena OPL wzrasta o <span class="highlight">20%</span> przy każdym zakupie', cs: 'Cena PVO se zvyšuje o <span class="highlight">20%</span> s každým nákupem' },
    tip3: { ua: 'Покращуйте системи ППО до <span class="highlight">10 рівня</span>', en: 'Upgrade air defense systems up to <span class="highlight">level 10</span>', kz: 'ӘҚК жүйелерін <span class="highlight">10 деңгейге</span> дейін жаңартыңыз', pl: 'Ulepszaj systemy OPL do <span class="highlight">poziomu 10</span>', cs: 'Vylepšujte systémy PVO až na <span class="highlight">úroveň 10</span>' },
    tip4: { ua: 'Продавайте непотрібне ППО за <span class="highlight">75%</span> від вартості', en: 'Sell unnecessary air defense for <span class="highlight">75%</span> of the cost', kz: 'Қажетсіз ӘҚК-ны құнының <span class="highlight">75%</span>-ына сатыңыз', pl: 'Sprzedawaj niepotrzebne OPL za <span class="highlight">75%</span> ceny', cs: 'Prodávejte nepotřebné PVO za <span class="highlight">75%</span> ceny' },
    ppoSystems: { ua: 'Системи ППО', en: 'ADS Systems', kz: 'ӘШҚҚ жүйелері', pl: 'Systemy OPL', cs: 'Systémy PVO' },
    filterAll: { ua: 'Всі', en: 'All', kz: 'Барлығы', pl: 'Wszystkie', cs: 'Vše' },
    filterCommon: { ua: 'Звичайні', en: 'Common', kz: 'Қарапайым', pl: 'Zwykłe', cs: 'Běžné' },
    filterRare: { ua: 'Рідкісні', en: 'Rare', kz: 'Сирек', pl: 'Rzadkie', cs: 'Vzácné' },
    filterEpic: { ua: 'Епічні', en: 'Epic', kz: 'Эпикалық', pl: 'Epickie', cs: 'Epické' },
    filterLegendary: { ua: 'Легендарні', en: 'Legendary', kz: 'Аңызшылық', pl: 'Legendarne', cs: 'Legendární' },
    enemies: { ua: 'Вороги', en: 'Enemies', kz: 'Жаулар', pl: 'Wrogowie', cs: 'Nepřátelé' },
    strategicObjects: { ua: 'Стратегічні об\'єкти', en: 'Strategic Objects', kz: 'Стратегиялық нысандар' },
    infrastructure: { ua: 'Інфраструктура (для захисту)', en: 'Infrastructure (to protect)', kz: 'Инфрақұрылым (қорғау үшін)', pl: 'Infrastruktura (do ochrony)', cs: 'Infrastruktura (k ochraně)' },
    buildingsForBuild: { ua: 'Будівлі (для будівництва)', en: 'Buildings (to build)', kz: 'Ғимараттар (салу үшін)', pl: 'Budynki (do budowy)', cs: 'Budovy (ke stavbě)' },
    gameModes: { ua: 'Режими гри', en: 'Game Modes', kz: 'Ойын режимдері', pl: 'Tryby gry', cs: 'Herní režimy' },
    modeCircular: { ua: 'Кругова оборона', en: 'Circular Defense', kz: 'Шеңберлі қорғаныс', pl: 'Obrona okrężna', cs: 'Kruhová obrana' },
    modeCircularDesc: { ua: 'Класичний сценарій, де атаки йдуть з усіх боків. Ви маєте витримати 35 хвиль постійного тиску та зберегти контроль над небом.', en: 'Classic scenario where attacks come from all sides. You must withstand 35 waves of constant pressure and maintain control of the sky.', kz: 'Барлық жақтан шабуылдар келетін классикалық сценарий. Сіз 35 толқынның тұрақты қысымына төтеп беріп, аспанды бақылауда ұстауыңыз керек.', pl: 'Klasyczny scenariusz, w którym ataki nadchodzą ze wszystkich stron. Musisz wytrzymać 35 fal ciągłej presji i utrzymać kontrolę nad niebem.', cs: 'Klasický scénář, kde útoky přicházejí ze všech stran. Musíte vydržet 35 vln neustálého tlaku a udržet kontrolu nad nebem.' },
    modeRussia: { ua: 'Проти росії', en: 'Against russia', kz: 'Ресейге қарсы', pl: 'Przeciw rosji', cs: 'Proti rusku' },
    modeRussiaDesc: { ua: 'Реалістичний режим з фокусом на східному напрямку. Нові стратегічні об\'єкти поступово з\'являються у різних областях України, а Ваша задача - втримати оборону.', en: 'Realistic mode focusing on the eastern direction. New strategic objects gradually appear in different regions of Ukraine, and your task is to hold the defense.', kz: 'Шығыс бағытына бағытталған шынайы режим. Украинаның әртүрлі аймақтарында жаңа стратегиялық нысандар біртіндеп пайда болады, ал сіздің міндетіңіз - қорғанысты ұстап тұру.' },
    modeHardcore: { ua: 'Хардкор', en: 'Hardcore', kz: 'Хардкор', pl: 'Hardcore', cs: 'Hardcore' },
    modeHardcoreDesc: { ua: 'Для тих, хто готовий прийняти виклик. Ліміт у 35 систем ППО. Нескінченна кількість хвиль. Тут немає права на помилку.', en: 'For those ready to accept the challenge. Limit of 35 air defense systems. Infinite number of waves. No room for error here.', kz: 'Сын-қатерді қабылдауға дайын адамдарға арналған. 35 ӘҚК жүйесі шектеуі. Толқындардың шексіз саны. Мұнда қатеге орын жоқ.', pl: 'Dla tych, którzy są gotowi przyjąć wyzwanie. Limit 35 systemów OPL. Nieskończona liczba fal. Nie ma miejsca na błąd.', cs: 'Pro ty, kteří jsou připraveni přijmout výzvu. Limit 35 systémů PVO. Nekonečný počet vln. Není místo pro chybu.' },
    modeRadar: { ua: 'Радар', en: 'Radar', kz: 'Радар', pl: 'Radar', cs: 'Radar' },
    modeRadarDesc: { ua: 'Особливий режим, де вороги залишаються невидимими. Використовуйте Радари для виявлення Дронів та Ракет. Це випробування на уважність та вміння працювати на випередження.', en: 'Special mode where enemies remain invisible. Use Radars to detect Drones and Rockets. This is a test of attention and ability to work ahead.', kz: 'Жаулар көрінбейтін арнайы режим. Дрондар мен зымырандарды анықтау үшін радарларды пайдаланыңыз. Бұл зейінділік пен алдын ала жұмыс істеу қабілетін сынау.', pl: 'Specjalny tryb, w którym wrogowie pozostają niewidzialni. Używaj radarów do wykrywania dronów i rakiet. To test uwagi i umiejętności pracy z wyprzedzeniem.', cs: 'Speciální režim, kde nepřátelé zůstávají neviditelní. Používejte radary k detekci dronů a raket. Je to test pozornosti a schopnosti pracovat s předstihem.' },
    modeSandbox: { ua: 'SandBox', en: 'SandBox', kz: 'SandBox', pl: 'SandBox', cs: 'SandBox' },
    modeSandboxDesc: { ua: 'Простір для експериментів. Жодних обмежень - нескінченні ресурси, можливість тестувати різні стратегії та комбінації ППО.', en: 'Space for experiments. No restrictions - infinite resources, ability to test various strategies and air defense combinations.', kz: 'Эксперименттерге арналған кеңістік. Шектеусіз - шексіз ресурстар, әртүрлі стратегиялар мен ӘҚК комбинацияларын сынау мүмкіндігі.', pl: 'Przestrzeń do eksperymentów. Bez ograniczeń - nieskończone zasoby, możliwość testowania różnych strategii i kombinacji OPL.', cs: 'Prostor pro experimenty. Žádná omezení - nekonečné zdroje, možnost testovat různé strategie a kombinace PVO.' },
    modeRanked: { ua: 'Глобальний рейтинг', en: 'Global Ranking', kz: 'Жаһандық рейтинг', pl: 'Ranking globalny', cs: 'Globální žebříček' },
    modeRankedDesc: { ua: 'Змагайтесь з іншими гравцями! Ваші покращення ППО зберігаються та впливають на бій. Потрібна реєстрація. Прокачуйте картки ППО та підіймайтесь у рейтингу!', en: 'Compete with other players! Your air defense upgrades are saved and affect battle. Registration required. Level up your air defense cards and climb the rankings!', kz: 'Басқа ойыншылармен жарысыңыз! Сіздің ӘҚК жақсартуларыңыз сақталады және ұрысқа әсер етеді. Тіркелу қажет. ӘҚК карталарын дамытып, рейтингте көтеріліңіз!', pl: 'Rywalizuj z innymi graczami! Twoje ulepszenia OPL są zapisywane i wpływają na bitwę. Wymagana rejestracja. Rozwijaj karty OPL i wspinaj się w rankingu!', cs: 'Soutěžte s ostatními hráči! Vaše vylepšení PVO se ukládají a ovlivňují bitvu. Vyžadována registrace. Vylepšujte karty PVO a stoupejte v žebříčku!' },
    // Статистика карток
    price: { ua: 'Ціна', en: 'Price', kz: 'Бағасы', pl: 'Cena', cs: 'Cena' },
    damage: { ua: 'Урон', en: 'Damage', kz: 'Зақым', pl: 'Obrażenia', cs: 'Poškození' },
    radius: { ua: 'Радіус', en: 'Radius', kz: 'Радиус', pl: 'Zasięg', cs: 'Dosah' },
    cooldown: { ua: 'Перезарядка', en: 'Cooldown', kz: 'Қайта зарядтау', pl: 'Przeładowanie', cs: 'Přebíjení' },
    hitChance: { ua: 'Шанс влучання', en: 'Hit Chance', kz: 'Тию мүмкіндігі', pl: 'Szansa trafienia', cs: 'Šance na zásah' },
    projectileSpeed: { ua: 'Швидкість ракети', en: 'Projectile Speed', kz: 'Снаряд жылдамдығы', pl: 'Prędkość pocisku', cs: 'Rychlost střely' },
    targets: { ua: 'Цілі', en: 'Targets', kz: 'Нысандар', pl: 'Cele', cs: 'Cíle' },
    // Цілі
    shaheds: { ua: 'Шахеди', en: 'Shaheds', kz: 'Шахедтер', pl: 'Shahedy', cs: 'Shahedy' },
    heavyDrones: { ua: 'Важкі дрони', en: 'Heavy Drones', kz: 'Ауыр дрондар', pl: 'Ciężkie drony', cs: 'Těžké drony' },
    rockets: { ua: 'Ракети', en: 'Rockets', kz: 'Зымырандар', pl: 'Rakiety', cs: 'Rakety' },
    calibers: { ua: 'Калібри', en: 'Kalibrs', kz: 'Калибрлер', pl: 'Kalibry', cs: 'Kalibry' },
    cruiser: { ua: 'Крейсер', en: 'Cruiser', kz: 'Крейсер', pl: 'Krążownik', cs: 'Křižník' },
    // Рідкості
    common: { ua: 'Звичайний', en: 'Common', kz: 'Қарапайым', pl: 'Zwykły', cs: 'Běžný' },
    rare: { ua: 'Рідкісний', en: 'Rare', kz: 'Сирек', pl: 'Rzadki', cs: 'Vzácný' },
    epic: { ua: 'Епічний', en: 'Epic', kz: 'Эпикалық', pl: 'Epicki', cs: 'Epický' },
    legendary: { ua: 'Легендарний', en: 'Legendary', kz: 'Аңызшылық', pl: 'Legendarny', cs: 'Legendární' },
    // Вороги
    appearsFromWave: { ua: 'З\'являється з хвилі', en: 'Appears from wave', kz: 'Толқыннан бастап пайда болады' },
    baseHP: { ua: 'Базове HP', en: 'Base HP', kz: 'Базалық HP', pl: 'Bazowe HP', cs: 'Základní HP' },
    baseSpeed: { ua: 'Базова швидкість', en: 'Base Speed', kz: 'Базалық жылдамдық', pl: 'Bazowa prędkość', cs: 'Základní rychlost' },
    damageToTarget: { ua: 'Урон по цілі', en: 'Damage to target', kz: 'Нысанаға зақым', pl: 'Obrażenia celu', cs: 'Poškození cíle' },
    reward: { ua: 'Нагорода', en: 'Reward', kz: 'Сыйлық', pl: 'Nagroda', cs: 'Odměna' },
    // Будівлі
    produces: { ua: 'Виробляє', en: 'Produces', kz: 'Өндіреді', pl: 'Produkuje', cs: 'Vyrábí' },
    interval: { ua: 'Інтервал', en: 'Interval', kz: 'Аралық', pl: 'Interwał', cs: 'Interval' },
    cost: { ua: 'Вартість', en: 'Cost', kz: 'Құны', pl: 'Koszt', cs: 'Cena' },
    buildTime: { ua: 'Будівництво', en: 'Build time', kz: 'Құрылыс уақыты', pl: 'Czas budowy', cs: 'Doba stavby' },
    feature: { ua: 'Особливість', en: 'Feature', kz: 'Ерекшелігі', pl: 'Cecha', cs: 'Funkce' },
    energy: { ua: 'Енергію', en: 'Energy', kz: 'Энергия', pl: 'Energię', cs: 'Energii' },
    fuel: { ua: 'Пальне', en: 'Fuel', kz: 'Жанармай', pl: 'Paliwo', cs: 'Palivo' },
    bricks: { ua: 'Цеглу', en: 'Bricks', kz: 'Кірпіш', pl: 'Cegły', cs: 'Cihly' },
    everyNsec: { ua: 'Кожні {n} секунд виробляє {m} ресурс', en: 'Produces {m} resource every {n} seconds', kz: 'Әр {n} секунд сайын {m} ресурс өндіреді', pl: 'Produkuje {m} zasób co {n} sekund', cs: 'Vyrábí {m} zdroj každých {n} sekund' },
    // Спецможливості ППО
    slowsEnemies: { ua: 'Уповільнює ворогів', en: 'Slows enemies', kz: 'Жауларды баяулатады', pl: 'Spowalnia wrogów', cs: 'Zpomaluje nepřátele' },
    detectsEnemies: { ua: 'Виявляє ворогів у радіусі', en: 'Detects enemies in radius', kz: 'Радиуста жауларды анықтайды', pl: 'Wykrywa wrogów w zasięgu', cs: 'Detekuje nepřátele v dosahu' },
    mobileUnit: { ua: 'Мобільна одиниця', en: 'Mobile unit', kz: 'Мобильді бірлік', pl: 'Jednostka mobilna', cs: 'Mobilní jednotka' },
    
    // ========================================
    // СТАРІ КЛЮЧІ ДЛЯ helpModal
    // ========================================
    title: { ua: '📚 ДОВІДКА', en: '📚 GUIDE', kz: '📚 АНЫҚТАМА', pl: '📚 PRZEWODNIK', cs: '📚 PRŮVODCE' },
    
    // Секція ППО
    ppoTitle: { ua: '🛡️ СИСТЕМИ ППО', en: '🛡️ AIR DEFENSE SYSTEMS', kz: '🛡️ ӘУЕ ҚОРҒАНЫСЫ ЖҮЙЕЛЕРІ', pl: '🛡️ AIR DEFENSE SYSTEMS', cs: '🛡️ AIR DEFENSE SYSTEMS' },
    ppoDescription: { ua: 'Ваші основні засоби захисту від повітряних загроз:', en: 'Your main means of protection against air threats:', kz: 'Әуе қауіптерінен қорғаудың негізгі құралдары:', pl: 'Twoje główne środki ochrony przed zagrożeniami powietrznymi:', cs: 'Vaše hlavní prostředky ochrany proti vzdušným hrozbám:' },
    
    nameColumn: { ua: 'Назва', en: 'Name', kz: 'Атауы', pl: 'Name', cs: 'Name' },
    damageColumn: { ua: 'Урон', en: 'Damage', kz: 'Зиян', pl: 'Obrażenia', cs: 'Poškození' },
    rangeColumn: { ua: 'Радіус', en: 'Range', kz: 'Радиус', pl: 'Zasięg', cs: 'Dosah' },
    reloadColumn: { ua: 'Перезар.', en: 'Reload', kz: 'Қайта жүктеу', pl: 'Przeładowanie', cs: 'Přebíjení' },
    costColumn: { ua: 'Ціна', en: 'Cost', kz: 'Бағасы', pl: 'Koszt', cs: 'Cena' },
    targetsColumn: { ua: 'Цілі', en: 'Targets', kz: 'Мақсаттар', pl: 'Cele', cs: 'Cíle' },
    
    // Секція ворогів
    enemiesTitle: { ua: '👾 ВОРОГИ', en: '👾 ENEMIES', kz: '👾 ЖАУЛАР', pl: '👾 ENEMIES', cs: '👾 ENEMIES' },
    enemiesDescription: { ua: 'Типи ворожих цілей, які атакують ваші об\'єкти:', en: 'Types of enemy targets attacking your objects:', kz: 'Нысандарыңызға шабуыл жасайтын жау мақсаттарының түрлері:' },
    
    hpColumn: { ua: 'HP', en: 'HP', kz: 'HP', pl: 'HP', cs: 'HP' },
    speedColumn: { ua: 'Швидкість', en: 'Speed', kz: 'Жылдамдық', pl: 'Prędkość', cs: 'Rychlost' },
    threatColumn: { ua: 'Загроза', en: 'Threat', kz: 'Қауіп', pl: 'Threat', cs: 'Threat' },
    
    shahedDesc: { ua: 'Легкий, повільний, масовий', en: 'Light, slow, massive', kz: 'Жеңіл, баяу, көп', pl: 'Light, slow, massive', cs: 'Light, slow, massive' },
    heavyDroneDesc: { ua: 'Міцний, середня швидкість', en: 'Durable, medium speed', kz: 'Берік, орташа жылдамдық', pl: 'Durable, medium speed', cs: 'Durable, medium speed' },
    rocketDesc: { ua: 'Швидка, небезпечна', en: 'Fast, dangerous', kz: 'Жылдам, қауіпті', pl: 'Fast, dangerous', cs: 'Fast, dangerous' },
    kalibrDesc: { ua: 'Дуже швидкий, смертоносний', en: 'Very fast, deadly', kz: 'Өте жылдам, өлімшіл', pl: 'Very fast, deadly', cs: 'Very fast, deadly' },
    
    // Секція будівель
    buildingsTitle: { ua: '🏗️ БУДІВЛІ', en: '🏗️ BUILDINGS', kz: '🏗️ ҒИМАРАТТАР', pl: '🏗️ BUILDINGS', cs: '🏗️ BUILDINGS' },
    buildingsDescription: { ua: 'Об\'єкти, які потрібно захищати та які виробляють ресурси:', en: 'Objects to protect that produce resources:', kz: 'Қорғалатын және ресурстар өндіретін нысандар:' },
    
    tecDesc: { ua: 'Виробляє енергію ⚡', en: 'Produces power ⚡', kz: 'Энергия өндіреді ⚡', pl: 'Produkuje energię ⚡', cs: 'Vyrábí energii ⚡' },
    gesDesc: { ua: 'Виробляє паливо ⛽', en: 'Produces fuel ⛽', kz: 'Жанармай өндіреді ⛽', pl: 'Produkuje paliwo ⛽', cs: 'Vyrábí palivo ⛽' },
    factoryDesc: { ua: 'Виробляє цеглу 🧱', en: 'Produces bricks 🧱', kz: 'Кірпіш өндіреді 🧱', pl: 'Produkuje cegły 🧱', cs: 'Vyrábí cihly 🧱' },
    airportDesc: { ua: 'База для авіації', en: 'Aviation base', kz: 'Авиация базасы', pl: 'Baza lotnicza', cs: 'Letecká základna' },
    
    // Секція ресурсів
    resourcesTitle: { ua: '📦 РЕСУРСИ', en: '📦 RESOURCES', kz: '📦 РЕСУРСТАР', pl: '📦 RESOURCES', cs: '📦 RESOURCES' },
    resourcesDescription: { ua: 'Ресурси, необхідні для будівництва та операцій:', en: 'Resources needed for construction and operations:', kz: 'Құрылыс және операциялар үшін қажетті ресурстар:', pl: 'Resources needed for construction and operations:', cs: 'Resources needed for construction and operations:' },
    
    moneyDesc: { ua: 'Основна валюта для покупок', en: 'Main currency for purchases', kz: 'Сатып алу үшін негізгі валюта', pl: 'Main currency for purchases', cs: 'Main currency for purchases' },
    powerDesc: { ua: 'Потрібна для ППО', en: 'Needed for air defense', kz: 'Әуе қорғанысы үшін қажет', pl: 'Needed for air defense', cs: 'Needed for air defense' },
    fuelDesc: { ua: 'Потрібно для авіації', en: 'Needed for aviation', kz: 'Авиация үшін қажет', pl: 'Needed for aviation', cs: 'Needed for aviation' },
    bricksDesc: { ua: 'Для будівництва та ремонту', en: 'For construction and repair', kz: 'Құрылыс және жөндеу үшін', pl: 'For construction and repair', cs: 'For construction and repair' },
    
    // Поради для helpModal
    tipsTitle: { ua: '💡 ПОРАДИ', en: '💡 TIPS', kz: '💡 КЕҢЕСТЕР', pl: '💡 TIPS', cs: '💡 TIPS' },
    helpTip1: { ua: 'Розміщуйте ППО так, щоб їх радіуси перекривались', en: 'Place air defense so their ranges overlap', kz: 'Әуе қорғанысын олардың радиустары қабаттасатындай орналастырыңыз', pl: 'Place air defense so their ranges overlap', cs: 'Place air defense so their ranges overlap' },
    helpTip2: { ua: 'Захищайте будівлі, що виробляють ресурси', en: 'Protect buildings that produce resources', kz: 'Ресурс өндіретін ғимараттарды қорғаңыз', pl: 'Protect buildings that produce resources', cs: 'Protect buildings that produce resources' },
    helpTip3: { ua: 'Використовуйте РЕБ для сповільнення ворогів', en: 'Use EW to slow down enemies', kz: 'Жауларды баяулату үшін ЭБ қолданыңыз', pl: 'Use EW to slow down enemies', cs: 'Use EW to slow down enemies' },
    helpTip4: { ua: 'Літаки ефективні проти великих груп', en: 'Aircraft are effective against large groups', kz: 'Ұшақтар үлкен топтарға қарсы тиімді', pl: 'Aircraft are effective against large groups', cs: 'Aircraft are effective against large groups' },
    helpTip5: { ua: 'Калібри - найнебезпечніші, збивайте їх першими', en: 'Kalibrs are most dangerous, shoot them first', kz: 'Калибрлер ең қауіпті, оларды бірінші атыңыз', pl: 'Kalibrs are most dangerous, shoot them first', cs: 'Kalibrs are most dangerous, shoot them first' }
  },

  // СУНДУКИ (chest.html, inventory_chest.html)
  // ========================================
  chest: {
    title: { ua: 'СУНДУК', en: 'CHEST', kz: 'САНДЫҚ', pl: 'SKRZYNIA', cs: 'TRUHLA' },
    clickToOpen: { ua: 'Натисни щоб відкрити!', en: 'Click to open!', kz: 'Ашу үшін басыңыз!', pl: 'Kliknij, aby otworzyć!', cs: 'Klikněte pro otevření!' },
    clickToReceive: { ua: 'Клікни щоб отримати!', en: 'Click to receive!', kz: 'Алу үшін басыңыз!', pl: 'Kliknij, aby odebrać!', cs: 'Klikněte pro získání!' },
    openAgain: { ua: 'Відкрити ще', en: 'Open Again', kz: 'Тағы ашу', pl: 'Otwórz ponownie', cs: 'Otevřít znovu' },
    back: { ua: 'Назад', en: 'Back', kz: 'Артқа', pl: 'Wstecz', cs: 'Zpět' },
    backToInventory: { ua: 'Назад до інвентаря', en: 'Back to Inventory', kz: 'Инвентарьға оралу', pl: 'Wróć do ekwipunku', cs: 'Zpět do inventáře' },
    youGot: { ua: 'Ви отримали:', en: 'You got:', kz: 'Сіз алдыңыз:', pl: 'Otrzymałeś:', cs: 'Získali jste:' },
    normal: { ua: 'Звичайний', en: 'Normal', kz: 'Қарапайым', pl: 'Zwykły', cs: 'Běžný' },
    premium: { ua: 'Преміум', en: 'Premium', kz: 'Премиум', pl: 'Premium', cs: 'Premium' }
  },

  // ========================================
  // НАГОРОДА ЗА РЕЄСТРАЦІЮ
  // ========================================
  registrationReward: {
    title: { ua: 'Вітальний подарунок!', en: 'Welcome Gift!', kz: 'Сәлемдесу сыйлығы!', pl: 'Prezent powitalny!', cs: 'Uvítací dárek!' },
    thanks: { ua: 'Дякуємо за реєстрацію в DroneFall!', en: 'Thanks for registering in DroneFall!', kz: 'DroneFall-да тіркелгеніңіз үшін рахмет!', pl: 'Dziękujemy za rejestrację w DroneFall!', cs: 'Děkujeme za registraci v DroneFall!' },
    normalChest: { ua: 'Звичайний сундук', en: 'Normal Chest', kz: 'Қарапайым сандық', pl: 'Zwykła skrzynia', cs: 'Běžná truhla' },
    premiumChest: { ua: 'Преміум сундук', en: 'Premium Chest', kz: 'Премиум сандық', pl: 'Skrzynia Premium', cs: 'Prémiová truhla' },
    cards: { ua: 'карток', en: 'cards', kz: 'карточка', pl: 'kart', cs: 'karet' },
    claim: { ua: 'Забрати нагороду', en: 'Claim Reward', kz: 'Сыйлықты алу', pl: 'Odbierz nagrodę', cs: 'Vyzvednout odměnu' }
  },

  // ========================================
  // ГОЛОВНЕ МЕНЮ (index.html)
  // ========================================
  menu: {
    title: { ua: 'DroneFall: UA Defense', en: 'DroneFall: UA Defense', kz: 'DroneFall: UA Defense', pl: 'DroneFall: UA Defense', cs: 'DroneFall: UA Defense' },
    aiNote: { ua: '🧠 Ця гра створена за допомогою штучного інтелекту', en: '🧠 This game was created with artificial intelligence', kz: '🧠 Бұл ойын жасанды интеллект арқылы жасалған', pl: '🧠 Ta gra została stworzona przy pomocy sztucznej inteligencji', cs: '🧠 Tato hra byla vytvořena pomocí umělé inteligence' },
    readMore: { ua: 'ЧИТАТИ ДАЛІ', en: 'READ MORE', kz: 'ТОЛЫҒЫРАҚ ОҚУ', pl: 'CZYTAJ WIĘCEJ', cs: 'ČÍST VÍCE' },
    collapse: { ua: 'ЗГОРНУТИ', en: 'COLLAPSE', kz: 'ЖИЮ', pl: 'ZWIŃ', cs: 'SBALIT' },
    tutorial: { ua: 'Туторіал', en: 'Tutorial', kz: 'Оқулық', pl: 'Samouczek', cs: 'Tutoriál' },
    guide: { ua: 'Довідка', en: 'Guide', kz: 'Анықтама', pl: 'Przewodnik', cs: 'Průvodce' },
    mode: { ua: 'РЕЖИМ:', en: 'MODE:', kz: 'РЕЖИМ:', pl: 'TRYB:', cs: 'REŽIM:' },
    selectMode: { ua: 'ОБЕРІТЬ РЕЖИМ', en: 'SELECT MODE', kz: 'РЕЖИМДІ ТАҢДАҢЫЗ', pl: 'WYBIERZ TRYB', cs: 'VYBRAT REŽIM' },
    toBattle: { ua: 'ДО БОЮ', en: 'TO BATTLE', kz: 'ШАЙҚАСҚА', pl: 'DO BITWY', cs: 'DO BITVY' },
    donate: { ua: 'Підтримати проєкт', en: 'Support Project', kz: 'Жобаны қолдау', pl: 'Wesprzyj projekt', cs: 'Podpořit projekt' }
  },

  // ========================================
  // РЕЖИМИ ГРИ
  // ========================================
  modes: {
    tutorial: { ua: 'Туторіал', en: 'Tutorial', kz: 'Оқулық', pl: 'Samouczek', cs: 'Tutoriál' },
    circular: { ua: 'Кругова оборона', en: 'Circular Defense', kz: 'Дөңгелек қорғаныс', pl: 'Obrona okrężna', cs: 'Kruhová obrana' },
    againstRussia: { ua: 'Проти росії', en: 'Against russia', kz: 'ресейге қарсы', pl: 'Przeciw rosji', cs: 'Proti rusku' },
    hardcore: { ua: 'Хардкор', en: 'Hardcore', kz: 'Хардкор', pl: 'Hardcore', cs: 'Hardcore' },
    radar: { ua: 'Радар', en: 'Radar', kz: 'Радар', pl: 'Radar', cs: 'Radar' },
    sandbox: { ua: 'SandBox', en: 'SandBox', kz: 'SandBox', pl: 'SandBox', cs: 'SandBox' },
    ranked: { ua: 'Глобальний рейтинг', en: 'Global Ranking', kz: 'Жаһандық рейтинг', pl: 'Ranking globalny', cs: 'Globální žebříček' }
  },

  // ========================================
  // ОПИС ГРИ
  // ========================================
  description: {
    preview: {
      ua: 'DroneFall - це стратегічна гра про захист українського неба, у якій Ви берете на себе відповідальність управління мобільними групами, системами протиповітряної оборони та бойовою авіацією, щоб зупиняти хвилі ворожих дронів і ракет.',
      en: 'DroneFall is a strategic game about defending Ukrainian skies, where you take responsibility for managing mobile groups, air defense systems, and combat aviation to stop waves of enemy drones and missiles.',
      kz: 'DroneFall - бұл Украина аспанын қорғау туралы стратегиялық ойын, онда сіз жау дронтары мен зымырандарының толқындарын тоқтату үшін мобильді топтарды, әуе қорғанысы жүйелерін және жауынгер авиацияны басқару жауапкершілігін аласыз.',
      pl: 'DroneFall to strategiczna gra o obronie ukraińskiego nieba, w której bierzesz odpowiedzialność za zarządzanie grupami mobilnymi, systemami obrony przeciwlotniczej i lotnictwem bojowym, aby powstrzymać fale wrogich dronów i rakiet.',
      cs: 'DroneFall je strategická hra o obraně ukrajinského nebe, kde přebíráte odpovědnost za řízení mobilních skupin, systémů protivzdušné obrany a bojového letectva, abyste zastavili vlny nepřátelských dronů a raket.' },
    paragraph1: {
      ua: 'це стратегічна гра про захист українського неба, у якій Ви берете на себе відповідальність управління мобільними групами, системами протиповітряної оборони та бойовою авіацією, щоб зупиняти хвилі ворожих дронів і ракет. Кожне Ваше рішення - це збитий шахед, кожна Ваша дія - укріплена позиція, кожна установка, розміщена на полі бою, - ще один крок до стабільної оборони.',
      en: 'is a strategic game about defending Ukrainian skies, where you take responsibility for managing mobile groups, air defense systems, and combat aviation to stop waves of enemy drones and missiles. Every decision you make is a downed Shahed, every action you take is a fortified position, every installation placed on the battlefield is another step toward stable defense.',
      kz: '- бұл Украина аспанын қорғау туралы стратегиялық ойын, онда сіз жау дронтары мен зымырандарының толқындарын тоқтату үшін мобильді топтарды, әуе қорғанысы жүйелерін және жауынгер авиацияны басқару жауапкершілігін аласыз. Сіздің әрбір шешіміңіз - құлаған Шахед, әрбір әрекетіңіз - нығайтылған позиция.',
      pl: 'to strategiczna gra o obronie ukraińskiego nieba, w której bierzesz odpowiedzialność za zarządzanie grupami mobilnymi, systemami obrony przeciwlotniczej i lotnictwem bojowym, aby powstrzymać fale wrogich dronów i rakiet. Każda Twoja decyzja to zestrzelony Shahed, każde Twoje działanie to umocniona pozycja, każda instalacja umieszczona na polu bitwy to kolejny krok ku stabilnej obronie.',
      cs: 'je strategická hra o obraně ukrajinského nebe, kde přebíráte odpovědnost za řízení mobilních skupin, systémů protivzdušné obrany a bojového letectva, abyste zastavili vlny nepřátelských dronů a raket. Každé vaše rozhodnutí je sestřelený Shahed, každá vaše akce je opevněná pozice, každá instalace umístěná na bojišti je dalším krokem ke stabilní obraně.' },
    paragraph2: {
      ua: 'Гра передає атмосферу роботи реального командира, який отримує інформацію про повітряну обстановку та має реагувати на загрозу негайно. Ворог діє безперервно, запускаючи різні типи безпілотників і ракет. На початку Ви маєте обмежені ресурси і змушені діяти раціонально, стримуючи перші хвилі атаки.',
      en: 'The game conveys the atmosphere of a real commander who receives information about the air situation and must respond to threats immediately. The enemy acts continuously, launching various types of drones and missiles. At the beginning, you have limited resources and must act rationally, holding back the first waves of attack.',
      kz: 'Ойын әуе жағдайы туралы ақпарат алатын және қауіп-қатерге дереу жауап беруі тиіс нағыз командирдің атмосферасын жеткізеді. Жау үздіксіз әрекет етеді, әртүрлі дрондар мен зымырандарды ұшырады.',
      pl: 'Gra oddaje atmosferę pracy prawdziwego dowódcy, który otrzymuje informacje o sytuacji powietrznej i musi natychmiast reagować na zagrożenia. Wróg działa nieprzerwanie, wystrzeliwując różne typy dronów i rakiet. Na początku masz ograniczone zasoby i musisz działać racjonalnie, powstrzymując pierwsze fale ataku.',
      cs: 'Hra přenáší atmosféru skutečného velitele, který dostává informace o vzdušné situaci a musí okamžitě reagovat na hrozby. Nepřítel jedná nepřetržitě a vypouští různé typy dronů a raket. Na začátku máte omezené zdroje a musíte jednat racionálně, zadržovat první vlny útoku.' },
    paragraph3: {
      ua: 'Ворог уже на підльоті, і у Вас немає права на зволікання. Ви визначаєте, де саме розміщувати комплекси, які цілі є пріоритетними, які позиції потребують підсилення, а які можуть витримати наступ.',
      en: 'The enemy is already approaching, and you have no right to delay. You determine where to place complexes, which targets are priority, which positions need reinforcement, and which can withstand the assault.',
      kz: 'Жау әлдеқашан жақындап келеді және сізде кідірісті түсіру құқығы жоқ. Сіз кешендерді қайда орналастыру керектігін, қандай мақсаттар басымдық екенін анықтайсыз.',
      pl: 'Wróg już się zbliża i nie masz prawa zwlekać. Określasz, gdzie umieścić kompleksy, które cele są priorytetowe, które pozycje wymagają wzmocnienia, a które mogą wytrzymać atak.',
      cs: 'Nepřítel se už blíží a nemáte právo otálet. Určujete, kde umístit komplexy, které cíle jsou prioritní, které pozice potřebují posílení a které vydrží útok.' },
    paragraph4: {
      ua: 'Попри інтенсивність, гра дає відчуття контролю та чіткої структури. Ви бачите, як побудована Вами система працює в реальному часі, перехоплюючи ракети, знищуючи рої дронів і закриваючи прогалини в обороні.',
      en: 'Despite the intensity, the game gives a sense of control and clear structure. You see how your built system works in real-time, intercepting missiles, destroying swarms of drones, and closing gaps in defense.',
      kz: 'Қарқындылығына қарамастан, ойын бақылау және нақты құрылым сезімін береді. Сіз өзіңіз құрған жүйе нақты уақытта қалай жұмыс істейтінін көресіз.',
      pl: 'Pomimo intensywności, gra daje poczucie kontroli i jasnej struktury. Widzisz, jak zbudowany przez Ciebie system działa w czasie rzeczywistym, przechwytując rakiety, niszcząc roje dronów i zamykając luki w obronie.',
      cs: 'Navzdory intenzitě hra dává pocit kontroly a jasné struktury. Vidíte, jak vámi postavený systém funguje v reálném čase, zachycuje rakety, ničí roje dronů a uzavírá mezery v obraně.' },
    paragraph5: {
      ua: 'надає широкі можливості для розвитку. Ви експериментуєте з конфігураціями оборони, аналізуєте слабкі місця, вдосконалюєте техніку та поступово підвищуєте бойову ефективність.',
      en: 'provides wide opportunities for development. You experiment with defense configurations, analyze weaknesses, improve equipment, and gradually increase combat effectiveness.',
      kz: 'даму үшін кең мүмкіндіктер береді. Сіз қорғаныс конфигурацияларымен тәжірибе жасайсыз, әлсіз жақтарды талдайсыз, жабдықты жақсартасыз.',
      pl: 'zapewnia szerokie możliwości rozwoju. Eksperymentujesz z konfiguracjami obrony, analizujesz słabe punkty, ulepszasz sprzęt i stopniowo zwiększasz skuteczność bojową.',
      cs: 'poskytuje široké možnosti rozvoje. Experimentujete s konfiguracemi obrany, analyzujete slabá místa, vylepšujete vybavení a postupně zvyšujete bojovou efektivitu.' },
    paragraph6: {
      ua: 'створена з повагою до тих, хто щоденно боронить повітряний простір України. Вона передає дух наполегливості, відповідальності та рішучості, які є основою нашої оборони.',
      en: 'is created with respect for those who defend Ukrainian airspace daily. It conveys the spirit of perseverance, responsibility, and determination that are the foundation of our defense.',
      kz: 'күн сайын Украинаның әуе кеңістігін қорғайтындарға құрметпен жасалған. Ол біздің қорғанысымыздың негізі болып табылатын табандылық рухын жеткізеді.',
      pl: 'została stworzona z szacunkiem dla tych, którzy codziennie bronią ukraińskiej przestrzeni powietrznej. Przekazuje ducha wytrwałości, odpowiedzialności i determinacji, które są fundamentem naszej obrony.',
      cs: 'je vytvořena s úctou k těm, kteří denně brání ukrajinský vzdušný prostor. Předává ducha vytrvalosti, odpovědnosti a odhodlání, které jsou základem naší obrany.' }
  },

  // ========================================
  // HUD ТА ГРА
  // ========================================
  game: {
    wave: { ua: 'Хвиля', en: 'Wave', kz: 'Толқын', pl: 'Fala', cs: 'Vlna' },
    money: { ua: '💰 Гроші', en: '💰 Money', kz: '💰 Ақша', pl: '💰 Pieniądze', cs: '💰 Peníze' },
    power: { ua: '⚡ Енергія', en: '⚡ Power', kz: '⚡ Энергия', pl: '⚡ Energia', cs: '⚡ Energie' },
    fuel: { ua: '⛽ Паливо', en: '⛽ Fuel', kz: '⛽ Жанармай', pl: '⛽ Paliwo', cs: '⛽ Palivo' },
    bricks: { ua: '🧱 Цегла', en: '🧱 Bricks', kz: '🧱 Кірпіш', pl: '🧱 Cegły', cs: '🧱 Cihly' },
    pause: { ua: 'Пауза', en: 'Pause', kz: 'Кідірту', pl: 'Pauza', cs: 'Pauza' },
    resume: { ua: 'Продовжити', en: 'Resume', kz: 'Жалғастыру', pl: 'Kontynuuj', cs: 'Pokračovat' },
    speed: { ua: 'Швидкість', en: 'Speed', kz: 'Жылдамдық', pl: 'Prędkość', cs: 'Rychlost' },
    volume: { ua: 'Звук', en: 'Sound', kz: 'Дыбыс', pl: 'Dźwięk', cs: 'Zvuk' },
    exitToMenu: { ua: 'Вийти в меню', en: 'Exit to Menu', kz: 'Мәзірге шығу', pl: 'Wyjdź do menu', cs: 'Odejít do menu' },
    exitConfirm: { ua: 'Ви впевнені, що хочете вийти?', en: 'Are you sure you want to exit?', kz: 'Шығуға сенімдісіз бе?', pl: 'Czy na pewno chcesz wyjść?', cs: 'Opravdu chcete odejít?' },
    exitConfirmBattle: { ua: 'Ти справді готовий покинути поле бою?', en: 'Are you really ready to leave the battlefield?', kz: 'Сіз шайқас алаңын тастауға дайынсыз ба?', pl: 'Czy naprawdę jesteś gotowy opuścić pole bitwy?', cs: 'Opravdu jste připraveni opustit bojiště?' },
    gameOver: { ua: 'ГРА ЗАКІНЧЕНА', en: 'GAME OVER', kz: 'ОЙЫН АЯҚТАЛДЫ', pl: 'KONIEC GRY', cs: 'KONEC HRY' },
    victory: { ua: 'ПЕРЕМОГА!', en: 'VICTORY!', kz: 'ЖЕҢІС!', pl: 'ZWYCIĘSTWO!', cs: 'VÍTĚZSTVÍ!' },
    restart: { ua: 'Почати знову', en: 'Restart', kz: 'Қайта бастау', pl: 'Zacznij od nowa', cs: 'Začít znovu' },
    place: { ua: 'Розмістити', en: 'Place', kz: 'Орналастыру', pl: 'Umieść', cs: 'Umístit' },
    upgrade: { ua: 'Покращити', en: 'Upgrade', kz: 'Жақсарту', pl: 'Ulepsz', cs: 'Vylepšit' },
    sell: { ua: 'Продати', en: 'Sell', kz: 'Сату', pl: 'Sprzedaj', cs: 'Prodat' },
    repair: { ua: 'Ремонт', en: 'Repair', kz: 'Жөндеу', pl: 'Napraw', cs: 'Opravit' },
    cost: { ua: 'Вартість', en: 'Cost', kz: 'Құны', pl: 'Koszt', cs: 'Cena' },
    loading: { ua: 'Завантаження...', en: 'Loading...', kz: 'Жүктелуде...', pl: 'Ładowanie...', cs: 'Načítání...' },
    tutorial: { ua: 'Туторіал', en: 'Tutorial', kz: 'Оқулық', pl: 'Samouczek', cs: 'Tutoriál' },
    sellPVO: { ua: 'Продати ППО', en: 'Sell PVO', kz: 'ӘҚҚ сату', pl: 'Sprzedaj OPL', cs: 'Prodat PVO' },
    dualTarget: { ua: 'Подвійна ціль', en: 'Dual Target', kz: 'Қос мақсат', pl: 'Podwójny cel', cs: 'Dvojitý cíl' },
    movePlane: { ua: 'Перемістити літак', en: 'Move Plane', kz: 'Ұшақты жылжыту', pl: 'Przesuń samolot', cs: 'Přesunout letadlo' },
    attackCruiser: { ua: 'Атакувати крейсер', en: 'Attack Cruiser', kz: 'Крейсерге шабуыл', pl: 'Atakuj krążownik', cs: 'Útok na křižník' },
    delete: { ua: 'Видалити', en: 'Delete', kz: 'Жою', pl: 'Usuń', cs: 'Smazat' },
    upgradePVO: { ua: 'Покращити ППО', en: 'Upgrade PVO', kz: 'ӘҚҚ жақсарту', pl: 'Ulepsz OPL', cs: 'Vylepšit PVO' },
    max: { ua: 'MAX', en: 'MAX', kz: 'MAX', pl: 'MAX', cs: 'MAX' },
    reload: { ua: 'Перезарядка', en: 'Reload', kz: 'Қайта зарядтау', pl: 'Przeładowanie', cs: 'Přebíjení' },
    radius: { ua: 'Радіус', en: 'Radius', kz: 'Радиус', pl: 'Zasięg', cs: 'Dosah' },
    accuracy: { ua: 'Точність', en: 'Accuracy', kz: 'Дәлдік', pl: 'Celność', cs: 'Přesnost' },
    damage: { ua: 'Урон', en: 'Damage', kz: 'Зақым', pl: 'Obrażenia', cs: 'Poškození' },
    projectileSpeed: { ua: 'Швидкість', en: 'Speed', kz: 'Жылдамдық', pl: 'Prędkość', cs: 'Rychlost' },
    battleNotFinished: { ua: 'Бій із ворогом ще не завершено!', en: 'The battle with the enemy is not over yet!', kz: 'Жаумен шайқас әлі аяқталған жоқ!', pl: 'Bitwa z wrogiem jeszcze się nie skończyła!', cs: 'Bitva s nepřítelem ještě neskončila!' },
    yesEndBattle: { ua: 'Так, завершити бій', en: 'Yes, end battle', kz: 'Иә, шайқасты аяқтау', pl: 'Tak, zakończ bitwę', cs: 'Ano, ukončit bitvu' },
    noContinueBattle: { ua: 'Ні, продовжити бій', en: 'No, continue battle', kz: 'Жоқ, шайқасты жалғастыру', pl: 'Nie, kontynuuj bitwę', cs: 'Ne, pokračovat v bitvě' },
    nextTargetIn: { ua: 'Наступна ціль в', en: 'Next target in', kz: 'Келесі мақсат', pl: 'Następny cel w', cs: 'Další cíl v' },
    region: { ua: 'області', en: 'region', kz: 'облысында', pl: 'regionie', cs: 'regionu' },
    
    // Регіони України
    regionRivne: { ua: 'Рівненській', en: 'Rivne', kz: 'Ровно', pl: 'Rówieńskim', cs: 'Rovenské' },
    regionZhytomyr: { ua: 'Житомирській', en: 'Zhytomyr', kz: 'Житомир', pl: 'Żytomierskim', cs: 'Žytomyrské' },
    regionKyiv: { ua: 'Київській', en: 'Kyiv', kz: 'Киев', pl: 'Kijowskim', cs: 'Kyjevské' },
    regionChernihiv: { ua: 'Чернігівській', en: 'Chernihiv', kz: 'Чернигов', pl: 'Czernihowskim', cs: 'Černihivské' },
    regionZaporizhzhia: { ua: 'Запорізькій', en: 'Zaporizhzhia', kz: 'Запорожье', pl: 'Zaporoskim', cs: 'Záporožské' },
    regionCrimea: { ua: 'Кримській', en: 'Crimea', kz: 'Қырым', pl: 'Krymskim', cs: 'Krymské' },
    regionLviv: { ua: 'Львівській', en: 'Lviv', kz: 'Львов', pl: 'Lwowskim', cs: 'Lvovské' },
    regionZakarpattia: { ua: 'Закарпатській', en: 'Zakarpattia', kz: 'Закарпатье', pl: 'Zakarpackim', cs: 'Zakarpatské' },
    regionIvanoFrankivsk: { ua: 'Івано-Франківській', en: 'Ivano-Frankivsk', kz: 'Ивано-Франковск', pl: 'Iwano-Frankowskim', cs: 'Ivano-Frankivské' },
    regionChernivtsi: { ua: 'Чернівецькій', en: 'Chernivtsi', kz: 'Черновцы', pl: 'Czerniowieckim', cs: 'Černovické' },
    regionTernopil: { ua: 'Тернопільській', en: 'Ternopil', kz: 'Тернополь', pl: 'Tarnopolskim', cs: 'Ternopilské' },
    regionKhmelnytskyi: { ua: 'Хмельницькій', en: 'Khmelnytskyi', kz: 'Хмельницкий', pl: 'Chmielnickim', cs: 'Chmelnycké' },
    regionVinnytsia: { ua: 'Вінницькій', en: 'Vinnytsia', kz: 'Винница', pl: 'Winnickim', cs: 'Vinnycké' },
    regionKirovohrad: { ua: 'Кіровоградській', en: 'Kirovohrad', kz: 'Кировоград', pl: 'Kirowogradzkim', cs: 'Kirovohradské' },
    regionMykolaiv: { ua: 'Миколаївській', en: 'Mykolaiv', kz: 'Николаев', pl: 'Mikołajowskim', cs: 'Mykolajivské' },
    regionKherson: { ua: 'Херсонській', en: 'Kherson', kz: 'Херсон', pl: 'Chersońskim', cs: 'Chersonské' },
    regionDonetsk: { ua: 'Донецькій', en: 'Donetsk', kz: 'Донецк', pl: 'Donieckim', cs: 'Doněcké' },
    regionKharkiv: { ua: 'Харківській', en: 'Kharkiv', kz: 'Харьков', pl: 'Charkowskim', cs: 'Charkovské' },
    regionPoltava: { ua: 'Полтавській', en: 'Poltava', kz: 'Полтава', pl: 'Połtawskim', cs: 'Poltavské' },
    regionSumy: { ua: 'Сумській', en: 'Sumy', kz: 'Сумы', pl: 'Sumskim', cs: 'Sumské' },
    regionCherkasy: { ua: 'Черкаській', en: 'Cherkasy', kz: 'Черкассы', pl: 'Czerkaskim', cs: 'Čerkaské' },
    regionOdesa: { ua: 'Одеській', en: 'Odesa', kz: 'Одесса', pl: 'Odeskim', cs: 'Oděské' },
    regionDnipro: { ua: 'Дніпропетровській', en: 'Dnipropetrovsk', kz: 'Днепропетровск', pl: 'Dniepropietrowskim', cs: 'Dněpropetrovské' },
    
    victoryMain: { ua: '🎉 Перемога! Ти захистив Україну!', en: '🎉 Victory! You defended Ukraine!', kz: '🎉 Жеңіс! Сіз Украинаны қорғадыңыз!', pl: '🎉 Zwycięstwo! Obroniłeś Ukrainę!', cs: '🎉 Vítězství! Ubránili jste Ukrajinu!' },
    victory6: { ua: '🎉 Усі 6 об\'єктів - недоторкані.<br>Небо трималось на тобі. І ти не впав.', en: '🎉 All 6 objects - untouched.<br>The sky held on you. And you did not fall.', kz: '🎉 Барлық 6 нысан - бүтін.<br>Аспан сізге сүйенді. Сіз құламадыңыз.', pl: '🎉 Wszystkie 6 obiektów - nietkniętych.<br>Niebo trzymało się na tobie. I nie upadłeś.', cs: '🎉 Všech 6 objektů - nedotčených.<br>Nebe drželo na vás. A vy jste nepadli.' },
    victory5: { ua: '🟢 5 з 6 об\'єктів вціліли.<br>Майже ідеально. Навіть зорі аплодують тобі сьогодні.', en: '🟢 5 of 6 objects survived.<br>Almost perfect. Even the stars applaud you today.', kz: '🟢 6 нысанның 5-і аман қалды.<br>Дерлік мінсіз. Жұлдыздар да сізге қол соғады.', pl: '🟢 5 z 6 obiektów przetrwało.<br>Prawie idealnie. Nawet gwiazdy ci dzisiaj biją brawo.', cs: '🟢 5 ze 6 objektů přežilo.<br>Téměř dokonalé. I hvězdy vám dnes tleskají.' },
    victory4: { ua: '🟡 4 об\'єкти витримали бурю.<br>Ти був щитом, і щитом залишився.', en: '🟡 4 objects survived the storm.<br>You were a shield, and a shield you remained.', kz: '🟡 4 нысан дауылға төтеп берді.<br>Сіз қалқан болдыңыз және қалқан болып қалдыңыз.', pl: '🟡 4 obiekty przetrwały burzę.<br>Byłeś tarczą i tarczą pozostałeś.', cs: '🟡 4 objekty přežily bouři.<br>Byli jste štítem a štítem jste zůstali.' },
    victory3: { ua: '🟠 Половина об\'єктів вистояла.<br>Іноді перемога - це не тріумф, а виживання. Але це теж героїзм.', en: '🟠 Half of the objects stood.<br>Sometimes victory is not triumph, but survival. But that is also heroism.', kz: '🟠 Нысандардың жартысы аман қалды.<br>Кейде жеңіс - бұл триумф емес, тірі қалу. Бірақ бұл да ерлік.', pl: '🟠 Połowa obiektów przetrwała.<br>Czasem zwycięstwo to nie triumf, ale przetrwanie. Ale to też heroizm.', cs: '🟠 Polovina objektů přežila.<br>Někdy vítězství není triumf, ale přežití. Ale i to je hrdinství.' },
    victory2: { ua: '🔴 Лишилось два об\'єкти. Вони горять, але стоять.<br>І пам\'ятають, хто їх врятував.', en: '🔴 Two objects remain. They burn, but stand.<br>And they remember who saved them.', kz: '🔴 2 нысан қалды. Олар жанып тұр, бірақ тұр.<br>Және оларды кім құтқарғанын есте сақтайды.', pl: '🔴 Zostały dwa obiekty. Płoną, ale stoją.<br>I pamiętają, kto je uratował.', cs: '🔴 Zůstaly dva objekty. Hoří, ale stojí.<br>A pamatují si, kdo je zachránil.' },
    victory1: { ua: '🔴 Лишився один об\'єкт серед попелу. Змучений. Самотній.<br>Та цього достатньо, аби сказати: Ми встояли.', en: '🔴 One object remains among the ashes. Exhausted. Alone.<br>But that is enough to say: We stood.', kz: '🔴 Күл арасында бір нысан қалды. Шаршаған. Жалғыз.<br>Бірақ бұл жеткілікті: Біз тұрдық.', pl: '🔴 Jeden obiekt pozostał wśród popiołów. Wyczerpany. Samotny.<br>Ale to wystarczy, by powiedzieć: Wytrwaliśmy.', cs: '🔴 Jeden objekt zůstal v popelu. Vyčerpaný. Sám.<br>Ale to stačí, abychom řekli: Vydrželi jsme.' },
    supportGame: { ua: '💚 Підтримати гру', en: '💚 Support the game', kz: '💚 Ойынды қолдау', pl: '💚 Wesprzyj grę', cs: '💚 Podpořte hru' },
    tryAgain: { ua: '🔁 Спробувати ще!', en: '🔁 Try again!', kz: '🔁 Қайталап көру!', pl: '🔁 Spróbuj ponownie!', cs: '🔁 Zkuste to znovu!' },
    lockedNoRegistration: { ua: 'Недоступно без реєстрації', en: 'Not available without registration', kz: 'Тіркеусіз қол жетімсіз', pl: 'Niedostępne bez rejestracji', cs: 'Nedostupné bez registrace' },
    lockedNoDeck: {
  ua: 'Колода не налаштована',
  en: 'Deck not configured',
  kz: 'Колода баптталмаған',
  pl: 'Talia nie skonfigurowana',
  cs: 'Balíček není nastaven'
}
  },
  
  // ========================================
  // ТУТОРІАЛ
  // ========================================
  tutorial: {
    // Кнопки
    btnNext: { ua: 'Далі', en: 'Next', kz: 'Келесі', pl: 'Dalej', cs: 'Další' },
    btnStart: { ua: 'Починаємо!', en: 'Let\'s start!', kz: 'Бастаймыз!', pl: 'Zaczynamy!', cs: 'Začínáme!' },
    btnToDefense: { ua: 'До оборони!', en: 'To defense!', kz: 'Қорғанысқа!', pl: 'Do obrony!', cs: 'K obraně!' },
    btnNextStage: { ua: 'Наступний етап', en: 'Next stage', kz: 'Келесі кезең', pl: 'Następny etap', cs: 'Další fáze' },
    btnGloryToHeroes: { ua: 'Героям Слава!', en: 'Glory to Heroes!', kz: 'Батырларға Дан!', pl: 'Chwała Bohaterom!', cs: 'Sláva hrdinům!' },

    // Крок 1: Вітання
    welcomeTitle: { ua: 'Бажаю здоров\'я, Командире!', en: 'Greetings, Commander!', kz: 'Сәлем, Командир!', pl: 'Witaj, Dowódco!', cs: 'Zdravím, Veliteli!' },
    welcomeText: { ua: 'Сьогодні Ви пройдете короткий інструктаж. Ця базова підготовка навчить Вас основ захисту України від повітряних загроз.', en: 'Today you will complete a short briefing. This basic training will teach you the fundamentals of defending Ukraine from air threats.', kz: 'Бүгін сіз қысқаша нұсқаулықтан өтесіз. Бұл базалық дайындық сізге Украинаны әуе қауіптерінен қорғаудың негіздерін үйретеді.', pl: 'Dziś przejdziesz krótki instruktaż. To podstawowe szkolenie nauczy Cię podstaw obrony Ukrainy przed zagrożeniami z powietrza.', cs: 'Dnes absolvujete krátký briefing. Tento základní výcvik vás naučí základy obrany Ukrajiny před vzdušnými hrozbami.' },

    // Крок 2: Карбованці
    moneyTitle: { ua: '💶 Карбованці', en: '💶 Currency', kz: '💶 Қаражат', pl: '💶 Waluta', cs: '💶 Měna' },
    moneyText: { ua: 'Це Ваш основний бюджет для придбання та модернізації ППО. Отримуєте поповнення бюджету за знищення повітряних загроз.', en: 'This is your main budget for purchasing and upgrading air defense systems. You receive budget replenishment for destroying air threats.', kz: 'Бұл сіздің әуе қорғаныс жүйелерін сатып алуға және жаңартуға арналған негізгі бюджетіңіз. Әуе қауіптерін жою үшін бюджетті толықтыруды аласыз.', pl: 'To Twój główny budżet na zakup i modernizację systemów obrony powietrznej. Otrzymujesz uzupełnienie budżetu za zniszczenie zagrożeń powietrznych.', cs: 'Toto je váš hlavní rozpočet na nákup a modernizaci systémů protivzdušné obrany. Za zničení vzdušných hrozeb získáváte doplnění rozpočtu.' },

    // Крок 3: Ресурси
    resourcesTitle: { ua: '⚡🧱⛽ Ресурси', en: '⚡🧱⛽ Resources', kz: '⚡🧱⛽ Ресурстар', pl: '⚡🧱⛽ Zasoby', cs: '⚡🧱⛽ Zdroje' },
    resourcesText: { ua: '<b>Енергія, Цегла</b> та <b>Пальне</b>. Ці ресурси використовуються для відновлення пошкоджених споруд. Виробляються автоматично на об\'єктах критичної інфраструктури.', en: '<b>Energy, Bricks</b> and <b>Fuel</b>. These resources are used to repair damaged structures. They are produced automatically at critical infrastructure objects.', kz: '<b>Энергия, Кірпіш</b> және <b>Жанармай</b>. Бұл ресурстар зақымдалған құрылыстарды жөндеуге пайдаланылады. Олар маңызды инфрақұрылым объектілерінде автоматты түрде өндіріледі.', pl: '<b>Energia, Cegły</b> i <b>Paliwo</b>. Te zasoby są wykorzystywane do naprawy uszkodzonych budowli. Są produkowane automatycznie w obiektach infrastruktury krytycznej.', cs: '<b>Energie, Cihly</b> a <b>Palivo</b>. Tyto zdroje se používají k opravě poškozených staveb. Jsou automaticky vyráběny na objektech kritické infrastruktury.' },

    // Крок 4: Статистика
    statsTitle: { ua: '📊 Статистика', en: '📊 Statistics', kz: '📊 Статистика', pl: '📊 Statystyki', cs: '📊 Statistiky' },
    statsText: { ua: '<b>🎯 Показник</b> - Кількість знищених повітряних загроз.<br><b>🌊 Етап</b> - Поточний етап бойових дій.', en: '<b>🎯 Score</b> - Number of destroyed air threats.<br><b>🌊 Wave</b> - Current stage of combat operations.', kz: '<b>🎯 Көрсеткіш</b> - Жойылған әуе қауіптерінің саны.<br><b>🌊 Кезең</b> - Ағымдағы ұрыс операциялары кезеңі.', pl: '<b>🎯 Wynik</b> - Liczba zniszczonych zagrożeń powietrznych.<br><b>🌊 Fala</b> - Bieżący etap działań bojowych.', cs: '<b>🎯 Skóre</b> - Počet zničených vzdušných hrozeb.<br><b>🌊 Vlna</b> - Aktuální fáze bojových operací.' },

    // Крок 5: HUD меню
    menuTitle: { ua: '⚙️ Меню', en: '⚙️ Menu', kz: '⚙️ Мәзір', pl: '⚙️ Menu', cs: '⚙️ Menu' },
    menuText: { ua: 'Відкрийте панель керування.', en: 'Open the control panel.', kz: 'Басқару панелін ашыңыз.', pl: 'Otwórz panel sterowania.', cs: 'Otevřete ovládací panel.' },

    // Крок 6: Панель керування
    controlPanelTitle: { ua: '⚙️ Панель керування', en: '⚙️ Control Panel', kz: '⚙️ Басқару панелі', pl: '⚙️ Panel sterowania', cs: '⚙️ Ovládací panel' },
    controlPause: { ua: '- Зупинити / Продовжити.', en: '- Pause / Resume.', kz: '- Тоқтату / Жалғастыру.', pl: '- Pauza / Wznów.', cs: '- Pozastavit / Pokračovat.' },
    controlSpeed: { ua: '- Змінити швидкість.', en: '- Change speed.', kz: '- Жылдамдықты өзгерту.', pl: '- Zmień prędkość.', cs: '- Změnit rychlost.' },
    controlSound: { ua: '- Вимкнути / Увімкнути звук.', en: '- Mute / Unmute sound.', kz: '- Дыбысты өшіру / қосу.', pl: '- Wycisz / Włącz dźwięk.', cs: '- Ztlumit / Zapnout zvuk.' },
    controlExit: { ua: '- Вийти.', en: '- Exit.', kz: '- Шығу.', pl: '- Wyjdź.', cs: '- Odejít.' },

    // Крок 7: Головна панель (ППО меню)
    mainPanelTitle: { ua: '🛡️ Головна панель', en: '🛡️ Main Panel', kz: '🛡️ Басты панель', pl: '🛡️ Panel główny', cs: '🛡️ Hlavní panel' },
    mainPanelText: { ua: 'У цьому розділі Ви можете придбати системи ППО для захисту об\'єктів критичної інфраструктури.', en: 'In this section you can purchase air defense systems to protect critical infrastructure objects.', kz: 'Бұл бөлімде сіз маңызды инфрақұрылым объектілерін қорғау үшін әуе қорғаныс жүйелерін сатып ала аласыз.', pl: 'W tej sekcji możesz zakupić systemy obrony powietrznej do ochrony obiektów infrastruktury krytycznej.', cs: 'V této sekci můžete zakoupit systémy protivzdušné obrany k ochraně objektů kritické infrastruktury.' },

    // Крок 8: Об'єкт критичної інфраструктури
    targetTitle: { ua: '🎯 Об\'єкт критичної інфраструктури', en: '🎯 Critical Infrastructure Object', kz: '🎯 Маңызды инфрақұрылым объектісі', pl: '🎯 Obiekt infrastruktury krytycznej', cs: '🎯 Objekt kritické infrastruktury' },
    targetText: { ua: 'Основна ціль ворога. Забезпечте постійний захист! Наші радари вже фіксують повітряну загрозу.', en: 'The main target of the enemy. Ensure constant protection! Our radars are already detecting an air threat.', kz: 'Жаудың негізгі мақсаты. Тұрақты қорғауды қамтамасыз етіңіз! Біздің радарлар әуе қаупін анықтап отыр.', pl: 'Główny cel wroga. Zapewnij stałą ochronę! Nasze radary już wykrywają zagrożenie powietrzne.', cs: 'Hlavní cíl nepřítele. Zajistěte stálou ochranu! Naše radary již detekují vzdušnou hrozbu.' },

    // Крок 9: Шахед
    shahedTitle: { ua: '⚠️ Шахед', en: '⚠️ Shahed', kz: '⚠️ Шахед', pl: '⚠️ Shahed', cs: '⚠️ Shahed' },
    shahedText: { ua: 'Командире! До об\'єкта наближається ворожий дрон!', en: 'Commander! An enemy drone is approaching the object!', kz: 'Командир! Объектіге жау дроны жақындап келеді!', pl: 'Dowódco! Wrogowy dron zbliża się do obiektu!', cs: 'Veliteli! K objektu se blíží nepřátelský dron!' },

    // Крок 10: Кулемет
    machineGunTitle: { ua: '🛡️ Кулемет', en: '🛡️ Machine Gun', kz: '🛡️ Пулемет', pl: '🛡️ Karabin maszynowy', cs: '🛡️ Kulomet' },
    machineGunText: { ua: 'Придбайте <b>Кулемет</b> та розмістіть його на вказаній позиції для оборони.', en: 'Purchase a <b>Machine Gun</b> and place it at the indicated position for defense.', kz: '<b>Пулеметті</b> сатып алыңыз және қорғаныс үшін көрсетілген позицияға орналастырыңыз.', pl: 'Kup <b>Karabin maszynowy</b> i umieść go na wskazanej pozycji do obrony.', cs: 'Zakupte <b>Kulomet</b> a umístěte ho na označenou pozici k obraně.' },

    // Крок 11: Успіх (Кулемет)
    machineGunSuccessTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    machineGunSuccessText: { ua: '<b>Кулемет</b> успішно знищив дрон. Об\'єкт не зазнав пошкоджень.', en: 'The <b>Machine Gun</b> successfully destroyed the drone. The object was not damaged.', kz: '<b>Пулемет</b> дронды сәтті жойды. Объект зақымдалмады.', pl: '<b>Karabin maszynowy</b> pomyślnie zniszczył drona. Obiekt nie został uszkodzony.', cs: '<b>Kulomet</b> úspěšně zničil dron. Objekt nebyl poškozen.' },

    // Крок 12: Важкий дрон
    heavyDroneTitle: { ua: '⚠️ Важкий дрон', en: '⚠️ Heavy Drone', kz: '⚠️ Ауыр дрон', pl: '⚠️ Ciężki dron', cs: '⚠️ Těžký dron' },
    heavyDroneText: { ua: 'Командире! З заходу зафіксовано дрон з посиленими характеристиками. Необхідно підсилити оборону!', en: 'Commander! A drone with enhanced characteristics has been detected from the west. Defense reinforcement is needed!', kz: 'Командир! Батыстан күшейтілген сипаттамалары бар дрон анықталды. Қорғанысты күшейту қажет!', pl: 'Dowódco! Z zachodu wykryto drona o wzmocnionych parametrach. Konieczne jest wzmocnienie obrony!', cs: 'Veliteli! Ze západu byl detekován dron se zesílenými charakteristikami. Je třeba posílit obranu!' },

    // Крок 13: 2K12 KUB
    kubTitle: { ua: '🛡️ 2K12 KUB', en: '🛡️ 2K12 KUB', kz: '🛡️ 2K12 KUB', pl: '🛡️ 2K12 KUB', cs: '🛡️ 2K12 KUB' },
    kubText: { ua: 'Придбайте <b>2K12 KUB</b> та розмістіть систему на вказаній позиції.', en: 'Purchase <b>2K12 KUB</b> and place the system at the indicated position.', kz: '<b>2K12 KUB</b> сатып алыңыз және жүйені көрсетілген позицияға орналастырыңыз.', pl: 'Kup <b>2K12 KUB</b> i umieść system na wskazanej pozycji.', cs: 'Zakupte <b>2K12 KUB</b> a umístěte systém na označenou pozici.' },

    // Крок 14: Прорив
    breakthroughTitle: { ua: '⚠️ Прорив!', en: '⚠️ Breakthrough!', kz: '⚠️ Бұзылу!', pl: '⚠️ Przełamanie!', cs: '⚠️ Průlom!' },
    breakthroughText: { ua: 'Оборона не впоралась... Об\'єкт отримав пошкодження.', en: 'The defense failed... The object was damaged.', kz: 'Қорғаныс жеңілді... Объект зақымдалды.', pl: 'Obrona nie wytrzymała... Obiekt został uszkodzony.', cs: 'Obrana selhala... Objekt byl poškozen.' },

    // Крок 15: Модернізація урону
    upgradeDamageTitle: { ua: '📈 Модернізація урону', en: '📈 Damage Upgrade', kz: '📈 Зақым жаңартуы', pl: '📈 Ulepszenie obrażeń', cs: '📈 Vylepšení poškození' },
    upgradeDamageText: { ua: 'Командире, підсиліть <b>Урон</b> системи <b>2K12 KUB</b> до <b>2 рівня</b>, щоб збільшити вогневу ефективність.', en: 'Commander, upgrade the <b>Damage</b> of the <b>2K12 KUB</b> system to <b>level 2</b> to increase firepower.', kz: 'Командир, от күшін арттыру үшін <b>2K12 KUB</b> жүйесінің <b>Зақымын</b> <b>2-деңгейге</b> дейін жаңартыңыз.', pl: 'Dowódco, ulepsz <b>Obrażenia</b> systemu <b>2K12 KUB</b> do <b>poziomu 2</b>, aby zwiększyć siłę ognia.', cs: 'Veliteli, vylepšete <b>Poškození</b> systému <b>2K12 KUB</b> na <b>úroveň 2</b> pro zvýšení palebné síly.' },

    // Крок 16: Модернізація влучності
    upgradeAccuracyTitle: { ua: '📈 Модернізація влучності', en: '📈 Accuracy Upgrade', kz: '📈 Дәлдік жаңартуы', pl: '📈 Ulepszenie celności', cs: '📈 Vylepšení přesnosti' },
    upgradeAccuracyText: { ua: 'Тепер підсиліть <b>Влучність</b> до <b>2 рівня</b>.', en: 'Now upgrade <b>Accuracy</b> to <b>level 2</b>.', kz: 'Енді <b>Дәлдікті</b> <b>2-деңгейге</b> дейін жаңартыңыз.', pl: 'Teraz ulepsz <b>Celność</b> do <b>poziomu 2</b>.', cs: 'Nyní vylepšete <b>Přesnost</b> na <b>úroveň 2</b>.' },

    // Крок 17: Успіх модернізації
    upgradeSuccessTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    upgradeSuccessText: { ua: '<b>2K12 KUB</b> вдало модернізовано. Тепер ця система знищуватиме повітряні загрози швидше!', en: '<b>2K12 KUB</b> has been successfully upgraded. Now this system will destroy air threats faster!', kz: '<b>2K12 KUB</b> сәтті жаңартылды. Енді бұл жүйе әуе қауіптерін тезірек жояды!', pl: '<b>2K12 KUB</b> został pomyślnie ulepszony. Teraz ten system będzie szybciej niszczyć zagrożenia powietrzne!', cs: '<b>2K12 KUB</b> byl úspěšně vylepšen. Nyní bude tento systém ničit vzdušné hrozby rychleji!' },

    // Крок 18: Повідомлення від розвідки
    intelTitle: { ua: '📍 Повідомлення', en: '📍 Message', kz: '📍 Хабарлама', pl: '📍 Wiadomość', cs: '📍 Zpráva' },
    intelText: { ua: 'Командире! Ми отримали повідомлення. Розвідка доповідає про підготовку атаки на новий об\'єкт. Маємо лише дані про область. Точні координати відсутні... Звертайте увагу на ці повідомлення! Це допоможе Вам швидше приймати рішення.', en: 'Commander! We received a message. Intelligence reports preparation of an attack on a new object. We only have data about the region. Exact coordinates are missing... Pay attention to these messages! This will help you make decisions faster.', kz: 'Командир! Біз хабарлама алдық. Барлау жаңа объектіге шабуыл дайындығы туралы хабарлайды. Бізде тек аймақ туралы деректер бар. Нақты координаттар жоқ... Осы хабарламаларға назар аударыңыз! Бұл сізге шешімдерді тезірек қабылдауға көмектеседі.', pl: 'Dowódco! Otrzymaliśmy wiadomość. Wywiad donosi o przygotowaniach do ataku na nowy obiekt. Mamy tylko dane o regionie. Brak dokładnych współrzędnych... Zwracaj uwagę na te wiadomości! Pomoże Ci to szybciej podejmować decyzje.', cs: 'Veliteli! Obdrželi jsme zprávu. Rozvědka hlásí přípravu útoku na nový objekt. Máme pouze údaje o regionu. Přesné souřadnice chybí... Věnujte pozornost těmto zprávám! Pomůže vám to rychleji činit rozhodnutí.' },

    // Крок 19: Група дронів
    droneGroupTitle: { ua: '⚠️ Група дронів', en: '⚠️ Drone Group', kz: '⚠️ Дрон тобы', pl: '⚠️ Grupa dronów', cs: '⚠️ Skupina dronů' },
    droneGroupText: { ua: 'Наші радари фіксують декілька повітряних загроз із заходу.', en: 'Our radars are detecting multiple air threats from the west.', kz: 'Біздің радарлар батыстан бірнеше әуе қауіптерін анықтады.', pl: 'Nasze radary wykrywają wiele zagrożeń powietrznych z zachodu.', cs: 'Naše radary detekují více vzdušných hrozeb ze západu.' },

    // Крок 20: Успіх (група дронів)
    droneGroupSuccessTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    droneGroupSuccessText: { ua: '<b>2K12 KUB</b> з покращеними характеристиками знищила всю групу дронів!', en: '<b>2K12 KUB</b> with enhanced characteristics destroyed the entire drone group!', kz: 'Жақсартылған сипаттамалары бар <b>2K12 KUB</b> дрондар тобын толығымен жойды!', pl: '<b>2K12 KUB</b> o ulepszonych parametrach zniszczyła całą grupę dronów!', cs: '<b>2K12 KUB</b> se zesílenými charakteristikami zničil celou skupinu dronů!' },

    // Крок 21: Друга ціль
    secondTargetTitle: { ua: '🎯 Об\'єкт критичної інфраструктури', en: '🎯 Critical Infrastructure Object', kz: '🎯 Маңызды инфрақұрылым объектісі', pl: '🎯 Obiekt infrastruktury krytycznej', cs: '🎯 Objekt kritické infrastruktury' },
    secondTargetText: { ua: 'Командире! Отримано підтверджену інформацію про об\'єкт, який ворог намагатиметься атакувати. Забезпечте оборону обох об\'єктів.', en: 'Commander! Confirmed information received about the object the enemy will try to attack. Ensure defense of both objects.', kz: 'Командир! Жау шабуыл жасауға тырысатын объект туралы расталған ақпарат алынды. Екі объектіні де қорғауды қамтамасыз етіңіз.', pl: 'Dowódco! Otrzymano potwierdzoną informację o obiekcie, który wróg będzie próbował zaatakować. Zapewnij obronę obu obiektów.', cs: 'Veliteli! Obdržena potvrzená informace o objektu, který se nepřítel pokusí napadnout. Zajistěte obranu obou objektů.' },

    // Крок 22: Ракета
    rocketTitle: { ua: '⚠️ Ракета', en: '⚠️ Rocket', kz: '⚠️ Зымыран', pl: '⚠️ Rakieta', cs: '⚠️ Raketa' },
    rocketText: { ua: 'Наші радари фіксують ціль із великою швидкістю...', en: 'Our radars are detecting a high-speed target...', kz: 'Біздің радарлар жоғары жылдамдықты нысананы анықтады...', pl: 'Nasze radary wykrywają cel o dużej prędkości...', cs: 'Naše radary detekují vysokorychlostní cíl...' },

    // Крок 23: Ракета (не встигаємо)
    rocketMissTitle: { ua: '⚠️ Ракета', en: '⚠️ Rocket', kz: '⚠️ Зымыран', pl: '⚠️ Rakieta', cs: '⚠️ Raketa' },
    rocketMissText: { ua: 'Командире! Нажаль, ми не встигаємо перехопити ракету... Удар неминучий.', en: 'Commander! Unfortunately, we cannot intercept the rocket in time... Impact is inevitable.', kz: 'Командир! Өкінішке орай, біз зымыранды уақытында ұстай алмаймыз... Соққы болмай қоймайды.', pl: 'Dowódco! Niestety nie zdążymy przechwycić rakiety... Uderzenie jest nieuniknione.', cs: 'Veliteli! Bohužel nestíháme zachytit raketu... Zásah je nevyhnutelný.' },

    // Крок 24: Продаж ППО
    sellTitle: { ua: '💶 Продаж ППО', en: '💶 Sell Air Defense', kz: '💶 ӘҚЖ сату', pl: '💶 Sprzedaj OPL', cs: '💶 Prodej PVO' },
    sellText: { ua: 'Якщо об\'єкт знищено, деякі системи ППО стають непотрібними. Продайте <b>Кулемет</b> та <b>2K12 KUB</b>, щоб повернути частину коштів, витрачених на їх придбання та модернізацію.', en: 'If an object is destroyed, some air defense systems become unnecessary. Sell the <b>Machine Gun</b> and <b>2K12 KUB</b> to recover part of the funds spent on their purchase and upgrades.', kz: 'Егер объект жойылса, кейбір әуе қорғаныс жүйелері қажетсіз болады. Сатып алуға және жаңартуға жұмсалған қаражаттың бір бөлігін қайтару үшін <b>Пулемет</b> пен <b>2K12 KUB</b> сатыңыз.', pl: 'Jeśli obiekt zostanie zniszczony, niektóre systemy obrony powietrznej stają się niepotrzebne. Sprzedaj <b>Karabin maszynowy</b> i <b>2K12 KUB</b>, aby odzyskać część środków wydanych na ich zakup i modernizację.', cs: 'Pokud je objekt zničen, některé systémy PVO se stanou zbytečnými. Prodejte <b>Kulomet</b> a <b>2K12 KUB</b>, abyste získali zpět část prostředků vynaložených na jejich nákup a vylepšení.' },

    // Крок 25: Кільчень
    kilchenTitle: { ua: '🛡️ Кільчень', en: '🛡️ Kilchen', kz: '🛡️ Кільчень', pl: '🛡️ Kilchen', cs: '🛡️ Kilchen' },
    kilchenText: { ua: 'Придбайте та встановіть <b>Кільчень</b> справа від об\'єкта.', en: 'Purchase and install <b>Kilchen</b> to the right of the object.', kz: '<b>Кільченьді</b> сатып алыңыз және объектінің оң жағына орнатыңыз.', pl: 'Kup i zainstaluj <b>Kilchen</b> po prawej stronie obiektu.', cs: 'Zakupte a nainstalujte <b>Kilchen</b> napravo od objektu.' },

    // Крок 26: РЕБ
    rebTitle: { ua: '🛡️ РЕБ', en: '🛡️ EW', kz: '🛡️ ЭБ', pl: '🛡️ WE', cs: '🛡️ REB' },
    rebText: { ua: 'Тепер придбайте та встановіть <b>РЕБ</b> недалеко від <b>Кільченя</b>. РЕБ уповільнює дрони і ракети, та з певним шансом може їх знешкодити.', en: 'Now purchase and install <b>EW</b> near <b>Kilchen</b>. EW slows down drones and rockets, and has a chance to neutralize them.', kz: 'Енді <b>Кільчень</b> жанына <b>ЭБ</b> сатып алыңыз және орнатыңыз. ЭБ дрондар мен зымырандарды баяулатады және оларды залалсыздандыру мүмкіндігі бар.', pl: 'Teraz kup i zainstaluj <b>WE</b> w pobliżu <b>Kilchen</b>. WE spowalnia drony i rakiety oraz ma szansę je zneutralizować.', cs: 'Nyní zakupte a nainstalujte <b>REB</b> poblíž <b>Kilchen</b>. REB zpomaluje drony a rakety a má šanci je zneškodnit.' },

    // Крок 27: Patriot
    patriotTitle: { ua: '🛡️ Встанови Patriot', en: '🛡️ Install Patriot', kz: '🛡️ Patriot орнатыңыз', pl: '🛡️ Zainstaluj Patriot', cs: '🛡️ Nainstalujte Patriot' },
    patriotText: { ua: 'Придбайте та встановіть <b>Patriot</b> зліва від об\'єкта.', en: 'Purchase and install <b>Patriot</b> to the left of the object.', kz: '<b>Patriot</b> сатып алыңыз және объектінің сол жағына орнатыңыз.', pl: 'Kup i zainstaluj <b>Patriot</b> po lewej stronie obiektu.', cs: 'Zakupte a nainstalujte <b>Patriot</b> nalevo od objektu.' },

    // Крок 28: Перевірка оборони
    checkDefenseTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    checkDefenseText: { ua: 'Перевіримо ефективність оборони.', en: 'Let\'s check the defense effectiveness.', kz: 'Қорғаныс тиімділігін тексерейік.', pl: 'Sprawdźmy skuteczność obrony.', cs: 'Zkontrolujme účinnost obrany.' },

    // Крок 29: Масована атака
    massAttackTitle: { ua: '⚠️ Масована атака!', en: '⚠️ Massive Attack!', kz: '⚠️ Жаппай шабуыл!', pl: '⚠️ Atak masowy!', cs: '⚠️ Masivní útok!' },
    massAttackText: { ua: 'Наші радари фіксують повітряну загрозу з заходу та сходу. Це комбінована атака ворога!', en: 'Our radars are detecting air threats from the west and east. This is a combined enemy attack!', kz: 'Біздің радарлар батыстан және шығыстан әуе қауіптерін анықтады. Бұл жаудың біріккен шабуылы!', pl: 'Nasze radary wykrywają zagrożenia powietrzne z zachodu i wschodu. To połączony atak wroga!', cs: 'Naše radary detekují vzdušné hrozby ze západu a východu. Jedná se o kombinovaný nepřátelský útok!' },

    // Крок 30: Результат
    resultTitle: { ua: '📊 Результат', en: '📊 Result', kz: '📊 Нәтиже', pl: '📊 Wynik', cs: '📊 Výsledek' },
    resultText: { ua: 'Командире! <b>Кільчень</b> показав 100% ефективність. <b>Patriot</b> виконав завдання частково. Ракети було знищено, але дронам вдалося завдати пошкоджень об\'єкту.', en: 'Commander! <b>Kilchen</b> showed 100% effectiveness. <b>Patriot</b> completed the task partially. Rockets were destroyed, but drones managed to damage the object.', kz: 'Командир! <b>Кільчень</b> 100% тиімділік көрсетті. <b>Patriot</b> тапсырманы ішінара орындады. Зымырандар жойылды, бірақ дрондар объектіге зақым келтірді.', pl: 'Dowódco! <b>Kilchen</b> wykazał 100% skuteczności. <b>Patriot</b> wykonał zadanie częściowo. Rakiety zostały zniszczone, ale drony zdołały uszkodzić obiekt.', cs: 'Veliteli! <b>Kilchen</b> ukázal 100% účinnost. <b>Patriot</b> splnil úkol částečně. Rakety byly zničeny, ale dronům se podařilo poškodit objekt.' },

    // Крок 31: Спеціалізація
    specializationTitle: { ua: '⚠️ Спеціалізація', en: '⚠️ Specialization', kz: '⚠️ Мамандандыру', pl: '⚠️ Specjalizacja', cs: '⚠️ Specializace' },
    specializationText: { ua: 'Кожна система ППО спеціалізується проти різних типів повітряних загроз. Необхідно комбінувати ППО для ефективного захисту об\'єктів.', en: 'Each air defense system specializes against different types of air threats. It is necessary to combine air defense systems for effective object protection.', kz: 'Әр әуе қорғаныс жүйесі әртүрлі әуе қауіптеріне қарсы мамандандырылған. Объектілерді тиімді қорғау үшін әуе қорғаныс жүйелерін біріктіру қажет.', pl: 'Każdy system obrony powietrznej specjalizuje się w zwalczaniu różnych typów zagrożeń powietrznych. Konieczne jest łączenie systemów OPL dla skutecznej ochrony obiektów.', cs: 'Každý systém protivzdušné obrany se specializuje proti různým typům vzdušných hrozeb. Je nutné kombinovat systémy PVO pro účinnou ochranu objektů.' },

    // Крок 32: Аварійка
    emergencyTitle: { ua: '🚧 Аварійка', en: '🚧 Emergency', kz: '🚧 Авариялық', pl: '🚧 Awaryjny', cs: '🚧 Pohotovost' },
    emergencyText: { ua: 'Об\'єкт пошкоджено. Побудуйте <b>Аварійку</b> у будь-якому місці. Але пам\'ятайте! Відстань до об\'єкта впливає на витрати. Чим більша відстань, тим більше знадобиться <b>Палива</b> і <b>Карбованців</b>.', en: 'The object is damaged. Build an <b>Emergency</b> unit anywhere. But remember! Distance to the object affects costs. The greater the distance, the more <b>Fuel</b> and <b>Currency</b> will be needed.', kz: 'Объект зақымдалған. Кез келген жерде <b>Авариялық</b> бөлімшесін салыңыз. Бірақ есте сақтаңыз! Объектіге дейінгі қашықтық шығындарға әсер етеді. Қашықтық неғұрлым көп болса, соғұрлым көп <b>Жанармай</b> және <b>Қаражат</b> қажет болады.', pl: 'Obiekt jest uszkodzony. Zbuduj jednostkę <b>Awaryjną</b> w dowolnym miejscu. Ale pamiętaj! Odległość do obiektu wpływa na koszty. Im większa odległość, tym więcej <b>Paliwa</b> i <b>Waluty</b> będzie potrzebne.', cs: 'Objekt je poškozen. Postavte jednotku <b>Pohotovosti</b> kdekoli. Ale pamatujte! Vzdálenost k objektu ovlivňuje náklady. Čím větší vzdálenost, tím více <b>Paliva</b> a <b>Měny</b> bude potřeba.' },

    // Крок 33: Ремонт (вибір об'єкта)
    repairSelectTitle: { ua: '🔧 Ремонт', en: '🔧 Repair', kz: '🔧 Жөндеу', pl: '🔧 Naprawa', cs: '🔧 Oprava' },
    repairSelectText: { ua: 'Аварійна бригада очікує на вказівки. Оберіть об\'єкт для ремонту.', en: 'The emergency crew is waiting for instructions. Select an object for repair.', kz: 'Авариялық бригада нұсқауларды күтуде. Жөндеуге объектіні таңдаңыз.', pl: 'Ekipa awaryjna czeka na instrukcje. Wybierz obiekt do naprawy.', cs: 'Pohotovostní tým čeká na pokyny. Vyberte objekt k opravě.' },

    // Крок 34: Ремонт (попередження)
    repairWarningTitle: { ua: '⚠️ Ремонт', en: '⚠️ Repair', kz: '⚠️ Жөндеу', pl: '⚠️ Naprawa', cs: '⚠️ Oprava' },
    repairWarningText: { ua: 'Бригада прийняла виклик. Зверніть увагу! Якщо бригада потрапить під обстріл, вона може зазнати поранень, а ремонт об\'єкта буде зупинено.', en: 'The crew has accepted the call. Note! If the crew comes under fire, they may be injured and the object repair will be stopped.', kz: 'Бригада шақыруды қабылдады. Назар аударыңыз! Егер бригада атыс астында қалса, олар жарақат алуы мүмкін және объектіні жөндеу тоқтатылады.', pl: 'Ekipa przyjęła wezwanie. Uwaga! Jeśli ekipa znajdzie się pod ostrzałem, może zostać ranna, a naprawa obiektu zostanie wstrzymana.', cs: 'Tým přijal výzvu. Pozor! Pokud se tým dostane pod palbu, může být zraněn a oprava objektu bude zastavena.' },

    // Крок 35: Аеродром
    airfieldTitle: { ua: '✈️ Аеродром', en: '✈️ Airfield', kz: '✈️ Әуежай', pl: '✈️ Lotnisko', cs: '✈️ Letiště' },
    airfieldText: { ua: 'Командире, час застосовувати авіацію. Побудуйте <b>Аеродром</b>. Він з\'явиться у Волинській області. Будівництво триватиме 30 секунд. Доведеться трохи зачекати...', en: 'Commander, it\'s time to use aviation. Build an <b>Airfield</b>. It will appear in Volyn region. Construction will take 30 seconds. You\'ll have to wait a bit...', kz: 'Командир, авиацияны қолдану уақыты келді. <b>Әуежай</b> салыңыз. Ол Волынь облысында пайда болады. Құрылыс 30 секунд алады. Біраз күту керек болады...', pl: 'Dowódco, czas użyć lotnictwa. Zbuduj <b>Lotnisko</b>. Pojawi się w obwodzie wołyńskim. Budowa potrwa 30 sekund. Trzeba będzie trochę poczekać...', cs: 'Veliteli, je čas použít letectvo. Postavte <b>Letiště</b>. Objeví se ve Volyňské oblasti. Výstavba bude trvat 30 sekund. Budete muset chvíli počkat...' },

    // Крок 36: Крейсер
    cruiserTitle: { ua: '⚠️ Крейсер', en: '⚠️ Cruiser', kz: '⚠️ Крейсер', pl: '⚠️ Krążownik', cs: '⚠️ Křižník' },
    cruiserText: { ua: 'Командире! Ворожий <b>Крейсер</b> вийшов у море! Нам відомо, що він робить залп з 6 ракет <b>Калібр</b> по одному з об\'єктів критичної інфраструктури. Дуже небезпечно!', en: 'Commander! An enemy <b>Cruiser</b> has entered the sea! We know it fires a salvo of 6 <b>Kalibr</b> rockets at one of the critical infrastructure objects. Very dangerous!', kz: 'Командир! Жау <b>Крейсері</b> теңізге шықты! Біз ол маңызды инфрақұрылым объектілерінің біріне 6 <b>Калибр</b> зымыранын атып жіберетінін білеміз. Өте қауіпті!', pl: 'Dowódco! Wrogi <b>Krążownik</b> wypłynął na morze! Wiemy, że wystrzeliwuje salwę 6 rakiet <b>Kalibr</b> w jeden z obiektów infrastruktury krytycznej. Bardzo niebezpieczne!', cs: 'Veliteli! Nepřátelský <b>Křižník</b> vyplul na moře! Víme, že vystřeluje salvu 6 raket <b>Kalibr</b> na jeden z objektů kritické infrastruktury. Velmi nebezpečné!' },

    // Крок 37: F-16
    f16Title: { ua: '✈️ F-16', en: '✈️ F-16', kz: '✈️ F-16', pl: '✈️ F-16', cs: '✈️ F-16' },
    f16Text: { ua: 'Придбайте <b>F-16</b>. Розмістити його можна виключно на території <b>Аеродрому</b>.', en: 'Purchase <b>F-16</b>. It can only be placed on the <b>Airfield</b> territory.', kz: '<b>F-16</b> сатып алыңыз. Оны тек <b>Әуежай</b> аумағына орналастыруға болады.', pl: 'Kup <b>F-16</b>. Można go umieścić wyłącznie na terenie <b>Lotniska</b>.', cs: 'Zakupte <b>F-16</b>. Lze jej umístit pouze na území <b>Letiště</b>.' },

    // Крок 38: Переміщення літака (вибір)
    moveSelectTitle: { ua: '✈️ Переміщення літака', en: '✈️ Aircraft Movement', kz: '✈️ Ұшақты жылжыту', pl: '✈️ Przemieszczenie samolotu', cs: '✈️ Přesun letadla' },
    moveSelectText: { ua: 'Оберіть <b>F-16</b> для керування.', en: 'Select <b>F-16</b> for control.', kz: 'Басқару үшін <b>F-16</b> таңдаңыз.', pl: 'Wybierz <b>F-16</b> do sterowania.', cs: 'Vyberte <b>F-16</b> pro ovládání.' },

    // Крок 39: Переміщення літака (наказ)
    moveOrderTitle: { ua: '✈️ Переміщення літака', en: '✈️ Aircraft Movement', kz: '✈️ Ұшақты жылжыту', pl: '✈️ Przemieszczenie samolotu', cs: '✈️ Přesun letadla' },
    moveOrderText: { ua: 'Віддайте наказ <b>"Перемістити літак"</b> у Запорізьку область.', en: 'Give the order to <b>"Move aircraft"</b> to Zaporizhzhia region.', kz: 'Запорожье облысына <b>"Ұшақты жылжыту"</b> бұйрығын беріңіз.', pl: 'Wydaj rozkaz <b>"Przenieś samolot"</b> do obwodu zaporoskiego.', cs: 'Vydejte příkaz k <b>"Přesunu letadla"</b> do Záporožské oblasti.' },

    // Крок 40: Переміщення літака (очікування)
    moveWaitTitle: { ua: '⏳ Переміщення літака', en: '⏳ Aircraft Movement', kz: '⏳ Ұшақты жылжыту', pl: '⏳ Przemieszczenie samolotu', cs: '⏳ Přesun letadla' },
    moveWaitText: { ua: 'Доведеться трохи зачекати... <b>F-16</b> прямує до вказаної позиції.', en: 'You\'ll have to wait a bit... <b>F-16</b> is heading to the indicated position.', kz: 'Біраз күту керек болады... <b>F-16</b> көрсетілген позицияға бағытталуда.', pl: 'Trzeba będzie trochę poczekać... <b>F-16</b> zmierza na wskazaną pozycję.', cs: 'Budete muset chvíli počkat... <b>F-16</b> míří na určenou pozici.' },

    // Крок 41: Переміщення успішно
    moveSuccessTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    moveSuccessText: { ua: 'Літаки можна переміщувати по всій території України. Але пам\'ятайте, що переліт займає деякий час.', en: 'Aircraft can be moved across the entire territory of Ukraine. But remember that the flight takes some time.', kz: 'Ұшақтарды Украина аумағы бойынша жылжытуға болады. Бірақ ұшу біраз уақыт алатынын есте сақтаңыз.', pl: 'Samoloty można przemieszczać po całym terytorium Ukrainy. Ale pamiętaj, że przelot zajmuje trochę czasu.', cs: 'Letadla lze přesouvat po celém území Ukrajiny. Ale pamatujte, že let zabere nějaký čas.' },

    // Крок 42: Залп Калібрів
    kalibrSalvoTitle: { ua: '⚠️ Крейсер', en: '⚠️ Cruiser', kz: '⚠️ Крейсер', pl: '⚠️ Krążownik', cs: '⚠️ Křižník' },
    kalibrSalvoText: { ua: 'Наші радари фіксують активність... Ворожий <b>Крейсер</b> здійснив залп...', en: 'Our radars are detecting activity... The enemy <b>Cruiser</b> has fired a salvo...', kz: 'Біздің радарлар белсенділікті анықтады... Жау <b>Крейсері</b> залп жасады...', pl: 'Nasze radary wykrywają aktywność... Wrogi <b>Krążownik</b> oddał salwę...', cs: 'Naše radary detekují aktivitu... Nepřátelský <b>Křižník</b> vystřelil salvu...' },

    // Крок 43: Успіх (Калібри)
    kalibrSuccessTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    kalibrSuccessText: { ua: '<b>F-16</b> успішно перехопив усі ракети типу <b>Калібр</b>. Командире! Настав час помститися ворогу та знищити <b>Крейсер!</b>', en: '<b>F-16</b> successfully intercepted all <b>Kalibr</b> type rockets. Commander! It\'s time to take revenge on the enemy and destroy the <b>Cruiser!</b>', kz: '<b>F-16</b> барлық <b>Калибр</b> типті зымырандарды сәтті ұстап алды. Командир! Жауға кек алып, <b>Крейсерді</b> жою уақыты келді!', pl: '<b>F-16</b> pomyślnie przechwycił wszystkie rakiety typu <b>Kalibr</b>. Dowódco! Nadszedł czas na zemstę na wrogu i zniszczenie <b>Krążownika!</b>', cs: '<b>F-16</b> úspěšně zachytil všechny rakety typu <b>Kalibr</b>. Veliteli! Je čas pomstít se nepříteli a zničit <b>Křižník!</b>' },

    // Крок 44: Атака крейсера
    attackCruiserTitle: { ua: '💥 Атака', en: '💥 Attack', kz: '💥 Шабуыл', pl: '💥 Atak', cs: '💥 Útok' },
    attackCruiserText: { ua: 'Оберіть <b>F-16</b> для керування. Віддайте наказ <b>"Атакувати Крейсер"</b>.', en: 'Select <b>F-16</b> for control. Give the order to <b>"Attack Cruiser"</b>.', kz: 'Басқару үшін <b>F-16</b> таңдаңыз. <b>"Крейсерге шабуыл"</b> бұйрығын беріңіз.', pl: 'Wybierz <b>F-16</b> do sterowania. Wydaj rozkaz <b>"Atakuj Krążownik"</b>.', cs: 'Vyberte <b>F-16</b> pro ovládání. Vydejte příkaz <b>"Útok na křižník"</b>.' },

    // Крок 45: Крейсер знищено
    cruiserDestroyedTitle: { ua: '✅ Відмінно!', en: '✅ Excellent!', kz: '✅ Керемет!', pl: '✅ Świetnie!', cs: '✅ Výborně!' },
    cruiserDestroyedText: { ua: '<b>Крейсер</b> знищено! Після повернення на <b>Аеродром</b>, <b>F-16</b> буде готовий до бою через 30 секунд.', en: 'The <b>Cruiser</b> is destroyed! After returning to the <b>Airfield</b>, <b>F-16</b> will be ready for combat in 30 seconds.', kz: '<b>Крейсер</b> жойылды! <b>Әуежайға</b> оралғаннан кейін <b>F-16</b> 30 секундта ұрысқа дайын болады.', pl: '<b>Krążownik</b> został zniszczony! Po powrocie na <b>Lotnisko</b>, <b>F-16</b> będzie gotowy do walki za 30 sekund.', cs: '<b>Křižník</b> je zničen! Po návratu na <b>Letiště</b> bude <b>F-16</b> připraven k boji za 30 sekund.' },

    // Крок 46: Вітаємо
    congratsTitle: { ua: '🎓 Вітаємо!', en: '🎓 Congratulations!', kz: '🎓 Құттықтаймыз!', pl: '🎓 Gratulacje!', cs: '🎓 Gratulujeme!' },
    congratsText: { ua: 'Командире! Ви успішно пройшли базову підготовку!', en: 'Commander! You have successfully completed basic training!', kz: 'Командир! Сіз базалық дайындықты сәтті аяқтадыңыз!', pl: 'Dowódco! Pomyślnie ukończyłeś podstawowe szkolenie!', cs: 'Veliteli! Úspěšně jste absolvovali základní výcvik!' },

    // Крок 47: Довідка
    helpTitle: { ua: '📖 Довідка', en: '📖 Help', kz: '📖 Анықтама', pl: '📖 Pomoc', cs: '📖 Nápověda' },
    helpText: { ua: 'Не забудьте переглянути розділ <b>"Довідка"</b>. Там Ви можете знайти детальну інформацію про всі системи ППО та повітряні загрози.', en: 'Don\'t forget to check the <b>"Help"</b> section. There you can find detailed information about all air defense systems and air threats.', kz: '<b>"Анықтама"</b> бөлімін қарауды ұмытпаңыз. Онда сіз барлық әуе қорғаныс жүйелері мен әуе қауіптері туралы толық ақпаратты таба аласыз.', pl: 'Nie zapomnij sprawdzić sekcji <b>"Pomoc"</b>. Znajdziesz tam szczegółowe informacje o wszystkich systemach obrony powietrznej i zagrożeniach powietrznych.', cs: 'Nezapomeňte se podívat do sekce <b>"Nápověda"</b>. Tam najdete podrobné informace o všech systémech protivzdušné obrany a vzdušných hrozbách.' },

    // Крок 48: Завершення
    endTitle: { ua: '💙💛', en: '💙💛', kz: '💙💛', pl: '💙💛', cs: '💙💛' },
    endText: { ua: 'Війна в Україні триває... Це не гра... Ніколи не нехтуйте сигналами повітряної тривоги. Бережіть себе! <b>Слава Україні!</b>', en: 'The war in Ukraine continues... This is not a game... Never ignore air raid signals. Take care of yourself! <b>Glory to Ukraine!</b>', kz: 'Украинадағы соғыс жалғасуда... Бұл ойын емес... Ешқашан әуе шабуылы дабылдарын елемеңіз. Өзіңізді сақтаңыз! <b>Украинаға Дан!</b>', pl: 'Wojna w Ukrainie trwa... To nie gra... Nigdy nie lekceważ sygnałów alarmu lotniczego. Dbaj o siebie! <b>Chwała Ukrainie!</b>', cs: 'Válka na Ukrajině pokračuje... Toto není hra... Nikdy neignorujte signály leteckého poplachu. Opatrujte se! <b>Sláva Ukrajině!</b>' },

    // Тост-повідомлення
    nextTargetInRegion: { ua: 'Наступна ціль в {region} області', en: 'Next target in {region} region', kz: 'Келесі мақсат {region} облысында', pl: 'Następny cel w obwodzie {region}', cs: 'Další cíl v {region} oblasti' },
    cherkasyRegion: { ua: 'Черкаській', en: 'Cherkasy', kz: 'Черкассы', pl: 'czerkaskim', cs: 'Čerkaské' }
  },

  // ========================================
  // РАНГОВИЙ РЕЖИМ
  // ========================================
  ranked: {
    title: { ua: '🏆 РАНГОВИЙ БІЙ ЗАВЕРШЕНО', en: '🏆 RANKED BATTLE COMPLETE', kz: '🏆 РАНГІЛІ ШАЙҚАС АЯҚТАЛДЫ', pl: '🏆 RANKINGOWA BITWA ZAKOŃCZONA', cs: '🏆 HODNOCENÁ BITVA DOKONČENA' },
    allTargetsDestroyed: { ua: 'Всі цілі знищено...', en: 'All targets destroyed...', kz: 'Барлық мақсаттар жойылды...', pl: 'Wszystkie cele zniszczone...', cs: 'Všechny cíle zničeny...' },
    statistics: { ua: '📊 СТАТИСТИКА', en: '📊 STATISTICS', kz: '📊 СТАТИСТИКА', pl: '📊 STATYSTYKI', cs: '📊 STATISTIKY' },
    shahedsKilled: { ua: 'Шахеди:', en: 'Shaheds:', kz: 'Шахедтер:', pl: 'Shahedy:', cs: 'Shahedy:' },
    heavyDronesKilled: { ua: 'Важкі дрони:', en: 'Heavy Drones:', kz: 'Ауыр дрондар:', pl: 'Ciężkie drony:', cs: 'Těžké drony:' },
    rocketsKilled: { ua: 'Ракети:', en: 'Rockets:', kz: 'Зымырандар:', pl: 'Rakiety:', cs: 'Rakety:' },
    kalibrsKilled: { ua: 'Калібри:', en: 'Kalibrs:', kz: 'Калибрлер:', pl: 'Kalibry:', cs: 'Kalibry:' },
    waveReached: { ua: 'Досягнута хвиля:', en: 'Wave Reached:', kz: 'Жеткен толқын:', pl: 'Osiągnięta fala:', cs: 'Dosažená vlna:' },
    tryAgain: { ua: 'Спробувати ще!', en: 'Try Again!', kz: 'Қайталап көру!', pl: 'Spróbuj ponownie!', cs: 'Zkuste to znovu!' },
    selectDeck: { ua: 'Оберіть колоду', en: 'Select Deck', kz: 'Колоданы таңдаңыз', pl: 'Wybierz talię', cs: 'Vybrat balíček' },
    noPPO: { ua: 'У вас немає ППО! Відкрийте сундуки.', en: 'You have no air defense! Open chests.', kz: 'Сізде әуе қорғанысы жоқ! Сандықтарды ашыңыз.', pl: 'Nie masz obrony przeciwlotniczej! Otwórz skrzynie.', cs: 'Nemáte protivzdušnou obranu! Otevřete truhly.' }
  },

  // ========================================
  // БУДІВЛІ
  // ========================================
  buildings: {
    tec: { ua: 'ТЕЦ', en: 'Power Plant', kz: 'ЖЭО', pl: 'Elektrownia', cs: 'Elektrárna' },
    gas: { ua: 'ГЕС', en: 'Hydroelectric', kz: 'СЭС', pl: 'Hydroelectric', cs: 'Hydroelectric' },
    factory: { ua: 'Завод', en: 'Factory', kz: 'Зауыт', pl: 'Fabryka', cs: 'Továrna' },
    airport: { ua: 'Аеродром', en: 'Airfield', kz: 'Әуежай', pl: 'Lotnisko', cs: 'Letiště' },
    avariika: { ua: 'Аварійка', en: 'Emergency', kz: 'Авариялық', pl: 'Pogotowie', cs: 'Pohotovost' }
  },

  // ========================================
  // УМОВИ ВИКОРИСТАННЯ (terms.html)
  // ========================================
  terms: {
    title: { ua: 'Умови використання', en: 'Terms of Service', kz: 'Қолдану шарттары', pl: 'Regulamin', cs: 'Podmínky služby' },
    effectiveDate: { ua: 'Дата набрання чинності', en: 'Effective date', kz: 'Күшіне ену күні', pl: 'Data wejścia w życie', cs: 'Datum účinnosti' },
    
    // Секції
    section1Title: { ua: '1. Вступ', en: '1. Introduction', kz: '1. Кіріспе', pl: '1. Wstęp', cs: '1. Úvod' },
    section1Text: { ua: 'Реєструючись на веб-сайті DroneFall.online (далі — «Сайт»), Користувач погоджується дотримуватися викладених нижче правил. Порушення цих правил може призвести до обмеження доступу або повного блокування облікового запису.', en: 'By registering on the DroneFall.online website (hereinafter — "Site"), the User agrees to follow the rules below. Violation of these rules may result in restricted access or complete account blocking.', kz: 'DroneFall.online веб-сайтына тіркелу арқылы (бұдан әрі — «Сайт») Пайдаланушы төмендегі ережелерді сақтауға келіседі. Бұл ережелерді бұзу қол жеткізуді шектеуге немесе аккаунтты толық бұғаттауға әкелуі мүмкін.', pl: 'By registering on the DroneFall.online website (hereinafter — "Site"), the User agrees to follow the rules below. Violation of these rules may result in restricted access or complete account blocking.', cs: 'By registering on the DroneFall.online website (hereinafter — "Site"), the User agrees to follow the rules below. Violation of these rules may result in restricted access or complete account blocking.' },
    
    section2Title: { ua: '2. Обмеження відповідальності та заборонений контент', en: '2. Liability Limitations and Prohibited Content', kz: '2. Жауапкершілікті шектеу және тыйым салынған мазмұн', pl: '2. Ograniczenia odpowiedzialności i zakazana treść', cs: '2. Omezení odpovědnosti a zakázaný obsah' },
    section2Text: { ua: 'Адміністрація дотримується політики нульової толерантності до порушень правил спільноти та чинного законодавства. Користувачеві суворо забороняється створювати облікові записи, використовувати Нікнейми (псевдоніми), Імена або розповсюджувати контент, що містить:', en: 'The Administration maintains a zero-tolerance policy for violations of community rules and applicable laws. Users are strictly prohibited from creating accounts, using Nicknames, Names, or distributing content that contains:', kz: 'Әкімшілік қоғамдастық ережелері мен қолданыстағы заңнаманы бұзуға нөлдік төзімділік саясатын ұстанады. Пайдаланушыларға мыналарды қамтитын аккаунттар жасауға, лақап аттар, есімдер пайдалануға немесе мазмұн таратуға қатаң тыйым салынады:', pl: 'The Administration maintains a zero-tolerance policy for violations of community rules and applicable laws. Users are strictly prohibited from creating accounts, using Nicknames, Names, or distributing content that contains:', cs: 'The Administration maintains a zero-tolerance policy for violations of community rules and applicable laws. Users are strictly prohibited from creating accounts, using Nicknames, Names, or distributing content that contains:' },
    
    profanity: { ua: 'Нецензурна лексика (матюки)', en: 'Profanity (obscene language)', kz: 'Ұят сөздер (обсценді лексика)', pl: 'Profanity (obscene language)', cs: 'Profanity (obscene language)' },
    profanityDesc: { ua: 'у будь-якій формі, включаючи завуальовану або транслітеровану.', en: 'in any form, including veiled or transliterated.', kz: 'кез келген түрде, оның ішінде жасырын немесе транслитерацияланған.', pl: 'in any form, including veiled or transliterated.', cs: 'in any form, including veiled or transliterated.' },
    hateSpeech: { ua: 'Мова ворожнечі', en: 'Hate speech', kz: 'Жеккөрушілік сөздер', pl: 'Mowa nienawiści', cs: 'Nenávistné projevy' },
    hateSpeechDesc: { ua: 'висловлювання, що принижують честь і гідність, або розпалюють ненависть за ознаками раси, національності, релігії, статі чи сексуальної орієнтації.', en: 'statements that demean honor and dignity, or incite hatred based on race, nationality, religion, gender, or sexual orientation.', kz: 'ар-намысты қорлайтын немесе нәсіл, ұлт, дін, жыныс немесе жыныстық бағдар негізінде жеккөрушілікті қоздыратын мәлімдемелер.', pl: 'statements that demean honor and dignity, or incite hatred based on race, nationality, religion, gender, or sexual orientation.', cs: 'statements that demean honor and dignity, or incite hatred based on race, nationality, religion, gender, or sexual orientation.' },
    cheating: { ua: 'Шахрайство та технічні зловживання', en: 'Fraud and technical abuse', kz: 'Алаяқтық және техникалық теріс пайдалану', pl: 'Fraud and technical abuse', cs: 'Fraud and technical abuse' },
    cheatingDesc: { ua: 'використання програмних помилок (багів), стороннього програмного забезпечення (чітів, ботів) для отримання нечесних переваг, злому або порушення роботи Сервісу.', en: 'using software bugs, third-party software (cheats, bots) to gain unfair advantages, hacking, or disrupting the Service.', kz: 'бағдарламалық қателерді, үшінші тарап бағдарламаларын (читтер, боттар) әділетсіз артықшылықтар алу, бұзу немесе Қызметтің жұмысын бұзу үшін пайдалану.', pl: 'using software bugs, third-party software (cheats, bots) to gain unfair advantages, hacking, or disrupting the Service.', cs: 'using software bugs, third-party software (cheats, bots) to gain unfair advantages, hacking, or disrupting the Service.' },
    
    section2_2Title: { ua: 'Заборона дискредитації та образ Проекту', en: 'Prohibition of Discreditation and Project Insults', kz: 'Жобаны дискредитациялауға және қорлауға тыйым салу', pl: 'Prohibition of Discreditation and Project Insults', cs: 'Prohibition of Discreditation and Project Insults' },
    publicInsults: { ua: 'Публічні образи', en: 'Public insults', kz: 'Жария қорлау', pl: 'Publiczne obelgi', cs: 'Veřejné urážky' },
    publicInsultsDesc: { ua: 'Розповсюдження повідомлень (у ігровому чаті, на сторонніх ресурсах або у зверненнях до підтримки), що містять принизливі, грубі або образливі висловлювання на адресу Адміністрації, розробників або модераторів гри.', en: 'Distribution of messages (in game chat, on third-party resources, or in support requests) containing demeaning, rude, or offensive statements towards Administration, developers, or game moderators.', kz: 'Әкімшілікке, әзірлеушілерге немесе ойын модераторларына қорлайтын, дөрекі немесе қорлайтын мәлімдемелерді қамтитын хабарларды тарату (ойын чатында, үшінші тарап ресурстарында немесе қолдау сұрауларында).', pl: 'Distribution of messages (in game chat, on third-party resources, or in support requests) containing demeaning, rude, or offensive statements towards Administration, developers, or game moderators.', cs: 'Distribution of messages (in game chat, on third-party resources, or in support requests) containing demeaning, rude, or offensive statements towards Administration, developers, or game moderators.' },
    discreditation: { ua: 'Дискредитація', en: 'Discreditation', kz: 'Дискредитация', pl: 'Discreditation', cs: 'Discreditation' },
    discreditationDesc: { ua: 'Поширення завідомо неправдивої інформації (наклепу), що підриває довіру до сервісу DroneFall, або необґрунтована деструктивна критика, що має на меті завдання шкоди репутації проекту.', en: 'Spreading knowingly false information (slander) that undermines trust in DroneFall service, or unjustified destructive criticism aimed at damaging the project\'s reputation.', kz: 'DroneFall қызметіне сенімді бұзатын әдейі жалған ақпаратты (жала жабуды) тарату немесе жобаның беделіне зиян келтіруге бағытталған негізсіз деструктивті сын.' },
    
    section3Title: { ua: '3. Політика нульової толерантності до антидержавного контенту', en: '3. Zero Tolerance Policy for Anti-State Content', kz: '3. Мемлекетке қарсы мазмұнға нөлдік төзімділік саясаты', pl: '3. Polityka zerowej tolerancji dla treści antypaństwowych', cs: '3. Politika nulové tolerance vůči protiukrajinskému obsahu' },
    section3Warning: { ua: 'Заборона антиукраїнської діяльності', en: 'Prohibition of Anti-Ukrainian Activity', kz: 'Украинаға қарсы қызметке тыйым салу', pl: 'Prohibition of Anti-Ukrainian Activity', cs: 'Prohibition of Anti-Ukrainian Activity' },
    section3Text: { ua: 'Адміністрація DroneFall займає чітку проукраїнську позицію. На Сайті та у Грі суворо забороняються будь-які дії, висловлювання (текстові, голосові) або використання графічних матеріалів, що прямо чи опосередковано спрямовані на підрив національної безпеки України.', en: 'DroneFall Administration maintains a clear pro-Ukrainian position. Any actions, statements (text, voice), or use of graphic materials directly or indirectly aimed at undermining Ukraine\'s national security are strictly prohibited on the Site and in the Game.', kz: 'DroneFall әкімшілігі анық проукраиндық ұстанымды ұстанады. Украинаның ұлттық қауіпсіздігін тікелей немесе жанама түрде бұзуға бағытталған кез келген әрекеттер, мәлімдемелер (мәтіндік, дауыстық) немесе графикалық материалдарды пайдалану Сайт пен Ойында қатаң тыйым салынады.' },
    
    section4Title: { ua: '4. Санкції та наслідки порушення', en: '4. Sanctions and Consequences', kz: '4. Санкциялар мен салдарлар', pl: '4. Sankcje i konsekwencje', cs: '4. Sankce a důsledky' },
    section4Text: { ua: 'У разі виявлення порушень Адміністрація залишає за собою право:', en: 'If violations are detected, the Administration reserves the right to:', kz: 'Бұзушылықтар анықталған жағдайда Әкімшілік мына құқықтарды өзіне қалдырады:', pl: 'If violations are detected, the Administration reserves the right to:', cs: 'If violations are detected, the Administration reserves the right to:' },
    sanction1: { ua: 'Тимчасово призупинити доступ до акаунту', en: 'Temporarily suspend account access', kz: 'Аккаунтқа қол жеткізуді уақытша тоқтата тұру', pl: 'Temporarily suspend account access', cs: 'Temporarily suspend account access' },
    sanction2: { ua: 'Примусово змінити інформацію користувача (нікнейм)', en: 'Forcibly change user information (nickname)', kz: 'Пайдаланушы ақпаратын (лақап атын) мәжбүрлеп өзгерту', pl: 'Forcibly change user information (nickname)', cs: 'Forcibly change user information (nickname)' },
    sanction3: { ua: 'Безповоротно видалити обліковий запис (Perma-Ban) без права на відновлення та без компенсації', en: 'Permanently delete the account (Perma-Ban) without restoration rights and without compensation', kz: 'Аккаунтты қалпына келтіру құқығынсыз және өтемақысыз біржола жою (Perma-Ban)', pl: 'Permanently delete the account (Perma-Ban) without restoration rights and without compensation', cs: 'Permanently delete the account (Perma-Ban) without restoration rights and without compensation' },
    
    section5Title: { ua: '5. Заключні положення', en: '5. Final Provisions', kz: '5. Қорытынды ережелер', pl: '5. Postanowienia końcowe', cs: '5. Závěrečná ustanovení' },
    section5Text: { ua: 'У разі незгоди з цими правилами, Користувач зобов\'язаний негайно припинити використання Сайту.', en: 'If you disagree with these rules, the User must immediately stop using the Site.', kz: 'Осы ережелермен келіспеген жағдайда, Пайдаланушы Сайтты пайдалануды дереу тоқтатуға міндетті.' }
  },

  // ========================================
  // ПОЛІТИКА КОНФІДЕНЦІЙНОСТІ (privacy.html)
  // ========================================
  privacy: {
    title: { ua: 'Політика конфіденційності', en: 'Privacy Policy', kz: 'Құпиялылық саясаты', pl: 'Polityka prywatności', cs: 'Zásady ochrany osobních údajů' },
    effectiveDate: { ua: 'Дата набрання чинності', en: 'Effective date', kz: 'Күшіне ену күні', pl: 'Data wejścia w życie', cs: 'Datum účinnosti' },
    
    section1Title: { ua: '1. Загальні положення', en: '1. General Provisions', kz: '1. Жалпы ережелер', pl: '1. Postanowienia ogólne', cs: '1. Obecná ustanovení' },
    section1Text1: { ua: 'Ця Політика конфіденційності визначає порядок одержання, зберігання, обробки, використання і розкриття персональних даних Користувача веб-сайту DroneFall.online.', en: 'This Privacy Policy defines the procedure for obtaining, storing, processing, using, and disclosing personal data of DroneFall.online website Users.', kz: 'Бұл Құпиялылық саясаты DroneFall.online веб-сайты Пайдаланушыларының жеке деректерін алу, сақтау, өңдеу, пайдалану және ашу тәртібін анықтайды.', pl: 'Niniejsza Polityka prywatności określa procedurę pozyskiwania, przechowywania, przetwarzania, wykorzystywania i ujawniania danych osobowych Użytkowników strony DroneFall.online.', cs: 'Tyto Zásady ochrany osobních údajů definují postup získávání, ukládání, zpracování, používání a zveřejňování osobních údajů uživatelů webu DroneFall.online.' },
    section1Text2: { ua: 'Використовуючи Сайт та/або проходячи процедуру реєстрації, Користувач підтверджує свою згоду на збір та обробку своїх персональних даних.', en: 'By using the Site and/or completing registration, the User confirms consent to the collection and processing of personal data.', kz: 'Сайтты пайдалану және/немесе тіркеуден өту арқылы Пайдаланушы жеке деректерін жинау мен өңдеуге келісімін растайды.', pl: 'By using the Site and/or completing registration, the User confirms consent to the collection and processing of personal data.', cs: 'By using the Site and/or completing registration, the User confirms consent to the collection and processing of personal data.' },
    
    section2Title: { ua: '2. Обсяг та склад персональних даних', en: '2. Scope and Composition of Personal Data', kz: '2. Жеке деректердің көлемі мен құрамы', pl: '2. Zakres i skład danych osobowych', cs: '2. Rozsah a složení osobních údajů' },
    section2_1Title: { ua: '2.1. Ідентифікаційні дані (обов\'язкові)', en: '2.1. Identification Data (required)', kz: '2.1. Сәйкестендіру деректері (міндетті)' },
    dataEmail: { ua: 'Адреса електронної пошти (E-mail)', en: 'Email address', kz: 'Электрондық пошта мекенжайы (E-mail)', pl: 'Adres email', cs: 'E-mailová adresa' },
    dataEmailDesc: { ua: 'використовується як унікальний ідентифікатор Користувача та для відновлення паролю.', en: 'used as a unique User identifier and for password recovery.', kz: 'Пайдаланушының бірегей идентификаторы және құпия сөзді қалпына келтіру үшін қолданылады.', pl: 'used as a unique User identifier and for password recovery.', cs: 'used as a unique User identifier and for password recovery.' },
    dataNickname: { ua: 'Нікнейм (Псевдонім)', en: 'Nickname (Alias)', kz: 'Лақап аты (Бүркеншік ат)', pl: 'Nickname (Alias)', cs: 'Nickname (Alias)' },
    dataNicknameDesc: { ua: 'публічне ім\'я Користувача в ігровому інтерфейсі.', en: 'public User name in the game interface.', kz: 'ойын интерфейсіндегі Пайдаланушының жария аты.' },
    dataPassword: { ua: 'Пароль', en: 'Password', kz: 'Құпия сөз', pl: 'Hasło', cs: 'Heslo' },
    dataPasswordDesc: { ua: 'зберігається виключно у зашифрованому (хешованому) вигляді.', en: 'stored exclusively in encrypted (hashed) form.', kz: 'тек шифрленген (хэштелген) түрде сақталады.', pl: 'stored exclusively in encrypted (hashed) form.', cs: 'stored exclusively in encrypted (hashed) form.' },
    
    section2_2Title: { ua: '2.2. Персоналізовані дані (додаткові)', en: '2.2. Personalized Data (optional)', kz: '2.2. Жекелендірілген деректер (қосымша)', pl: '2.2. Personalized Data (optional)', cs: '2.2. Personalized Data (optional)' },
    dataName: { ua: 'Ім\'я', en: 'Name', kz: 'Аты', pl: 'Imię', cz: 'Jméno' },
    dataNameDesc: { ua: 'для персоналізації звернень.', en: 'for personalized communications.', kz: 'жеке хабарламалар үшін.', pl: 'for personalized communications.', cs: 'for personalized communications.' },
    dataBirthdate: { ua: 'Дата народження', en: 'Date of birth', kz: 'Туған күні', pl: 'Date of birth', cs: 'Date of birth' },
    dataBirthdateDesc: { ua: 'для вікової статистики та бонусних програм.', en: 'for age statistics and bonus programs.', kz: 'жас статистикасы және бонустық бағдарламалар үшін.', pl: 'for age statistics and bonus programs.', cs: 'for age statistics and bonus programs.' },
    
    section2_3Title: { ua: '2.3. Технічні дані (автоматично)', en: '2.3. Technical Data (automatic)', kz: '2.3. Техникалық деректер (автоматты)', pl: '2.3. Technical Data (automatic)', cs: '2.3. Technical Data (automatic)' },
    section2_3Text: { ua: 'IP-адреса, тип браузера, операційна система, час перебування на Сайті.', en: 'IP address, browser type, operating system, time spent on the Site.', kz: 'IP мекенжайы, браузер түрі, операциялық жүйе, Сайтта өткізген уақыт.', pl: 'IP address, browser type, operating system, time spent on the Site.', cs: 'IP address, browser type, operating system, time spent on the Site.' },
    
    section3Title: { ua: '3. Цілі обробки персональних даних', en: '3. Purposes of Personal Data Processing', kz: '3. Жеке деректерді өңдеу мақсаттары', pl: '3. Cele przetwarzania danych osobowych', cs: '3. Účely zpracování osobních údajů' },
    purpose1: { ua: 'Надання доступу до функціоналу гри', en: 'Providing access to game functionality', kz: 'Ойын функционалдығына қол жеткізуді қамтамасыз ету', pl: 'Providing access to game functionality', cs: 'Providing access to game functionality' },
    purpose2: { ua: 'Збереження ігрового прогресу', en: 'Saving game progress', kz: 'Ойын прогресін сақтау', pl: 'Saving game progress', cs: 'Saving game progress' },
    purpose3: { ua: 'Сервісні сповіщення та бонусна програма', en: 'Service notifications and bonus programs', kz: 'Қызмет хабарламалары және бонустық бағдарламалар', pl: 'Service notifications and bonus programs', cs: 'Service notifications and bonus programs' },
    purpose4: { ua: 'Запобігання шахрайству та забезпечення безпеки', en: 'Fraud prevention and security', kz: 'Алаяқтықтың алдын алу және қауіпсіздікті қамтамасыз ету', pl: 'Fraud prevention and security', cs: 'Fraud prevention and security' },
    
    section4Title: { ua: '4. Використання файлів Cookie', en: '4. Use of Cookies', kz: '4. Cookie файлдарын пайдалану', pl: '4. Używanie plików Cookie', cs: '4. Používání souborů Cookie' },
    section4Text: { ua: 'Сайт використовує cookies для автентифікації та збору аналітики. Користувач може налаштувати браузер для відхилення cookies.', en: 'The Site uses cookies for authentication and analytics. Users can configure their browser to reject cookies.', kz: 'Сайт аутентификация және аналитика жинау үшін cookies пайдаланады. Пайдаланушы браузерді cookies-ті қабылдамау үшін теңшей алады.', pl: 'The Site uses cookies for authentication and analytics. Users can configure their browser to reject cookies.', cs: 'The Site uses cookies for authentication and analytics. Users can configure their browser to reject cookies.' },
    
    section5Title: { ua: '5. Взаємодія з третіми сторонами', en: '5. Third-Party Interactions', kz: '5. Үшінші тараптармен өзара әрекеттесу', pl: '5. Współpraca z podmiotami trzecimi', cs: '5. Interakce s třetími stranami' },
    section5Text: { ua: 'Адміністрація не продає персональні дані третім особам. Розкриття можливе лише у випадках, передбачених законодавством.', en: 'The Administration does not sell personal data to third parties. Disclosure is only possible in cases provided by law.', kz: 'Әкімшілік жеке деректерді үшінші тараптарға сатпайды. Ашу тек заңнамада көзделген жағдайларда ғана мүмкін.', pl: 'The Administration does not sell personal data to third parties. Disclosure is only possible in cases provided by law.', cs: 'The Administration does not sell personal data to third parties. Disclosure is only possible in cases provided by law.' },
    
    section6Title: { ua: '6. Зберігання та захист інформації', en: '6. Data Storage and Protection', kz: '6. Ақпаратты сақтау және қорғау', pl: '6. Przechowywanie i ochrona danych', cs: '6. Ukládání a ochrana dat' },
    section6Text: { ua: 'Використовуються протоколи шифрування (SSL/TLS) та регулярний аудит систем безпеки.', en: 'Encryption protocols (SSL/TLS) and regular security system audits are used.', kz: 'Шифрлау протоколдары (SSL/TLS) және қауіпсіздік жүйелерінің тұрақты аудиті қолданылады.', pl: 'Encryption protocols (SSL/TLS) and regular security system audits are used.', cs: 'Encryption protocols (SSL/TLS) and regular security system audits are used.' },
    
    section7Title: { ua: '7. Права користувача', en: '7. User Rights', kz: '7. Пайдаланушы құқықтары', pl: '7. Prawa użytkownika', cs: '7. Práva uživatele' },
    right1: { ua: 'Знати про джерела та мету обробки даних', en: 'Know the sources and purposes of data processing', kz: 'Деректерді өңдеу көздері мен мақсаттарын білу', pl: 'Know the sources and purposes of data processing', cs: 'Know the sources and purposes of data processing' },
    right2: { ua: 'Вимагати зміни або видалення даних', en: 'Request data modification or deletion', kz: 'Деректерді өзгертуді немесе жоюды сұрау', pl: 'Request data modification or deletion', cs: 'Request data modification or deletion' },
    right3: { ua: 'Відкликати згоду на обробку', en: 'Withdraw processing consent', kz: 'Өңдеуге келісімді кері қайтарып алу', pl: 'Withdraw processing consent', cs: 'Withdraw processing consent' },
    
    section8Title: { ua: '8. Зміни до Політики', en: '8. Policy Changes', kz: '8. Саясаттағы өзгерістер', pl: '8. Zmiany w Polityce', cs: '8. Změny zásad' },
    section8Text: { ua: 'Адміністрація може оновлювати цю Політику. Продовження використання Сайту означає згоду зі змінами.', en: 'The Administration may update this Policy. Continued use of the Site means agreement with changes.', kz: 'Әкімшілік бұл Саясатты жаңарта алады. Сайтты пайдалануды жалғастыру өзгерістермен келісуді білдіреді.', pl: 'The Administration may update this Policy. Continued use of the Site means agreement with changes.', cs: 'The Administration may update this Policy. Continued use of the Site means agreement with changes.' },
    
    contactTitle: { ua: 'Зворотній зв\'язок', en: 'Contact', kz: 'Кері байланыс' },
    contactText: { ua: 'Питання щодо обробки даних надсилайте на:', en: 'Questions about data processing send to:', kz: 'Деректерді өңдеу туралы сұрақтарды мына мекенжайға жіберіңіз:', pl: 'Questions about data processing send to:', cs: 'Questions about data processing send to:' }
  },

  // ========================================
  // РАНГОВИЙ РЕЖИМ
  // ========================================
  ranked: {
    battleComplete: { ua: 'РАНГОВИЙ БІЙ ЗАВЕРШЕНО', en: 'RANKED BATTLE COMPLETE', kz: 'РЕЙТИНГТІК ШАЙҚАС АЯҚТАЛДЫ', pl: 'RANKED BATTLE COMPLETE', cs: 'RANKED BATTLE COMPLETE' },
    statistics: { ua: 'СТАТИСТИКА', en: 'STATISTICS', kz: 'СТАТИСТИКА', pl: 'STATISTICS', cs: 'STATISTICS' },
    shaheds: { ua: 'Шахеди', en: 'Shaheds', kz: 'Шахедтер', pl: 'Shahedy', cs: 'Shahedy' },
    heavyDrones: { ua: 'Важкі дрони', en: 'Heavy drones', kz: 'Ауыр дрондар', pl: 'Ciężkie drony', cs: 'Těžké drony' },
    rockets: { ua: 'Ракети', en: 'Rockets', kz: 'Зымырандар', pl: 'Rakiety', cs: 'Rakety' },
    kalibrs: { ua: 'Калібри', en: 'Kalibrs', kz: 'Калибрлер', pl: 'Kalibry', cs: 'Kalibry' },
    phaseReached: { ua: 'Досягнута фаза', en: 'Phase reached', kz: 'Қол жеткізілген фаза', pl: 'Faza osiągnięta', cs: 'Dosažená fáze' },
    rewards: { ua: 'НАГОРОДИ', en: 'REWARDS', kz: 'СЫЙЛЫҚТАР', pl: 'REWARDS', cs: 'REWARDS' },
    hryvnias: { ua: 'гривень', en: 'hryvnias', kz: 'гривна', pl: 'hryvnias', cs: 'hryvnias' },
    normalChest: { ua: 'звичайний сундук', en: 'normal chest', kz: 'қарапайым сандық', pl: 'normal chest', cs: 'normal chest' },
    premiumChest: { ua: 'преміум сундук', en: 'premium chest', kz: 'премиум сандық', pl: 'premium chest', cs: 'premium chest' },
    mainMenu: { ua: 'Головне меню', en: 'Main Menu', kz: 'Басты мәзір', pl: 'Main Menu', cs: 'Main Menu' }
  },

  // ========================================
  // ПОМИЛКИ
  // ========================================
  errors: {
    notAuthenticated: { ua: 'Ви не авторизовані', en: 'You are not authenticated', kz: 'Сіз авторизацияланбағансыз', pl: 'Nie jesteś zalogowany', cs: 'Nejste přihlášeni' },
    serverError: { ua: 'Помилка сервера', en: 'Server error', kz: 'Сервер қатесі', pl: 'Błąd serwera', cs: 'Chyba serveru' },
    networkError: { ua: 'Помилка мережі', en: 'Network error', kz: 'Желі қатесі', pl: 'Błąd sieci', cs: 'Chyba sítě' },
    loadError: { ua: 'Помилка завантаження', en: 'Loading error', kz: 'Жүктеу қатесі', pl: 'Błąd ładowania', cs: 'Chyba načítání' },
    saveError: { ua: 'Помилка збереження', en: 'Save error', kz: 'Сақтау қатесі', pl: 'Błąd zapisu', cs: 'Chyba ukládání' }
  },

  // ========================================
  // RECOVER (Account Recovery)
  // ========================================
  recover: {
    title:              { ua: 'Відновлення акаунту',            en: 'Account Recovery',              kz: 'Аккаунтты қалпына келтіру',    pl: 'Odzyskiwanie konta',            cs: 'Obnova účtu' },
    emailSub:           { ua: 'Введіть email вашого акаунту',   en: 'Enter your account email',      kz: 'Аккаунт email-іңізді енгізіңіз',pl: 'Podaj email swojego konta',      cs: 'Zadejte e-mail svého účtu' },
    sendCode:           { ua: 'Надіслати код',                  en: 'Send code',                     kz: 'Код жіберу',                   pl: 'Wyślij kod',                    cs: 'Odeslat kód' },
    codeSub:            { ua: 'Перевірте пошту',                en: 'Check your email',              kz: 'Поштаңызды тексеріңіз',        pl: 'Sprawdź pocztę',                cs: 'Zkontrolujte e-mail' },
    resend:             { ua: 'Надіслати повторно',             en: 'Resend',                        kz: 'Қайта жіберу',                 pl: 'Wyślij ponownie',               cs: 'Znovu odeslat' },
    newPasswordTitle:   { ua: 'Новий пароль',                   en: 'New password',                  kz: 'Жаңа құпия сөз',               pl: 'Nowe hasło',                    cs: 'Nové heslo' },
    newPasswordSub:     { ua: 'Встановіть новий пароль',        en: 'Set a new password',            kz: 'Жаңа құпия сөзді орнатыңыз',  pl: 'Ustaw nowe hasło',              cs: 'Nastavte nové heslo' },
    newPassword:        { ua: 'Новий пароль',                   en: 'New password',                  kz: 'Жаңа құпия сөз',               pl: 'Nowe hasło',                    cs: 'Nové heslo' },
    confirmPassword:    { ua: 'Підтвердження пароля',           en: 'Confirm password',              kz: 'Құпия сөзді растаңыз',         pl: 'Potwierdź hasło',               cs: 'Potvrdit heslo' },
    savePassword:       { ua: 'Зберегти пароль',               en: 'Save password',                 kz: 'Құпия сөзді сақтау',           pl: 'Zapisz hasło',                  cs: 'Uložit heslo' },
    successTitle:       { ua: 'Пароль змінено!',               en: 'Password changed!',             kz: 'Құпия сөз өзгертілді!',        pl: 'Hasło zmienione!',              cs: 'Heslo změněno!' },
    successSub:         { ua: 'Тепер можеш увійти з новим паролем.', en: 'You can now log in with your new password.', kz: 'Жаңа құпия сөзбен кіруге болады.', pl: 'Możesz teraz zalogować się nowym hasłem.', cs: 'Nyní se můžete přihlásit novým heslem.' },
    step1of3:           { ua: 'Крок 1 з 3',                    en: 'Step 1 of 3',                   kz: '3-тен 1-қадам',                pl: 'Krok 1 z 3',                    cs: 'Krok 1 ze 3' },
    step2of3:           { ua: 'Крок 2 з 3',                    en: 'Step 2 of 3',                   kz: '3-тен 2-қадам',                pl: 'Krok 2 z 3',                    cs: 'Krok 2 ze 3' },
    step3of3:           { ua: 'Крок 3 з 3',                    en: 'Step 3 of 3',                   kz: '3-тен 3-қадам',                pl: 'Krok 3 z 3',                    cs: 'Krok 3 ze 3' }
  },

  // ========================================
  // CHANGE DATA (Account Settings)
  // ========================================
  changeData: {
    title:           { ua: 'Підтвердження',               en: 'Verification',              kz: 'Растау',                    pl: 'Weryfikacja',                cs: 'Ověření' },
    emailSub:        { ua: 'Введіть email вашого акаунту', en: 'Enter your account email',  kz: 'Аккаунт email-іңізді енгізіңіз', pl: 'Podaj email swojego konta',  cs: 'Zadejte e-mail svého účtu' },
    sendCode:        { ua: 'Надіслати код',                en: 'Send code',                 kz: 'Код жіберу',                pl: 'Wyślij kod',                 cs: 'Odeslat kód' },
    whatToChange:    { ua: 'Що змінити?',                  en: 'What to change?',           kz: 'Нені өзгерту?',             pl: 'Co zmienić?',                cs: 'Co změnit?' },
    chooseOption:    { ua: 'Оберіть, що хочете оновити',   en: 'Choose what to update',     kz: 'Нені жаңартқыңыз келетінін таңдаңыз', pl: 'Wybierz, co chcesz zaktualizować', cs: 'Vyberte, co chcete aktualizovat' },
    newNickname:     { ua: 'Новий нікнейм',                en: 'New nickname',              kz: 'Жаңа лақап ат',             pl: 'Nowy pseudonim',             cs: 'Nová přezdívka' },
    newEmail:        { ua: 'Новий Email',                  en: 'New Email',                 kz: 'Жаңа Email',                pl: 'Nowy Email',                 cs: 'Nový e-mail' },
    newPassword:     { ua: 'Новий пароль',                 en: 'New password',              kz: 'Жаңа құпия сөз',            pl: 'Nowe hasło',                 cs: 'Nové heslo' },
    enterNewData:    { ua: 'Введіть нові дані',            en: 'Enter new data',            kz: 'Жаңа деректерді енгізіңіз', pl: 'Wprowadź nowe dane',         cs: 'Zadejte nové údaje' },
    save:            { ua: 'Зберегти',                     en: 'Save',                      kz: 'Сақтау',                    pl: 'Zapisz',                     cs: 'Uložit' },
    successTitle:    { ua: 'Готово!',                      en: 'Done!',                     kz: 'Дайын!',                    pl: 'Gotowe!',                    cs: 'Hotovo!' },
    successSub:      { ua: 'Дані успішно оновлено.',       en: 'Data updated successfully.',kz: 'Деректер сәтті жаңартылды.',pl: 'Dane zaktualizowane.',       cs: 'Údaje byly úspěšně aktualizovány.' },
    backToProfile:   { ua: 'Повернутись до профілю',       en: 'Back to profile',           kz: 'Профильге оралу',           pl: 'Wróć do profilu',            cs: 'Zpět na profil' },
    verifyCode:      { ua: 'Код підтвердження',            en: 'Verification code',         kz: 'Растау коды',               pl: 'Kod weryfikacyjny',          cs: 'Ověřovací kód' }
  },

  // ========================================
  // LUCKY BOX
  // ========================================
  luckyBox: {
    open:         { ua: 'Відкрити',   en: 'Open',        kz: 'Ашу',        pl: 'Otwórz',    cs: 'Otevřít' },
    openQuick:    { ua: 'Відкрити',   en: 'Open',        kz: 'Ашу',        pl: 'Otwórz',    cs: 'Otevřít' },
    claim:        { ua: 'Отримати',   en: 'Claim',       kz: 'Алу',        pl: 'Odbierz',   cs: 'Získat' },
    quantity:     { ua: 'Кількість',  en: 'Quantity',    kz: 'Саны',       pl: 'Ilość',     cs: 'Množství' },
    secretCode:   { ua: 'Секретний код', en: 'Secret Code', kz: 'Құпия код', pl: 'Tajny kod', cs: 'Tajný kód' },
    notEnough:    { ua: 'Недостатньо секретних кодів', en: 'Not enough secret codes', kz: 'Құпия кодтар жеткіліксіз', pl: 'Za mało tajnych kodów', cs: 'Nedostatek tajných kódů' },
    error:        { ua: 'Помилка відкриття', en: 'Open error', kz: 'Ашу қатесі', pl: 'Błąd otwierania', cs: 'Chyba otevírání' }
  }
};

// ========================================
// ПОТОЧНА МОВА (зберігається в localStorage)
// ========================================
let currentLanguage = localStorage.getItem('dronefall_language') || 'ua';

// ========================================
// ЛОКАЛІЗОВАНІ URL ДЛЯ ДОКУМЕНТІВ
// ========================================
function getLocalizedUrl(baseName) {
  var lang = localStorage.getItem('dronefall_language') || 'ua';
  if (lang === 'ua') return baseName + '.html';
  return baseName + '_' + lang + '.html';
}

function openLocalizedPage(baseName) {
  window.open(getLocalizedUrl(baseName), '_blank');
}

// Глобальний доступ
window.getLocalizedUrl = getLocalizedUrl;
window.openLocalizedPage = openLocalizedPage;

// ========================================
// ФУНКЦІЯ ПЕРЕКЛАДУ
// ========================================
function translate(key, section = null) {
  try {
    if (section && TRANSLATIONS[section] && TRANSLATIONS[section][key]) {
      return TRANSLATIONS[section][key][currentLanguage] || TRANSLATIONS[section][key]['ua'] || key;
    }
    
    // Автопошук по всіх секціях
    for (const sectionName in TRANSLATIONS) {
      if (TRANSLATIONS[sectionName][key]) {
        return TRANSLATIONS[sectionName][key][currentLanguage] || TRANSLATIONS[sectionName][key]['ua'] || key;
      }
    }
    return key;
  } catch (e) {
    console.warn(`Translation not found: ${key}`);
    return key;
  }
}

// ========================================
// ФУНКЦІЯ ЗМІНИ МОВИ
// ========================================
function setLanguage(lang) {
  if (['ua', 'en', 'kz', 'pl', 'cs'].includes(lang)) {
    currentLanguage = lang;
    localStorage.setItem('dronefall_language', lang);
    updatePageLanguage();
    
    // Викликаємо updateAllTranslations напряму (з language-updater.js)
    if (typeof window.updateAllTranslations === 'function') {
      console.log('🔄 Викликаю updateAllTranslations...');
      window.updateAllTranslations();
    }
    
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
    console.log(`✅ Мова змінена на: ${lang.toUpperCase()}`);
  }
}

// ========================================
// ФУНКЦІЯ ОТРИМАННЯ ПОТОЧНОЇ МОВИ
// ========================================
function getLanguage() {
  return currentLanguage;
}

// ========================================
// ФУНКЦІЯ ОНОВЛЕННЯ UI
// ========================================
function updatePageLanguage() {
  // Оновити всі елементи з data-translate
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    const section = el.getAttribute('data-section') || null;
    const translated = translate(key, section);
    
    // Якщо є HTML всередині (іконки), зберігаємо їх
    const icon = el.querySelector('i');
    if (icon) {
      el.innerHTML = '';
      el.appendChild(icon);
      el.appendChild(document.createTextNode(' ' + translated));
    } else {
      el.textContent = translated;
    }
  });
  
  // Оновити placeholder'и
  document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
    const key = el.getAttribute('data-translate-placeholder');
    const section = el.getAttribute('data-section') || null;
    el.placeholder = translate(key, section);
  });
  
  // Оновити title сторінки
  const pageTitle = document.querySelector('[data-translate-title]');
  if (pageTitle) {
    const key = pageTitle.getAttribute('data-translate-title');
    const section = pageTitle.getAttribute('data-section') || null;
    document.title = translate(key, section) + ' - DroneFall';
  }
  
  // Оновити кнопки мов (якщо є)
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === currentLanguage) {
      btn.classList.add('active');
    }
  });
}

// ========================================
// ІНІЦІАЛІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  updatePageLanguage();
});

// Експорт для модулів
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRANSLATIONS, translate, setLanguage, getLanguage, currentLanguage };
}

console.log('🌍 translations.js завантажено, мова:', currentLanguage.toUpperCase());