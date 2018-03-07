angular.module("App").config(($stateProvider) => {

    // account module
    $stateProvider.state("app.account", {
        views: {
            "app@": {
                templateUrl: "account/index.html",
                controller: "AppCtrl"
            }
        },
        "abstract": true
    });

    $stateProvider.state("app.account.service", {
        template: "<ui-view/>",
        "abstract": true
    });
});
