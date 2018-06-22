angular.module("App").controller("CdnDomainAddCtrl", class CdnDomainAddCtrl {

    constructor ($state, $stateParams, $translate, cdnDedicated, ouiMessageAlerter, OvhApiCdnDedicated, SidebarMenu) {
        // Injections
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.cdnDedicated = cdnDedicated; // from app.networks.cdn.dedicated state resolve
        this.ouiMessageAlerter = ouiMessageAlerter;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
        this.SidebarMenu = SidebarMenu;

        // Other attributes
        this.model = {
            domainName: null,
            backend: null
        };

        this.loading = {
            backend: false,
            save: false
        };

        this.backends = null;
    }

    /* =============================
    =            EVENTS            =
    ============================== */

    /* ----------  Backend Management Component Callbacks  ---------- */

    onBackendManagementInitSuccess (backendList) {
        this.backends = backendList;
    }

    onBackendManagementInitError (error) {
        this.$state.go("^");
        this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_add_load_error"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated");
    }

    /* ----------  Form submission  ---------- */

    cdnDedicatedDomainAddFormSubmit () {
        if (this.loading.backend || !this.cdnDedicatedDomainAddForm.$valid) {
            return false;
        } else if (this.cdnDedicated.backendLimit <= this.backends.length) {
            return this.$state.go("^");
        }

        /*
        if (this.backendUpdateForm.$invalid) {
            return false;
        } else if (this.cdnDedicated.backendLimit <= (this.availableBackends.length - 1)) {
            return this.closeModal();
        }
         */

        this.loading.save = true;

        return this.OvhApiCdnDedicated.Domains().v6().add({
            serviceName: this.$stateParams.productId
        }, {
            domain: this.model.domainName
        }).$promise.then(({ domain }) => this.OvhApiCdnDedicated.Domains().Backends().v6().add({
            serviceName: this.$stateParams.productId,
            domain
        }, {
            ip: this.model.backend
        }).$promise).then(() => {
            this.ouiMessageAlerter.success(this.$translate.instant("cdn_dedicated_domain_add_success", {
                t0: this.model.domainName,
                t1: this.model.backend
            }), "app.networks.cdn.dedicated");

            // update sidebar menu
            const cdnSideBarItem = this.SidebarMenu.getItemById(this.$stateParams.productId);
            if (cdnSideBarItem) {
                this.SidebarMenu.addMenuItem({
                    title: this.model.domainName,
                    state: "app.networks.cdn.dedicated.domain",
                    stateParams: {
                        productId: this.$stateParams.productId,
                        domain: this.model.domainName
                    }
                }, cdnSideBarItem);
            }
        }).catch((error) => {
            this.ouiMessageAlerter.error([this.$translate.instant("cdn_dedicated_domain_add_error"), _.get(error, "data.message")].join(" "), "app.networks.cdn.dedicated");
        }).finally(() => {
            this.loading.save = false;
            this.$state.go("^");
        });
    }

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.model.domainName = null;
        this.model.backend = null;
    }

    /* -----  End of INITIALIZATION  ------ */

});
