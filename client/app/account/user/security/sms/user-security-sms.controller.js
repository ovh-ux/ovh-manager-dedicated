angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.sms", [
    "$scope",
    "$q",
    "UserAccount.services.doubleAuth.sms",
    "Alerter",
    function ($scope, $q, DoubleAuthSmsService, Alerter) {
        "use strict";

        $scope.sms = {
            smsAccounts: null,
            isLoading: false
        };

        /* ===============================
        =            HELPERS            =
        =============================== */

        /**
         * Fetch SMS accounts.
         * @return {Promise}
         */
        function fetchSmsAccounts () {
            return DoubleAuthSmsService.query().then((smsIds) => $q.all(_.map(smsIds, (smsId) => DoubleAuthSmsService.get(smsId))).then((smsAccounts) => _.filter(smsAccounts, (smsAccount) => smsAccount.status !== "needCodeValidation")));
        }

        /* -----  End of HELPERS  ------ */

        /* ==============================
        =            EVENTS            =
        ============================== */

        $scope.$on("doubleAuthSMS.reload", $scope.init);

        /* -----  End of EVENTS  ----- */

        /* ======================================
        =            INITIALIZATION            =
        ====================================== */

        /**
         * Init.
         * @return {Promise}
         */
        $scope.init = () => {
            $scope.sms.isLoading = true;
            return fetchSmsAccounts()
                .then((smsAccounts) => {
                    $scope.sms.smsAccounts = smsAccounts;
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_account_security_double_auth_type_sms_error"), err.data, "doubleAuthAlert"))
                .finally(() => {
                    $scope.sms.isLoading = false;
                });
        };

        /* -----  End of INITIALIZATION  ------ */
    }
]);
