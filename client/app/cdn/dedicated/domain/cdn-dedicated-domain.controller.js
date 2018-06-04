angular.module("App").controller("CdnDomainCtrl", class CdnDomainCtrl {

    constructor ($state, cdnDomain) {
        // injections
        this.$state = $state;
        this.cdnDomain = cdnDomain; // from app.networks.cdn.dedicated.domain state resolve
    }

});
