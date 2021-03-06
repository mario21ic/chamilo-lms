<?php
/* For license terms, see /license.txt */

/**
 * Configuration page for payment methods for the Buy Courses plugin
 * @package chamilo.plugin.buycourses
 */

$cidReset = true;

api_protect_admin_script(true);

$plugin = BuyCoursesPlugin::create();

$paypalEnable = $plugin->get('paypal_enable');
$transferEnable = $plugin->get('transfer_enable');
$commissionsEnable = $plugin->get('commissions_enable');
$culqiEnable = $plugin->get('culqi_enable');

if (isset($_GET['action'], $_GET['id'])) {
    if ($_GET['action'] == 'delete_taccount') {
        $plugin->deleteTransferAccount($_GET['id']);

        Display::addFlash(
            Display::return_message(get_lang('ItemRemoved'), 'success')
        );

        header('Location: ' . api_get_self());
        exit;
    }
}

$currencyForm = new FormValidator('currency');

if ($currencyForm->validate()) {
    $currencyFormValues = $currencyForm->getSubmitValues();

    $plugin->selectCurrency($currencyFormValues['currency']);
    unset($currencyFormValues['currency']);
    $plugin->saveGlobalParameters($currencyFormValues);

    Display::addFlash(
        Display::return_message(get_lang('Saved'), 'success')
    );

    header('Location:' . api_get_self());
    exit;
}

$currencies = $plugin->getCurrencies();

$currencySelect = $currencyForm->addSelect(
    'currency',
    [
        $plugin->get_lang('CurrencyType'),
        $plugin->get_lang('InfoCurrency')
    ],
    [get_lang('Select')]
);

foreach ($currencies as $currency) {
    $currencyText = implode(
        ' => ',
        [
            $currency['country_name'],
            $currency['iso_code']
        ]
    );
    $currencyValue = $currency['id'];

    $currencySelect->addOption($currencyText, $currencyValue);

    if ($currency['status']) {
        $currencySelect->setSelected($currencyValue);
    }
}

$currencyForm->addTextarea('terms_and_conditions', [ get_lang('TermsAndConditions'), $plugin->get_lang('WriteHereTheTermsAndConditionsOfYourECommerce') ], '');
$currencyForm->addButtonSave(get_lang('Save'));
$currencyForm->setDefaults($plugin->getGlobalParameters());

$termsAndConditionsForm = new FormValidator('termsconditions');

$paypalForm = new FormValidator('paypal');

if ($paypalForm->validate()) {
    $paypalFormValues = $paypalForm->getSubmitValues();

    $plugin->savePaypalParams($paypalFormValues);

    Display::addFlash(
        Display::return_message(get_lang('Saved'), 'success')
    );

    header('Location:' . api_get_self());
    exit;
}

$paypalForm->addText(
    'username',
    $plugin->get_lang('ApiUsername'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$paypalForm->addText(
    'password',
    $plugin->get_lang('ApiPassword'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$paypalForm->addText(
    'signature',
    $plugin->get_lang('ApiSignature'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$paypalForm->addCheckBox('sandbox', null, $plugin->get_lang('Sandbox'));
$paypalForm->addButtonSave(get_lang('Save'));
$paypalForm->setDefaults($plugin->getPaypalParams());

// Platform Commissions

$commissionForm = new FormValidator('commissions');

if ($commissionForm->validate()) {
    $commissionFormValues = $commissionForm->getSubmitValues();

    $plugin->updateCommission($commissionFormValues);

    Display::addFlash(
        Display::return_message(get_lang('Saved'), 'success')
    );

    header('Location:' . api_get_self());
    exit;
}

$commissionForm->addElement(
    'number',
    'commission',
    [$plugin->get_lang('Commission'), null, '%'],
    ['step' => 1, 'cols-size' => [3, 7, 1], 'min' => 0, 'max' => 100]
);


$commissionForm->addButtonSave(get_lang('Save'));
$commissionForm->setDefaults($plugin->getPlatformCommission());

$transferForm = new FormValidator('transfer_account');

if ($transferForm->validate()) {
    $transferFormValues = $transferForm->getSubmitValues();

    $plugin->saveTransferAccount($transferFormValues);

    Display::addFlash(
        Display::return_message(get_lang('Saved'), 'success')
    );

    header('Location:' . api_get_self());
    exit;
}

$transferForm->addText(
    'tname',
    get_lang('Name'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$transferForm->addText(
    'taccount',
    $plugin->get_lang('BankAccount'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$transferForm->addText(
    'tswift',
    [$plugin->get_lang('SWIFT'), $plugin->get_lang('SWIFT_help')],
    false,
    ['cols-size' => [3, 8, 1]]
);
$transferForm->addButtonCreate(get_lang('Add'));

$transferAccounts = $plugin->getTransferAccounts();

// Culqi main configuration

$culqiForm = new FormValidator('culqi_config');

if ($culqiForm->validate()) {
    $culqiFormValues = $culqiForm->getSubmitValues();

    $plugin->saveCulqiParameters($culqiFormValues);

    Display::addFlash(
        Display::return_message(get_lang('Saved'), 'success')
    );

    header('Location:' . api_get_self());
    exit;
}

$culqiForm->addText(
    'commerce_code',
    $plugin->get_lang('CommerceCode'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$culqiForm->addText(
    'api_key',
    $plugin->get_lang('ApiPassword'),
    false,
    ['cols-size' => [3, 8, 1]]
);
$culqiForm->addCheckBox('integration', null, $plugin->get_lang('Sandbox'));
$culqiForm->addButtonSave(get_lang('Save'));
$culqiForm->setDefaults($plugin->getCulqiParams());

// breadcrumbs
$interbreadcrumb[] = [
    'url' => api_get_path(WEB_PLUGIN_PATH) . 'buycourses/index.php',
    'name' => $plugin->get_lang('plugin_title')
];

$templateName = $plugin->get_lang('PaymentsConfiguration');
$htmlHeadXtra[] = api_get_css('plugins/buycourses/css/style.css');
$htmlHeadXtra[] = api_get_js('plugins/buycourses/css/style.css');
$tpl = new Template($templateName);
$tpl->assign('header', $templateName);
$tpl->assign('global_config_form', $currencyForm->returnForm());
$tpl->assign('paypal_form', $paypalForm->returnForm());
$tpl->assign('commission_form', $commissionForm->returnForm());
$tpl->assign('transfer_form', $transferForm->returnForm());
$tpl->assign('culqi_form', $culqiForm->returnForm());
$tpl->assign('transfer_accounts', $transferAccounts);
$tpl->assign('paypal_enable', $paypalEnable);
$tpl->assign('commissions_enable', $commissionsEnable);
$tpl->assign('transfer_enable', $transferEnable);
$tpl->assign('culqi_enable', $culqiEnable);

$content = $tpl->fetch('@plugin/buycourses/view/paymentsetup.tpl');

$tpl->assign('content', $content);
$tpl->display_one_col_template();
