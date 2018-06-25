angular.module("Billing").config(($stateProvider) => {
    $stateProvider.state("app.account.billing.main.history", {
        url: "/history",
        templateUrl: "account/billing/main/history/billing-main-history.html",
        controller: "BillingMainHistoryCtrl",
        controllerAs: "$ctrl",
        translations: [
            "account/billing/main/history",
            "account/billing/main/history/postalMailOptions"
        ]
    });
});
