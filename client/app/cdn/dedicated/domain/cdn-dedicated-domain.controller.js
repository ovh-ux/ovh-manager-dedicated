angular.module("App").controller("CdnDomainCtrl", class CdnDomainCtrl {

    constructor (cdnDomain) {
        // injections
        this.cdnDomain = cdnDomain; // from app.networks.cdn.dedicated.domain state resolve
    }

});
