angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain-add", {
        url: "/domain-add",
        templateUrl: "cdn/dedicated/domain/add/cdn-dedicated-domain-add.html",
        controller: "CdnDomainAddCtrl",
        resolve: {
            cdnDedicated: "cdnDedicated" // resolve from parent needs to be redefined for modal resolution
        },
        layout: "modal",
        translations: ["cdn/dedicated/domain/add"]
    });
});
