angular.module('UserAccount').controller('UserAccount.controllers.ipRestrictions.delete', [
  '$rootScope',
  '$scope',
  '$translate',
  'UserAccount.services.ipRestrictions',
  'Alerter',
  function ($rootScope, $scope, $translate, Service, Alerter) {
    $scope.data = $scope.currentActionData;

    $scope.deleteRestriction = function () {
      $scope.resetAction();
      Service.deleteRestriction($scope.data).then(
        () => {
          $rootScope.$broadcast('ipRestriction.reload');
        },
        (data) => {
          Alerter.alertFromSWS($translate.instant('user_ipRestrictions_delete_error', { t0: $scope.data.ip }), data.data, 'ipRestrictionAlert');
        },
      );
    };
  },
]);
