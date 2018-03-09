angular.module("UserAccount").config(($stateProvider) => {
    $stateProvider.state("app.account.useraccount.contact-update-domain", {
        url: "/contact/:currentDomain/:contactId?fields",
        templateUrl: "account/user/contacts/update/user-contacts-update.html",
        controller: "UserAccount.controllers.update",
        controllerAs: "contactCtrl"
    });

    $stateProvider.state("app.account.useraccount.contact-update", {
        url: "/contact/:contactId?fields",
        templateUrl: "account/user/contacts/update/user-contacts-update.html",
        controller: "UserAccount.controllers.update",
        controllerAs: "contactCtrl"
    });
});
