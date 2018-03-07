/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.domain
 * @description
 */
angular.module("Billing.controllers").controller("Billing.controllers.AutoRenew.domain", [
    "$scope",
    "BillingAutoRenew",
    "Alerter",
    "AUTORENEW_EVENT",
    function ($scope, AutoRenew, Alerter, AUTORENEW_EVENT) {
        "use strict";

        $scope.disableAutoRenewForDomains = () => {
            AutoRenew.disableAutoRenewForDomains()
                .then(() => {
                    $scope.$emit(AUTORENEW_EVENT.DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS);
                    Alerter.set("alert-success", $scope.tr("autorenew_service_disable_all_domains_success"));
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("autorenew_service_update_step2_error"), err);
                })
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
