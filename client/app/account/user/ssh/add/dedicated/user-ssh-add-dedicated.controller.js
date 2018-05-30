angular.module("UserAccount").controller("UserAccount.controllers.ssh.dedicated.add", [
    "$scope",
    "$translate",
    "UserAccount.services.ssh",
    "$timeout",
    "Alerter",
    function ($scope, $translate, UseraccountSsh, $timeout, Alerter) {
        "use strict";

        const fullSshList = $scope.currentActionData || [];

        $scope.model = {};
        $scope.sshKeyAlreadyCreatedError = false;

        $scope.addDedicatedSshKey = function () {
            UseraccountSsh.addDedicatedSshKey($scope.model).then(
                () => {
                    Alerter.success($translate.instant("user_ssh_add_success_message"));
                },
                (failure) => {
                    Alerter.alertFromSWS($translate.instant("user_ssh_add_error_message"), failure.data);
                }
            );
            $scope.resetAction();
        };

        $scope.formIsValid = function () {
            if ($scope.model.keyName && ~fullSshList.indexOf($scope.model.keyName)) {
                $scope.sshKeyAlreadyCreatedError = true;
                return false;
            } else if (!$scope.model.keyName || !$scope.model.keyIsValid) {
                $scope.sshKeyAlreadyCreatedError = false;
                return false;
            }
            $scope.sshKeyAlreadyCreatedError = false;
            return true;
        };

        $timeout(() => {
            angular.element("#sshAddKeyNameLabel").focus();
        }, 600);
    }
]);
