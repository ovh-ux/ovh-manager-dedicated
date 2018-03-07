angular.module("Module.ip.controllers").controller("EnableDisableGameFirewallRuleCtrl", function ($scope, Ip, IpGameFirewall, $rootScope, Alerter) {
    "use strict";

    const self = this;
    const alert = "ip_game_firewall_alert";

    self.datas = $scope.currentActionData;
    self.loading = false;

    $scope.enableDisableGameFirewallRule = function () {
        self.loading = true;

        IpGameFirewall.putFirewall(self.datas.ipblock, self.datas.ip, !self.datas.firewall.firewallModeEnabled)
            .then(
                () => {
                    Alerter.success($scope.tr(`ip_game_mitigation_firewall_enable_success_${self.datas.firewall.firewallModeEnabled}`), alert);
                    $rootScope.$broadcast("ips.gameFirewall.display.firewall");
                },
                (data) => {
                    Alerter.alertFromSWS($scope.tr(`ip_game_mitigation_firewall_enable_error_${self.datas.firewall.firewallModeEnabled}`), data, alert);
                }
            )
            .finally(() => {
                $scope.resetAction();
            });
    };
});
