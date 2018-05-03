angular.module("Billing.directives").component("billingRenewDate", {
    bindings: {
        serviceInfos: "<"
    },
    controller: [
        "$filter",
        "BillingrenewHelper",
        function ($filter, renewHelper) {
            "use strict";

            this.init = function () {
                this.content = renewHelper.getRenewDateFormated(this.serviceInfos);
            };

            this.$onInit = () => this.init();
            this.$onChanges = () => this.init();
        }
    ],
    template: '<span data-ng-bind="$ctrl.content"></span>'
});
