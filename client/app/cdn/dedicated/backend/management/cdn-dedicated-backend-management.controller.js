angular.module("App").controller("CdnDedicatedBackendManagementCtrl", class CdnDedicatedBackendManagementCtrl {

    constructor ($q, OvhApiCdnDedicated) {
        this.$q = $q;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        this.OvhApiCdnDedicated.v6().swsGetAllBackends({
            serviceName: this.cdnService.serviceName
        }).$promise
    }

    /* -----  End of INITIALIZATION  ------ */

});
