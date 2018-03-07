angular.module("Module.ip.controllers").controller("IpAddVirtualMacCtrl", ($scope, $rootScope, Ip, IpVirtualMac, Alerter) => {
    $scope.data = $scope.currentActionData; // service and sub
    $scope.model = {
        choice: "new"
    };

    $scope.loading = true;

    $scope.existingVirtualMacs = [];

    if ($scope.data.ipBlock.service.virtualmac && $scope.data.ipBlock.service.virtualmac.virtualMacs) {
        angular.forEach($scope.data.ipBlock.service.virtualmac.virtualMacs, (ips, virtualmac) => {
            if (ips.length && !~ips.indexOf($scope.data.ip.ip)) {
                $scope.existingVirtualMacs.push(virtualmac);
            }
        });
    }

    Ip.getServerModels().then((models) => {
        $scope.types = models["dedicated.server.VmacTypeEnum"].enum;
        $scope.loading = false;
    });

    /* Action */

    $scope.addVirtualMac = function () {
        $scope.loading = true;
        if ($scope.model.choice === "new") {
            IpVirtualMac.addVirtualMacToIp($scope.data.ipBlock.service.serviceName, $scope.data.ip.ip, $scope.model.type, $scope.model.virtualMachineName)
                .then(
                    () => {
                        $rootScope.$broadcast("ips.table.refreshVmac", $scope.data.ipBlock);
                        Alerter.success($scope.tr("ip_virtualmac_add_new_success", $scope.data.ip.ip));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("ip_virtualmac_add_new_failure", $scope.data.ip.ip), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        } else {
            IpVirtualMac.addIpToVirtualMac($scope.data.ipBlock.service.serviceName, $scope.model.macAddress, $scope.data.ip.ip, $scope.model.virtualMachineName)
                .then(
                    () => {
                        $rootScope.$broadcast("ips.table.refreshVmac", $scope.data.ipBlock);
                        Alerter.success($scope.tr("ip_virtualmac_add_existing_success", $scope.data.ip.ip));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("ip_virtualmac_add_existing_failure", $scope.data.ip.ip), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        }
    };

    $scope.isValid = function () {
        switch ($scope.model.choice) {
        case "new":
            return $scope.model.type && $scope.model.virtualMachineName;
        case "existing":
            return $scope.model.macAddress && $scope.model.virtualMachineName;
        default:
            return false;
        }
    };
});
