class LicenseAgoraOrder {
    constructor ($q, Alerter, constants, OvhHttp, User, translator) {
        this.$q = $q;
        this.Alerter = Alerter;
        this.constants = constants;
        this.OvhHttp = OvhHttp;
        this.User = User;
        this.translator = translator;

        this.licenseTypeToCatalog = {
            CLOUDLINUX: "licenseCloudLinux",
            CPANEL: "licensecPanel",
            DIRECTADMIN: "licenseDirectadmin",
            PLESK: "licensePlesk",
            SQLSERVER: "licenseSqlServer",
            VIRTUOZZO: "licenseVirtuozzo",
            WINDOWS: "licenseWindows",
            WORKLIGHT: "licenseWorklight"
        };
    }

    getLicenseOffers (licenseType) {
        return this.OvhHttp.get("/order/catalog/formatted/{catalogName}", {
            rootPath: "apiv6",
            urlParams: {
                catalogName: this.licenseTypeToCatalog[licenseType]
            },
            params: {
                ovhSubsidiary: this.constants.target
            }
        }).then((data) => data.plans);
    }

    getLicenseOfferPlan (licenseType, planCode) {
        return this.getLicenseOffers(licenseType).then((plans) => {
            const plan = _.assign({}, _.find(plans, (planItem) => planItem.planCode === planCode));
            plan.getPrice = (
                config = {
                    options: [],
                    duration: 1
                }
            ) => {
                config.planCode = planCode;
                return this.getPlanPrice(config);
            };
            return plan;
        });
    }

    getPlanPrice (config) {
        let cartId = "";

        return this.OvhHttp.post("/order/cart", { rootPath: "apiv6", data: { ovhSubsidiary: this.constants.target } })
            .then((data) => {
                cartId = data.cartId;
                return this.OvhHttp.post("/order/cart/{cartId}/assign", { rootPath: "apiv6", urlParams: { cartId } });
            })
            .then(() => this.pushAgoraPlan({ cartId, config }))
            .then((response) =>
                this.$q.all(
                    _.map(config.options, (option) =>
                        this.pushAgoraPlan({
                            cartId,
                            config: _.assign({}, config, { planCode: option, options: [], itemId: response.itemId }),
                            path: `/order/cart/{cartId}/${this.licenseTypeToCatalog[config.licenseType]}/options`,
                            urlParams: { cartId }
                        })
                    )
                )
            )
            .then(() => this.OvhHttp.get("/order/cart/{cartId}/checkout", { rootPath: "apiv6", urlParams: { cartId } }))
            .finally(() => this.OvhHttp.delete("/order/cart/{cartId}", { rootPath: "apiv6", urlParams: { cartId } }));
    }

    pushAgoraPlan (params) {
        params.path = params.path || "/order/cart/{cartId}/{productId}";
        params.urlParams = params.urlParams || {
            cartId: params.cartId,
            productId: this.licenseTypeToCatalog[params.config.licenseType]
        };

        const payload = {
            rootPath: "apiv6",
            urlParams: params.urlParams,
            data: {
                duration: `P${params.config.duration}M`,
                planCode: params.config.planCode,
                pricingMode: "default",
                quantity: 1
            }
        };

        if (params.config.itemId) {
            payload.data.itemId = params.config.itemId;
        }

        return this.OvhHttp.post(params.path, payload);
    }

    getFinalizeOrderUrl (licenseInfo) {
        const productToOrder = this.getExpressOrderData(licenseInfo);
        return this.User.getUrlOf("express_order")
            .then((url) => `${url}review?products=${JSURL.stringify([productToOrder])}`)
            .catch((err) => {
                this.Alerter.error(this.translator.tr("ip_order_finish_error"));
                return this.$q.reject(err);
            });
    }

    getExpressOrderData (licenseInfo) {
        const options = [];
        _.forEach(_.keys(licenseInfo.options), (key) => {
            if (_.get(licenseInfo.options[key], "value")) {
                options.push({
                    planCode: licenseInfo.options[key].value,
                    duration: `P${licenseInfo.duration}M`,
                    pricingMode: "default",
                    quantity: 1
                });
            }
        });

        const productToOrder = {
            planCode: licenseInfo.version,
            productId: this.licenseTypeToCatalog[licenseInfo.licenseType],
            duration: `P${licenseInfo.duration}M`,
            pricingMode: "default",
            quantity: licenseInfo.quantity || 1,
            configuration: [
                {
                    label: "ip",
                    value: licenseInfo.ip
                }
            ]
        };

        if (options.length) {
            productToOrder.option = options;
        }

        return productToOrder;
    }
}

angular.module("Module.license.services").service("LicenseAgoraOrder", LicenseAgoraOrder);
