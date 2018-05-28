angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount.users", {
            url: "/security/users",
            templateUrl: "account/user/security/users/users.html",
            controller: "UserAccountUsersCtrl",
            translations: ["account/user/security/users"]
        });
    });
