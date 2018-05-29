angular
    .module("UserAccount")
    .config([
        "$stateProvider",
        "UserAccount.constants",
        function ($stateProvider, userAccountConstants) {
            "use strict";
            const target = userAccountConstants.target;
            if (target === "EU" || target === "CA") {
                $stateProvider.state("app.account.useraccount.emailsDetails", {
                    url: "/emails/:emailId",
                    templateUrl: "account/user/emails/details/user-emails-details.html",
                    controller: "UserAccountEmailsDetailsController",
                    controllerAs: "$ctrl"
                });
            }
        }
    ]);
