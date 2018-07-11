angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.dedicatedClouds.datacenter.hosts", {
        url: "/hosts",
        reloadOnSearch: false,
        views: {
            pccDatacenterView: {
                templateUrl: "dedicatedCloud/datacenter/host/dedicatedCloud-datacenter-host.html",
                controller: "DedicatedCloudSubDatacentersHostCtrl",
                controllerAs: "$ctrl"
            }
        },
        translations: ["dedicated/server"]
    });

    $stateProvider.state("app.dedicatedClouds.datacenter.hosts.orderUS", {
        url: "/order",
        views: {
            "pccDatacenterView@app.dedicatedClouds.datacenter": {
                templateUrl: "dedicatedCloud/datacenter/host/orderUS/dedicatedCloud-datacenter-host-orderUS.html",
                controller: "DedicatedCloudDatacentersHostOrderUSCtrl",
                controllerAs: "$ctrl"
            }
        },
        resolve: {
            serviceName: ($stateParams) => $stateParams.productId,
            datacenterId: ($stateParams) => $stateParams.datacenterId
        }
    });
});
