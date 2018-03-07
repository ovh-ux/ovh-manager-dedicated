/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.cancelDelete
 * @description
 */
angular.module("Billing.controllers").controller("Billing.controllers.AutoRenew.cancelDelete", [
    "$rootScope",
    "$scope",
    "$q",
    "BillingAutoRenew",
    "Alerter",
    "AUTORENEW_EVENT",
    function ($rootScope, $scope, $q, AutoRenew, Alerter, AUTORENEW_EVENT) {
        "use strict";

        $scope.selectedServices = $scope.currentActionData;

        $scope.deleteRenew = function () {
            const result = [];
            angular.forEach($scope.selectedServices, (service) => {
                service.renew.deleteAtExpiration = false;
                result.push(_.pick(service, ["serviceId", "serviceType", "renew"]));
            });
            return AutoRenew.updateServices(result)
                .then(() => {
                    $scope.$emit(AUTORENEW_EVENT.CANCEL_TERMINATE, result);
                    Alerter.set("alert-success", $scope.tr("autorenew_service_update_step2_success"));
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("autorenew_service_update_step2_error"), err);
                    return $q.reject(err);
                })
                .finally(() => {
                    $rootScope.$broadcast(AutoRenew.events.AUTORENEW_CHANGED);
                    $scope.resetAction();
                });
        };
    }
]);
