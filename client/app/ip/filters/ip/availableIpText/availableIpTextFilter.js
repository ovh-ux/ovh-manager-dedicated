angular.module("Module.ip.filters").filter("availableIpText", [
    "translator",
    function (translator) {
        "use strict";

        return function (ip) {
            if (!ip.blockSizes.length) {
                return "";
            }

            let html = "";
            if (ip.blockSizes.length > 1) {
                html += translator.tr("ip_order_step1_DEDICATED_v2_pre", [ip.number]);
                html += " ";
                html += translator.tr("ip_order_step1_DEDICATED_minmax", [Math.min.apply(null, ip.blockSizes), Math.max.apply(null, ip.blockSizes)]);
            } else {
                html += translator.trpl("ip_order_step1_DEDICATED_v2_individual", ip.number);
                if (ip.blockSizes[0] !== 1) {
                    html += ` ${translator.tr("ip_order_step1_DEDICATED_individualblocksize", [ip.blockSizes[0]])}`;
                }
            }

            return html;
        };
    }
]);
