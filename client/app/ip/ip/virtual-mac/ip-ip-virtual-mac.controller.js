angular.module("Module.ip.controllers").controller("IpViewVirtualMacCtrl", ($scope, Ip, IpVirtualMac) => {
    $scope.data = $scope.currentActionData;
    $scope.loading = true;

    IpVirtualMac.getVirtualMacDetails($scope.data.ipBlock.service.serviceName, $scope.data.ipBlock.service.virtualmac.virtualMacsByIp[$scope.data.ip.ip], $scope.data.ip.ip).then(
        (details) => {
            $scope.details = details;
            $scope.loading = false;
        },
        () => {
            $scope.loading = false;
        }
    );
});
