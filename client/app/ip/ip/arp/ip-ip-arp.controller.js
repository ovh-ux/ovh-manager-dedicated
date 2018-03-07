angular.module("Module.ip.controllers").controller("IpViewArpCtrl", ($scope, $rootScope, Ip, IpArp, Alerter) => {
    $scope.data = $scope.currentActionData;
    $scope.loading = true;

    IpArp.getArpDetails($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
        .then((details) => {
            $scope.details = details;
        })
        .finally(() => {
            $scope.loading = false;
        });

    $scope.unblockArp = function () {
        $scope.loading = true;
        IpArp.unblockIp($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
            .then(
                () => {
                    $rootScope.$broadcast("ips.table.refreshBlock", $scope.data.ipBlock);
                    Alerter.success($scope.tr("ip_arp_unblock_success"));
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("ip_arp_unblock_failure"), data);
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
