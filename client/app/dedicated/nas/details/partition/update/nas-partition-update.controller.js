angular.module("App").controller("NasPartitionUpdateCtrl", ($scope, $stateParams, Nas, $rootScope, Alerter) => {
    const alerterId = "NasAlert";

    $scope.partition = $scope.currentActionData.partition;
    $scope.currentNasPartition = $scope.currentActionData.currentNas;
    $scope.updateValue = {
        sizeP: $scope.partition.size
    };

    $scope.checkSize = function () {
        if ($scope.updateValue.sizeP) {
            $scope.updateValue.sizeP = parseInt($scope.updateValue.sizeP.toString().replace(".", ""), 10);
        }
    };

    $scope.updateSize = function () {
        $scope.resetAction();
        Nas.updatePartitionSize($stateParams.nasId, $scope.partition.partitionName, $scope.updateValue.sizeP).then(
            () => {
                $rootScope.$broadcast("nas_launch_task");
                Alerter.success($scope.tr("nas_partitions_action_update_success", $scope.partition.partitionName), alerterId);
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("nas_partitions_action_update_failure", $scope.partition.partitionName), data, alerterId);
            }
        );
    };
});
