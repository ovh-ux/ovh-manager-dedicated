angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount.advanced", {
            url: "/advanced",
            templateUrl: "account/user/advanced/user-advanced.html",
            controller: "UserAccountAdvancedController",
            controllerAs: "$ctrl"
        });
    });
