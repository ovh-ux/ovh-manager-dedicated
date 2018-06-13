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
            update: false
        };

        this.model = {
            existingBackend: null,
            newBackend: null
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

    onDomainBackendUpdateFormSubmit () {
        if (this.backendUpdateForm.$invalid) {
            return false;
        } else if (this.cdnDedicated.backendLimit <= (this.availableBackends.length - 1)) {
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
            ip: this.model.existingBackend === "new" ? this.model.newBackend : this.model.existingBackend
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

        return this.$q.all({
            domainBackends: this._getDomainBackends(),
            allBackends: this.OvhApiCdnDedicated.v6().swsGetAllBackends({
                serviceName: this.$stateParams.productId
            }).$promise
        }).then((results) => {
            this.backend = _.get(_.first(results.domainBackends), "ip");
            this.availableBackends = _.map(results.allBackends.results, "ipv4").sort();
            this.availableBackends.unshift("new");

            // set models
            this.model.existingBackend = this.backend || "new";
        }).finally(() => {
            this.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */


});
