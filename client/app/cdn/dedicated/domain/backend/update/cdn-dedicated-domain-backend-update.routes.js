angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.backend.update", {
        url: "/update",
        templateUrl: "cdn/dedicated/domain/backend/update/cdn-dedicated-domain-backend-update.html",
        controller: "CdnDomainBackendUpdateCtrl",
        resolve: {
            cdnDedicated: "cdnDedicated", // resolve from parent needs to be redefined for modal resolution
            cdnDomain: "cdnDomain"
        },
        layout: {
            name: "modal",
            redirectTo: "app.networks.cdn.dedicated.domain"
        },
        translations: ["cdn/dedicated/domain/backend/update"]
    });
});
