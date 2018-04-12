angular
    .module("UserAccount")
    .config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.account.useraccount.credentials", {
            url: "/credentials",
            templateUrl: "account/user/credentials/user-credentials.html",
            controller: "UserAccount.controllers.credentials",
            controllerAs: "$ctrl"
        });
    }]);
