angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.nas.details.partition', {
    url: '/partitions',
    views: {
      nasDetails: {
        templateUrl: 'dedicated/nas/details/partition/nas-details-partition.html',
        controller: 'PartitionCtrl',
        controllerAs: '$ctrl',
      },
    },
    reloadOnSearch: false,
  });
});
