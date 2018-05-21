angular.module("App").controller("DedicatedCloudLicencesCtrl", ($rootScope, $scope, $state, $stateParams, $translate, constants, DedicatedCloud) => {
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
                $scope.setMessage($translate.instant("dedicatedCloud_dashboard_loading_error"), angular.extend(data, { type: "ERROR" }));
            }
        );
    };

    $scope.canBeActivatedSpla = function () {
        return $scope.licences.spla === false && $scope.licences.canActive;
    };

    $scope.enableLicense = function () {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.license.enable");
        } else {
            $scope.setAction("license/enable/dedicatedCloud-license-enable");
        }
    };

    $scope.loadLicences();
});
