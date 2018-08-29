angular.module('Module.ip.controllers').controller('IpMainCtrl', [
  '$scope',
  '$timeout',
  '$stateParams',
  '$location',
  '$translate',
  'Alerter',
  'constants',
  'featureAvailability',
  function ($scope, $timeout, $stateParams, $location, $translate, Alerter, constants,
    featureAvailability) {
    const defaultTab = 'ip';
    $scope.tabs = ['ip'];

    if (featureAvailability.hasIpLoadBalancing()) {
      $scope.tabs.push('ip-lb');
    }

    $scope.worldPart = constants.target;
    $scope.toKebabCase = _.kebabCase;

    $scope.setSelectedTab = function (tab) {
      if (tab !== undefined && tab !== null && tab !== '') {
        $scope.selectedTab = tab;
      } else {
        $scope.selectedTab = defaultTab;
      }
      $location.search('tab', $scope.selectedTab);
    };

    if ($stateParams.tab && ~$scope.tabs.indexOf(angular.uppercase($stateParams.tab))) {
      $scope.setSelectedTab(angular.uppercase($stateParams.tab));
    } else {
      $scope.setSelectedTab(defaultTab);
    }

    // ---

    $scope.resetAction = function () {
      $scope.setAction(false);
    };

    $scope.$on('$locationChangeStart', () => {
      $scope.resetAction();
    });

    $scope.setAction = function (action, data) {
      $scope.currentAction = action;
      $scope.currentActionData = data;
      if ($scope.currentAction) {
        $scope.stepPath = `ip/${$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: false,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        $timeout(() => {
          $scope.stepPath = '';
        }, 300);
      }
    };

    /* here, because if the user switch the tab after an action requesting a polling,
         * when the polling is done, the message still displayed */
    $scope.$on('iplb.backends.needUpdate', () => {
      Alerter.resetMessage('polling_action');
    });
    $scope.$on('iplb.backends.error', (evt, reason) => {
      let type = 'generic';
      if (reason.action) {
        type = reason.action;
      }

      Alerter.error($translate.instant(`iplb_backend_${type}_failure`), 'polling_action');
    });
  },
]);
