angular.module("Billing.controllers").controller("Billing.controllers.PaymentDetailsCtrl", function ($q, $log, $stateParams, $translate, Alerter, BillingPayments) {
    this.loading = {
        init: false
    };

    this.paymentId = $stateParams.id;
    this.billIds = [];
    this.payment = {};

    this.pagination = {};

    this.transformItem = (billId) => {
        this.loading.init = true;
        return BillingPayments.getBillDetails(this.paymentId, billId).catch((err) => {
            Alerter.alertFromSWS($translate.instant("payments_error"), err.data);
            $log.error(err);
            return $q.reject(err);
        });
    };

    this.onTransformItemDone = () => {
        this.loading.init = false;
    };

    const init = () => {
        this.loading.init = true;

        return $q
            .all([BillingPayments.getBillsIds(this.paymentId), BillingPayments.getPayment(this.paymentId)])
            .then(([billIds, payment]) => {
                this.billIds = billIds;
                this.payment = payment;
            })
            .catch((err) => {
                Alerter.alertFromSWS($translate.instant("payments_error"), err.data);
                this.loading.init = false;
                return $q.reject(err);
            })
            .finally(() => (this.loading.init = false));
    };

    init();
});
