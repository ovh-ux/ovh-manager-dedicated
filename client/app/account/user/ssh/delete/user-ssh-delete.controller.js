angular.module("UserAccount.controllers").controller("UserAccount.controllers.ssh.delete", [
    "$scope",
    "UserAccount.services.ssh",
    "Alerter",
    function ($scope, UseraccountSsh, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;

        $scope.deleteSshKey = function () {
            $scope.resetAction();
            const promise = $scope.data.category === "dedicated" ? UseraccountSsh.deleteDedicatedSshKey($scope.data.keyName) : UseraccountSsh.deleteCloudSshKey($scope.data.serviceName, $scope.data.id);

            promise.then(() => {
                Alerter.success($scope.tr("user_ssh_delete_success_message"), "userSsh");
            }, (err) => {
                Alerter.error(`${$scope.tr("user_ssh_delete_error_message")} ${_.get(err, "message") || err}`, "userSsh");
            });
        };
    }
]);
