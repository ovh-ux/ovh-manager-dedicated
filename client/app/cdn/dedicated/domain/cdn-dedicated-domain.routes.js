angular.module("App").config(($stateProvider) => {

    $stateProvider.state("app.networks.cdn.dedicated.domain", {
        url: "/domain/:domain",
        views: {
            cdnMainView: {
                templateUrl: "cdn/dedicated/domain/cdn-dedicated-domain.html",
                controller: "CdnDomainCtrl",
                controllerAs: "$ctrl"
            },
            "cdnDomainView@app.networks.cdn.dedicated.domain": {
                templateUrl: "cdn/dedicated/domain/dashboard/cdn-dedicated-domain-dashboard.html",
                controller: "CdnDomainDashboardCtrl",
                controllerAs: "$ctrl"
            }
        },
        resolve: {
            cdnDomain: ($q, $stateParams, OvhApiCdnDedicated) => OvhApiCdnDedicated.Domains().v6().get({
                serviceName: $stateParams.productId,
                domain: $stateParams.domain
            }).$promise
        },
        translations: ["cdn/dedicated/domain", "cdn/dedicated/domain/dashboard"]
    });

});
