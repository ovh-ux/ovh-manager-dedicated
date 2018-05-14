angular.module("App").controller("InterventionCtrl", ($scope, $stateParams, $translate, Server, Alerter) => {
    "use strict";

    $scope.loadInterventions = function ({ offset, pageSize }) {
        return Server.getInterventions($stateParams.productId, pageSize, offset).then((interventions) => ({
            data: _.get(interventions, "list.results"),
            meta: {
                totalCount: interventions.count
            }
        }), (err) => {
            Alerter.alertFromSWS($translate.instant("server_configuration_intervention_error"), err, "server_tab_interventions_alert");
        });
    };
});
