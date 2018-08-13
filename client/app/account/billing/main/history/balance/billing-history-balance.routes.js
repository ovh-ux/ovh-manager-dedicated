angular.module("App").config(($stateProvider, constants) => {

    if (constants.target === "US") {
        $stateProvider.state("app.account.billing.main.history.balance", {
            url: "/balance",
            templateUrl: "account/billing/main/history/balance/billing-history-balance.html",
            controller: "BillingHistoryBalanceCtrl",
            controllerAs: "$ctrl",
            translations: ["account/billing/main/history/balance"]
        });
    }

});
