angular.module('Module.ip.controllers').controller('IpFirewallCtrl', ($scope, $rootScope, $timeout, $translate, Ip, IpFirewall, $location, $route) => {
  $scope.selectedBlock = null;
  $scope.selectedIp = null;
  $scope.rules = null;
  $scope.rulesLoading = false;
  $scope.rulesLoadingError = null;

  function init(params) {
    $scope.rulesLoadingError = null;
    $scope.rules = null;
    $scope.selectedBlock = params.ipBlock.ipBlock;
    $scope.selectedIp = params.ip.ip;
    $timeout(() => {
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'rulesTable');
    }, 99);
  }

  function defaultLoad() {
    init({ ip: { ip: $location.search().ip }, ipBlock: { ipBlock: $location.search().ipBlock } });
  }
  function reloadRules() {
    IpFirewall.killPollFirewallRule();
    $scope.$broadcast('paginationServerSide.reload', 'rulesTable');
  }

  $scope.$on('ips.firewall.informations.reload', () => {
    reloadRules();
  });

  $scope.loadRules = function (rulesCount, offset) {
    if ($scope.selectedIp) {
      $scope.rulesLoading = true;

      IpFirewall.getFirewallRules($scope.selectedBlock, $scope.selectedIp, rulesCount, offset)
        .then(
          (rules) => {
            $scope.rules = rules;
            let options;

            if ($scope.rules
              && $scope.rules.list
              && $scope.rules.list.results
              && $scope.rules.list.results.length) {
              angular.forEach($scope.rules.list.results, (result, i) => {
                options = [];
                if (result.fragments) {
                  options.push($translate.instant('ip_firewall_rule_fragments'));
                }
                if (result.tcpOption) {
                  options.push(result.tcpOption);
                }

                $scope.rules.list.results[i].options = options.join('<br/>');

                // Go poll
                if (result.state === 'CREATION_PENDING' || result.state === 'REMOVAL_PENDING') {
                  IpFirewall
                    .pollFirewallRule(
                      $scope.selectedBlock,
                      $scope.selectedIp,
                      result.sequence,
                    ).then(() => {
                      reloadRules();
                    });
                }
              });
            }
          },
          (reason) => {
            $scope.rulesLoadingError = reason.message;
          },
        )
        .finally(() => {
          $scope.rulesLoading = false;
        });
    }
  };

  $scope.hideFirewall = function () {
    Ip.cancelActionParam('firewall');
    IpFirewall.killPollFirewallRule();
    $rootScope.$broadcast('ips.display', 'table');
  };

  // Come from button
  $scope.$on('ips.firewall.display', (event, params) => {
    init(params);
  });

  // Come from URL
  if ($location.search().action === 'firewall' && $location.search().ip) {
    IpFirewall.getFirewallDetails($location.search().ipBlock, $location.search().ip).then(
      (firewallDetails) => {
        if (!firewallDetails.enabled) {
          $location.search('action', 'toggleFirewall');
          $route.reload();
        } else {
          defaultLoad();
        }
      },
      () => {
        $location.search('action', 'toggleFirewall');
        $route.reload();
      },
    );
  }
});
