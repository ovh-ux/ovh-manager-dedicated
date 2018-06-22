angular.module("App").controller("CdnDomainBackendUpdateCtrl", class CdnDomainBackendUpdateCtrl {

    constructor ($q, $state, $stateParams, $translate, cdnDedicated, cdnDomain, ouiMessageAlerter, OvhApiCdnDedicated, Validator) {
        // Injector
        this.$q = $q;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.cdnDedicated = cdnDedicated;
        this.cdnDomain = cdnDomain;
        this.ouiMessageAlerter = ouiMessageAlerter;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
        this.Validator = Validator;

        // Other attributes used in view
        this.loading = {
            init: false,
            update: false,
            backend: false
        };

        this.model = {
            backend: null
        };

        this.backend = null;
        this.availableBackends = null;
    }

    /* ==============================
    =            HELPERS            =
    =============================== */

    closeModal (reload) {
        return this.$state.go("app.networks.cdn.dedicated.domain", {}, {
            reload: reload || false
        });
    }

    /* -----  End of HELPERS  ------ */


    /* =============================
    =            EVENTS            =
    ============================== */

    /* ----------  Backend management component callbacks  ---------- */

    onBackendManagementInitSuccess (backendList) {
        this.availableBackends = backendList;
    }

    onBackendManagementInitError (error) {
        this.$state.go("^");
        this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_backend_load_fail"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.domain");
    }

    /* ----------  Form submission  ---------- */

    onDomainBackendUpdateFormSubmit () {
        if (this.backendUpdateForm.$invalid) {
            return false;
        } else if (this.cdnDedicated.backendLimit <= this.availableBackends.length) {
            return this.closeModal();
        }

        this.loading.update = true;

        let deletePromise = this.$q.when(true);

        if (this.backend) {
            deletePromise = this.OvhApiCdnDedicated.Domains().Backends().v6().remove({
                serviceName: this.$stateParams.productId,
                domain: this.$stateParams.domain,
                ip: this.backend
            }).$promise;
        }

        return deletePromise.then(() => this.OvhApiCdnDedicated.Domains().Backends().v6().add({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }, {
            ip: this.model.backend
        }).$promise).then(() => {
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_domain_backend_update_success", {
                t0: this.cdnDomain.domain
            }), "app.networks.cdn.dedicated.domain");

            this.closeModal(true);
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_backend_update_fail", {
                t0: this.cdnDomain.domain
            }), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated.domain");

            this.closeModal();
        }).finally(() => {
            this.loading.update = false;
        });
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    _getDomainBackends () {
        return this.OvhApiCdnDedicated.Domains().Backends().v6().query({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain
        }).$promise.then((backendIps) => {
            const backendIpPromises = [];

            backendIps.forEach((backendIp) => {
                backendIpPromises.push(this.OvhApiCdnDedicated.Domains().Backends().v6().get({
                    serviceName: this.$stateParams.productId,
                    domain: this.$stateParams.domain,
                    ip: backendIp
                }).$promise);
            });

            return this.$q.all(backendIpPromises);
        });
    }

    $onInit () {
        this.loading.init = true;

        return this._getDomainBackends().then((domainBackends) => {
            this.backend = _.get(_.first(domainBackends), "ip");
            this.model.backend = this.backend;
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */


});
