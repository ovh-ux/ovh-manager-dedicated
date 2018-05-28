angular
    .module("UserAccount")
    .config([
        "$stateProvider",
        "UserAccount.constants",
        function ($stateProvider, userAccountConstants) {
            "use strict";
            const target = userAccountConstants.target;
            if (target === "EU" || target === "CA") {
                $stateProvider.state("app.account.service.useraccount.agreements", {
                    url: "/agreements",
                    templateUrl: "account/user/agreements/user-agreements.html",
                    controller: "UserAccountAgreementsController",
                    controllerAs: "$ctrl"
                });
            }
        }
    ]);
