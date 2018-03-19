angular.module("App").controller("HousingTaskCtrl", ($scope, $stateParams, $q, Housing, TASK_STATUS, Alerter) => {
    "use strict";

    $scope.transformItem = function (task) {
        return Housing.getTask($stateParams.productId, task.id);
    };

    $scope.loadDatagridTasks = ({ offset, pageSize }) => Housing.getTaskIds($stateParams.productId).then((ids) => {
        const part = ids.slice(offset - 1, offset - 1 + pageSize);
        return {
            data: part.map((id) => ({ id })),
            meta: {
                totalCount: ids.length
            }
        };
    }).catch((err) => {
        Alerter.alertFromSWS($scope.tr("housing_configuration_task_loading_error"), err, "housing_tab_tasks_alert");
        return $q.reject(err);
    });
});
