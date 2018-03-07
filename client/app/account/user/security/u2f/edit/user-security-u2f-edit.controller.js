angular.module("UserAccount.controllers").controller("UserAccount.controllers.doubleAuth.u2f.edit", [
    "$rootScope",
    "$scope",
    "$q",
    "UserAccount.services.doubleAuth.u2f",
    "Alerter",
    function ($rootScope, $scope, $q, DoubleAuthU2fService, Alerter) {
        "use strict";

        $scope.u2f = {
            u2fAccount: _.get($scope, "currentActionData", {}),
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
        $scope.doesStepIsValid = () => !angular.equals($scope.u2f.u2fAccount.description, $scope.u2f.description) && this.userAccountEditU2fDescriptionForm && this.userAccountEditU2fDescriptionForm.$valid;

        /* -----  End of HELPERS  ------ */

        /* ===============================
        =            ACTIONS            =
        =============================== */

        /**
         * Edit double auth U2F key.
         * @return {Promise}
         */
        $scope.editDoubleAuthU2f = () => {
            $scope.u2f.isEditing = true;
            return DoubleAuthU2fService.edit($scope.u2f.u2fAccount.id, $scope.u2f.description)
                .then(() => {
                    Alerter.success($scope.tr("user_account_security_double_auth_type_u2f_edit_success", "doubleAuthAlertU2f"));
                    $rootScope.$broadcast("doubleAuthU2F.reload");
                })
                .catch((err) => Alerter.alertFromSWS($scope.tr("user_account_security_double_auth_type_u2f_edit_error"), err.data, "doubleAuthAlertU2f"))
                .finally(() => {
                    $scope.u2f.isEditing = false;
                    $scope.resetAction();
                });
        };

        /**
         * Cancel U2F edit modal.
         */
        $scope.cancel = () => $scope.resetAction();

        /* -----  End of ACTIONS  ------ */
    }
]);
