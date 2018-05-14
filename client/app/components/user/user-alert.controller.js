angular.module("App").controller("UserAlertCtrl", (User, $translate, $scope, $interpolate) => {

    User.getUserAlerts().then((alerts) => {
        if (alerts && alerts.length) {
            let messages = [];

            angular.forEach(alerts, (alert) => {
                if (alert.level === "warning") {
                    switch (alert.id) {
                    case "DEBTACCOUNT_DEBT":
                        if (_.get(alert, "data.debtAccount.unmaturedAmount.value", 0) > 0) {
                            messages.push($translate.instant("me_alerts_DEBTACCOUNT_DEBT_WITH_UNMATURED_AMOUNT", {
                                t0: _.get(alert, "data.debtAccount.dueAmount.text"),
                                t1: _.get(alert, "data.debtAccount.unmaturedAmount.text"),
                                t2: "#/billing/history"
                            }));
                        } else {
                            messages.push($translate.instant("me_alerts_DEBTACCOUNT_DEBT", { t0: _.get(alert, "data.debtAccount.dueAmount.text"), t1: "#/billing/history" }));
                        }
                        break;
                    case "OVHACCOUNT_DEBT":
                        messages.push(
                            $translate.instant("me_alerts_OVHACCOUNT_DEBT", {
                                t0: _.get(alert, "data.ovhAccount.balance.text"),
                                t1: moment(_.get(alert, "data.ovhAccount.lastUpdate")).format("LLL")
                            })
                        );
                        break;
                    case "PAYMENTMEAN_DEFAULT_MISSING":
                    case "PAYMENTMEAN_DEFAULT_EXPIRED":
                    case "PAYMENTMEAN_DEFAULT_BANKACCOUNT_PENDINGVALIDATION":
                    case "PAYMENTMEAN_DEFAULT_CREDITCARD_TOOMANYFAILURES":
                    case "PAYMENTMEAN_DEFAULT_PAYPAL_TOOMANYFAILURES":
                    case "OVHACCOUNT_ALERTTHRESHOLD":
                        messages.push($translate.instant(`me_alerts_${alert.id}`));
                        break;
                    case "ORDERS_DOCUMENTSREQUESTED":
                        messages.push($translate.instant("me_alerts_ORDERS_DOCUMENTSREQUESTED", { t0: _.size(_.get(alert, "data.ordersWithDocumentsRequested")) }));
                        break;
                    default:
                        var key = `me_alerts_${alert.id}`;
                        var translatedAlert = $translate.instant(key);
                        if (translatedAlert === key) {
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
});
