angular.module("App").controller("MonitoringDeleteCtrl", ($rootScope, $scope, $stateParams, Server, Alerter) => {
    "use strict";

    $scope.monitoring = $scope.currentActionData;
    $scope.loaders = {
        deleting: false
    };

    $scope.deleteMonitoring = function () {
        $scope.loaders.deleting = true;
        Server.deleteServiceMonitoring($stateParams.productId, $scope.monitoring.monitoringId)
            .then(
                () => {
                    $rootScope.$broadcast("server.monitoring.reload");
                    Alerter.success($scope.tr("server_tab_MONITORING_delete_success"), "monitoringAlert");
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("server_tab_MONITORING_delete_error"), err.data, "monitoringAlert");
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
