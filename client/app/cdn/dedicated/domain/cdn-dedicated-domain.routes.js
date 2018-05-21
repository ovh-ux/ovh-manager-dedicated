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
                templateUrl: "cdn/dedicated/domain/general/cdn-dedicated-domain-general.html",
                controller: "CdnDomainGeneralCtrl",
                controllerAs: "$ctrl"
            }
        },
        translations: ["cdn/dedicated/domain/general"]
    });

});
