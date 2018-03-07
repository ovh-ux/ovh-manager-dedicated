angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.u2f", [
    "$scope",
    "$q",
    "UserAccount.services.doubleAuth.u2f",
    "Alerter",
    function ($scope, $q, DoubleAuthU2fService, Alerter) {
        "use strict";

        $scope.u2f = {
            u2fAccounts: null,
            isLoading: false
        };

        /* ===============================
        =            HELPERS            =
        =============================== */

        /**
         * Fetch U2F accounts.
         * @return {Promise}
         */
        function fetchU2fAccounts () {
            return DoubleAuthU2fService.query().then((u2fIds) => $q.all(_.map(u2fIds, (u2fId) => DoubleAuthU2fService.get(u2fId))).then((u2fAccounts) => _.filter(u2fAccounts, (u2fAccount) => u2fAccount.status !== "needCodeValidation")));
        }

        /* -----  End of HELPERS  ------ */

        /* ==============================
        =            EVENTS            =
        ============================== */

        $scope.$on("doubleAuthU2F.reload", $scope.init);

        /* -----  End of EVENTS  ----- */

        /* ======================================
        =            INITIALIZATION            =
        ====================================== */

        /**
         * Init.
         * @return {Promise}
         */
        $scope.init = () => {
            $scope.u2f.isLoading = true;
            return fetchU2fAccounts()
                .then((u2fAccounts) => {
                    $scope.u2f.u2fAccounts = u2fAccounts;
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_totpRestrictions_add_error"), err.data, "doubleAuthAlert"))
                .finally(() => {
                    $scope.u2f.isLoading = false;
                });
        };

        /* -----  End of INITIALIZATION  ------ */
    }
]);
