angular.module('App').controller('ServerFirewallAsaOrderCtrl', ($scope, $stateParams, $translate, Server, ServerFirewallAsa) => {
  $scope.model = {
    wanted: null,
    wantedAsText: null,
    server: null,
    optionDetails: null,
    url: null,
    validContract: false,
  };

  $scope.loadOptionDetails = function () {
    if (!$scope.model.optionDetails) {
      Server.getSelected($stateParams.productId).then(
        (data) => {
          $scope.model.server = data;
        },
        (data) => {
          $scope.resetAction();
          $scope.setMessage($translate.instant('server_configuration_firewall_asa_order_step1_loading_error'), data);
        },
      );
      ServerFirewallAsa.getOptionList($stateParams.productId).then(
        (data) => {
          $scope.model.optionDetails = data.results;
        },
        (err) => {
          $scope.resetAction();
          $scope.setMessage($translate.instant('server_configuration_firewall_asa_order_step1_loading_error'), err);
        },
      );
    }
  };

  $scope.evalWantedModel = function () {
    $scope.model.wanted = $scope.$eval($scope.model.wantedAsText);
    $scope.model.validContract = false;
  };

  $scope.order = function () {
    $scope.model.url = null;
    ServerFirewallAsa
      .orderOption(
        $stateParams.productId,
        $scope.model.wanted.model,
        $scope.model.wanted.duration.duration,
      )
      .then(
        (order) => {
          $scope.model.url = order.url;
        },
        (data) => {
          $scope.resetAction();
          $scope.setMessage($translate.instant('server_configuration_firewall_asa_order_fail'), data);
        },
      );
  };

  $scope.displayBC = function () {
    $scope.resetAction();
    window.open($scope.model.url, '_blank');
  };
});
