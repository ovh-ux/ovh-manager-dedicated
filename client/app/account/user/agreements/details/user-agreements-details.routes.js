angular
    .module("UserAccount")
    .config([
        "$stateProvider",
        "UserAccount.constants",
        function ($stateProvider, userAccountConstants) {
            "use strict";
            const target = userAccountConstants.target;
            if (target === "EU" || target === "CA") {
                $stateProvider.state("app.account.service.useraccount.agreementsDetails", {
                    url: "/agreements/:id/details",
                    templateUrl: "account/user/agreements/details/user-agreements-details.html",
                    controller: "UserAccountAgreementsDetailsController",
                    controllerAs: "$ctrl"
                });
            }
        }
    ]);
