angular.module("App").controller("UserAlertCtrl", [
    "User",
    "translator",
    "$scope",
    "$interpolate",
    function (User, translator, $scope, $interpolate) {
        "use strict";

        User.getUserAlerts().then((alerts) => {
            if (alerts && alerts.length) {
                let messages = [];

                angular.forEach(alerts, (alert) => {
                    if (alert.level === "warning") {
                        switch (alert.id) {
                        case "DEBTACCOUNT_DEBT":
                            if (_.get(alert, "data.debtAccount.unmaturedAmount.value", 0) > 0) {
                                messages.push(translator.tr("me_alerts_DEBTACCOUNT_DEBT_WITH_UNMATURED_AMOUNT", [_.get(alert, "data.debtAccount.dueAmount.text"), _.get(alert, "data.debtAccount.unmaturedAmount.text"), "#/billing/history"]));
                            } else {
                                messages.push(translator.tr("me_alerts_DEBTACCOUNT_DEBT", [_.get(alert, "data.debtAccount.dueAmount.text"), "#/billing/history"]));
                            }
                            break;
                        case "OVHACCOUNT_DEBT":
                            messages.push(translator.tr("me_alerts_OVHACCOUNT_DEBT", [_.get(alert, "data.ovhAccount.balance.text"), _.get(alert, "data.ovhAccount.lastUpdate")]));
                            break;
                        case "PAYMENTMEAN_DEFAULT_MISSING":
                        case "PAYMENTMEAN_DEFAULT_EXPIRED":
                        case "PAYMENTMEAN_DEFAULT_BANKACCOUNT_PENDINGVALIDATION":
                        case "PAYMENTMEAN_DEFAULT_CREDITCARD_TOOMANYFAILURES":
                        case "PAYMENTMEAN_DEFAULT_PAYPAL_TOOMANYFAILURES":
                        case "OVHACCOUNT_ALERTTHRESHOLD":
                            messages.push(translator.tr(`me_alerts_${alert.id}`));
                            break;
                        case "ORDERS_DOCUMENTSREQUESTED":
                            messages.push(translator.tr("me_alerts_ORDERS_DOCUMENTSREQUESTED", [(_.get(alert, "data.ordersWithDocumentsRequested") || []).length]));
                            break;
                        default:
                            var translatedAlert = translator.tr(`me_alerts_${alert.id}`);
                            if (translatedAlert === `/!\\ me_alerts_${alert.id}`) {
                                // No translation
                                messages.push(alert.description);
                            } else {
                                messages.push(translatedAlert);
                            }
                        }
                    }
                });

                messages = messages.map((m) => $interpolate(m)($scope));

                if (messages.length) {
                    $scope.userAlerts = {
                        type: "warning",
                        messages
                    };
                }
            }
        });
    }
]);
