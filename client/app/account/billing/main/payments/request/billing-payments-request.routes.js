angular.module("App").config(($stateProvider, constants) => {

    if (constants.target === "US") {
        $stateProvider.state("app.account.billing.main.payments.request", {
            url: "/request",
            templateUrl: "account/billing/main/payments/request/billing-payments-request.html",
            controller: "BillingHistoryRequestCtrl",
            controllerAs: "$ctrl",
            translations: ["account/billing/main/payments/request"]
        });
    }

});
