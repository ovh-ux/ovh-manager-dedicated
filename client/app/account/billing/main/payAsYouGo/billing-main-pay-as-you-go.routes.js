angular.module("Billing").config(($stateProvider) => {
    $stateProvider.state("app.account.billing.main.pay-as-you-go", {
        url: "/payAsYouGo",
        controller: "BillingMainPayAsYouGoCtrl",
        controllerAs: "$ctrl",
        templateUrl: "account/billing/main/payAsYouGo/billing-main-pay-as-you-go.html",
        translations: ["account/billing/payAsYouGo"]
    });
});
