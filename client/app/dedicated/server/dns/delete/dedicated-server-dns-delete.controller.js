angular.module("App").controller("DeleteSecondaryDnsCtrl", ($scope, $stateParams, Server) => {
    $scope.secdns = $scope.currentActionData;
    $scope.loadingDelete = false;

    $scope.deleteSecondaryDns = function () {
        $scope.loadingDelete = true;
        Server.deleteSecondaryDns($stateParams.productId, $scope.secdns.domain).then(
            () => {
                $scope.loadingDelete = false;
                $scope.resetAction();
                $scope.setMessage($scope.tr("server_configuration_delete_secondary_dns_success", [$scope.secdns.domain]));
            },
            (err) => {
                $scope.loadingDelete = false;
                $scope.resetAction();
                $scope.setMessage($scope.tr("server_configuration_delete_secondary_dns_fail", [$scope.secdns.domain]), err);
            }
        );
    };
});
