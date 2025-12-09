// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Burger menu functionality
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileCallbackBtn = document.getElementById('mobileCallbackBtn');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    if (mobileCallbackBtn) {
        mobileCallbackBtn.addEventListener('click', () => {
            if (callbackModal) {
                callbackModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                // Закрываем мобильное меню
                if (burgerBtn && mobileMenu) {
                    burgerBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            }
        });
    }

    // Modal functionality
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackModal = document.getElementById('callbackModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = callbackModal ? callbackModal.querySelector('.modal__overlay') : null;

    if (callbackBtn) {
        callbackBtn.addEventListener('click', () => {
            callbackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeModalFunc() {
        callbackModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModalFunc);
    }

    // Form submissions
    const autocreditForm = document.getElementById('autocreditForm');
    const contactForm = document.getElementById('contactForm');
    const callbackForm = document.getElementById('callbackForm');

    // Main form submission
    if (autocreditForm) {
        autocreditForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(autocreditForm);
            const data = Object.fromEntries(formData);
            
            // Get checkbox values
            const imposedServices = formData.getAll('imposed_services[]');
            data.imposed_services = imposedServices;
            
            try {
                // Send to Bitrix CRM
                await sendToBitrix(data);
                
                // Send to WhatsApp
                sendToWhatsApp(data);
                
                // Send to Telegram
                await sendToTelegram(data);
                
                // Show success message
                const successMsg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.messages.success) 
                    ? SITE_CONFIG.messages.success 
                    : 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.';
                showSuccessMessage(successMsg);
                autocreditForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                const errorMsg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.messages.error) 
                    ? SITE_CONFIG.messages.error 
                    : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.';
                showErrorMessage(errorMsg);
            }
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                await sendToBitrix(data);
                sendToWhatsApp(data);
                await sendToTelegram(data);
                
                const contactMsg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.messages.contactSuccess) 
                    ? SITE_CONFIG.messages.contactSuccess 
                    : 'Спасибо! Ваше сообщение отправлено.';
                showSuccessMessage(contactMsg);
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting contact form:', error);
                showErrorMessage('Произошла ошибка при отправке формы.');
            }
        });
    }

    // Callback form submission
    if (callbackForm) {
        callbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(callbackForm);
            const data = Object.fromEntries(formData);
            data.type = 'callback';
            
            try {
                await sendToBitrix(data);
                sendToWhatsApp(data);
                await sendToTelegram(data);
                
                const callbackMsg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.messages.callbackSuccess) 
                    ? SITE_CONFIG.messages.callbackSuccess 
                    : 'Спасибо! Мы перезвоним вам в ближайшее время.';
                showSuccessMessage(callbackMsg);
                callbackForm.reset();
                closeModalFunc();
            } catch (error) {
                console.error('Error submitting callback form:', error);
                showErrorMessage('Произошла ошибка при отправке формы.');
            }
        });
    }

    // Phone input mask
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            if (value.startsWith('7')) {
                value = value.slice(0, 11);
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.slice(9, 11);
                }
                e.target.value = formatted;
            }
        });
    });

    // Update contacts from config
    updateContactsFromConfig();
});

// Update contact information from config
function updateContactsFromConfig() {
    if (typeof SITE_CONFIG === 'undefined' || !SITE_CONFIG.contacts) {
        return;
    }

    const config = SITE_CONFIG.contacts;

    // Update phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.href = `tel:${config.phoneRaw || config.phone.replace(/\D/g, '')}`;
        link.textContent = config.phone;
    });

    // Update email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.href = `mailto:${config.email}`;
        link.textContent = config.email;
    });

    // Update address
    const addressElements = document.querySelectorAll('.contact-item__value:not(a)');
    if (config.address && addressElements.length > 0) {
        // Find address element (it's the third contact item)
        const contactItems = document.querySelectorAll('.contact-item');
        if (contactItems.length >= 3) {
            const addressValue = contactItems[2].querySelector('.contact-item__value:not(a)');
            if (addressValue) {
                addressValue.textContent = config.address;
            }
        }
    }

    // Update WhatsApp link
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    if (config.phoneRaw) {
        whatsappLinks.forEach(link => {
            link.href = `https://wa.me/${config.phoneRaw}`;
        });
    }
}

