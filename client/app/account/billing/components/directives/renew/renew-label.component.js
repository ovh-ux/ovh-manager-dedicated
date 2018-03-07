angular.module("Billing.directives").component("billingRenewLabel", {
    bindings: {
        serviceInfos: "<"
    },
    controller: [
        "$filter",
        "translator",
        "BillingrenewHelper",
        function ($filter, translator, renewHelper) {
            "use strict";

            this.init = function () {
                this.content = renewHelper.getRenewLabel(this.serviceInfos);
            };

            this.$onInit = () => this.init();
            this.$onChanges = () => this.init();
        }
    ],
    template: '<span data-ng-bind="$ctrl.content"></span>'
});
