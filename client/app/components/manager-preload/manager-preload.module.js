angular.module('App').run(($transitions, $state, $rootScope) => {
  console.log("RUN");
  $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
  $transitions.onSuccess({}, () => {
    console.log("onSuccess");
    if (!$state.includes('app')) {
      console.log("HIDE");
      $rootScope.managerPreloadHide += ' manager-preload-hide'; // eslint-disable-line
    }
  });
});
