angular.module("App").controller("ErrorCtrl", class ErrorCtrl {

    constructor ($rootScope, $stateParams) {
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
    }

    $onInit () {
        this.$rootScope.managerPreloadHide += " manager-preload-hide";
        this.error = this.$stateParams.error;
    }

});
