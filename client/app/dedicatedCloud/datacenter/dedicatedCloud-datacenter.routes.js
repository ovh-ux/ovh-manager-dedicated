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
        },
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["dedicatedcloud"]).then(() => translator);
                }
            ]
        }
    });
});
