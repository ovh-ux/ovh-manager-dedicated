/**
 * @type filter
 * @name filters:address
 */

angular.module("filters").filter("address", [
    "translator",
    "featureAvailability",
    function (translator, featureAvailability) {
        "use strict";

        function formatAddress (addressObject) {
            const country = translator.tr(`country_${addressObject.country}`);
            if (featureAvailability.showState()) {
                return `${addressObject.address} ${addressObject.city} ${addressObject.state ? addressObject.state : ""} ${addressObject.zip ? addressObject.zip : ""} ${country}`;
            }
            return `${addressObject.address} ${addressObject.zip ? addressObject.zip : ""} ${addressObject.city} ${country}`;
        }

        return formatAddress;
    }
]);
