angular.module("Billing.services").service("BillingAuth", [
    "$http",
    function ($http) {
        "use strict";

        /*
         * Get server's current timestamp
         */
        this.getCurrentTimestamp = () => $http.get("/auth/time", { serviceType: "apiv7" }).then((result) => parseInt(result.data, 10));
    }
]);
