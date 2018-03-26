angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds", {
        url: "/configuration/dedicated_cloud/:productId?action&token&modal",
        views: {
            "": {
                templateUrl: "dedicatedCloud/dedicatedCloud.html",
                controller: "DedicatedCloudCtrl"
            },
            "pccView@app.dedicatedClouds": {
                templateUrl: "dedicatedCloud/dashboard/dedicatedCloud-dashboard.html"
            }
        },
        reloadOnSearch: false,
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["dedicatedcloud"]).then(() => translator);
                }
            ],
            modals () {
                return {
                    test: "coucou"
                };
            }
        }
    });
});
