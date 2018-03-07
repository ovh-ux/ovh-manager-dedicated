angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.password", [
    "$scope",
    "UserAccount.services.Infos",
    "Alerter",
    function ($scope, UseraccountInfos, Alerter) {
        "use strict";

        $scope.loaders = {
            loading: false
        };

        /* ===============================
        =            ACTIONS            =
        =============================== */

        /**
         * Load user infos.
         * @return {Promise}
         */
        $scope.loadUserInfos = () => {
            $scope.loaders.loading = true;
            return UseraccountInfos.getUseraccountInfos()
                .then((user) => {
                    $scope.user = user;
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_account_changepassword_fail"), err.data, "useraccount.alerts.dashboardInfos"))
                .finally(() => {
                    $scope.loaders.loading = false;
                });
        };

        /**
         * Change password.
         * @return {Promise}
         */
        $scope.changePassword = () => {
            $scope.loaders.loading = true;
            return UseraccountInfos.changePassword()
                .then(() => Alerter.alertFromSWS($scope.tr("user_account_changepassword_success", "useraccount.alerts.dashboardInfos")))
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_account_changepassword_fail"), err.data, "useraccount.alerts.dashboardInfos"))
                .finally(() => {
                    $scope.loaders.loading = false;
                    $scope.resetAction();
                });
        };

        /* -----  End of ACTIONS  ------ */
    }
]);
