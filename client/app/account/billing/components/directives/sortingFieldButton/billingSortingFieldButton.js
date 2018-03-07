angular.module("Billing.directives").directive("billingSortingFieldButton", [
    function () {
        "use strict";
        return {
            restrict: "A",
            scope: {
                label: "@",
                associatedField: "@",
                activeField: "=",
                reverseOrder: "=",
                onChange: "=?"
            },
            bindToController: true,
            controllerAs: "$ctrl",
            controller: "Billing.directives.billingSortingFieldButtonCtrl",
            replace: false,
            template:
            `<button type="button" 
                     class="btn btn-link"
                     data-ng-click="$ctrl.onClick()">
                <span data-ng-bind="$ctrl.label"></span>
                <i class="fa fa-chevron-down"
                   data-ng-if="$ctrl.isActive() && $ctrl.isAscending()"
                   aria-label="{{:: tr('common_order_ascending') }}"
                   aria-hidden="true">
                </i>
                <i class="fa fa-chevron-up"
                   data-ng-if="$ctrl.isActive() && $ctrl.isDescending()"
                   aria-label="{{:: tr('common_order_descending') }}"
                   aria-hidden="true">
                </i>
            </button>`
        };
    }
]);
