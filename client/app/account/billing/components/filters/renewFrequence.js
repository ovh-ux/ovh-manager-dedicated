angular.module("Billing.filters").filter("renewFrequence", [
    "translator",

    function (translator) {
        "use strict";

        return function (period) {
            let txtFrequence = null;
            switch (period) {
            case 1:
                txtFrequence = translator.tr("autorenew_service_renew_month");
                break;
            case 3:
            case 6:
                txtFrequence = translator.tr("autorenew_service_renew_frequency_value", [period]);
                break;
            case 12:
                txtFrequence = translator.tr("autorenew_service_renew_year");
                break;
            default:
                if (period > 12) {
                    txtFrequence = translator.tr("autorenew_service_renew_years_frequency_value", [period / 12]);
                } else {
                    txtFrequence = translator.tr("autorenew_service_renew_frequency_value", [period]);
                }
                break;
            }
            return txtFrequence;
        };
    }
]);
