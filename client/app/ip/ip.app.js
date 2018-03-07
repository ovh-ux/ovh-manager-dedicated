angular
    .module("Module.ip", ["ovh-utils-angular", "ngRoute", "ui.bootstrap", "ngSanitize", "Module.ip.controllers", "Module.ip.services", "Module.ip.filters"])
    .config([
        "$stateProvider",
        function ($stateProvider) {
            "use strict";

            $stateProvider.state("app.ip", {
                url: "/configuration/ip",
                templateUrl: "ip/ip.html",
                controller: "IpMainCtrl",
                reloadOnSearch: false,
                resolve: {
                    navigationInformations: [
                        "Navigator",
                        function (Navigator) {
                            return Navigator.setNavigationInformation({
                                ipSelected: true
                            });
                        }
                    ]
                }
            });
        }
    ])
    .run([
        "translator",
        function (translator) {
            "use strict";
            translator.load(["ip"]);
        }
    ]);
