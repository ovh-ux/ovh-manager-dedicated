angular.module("App").controller("CdnFlushDomainsCtrl", ($scope, $stateParams, CdnDomain) => {
    $scope.domain = $scope.currentActionData;

    $scope.flushDomain = function () {
        $scope.resetAction();
        CdnDomain.flushDomain($stateParams.productId, $stateParams.domain).then(
            () => {
                $scope.setMessage($scope.tr("cdn_configuration_flush_domain_success"), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("cdn_configuration_add_domain_fail", $stateParams.domain), angular.extend(data, { type: "ERROR" }));
            }
        );
    };
});
