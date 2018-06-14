angular.module("App").config(($stateProvider, BILLING_BASE_URL) => {

    $stateProvider.state("app.account.billing.history.debtDetails", {
        url: "/debt-details/:debtId",
        templateUrl: `${BILLING_BASE_URL}history/details/billing-history-details.html`,
        controller: "BillingHistoryDebtDetailsCtrl",
        controllerAs: "$ctrl",
        translations: ["account/billing/history/details"]
    });

});
