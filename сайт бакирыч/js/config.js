// Конфигурация сайта
// Обновите эти значения перед использованием

const SITE_CONFIG = {
    // Контактная информация
    contacts: {
        phone: '+7 (906) 321-11-57',
        phoneRaw: '79063211157', // Без пробелов и скобок для WhatsApp
        email: 'info@urgrand.ru',
        address: 'г. Казань, Ю.Фучика 90, БЦ Франт',
        mainSite: 'https://urgrand.ru'
    },
    
    // WhatsApp настройки
    whatsapp: {
        phone: '79063211157', // Номер в формате 7XXXXXXXXXX
        enabled: true
    },
    
    // Telegram настройки
    telegram: {
        botToken: 'YOUR_BOT_TOKEN', // Токен бота от @BotFather
        chatId: 'YOUR_CHAT_ID', // ID чата или канала
        enabled: false // Включить после настройки бота
    },
    
    // Bitrix CRM настройки
    bitrix: {
        webhookUrl: '/local/ajax/form_handler.php', // URL обработчика форм
        enabled: true
    },
    
    // Сообщения
    messages: {
        success: 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
        error: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.',
        callbackSuccess: 'Спасибо! Мы перезвоним вам в ближайшее время.',
        contactSuccess: 'Спасибо! Ваше сообщение отправлено.'
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}

