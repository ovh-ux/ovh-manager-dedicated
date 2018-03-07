angular.module("Billing.controllers").controller("EmailTerminateCtrl", [
    "$scope",
    "BillingAutoRenew",
    "Alerter",
    "AUTORENEW_EVENT",
    function ($scope, AutoRenew, Alerter, AUTORENEW_EVENT) {
        "use strict";

        $scope.email = $scope.currentActionData[0];
        $scope.loaders = {
            loading: true
        };

        AutoRenew.getEmailInfos($scope.email.serviceId)
            .then((emailInfos) => {
                $scope.emailInfos = emailInfos;
                $scope.canTerminate = emailInfos.offer.indexOf("hosting") === -1;
            })
            .catch(() => {
                Alerter.success($scope.tr("autorenew_service_EMAIL_DOMAIN_terminate_success"));
                $scope.resetAction();
            })
            .finally(() => ($scope.loaders.loading = false));

        $scope.terminate = () => {
            $scope.loaders.loading = true;
            AutoRenew.terminateEmail($scope.email.serviceId)
                .then(
                    () => {
                        $scope.$emit(AUTORENEW_EVENT.TERMINATE, {
                            serviceType: "EMAIL_DOMAIN",
                            serviceId: $scope.email.serviceId
                        });

                        Alerter.success($scope.tr("autorenew_service_EMAIL_DOMAIN_terminate_success"));
                    },
                    (err) => {
                        Alerter.alertFromSWS($scope.tr("autorenew_service_EMAIL_DOMAIN_terminate_error"), err);
                    }
                )
                .finally(() => {
                    $scope.loaders.loading = false;
                    $scope.resetAction();
                });
        };
    }
]);
