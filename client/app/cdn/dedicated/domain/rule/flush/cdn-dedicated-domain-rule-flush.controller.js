angular.module("App").controller("CdnFlushRuleCtrl", ($scope, $stateParams, CdnDomain, Alerter) => {
    $scope.alert = "cdn_domain_tab_rules_alert";
    $scope.cacheRule = $scope.currentActionData;

    $scope.flushRule = function () {
        $scope.resetAction();
        CdnDomain.flushRule($stateParams.productId, $stateParams.domain, $scope.cacheRule)
            .then(() => Alerter.alertFromSWS($scope.tr("cdn_configuration_flush_rule_success"), true, $scope.alert))
            .catch((err) => Alerter.alertFromSWS($scope.tr("cdn_configuration_add_rule_error", $scope.cacheRule.fileMatch), err, $scope.alert));
    };
});
