angular.module("Billing.filters").filter("renewFrequence", ($translate) => function (period) {
    let txtFrequence = null;
    switch (period) {
    case 1:
        txtFrequence = $translate.instant("autorenew_service_renew_month");
        break;
    case 3:
    case 6:
        txtFrequence = $translate.instant("autorenew_service_renew_frequency_value", [period]);
        break;
    case 12:
        txtFrequence = $translate.instant("autorenew_service_renew_year");
        break;
    default:
        if (period > 12) {
            txtFrequence = $translate.instant("autorenew_service_renew_years_frequency_value", [period / 12]);
        } else {
            txtFrequence = $translate.instant("autorenew_service_renew_frequency_value", [period]);
        }
        break;
    }
    return txtFrequence;
});
