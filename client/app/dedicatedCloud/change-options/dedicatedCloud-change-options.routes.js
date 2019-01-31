angular
  .module('App')
  .config(($stateProvider) => {
    /* @ngInject */
    $stateProvider.state(
      'app.dedicatedClouds.changeOptions',
      {
        url: '/changeOptions',
        views: {
          pccView: 'dedicatedCloudChangeOptions',
        },
      },
    );
  });
