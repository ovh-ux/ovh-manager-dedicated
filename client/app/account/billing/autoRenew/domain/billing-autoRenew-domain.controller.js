/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.domain
 * @description
 */
angular.module("Billing.controllers").controller("Billing.controllers.AutoRenew.domain", ($scope, $translate, BillingAutoRenew, Alerter, AUTORENEW_EVENT) => {
    $scope.disableAutoRenewForDomains = () => {
        BillingAutoRenew.disableAutoRenewForDomains()
            .then(() => {
                $scope.$emit(AUTORENEW_EVENT.DISABLE_AUTOMATIC_PAYMENT_FOR_DOMAINS);
                Alerter.set("alert-success", $translate.instant("autorenew_service_disable_all_domains_success"));
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("autorenew_service_update_step2_error"), err);
            })
            .finally(() => {
                $scope.resetAction();
            });
    };
});
