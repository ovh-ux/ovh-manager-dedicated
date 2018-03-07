angular.module("Module.license")
    .config(($stateProvider) => {
        $stateProvider.state("app.license.upgrade", {
            url: "/:licenceId/upgrade",
            templateUrl: "license/upgrade/license-upgrade.html",
            controller: "LicenseUpgradeCtrl"
        });
    });
