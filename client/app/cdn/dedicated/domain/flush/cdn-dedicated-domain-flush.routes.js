angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.flush", {
        url: "/flush",
        templateUrl: "cdn/dedicated/domain/flush/cdn-dedicated-domain-flush.html",
        controller: "CdnDomainFlushCtrl",
        resolve: {
            cdnDomain: "cdnDomain" // resolve from parent needs to be redefined for modal resolution
        },
        layout: "modal",
        translations: ["cdn/dedicated/domain/flush"]
    });
});
