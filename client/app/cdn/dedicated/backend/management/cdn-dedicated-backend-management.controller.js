angular.module("App").controller("CdnDedicatedBackendManagementCtrl", class CdnDedicatedBackendManagementCtrl {

    constructor ($q, $state, $translate, $translatePartialLoader, OvhApiCdnDedicated, Validator) {
        // Injections
        this.$q = $q;
        this.$state = $state;
        this.$translate = $translate;
        this.$translatePartialLoader = $translatePartialLoader;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
        this.Validator = Validator;

        // Other attributes
        this.model = {
            existingBackend: null,
            newBackend: null
        };

        this.loaders = {
            translations: false
        };

        this.availableBackends = null;
    }

    onExistingBackendSelectChange () {
        this.model.newBackend = null;
        this.ngModel = this.model.existingBackend;
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    _loadModuleTranslations () {
        this.loaders.translations = true;
        this.$translatePartialLoader.addPart("cdn/dedicated/backend/management");
        return this.$translate.refresh().finally(() => {
            this.loaders.translations = false;
        });
    }

    $onInit () {
        this.loading = true;

        return this.$q.all({
            translations: this._loadModuleTranslations(),
            backends: this.OvhApiCdnDedicated.v6().swsGetAllBackends({
                serviceName: this.cdnService.service
            }).$promise
        }).then(({ backends }) => {
            this.availableBackends = _.map(backends.results, "ipv4").sort();
            this.availableBackends.unshift("new");

            // set models
            this.model.existingBackend = this.ngModel || "new";

            // init success callback
            if (this.onInitSuccess && _.isFunction(this.onInitSuccess())) {
                this.onInitSuccess()(_.map(backends.results, "ipv4").sort());
            }
        }).catch((error) => {
            // init error callback
            if (this.onInitError && _.isFunction(this.onInitError())) {
                this.onInitError()(error);
            }
        }).finally(() => {
            this.loading = false;
        });
    }

    /* -----  End of INITIALIZATION  ------ */

});
