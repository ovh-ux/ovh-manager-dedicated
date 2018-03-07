class PaymentInformationBridge {
    constructor ($q, $rootScope, Constants, BillingMean, BillingPaymentMethod) {
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.Constants = Constants;
        this.PaymentMean = BillingMean;
        this.PaymentMethod = BillingPaymentMethod;
        this.BillingPaymentMethod = BillingPaymentMethod;

        if (this.Constants.target === "US") {
            this._initPaymentMethod();
        } else {
            this._initPaymentMeans();
        }

        this.events = {
            PAYMENT_MEAN_CHANGED: "billing.paymentMean.changed"
        };
    }

    _initPaymentMethod () {
        this.getValidBankAccounts = () => this.PaymentMethod.getValid((data) => data.filter((paymentMethod) => paymentMethod.paymentType === "bankAccount"));
        this.hasDefaultPaymentMean = () => this.PaymentMethod.getValid((data) => data.filter((paymentMethod) => paymentMethod.default === true)).then((paymentMethods) => paymentMethods && paymentMethods > 0);
        this.hasDefaultPaymentMean = () => this.PaymentMethod.getValid().then((result) => result && result.length > 0);

        this.getDetailedPaymentMeans = () =>
            this.PaymentMethod.get()
                .then((paymentMethods) =>
                    paymentMethods.map((payment) => ({
                        number: payment.publicLabel,
                        defaultPaymentMean: payment.default,
                        description: payment.description,
                        state: payment.status.toLowerCase(),
                        id: payment.id,
                        type: payment.paymentType,
                        subtype: payment.paymentSubType,
                        expirationDate: null, // not available
                        threeDsValidated: null, // not available
                        getIcon () {
                            return this.subtype ? _.camelCase(this.subtype).toLowerCase() : _.camelCase(this.type).toLowerCase();
                        }
                    }))
                )
                .then((paymentMethods) => ({
                    creditCards: paymentMethods.filter((data) => data.type === "CREDIT_CARD"),
                    deferredPaymentAccounts: paymentMethods.filter((data) => data.type === "deferredPaymentAccount" || data.type === "INTERNAL_TRUSTED_ACCOUNT")
                }));

        this.setAsDefaultPaymentMean = (mean) => this.PaymentMethod.update({ id: mean.id, "default": true });

        this.isApiSchemaLoaded = () => true;

        this.updatePaymentMean = (data) =>
            this.PaymentMethod.update({
                id: data.mean.id,
                description: data.description
            });

        this.deletePaymentMean = (id) => this.PaymentMethod.remove({ id }).then(() => this.$rootScope.$broadcast(this.events.PAYMENT_MEAN_CHANGED));

        this.isCreditWithExpiration = false;
        this.isCreditWithThreeDsValidation = false;
    }

    _initPaymentMeans () {
        this.getValidBankAccounts = () => this.PaymentMean.getValidBankAccounts();
        this.hasDefaultPaymentMean = () =>
            this.PaymentMean.getDetailedPaymentMeans().then(
                (paymentMeans) =>
                    _.chain(paymentMeans)
                        .values()
                        .flatten()
                        .find({ defaultPaymentMean: true, state: "valid" })
                        .value() !== undefined
            );
        this.hasDefaultPaymentMean = () => this.PaymentMean.getValidPaymentMeansIds().then((result) => result && result.length > 0);

        this.getDetailedPaymentMeans = () => this.PaymentMean.getDetailedPaymentMeans();

        this.setAsDefaultPaymentMean = (mean, type) => this.PaymentMean.setAsDefaultPaymentMean(mean, type);

        this.isApiSchemaLoaded = () => this.PaymentMean.isApiSchemaLoaded();

        this.updatePaymentMean = (data) => this.PaymentMean.updatePaymentMean(data);

        function getCamelizedPaymentType (paymentType) {
            return angular.uppercase(paymentType[0]) + paymentType.substring(1);
        }

        this.deletePaymentMean = (id, paymentType) =>
            this.PaymentMean[`delete${getCamelizedPaymentType(paymentType)}`]("/{id}", {
                urlParams: {
                    id
                }
            }).then(() => this.$rootScope.$emit(this.events.PAYMENT_MEAN_CHANGED));

        this.isCreditWithExpiration = true;
        this.isCreditWithThreeDsValidation = true;
    }
}

angular.module("Billing.services").service("BillingPaymentInformation", ["$q", "$rootScope", "constants", "BillingMean", "BillingPaymentMethod", PaymentInformationBridge]);
