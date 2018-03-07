angular.module("App").controller("CacherulesActivateAllCtrl", ($scope, CdnDomain, Alerter, $stateParams) => {
    const resultMessages = {
        OK: $scope.tr("cdn_configuration_allcacherule_activate_success"),
        PARTIAL: $scope.tr("cdn_configuration_allcacherule_activate_partial"),
        ERROR: $scope.tr("cdn_configuration_allcacherule_activate_fail")
    };
    $scope.alert = "cdn_domain_tab_rules_alert";

    $scope.activate = function () {
        $scope.resetAction();
        CdnDomain.updateAllCacheruleStatus($stateParams.productId, $stateParams.domain, "ON").then(
            (data) => {
                Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
            },
            (data) => {
                Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
            }
        );
    };
});
