angular.module("services").service("MePaymentMethodApi", ($resource) => {
    "use strict";

    return $resource(
        "apiv6/me/paymentMethod",
        {
            id: "@id"
        },
        {
            get: {
                method: "GET",
                isArray: true
            },
            create: {
                method: "POST",
                isArray: false
            },
            "delete": {
                url: "apiv6/me/paymentMethod/:id",
                method: "DELETE",
                isArray: false
            },
            update: {
                url: "apiv6/me/paymentMethod/:id",
                method: "PUT",
                isArray: false
            }
        }
    );
});
