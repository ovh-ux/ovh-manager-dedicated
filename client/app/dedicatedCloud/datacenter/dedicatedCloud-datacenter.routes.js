angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds.datacenter", {
        url: "/datacenter/:datacenterId",
        views: {
            dedicatedCloudView: {
                templateUrl: "dedicatedCloud/datacenter/dedicatedCloud-datacenter.html",
                controller: "DedicatedCloudSubDatacenterCtrl"
            },
            "pccDatacenterView@app.dedicatedClouds.datacenter": {
                templateUrl: "dedicatedCloud/datacenter/dashboard/dedicatedCloud-datacenter-dashboard.html"
            }
        }
    }).state("app.dedicatedClouds.datacenter.name-update", {
        url: "/name-update",
        controller: "NameEditionCtrl",
        templateUrl: "components/name-edition/name-edition.html",
        layout: "modal",
        params: {
            value: null,
            contextTitle: ""
        }
    });
});
