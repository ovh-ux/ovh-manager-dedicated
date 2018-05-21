angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.flush", {
        url: "/flush",
        templateUrl: "cdn/dedicated/domain/flush/cdn-dedicated-domain-flush.html",
        controller: "CdnFlushDomainsCtrl",
        layout: {
            name: "modal",
            toChilds: true
        },
        translations: ["cdn/dedicated/domain/flush"]
    });
});
