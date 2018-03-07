angular.module("Billing.directives").controller("Billing.directives.billingSortingFieldButtonCtrl", [
    "$scope",
    "translator",
    function ($scope, translator) {
        "use strict";

        $scope.tr = translator.tr;

        this.isActive = () => this.associatedField === this.activeField;
        this.isAscending = () => !this.reverseOrder;
        this.isDescending = () => this.reverseOrder;

        this.onClick = () => {
            const newOrder = this.isActive() ? !this.reverseOrder : this.reverseOrder;
            if (angular.isFunction(this.onChange)) {
                this.onChange(this.associatedField, newOrder);
            }
        };
    }
]);
