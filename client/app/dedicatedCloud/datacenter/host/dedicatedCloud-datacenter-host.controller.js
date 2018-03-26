angular.module("App").controller("DedicatedCloudSubDatacentersHostCtrl", ($scope, $state, $stateParams, $q, constants, DedicatedCloud) => {
    "use strict";

    $scope.hosts = null;
    $scope.loaders = {
        hosts: false,
        datacenter: true
    };
    $scope.constants = constants;

    $scope.loadHosts = function (elementsByPage, elementsToSkip) {
        $scope.loaders.hosts = true;
        DedicatedCloud.getHosts($stateParams.productId, $stateParams.datacenterId, elementsByPage, elementsToSkip)
            .then((hosts) => {
                $scope.hosts = hosts;
                return $scope.hosts.count > 0 ? loadHourlyHostsUsage($scope.hosts.list.results) : [];
            })
            .then((hostsWithUsage) => {
                $scope.hosts.list.results = hostsWithUsage;
            })
            .catch((data) => {
                $scope.setMessage($scope.tr("dedicatedCloud_tab_hosts_loading_error"), angular.extend(data, { type: "ERROR" }));
            })
            .finally(() => {
                $scope.loaders.hosts = false;
            });
    };

    function loadHourlyHostsUsage (hosts) {
        return $q.all(hosts.map((host) => host.billingType === "HOURLY" ? fetchHourlyHostUsage(host) : $q.when(host)));
    }

    function fetchHourlyHostUsage (host) {
        return DedicatedCloud.getHostHourlyConsumption($stateParams.productId, $stateParams.datacenterId, host.hostId)
            .then((hostConsumption) => _.merge({}, host, hostConsumption))
            .catch((err) => err && err.message === "No consumption for this host" ? host : $q.reject(err));
    }

    $scope.getDatacenterCommercialRange = function (datacenterId) {
        $scope.loaders.datacenter = true;
        DedicatedCloud.getDatacenterInfoProxy($stateParams.productId, datacenterId)
            .then((datacenter) => {
                $scope.datacenter.model.commercialRangeName = datacenter.commercialRangeName;
                $scope.datacenter.model.hasDiscountAMD = DedicatedCloud.hasDiscount($scope.datacenter.model);
            })
            .finally(() => {
                $scope.loaders.datacenter = false;
            });
    };

    $scope.init = function () {
        $scope.getDatacenterCommercialRange($scope.datacenter.model.id);
    };

    $scope.orderHost = (datacenter) => {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.datacenter.hosts.orderUS");
        } else {
            $scope.setAction("datacenter/host/order/dedicatedCloud-datacenter-host-order", datacenter.model, true);
        }
    };

    $scope.init();
});
