angular.module("Billing.controllers").controller("Billing.controllers.PaymentsCtrl", function ($filter, $log, $q, $scope, $timeout, $state, translator, constants, Alerter, BillingPayments, BillingdateRangeSelection, featureAvailability, OvhApiMe) {
    "use strict";

    const tr = translator.tr;

    this.paginatedPayments = null;
    this.paymentTypes = {
        model: 0,
        values: ["0", "creditCard", "debtAccount", "paypal"]
    };

    this.loaders = {
        payments: false
    };

    this.orderByState = {
        predicate: "date",
        reverse: true
    };

    this.onDateRangeChanged = () => {
        $scope.$broadcast("paginationServerSide.loadPage", "1", "paymentsTable");
    };

    this.onOrderStateChanged = (predicate, reverse) => {
        this.orderByState = { predicate, reverse };
        $scope.$broadcast("paginationServerSide.loadPage", "1", "paymentsTable");
    };

    this.paymentRequests = null;
    this.paymentRequestsHref = $state.href("app.account.billing.payments.request");

    function getPaymentsSortOrder ({ predicate, reverse }) {
        return {
            field: predicate,
            order: reverse ? "DESC" : "ASC"
        };
    }

    this.loadPayments = (limit, offset) => {
        const sort = getPaymentsSortOrder(this.orderByState);

        const dateFrom = BillingdateRangeSelection.dateFrom;
        const dateTo = BillingdateRangeSelection.dateTo;

        let paymentType = this.paymentTypes.model;
        if (paymentType === "debtAccount") {
            paymentType = ["debtAccount", "withdrawal"];
        }

        let paymentsTotalCount = 0;
        this.loaders.payments = true;

        return $timeout()
            .then(() =>
                BillingPayments.getPaymentIds({
                    dateFrom,
                    dateTo,
                    sort,
                    paymentType
                })
            )
            .then((paymentsCounter) => {
                paymentsTotalCount = paymentsCounter.length;
                return BillingPayments.getPayments(paymentsCounter, limit, offset);
            })
            .then((paginatedPayments) => {
                this.paginatedPayments = paginatedPayments;
                this.paginatedPayments.count = paymentsTotalCount;

                const paymentsErrors = this.paginatedPayments.filter((payment) => payment.error);
                if (paymentsErrors.length > 0) {
                    Alerter.alertFromSWS(tr("payments_error", [paymentsErrors.length]), { alertType: "ERROR" });
                }
            })
            .catch((err) => {
                Alerter.alertFromSWS(tr("payments_error"), err);
                return $q.reject(err);
            })
            .finally(() => {
                $timeout(() => {
                    this.loaders.payments = false;
                });
            });
    };

    this.getDatasToExport = () => {
        const datasToReturn = [[tr("payments_table_head_id"), tr("payments_table_head_date"), tr("payments_table_head_amount"), tr("payments_table_head_type")]];

        return datasToReturn.concat(this.paginatedPayments.map((payment) => [payment.billId, $filter("date")(payment.date, "mediumDate"), payment.amount.text, this.getTranslatedPaiementType(payment)]));
    };

    this.getTranslatedPaiementType = (payment) => payment.paymentInfo ? tr(`common_payment_type_${payment.paymentInfo.paymentType}`) : tr("payments_table_type_not_available");

    this.setAction = (action, data) => {
        const actionModalSelector = $("#currentAction");
        if (action) {
            this.currentAction = action;
            this.currentActionData = data;
            this.stepPath = `${this.BILLING_BASE_URL}payments/${this.currentAction}.html`;

            actionModalSelector.modal({
                keyboard: true,
                backdrop: "static"
            });
        } else {
            actionModalSelector.modal("hide");
            this.currentActionData = null;
            $timeout(() => {
                this.stepPath = "";
            }, 300);
        }
    };

    /**
     * Should display deposits links.
     * @return {Boolean}
     */
    this.shouldDisplayDepositsLinks = () => featureAvailability.showPDFAndHTMLDepositLinks();

    this.displayActionsCol = () => constants.target !== "US";

    this.$onInit = () => {
        if (constants.target === "US") {
            return OvhApiMe.DepositRequest().v6().query().$promise.then((depositRequests) => {
                this.paymentRequests = depositRequests;
            });
        }

        return null;
    };
});
