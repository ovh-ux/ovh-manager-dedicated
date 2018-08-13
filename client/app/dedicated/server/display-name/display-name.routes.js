angular.module("App")
    .config(($stateProvider) => {
        $stateProvider.state("app.dedicated.server.edit-display-name", {
            url: "/display-name",
            controller: "DisplayNameCtrl",
            templateUrl: "dedicated/server/display-name/display-name.html",
            layout: "modal",
            translations: ["dedicated/server/display-name"]
        });
    });
