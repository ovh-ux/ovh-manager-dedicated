angular.module("App").controller("CacherulesDeleteCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {
    $scope.alert = "cdn_domain_tab_rules_alert";
    $scope.entryToDelete = $scope.currentActionData;

    $scope.deleteEntry = () => {
        $scope.resetAction();
        CdnDomain.deleteCacherule($stateParams.productId, $stateParams.domain, $scope.entryToDelete.id).then(
            () => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_delete_cacherule_success"), true, $scope.alert);
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_delete_cacherule_fail"), data);
            }
        );
    };
});
