angular.module("App").controller("DedicatedCloudSubDatacentersHostCtrl", function ($q, $scope, $state, $stateParams, $translate, constants, DedicatedCloud) {
    "use strict";

    this.loadHosts = ({ offset, pageSize }) => DedicatedCloud.getHosts(
        $stateParams.productId,
        $stateParams.datacenterId,
        pageSize,
        offset - 1
    ).then((result) => {
        const hosts = _.get(result, "list.results");
        return $q.all(hosts.map((host) => {
            if (host.billingType === "HOURLY") {
                return DedicatedCloud.getHostHourlyConsumption(
                    $stateParams.productId,
                    $stateParams.datacenterId,
                    host.hostId
                ).then((consumption) => _.merge({}, host, consumption));
            }
            return $q.when(host);

        })).then((hostsWithConsumption) => ({
            data: hostsWithConsumption,
            meta: {
                totalCount: result.count
            }
        }));
    });

    this.$onInit = () => {
        this.loading = true;
        this.constants = constants;
        return DedicatedCloud.getDatacenterInfoProxy(
            $stateParams.productId,
            $stateParams.datacenterId
        ).then((datacenter) => {
            $scope.datacenter.model.commercialRangeName = datacenter.commercialRangeName;
            $scope.datacenter.model.hasDiscountAMD = DedicatedCloud.hasDiscount($scope.datacenter.model);
        }).finally(() => {
            this.loading = false;
        });
    };

    this.orderHost = (datacenter) => {
        if (constants.target === "US") {
            $state.go("app.dedicatedClouds.datacenter.hosts.orderUS");
        } else {
            $scope.setAction("datacenter/host/order/dedicatedCloud-datacenter-host-order", datacenter.model, true);
        }
    };
});
