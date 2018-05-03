angular.module("App").controller("InterventionCtrl", ($scope, $stateParams, Server) => {
    "use strict";

    $scope.interventions = null;
    $scope.interventionsLoading = false;

    $scope.loadInterventions = function (interventionsCount, offset) {
        $scope.interventionsLoading = true;
        $scope.interventionsError = null;
        Server.getInterventions($stateParams.productId, interventionsCount, offset).then(
            (interventions) => {
                $scope.interventions = interventions;
                $scope.interventionsLoading = false;
            },
            (reason) => {
                $scope.interventionsError = reason.message;
                $scope.interventionsLoading = false;
            }
        );
    };
});
