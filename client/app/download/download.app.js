angular.module("Module.download", ["Module.download.controllers", "Module.download.services"]).config(($stateProvider) => {
    "use strict";

    $stateProvider.state("app.download", {
        url: "/download?type&id&extension",
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
