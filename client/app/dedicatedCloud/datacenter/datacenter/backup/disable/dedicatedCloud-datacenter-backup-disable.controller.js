angular.module("App").controller("DedicatedCloudSubDatacenterVeeamBackupDisableCtrl", ($scope, $stateParams, DedicatedCloud, $rootScope) => {
    "use strict";

    $scope.datacenterName = $scope.currentActionData;
    $scope.loading = false;

    $scope.disableBackup = function () {
        $scope.loading = true;
        DedicatedCloud.disableVeeam($stateParams.productId, $stateParams.datacenterId).then(
            () => {
                $scope.resetAction();
                $scope.loading = false;
                $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_disable_success", $scope.datacenterName), true);
            },
            (data) => {
                $scope.resetAction();
                $scope.loading = false;
                $rootScope.$broadcast("datacenter.veeam.reload");
                $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_disable_fail", $scope.datacenterName), angular.extend(data, { type: "ERROR" }));
            }
        );
    };
});
