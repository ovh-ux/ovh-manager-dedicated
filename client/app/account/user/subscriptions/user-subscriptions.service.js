angular.module("UserAccount.services").service("UserAccount.services.Subscriptions", [
    "$http",
    "$q",
    "UserAccount.constants",
    "OvhHttp",
    function ($http, $q, constants, OvhHttp) {
        "use strict";

        this.getUseraccountSubscriptions = function () {
            return OvhHttp.get("/me/subscription", {
                rootPath: "apiv6"
            }).then(
                (subscriptionTypes) =>
                    $q.all(
                        subscriptionTypes.map((subscriptionType) =>
                            OvhHttp.get("/me/subscription/{subscriptionType}", {
                                rootPath: "apiv6",
                                urlParams: {
                                    subscriptionType
                                }
                            })
                        )
                    ),
                (err) => $q.reject(err)
            );
        };

        this.updateUseraccountSubscription = function (type, state) {
            return OvhHttp.put("/me/subscription/{type}", {
                rootPath: "apiv6",
                urlParams: {
                    type
                },
                data: {
                    registered: state
                }
            });
        };
    }
]);
