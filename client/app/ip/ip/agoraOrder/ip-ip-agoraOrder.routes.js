angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.ip.agora-order", {
        url: "/agoraOrder",
        templateUrl: "ip/ip/agoraOrder/ip-ip-agoraOrder.html",
        controller: "agoraIpOrderCtrl",
        controllerAs: "ctrl",
        layout: "modal",
        translations: []
    });
});
