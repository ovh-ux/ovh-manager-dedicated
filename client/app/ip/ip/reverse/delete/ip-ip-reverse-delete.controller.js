angular.module("Module.ip.controllers").controller("IpIpv6ReverseDelegationDeleteCtrl", ($scope, $rootScope, Ip, IpReverse, Alerter) => {
    $scope.ipBlock = $scope.currentActionData.ipBlock;
    $scope.reverse = $scope.currentActionData.reverse;

    /* Action */
    $scope.deleteIpv6ReverseDelegation = function () {
        $scope.resetAction();

        IpReverse.deleteDelegation($scope.ipBlock.ipBlock, $scope.reverse).then(
            () => {
                $rootScope.$broadcast("ips.table.refreshBlock", $scope.ipBlock);
                Alerter.success($scope.tr("ip_table_manage_delegation_ipv6block_delete_success"));
            },
            (err) => {
                Alerter.alertFromSWS($scope.tr("ip_table_manage_delegation_ipv6block_delete_err"), err);
            }
        );
    };
});
