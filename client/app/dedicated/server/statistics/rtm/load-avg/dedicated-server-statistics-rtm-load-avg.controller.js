angular.module('controllers').controller('controllers.Server.Stats.Loadavg', ($scope, $location, $timeout, $stateParams, Server) => {
  $scope.chartData = {};

  function buildChart(data) {
    const charObj = {
      chart: {
        renderTo: 'rtmLoadavg',
        type: 'spline',
        animation: false,
        height: 300,
        events: {
          load() {
            $timeout(() => {
              $scope.loading = false;
              $location.hash('rtmLoadavg');
            }, 0);
            jQuery.scrollTo('.rtm-loadavg');
          },
        },
        backgroundColor: '#F7F5F6',
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          animation: true,
          dataLabel: {
            enabled: false,
            allowPointSelect: true,
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
        },
      },
      xAxis: {
        type: 'datetime',
        label: {
          overflow: 'justify',
        },
        linewidth: 1,
        title: null,
      },
      yAxis: {
        type: 'linear',
        min: 0,
        title: {
          text: '',
        },
        lineWidth: 1,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -10,
        borderWidth: 0,
        itemMarginBottom: 4,
      },
      series: [],
      title: {
        text: '',
      },
    };

    angular.forEach(data, (avgData, avgName) => {
      charObj.series.push({
        showInLegend: true,
        name: avgName,
        data: avgData.points,
      });
    });

    return charObj;
  }

  function init() {
    $scope.loading = true;
    Server.getStatisticsLoadavg($stateParams.productId, {
      period: $scope.selectedPeriod.value,
    }).then(
      (data) => {
        $scope.chartData = buildChart(data);
      },
      () => {
        $scope.loading = false;
      },
    );
  }

  init();

  $scope.$on('reloadChart', () => {
    init();
  });
});
