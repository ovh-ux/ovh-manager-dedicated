angular.module("App").service("ServicesHelper", class ServicesHelper {

    constructor ($http, constants, SERVICES_TARGET_URLS) {
        this.$http = $http;
        this.constants = constants;
        this.SERVICES_TARGET_URLS = SERVICES_TARGET_URLS;
    }

    getServiceDetails (service) {
        return this.$http.get(_.get(service, "route.url")).then(({ data }) => data);
    }

    getServiceManageUrl (service) {
        const target = _.get(this.SERVICES_TARGET_URLS, _.get(service, "route.path"));
        const basePath = _.get(this.constants.MANAGER_URLS, target.univers);

        return `${basePath}#${target.url.replace("{serviceName}", _.get(service, "resource.name"))}`;
    }

    getServiceType (service) {
        return _.get(this.SERVICES_TARGET_URLS, `${_.get(service, "route.path")}.type`);
    }

});
