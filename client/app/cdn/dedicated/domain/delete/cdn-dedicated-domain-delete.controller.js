angular.module('App').controller('CdnDeleteDomainCtrl', ($scope, $stateParams, $translate, CdnDomain) => {
  $scope.domain = $stateParams.domain;

  $scope.deleteEntry = function () {
    $scope.resetAction();
    CdnDomain.deleteDomain($stateParams.productId, $stateParams.domain).then(
      () => {
        $scope.setMessage($translate.instant('cdn_configuration_delete_domain_success'), true);
      },
      (data) => {
        $scope.setMessage($translate.instant('cdn_configuration_delete_domain_fail'), angular.extend(data, { type: 'ERROR' }));
      },
    );
  };
});
