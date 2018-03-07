angular.module("Module.download", ["Module.download.controllers", "Module.download.services"]).config(($routeProvider) => {
    "use strict";

    $routeProvider.when("/download", {
        templateUrl: "download/download.html",
        controller: "DownloadCtrl",
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["download"]).then(() => translator);
                }
            ]
        }
    });
});
