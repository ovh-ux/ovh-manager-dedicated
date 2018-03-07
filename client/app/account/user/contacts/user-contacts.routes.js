angular.module("UserAccount").config(($stateProvider) => {
    $stateProvider.state("app.account.useraccount.contacts", {
        url: "/contacts",
        templateUrl: "account/user/contacts/user-contacts.html",
        controller: "UserAccount.controllers.contactCtrl",
        controllerAs: "contactCtrl",
        "abstract": true
    });
});
