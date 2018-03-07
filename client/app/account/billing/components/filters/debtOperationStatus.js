angular.module("Billing.filters").filter("debtOperationStatus", [
    "translator",
    function (translator) {
        "use strict";

        const BASE_I18N_SLUG = "statements_operation_status_";

        function getDescriptionSlug (debtOperation) {
            return BASE_I18N_SLUG + debtOperation.status.toLowerCase();
        }

        return function (debtOperation) {
            if (!debtOperation || !angular.isString(debtOperation.status)) {
                return "";
            }

            const slug = getDescriptionSlug(debtOperation);
            return translator.tr(slug);
        };
    }
]);
