angular.module("Billing.controllers").controller("Billing.controllers.OrderRetractionCtrl", function ($log, $scope, $stateParams, Alerter, BillingOrders) {
    "use strict";

    $scope.orderId = $stateParams.id;

    this.retract = function () {
        $scope.success = false;

        BillingOrders.retractOrder($scope.orderId)
            .then(() => {
                $scope.success = true;
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("orders_retract_error"), err);
                $log.error(err);
            });
    };
});
