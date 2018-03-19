angular.module("App").controller("TaskCtrl", ($scope, $stateParams, $q, Server, Alerter) => {

    $scope.loadDatagridTasks = ({ offset, pageSize }) => Server.getTasks($stateParams.productId, pageSize, offset - 1).then((result) => ({
        data: _.get(result, "list.results"),
        meta: {
            totalCount: result.count
        }
    })).catch((err) => {
        Alerter.alertFromSWS($scope.tr("server_configuration_task_loading_error"), err.data, "taskAlert");
        return $q.reject(err);
    });
});
