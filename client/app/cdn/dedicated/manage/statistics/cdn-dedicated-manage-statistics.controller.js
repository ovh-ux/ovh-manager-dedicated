angular.module("App").controller("CdnStatisticsCtrl", ($scope, $stateParams, $translate, Cdn) => {
    $scope.model = null;
    $scope.consts = null;
    $scope.loadingStats = false;
    $scope.loadingConsts = false;

    function createChart (data) {
        $scope.series = [];
        $scope.data = [];

        $scope.labels = _.map(_.get(data, "cdn.values"), (value, index) => {
            const source = data.backend || data.cdn;
            const start = _.get(source, "pointStart");
            const interval = _.get(source, "pointInterval.standardSeconds");
            return moment(start).add((index + 1) * interval, "seconds").calendar();
        });
        $scope.series.push($translate.instant(`cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_cdn`));
        $scope.series.push($translate.instant(`cdn_stats_legend_${$scope.model.dataType.toLowerCase()}_backend`));
        $scope.data.push(_.map(_.get(data, "cdn.value"), (value) => value.y));
        $scope.data.push(_.map(_.get(data, "backend.values"), (value) => value.y));
    }

    $scope.getStatistics = () => {
        $scope.loadingStats = true;
        return Cdn.getStatistics($stateParams.productId, $scope.model)
            .then((data) => createChart(data))
            .catch((err) => {
                if (err.message) {
                    err.message = err.message.replace(" : null", "");
                    $scope.setMessage($translate.instant("cdn_configuration_add_ssl_get_error"), { type: "ERROR", message: err.message });
                }
            }).finally(() => {
                $scope.loadingStats = false;
            });
    };

    function init () {
        $scope.loadingConsts = true;
        Cdn.getStatisticsConsts()
            .then((data) => {
                $scope.consts = data;
                $scope.model = {
                    dataType: data.defaultType,
                    period: data.defaultPeriod
                };
                $scope.getStatistics();
            }).finally(() => {
                $scope.loadingConsts = false;
            });
    }

    init();
});
