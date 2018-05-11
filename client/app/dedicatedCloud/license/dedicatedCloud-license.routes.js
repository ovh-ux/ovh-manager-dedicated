angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.dedicatedClouds.license", {
        url: "/license",
        views: {
            pccView: {
                templateUrl: "dedicatedCloud/license/dedicatedCloud-license.html",
                controller: "DedicatedCloudLicencesCtrl"
            }
        }
    });

    $stateProvider.state("app.dedicatedClouds.license.enable", {
        url: "/enable",
        templateUrl: "dedicatedCloud/license/enable/dedicatedCloud-license-enable-us.html",
        controller: "DedicatedCloudLicencesSplaEnableUSCtrl",
        controllerAs: "$ctrl",
        layout: {
            name: "modal"
        }
    });
});
