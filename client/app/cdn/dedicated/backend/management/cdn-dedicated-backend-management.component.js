angular.module("App").component("cdnDedicatedBackendManagement", {
    templateUrl: "cdn/dedicated/backend/management/cdn-dedicated-backend-management.html",
    controller: "CdnDedicatedBackendManagementCtrl",
    bindings: {
        cdnService: "<",
        ngModel: "=",
        loading: "=",
        onInitSuccess: "&?",
        onInitError: "&?"
    }
});
