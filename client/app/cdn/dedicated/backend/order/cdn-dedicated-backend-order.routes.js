angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.backend.order", {
        url: "/order?fromState",
        templateUrl: "cdn/dedicated/backend/order/cdn-dedicated-backend-order.html",
        controller: "CdnBackendOrderCtrl",
        controllerAs: "$ctrl",
        translations: ["cdn/dedicated/backend/order"]
    });
});
