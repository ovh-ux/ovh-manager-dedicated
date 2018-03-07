angular.module("App").controller("DedicatedCloudSubDatacenterVeeamBackupEnableCtrl", ($scope, $stateParams, DedicatedCloud, $rootScope) => {
    "use strict";

    $scope.datacenterName = $scope.currentActionData;
    $scope.loading = false;

    $scope.enableBackup = function () {
        $scope.loading = true;
        DedicatedCloud.enableVeeam($stateParams.productId, $stateParams.datacenterId).then(
            () => {
                $scope.resetAction();
                $scope.loading = false;
                $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_enable_success", $scope.datacenterName), true);
            },
            (err) => {
                $scope.resetAction();
                $scope.loading = false;
                $rootScope.$broadcast("datacenter.veeam.reload");
                $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_enable_fail", $scope.datacenterName), {
                    type: "ERROR",
                    message: err.message
                });
            }
        );
    };
});
