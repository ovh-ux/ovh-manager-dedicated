angular.module('controllers').controller('controllers.Server.Stats.Loadavg', ($scope, $stateParams, Server) => {
  function timestampToDate(timestamp) {
    return moment.unix(timestamp / 1000).calendar();
  }

  function convertData(list) {
    return _.map(list, value => ({ x: timestampToDate(value[0]), y: value[1] }));
  }

  function buildChart(data) {
    $scope.loadAvgSeries = [];
    $scope.loadAvgData = [];
    $scope.loadAvgLabels = [];
    angular.forEach(data, (avgData, avgName) => {
      _.each(_.get(avgData, 'points'), (point) => {
        if ($scope.loadAvgLabels.indexOf(point[0]) === -1) {
          $scope.loadAvgLabels.push(point[0]);
        }
      });
      $scope.loadAvgSeries.push(avgName);
      $scope.loadAvgData.push(convertData(_.get(avgData, 'points')));
    });
    $scope.loadAvgLabels = _.map(_.sortBy($scope.loadAvgLabels), value => timestampToDate(value));
    $scope.loadAvgOptions = {
      legend: {
        display: true,
        position: 'top',
      },
    };
  }

  function init() {
    $scope.loadAvgLoading = true;
    Server.getStatisticsLoadavg($stateParams.productId, {
      period: $scope.selectedPeriod.value,
    }).then((data) => {
      buildChart(data);
    }).finally(() => {
      $scope.loadAvgLoading = false;
    });
  }

  init();

  $scope.$on('reloadChart', () => {
    init();
  });
});
