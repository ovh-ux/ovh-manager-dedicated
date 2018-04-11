angular.module("App").controller("ServerFirewallAddRuleCtrl", ($scope, Server, FIREWALL_RULE_ACTIONS, FIREWALL_RULE_PROTOCOLS, REGEX) => {
    $scope.data = $scope.currentActionData;

    $scope.FIREWALL_RULE_PROTOCOLS = FIREWALL_RULE_PROTOCOLS;

    $scope.rule = {
        sequence: null,
        action: null,
        protocol: null,
        source: null,
        sourcePort: {
            to: null,
            from: null
        },
        destinationPort: {
            to: null,
            from: null
        },
        tcpOptions: {
            ack: false,
            established: false,
            fin: false,
            psh: false,
            rst: false,
            syn: false,
            urg: false
        },
        udpOptions: {
            fragments: false
        }
    };

    /* Select list */

    $scope.getAvailableSequences = function () {
        const sequences = [];
        let i = 0;
        for (; i < 100; i++) {
            sequences.push(i);
        }
        return sequences;
    };

    $scope.getAvailableActions = function () {
        return [FIREWALL_RULE_ACTIONS.ALLOW, FIREWALL_RULE_ACTIONS.DENY];
    };

    $scope.getAvailableProtocols = function () {
        return [FIREWALL_RULE_PROTOCOLS.IPV_4, FIREWALL_RULE_PROTOCOLS.UDP, FIREWALL_RULE_PROTOCOLS.TCP, FIREWALL_RULE_PROTOCOLS.ICMP];
    };

    /* Conditions */

    $scope.isIpv4IcmpOrUdpFrag = function () {
        return $scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.IPV_4 || $scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.ICMP || ($scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.UDP && $scope.rule.udpOptions.fragments);
    };

    $scope.isDestinationPortToDisabled = function () {
        return $scope.rule.protocol !== FIREWALL_RULE_PROTOCOLS.TCP && $scope.rule.protocol !== FIREWALL_RULE_PROTOCOLS.UDP && $scope.rule.protocol !== FIREWALL_RULE_PROTOCOLS.ICMP;
    };

    /* Validator */

    $scope.updateCheckedTcpOptions = function (option) {
        if ($scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.TCP) {
            if (option === "established") {
                $scope.rule.tcpOptions.ack = false;
                $scope.rule.tcpOptions.rst = false;
            } else if (option === "ack" || option === "rst") {
                $scope.rule.tcpOptions.established = false;
            }
        }
    };

    $scope.isValid = function () {
        return (
            $scope.rule.sequence !== null &&
            $scope.rule.action !== null &&
            $scope.rule.protocol !== null &&
            ($scope.rule.source === null || $scope.rule.source === "" || $scope.rule.source.match(REGEX.ROUTABLE_BLOCK_OR_IP)) &&
            !($scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.TCP && $scope.rule.tcpOptions.established && ($scope.rule.tcpOptions.ack || $scope.rule.tcpOptions.rst))
        );
    };

    /* Step 2 display */

    $scope.setDisplayPortRanges = function () {
        $scope.rule.sourcePort.display = getSourcePortRange();
        $scope.rule.destinationPort.display = getDestinationPortRange();
        $scope.rule.tcpOptionsDisplay = getTcpOptionsDisplay();
        $scope.rule.udpOptionsDisplay = getUdpOptionsDisplay();
    };

    function getSourcePortRange () {
        if ($scope.rule.sourcePort.from) {
            if ($scope.rule.sourcePort.to) {
                return `${$scope.rule.sourcePort.from}-${$scope.rule.sourcePort.to}`;
            }
            return $scope.rule.sourcePort.from;
        }
        return "-";
    }

    function getDestinationPortRange () {
        if ($scope.rule.destinationPort.from) {
            if ($scope.rule.destinationPort.to) {
                return `${$scope.rule.destinationPort.from}-${$scope.rule.destinationPort.to}`;
            }
            return $scope.rule.destinationPort.from;
        }
        return "-";
    }

    function getTcpOptionsDisplay () {
        const options = [];
        if ($scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.TCP) {
            angular.forEach($scope.rule.tcpOptions, (value, option) => {
                if (value) {
                    options.push(option);
                }
            });
            options.sort();
        }
        return options.join("<br>");
    }

    function getUdpOptionsDisplay () {
        const options = [];
        if ($scope.rule.protocol === FIREWALL_RULE_PROTOCOLS.UDP) {
            angular.forEach($scope.rule.udpOptions, (value, option) => {
                if (value) {
                    options.push(option);
                }
            });
            options.sort();
        }
        return options.join("<br>");
    }

    /* Action */

    $scope.addRule = function () {
        $scope.resetAction();

        const protocol = $scope.rule.protocol;

        if (protocol !== FIREWALL_RULE_PROTOCOLS.TCP) {
            delete $scope.rule.protocol.tcpOptions;
        }

        if (protocol !== FIREWALL_RULE_PROTOCOLS.UDP) {
            delete $scope.rule.protocol.udpOptions;
        }

        if (protocol !== FIREWALL_RULE_PROTOCOLS.TCP && protocol !== FIREWALL_RULE_PROTOCOLS.UDP) {
            delete $scope.rule.sourcePort;
            delete $scope.rule.destinationPort;
        }

        Server.addFirewallRule($scope.data.block.value.ip, $scope.data.ip.ip, $scope.rule).then(
            (data) => {
                $scope.setMessage($scope.tr("server_configuration_firewall_add_rule_success", [$scope.server.name]), data);
            },
            (data) => {
                $scope.setMessage($scope.tr("server_configuration_firewall_add_rule_fail"), data.data);
            }
        );
    };
});

