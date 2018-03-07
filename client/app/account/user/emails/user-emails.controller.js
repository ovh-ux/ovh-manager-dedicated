angular.module("UserAccount.controllers").controller("UserAccount.controllers.emails", [
    "$q",
    "$location",
    "$scope",
    "UserAccount.services.emails",
    "Alerter",

    function ($q, $location, $scope, Emails, Alerter) {
        "use strict";
        const self = this;

        $scope.itemsPerPage = 10;
        $scope.currentPage = $location.search() && $location.search().currentPage != null ? $location.search().currentPage : 1;

        $scope.init = () => {
            $scope.loaders = {
                emails: true
            };

            $scope.emails = {
                ids: [],
                detail: []
            };

            $scope.getEmailIds();
        };

        $scope.getEmailIds = (refresh) => {
            self.mailsIdsInError = [];
            $scope.loaders.emails = true;
            Emails.getEmails({ forceRefresh: refresh })
                .then((table) => {
                    // We receive the email ids from oldest to newest, so reverse them to have the newest on top.
                    $scope.emails.ids = table.reverse();
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_table_email_error"), null, "user_account_email");
                    return $q.reject(err);
                })
                .finally(() => {
                    $scope.loaders.emails = false;
                });
        };

        $scope.transformItem = (emailId) => {
            $scope.loaders.emails = true;
            return Emails.getEmail(emailId).catch((err) => {
                Alerter.alertFromSWS($scope.tr("user_account_table_email_error"), null, "user_account_email");
                return $q.reject(err);
            });
        };

        $scope.onTransformItemDone = () => {
            $scope.loaders.emails = false;
        };

        $scope.resetEmailIdsInError = () => {
            self.mailsIdsInError = [];
            return true;
        };

        $scope.init();
    }
]);
