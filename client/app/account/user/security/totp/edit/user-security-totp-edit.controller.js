angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.totp.edit", [
    "$rootScope",
    "$scope",
    "UserAccount.services.doubleAuth.totp",
    "Alerter",
    function ($rootScope, $scope, DoubleAuthTotpService, Alerter) {
        "use strict";

        $scope.totp = {
            totpAccount: _.get($scope, "currentActionData", {}),
            description: _.get($scope, "currentActionData.description", ""),
            isEditing: false
        };

        /* ===============================
        =            HELPERS            =
        =============================== */

        /**
         * Check if step is valid.
         * @return {Boolean}
         */
        $scope.doesStepIsValid = () => !angular.equals($scope.totp.totpAccount.description, $scope.totp.description) && this.userAccountEditTotpDescriptionForm && this.userAccountEditTotpDescriptionForm.$valid;

        /* -----  End of HELPERS  ------ */

        /* ===============================
        =            ACTIONS            =
        =============================== */

        /**
         * Edit double auth TOTP account.
         * @return {Promise}
         */
        $scope.editDoubleAuthTotp = () => {
            $scope.totp.isEditing = true;
            return DoubleAuthTotpService.edit($scope.totp.totpAccount.id, $scope.totp.description)
                .then(() => {
                    Alerter.success($scope.tr("", "doubleAuthAlertTotp"));
                    $rootScope.$broadcast("doubleAuthTOTP.reload");
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_security_double_auth_totp_edit_error"), err.data, "doubleAuthAlertTotp"))
                .finally(() => {
                    $scope.totp.isEditing = false;
                    $scope.resetAction();
                });
        };

        /**
         * Cancel TOTP edit modal.
         */
        $scope.cancel = () => $scope.resetAction();

        /* -----  End of ACTIONS  ------ */
    }
]);
