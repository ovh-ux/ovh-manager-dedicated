angular.module("App").config(($stateProvider, constants, BILLING_BASE_URL) => {

    if (constants.target === "US") {
        $stateProvider.state("app.account.billing.payments.request", {
            url: "/request",
            templateUrl: `${BILLING_BASE_URL}payments/request/billing-payments-request.html`,
            controller: "BillingHistoryRequestCtrl",
            controllerAs: "$ctrl",
            translations: ["account/billing/payments/request"]
        });
    }

});
