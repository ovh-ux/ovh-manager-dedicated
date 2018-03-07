angular.module("UserAccount.controllers").controller("UserAccount.controllers.contactCtrl", [
    "$location",
    "$scope",
    "User",
    "AccountCreationURLS",
    "Alerter",
    function ($location, $scope, User, ACCOUNT_CREATION_URLS, Alerter) {
        "use strict";

        const self = this;

        self.loaders = {
            init: false
        };

        self.user = null;

        self.getAccountCreationUrl = function () {
            const subs = self.user.ovhSubsidiary || "FR";
            const languageSpecificSubs = "{$language}_{$subs}";
            const newNicUrl = ACCOUNT_CREATION_URLS[languageSpecificSubs] || ACCOUNT_CREATION_URLS[subs] || ACCOUNT_CREATION_URLS.FR;
            const returnUrl = $location.absUrl();
            return `${newNicUrl}?redirectTo=${returnUrl}`;
        };

        function init () {
            self.loaders.init = true;
            User.getUser()
                .then((user) => {
                    self.user = user;
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_contacts_error"), err, "useraccount.alerts.dashboardContacts");
                })
                .finally(() => {
                    self.loaders.init = false;
                });
        }

        init();
    }
]);
