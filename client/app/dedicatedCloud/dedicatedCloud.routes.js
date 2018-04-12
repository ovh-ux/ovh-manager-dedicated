angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds", {
        url: "/configuration/dedicated_cloud/:productId",
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
        redirectTo: (transition) => {
            const search = transition.injector().get("$location").search();

            if (_.get(search, "action") === "confirmcancel") {
                return "app.dedicatedClouds.terminate-confirm";
            }

            return "app.dedicatedClouds";
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
