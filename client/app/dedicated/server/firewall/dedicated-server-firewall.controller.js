angular.module("App").controller("ServerTabFirewallAsaCtrl", ($scope, $q, $stateParams, Server, ServerFirewallAsa) => {
    $scope.informations = null;
    $scope.server = null;
    $scope.canOrderAsaOption = false;
    $scope.loading = true;

    function init () {
        $scope.informations = null;
        $q.allSettled([initServer(), initOptions(), initInformations()]).finally(() => {
            $scope.loading = false;
        });
    }

    function initServer () {
        return Server.getSelected($stateParams.productId).then((server) => {
            $scope.server = server;
        });
    }

    function initOptions () {
        return ServerFirewallAsa.getOptionList($stateParams.productId).then((availableOptions) => {
            if (availableOptions && availableOptions.results.length > 0) {
                $scope.canOrderAsaOption = true;
            }
        });
    }

    function initInformations () {
        return ServerFirewallAsa.getInformations($stateParams.productId).then(
            (data) => {
                $scope.informations = data;
            },
            (data) => {
                $scope.setMessage($scope.tr("server_configuration_firewall_fail"), data);
            }
        );
    }

    $scope.$on(ServerFirewallAsa.events.firewallAsaChanged, () => {
        init();
    });

    init();
});
