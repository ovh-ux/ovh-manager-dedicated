angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.totp.add", [
    "$rootScope",
    "$scope",
    "$q",
    "UserAccount.services.doubleAuth.totp",
    "Alerter",
    function ($rootScope, $scope, $q, DoubleAuthTotpService, Alerter) {
        "use strict";

        $scope.totp = {
            qrCode: null,
            size: 220,
            code: null,
            description: null,
            showSecret: false,
            isLoading: false,
            isAdding: false
        };

        /* ===============================
        =            HELPERS            =
        =============================== */

        /**
         * Check if step is valid.
         * @return {Boolean}
         */
        $scope.doesStepIsValid = () => this.userAccountAddTotpForm && this.userAccountAddTotpForm.$valid;

        /**
         * Toggle secret field.
         */
        $scope.toggleSecretField = () => {
            $scope.totp.showSecret = !$scope.totp.showSecret;
        };

        /* -----  End of HELPERS  ------ */

        /* ===============================
        =            ACTIONS            =
        =============================== */

        /**
         * Remove generated TOTP.
         * @return {Promise}
         */
        $scope.removeGeneratedTotp = () => {
            let promise = $q.when(true);
            if (_.has($scope.totp.qrCode, "id")) {
                promise = DoubleAuthTotpService.delete($scope.totp.qrCode.id);
            }
            return promise.catch((err) => Alerter.alertFromSWS($scope.tr("user_security_double_auth_totp_enable_error"), err.data, "doubleAuthAlertTotp"));
        };

        /**
         * Add double auth TOTP account.
         * @return {Promise}
         */
        $scope.addDoubleAuthTotp = () => {
            $scope.totp.isAdding = true;
            return DoubleAuthTotpService.validate($scope.totp.qrCode.id, $scope.totp.code)
                .then(() => {
                    if (!_.isEmpty($scope.totp.description)) {
                        DoubleAuthTotpService.edit($scope.totp.qrCode.id, $scope.totp.description);
                    }
                })
                .then(() => {
                    Alerter.success($scope.tr("user_security_double_auth_totp_add_success"), "doubleAuthAlertTotp");
                    $rootScope.$broadcast("doubleAuthTOTP.reload");
                    $scope.resetAction();
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_account_security_double_auth_type_totp_error_validate"), err.data, "doubleAuthAlertTotpAdd"))
                .finally(() => {
                    $scope.totp.isAdding = false;
                });
        };

        /**
         * Cancel TOTP add modal.
         */
        $scope.cancel = () =>
            $scope.removeGeneratedTotp().then(() => {
                $rootScope.$broadcast("doubleAuthTOTP.reload");
                $scope.resetAction();
            });

        /* -----  End of ACTIONS  ------ */

        /* ======================================
        =            INITIALIZATION            =
        ====================================== */

        /**
         * Init.
         * @return {Promise}
         */
        $scope.init = () => {
            $scope.totp.isLoading = true;
            return DoubleAuthTotpService.post()
                .then((totpSecret) => {
                    $scope.totp.qrCode = totpSecret;
                    return totpSecret;
                })
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_security_double_auth_type_totp_add_error"), err.data, "doubleAuthAlertTotp");
                    $scope.resetAction();
                })
                .finally(() => {
                    $scope.totp.isLoading = false;
                });
        };

        /* -----  End of INITIALIZATION  ------ */
    }
]);
