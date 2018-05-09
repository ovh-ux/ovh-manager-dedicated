class PaymentMethodCtrl {
    constructor ($log, $q, $scope, Alerter, BillingPaymentMethod, User, PAYMENT_EVENT) {
        this.$q = $q;
        this.$log = $log;
        this.$scope = $scope;
        this.Alerter = Alerter;
        this.BillingPaymentMethod = BillingPaymentMethod;
        this.User = User;
        this.PAYMENT_EVENT = PAYMENT_EVENT;
        this.init();
    }

    removePaymentMethod (paymentMethod) {
        this.BillingPaymentMethod.remove(paymentMethod)
            .then(() => {
                this._refreshPaymentMethodList().catch((error) => {
                    this.Alerter.alertFromSWS(this.$translate.instant("payment_mean_loading_error"), error.message);
                });
            })
            .catch((error) => {
                this.Alerter.alertFromSWS(this.$translate.instant("paymentType_delete_error"), error.message);
                this.$q.reject(error);
            });
    }

    setAsDefaultPaymentMethod (paymentMethod) {
        if (paymentMethod.canBeSetAsDefault) {
            const requestedPaymentMethod = {
                id: paymentMethod.id,
                "default": true
            };
            this.BillingPaymentMethod.update(requestedPaymentMethod)
                .then((modifiedPaymentMethod) => {
                    if (modifiedPaymentMethod.default) {
                        paymentMethod.default = true;
                        this.$scope.paymentMethods.forEach((element) => {
                            if (element.id !== modifiedPaymentMethod.id) {
                                element.default = false;
                            }
                        });
                    }
                })
                .catch((error) => {
                    this.Alerter.alertFromSWS(this.$translate.instant("paymentType_modify_error"), error.message);
                    this.$q.reject(error);
                });
        }
    }

    _refreshPaymentMethodList () {
        this.$scope.loading.paymentMethodList = true;
        return this.BillingPaymentMethod.get()
            .then((paymentMethods) => {
                this.$scope.paymentMethods = paymentMethods;
            })
            .finally(() => {
                this.$scope.loading.paymentMethodList = false;
            });
    }

    init () {
        this.canAddPaymentMeans = false;
        this.$scope.loading = {
            init: true
        };

        const guidePromise = this.User.getUrlOf("guides").then((guides) => {
            if (guides && guides.autoRenew) {
                this.$scope.guide = guides.autoRenew;
            }
        });

        const paymentMethodListPromise = this._refreshPaymentMethodList();

        this.$q
            .all([guidePromise, paymentMethodListPromise])
            .then(() => {
                this.$scope.$emit(this.PAYMENT_EVENT.PAYMENT_MEANS_DISPLAYED, {
                    count: this.$scope.paymentMethods.length
                });
            })
            .catch((error) => {
                this.Alerter.alertFromSWS(this.$translate.instant("payment_mean_loading_error"), error.message);
                this.$log.error(error);
            })
            .finally(() => {
                this.$scope.loading.init = false;
            });
    }
}

angular.module("Billing.controllers").controller("Billing.controllers.PaymentMethod", PaymentMethodCtrl);
