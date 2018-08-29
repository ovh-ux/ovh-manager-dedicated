angular.module('App').controller('CdnUpdateDomainCtrl', ($scope, $stateParams, $translate, CdnDomain) => {
  $scope.domain = $scope.currentActionData;

  $scope.updateDomain = function () {
    $scope.resetAction();
    const currentStatus = $scope.domain.mode === 'ON';
    CdnDomain.updateDomain($stateParams.productId, $stateParams.domain, !currentStatus).then(
      () => {
        $scope.setMessage($translate.instant('cdn_domain_configuration_update_success', { t0: $scope.domain.domain }), true);
      },
      (data) => {
        $scope.setMessage($translate.instant('cdn_domain_configuration_update_fail', { t0: $scope.domain.domain }), angular.extend(data, { type: 'ERROR' }));
      },
    );
  };
});
