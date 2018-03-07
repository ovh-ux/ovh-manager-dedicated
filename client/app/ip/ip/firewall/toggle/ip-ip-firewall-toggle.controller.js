angular.module("Module.ip.controllers").controller("IpFirewallToggleCtrl", ($scope, $rootScope, Ip, IpFirewall, translator, Alerter, $location) => {
    // Hack because the condition in the template wouldn't change depending on the mitigation status
    $scope.translations = {};

    function init (data) {
        $scope.data = data || $scope.currentActionData;
        if ($scope.data.ip.firewall === "ACTIVATED") {
            $scope.translations.wizardTitle = translator.tr("ip_firewall_disable_title");
            $scope.translations.wizardQuestion = translator.tr("ip_firewall_disable_question", [$scope.data.ip.ip]);
        } else if ($scope.data.ip.firewall === "DEACTIVATED") {
            $scope.translations.wizardTitle = translator.tr("ip_firewall_enable_title");
            $scope.translations.wizardQuestion = translator.tr("ip_firewall_enable_question", [$scope.data.ip.ip]);
        } else {
            $scope.translations.wizardTitle = translator.tr("ip_firewall_new_title");
            $scope.translations.wizardQuestion = translator.tr("ip_firewall_new_question", [$scope.data.ip.ip]);
        }
    }

    $scope.toggleFirewall = function () {
        $scope.loading = true;

        let newStatus = "NOT_CONFIGURED";

        if ($scope.data.ip.firewall === "ACTIVATED") {
            newStatus = false;
        } else if ($scope.data.ip.firewall === "DEACTIVATED") {
            newStatus = true;
        }

        if (newStatus === "NOT_CONFIGURED") {
            IpFirewall.addFirewall($scope.data.ipBlock.ipBlock, $scope.data.ip.ip)
                .then(
                    () => {
                        $rootScope.$broadcast("ips.table.refreshBlock", $scope.data.ipBlock);
                        Alerter.success(translator.tr("ip_firewall_new_success", $scope.data.ip.ip));
                    },
                    (data) => {
                        Alerter.alertFromSWS(translator.tr("ip_firewall_new_failed", $scope.data.ip.ip), data);
                    }
                )
                .finally(() => {
                    $scope.cancelAction();
                });
        } else {
            IpFirewall.toggleFirewall($scope.data.ipBlock.ipBlock, $scope.data.ip.ip, newStatus)
                .then(
                    () => {
                        $rootScope.$broadcast("ips.table.refreshBlock", $scope.data.ipBlock);
                        if (newStatus === false) {
                            Alerter.success(translator.tr("ip_firewall_disable_success", $scope.data.ip.ip));
                        } else if (newStatus === true) {
                            Alerter.success(translator.tr("ip_firewall_enable_success", $scope.data.ip.ip));
                        }
                    },
                    (data) => {
                        if (newStatus === false) {
                            Alerter.alertFromSWS(translator.tr("ip_firewall_disable_failed", $scope.data.ip.ip), data);
                        } else if (newStatus === true) {
                            Alerter.alertFromSWS(translator.tr("ip_firewall_enable_failed", $scope.data.ip.ip), data);
                        }
                    }
                )
                .finally(() => {
                    $scope.cancelAction();
                });
        }
    };

    // Come from URL
    if ($location.search().action === "toggleFirewall" && $location.search().ip) {
        $scope.loading = true;
        IpFirewall.getFirewallDetails($location.search().ipBlock, $location.search().ip)
            .then(
                (result) => {
                    init({ ip: { ip: $location.search().ip, firewall: result.enabled ? "ACTIVATED" : "DEACTIVATED" }, ipBlock: { ipBlock: $location.search().ipBlock } });
                },
                () => {
                    // firewall not created > 404
                    init({ ip: { ip: $location.search().ip, firewall: "NOT_CONFIGURED" }, ipBlock: { ipBlock: $location.search().ipBlock } });
                }
            )
            .finally(() => {
                $scope.loading = false;
            });
    } else {
        init();
    }

    $scope.cancelAction = function () {
        Ip.cancelActionParam("toggleFirewall");
        $scope.resetAction();
    };
});
