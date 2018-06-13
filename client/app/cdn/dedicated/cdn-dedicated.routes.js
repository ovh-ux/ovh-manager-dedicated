angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.networks.cdn.dedicated", {
        url: "/cdn/:productId",
        views: {
            "": {
                templateUrl: "cdn/dedicated/cdn-dedicated.html",
                controller: "CdnCtrl"
            },
            "cdnMainView@app.networks.cdn.dedicated": {
                templateUrl: "cdn/dedicated/manage/cdn-dedicated-manage.html",
                controller: "CdnManageCtrl",
                controllerAs: "$ctrl"
            },
            "cdnView@app.networks.cdn.dedicated": {
                templateUrl: "cdn/dedicated/manage/statistics/cdn-dedicated-manage-statistics.html",
                controller: "CdnStatisticsCtrl"
            }
        },
        resolve: {
            cdnDedicated: ($stateParams, OvhApiCdnDedicated) => OvhApiCdnDedicated.v6().get({
                serviceName: $stateParams.productId
            }).$promise
        },
        translations: ["cdn/dedicated"],
        reloadOnSearch: false
    });

});
