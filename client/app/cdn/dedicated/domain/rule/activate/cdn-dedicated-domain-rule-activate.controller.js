angular.module("App").controller("CacherulesActivateCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {
    $scope.alert = "cdn_domain_tab_rules_alert";
    $scope.entry = $scope.currentActionData;

    $scope.activate = function () {
        $scope.resetAction();
        CdnDomain.updateCacheruleStatus($stateParams.productId, $stateParams.domain, $scope.entry.id, "ON").then(
            () => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_activate_success"), true, $scope.alert);
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("cdn_configuration_cacherule_activate_fail"), data, $scope.alert);
            }
        );
    };
});
