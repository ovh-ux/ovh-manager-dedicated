angular.module("Billing").config(($stateProvider, BILLING_BASE_URL) => {

    $stateProvider.state("app.account.billing.main.paymentsDetails", {
        url: "/payments/:id/details",
        templateUrl: `${BILLING_BASE_URL}/main/payments/details/billing-payments-details.html`,
        controller: "Billing.controllers.PaymentDetailsCtrl",
        controllerAs: "$ctrl"
    });
});

