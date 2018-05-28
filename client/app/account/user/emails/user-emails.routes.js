angular
    .module("UserAccount")
    .config([
        "$stateProvider",
        "UserAccount.constants",
        function ($stateProvider, userAccountConstants) {
            "use strict";
            const target = userAccountConstants.target;
            if (target === "EU" || target === "CA") {
                $stateProvider.state("app.account.useraccount.emails", {
                    url: "/emails",
                    templateUrl: "account/user/emails/user-emails.html",
                    controller: "UserAccountEmailsController",
                    controllerAs: "$ctrl"
                });
            }
        }
    ]);
