angular.module("App").controller("TaskCtrl", ($scope, $stateParams, Server, TASK_STATUS) => {
    $scope.tasks = null;
    $scope.task_status = TASK_STATUS;

    $scope.$on("tasks.update", () => {
        $scope.$broadcast("paginationServerSide.reload", "tasksTable");
    });

    $scope.loadTasks = function (elementsByPage, elementsToSkip) {
        $scope.loading = true;
        $scope.error = false;

        Server.getTasks($stateParams.productId, elementsByPage, elementsToSkip).then(
            (results) => {
                $scope.tasks = results;
                $scope.loading = false;
            },
            (data) => {
                $scope.loading = false;
                $scope.error = true;
                $scope.setMessage($scope.tr("server_configuration_task_loading_error"), data.data);
            }
        );
    };
});
