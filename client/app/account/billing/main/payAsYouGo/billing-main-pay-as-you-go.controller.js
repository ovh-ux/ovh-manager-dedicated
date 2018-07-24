angular.module("App").controller("BillingMainPayAsYouGoCtrl", class BillingMainPayAsYouGoCtrl {

    constructor ($q, $translate, Alerter, OvhApiAuth, OvhApiMe, OvhApiServices, ServicesHelper) {
        // injections
        this.$q = $q;
        this.$translate = $translate;
        this.Alerter = Alerter;
        this.OvhApiAuth = OvhApiAuth;
        this.OvhApiMe = OvhApiMe;
        this.OvhApiServices = OvhApiServices;
        this.ServicesHelper = ServicesHelper;

        // other attributes
        this.loading = {
            init: false
        };

        this.consumptions = null;
        this.time = null;
    }

    static getConsumptionElementType (planCode) {
        if (planCode.indexOf("snapshot") > -1) {
            return "snapshot";
        } else if (planCode.indexOf("volume") > -1) {
            return "volume";
        }

        return "instance";
    }

    static calculateElementForecast (consumptionElement, expirationDate, time) {
        const days = moment.unix(time).diff(moment(expirationDate).subtract(1, "month"), "days");
        const daysToExpiration = moment(expirationDate).diff(moment.unix(time), "days");
        const forecast = days > 0 ? ((consumptionElement.price.value / days) * daysToExpiration) + consumptionElement.price.value : Number.parseFloat(0) + consumptionElement.price.value;

        return {
            currencyCode: consumptionElement.price.currencyCode,
            value: forecast,
            text: consumptionElement.price.text.replace(/\d+(?:[.,]\d+)?/, forecast.toFixed(2))
        };
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    /**
     *  This is done for pci projects only. Good luck to implement the rest :-)
     *  More seriously, the major part of the code will be removed when other service types will be taken in consideration.
     */
    $onInit () {
        this.loading.init = true;

        return this.$q.all({
            consumptions: this.OvhApiMe.v6().consumption().$promise,
            services: this.OvhApiServices.v6().query().$promise,
            time: this.OvhApiAuth.v6().time()
        }).then(({ consumptions, services, time }) => {
            this.time = time.value;

            const projectPromises = _.map(consumptions, (consumption) => {
                const associatedService = _.find(services, {
                    serviceId: consumption.serviceId
                });

                return this.ServicesHelper.getServiceDetails(associatedService).then((details) => {
                    associatedService.details = details;
                    consumption.service = associatedService;
                });
            });

            return this.$q.all(projectPromises).then(() => consumptions);
        }).then((consumptions) => {
            this.consumptions = _.flatten(_.map(consumptions, (consumption) => {
                const consumptionProjectUrl = this.ServicesHelper.getServiceManageUrl(consumption.service);

                return _.map(consumption.elements, (consumptionElement) => ({
                    project: {
                        name: consumption.service.details.description || consumption.service.details.project_id,
                        url: consumptionProjectUrl
                    },
                    resource: consumptionElement.planCode,
                    type: BillingMainPayAsYouGoCtrl.getConsumptionElementType(consumptionElement.planCode),
                    dueDate: consumption.service.billing.nextBillingDate,
                    current: consumptionElement.price,
                    forecast: BillingMainPayAsYouGoCtrl.calculateElementForecast(consumptionElement, consumption.service.billing.nextBillingDate, this.time)
                }));
            }));
        }).catch((error) => {
            this.Alerter.error([
                this.$translate.instant("billing_main_pay_as_you_go_load_error"),
                _.get(error, "data.message")
            ].join(" "), "billing_main_alert");
        })
            .finally(() => {
                this.loading.init = false;
            });
    }

    /* -----  End of INITIALIZATION  ------ */

});
