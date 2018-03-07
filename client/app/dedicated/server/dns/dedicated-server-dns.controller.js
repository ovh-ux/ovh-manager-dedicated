angular.module("App").controller("SecondaryDnsCtrl", ($scope, $http, $stateParams, Server) => {
    $scope.loading = true;
    $scope.secondaryDnsList = null;

    function init () {
        $scope.loading = true;
        Server.getSecondaryDnsList($stateParams.productId).then(
            (data) => {
                $scope.secondaryDnsList = data.list.results;
                $scope.loading = false;
            },
            (err) => {
                $scope.loading = false;
                $scope.setMessage($scope.tr("server_configuration_secondary_dns_fail"), err);
            }
        );
    }

    $scope.$on("dedicated.secondarydns.reload", init);

    init();
});
