angular.module("App").controller("DedicatedCloudSubDatacenterLicencesCtrl", ($scope, $stateParams, DedicatedCloud, $rootScope) => {
    "use strict";

    $scope.licences = {
        model: null,
        spla: null,
        canActive: false
    };
    $scope.loading = {
        licences: false,
        error: false
    };

    $rootScope.$on("datacenter.licences.reload", () => {
        $scope.loadLicences(true);
    });

    $scope.loadLicences = function () {
        $scope.loading.licences = true;
        DedicatedCloud.getDatacenterLicence($stateParams.productId).then(
            (datacenter) => {
                $scope.licences.spla = datacenter.isSplaActive;
                $scope.licences.canActive = datacenter.canOrderSpla;
                $scope.loading.licences = false;
            },
            (data) => {
                $scope.loading.licences = false;
                $scope.loading.error = true;
                $scope.setMessage($scope.tr("dedicatedCloud_dashboard_loading_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };

    $scope.canBeActivatedSpla = function () {
        return $scope.licences.spla === false && $scope.licences.canActive;
    };

    $scope.loadLicences();
});
