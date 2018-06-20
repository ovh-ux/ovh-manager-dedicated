angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.account.billing.main.history.postal-mail-options", {
        url: "/postalMailOptions?activate",
        views: {
            modal: {
                templateUrl: "account/billing/main/history/postalMailOptions/billing-main-history-postal-mail-options.html",
                controller: "BillingHistoryPostalMailOptionsCtrl"
            }
        },
        layout: "modal",
        translations: ["account/billing/main/history/postalMailOptions"]
    });

});
