angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicated.server.working-status", {
        url: "/travaux",
        templateUrl: "dedicated/server/working-status/dedicated-server-working-status.html",
        controller: "WorkingStatusCtrl"
    });
});
