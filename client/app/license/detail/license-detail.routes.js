angular
    .module("Module.license")
    .config(($stateProvider) => {
        $stateProvider.state("app.license.detail", {
            url: "/:licenceId/detail",
            templateUrl: "license/detail/license-detail.html",
            controller: "LicenseDetailsCtrl",
            translations: ["license"]
        });
    });
