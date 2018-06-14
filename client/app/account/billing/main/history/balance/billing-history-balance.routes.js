angular.module("App").config(($stateProvider, constants, BILLING_BASE_URL) => {

    if (constants.target === "US") {
        $stateProvider.state("app.account.billing.history.balance", {
            url: "/balance",
            templateUrl: `${BILLING_BASE_URL}history/balance/billing-history-balance.html`,
            controller: "BillingHistoryBalanceCtrl",
            controllerAs: "$ctrl",
            translations: ["account/billing/history/balance"]
        });
    }

});
