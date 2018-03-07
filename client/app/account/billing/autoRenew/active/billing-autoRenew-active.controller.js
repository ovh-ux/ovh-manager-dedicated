/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.activate
 * @description
 */
angular.module("Billing.controllers").controller("Billing.controllers.AutoRenew.activate", [
    "$scope",
    "BillingAutoRenew",
    "Alerter",
    function ($scope, AutoRenew, Alerter) {
        "use strict";

        $scope.nicRenew = $scope.currentActionData.nicRenew;

        $scope.activeAutoRenew = function () {
            const renewDay = $scope.nicRenew.renewDay;
            const active = true;
            const promise = !$scope.nicRenew.initialized ? AutoRenew.enableAutorenew(renewDay) : AutoRenew.putAutorenew({ active, renewDay });

            promise
                .then(() => {
                    $scope.nicRenew.active = true;
                    Alerter.success($scope.tr("autorenew_service_activate_success"));
                })
                .catch((error) => {
                    $scope.nicRenew.error = error.statusText || error.message;
                    Alerter.set("alert-danger", $scope.nicRenew.error);
                })
                .finally(() => {
                    $scope.nicRenew.updateLoading = false;
                    $scope.resetAction();
                });
        };
    }
]);
