angular.module("App").config(($stateProvider, constants) => {

    if (constants.target === "US") {
        $stateProvider.state("app.dedicatedClouds.license.enable", {
            url: "/enable",
            templateUrl: "dedicatedCloud/license/enable/dedicatedCloud-license-enable-us.html",
            controller: "DedicatedCloudLicencesSplaEnableUSCtrl",
            controllerAs: "$ctrl",
            layout: "modal"
        });
    }
});
