angular.module("Billing.controllers").controller("Billing.controllers.HistoryPayDebtCtrl", ($scope, $window, $translate, Alerter, BillingDebtAccount) => {
    $scope.payDebt = {
        error: null,
        loading: false,
        order: null
    };

    $scope.displayBC = function () {
        $scope.resetAction();
        Alerter.success($translate.instant("statements_account_debt_payment_order_generated", {
            t0: $scope.payDebt.order.orderId,
            t1: $scope.payDebt.order.url
        }));
        $window.open($scope.payDebt.order.url, "_blank");
    };

    $scope.createDebtPaymentBC = function () {
        $scope.payDebt.loading = true;

        BillingDebtAccount.payDebt($scope.currentActionData)
            .then((paymentBC) => {
                $scope.payDebt.order = paymentBC;
            })
            .catch((err) => {
                $scope.payDebt.error = err;
                Alerter.alertFromSWS($translate.instant("statements_account_debt_payment_error"), err.message);
            })
            .finally(() => {
                $scope.payDebt.loading = false;
            });
    };
});
