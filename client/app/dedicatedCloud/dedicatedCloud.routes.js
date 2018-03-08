angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicatedClouds", {
        url: "/configuration/dedicated_cloud/:productId?action&token",
        templateUrl: "dedicatedCloud/dedicatedCloud.html",
        controller: "DedicatedCloudCtrl",
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["dedicatedcloud"]).then(() => translator);
                }
            ]
        }
    });

    $stateProvider.state("app.dedicatedCloudsNetwork", {
        url: "/configuration/dedicated_cloud/:productId/network/",
        templateUrl: "dedicatedCloud/network/dedicatedCloud-network.html",
        controller: "DedicatedCloudSubNetworkCtrl",
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
