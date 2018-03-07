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
                templateUrl: "cdn/dedicated/domain/rule/cdn-dedicated-domain-rule.html",
                controller: "CdnDomainTabCacheRuleCtrl",
                controllerAs: "$ctrl"
            }
        },
        reloadOnSearch: false
    });

});
