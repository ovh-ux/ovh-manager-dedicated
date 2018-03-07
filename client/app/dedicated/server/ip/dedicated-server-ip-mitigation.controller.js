angular.module("App").controller("ServerIpMitigationCtrl", [
    "$scope",
    "Server",

    function ($scope, Server) {
        "use strict";

        $scope.selectedIpAndBlock = $scope.currentActionData;
        $scope.mitigationStatusAuto = $scope.selectedIpAndBlock.ip.mitigationStatus === "AUTO"; // Hack for the wizard status

        // Hack because the condition in the template wouldn't change depending on the mitigation status
        $scope.translations = {};
        if ($scope.mitigationStatusAuto) {
            $scope.translations.wizardTitle = $scope.tr("server_configuration_mitigation_force_title");
            $scope.translations.wizardQuestion = $scope.tr("server_configuration_mitigation_force_question", [$scope.selectedIpAndBlock.ip.ip]);
        } else {
            $scope.translations.wizardTitle = $scope.tr("server_configuration_mitigation_auto_title");
            $scope.translations.wizardQuestion = $scope.tr("server_configuration_mitigation_auto_question", [$scope.selectedIpAndBlock.ip.ip]);
        }

        $scope.updateMitigation = function () {
            $scope.resetAction();

            // Toggle between the two mitigation status that can be changed
            let newMitigationStatus = "AUTO";
            if ($scope.mitigationStatusAuto) {
                newMitigationStatus = "ACTIVATED";
            }

            Server.updateMitigation($scope.selectedIpAndBlock.block.ip, $scope.selectedIpAndBlock.ip.ip, newMitigationStatus).then(
                (data) => {
                    if (newMitigationStatus === "AUTO") {
                        $scope.setMessage($scope.tr("server_configuration_mitigation_auto_success", $scope.selectedIpAndBlock.ip.ip), data);
                    } else {
                        $scope.setMessage($scope.tr("server_configuration_mitigation_force_success", $scope.selectedIpAndBlock.ip.ip), data);
                    }
                },
                (data) => {
                    if (newMitigationStatus === "AUTO") {
                        $scope.setMessage($scope.tr("server_configuration_mitigation_auto_failed", $scope.selectedIpAndBlock.ip.ip), data);
                    } else {
                        $scope.setMessage($scope.tr("server_configuration_mitigation_force_failed", $scope.selectedIpAndBlock.ip.ip), data);
                    }
                }
            );
        };
    }
]);
