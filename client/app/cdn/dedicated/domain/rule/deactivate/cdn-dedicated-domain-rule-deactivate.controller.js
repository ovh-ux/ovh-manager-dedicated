angular.module("App").controller("CacherulesDesactivateCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {

    $scope.entry = $scope.currentActionData;

    $scope.desactivate = function () {
        $scope.resetAction();
        CdnDomain.updateCacheruleStatus($stateParams.productId, $stateParams.domain, $scope.entry.id, "OFF")
            .then(() => Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_deactivate_success"), true, "cdn_domain_tab_rules_alert"))
            .catch((err) => Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_deactivate_fail"), err, "cdn_domain_tab_rules_alert"));
    };
});
