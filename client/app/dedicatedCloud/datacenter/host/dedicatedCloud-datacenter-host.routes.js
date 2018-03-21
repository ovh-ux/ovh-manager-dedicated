angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds.datacenter.hosts", {
        url: "/hosts",
        reloadOnSearch: false,
        views: {
            pccDatacenterView: {
                templateUrl: "dedicatedCloud/datacenter/host/dedicatedCloud-datacenter-host.html",
                controller: "DedicatedCloudSubDatacentersHostCtrl"
            }
        }
    });
});
