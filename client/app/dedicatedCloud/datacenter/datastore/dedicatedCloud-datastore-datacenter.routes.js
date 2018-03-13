angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds.datacenter.datastores", {
        url: "/datastores",
        reloadOnSearch: false,
        views: {
            pccDatacenterView: {
                templateUrl: "dedicatedCloud/datacenter/datastore/dedicatedCloud-datacenter-datastore.html",
                controller: "DedicatedCloudSubDatacentersDatastoreCtrl"
            }
        }
    });
});
