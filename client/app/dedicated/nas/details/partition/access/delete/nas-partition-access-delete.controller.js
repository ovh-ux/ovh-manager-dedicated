angular.module("App").controller("NasPartitionAccessDeleteCtrl", ($scope, $stateParams, Nas, $rootScope, Alerter) => {
    const alerterId = "NasAlert";

    $scope.toDelete = $scope.currentActionData;

    $scope.deleteAccess = function () {
        $scope.resetAction();
        Nas.deleteAccess($stateParams.nasId, $scope.toDelete.partitionName, $scope.toDelete.access).then(
            (task) => {
                $rootScope.$broadcast("nas_launch_task", task);
                Alerter.success($scope.tr("nas_access_action_delete_success", $scope.toDelete.access), alerterId);
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("nas_access_action_delete_failure", $scope.toDelete.access), data, alerterId);
            }
        );
    };
});
