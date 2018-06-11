angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.dedicatedClouds.datacenter.datastores", {
        url: "/datastores",
        reloadOnSearch: false,
        views: {
            pccDatacenterView: {
                templateUrl: "dedicatedCloud/datacenter/datastore/dedicatedCloud-datacenter-datastore.html",
                controller: "DedicatedCloudSubDatacentersDatastoreCtrl",
                controllerAs: "$ctrl"
            }
        },
        translations: ["dedicated/server"]
    });

    $stateProvider.state("app.dedicatedClouds.datacenter.datastores.orderUS", {
        url: "/order",
        views: {
            "pccDatacenterView@app.dedicatedClouds.datacenter": {
                templateUrl: "dedicatedCloud/datacenter/datastore/orderUS/dedicatedCloud-datacenter-datastore-orderUS.html",
                controller: "DedicatedCloudDatacentersDatastoreOrderUSCtrl",
                controllerAs: "$ctrl"
            }
        },
        resolve: {
            serviceName: ($stateParams) => $stateParams.productId,
            datacenterId: ($stateParams) => $stateParams.datacenterId
        }
    });
});
