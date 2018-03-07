angular.module("App").controller("NasPartitionDeleteCtrl", ($scope, $stateParams, Nas, $rootScope, Alerter) => {
    const alerterId = "NasAlert";

    $scope.toDelete = $scope.currentActionData;

    $scope.deletePartition = function () {
        $scope.resetAction();
        Nas.deletePartition($stateParams.nasId, $scope.toDelete.partitionName)
            .then((task) => {
                $rootScope.$broadcast("nas_launch_task", task);
                Alerter.success($scope.tr("nas_partitions_action_delete_success", $scope.toDelete.partitionName), alerterId);
            })
            .catch((err) => Alerter.alertFromSWS($scope.tr("nas_partitions_action_delete_failure", $scope.toDelete.partitionName), err, alerterId));
    };
});
