angular.module("Billing").config(($stateProvider) => {
    $stateProvider.state("app.account.billing.main", {
        url: "",
        templateUrl: "account/billing/main/billing-main.html",
        "abstract": true,
        translations: ["account/billing/main"]
    });
});
