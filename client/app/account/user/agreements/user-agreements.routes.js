angular.module("UserAccount").config(["$stateProvider", "$urlServiceProvider", "UserAccount.constants", ($stateProvider, $urlServiceProvider, constants) => {

    if (constants.target === "EU" || constants.target === "CA") {
        $stateProvider.state("app.account.billing.service.agreements", {
            url: "/agreements",
            templateUrl: "account/user/agreements/user-agreements.html",
            controller: "UserAccount.controllers.agreements",
            translations: ["account/user"]
        });

        $stateProvider.state("app.account.billing.service.agreements.details", {
            url: "/details/:id",
            templateUrl: "account/user/agreements/details/user-agreements-details.html",
            controller: "UserAccount.controllers.agreements.details",
            controllerAs: "ctrl"
        });

        // ensure compatibility with links sended by emails like #/useraccount/agreements or #/useraccount/agreements/123456/details
        // make a redirect to the new url of ui route
        $urlServiceProvider.rules.when("/useraccount/agreements", "/billing/agreements");
        $urlServiceProvider.rules.when("/useraccount/agreements/:id/details", "/billing/agreements/details/:id");
    }

}]);
