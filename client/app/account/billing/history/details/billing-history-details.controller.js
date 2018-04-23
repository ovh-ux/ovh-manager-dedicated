angular.module("Billing.controllers").controller("BillingHistoryDebtDetailsCtrl", class BillingHistoryDebtDetailsCtrl {

    constructor ($q, $state, $stateParams, $translate, OvhApiMe, Alerter) {
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.OvhApiMe = OvhApiMe;
        this.Alerter = Alerter;

        this.bill = null;
        this.order = null;

        this.loading = {
            init: false
        };
    }

    getOperations () {
        return this.OvhApiMe.DebtAccount().Debt().Operation().v6()
            .query({
                debtId: this.$stateParams.debtId
            }).$promise.then((operationIds) => this.getOperationsDetails(operationIds));
    }

    getOperationsDetails (operationIds) {
        return this.$q.all(_.map(_.chunk(operationIds, 50), (chunkIds) => this.OvhApiMe.DebtAccount().Debt().Operation().v6()
            .getBatch({
                debtId: this.$stateParams.debtId,
                operationId: chunkIds
            }).$promise.then((results) => _.filter(results, ({ error }) => !error))))
            .then((resources) => _.pluck(_.flatten(resources), "value"));
    }

    getBill (orderId) {
        return this.OvhApiMe.Order().v6().associatedObject({
            orderId
        }).$promise.then((associatedObject) => {
            if (associatedObject.type === "Bill") {
                return this.OvhApiMe.Bill().v6().get({
                    billId: associatedObject.id
                }).$promise;
            }

            return null;
        });
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.loading.init = true;

        return this.$q.all({
            debt: this.OvhApiMe.DebtAccount().Debt().v6().get({
                debtId: this.$stateParams.debtId
            }).$promise,
            operations: this.getOperations()
        }).then((results) => {
            this.operations = results.operations;

            return this.$q.all({
                order: this.OvhApiMe.Order().v6().get({
                    orderId: results.debt.orderId
                }).$promise,
                bill: this.getBill(results.debt.orderId)
            }).then((details) => {
                this.order = details.order;
                this.bill = details.bill;
            });
        }).catch((error) => {
            this.Alerter.alertFromSWS(this.$translate.instant("billing_history_details_load_error"), {
                message: _.get(error, "message"),
                type: "ERROR"
            }, "billing_debt_details");
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});


// angular.module("Billing.controllers").controller("Billing.controllers.HistoryDetailsCtrl", ($q, $scope, BillingDebtAccount, BillingOrders, $stateParams, Alerter) => {
//     $scope.loading = {
//         init: false,
//         operations: false
//     };

//     $scope.debtId = $stateParams.debtId;
//     $scope.debt = null;
//     $scope.operationIds = [];
//     $scope.operations = [];

//     /**
//      * PAGINATION OPERATIONS
//      */

//     $scope.pagination = {};

//     $scope.transformItem = function (operationId) {
//         $scope.loading.operations = true;
//         return BillingDebtAccount.getDebtOperationDetail($scope.debtId, operationId).catch((err) => {
//             Alerter.alertFromSWS($scope.tr("statements_details_page_operations"), err.message);
//             return $q.reject(err);
//         });
//     };

//     $scope.onTransformItemDone = function () {
//         $scope.loading.operations = false;
//     };

//     /**
//      * INITIALISATION
//      */

//     function loadDebt (debtId) {
//         return BillingDebtAccount.getDebtDetails(debtId)
//             .then((debt) => {
//                 $scope.debt = debt;
//                 return $q.all([loadOrder(debt.orderId), loadBill(debt.orderId), loadPayment(debt.orderId)]);
//             })
//             .catch((err) => {
//                 Alerter.alertFromSWS($scope.tr("statements_single_debt_error", [debtId]), err.message);
//                 return $q.reject(err);
//             });
//     }

//     function loadOrder (orderId) {
//         return BillingOrders.getOrder(orderId).then((order) => {
//             $scope.order = order;
//         });
//     }

//     function loadPayment (orderId) {
//         return BillingOrders.getOrderPayment(orderId).then((payment) => {
//             $scope.payment = payment;
//         });
//     }

//     function loadBill (orderId) {
//         return BillingOrders.getOrderBill(orderId).then((bill) => {
//             $scope.bill = bill;
//         });
//     }

//     function loadDebtOperations (debtId) {
//         return BillingDebtAccount.getDebtOperations(debtId)
//             .then((operationIds) => {
//                 $scope.operationIds = operationIds;
//             })
//             .catch((err) => {
//                 Alerter.alertFromSWS($scope.tr("statements_details_page_operations"), err.message);
//                 return $q.reject(err);
//             });
//     }

//     function init () {
//         $scope.loading.init = true;

//         const debtId = $stateParams.debtId;

//         $q.all([loadDebt(debtId), loadDebtOperations(debtId)]).finally(() => {
//             $scope.loading.init = false;
//         });
//     }

//     init();
// });
