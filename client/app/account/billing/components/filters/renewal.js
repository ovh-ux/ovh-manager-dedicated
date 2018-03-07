angular.module("Billing.filters").filter("renewal", [
    "translator",

    function (translator) {
        "use strict";

        return function (services, renew) {
            let output = services;

            if (services) {
                output = services.filter((service) => {
                    if (renew === translator.tr("autorenew_service_renew_0")) {
                        return true;
                    }

                    // Manage service groups (domain + hosting)
                    if (service.subProducts) {
                        if (service.subProducts.domain && service.subProducts.domain.renewLabel === renew) {
                            return true;
                        }
                        if (service.subProducts.hosting_web && service.subProducts.hosting_web.renewLabel === renew) {
                            return true;
                        }
                    }

                    return service.renewLabel === renew;
                });
            }

            return output;
        };
    }
]);
