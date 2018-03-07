angular.module("App").controller("DedicatedCloudSecurityOptionOrderCtrl", ($stateParams, $rootScope, $scope, $q, Alerter, DedicatedCloud) => {
    "use strict";

    $scope.optionName = $scope.currentActionData;

    $scope.loaders = {
        loading: true,
        checks: {
            nsx: true,
            vrops: true,
            trustedIp: true,
            restrictedAccess: true,
            user: true,
            userPhoneNumber: true,
            userMail: true,
            userTokenValidator: true
        }
    };

    $scope.nextStepButtons = {
        1: false,
        2: false
    };

    $scope.checks = {};

    $scope.checkCompliance = function () {
        return checkStep($scope.currentStep);

        function checkStep (step) {
            switch (step) {
            case 1:
                return $q.all([applyCheck(checkOption("nsx"), "nsx"), applyCheck(checkOption("vrops"), "vrops")]);
            case 2:
                return $q.all([applyCheck(checkRestrictedAccess(), "restrictedAccess"), applyCheck(checkTrustedIp(), "trustedIp")]);
            case 3:
                $scope.loaders.loading = true;
                return $q.all([checkUser(), canEnableOption()]).then((results) => {
                    $scope.loaders.loading = false;
                    if (results[1].data.oldCommercialVersion) {
                        $scope.commercialRanges = results[1].data;
                    }
                });
            default:
                return $q.reject();
            }
        }
    };

    $scope.optionCanBeEnabled = function () {
        return $scope.commercialRanges && !$scope.commercialRanges.error;
    };

    $scope.getCheckItemClass = function (item) {
        if ($scope.loaders.checks[item]) {
            return "checklist__item_loading";
        }

        return $scope.checks[item] ? "checklist__item_success" : "checklist__item_failure";
    };

    $scope.getItemStatusText = function (item) {
        if ($scope.checks[item]) {
            return "dedicatedCloud_options_security_enabled";
        }
        return "dedicatedCloud_options_security_disabled";
    };

    $scope.loadPrices = function () {
        $scope.loaders.loading = true;
        return DedicatedCloud.getSelected($stateParams.productId)
            .then((pcc) => DedicatedCloud.fetchAllHostsPrices($stateParams.productId, $scope.commercialRanges.oldCommercialVersion, $scope.commercialRanges.newCommercialVersion, pcc.location))
            .then((data) => {
                $scope.prices = data.current.map((host, index) =>
                    _.assign(_.pick(host, ["datacenter", "name", "billingType"]), {
                        current: host.price,
                        next: data.next[index].price
                    })
                );
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("dedicatedCloud_options_load_prices_error"), err, $scope.alerts.dashboard);
                $scope.resetAction();
            })
            .finally(() => {
                $scope.loaders.loading = false;
            });
    };

    $scope.subscribeOption = function () {
        $scope.loaders.loading = true;

        DedicatedCloud.enableOption($stateParams.productId, $scope.optionName)
            .then((result) => {
                Alerter.success($scope.tr("dedicatedCloud_options_order_activate_success"), $scope.alerts.dashboard);
                $rootScope.$broadcast("option-enable", {
                    optionName: $scope.optionName,
                    taskId: result.taskId
                });
            })
            .catch((err) => {
                Alerter.alertFromSWS($scope.tr("dedicatedCloud_options_order_activate_error"), err, $scope.alerts.dashboard);
            })
            .finally(() => {
                $scope.loaders.loading = false;
                $scope.resetAction();
            });
    };

    function canEnableOption () {
        return DedicatedCloud.isOptionToggable($stateParams.productId, $scope.optionName, "disabled", false);
    }

    function applyCheck (promise, checkName) {
        return promise
            .then((checkResult) => {
                $scope.checks[checkName] = checkResult;
                return checkResult;
            })
            .finally(() => {
                $scope.loaders.checks[checkName] = false;
            });
    }

    function checkOption (optionName) {
        return DedicatedCloud.getOptionState(optionName, $stateParams.productId).then((result) => {
            if (result.error) {
                Alerter.alertFromSWS($scope.tr("dedicatedCloud_options_check_error"), result.error, $scope.alerts.dashboard);
            }

            return result === "enabled";
        });
    }

    function checkTrustedIp () {
        return DedicatedCloud.getSecurityPolicies($stateParams.productId, null, null, true).then((policies) => {
            $scope.listIp = policies.list.results;
            return policies.list.results.some((network) => network.status === "ALLOWED");
        });
    }

    function checkRestrictedAccess () {
        return DedicatedCloud.getSecurityInformations($stateParams.productId).then((result) => {
            $scope.userAccessPolicy = result.userAccessPolicy;
            return result.userAccessPolicy === "FILTERED";
        });
    }

    function checkUser () {
        return loadUsers()
            .then((users) => {
                $scope.users = _.filter(users, { isTokenValidator: true });
                return _.find(users, { name: "admin" });
            })
            .then((adminUser) => {
                if (!adminUser) {
                    return false;
                }
                $scope.checks.userPhoneNumber = !!adminUser.phoneNumber;
                $scope.checks.userMail = !!adminUser.email;
                $scope.checks.userTokenValidator = !!adminUser.isTokenValidator;
                return !!adminUser.phoneNumber && !!adminUser.email && !!adminUser.isTokenValidator;
            })
            .then((result) => {
                $scope.checks.user = result;
                return result;
            })
            .finally(() => {
                $scope.loaders.checks.user = false;
                $scope.loaders.checks.userPhoneNumber = false;
                $scope.loaders.checks.userMail = false;
                $scope.loaders.checks.userTokenValidator = false;
            });
    }

    function loadUsers () {
        return DedicatedCloud.getUsers($stateParams.productId).then((ids) => $q.all(ids.map((id) => DedicatedCloud.getUserDetail($stateParams.productId, id))));
    }
});
