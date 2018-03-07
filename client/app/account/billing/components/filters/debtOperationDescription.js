angular.module("Billing.filters").filter("debtOperationDescription", [
    "translator",
    function (translator) {
        "use strict";

        const BASE_I18N_SLUG = "statements_operation_description_";

        function getDescriptionSlug (debtOperation) {
            return BASE_I18N_SLUG + debtOperation.type.toLowerCase();
        }

        return function (debtOperation) {
            if (!debtOperation || !angular.isString(debtOperation.type)) {
                return "";
            }

            const slug = getDescriptionSlug(debtOperation);
            return translator.tr(slug);
        };
    }
]);
