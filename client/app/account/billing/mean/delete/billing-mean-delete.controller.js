angular.module("Billing.controllers").controller("Billing.controllers.Mean.Delete", ($scope, $translate, BillingPaymentInformation, Alerter) => {
    $scope.selectedMean = $scope.currentActionData;

    $scope.deleteMean = function () {
        return BillingPaymentInformation.deletePaymentMean($scope.selectedMean.details.id, $scope.selectedMean.type)
            .then(() => {
                Alerter.success($translate.instant("paymentType_delete_success"));
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("paymentType_delete_error"), err.data);
            })
            .finally(() => {
                $scope.resetAction();
            });
    };
});
