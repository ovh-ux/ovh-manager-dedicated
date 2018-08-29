angular.module('App').controller('NasCtrl', ($scope, $timeout) => {
  $scope.resetAction = function () {
    $scope.setAction(false);
  };

  $scope.$on('$locationChangeStart', () => {
    $scope.resetAction();
  });

  $scope.setAction = function (action, data) {
    if (action) {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      $scope.stepPath = $scope.currentAction;

      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    } else {
      $('#currentAction').modal('hide');
      $scope.currentActionData = null;
      $timeout(() => {
        $scope.stepPath = '';
      }, 300);
    }
  };
});
