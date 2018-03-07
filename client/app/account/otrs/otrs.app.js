angular
    .module("Module.otrs", ["ovh-utils-angular", "ngRoute", "ui.bootstrap", "ngSanitize", "Module.otrs.controllers", "Module.otrs.directives", "Module.otrs.services", "Module.otrs.filters"])
    .config([
        "$injector",
        function ($injector) {
            "use strict";

            const otrsTicket = {
                url: "/ticket",
                templateUrl: "account/otrs/otrs.html",
                controller: "otrsCtrl",
                piwikActionName: "Otrs - list"
            };

            const otrsTicketDetails = {
                url: "/ticket/:ticketId",
                templateUrl: "account/otrs/detail/otrs-detail.html",
                controller: "otrsDetailCtrl",
                piwikActionName: "Otrs - detail"
            };

            let $router;
            if ($injector.has("$stateProvider")) {
                $router = $injector.get("$stateProvider");

                $router.state("app.account.otrs-ticket", otrsTicket);
                $router.state("app.account.otrs-ticket-details", otrsTicketDetails);
            } else {
                $router = $injector.get("$routeProvider");

                $router.when(otrsTicket.url, _.omit(otrsTicket, "url"));
                $router.when(otrsTicketDetails.url, _.omit(otrsTicketDetails, "url"));
            }
        }
    ])
    .run([
        "translator",
        "Module.otrs.services.otrs",
        function (translator, Otrs) {
            "use strict";
            translator.load(["otrs"]);
            Otrs.init();
        }
    ]);
