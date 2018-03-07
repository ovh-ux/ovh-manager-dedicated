angular.module("directives").directive("toggleButton", [
    "translator",
    function (translator) {
        "use strict";
        return {
            restrict: "A",
            require: "?ngModel",
            replace: true,
            scope: {
                model: "=ngModel",
                values: "=",
                change: "&onToggle",
                translation: "@translation"
            },
            template: `
            <div class="btn-toggle-group">
                <div class="btn-toggle-container" data-ng-repeat="value in values">
                    <button class="btn btn-toggle btn-block" data-ng-class="{'active': model == value}" data-ng-click="select(value)">
                        <span data-ng-show="translation">{{ tr(translation, [value])}}</span>
                        <span data-ng-hide="translation">{{ tr("toggle_button_label_" + value)}}</span>
                    </button>
                </div>
            </div>`,
            link ($scope) {
                let unregister;

                $scope.tr = translator.tr;

                $scope.select = function (val) {
                    $scope.model = val;

                    $scope.change({
                        type: val
                    });
                };

                unregister = $scope.$watch(
                    "values",
                    (ov) => {
                        if (ov !== null && ov.length > 0) {
                            $scope.select($scope.values[0]);
                            unregister();
                        }
                    },
                    true
                );
            }
        };
    }
]);
