angular.module("App").config([
    "$stateProvider",
    function ($stateProvider) {
        "use strict";

        $stateProvider.state("app.dedicatedClouds.dataCenter", {
            url: "/datacenter/:datacenterId",
            templateUrl: "dedicatedCloud/datacenter/datacenter/dedicatedCloud-datacenter.html",
            controller: "DedicatedCloudSubDatacenterCtrl",
            reloadOnSearch: false,
            resolve: {
                translator: [
                    "translator",
                    function (translator) {
                        return translator.load(["dedicatedcloud"]).then(() => translator);
                    }
                ]
            }
        });
    }
]);
