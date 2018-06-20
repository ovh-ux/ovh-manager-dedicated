angular.module("Billing").config(($stateProvider) => {
    $stateProvider.state("app.account.billing.main.payments", {
        url: "/payments",
        templateUrl: "account/billing/main/payments/billing-payments.html",
        controller: "Billing.PaymentsCtrl",
        controllerAs: "$ctrl",
        translations: ["account/billing/main/payments"]
    });
});
