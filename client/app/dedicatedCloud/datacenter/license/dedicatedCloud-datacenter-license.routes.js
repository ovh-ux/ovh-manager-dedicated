angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds.datacenter.license", {
        url: "/license",
        reloadOnSearch: false,
        views: {
            pccDatacenterView: {
                templateUrl: "dedicatedCloud/datacenter/license/dedicatedCloud-datacenter-license.html",
                controller: "DedicatedCloudSubDatacenterLicencesCtrl"
            }
        }
    });
});
