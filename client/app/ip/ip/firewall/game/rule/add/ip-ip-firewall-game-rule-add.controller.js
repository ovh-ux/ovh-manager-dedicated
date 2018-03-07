angular.module("Module.ip.controllers").controller("AddGameFirewallRuleCtrl", function ($scope, $rootScope, Alerter, Ip, IpGameFirewall) {
    "use strict";

    const self = this;
    const alert = "ip_game_firewall_alert";
    const alertadd = "ip_game_firewall_add_alert";

    self.datas = $scope.currentActionData;

    self.forms = {
        addRuleForm: {}
    };

    self.enums = {
        protocols: []
    };

    self.rule = {
        protocol: null,
        ports: {
            to: null,
            from: null
        }
    };

    $scope.addRuleFormCheck = {
        formValid: false
    };

    self.loading = false;

    $scope.getProtocoleText = function (protocol) {
        const tradText = $scope.tr(`ip_game_mitigation_rule_add_protocol_enum_${protocol}`);
        return !/^\/!\\.*/.test(tradText) ? tradText : protocol;
    };

    function init () {
        self.loading = true;

        Ip.getIpModels()
            .then(
                (model) => {
                    self.enums.protocols = model["ip.GameMitigationRuleProtocolEnum"].enum;
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr("ip_game_mitigation_rule_add_init_error"), data.data, alert);
                    $scope.resetAction();
                }
            )
            .finally(() => {
                self.loading = false;
            });
    }

    $scope.addGameFirewallRule = function () {
        self.loading = true;

        if (self.rule.ports.to === null) {
            self.rule.ports.to = self.rule.ports.from;
        }

        if (self.rule.ports.to < self.rule.ports.from) {
            const inversePort = {
                to: self.rule.ports.from,
                from: self.rule.ports.to
            };
            self.rule.ports = inversePort;
        }

        IpGameFirewall.postRule(self.datas.ipblock, self.datas.ip, self.rule).then(
            (rule) => {
                $rootScope.$broadcast("ips.gameFirewall.display.add", rule);
                $scope.resetAction();
            },
            (data) => {
                Alerter.alertFromSWS($scope.tr("ip_game_mitigation_rule_add_error"), data, alertadd);
                self.loading = false;
            }
        );
    };

    $scope.getClassLabel = function (label) {
        if (label && label.$dirty) {
            return (label.$invalid && "has-error") || "has-success";
        }
        return "";
    };

    init();
});
