angular.module("Module.ip.controllers").controller("IpEditIpDescriptionCtrl", [
    "$scope",
    "$rootScope",
    "Ip",
    "Alerter",

    function ($scope, $rootScope, Ip, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;
        $scope.model = { description: null };
        $scope.loading = false;

        if ($scope.data && $scope.data.ipBlock && $scope.data.ipBlock.description) {
            $scope.model.description = angular.copy($scope.data.ipBlock.description);
        }

        $scope.$watch("model.description", (newValue) => {
            $scope.availableChar = `${newValue ? newValue.length : 0}/255`;
        });

        /* Action */

        $scope.editIpDescription = function () {
            $scope.loading = true;
            Ip.editIpDescription($scope.data.ipBlock.ipBlock, $scope.model.description || "")
                .then(
                    () => {
                        $scope.data.ipBlock.description = $scope.model.description;
                        Alerter.success($scope.tr("ip_description_edit_success", $scope.data.ipBlock.ipBlock));
                    },
                    (reason) => {
                        Alerter.alertFromSWS($scope.tr("ip_description_edit_failure", $scope.data.ipBlock.ipBlock), reason);
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
