angular.module("App").controller("AddSecondaryDnsCtrl", ($scope, Server, Alerter, IpRange, $stateParams) => {
    $scope.entry = {
        domain: "",
        ip: ""
    };
    $scope.ipdata = {
        t: []
    };
    $scope.loading = false;

    $scope.loadIpList = function () {
        $scope.loading = true;
        Server.listIps($stateParams.productId).then(
            (_data) => {
                const data = _.chain(_data)
                    .filter((ip) => ipaddr.parseCIDR(ip)[0].kind() === "ipv4")
                    .map((ip) => IpRange.getRangeForIpv4Block(ip))
                    .flatten()
                    .value();

                if (data && data.length === 1) {
                    $scope.entry.ip = data[0];
                } else if (data && data.length === 0) {
                    // use server IP as a deafult for servers on which /ip api doesn"t return data (old kimisufi)
                    $scope.entry.ip = $scope.server.ip;

                    $scope.ipdata.t.push({
                        name: $scope.server.ip,
                        data: $scope.server.ip
                    });
                }
                data.sort();

                angular.forEach(data, (ip) => {
                    $scope.ipdata.t.push({
                        name: ip,
                        data: ip
                    });
                });
                $scope.loading = false;
            },
            (err) => {
                $scope.loading = false;
                $scope.resetAction();
                $scope.setMessage($scope.tr("server_configuration_ips_cannotfetch"), err);
            }
        );
    };

    $scope.loadToken = function () {
        $scope.loadTokenLoading = true;

        Server.getDomainZoneInformation($stateParams.productId, $scope.entry.domain).then(
            (result) => {
                $scope.loadTokenLoading = false;
                $scope.token = result;
            },
            (data) => {
                $scope.loadTokenLoading = false;
                Alerter.alertFromSWS($scope.tr("server_configuration_secondarydns_add_step2_error"), data.data, "addTokenAlert");
            }
        );
    };

    $scope.addSecondaryDns = function () {
        $scope.loading = true;
        Server.addSecondaryDns($stateParams.productId, $scope.entry.domain, $scope.entry.ip).then(
            () => {
                $scope.resetAction();
                $scope.loading = false;
                $scope.setMessage($scope.tr("server_configuration_secondarydns_add_success", [$scope.server.name]));
            },
            (err) => {
                $scope.resetAction();
                $scope.loading = false;
                $scope.setMessage($scope.tr("server_configuration_secondarydns_add_fail"), err);
            }
        );
    };
});
