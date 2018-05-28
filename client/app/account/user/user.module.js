angular
    .module("UserAccount")
    .config(($stateProvider) => {
        $stateProvider.state("app.account.useraccount", {
            url: "/useraccount",
            controller: "UserAccountController",
            templateUrl: "account/user/user.html",
            translations: ["account/user"],
            "abstract": true
        });

        $stateProvider.state("app.account.service.useraccount", {
            url: "/useraccount",
            controller: "UserAccountController",
            templateUrl: "account/user/user.html",
            "abstract": true,
            translations: ["account/user"]
        });
    })
    .constant("sshkey-regex", [
        {
            name: "RSA",
            regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +\/]+[=]{0,3})\s+(\S+)$/
        },
        {
            name: "ECDSA",
            regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +\/]+[=]{0,3})\s+(\S+)$/
        },
        {
            name: "ED25519",
            regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +\/]+[=]{0,3})\s+(\S+)$/
        }
    ])
    .run([
        "$controller",
        "UserAccount.constants",
        "$rootScope",
        function ($controller, userAccountConstants, $rootScope) {
            "use strict";
            $rootScope.target = userAccountConstants.target;
            $rootScope.worldPart = userAccountConstants.target;
        }
    ]);
