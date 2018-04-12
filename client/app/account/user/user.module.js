angular
    .module("UserAccount")
    .config([
        "$stateProvider",
        "UserAccount.conf.BASE_URL",
        "UserAccount.constants",
        function ($stateProvider, USER_ACCOUNT_BASE_URL, userAccountConstants) {
            "use strict";

            const target = userAccountConstants.target;
            const baseUrl = "account/user/";

            $stateProvider.state("app.account.useraccount", {
                url: "/useraccount",
                controller: "UserAccount.controllers.main",
                templateUrl: `${baseUrl}/user.html`,
                "abstract": true
            });

            $stateProvider.state("app.account.service.useraccount", {
                url: "/useraccount",
                controller: "UserAccount.controllers.main",
                templateUrl: `${baseUrl}/user.html`,
                "abstract": true
            });

            if (target === "EU") {
                $stateProvider.state("app.account.useraccount.subscriptions", {
                    url: "/subscriptions",
                    templateUrl: `${baseUrl}subscriptions/user-subscriptions.html`,
                    controller: "UserAccount.controllers.Subscriptions"
                });

                $stateProvider.state("app.account.useraccount.subContacts", {
                    url: "/subContacts",
                    templateUrl: `${baseUrl}subContacts/user-subContacts.html`,
                    controller: "UserAccount.controllers.subcontacts",
                    controllerAs: "ctrl"
                });

                $stateProvider.state("app.account.useraccount.subContacts.add", {
                    url: "/add",
                    templateUrl: `${baseUrl}subContacts/add/user-subContacts-add.html`,
                    controller: "UserAccount.controllers.subcontacts.add"
                });

                $stateProvider.state("app.account.useraccount.subContacts.edit", {
                    url: "/:contactId",
                    templateUrl: `${baseUrl}subContacts/edit/user-subContacts-edit.html`,
                    controller: "UserAccount.controllers.subcontacts.edit"
                });
            }

            $stateProvider.state("app.account.useraccount.ssh", {
                url: "/ssh",
                templateUrl: `${baseUrl}ssh/user-ssh.html`,
                controller: "UserAccount.controllers.ssh",
                controllerAs: "ctrlSsh"
            });

            $stateProvider.state("app.account.useraccount.advanced", {
                url: "/advanced",
                templateUrl: `${baseUrl}advanced/user-advanced.html`,
                controller: "UserAccount.controllers.advanced",
                controllerAs: "advancedCtrl"
            });

            $stateProvider.state("app.account.useraccount.infos", {
                url: "/infos",
                templateUrl: `${baseUrl}infos/user-infos.html`,
                controller: "UserAccount.controllers.Infos"
            });

            if (target === "EU" || target === "CA") {

                $stateProvider.state("app.account.useraccount.emails", {
                    url: "/emails",
                    templateUrl: `${baseUrl}emails/user-emails.html`,
                    controller: "UserAccount.controllers.emails"
                });

                $stateProvider.state("app.account.useraccount.emailsDetails", {
                    url: "/emails/:emailId",
                    templateUrl: `${baseUrl}emails/details/user-emails-details.html`,
                    controller: "UserAccount.controllers.emails.details"
                });

                $stateProvider.state("app.account.service.useraccount.agreements", {
                    url: "/agreements",
                    templateUrl: `${baseUrl}agreements/user-agreements.html`,
                    controller: "UserAccount.controllers.agreements"
                });

                $stateProvider.state("app.account.service.useraccount.agreementsDetails", {
                    url: "/agreements/:id/details",
                    templateUrl: `${baseUrl}agreements/details/user-agreements-details.html`,
                    controller: "UserAccount.controllers.agreements.details",
                    controllerAs: "ctrl"
                });
            }

            $stateProvider.state("app.account.useraccount.security", {
                url: "/security",
                templateUrl: `${baseUrl}security/user-security.html`,
                controller: "UserAccount.controllers.doubleAuth"
            });

            if (target === "US") {
                $stateProvider.state("app.account.useraccount.users", {
                    url: "/security/users",
                    templateUrl: `${baseUrl}security/users/users.html`,
                    controller: "UserAccountUsersCtrl",
                    translations: ["account/user/security/users"]
                });
            }

        }
    ])
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
        "translator",
        "UserAccount.constants",
        "$rootScope",
        function ($controller, translator, userAccountConstants, $rootScope) {
            "use strict";
            translator.load(["useraccount", "countries", "newAccountForm"]);
            $rootScope.target = userAccountConstants.target;
            $rootScope.worldPart = userAccountConstants.target;
        }
    ]);
