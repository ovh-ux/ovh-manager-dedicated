angular.module('Billing').controller('BillingCtrl', ($scope, $location, BILLING_BASE_URL, $filter, $timeout) => {
  $scope.BILLING_BASE_URL = BILLING_BASE_URL;
  $scope.pageSizeAvailables = [10, 20, 50];

  $scope.originUrl = $location.search().redirectTo || $location.search().redirectto || '#/';

  $scope.today = new Date();
  $scope.firstDayOfMonth = +new Date($scope.today.getFullYear(), $scope.today.getMonth(), 1);

  $scope.isCurrentMonth = function (date) {
    return +new Date(date.getFullYear(), date.getMonth(), 1) === $scope.firstDayOfMonth;
  };

  $scope.getDateFormatted = function (date, type) {
    return $filter('date')(date, type);
  };

  $scope.getDayDateFormatted = function (date) {
    return $filter('date')(date, 'dd');
  };

  $scope.setAction = function (action, data, viewName) {
    $scope.currentAction = action;
    $scope.currentActionData = data;

    if ($scope.currentAction) {
      $scope.stepPath = `${BILLING_BASE_URL}${viewName}/${action}/billing-${viewName}-${action}.html`;

      $('#currentAction').modal({
        keyboard: false,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');

      $timeout(() => {
        delete $scope.stepPath;
      }, 300);
    }
  };

  $scope.resetAction = function () {
    $scope.setAction();
  };
});
