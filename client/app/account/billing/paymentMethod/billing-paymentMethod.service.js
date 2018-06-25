angular.module("Billing").service("paymentMethodHelper", ["$q", "Billing.constants", "OvhApiMe", class PaymentMethodHelper {

    constructor ($q, constants, OvhApiMe) {
        // Injections
        this.$q = $q;
        this.constants = constants;
        this.OvhApiMe = OvhApiMe;
    }

    /* ===============================================
    =            GET ALL PAYEMENT METHODS            =
    ================================================ */

    _getAvailablePaymentMethods (onlyValid) {
        return this.$q.all(_.map(this.constants.paymentMeans, (type) => this.getPaymentMethodsOfType(type, onlyValid))).then((paymentsOfType) => _.flatten(paymentsOfType));
    }

    _getAvailableUSPaymentMethods (onlyValid) {
        return this.OvhApiMe.PaymentMethod().v6().query(onlyValid ? {
            status: "VALID"
        } : {}).$promise.then((paymentMethodIds) => this.$q.all(_.map(paymentMethodIds, (paymentMethodId) => this.OvhApiMe.PaymentMethod().v6().get({
            id: paymentMethodId
        }).$promise)));
    }

    getAvailablePaymentMethods (onlyValid) {
        if (this.constants.target !== "US") {
            return this._getAvailablePaymentMethods(onlyValid);
        }
        return this._getAvailableUSPaymentMethods(onlyValid);
    }

    /**
     *  Forbidden for US
     */
    getPaymentMethodsOfType (type, onlyValid) {
        if (this.constants.target === "US") {
            return this.$q.reject({
                status: 403,
                message: "getPaymentMethodOfType is not available for US world part"
            });
        }

        const resource = this.OvhApiMe.PaymentMean()[_.capitalize(type)]().v6();

        return resource.query(type === "bankAccount" && onlyValid ? {
            state: "valid"
        } : {}).$promise.then((paymentMethodIds) => this.$q.all(_.map(paymentMethodIds, (paymentMethodId) => resource.get({
            id: paymentMethodId
        }).$promise)));
    }

    /* -----  End of GET ALL PAYEMENT METHODS  ------ */

    /* =============================================
    =            DEFAULT PAYMENT METHOD            =
    ============================================== */

    _hasDefaultPaymentMethod () {
        return this._getAvailablePaymentMethods(true).then((paymentMethods) => _.some(paymentMethods, {
            defaultPaymentMean: true
        }));
    }

    _hasUSDefaultPaymentMethod () {
        return this._getAvailableUSPaymentMethods(true).then((paymentMethods) => _.some(paymentMethods, {
            "default": true
        }));
    }

    hasDefaultPaymentMethod () {
        let promise;

        if (this.constants.target !== "US") {
            promise = this._hasDefaultPaymentMethod();
        } else {
            promise = this._hasUSDefaultPaymentMethod();
        }

        return promise;
    }

    /* -----  End of DEFAULT PAYMENT METHOD  ------ */

}]);


/**
 *  @deprecated
 *  Use PaymentMethodHelper service instead
 */
class PaymentMethodService {
    constructor ($q, OvhHttp) {
        this.$q = $q;
        this.OvhHttp = OvhHttp;
    }

    _getShema () {
        return this.OvhHttp.get("/me.json", {
            rootPath: "apiv6",
            cache: "cache_shema"
        });
    }

    _getAutomaticPaymentMeans () {
        return this.OvhHttp.get("/me/availableAutomaticPaymentMeans", {
            rootPath: "apiv6",
            cache: "cache_available_automatic_payment_means"
        });
    }

    getAvailablePaymentMethod () {
        return this._getShema().then((schema) => schema.models["billing.PaymentMethodPaymentTypeEnum"].enum);
    }

    _get () {
        return this.OvhHttp.get("/me/paymentMethod", {
            rootPath: "apiv6"
        }).then((ids) =>
            this.$q.all(
                ids.map((id) =>
                    this.OvhHttp.get(`/me/paymentMethod/${id}`, {
                        rootPath: "apiv6"
                    })
                )
            )
        );
    }

    get () {
        const STATUS_TO_HIDE_FROM_CLIENT = ["CANCELED_BY_CUSTOMER", "CANCELING"];
        const availablePaymentMethodPromise = this._get().then((data) => data.filter((paymentMethod) => STATUS_TO_HIDE_FROM_CLIENT.indexOf(paymentMethod.status) === -1));
        const automaticPaymentMeanPromise = this._getAutomaticPaymentMeans();
        return this.$q.all([availablePaymentMethodPromise, automaticPaymentMeanPromise]).then((values) => {
            const availablePaymentMethods = values[0];
            const automaticPaymentMeans = values[1];
            availablePaymentMethods.forEach((paymentMethod) => {
                paymentMethod.canBeSetAsDefault = automaticPaymentMeans[paymentMethod.paymentType] === true;
                paymentMethod.canBeDeleted = true;
            });
            return availablePaymentMethods;
        });
    }

    getValid () {
        return this.get().then((data) => data.filter((paymentMethod) => paymentMethod.status === "VALID"));
    }

    create (paymentMethod) {
        if (!paymentMethod || !paymentMethod.paymentType) {
            return this.$q.reject(new Error("Payment Method need a type"));
        }
        return this.OvhHttp.post("/me/paymentMethod", {
            data: _.pick(paymentMethod, ["default", "description", "paymentType", "urlCallback"]),
            rootPath: "apiv6"
        });
    }

    update (paymentMethod) {
        if (!paymentMethod || !paymentMethod.id) {
            return this.$q.reject(new Error("Payment Method need an id"));
        }
        return this.OvhHttp.put(`/me/paymentMethod/${paymentMethod.id}`, {
            data: _.pick(paymentMethod, ["default", "description"]),
            rootPath: "apiv6"
        });
    }

    remove (paymentMethod) {
        if (!paymentMethod || !paymentMethod.id) {
            return this.$q.reject(new Error("Payment Method need an id"));
        }
        return this.OvhHttp.delete(`/me/paymentMethod/${paymentMethod.id}`, {
            rootPath: "apiv6"
        });
    }
}

/**
 *  @deprecated
 *  Use PaymentMethodHelper service instead
 */
angular.module("Billing.services").service("BillingPaymentMethod", PaymentMethodService);
