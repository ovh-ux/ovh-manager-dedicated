angular.module("Billing.controllers").controller("Billing.controllers.Mean", [
    "$scope",
    "$q",
    "$log",
    "$translate",
    "BILLING_BASE_URL",
    "Billing.constants",
    "BillingPaymentInformation",
    "BillingUser",
    "User",
    "Alerter",
    "PAYMENT_EVENT",
    function ($scope, $q, $log, $translate, baseUrl, BILLING_CONSTANTS, Mean, User, UserApp, Alerter, PAYMENT_EVENT) {
        "use strict";

        const PAYMENT_TYPES = BILLING_CONSTANTS.paymentMeans;

        /**
         * PROPERTIES
         */

        $scope.loading = {
            init: true,
            means: true
        };
        $scope.paymentsMean = {};
        $scope.canAddPaymentMeans = false;
        $scope.baseUrl = baseUrl;

        /**
         * METHODS
         */

        $scope.getPaymentMeans = function () {
            $scope.loading.means = true;

            return Mean.getDetailedPaymentMeans()
                .then((paymentMeans) => {
                    // Filter out bankAccounts blocked by incidents.
                    _.remove(paymentMeans.bankAccounts, { state: "blockedForIncidents" });
                    $scope.paymentsMean = paymentMeans;

                    return $scope.paymentsMean;
                })
                .catch((err) => {
                    $log.error(err);
                    Alerter.alertFromSWS($translate.instant("billingError"), err);
                    $scope.paymentsMean = [];
                })
                .finally(() => {
                    $scope.loading.means = false;
                });
        };

        $scope.setAsDefaultPaymentMean = function (mean, type) {
            return Mean.setAsDefaultPaymentMean(mean, type)
                .then(() => {
                    getAllPaymentMeans().forEach((element) => {
                        if (element.id !== mean.id) {
                            element.defaultPaymentMean = false;
                        }
                    });
                })
                .catch((err) => {
                    mean.defaultPaymentMean = false;
                    Alerter.alertFromSWS($translate.instant("payment_mean_default_mean_error"), err);
                    return $q.reject(err);
                });
        };

        $scope.hasMean = function (mean) {
            if (mean) {
                return _.values(mean).length > 0;
            }

            return _.sum(PAYMENT_TYPES.map((type) => `${type}s`), (paymentType) => {
                if (!Array.isArray($scope.paymentsMean[paymentType])) {
                    return 0;
                }
                return $scope.paymentsMean[paymentType].length;
            });
        };

        $scope.isCreditWithExpiration = function () {
            return Mean.isCreditWithExpiration;
        };

        $scope.isCreditWithThreeDsValidation = function () {
            return Mean.isCreditWithThreeDsValidation;
        };

        $scope.updateMean = function (type, mean, description) {
            $scope.loading.means = true;
            Mean.updatePaymentMean({
                type,
                mean,
                description
            })
                .then(() => {
                    mean.description = description;
                })
                .catch((err) => {
                    Alerter.alertFromSWS($translate.instant("payment_mean_description_error"), err);
                })
                .finally(() => {
                    $scope.loading.means = false;
                });
        };

        $scope.resetAction = () => {
            $scope.$parent.resetAction();
            $scope.getPaymentMeans();
        };

        $scope.$on(Mean.events.PAYMENT_MEAN_CHANGED, () => {
            $scope.getPaymentMeans();
        });

        /**
         * HELPERS / UTILITIES
         */
        function warnAboutBankAccountsPendingValidation (paymentMeans) {
            if (!paymentMeans || !angular.isArray(paymentMeans.bankAccounts)) {
                return;
            }

            const bankAccountsPendingValidation = _.filter(paymentMeans.bankAccounts, (bankAccount) => bankAccount.state === "pendingValidation" && !!bankAccount.validationDocumentLink);

            if (bankAccountsPendingValidation.length > 0) {
                const warningMessage = [$translate.instant("paymentType_bankAccount_pending_validation"), $translate.instant("paymentType_bankAccount_processing_delay")].join(" ");
                Alerter.alertFromSWS(warningMessage);
            }
        }

        function getAllPaymentMeans () {
            return _.chain($scope.paymentsMean)
                .values()
                .flatten()
                .value();
        }

        /**
         * INITIALISATION
         */

        function init () {
            const paymentMeansPromise = $scope.getPaymentMeans().then(warnAboutBankAccountsPendingValidation);

            const availableMeansPromise = User.getAvailableMeans().then((means) => {
                if (means && means.length > 0) {
                    $scope.canAddPaymentMeans = true;
                }
            });

            const guidePromise = UserApp.getUrlOf("guides").then((guides) => {
                if (guides && guides.autoRenew) {
                    $scope.guide = guides.autoRenew;
                }
            });

            $q.all([paymentMeansPromise, availableMeansPromise, guidePromise]).then(() => {
                $scope.$emit(PAYMENT_EVENT.PAYMENT_MEANS_DISPLAYED, {
                    count: getAllPaymentMeans().length
                });
                $scope.loading.init = false;
            });
        }

        init();
    }
]);
