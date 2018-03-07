angular.module("App").controller("NasPartitionAddCtrl", ($rootScope, $scope, $stateParams, Nas, Alerter) => {
    const alerterId = "NasAlert";

    Nas.getConstant($stateParams.nasId).then(
        (constants) => {
            $scope.protocols = constants;
        },
        () => {
            $scope.resetAction();
            Alerter.error($scope.tr("nas_partitions_action_add_init"), alerterId);
        }
    );
    $scope.currentNasPartition = $scope.currentActionData;

    $scope.newPartition = {
        name: null,
        sizeP: null,
        protocol: null
    };

    $scope.error = {
        name: false
    };

    $scope.checkSize = function () {
        if ($scope.newPartition.sizeP) {
            $scope.newPartition.sizeP = parseInt($scope.newPartition.sizeP.toString().replace(".", ""), 10);
        }
    };

    $scope.checkName = function () {
        $scope.error.name = !/^[A-Za-z0-9]{1,20}$/.test($scope.newPartition.name);
    };

    $scope.addPartition = function () {
        $scope.resetAction();
        Nas.addPartition($stateParams.nasId, $scope.newPartition.name, $scope.newPartition.protocol, $scope.newPartition.sizeP)
            .then((task) => {
                $rootScope.$broadcast("nas_launch_task", task);
                Alerter.success($scope.tr("nas_partitions_action_add_success", $scope.newPartition.name), alerterId);
            })
            .catch((err) => Alerter.alertFromSWS($scope.tr("nas_partitions_action_add_failure", $scope.newPartition.name), err, alerterId));
    };
});
