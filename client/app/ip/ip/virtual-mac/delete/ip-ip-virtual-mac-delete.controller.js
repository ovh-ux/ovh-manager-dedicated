angular.module("Module.ip.controllers").controller("IpDeleteVirtualMacCtrl", ($scope, $rootScope, Ip, IpVirtualMac, Alerter) => {
    $scope.data = $scope.currentActionData; // service and sub

    /* Action */

    $scope.deleteVirtualMac = function () {
        $scope.loading = true;
        IpVirtualMac.deleteVirtualMac($scope.data.ipBlock.service.serviceName, $scope.data.ipBlock.service.virtualmac.virtualMacsByIp[$scope.data.ip.ip], $scope.data.ip.ip)
            .then(
                () => {
                    $rootScope.$broadcast("ips.table.refreshVmac", $scope.data.ipBlock);

                    Alerter.success($scope.tr("ip_virtualmac_delete_success", [$scope.data.ipBlock.service.virtualmac.virtualMacsByIp[$scope.data.ip.ip], $scope.data.ip.ip]));
                },
                (reason) => {
                    Alerter.alertFromSWS($scope.tr("ip_virtualmac_delete_failure", [$scope.data.ipBlock.service.virtualmac.virtualMacsByIp[$scope.data.ip.ip], $scope.data.ip.ip]), reason);
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
