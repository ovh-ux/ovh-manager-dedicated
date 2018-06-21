(() => {
    "use strict";
    class ServiceExpirationDateComponentCtrl {
        constructor ($scope, $rootScope, constants) {
            $scope.tr = $rootScope.tr;
            $scope.i18n = $rootScope.i18n;
            this.constants = constants;
            this.inline = false;
        }

        $onInit () {
            const hasValidServiceInfos = !this.serviceInfos || angular.isObject(this.serviceInfos);
            const hasValidServiceName = _.isString(this.serviceName);
            if (!hasValidServiceInfos || !hasValidServiceName) {
                throw new Error("serviceExpirationDate: Missing parameter(s)");
            }
        }

        getRenewUrl () {
            return this.constants.target === "CA" ? this.getOrderUrl() : this.getAutoRenewUrl();
        }

        getOrderUrl () {
            return URI.expand(this.constants.renew, {
                serviceName: this.serviceName
            }).toString();
        }

        getAutoRenewUrl () {
            const url = `#/billing/autoRenew?searchText=${this.serviceName}`;
            if (_.isString(this.serviceType)) {
                return `${url}&selectedType=${this.serviceType}`;
            }
            return url;
        }

        getDate () {
            if (this.isAutoRenew()) {
                return moment(this.serviceInfos.expiration).add(1, "days").format();
            }
            return this.serviceInfos.expiration;
        }

        isAutoRenew () {
            return this.serviceInfos.renew && (this.serviceInfos.renew.automatic || this.serviceInfos.renew.forced);
        }
    }
    angular.module("directives").controller("ServiceExpirationDateComponentCtrl", ServiceExpirationDateComponentCtrl);
})();
