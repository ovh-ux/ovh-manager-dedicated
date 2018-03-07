angular.module("Billing.controllers").controller("Billing.controllers.Mean.Delete", ($scope, BillingPaymentInformation, Alerter) => {
    $scope.selectedMean = $scope.currentActionData;

    $scope.deleteMean = function () {
        return BillingPaymentInformation.deletePaymentMean($scope.selectedMean.details.id, $scope.selectedMean.type)
            .then(() => {
                Alerter.success($scope.tr("paymentType_delete_success"));
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("paymentType_delete_error"), err.data);
            })
            .finally(() => {
                $scope.resetAction();
            });
    };
});
