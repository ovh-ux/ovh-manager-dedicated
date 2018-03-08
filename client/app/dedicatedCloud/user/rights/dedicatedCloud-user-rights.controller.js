angular.module("App").controller("DedicatedCloudUserRightsCtrl", function ($scope, $stateParams, DedicatedCloud) {
    "use strict";

    const self = this;

    self.selectedUser = null;
    self.rights = null;

    self.loading = {
        init: false,
        rights: false
    };

    /* =====================================
    =            RIGHTS LOADING            =
    ====================================== */

    self.loadUserRight = function (elementsByPage, elementsToSkip) {
        self.loading.rights = true;

        DedicatedCloud.getUserRights($stateParams.productId, $stateParams.userId, elementsByPage, elementsToSkip).then((results) => {
            self.rights = results;
        }, (data) => {
            $scope.setMessage($scope.tr("dedicatedCloud_users_rights_loading_error"), data);
        }).finally(() => {
            self.loading.rights = false;
        });
    };

    self.refreshTableRights = function () {
        $scope.$broadcast("paginationServerSide.reload", "rightTable");
    };

    /* -----  End of RIGHTS LOADING  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    self.$onInit = function () {
        self.loading.init = true;

        return DedicatedCloud.getUserDetail($stateParams.productId, $stateParams.userId).then((details) => {
            self.selectedUser = details;
        }).finally(() => {
            self.loading.init = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */

});
