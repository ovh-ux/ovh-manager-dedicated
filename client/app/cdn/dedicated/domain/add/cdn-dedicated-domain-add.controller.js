angular.module("App").controller("CdnAddDomainsCtrl", ($scope, $stateParams, Cdn) => {
    "use strict";

    $scope.backends = null;

    $scope.domain = {};
    $scope.newBackend = {};

    $scope.isSecondStepValid = function () {
        return $scope.domain.backend || ($scope.newBackend.value && !$scope.maxBackendsReached());
    };

    $scope.loadBackends = function () {
        if (!$scope.backends) {
            Cdn.getBackends($stateParams.productId).then((backends) => {
                $scope.backends = backends;
            });
        }
    };

    $scope.maxBackendsReached = function () {
        return $scope.backends && $scope.backends.backendsMax && $scope.backends.backendsMax === $scope.backends.results.length;
    };

    // On newbackend change, reset select
    $scope.$watch(
        "newBackend.value",
        (backend) => {
            if (backend) {
                $scope.domain.backend = null;
            }
        },
        true
    );

    // On select change, reset newBackend input
    $scope.$watch(
        "domain.backend",
        (backend) => {
            if (backend) {
                $scope.newBackend.value = null;
            }
        },
        true
    );

    $scope.addDomain = function () {
        if ($scope.newBackend.value) {
            $scope.domain.backend = $scope.newBackend.value;
        }
        $scope.resetAction();
        Cdn.addDomain($stateParams.productId, $scope.domain).then(
            () => {
                $scope.setMessage($scope.tr("cdn_configuration_add_domain_success", [$scope.domain.domain, $scope.domain.backend]), true);
            },
            (data) => {
                $scope.setMessage($scope.tr("cdn_configuration_add_domain_fail"), data);
            }
        );
    };
});
