angular.module("directives").component("billingPaymentMethodAddCreditCard", {
    templateUrl: "components/paymentMethod/add/credit-card/billing-payment-method-add-credit-card.html",
    controller: "BillingPaymentMethodAddCreditCardCtrl",
    bindings: {
        onReady: "&",
        onChange: "&"
    }
});
