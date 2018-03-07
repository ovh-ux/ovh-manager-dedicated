angular.module("App").controller("CacherulesDesactivateAllCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {
    const resultMessages = {
        OK: $scope.tr("cdn_configuration_allcacherule_deactivate_success"),
        PARTIAL: $scope.tr("cdn_configuration_allcacherule_deactivate_partial"),
        ERROR: $scope.tr("cdn_configuration_allcacherule_deactivate_fail")
    };
    $scope.alert = "cdn_domain_tab_rules_alert";

    $scope.desactivate = function () {
        $scope.resetAction();
        CdnDomain.updateAllCacheruleStatus($stateParams.productId, $stateParams.domain, "OFF").then(
            (data) => {
                Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
            },
            (data) => {
                Alerter.alertFromSWSBatchResult(resultMessages, data, $scope.alert);
            }
        );
    };
});
