angular.module("App").controller("CdnDomainCtrl", class CdnDomainCtrl {

    constructor ($scope, $stateParams, translator, CdnDomain) {
        // injections
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.translator = translator;
        this.CdnDomain = CdnDomain;

        // attributes used in view
        this.domain = null;
        this.loading = false;
    }

    $onInit () {
        this.loading = true;

        return this.CdnDomain.getSelected(this.$stateParams.productId, this.$stateParams.domain, true).then((result) => {
            this.domain = result;
            this.$scope.domain = result;
        }).catch((error) => {
            this.$scope.setMessage(this.translator.tr("cdn_domain_dashboard_loading_error"), error);
        }).finally(() => {
            this.loading = false;
        });
    }

});
