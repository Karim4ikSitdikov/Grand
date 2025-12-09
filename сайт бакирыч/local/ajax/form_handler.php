<?php
/**
 * Обработчик форм для отправки в Bitrix CRM
 * Разместить в /local/ajax/form_handler.php
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

use Bitrix\Main\Application;
use Bitrix\Crm\LeadTable;

header('Content-Type: application/json');

$request = Application::getInstance()->getContext()->getRequest();
$data = json_decode($request->getInput(), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

try {
    // Создание лида в Bitrix CRM
    $leadData = [
        'TITLE' => 'Заявка с лендинга автокредит',
        'NAME' => $data['client_name'] ?? $data['name'] ?? '',
        'PHONE' => [
            ['VALUE' => $data['client_phone'] ?? $data['phone'] ?? '', 'VALUE_TYPE' => 'WORK']
        ],
        'EMAIL' => [
            ['VALUE' => $data['client_email'] ?? $data['email'] ?? '', 'VALUE_TYPE' => 'WORK']
        ],
        'SOURCE_ID' => 'WEB', // Источник - веб-сайт
        'COMMENTS' => formatFormData($data),
    ];

    // Добавление дополнительных полей
    if (isset($data['credit_amount'])) {
        $leadData['UF_CRM_CREDIT_AMOUNT'] = $data['credit_amount'];
    }
    
    if (isset($data['bank_name'])) {
        $leadData['UF_CRM_BANK_NAME'] = $data['bank_name'];
    }
    
    if (isset($data['purchase_date'])) {
        $leadData['UF_CRM_PURCHASE_DATE'] = $data['purchase_date'] === 'less_30' ? 'Меньше 30 дней' : 'Больше 30 дней';
    }
    
    if (isset($data['imposed_services']) && is_array($data['imposed_services'])) {
        $leadData['UF_CRM_IMPOSED_SERVICES'] = implode(', ', $data['imposed_services']);
    }

    // Создание лида через API Bitrix
    $lead = new CCrmLead(false);
    $leadId = $lead->Add($leadData, true);

    if ($leadId) {
        echo json_encode([
            'success' => true,
            'lead_id' => $leadId,
            'message' => 'Lead created successfully'
        ]);
    } else {
        throw new Exception('Failed to create lead: ' . $lead->LAST_ERROR);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

/**
 * Форматирование данных формы для комментария
 */
function formatFormData($data) {
    $comment = "Заявка с лендинга автокредит\n\n";
    
    if (isset($data['client_name']) || isset($data['name'])) {
        $comment .= "Имя: " . ($data['client_name'] ?? $data['name']) . "\n";
    }
    
    if (isset($data['client_phone']) || isset($data['phone'])) {
        $comment .= "Телефон: " . ($data['client_phone'] ?? $data['phone']) . "\n";
    }
    
    if (isset($data['client_email']) || isset($data['email'])) {
        $comment .= "Email: " . ($data['client_email'] ?? $data['email']) . "\n";
    }
    
    if (isset($data['purchase_date'])) {
        $comment .= "Когда купили авто: " . ($data['purchase_date'] === 'less_30' ? 'Меньше 30 дней' : 'Больше 30 дней') . "\n";
    }
    
    if (isset($data['imposed_services']) && is_array($data['imposed_services'])) {
        $servicesMap = [
            'custom_rate' => 'Назначь свою ставку',
            'road_assistance' => 'Помощь на дорогах',
            'insurance' => 'Страхование',
            'extended_warranty' => 'Доп гарантия',
            'option_contract' => 'Опционный договор',
            'medical_legal_cards' => 'Карты мед. и юр. помощи'
        ];
        $services = array_map(function($s) use ($servicesMap) {
            return $servicesMap[$s] ?? $s;
        }, $data['imposed_services']);
        $comment .= "Навязанные услуги: " . implode(', ', $services) . "\n";
    }
    
    if (isset($data['credit_amount'])) {
        $comment .= "Сумма кредита: " . $data['credit_amount'] . " руб.\n";
    }
    
    if (isset($data['bank_name'])) {
        $comment .= "Банк: " . $data['bank_name'] . "\n";
    }
    
    if (isset($data['message'])) {
        $comment .= "Сообщение: " . $data['message'] . "\n";
    }
    
    return $comment;
}

