angular.module("controllers").controller("controllers.Server.Stats.Rtm.General", ($scope, $timeout, $location, $stateParams, Server) => {
    "use strict";

    $scope.loading = true;
    $scope.labels = null;
    $scope.data = null;

    $scope.$on("reloadChart", () => {
        init();
    });

    function init () {
        Server.getStatisticsChart($stateParams.productId, {
            period: $scope.selectedPeriod.value,
            type: $scope.rtmOptions.value.data.type
        }).then((stats) => {
            $scope.labels = _.map(stats.points, (point) => _.first(moment.unix(point).format()));
            $scope.data = _.map(stats.points, (point) => _.last(point));
        }).finally(() => {
            $scope.loading = false;
        });
    }

    init();
});