// Send to Bitrix CRM
async function sendToBitrix(data) {
    // Bitrix CRM webhook URL
    const config = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.bitrix : {};
    const bitrixWebhookUrl = config.webhookUrl || '/local/ajax/form_handler.php';
    const enabled = config.enabled !== undefined ? config.enabled : true;
    
    if (!enabled) {
        console.warn('Bitrix integration disabled');
        return;
    }
    
    try {
        const response = await fetch(bitrixWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                source: 'autocredit_landing'
            })
        });
        
        if (!response.ok) {
            throw new Error('Bitrix API error');
        }
        
        return await response.json();
    } catch (error) {
        // Если Bitrix недоступен, просто логируем ошибку
        console.warn('Bitrix integration not available:', error);
        // Не бросаем ошибку, чтобы форма могла отправиться в другие каналы
    }
}

// Send to WhatsApp
function sendToWhatsApp(data) {
    const phone = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.whatsapp.phone) 
        ? SITE_CONFIG.whatsapp.phone 
        : '74951234567';
    let message = 'Новая заявка с сайта:\n\n';
    
    if (data.client_name || data.name) {
        message += `Имя: ${data.client_name || data.name}\n`;
    }
    if (data.client_phone || data.phone) {
        message += `Телефон: ${data.client_phone || data.phone}\n`;
    }
    if (data.client_email || data.email) {
        message += `Email: ${data.client_email || data.email}\n`;
    }
    if (data.purchase_date) {
        message += `Когда купили авто: ${data.purchase_date === 'less_30' ? 'Меньше 30 дней' : 'Больше 30 дней'}\n`;
    }
    if (data.imposed_services && data.imposed_services.length > 0) {
        message += `Навязанные услуги: ${data.imposed_services.join(', ')}\n`;
    }
    if (data.credit_amount) {
        message += `Сумма кредита: ${data.credit_amount} руб.\n`;
    }
    if (data.bank_name) {
        message += `Банк: ${data.bank_name}\n`;
    }
    if (data.message) {
        message += `Сообщение: ${data.message}\n`;
    }
    
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Send to Telegram
async function sendToTelegram(data) {
    // Telegram Bot API - нужно будет настроить бота и получить token
    const config = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.telegram : {};
    const botToken = config.botToken || 'YOUR_BOT_TOKEN';
    const chatId = config.chatId || 'YOUR_CHAT_ID';
    const enabled = config.enabled !== undefined ? config.enabled : false;
    
    if (!enabled || !botToken || botToken === 'YOUR_BOT_TOKEN') {
        console.warn('Telegram bot not configured');
        return;
    }
    
    let message = '🔔 *Новая заявка с сайта*\n\n';
    
    if (data.client_name || data.name) {
        message += `👤 *Имя:* ${data.client_name || data.name}\n`;
    }
    if (data.client_phone || data.phone) {
        message += `📞 *Телефон:* ${data.client_phone || data.phone}\n`;
    }
    if (data.client_email || data.email) {
        message += `📧 *Email:* ${data.client_email || data.email}\n`;
    }
    if (data.purchase_date) {
        message += `📅 *Когда купили авто:* ${data.purchase_date === 'less_30' ? 'Меньше 30 дней' : 'Больше 30 дней'}\n`;
    }
    if (data.imposed_services && data.imposed_services.length > 0) {
        const servicesMap = {
            'custom_rate': 'Назначь свою ставку',
            'road_assistance': 'Помощь на дорогах',
            'insurance': 'Страхование',
            'extended_warranty': 'Доп гарантия',
            'option_contract': 'Опционный договор',
            'medical_legal_cards': 'Карты мед. и юр. помощи'
        };
        const servicesText = data.imposed_services.map(s => servicesMap[s] || s).join(', ');
        message += `📋 *Навязанные услуги:* ${servicesText}\n`;
    }
    if (data.credit_amount) {
        message += `💰 *Сумма кредита:* ${data.credit_amount} руб.\n`;
    }
    if (data.bank_name) {
        message += `🏦 *Банк:* ${data.bank_name}\n`;
    }
    if (data.message) {
        message += `💬 *Сообщение:* ${data.message}\n`;
    }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            throw new Error('Telegram API error');
        }
        
        return await response.json();
    } catch (error) {
        console.warn('Telegram integration error:', error);
    }
}

// Show success message
function showSuccessMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Show error message
function showErrorMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #EF4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

