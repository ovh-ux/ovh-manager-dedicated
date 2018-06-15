angular.module("Billing.controllers").controller("Billing.controllers.PaymentsCtrl", function ($filter, $scope, $state, $translate, Alerter, BillingdateRangeSelection, BillingPayments, constants, featureAvailability, OvhApiMe) {
    "use strict";

    this.paymentTypes = {
        model: 0,
        values: ["0", "creditCard", "debtAccount", "paypal"]
    };

    this.loaders = {
        payments: false
    };

    this.onDateRangeChanged = () => {
        $scope.$broadcast("paginationServerSide.loadPage", "1", "paymentsTable");
    };

    this.paymentRequests = null;
    this.paymentRequestsHref = $state.href("app.account.billing.payments.request");


    this.payments = [];

    this.loadPayments = ({ offset, pageSize }) => {

        const sort = { field: "date", order: "DESC" };
        const dateFrom = BillingdateRangeSelection.dateFrom;
        const dateTo = BillingdateRangeSelection.dateTo;
        let paymentType = this.paymentTypes.model;
        if (paymentType === "debtAccount") {
            paymentType = ["debtAccount", "withdrawal"];
        }

        return BillingPayments.getPaymentIds({
            dateFrom,
            dateTo,
            sort,
            paymentType
        }).then((result) => BillingPayments.getPayments(result, offset + pageSize - 1, offset - 1).then((data) => ({
            data,
            count: result.length
        }))).then(({ count, data }) => {
            this.payments = data;
            return {
                data,
                meta: {
                    totalCount: count
                }
            };
        });
    };

    this.getDatasToExport = () => {
        const header = [
            $translate.instant("payments_table_head_id"),
            $translate.instant("payments_table_head_date"),
            $translate.instant("payments_table_head_amount"),
            $translate.instant("payments_table_head_type")
        ];
        const result = [header];

        return result.concat(this.payments.map((payment) => [
            payment.depositId,
            $filter("date")(payment.date, "mediumDate"),
            payment.amount.text,
            this.getTranslatedPaiementType(payment)
        ]));
    };

    this.getTranslatedPaiementType = (payment) => payment.paymentInfo ? $translate.instant(`common_payment_type_${payment.paymentInfo.paymentType}`) : $translate.instant("payments_table_type_not_available");

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