angular.module("App").controller("FirewallRemoveRuleCtrl", ($scope, Server) => {
    $scope.data = $scope.currentActionData;

    $scope.removeRule = function () {
        $scope.resetAction();

        Server.removeFirewallRule($scope.data.block.value.ip, $scope.data.ip.ip, $scope.data.rule.sequence).then(
            (data) => {
                $scope.setMessage($scope.tr("server_configuration_firewall_remove_rule_success"), data);
            },
            (data) => {
                $scope.setMessage($scope.tr("server_configuration_firewall_remove_rule_fail"), data);
            }
        );
    };
});

angular.module("App").controller("ServerIpToggleFirewallCtrl", ($scope, Server, FIREWALL_STATUSES) => {
    $scope.data = $scope.currentActionData;

    $scope.firewallStatuses = FIREWALL_STATUSES;

    // Hack because the condition in the template wouldn't change depending on the mitigation status
    $scope.translations = {};
    if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.ACTIVATED) {
        $scope.translations.wizardTitle = $scope.tr("server_configuration_firewall_disable_title");
        $scope.translations.wizardQuestion = $scope.tr("server_configuration_firewall_disable_question", [$scope.data.ip.ip]);
    } else if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.DEACTIVATED) {
        $scope.translations.wizardTitle = $scope.tr("server_configuration_firewall_enable_title");
        $scope.translations.wizardQuestion = $scope.tr("server_configuration_firewall_enable_question", [$scope.data.ip.ip]);
    } else {
        $scope.translations.wizardTitle = $scope.tr("server_configuration_firewall_new_title");
        $scope.translations.wizardQuestion = $scope.tr("server_configuration_firewall_new_question", [$scope.data.ip.ip]);
    }

    $scope.toggleFirewall = function () {
        $scope.resetAction();

        let newStatus = $scope.firewallStatuses.NOT_CONFIGURED;

        if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.ACTIVATED) {
            newStatus = $scope.firewallStatuses.DEACTIVATED;
        } else if ($scope.data.ip.firewallStatus === $scope.firewallStatuses.DEACTIVATED) {
            newStatus = $scope.firewallStatuses.ACTIVATED;
        }

        if (newStatus === $scope.firewallStatuses.NOT_CONFIGURED) {
            Server.createFirewall($scope.data.block.ip, $scope.data.ip.ip).then(
                (data) => {
                    $scope.setMessage($scope.tr("server_configuration_firewall_new_success", $scope.data.ip.ip), data);
                },
                (data) => {
                    $scope.setMessage($scope.tr("server_configuration_firewall_new_failed", $scope.data.ip.ip), data);
                }
            );
        } else {
            Server.toggleFirewall($scope.data.block.ip, $scope.data.ip.ip, newStatus).then(
                (data) => {
                    if (newStatus === $scope.firewallStatuses.DEACTIVATED) {
                        $scope.setMessage($scope.tr("server_configuration_firewall_disable_success", $scope.data.ip.ip), data);
                    } else if (newStatus === $scope.firewallStatuses.ACTIVATED) {
                        $scope.setMessage($scope.tr("server_configuration_firewall_enable_success", $scope.data.ip.ip), data);
                    } else {
                        $scope.setMessage($scope.tr("server_configuration_firewall_new_success", $scope.data.ip.ip), data);
                    }
                },
                (data) => {
                    if (newStatus === $scope.firewallStatuses.DEACTIVATED) {
                        $scope.setMessage($scope.tr("server_configuration_firewall_disable_failed", $scope.data.ip.ip), data);
                    } else if (newStatus === $scope.firewallStatuses.ACTIVATED) {
                        $scope.setMessage($scope.tr("server_configuration_firewall_enable_failed", $scope.data.ip.ip), data);
                    } else {
                        $scope.setMessage($scope.tr("server_configuration_firewall_new_failed", $scope.data.ip.ip), data);
                    }
                }
            );
        }
    };
});
