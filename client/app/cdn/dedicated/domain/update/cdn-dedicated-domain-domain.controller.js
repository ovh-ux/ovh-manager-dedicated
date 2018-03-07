angular.module("App").controller("CdnUpdateDomainCtrl", ($scope, $stateParams, CdnDomain) => {
    $scope.domain = $scope.currentActionData;

    $scope.updateDomain = function () {
        $scope.resetAction();
        const currentStatus = $scope.domain.mode === "ON";
        CdnDomain.updateDomain($stateParams.productId, $stateParams.domain, !currentStatus).then(
            () => {
                $scope.setMessage($scope.tr("cdn_domain_configuration_update_success", $scope.domain.domain), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("cdn_domain_configuration_update_fail", $scope.domain.domain), angular.extend(data, { type: "ERROR" }));
            }
        );
    };
});
