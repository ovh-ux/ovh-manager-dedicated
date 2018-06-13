angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.delete", {
        url: "/delete",
        templateUrl: "cdn/dedicated/domain/delete/cdn-dedicated-domain-delete.html",
        controller: "CdnDomainDeleteCtrl",
        resolve: {
            cdnDomain: "cdnDomain" // resolve from parent needs to be redefined for modal resolution
        },
        layout: "modal",
        translations: ["cdn/dedicated/domain/delete"]
    });
});
