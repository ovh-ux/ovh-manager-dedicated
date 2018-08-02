/**
 * @ngdoc controller
 * @name Billing.controllers.Method.Add
 * @description
 */
angular.module("Billing.controllers").controller("Billing.controllers.AutoRenew.update", [
    "$rootScope",
    "$scope",
    "$q",
    "$translate",
    "BillingAutoRenew",
    "Alerter",
    "AUTORENEW_EVENT",
    "UserContractService",
    function ($rootScope, $scope, $q, $translate, AutoRenew, Alerter, AUTORENEW_EVENT, UserContractService) {
        "use strict";

        $scope.selectedServices = $scope.currentActionData.services;
        $scope.nicRenew = $scope.currentActionData.nicRenew;
        $scope.urlRenew = $scope.currentActionData.urlRenew;
        $scope.agree = {};

        $scope.loading = {
            contracts: false
        };

        angular.forEach($scope.selectedServices, (service) => {
            if (service.renew.automatic) {
                service.newRenewType = "auto";
                service.oldRenewType = "auto";
                service.newRenewPeriod = service.renew.period;
            } else if (service.renew.forced) {
                service.newRenewType = "auto";
                service.oldRenewType = "auto";
                if (service.possibleRenewPeriod.length === 1) {
                    service.newRenewPeriod = service.possibleRenewPeriod[0];
                }
            } else {
                service.newRenewType = "manuel";
                service.oldRenewType = "manuel";
                if (service.possibleRenewPeriod.length === 1) {
                    service.newRenewPeriod = service.possibleRenewPeriod[0];
                }
            }
        });
        $scope.hasChanged = false;

        $scope.loadContracts = () => {
            $scope.contracts = [];

            if (hasServiceChangedToAutorenew()) {
                $scope.loading.contracts = true;

                return UserContractService.getAgreementsToValidate((contract) => AutoRenew.getAutorenewContractIds().includes(contract.contractId))
                    .then(
                        (contracts) =>
                            ($scope.contracts = contracts.map((a) => ({
                                name: a.code,
                                url: a.pdf,
                                id: a.id
                            })))
                    )
                    .catch((err) => {
                        Alerter.set("alert-danger", $translate.instant("autorenew_service_update_step2_error"));
                        return $q.reject(err);
                    })
                    .finally(() => {
                        $scope.loading.contracts = false;
                        if ($scope.contracts.length === 0) {
                            $scope.agree.value = true;
                        }
                    });
            }
            $scope.agree.value = true;
            return null;
        };

        function hasServiceChangedToAutorenew () {
            return $scope.selectedServices.some((s) => !s.renew.automatic && s.newRenewType === "auto");
        }

        $scope.updateRenew = function () {
            const result = [];
            angular.forEach($scope.selectedServices, (service) => {
                if ($scope.hasChange(service)) {
                    const hasSubProducts = !_.isEmpty(service.subProducts);
                    const isRenewManual = service.newRenewType === "manuel";
                    const renewPeriod = isRenewManual ? null : service.newRenewPeriod;

                    if (hasSubProducts) {
                        angular.forEach(service.subProducts, (pService) => {
                            pService.renew.period = renewPeriod;
                            pService.renew.manualPayment = isRenewManual;
                            result.push(_.pick(pService, ["serviceId", "serviceType", "renew"]));
                        });
                    } else {
                        service.renew.period = renewPeriod;
                        service.renew.manualPayment = isRenewManual;
                        result.push(_.pick(service, ["serviceId", "serviceType", "renew"]));
                    }
                }
            });

            let promise = UserContractService.acceptAgreements($scope.contracts)
                .then(() => AutoRenew.updateServices(result))
                .then(() => {
                    $scope.$emit(AUTORENEW_EVENT.MODIFY, result);
                    Alerter.set("alert-success", $translate.instant("autorenew_service_update_step2_success"));
                })
                .catch((err) => {
                    Alerter.alertFromSWS($translate.instant("autorenew_service_update_step2_error"), err);
                    return $q.reject(err);
                });

            /**
             *  turns on global autorenew when user activates a service
             */
            if (_.some(result, "renew.automatic")) {
                promise = promise.then(() =>
                    AutoRenew.getAutorenew().then(({ active, renewDay }) => {
                        if (active) {
                            return $q.when();
                        }

                        return AutoRenew.putAutorenew({
                            active: true,
                            renewDay: renewDay > 0 && renewDay <= 30 ? renewDay : 1
                        })
                            .then(() => {
                                Alerter.set("alert-success", $translate.instant("autorenew_service_update_renewal_activation_notice"));
                            })
                            .catch((err) => {
                                Alerter.set("alert-danger", $translate.instant("autorenew_service_update_renewal_activation_error", {
                                    t0: err
                                }));
                                return $q.reject(err);
                            });
                    })
                );
            }

            promise.finally(() => $scope.closeAction());
        };

        $scope.onChange = function () {
            $scope.hasChanged = false;
            angular.forEach($scope.selectedServices, (service) => {
                if (service.renew.automatic || service.renew.forced) {
                    if (service.newRenewType === "manuel" || service.renew.period !== service.newRenewPeriod) {
                        $scope.hasChanged = true;
                    }
                } else if (!(service.renew.automatic || service.renew.forced) && service.newRenewType === "auto") {
                    $scope.hasChanged = true;
                    if (!service.newRenewPeriod && _.isArray(service.possibleRenewPeriod) && !_.isEmpty(service.possibleRenewPeriod)) {
                        service.newRenewPeriod = service.renew.period || service.possibleRenewPeriod[0];
                    }
                }
            });
        };

        $scope.hasChange = function (service) {
            if (service.renew.automatic && service.newRenewType === "manuel") {
                return true;
            }

            if (service.renew.automatic && service.newRenewPeriod !== service.renew.period) {
                return true;
            }

            if (!service.renew.automatic && service.newRenewType === "auto") {
                return true;
            }

            return false;
        };

        $scope.getPeriodTranslation = function (period) {
            let message = "";
            switch (period) {
            case 0:
                message = $translate.instant("autorenew_service_renew_manuel");
                break;
            case 12:
                message = $translate.instant("autorenew_service_update_period_12");
                break;
            default:
                message = $translate.instant("autorenew_service_update_period_month", {
                    t0: period
                });
            }
            return message;
        };

        $scope.closeAction = function () {
            $rootScope.$broadcast(AutoRenew.events.AUTORENEW_CHANGED);
            $scope.resetAction();
        };
    }
]);
