angular.module("App").controller("CacherulesModifyTtlCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {
    $scope.alert = "cdn_domain_tab_rules_alert";
    $scope.entry = $scope.currentActionData;
    $scope.newEntry = {
        ttl: null
    };

    $scope.modify = function () {
        $scope.resetAction();
        CdnDomain.updateCacheruleTtl($stateParams.productId, $stateParams.domain, $scope.entry.id, $scope.newEntry.ttl).then(
            () => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_update_success"), true, $scope.alert);
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_update_fail"), data, $scope.alert);
            }
        );
    };
});
