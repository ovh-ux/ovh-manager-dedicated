angular.module("Billing").config(($stateProvider) => {
    $stateProvider.state("app.account.billing.main.history", {
        url: "/history",
        templateUrl: "account/billing/main/history/billing-history.html",
        controller: "Billing.controllers.History",
        controllerAs: "ctrl",
        translations: ["account/billing/main/history"]
    });
});
