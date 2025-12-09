# Лендинг "Возврат денег за навязанные услуги по автокредиту"

Лендинг для юридической компании «Гранд» по возврату денежных средств за навязанные услуги при оформлении автокредита.

## Структура проекта

```
/
├── index.html              # Главная страница
├── css/
│   └── styles.css          # Стили сайта
├── js/
│   ├── config.js           # Конфигурация сайта (контакты, интеграции)
│   └── script.js           # JavaScript функционал
├── images/                 # Изображения
│   ├── logo.png           # Логотип компании
│   └── banks/             # Логотипы банков
│       ├── sberbank.svg
│       ├── vtb.svg
│       ├── alfa.svg
│       ├── tinkoff.svg
│       ├── raiffeisen.svg
│       └── gazprombank.svg
└── local/                  # Файлы для Bitrix
    └── ajax/
        └── form_handler.php # Обработчик форм для Bitrix CRM
```

## Установка и настройка

### 1. Для standalone версии (без Bitrix)

1. Скопируйте все файлы на веб-сервер
2. Добавьте изображения в папку `images/`
3. Настройте контакты в `index.html` (телефон, email)
4. Настройте интеграции в `js/script.js`:
   - WhatsApp номер
   - Telegram Bot Token и Chat ID

### 2. Для интеграции с Bitrix

1. Скопируйте файлы в корень сайта Bitrix
2. Разместите `local/ajax/form_handler.php` в соответствующую директорию
3. Настройте пользовательские поля в Bitrix CRM:
   - `UF_CRM_CREDIT_AMOUNT` - Сумма кредита
   - `UF_CRM_BANK_NAME` - Название банка
   - `UF_CRM_PURCHASE_DATE` - Дата покупки
   - `UF_CRM_IMPOSED_SERVICES` - Навязанные услуги
4. Обновите URL в `js/script.js` для отправки в Bitrix

## Настройка интеграций

Все настройки выполняются в файле `js/config.js`. Это централизованная конфигурация для всего сайта.

### Контакты

Обновите контактную информацию в `js/config.js`:

```javascript
contacts: {
    phone: '+7 (495) 123-45-67',
    phoneRaw: '74951234567',
    email: 'info@urgrand.ru',
    address: 'г. Москва, ул. Примерная, д. 1',
    mainSite: 'https://urgrand.ru'
}
```

Контакты автоматически обновятся на всем сайте.

### WhatsApp

Номер телефона берется из конфигурации (`contacts.phoneRaw`). Убедитесь, что он указан правильно.

### Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Получите Chat ID (можно использовать [@userinfobot](https://t.me/userinfobot))
4. В файле `js/config.js` обновите:

```javascript
telegram: {
    botToken: 'YOUR_BOT_TOKEN',
    chatId: 'YOUR_CHAT_ID',
    enabled: true
}
```

### Bitrix CRM

1. Убедитесь, что модуль CRM установлен
2. Создайте пользовательские поля для лидов (если нужно)
3. Проверьте права доступа для создания лидов
4. Обновите URL в `js/script.js`:

```javascript
const bitrixWebhookUrl = '/local/ajax/form_handler.php';
```

## Необходимые изображения

### Логотип компании
- `images/logo.png` - логотип компании «Гранд» (можно взять с urgrand.ru)

### Логотипы банков
- `images/banks/sberbank.svg` - Сбербанк
- `images/banks/vtb.svg` - ВТБ
- `images/banks/alfa.svg` - Альфа-Банк
- `images/banks/tinkoff.svg` - Тинькофф
- `images/banks/raiffeisen.svg` - Райффайзен
- `images/banks/gazprombank.svg` - Газпромбанк

Логотипы банков можно найти на официальных сайтах или использовать SVG версии.

## Контакты

Обновите контактную информацию в следующих местах:

1. **Header** (строка ~23 в `index.html`):
   - Телефон
   - Email

2. **Contacts Section** (строка ~400+ в `index.html`):
   - Телефон
   - Email
   - Адрес

3. **WhatsApp и Telegram ссылки**:
   - В секции контактной формы
   - В функции `sendToWhatsApp` в `js/script.js`

## Особенности

- Адаптивный дизайн (mobile-first)
- Интеграция с Bitrix CRM
- Отправка заявок в WhatsApp и Telegram
- Валидация форм
- Маска для телефона
- FAQ аккордеон
- Модальное окно для заказа звонка
- Плавные анимации и переходы

## Браузерная поддержка

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)

## Цветовая схема

- Основной цвет: `#1E3A8A` (синий)
- Фон: `#FFFFFF` (белый)
- Текст: `#1F2937` (темно-серый)
- Второстепенный текст: `#6B7280` (серый)

## Шрифты

Используется шрифт Inter (Google Fonts), загружается автоматически.

## Лицензия

Проект создан для Юридической Компании «Гранд».

