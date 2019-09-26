angular.module('App').controller('DedicatedCloudDisableVMwareOptionCtrl', ($scope, $stateParams, $rootScope, $q, $translate, DedicatedCloud, Alerter) => {
  $scope.option = $scope.currentActionData;

  $scope.loaders = {
    loading: true,
  };

  $scope.loadDisablingPrices = function () {
    $scope.loaders.loading = true;
    return $q
      .all({
        pcc: DedicatedCloud.getSelected($stateParams.productId),
        commercialRanges: DedicatedCloud.isOptionToggable($stateParams.productId, $scope.option, 'enabled', false),
      })
      .then(data => DedicatedCloud.fetchAllHostsPrices(
        $stateParams.productId,
        data.commercialRanges.oldCommercialVersion,
        data.commercialRanges.newCommercialVersion,
        data.pcc.location,
      ))
      .then((data) => {
        $scope.disablingPrices = data.current.map((host, index) => _.assign(_.pick(host, ['datacenter', 'name', 'billingType']), {
          current: host.price,
          next: data.next[index].price,
        }));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_vmware_orderopt_load_prices_error'), err, $scope.alerts.dashboard);
        $scope.resetAction();
      })
      .finally(() => {
        $scope.loaders.loading = false;
      });
  };

  $scope.disable = function () {
    $scope.loaders.loading = true;
    DedicatedCloud.disableOption($stateParams.productId, $scope.option)
      .then(() => {
        Alerter.success($translate.instant('dedicatedCloud_vmware_cancelopt_unactivate_succes'), $scope.alerts.dashboard);
        $rootScope.$broadcast('vmware-option-disable', $scope.option);
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('dedicatedCloud_vmware_cancelopt_unactivate_error'), err, $scope.alerts.dashboard);
      })
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
