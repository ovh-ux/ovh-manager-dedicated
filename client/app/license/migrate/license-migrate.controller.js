angular.module("Module.license.controllers").controller("LicenseMigrateCtrl", [
    "$scope",
    "License",
    "Alerter",

    function ($scope, License, Alerter) {
        "use strict";

        $scope.availableIpBlock = {};

        $scope.loaders = {
            ips: false,
            canBeMovedTo: false,
            migrate: false
        };

        $scope.selected = {
            ipBlock: null,
            ip: null
        };

        $scope.ipValid = {
            value: false
        };

        $scope.ipCanBeMoved = {
            value: null
        };

        if ($scope.currentActionData && $scope.currentActionData.license) {
            $scope.license = $scope.currentActionData.license;
        }

        function checkIpValidity () {
            $scope.ipCanBeMoved.value = null;
            $scope.loaders.canBeMovedTo = true;
            return License.canLicenceBeMovedTo({
                type: $scope.license.type,
                id: $scope.license.id,
                destinationIp: $scope.selected.ip
            }).then(
                (data) => {
                    $scope.ipCanBeMoved.value = data.success;
                    $scope.loaders.canBeMovedTo = false;
                },
                (data) => {
                    $scope.loaders.canBeMovedTo = false;
                    $scope.resetAction();
                    $scope.loaders.migrate = false;
                    Alerter.alertFromSWS($scope.tr("license_migrate_fail"), data.data);
                }
            );
        }

        $scope.getIps = function () {
            $scope.loaders.ips = true;

            return License.ips({
                params: {
                    licenseType: $scope.license.type,
                    id: $scope.license.id
                }
            }).then(
                (data) => {
                    $scope.availableIpBlock = data;
                    $scope.selected.ipBlock = $scope.availableIpBlock[0];

                    $scope.loaders.ips = false;
                },
                () => {
                    $scope.availableIpBlock = {};
                    $scope.loaders.ips = false;
                }
            );
        };

        $scope.getBlockDisplay = function (ip) {
            return ip.block + (ip.reverse ? ` (${ip.reverse})` : "");
        };

        $scope.$watch("selected.ipBlock", (nv) => {
            if (nv) {
                const block = nv.block.split("/");
                const mask = block[1];
                let range = block[0];

                $scope.selected.ip = null;

                try {
                    range = ipaddr.parse(range);
                    if (range.kind() === "ipv4") {
                        if (mask === "32") {
                            $scope.oneIp = true;
                        } else {
                            $scope.oneIp = false;
                        }
                        $scope.selected.ip = range.toString();
                        $scope.ipValid.value = true;
                        checkIpValidity();
                    } else {
                        $scope.oneIp = false;
                    }
                } catch (e) {
                    $scope.oneIp = false;
                    throw e;
                }
            }
        });

        $scope.$watch("selected.ip", (nv) => {
            if (nv && $scope.ipValid.value === true) {
                checkIpValidity();
            }
        });

        $scope.areMigrationOptionsValids = function () {
            return $scope.license.canBeMoved === true && $scope.ipValid.value && $scope.ipCanBeMoved.value === true;
        };

        $scope.ipIsValid = function () {
            if ($scope.selected.ipBlock) {
                const block = $scope.selected.ipBlock.block.split("/");
                const mask = block[1];
                const range = block[0];
                let ip = null;

                try {
                    if (ipaddr.isValid($scope.selected.ip)) {
                        ip = ipaddr.parse($scope.selected.ip);
                        $scope.ipValid.value = ip.match(ipaddr.parse(range), mask);
                    } else {
                        $scope.ipValid.value = false;
                    }
                } catch (e) {
                    $scope.ipValid.value = false;
                    throw e;
                }
            } else {
                $scope.ipValid.value = false;
            }
        };

        $scope.migrate = function () {
            $scope.loaders.migrate = true;

            return License.migrate({
                urlParams: {
                    type: $scope.license.type,
                    id: $scope.license.id
                },
                data: {
                    destinationIp: $scope.selected.ip
                }
            }).then(
                (data) => {
                    $scope.resetAction();
                    $scope.loaders.migrate = false;
                    Alerter.alertFromSWS($scope.tr("license_migrate_success"), data.status);
                },
                (err) => {
                    $scope.resetAction();
                    $scope.loaders.migrate = false;
                    Alerter.alertFromSWS($scope.tr("license_migrate_fail"), err.data);
                }
            );
        };
    }
]);
