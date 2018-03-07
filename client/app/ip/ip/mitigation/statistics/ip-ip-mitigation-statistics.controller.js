angular.module("Module.ip.controllers").controller("IpMitigationStatisticsCtrl", ($scope, Ip, IpMitigation, $filter, $timeout, translator) => {
    "use strict";

    $scope.data = $scope.currentActionData;
    $scope.statsLoading = false;
    $scope.today = new Date();

    $scope.statisticsScalesAvailable = null;

    $scope.loadStatisticsScale = function () {
        IpMitigation.getMitigationStatisticsScale().then((data) => {
            $scope.statisticsScalesAvailable = data;
            if (data.length > 0) {
                $scope.model.scale = data[0];
            }
            $scope.model.mode = "realTime";
        });
    };

    const createChart = function () {
        let series = [];
        let plotOptionSeries = {};
        let d = new Date();
        const offset = d.getTimezoneOffset() * 60000;

        if ($scope.stats) {
            d = new Date($scope.stats.pointStart);
            plotOptionSeries = {
                pointInterval: $scope.stats.pointInterval.millis,
                pointStart: Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()),
                marker: {
                    enabled: false
                }
            };
            series = [
                {
                    data: $scope.stats.valuesIn,
                    showInLegend: false
                },
                {
                    data: $scope.stats.valuesOut,
                    showInLegend: false
                }
            ];
        }

        $scope.chartOptions = {
            chart: {
                renderTo: "statsChart",
                type: "area",
                width: 475,
                height: 300,
                zoomType: "x"
            },
            credits: {
                enabled: false
            },
            title: {
                text: "",
                x: -20 // center
            },
            subtitle: {
                x: -20
            },
            xAxis: {
                type: "datetime"
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                formatter () {
                    let text = $filter("date")(new Date(this.x + offset), "dd/MM - HH:mm:ss");
                    text += `<br/>${translator.tr("ip_mitigation_statistics_input")} : ${this.points[0].point.formatted.value} ${translator.tr(`ip_mitigation_statistics_unit_${this.points[0].point.formatted.unit}`)}`;
                    text += `<br/>${translator.tr("ip_mitigation_statistics_output")} : ${this.points[1].point.formatted.value} ${translator.tr(`ip_mitigation_statistics_unit_${this.points[1].point.formatted.unit}`)}`;
                    return text;
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: `${translator.tr("ip_mitigation_statistics_input")}/${translator.tr("ip_mitigation_statistics_output")} (bit/s)`
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: "#808080"
                    }
                ]
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "top",
                x: -10,
                y: 100,
                borderWidth: 0
            },
            plotOptions: {
                series: plotOptionSeries
            },
            series
        };
    };
    let timeout = null;
    const clearTO = function () {
        if (timeout) {
            $timeout.cancel(timeout);
        }
    };
    const realTimeStats = function () {
        clearTO();
        if ($scope.statisticsScalesAvailable && $scope.statisticsScalesAvailable.length > 0) {
            $scope.statsLoading = true;
            IpMitigation.getMitigationRealTimeStatistics($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
                .then((data) => {
                    $scope.stats = data;
                    if ($scope.stats.noData) {
                        clearTO();
                    }
                })
                .finally(() => {
                    $scope.statsLoading = false;
                });
            timeout = $timeout(() => {
                realTimeStats();
            }, 10000);
        }
    };

    $scope.$watch(
        "stats",
        (newData) => {
            $timeout(
                () => {
                    if (newData) {
                        createChart();
                    }
                },
                5,
                true
            );
        },
        true
    );

    $scope.model = {
        from: new Date(),
        scale: null,
        mode: null
    };

    $scope.getStatistics = function () {
        if ($scope.model.from && $scope.model.scale) {
            $scope.statsLoading = true;
            IpMitigation.getMitigationStatistics($scope.data.ipBlock.ipBlock, $scope.data.ip.ip, $scope.model.from.toISOString(), $scope.model.scale)
                .then((data) => {
                    $scope.stats = data;
                })
                .finally(() => {
                    $scope.statsLoading = false;
                });
        }
    };

    $scope.$watch("model.mode", (newValue, oldValue) => {
        if (newValue && (newValue !== oldValue || !$scope.stats)) {
            if (newValue === "realTime") {
                realTimeStats();
            } else {
                clearTO();
            }
        }
    });

    $scope.closeAction = function () {
        clearTO();
        $scope.resetAction();
    };

    createChart();
});
