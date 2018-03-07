angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicated.server", {
        url: "/configuration/server/:productId",
        templateUrl: "dedicated/server/dedicated-server.html",
        controller: "ServerCtrl",
        reloadOnSearch: false,
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["server"]).then(() => translator);
                }
            ]
        }
    });
});
