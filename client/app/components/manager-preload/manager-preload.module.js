angular.module('App').run(($transitions, $state, $rootScope) => {
  $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
  $transitions.onSuccess({}, () => {
    if (!$state.includes('app')) {
      $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
    }
  });
});
