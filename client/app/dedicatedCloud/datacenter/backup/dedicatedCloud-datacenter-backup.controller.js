angular.module("App").controller("DedicatedCloudSubDatacenterVeeamCtrl", ($q, $scope, $stateParams, DedicatedCloud, $rootScope, VEEAM_STATE_ENUM) => {
    "use strict";

    $scope.veeam = {
        model: null,
        constants: VEEAM_STATE_ENUM
    };
    $scope.host = null;
    $scope.loading = false;

    $rootScope.$on("datacenter.veeam.reload", () => {
        $scope.loadVeeam(true);
    });

    $scope.loadVeeam = function (forceRefresh) {
        $scope.loading = true;
        return $q.all({
            veeam: DedicatedCloud.getVeeam($stateParams.productId, $stateParams.datacenterId, forceRefresh),
            host: DedicatedCloud.getHostsLexi($stateParams.productId, $stateParams.datacenterId)
        }).then((data) => {
            $scope.veeam.model = data.veeam;
            $scope.host = data.host;
            $scope.loading = false;
        }, (data) => {
            $scope.loading = false;
            $scope.setMessage($scope.tr("dedicatedCloud_tab_veeam_loading_error"), angular.extend(data, { type: "ERROR" }));
        });
    };

    $scope.canBeActivated = function () {
        return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.DISABLED;
    };

    $scope.canBeDisabled = function () {
        return $scope.veeam.model && $scope.veeam.model.state === $scope.veeam.constants.ENABLED;
    };

    $scope.loadVeeam();
});
