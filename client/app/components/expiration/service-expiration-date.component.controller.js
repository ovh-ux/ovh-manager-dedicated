(() => {
    "use strict";
    class ServiceExpirationDateComponentCtrl {
        constructor ($attrs, $scope, $rootScope, constants) {
            $scope.tr = $rootScope.tr;
            $scope.i18n = $rootScope.i18n;
            this.$attrs = $attrs;
            this.constants = constants;
            this.inline = false;
            this.useUiKit = false;
        }

        $onInit () {
            const hasValidServiceInfos = !this.serviceInfos || angular.isObject(this.serviceInfos);
            const hasValidServiceName = _.isString(this.serviceName);
            if (!hasValidServiceInfos || !hasValidServiceName) {
                throw new Error("serviceExpirationDate: Missing parameter(s)");
            }

            if (angular.isDefined(this.$attrs.useUiKit) && this.$attrs.useUiKit === "") {
                this.useUiKit = true;
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

        isAutoRenew () {
            return this.serviceInfos.renew && (this.serviceInfos.renew.automatic || this.serviceInfos.renew.forced);
        }
    }
    angular.module("directives").controller("ServiceExpirationDateComponentCtrl", ServiceExpirationDateComponentCtrl);
})();
