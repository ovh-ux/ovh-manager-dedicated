angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount.security", {
            url: "/security",
            templateUrl: "account/user/security/user-security.html",
            controller: "UserAccountSecurityController",
            controllerAs: "$ctrl"
        });
    });
