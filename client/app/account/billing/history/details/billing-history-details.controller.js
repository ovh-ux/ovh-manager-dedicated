angular.module("Billing.controllers").controller("Billing.controllers.HistoryDetailsCtrl", ($q, $scope, $translate, BillingDebtAccount, BillingOrders, $stateParams, Alerter) => {
    $scope.loading = {
        init: false,
        operations: false
    };

    $scope.debtId = $stateParams.debtId;
    $scope.debt = null;
    $scope.operationIds = [];
    $scope.operations = [];

    /**
     * PAGINATION OPERATIONS
     */

    $scope.pagination = {};

    $scope.transformItem = function (operationId) {
        $scope.loading.operations = true;
        return BillingDebtAccount.getDebtOperationDetail($scope.debtId, operationId).catch((err) => {
            Alerter.alertFromSWS($translate.instant("statements_details_page_operations"), err.message);
            return $q.reject(err);
        });
    };

    $scope.onTransformItemDone = function () {
        $scope.loading.operations = false;
    };

    /**
     * INITIALISATION
     */

    function loadDebt (debtId) {
        return BillingDebtAccount.getDebtDetails(debtId)
            .then((debt) => {
                $scope.debt = debt;
                return $q.all([loadOrder(debt.orderId), loadBill(debt.orderId), loadPayment(debt.orderId)]);
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("statements_single_debt_error", {
                    t0: debtId
                }), err.message);
                return $q.reject(err);
            });
    }

    function loadOrder (orderId) {
        return BillingOrders.getOrder(orderId).then((order) => {
            $scope.order = order;
        });
    }

    function loadPayment (orderId) {
        return BillingOrders.getOrderPayment(orderId).then((payment) => {
            $scope.payment = payment;
        });
    }

    function loadBill (orderId) {
        return BillingOrders.getOrderBill(orderId).then((bill) => {
            $scope.bill = bill;
        });
    }

    function loadDebtOperations (debtId) {
        return BillingDebtAccount.getDebtOperations(debtId)
            .then((operationIds) => {
                $scope.operationIds = operationIds;
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("statements_details_page_operations"), err.message);
                return $q.reject(err);
            });
    }

    function init () {
        $scope.loading.init = true;

        const debtId = $stateParams.debtId;

        $q.all([loadDebt(debtId), loadDebtOperations(debtId)]).finally(() => {
            $scope.loading.init = false;
        });
    }

    init();
});
