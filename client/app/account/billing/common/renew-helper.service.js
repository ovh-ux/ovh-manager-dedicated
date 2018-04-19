angular.module("Billing.services").service("BillingrenewHelper", function ($filter, $translate) {
    "use strict";

    this.getRenewDateFormated = (service) => {
        if (!service) {
            return "";
        } else if (this.serviceHasAutomaticRenew(service)) {
            return _.capitalize($filter("date")(service.expiration, "MMMM yyyy"));
        }

        let translationId = "autorenew_service_expiration_date";
        if (moment().isAfter(moment(service.expiration))) {
            translationId = "autorenew_service_after_expiration_date";
        }
        return $translate.instant(translationId, [$filter("date")(service.expiration, "mediumDate")]);
    };

    this.getRenewLabel = (service) => {
        if (service === "0") {
            return $translate.instant("autorenew_service_renew_0");
        }

        if (angular.isString(service)) {
            if (service.indexOf("frequency_value_") > -1) {
                return $filter("renewFrequence")(+service.split("_")[2]);
            }
            return $translate.instant(`autorenew_service_renew_${service}`);
        }

        if (angular.isObject(service)) {
            if (!_.isEmpty(service.subProducts)) {
                return "";
            }
            return this.getRenewLabel(this.getRenewKey(service));
        }

        return "";
    };

    this.serviceHasAutomaticRenew = (service) => _.has(service, "renew") && (service.renew.forced || service.renew.automatic) && !(service.renew.deleteAtExpiration || service.status === "EXPIRED");

    this.getRenewKey = (service) => {
        let txt;
        if (!service || !_.isEmpty(service.subProducts)) {
            return "";
        }

        if (service.renew.manualPayment) {
            txt = "manual_payment";
        } else if (service.renew.deleteAtExpiration) {
            txt = "delete_at_expiration";
        } else if (service.status === "EXPIRED") {
            txt = "manuel";
        } else if (this.serviceHasAutomaticRenew(service)) {
            txt = "auto";
            if (service.renew.period) {
                txt = `frequency_value_${service.renew.period}`;
            }
        } else {
            txt = "manuel";
        }

        return txt;
    };
});
