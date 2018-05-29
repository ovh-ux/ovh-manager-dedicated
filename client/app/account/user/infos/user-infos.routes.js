angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount.infos", {
            url: "/infos",
            templateUrl: "account/user/infos/user-infos.html",
            controller: "UserAccountInfosController",
            controllerAs: "$ctrl",
            translations: ["account/user/newAccountForm"]
        });
    });
