angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount.ssh", {
            url: "/ssh",
            templateUrl: "account/user/ssh/user-ssh.html",
            controller: "UserAccountSshController",
            controllerAs: "$ctrl"
        });
    });
