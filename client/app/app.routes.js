angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app", {
        "abstract": true,
        url: "",
        controller: "AppCtrl",
        controllerAs: "AppCtrl",
        templateUrl: "app.html",
        translations: ["common", "components", "double-authentication", "user-contracts"],
        resolve: {
            currentUser: (User) => User.getUser()
        }
    });

    // CDN & NAS
    $stateProvider.state("app.networks", {
        url: "/configuration",
        template: "<ui-view />",
        "abstract": true
    });

    // Microsoft
    $stateProvider.state("app.microsoft", {
        "abstract": true,
        template: "<ui-view />"
    });
});
