angular.module("App").controller("HousingTaskCtrl", ($scope, $stateParams, Housing, TASK_STATUS, Alerter) => {
    "use strict";

    $scope.tasks = null;
    $scope.task_status = TASK_STATUS;

    function init () {
        $scope.loading = true;
        Housing.getTaskIds($stateParams.productId).then((ids) => {
            if (ids.length === 0) {
                $scope.loading = false;
            }
            $scope.taskIds = ids;
        });
    }

    $scope.reloadTasks = function () {
        $scope.loading = true;
        $scope.loadTasks();
    };

    $scope.transformItem = function (id) {
        return Housing.getTask($stateParams.productId, id);
    };

    $scope.onTransformItemDone = function () {
        $scope.loading = false;
    };

    $scope.loadTasks = function () {
        $scope.loading = true;
        $scope.error = false;

        Housing.getTasks($stateParams.productId).then(
            (results) => {
                $scope.tasks = results;
                $scope.loading = false;
            },
            (err) => {
                $scope.loading = false;
                $scope.error = true;
                Alerter.alertFromSWS($scope.tr("housing_configuration_task_loading_error"), err, "housing_tab_tasks_alert");
            }
        );
    };

    init();
});
