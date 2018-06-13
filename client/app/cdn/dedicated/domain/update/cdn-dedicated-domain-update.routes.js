angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.update", {
        url: "/update",
        templateUrl: "cdn/dedicated/domain/update/cdn-dedicated-domain-update.html",
        controller: "CdnDomainUpdateCtrl",
        resolve: {
            cdnDomain: "cdnDomain" // resolve from parent needs to be redefined for modal resolution
        },
        layout: "modal",
        translations: ["cdn/dedicated/domain/update"]
    });
});
