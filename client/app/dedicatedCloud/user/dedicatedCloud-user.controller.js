angular.module("App").controller("DedicatedCloudUserCtrl", function ($scope, $state, $stateParams, $timeout, $q, DedicatedCloud, ouiDatagridService) {
    "use strict";

    this.loading = false;
    this.usersEntrySearchSelected = null;

    $scope.$on("dedicatedCloud.users.refresh", () => {
        ouiDatagridService.refresh("pcc-user-datagrid", true);
    });

    $scope.$watch(
        "$ctrl.usersEntrySearchSelected",
        (newValue) => {
            if (this.usersEntrySearchSelected !== null) {
                if (this.usersEntrySearchSelected === "") {
                    ouiDatagridService.refresh("pcc-user-datagrid", true);
                } else {
                    $timeout(() => {
                        if (this.usersEntrySearchSelected === newValue) {
                            ouiDatagridService.refresh("pcc-user-datagrid", true);
                        }
                    }, 500);
                }
            }
        },
        true
    );

    this.$onInit = () => {
        this.loading = true;
        return $q.all({
            policy: DedicatedCloud.getPasswordPolicy($stateParams.productId),
            nsxOptions: DedicatedCloud.getOptionState("nsx", $stateParams.productId)
        }).then((response) => {
            $scope.passwordPolicy = response.policy;
            $scope.nsxOptions = response.nsxOptions;
        }).finally(() => {
            this.loading = false;
        });
    };

    this.loadUsers = ({ offset, pageSize }) => DedicatedCloud.getUsers(
        $stateParams.productId,
        this.usersEntrySearchSelected
    ).then((users) => ({
        data: users.slice(offset - 1, offset - 1 + pageSize).map((id) => ({ id })),
        meta: {
            totalCount: users.length
        }
    }));

    this.loadUser = ({ id }) => $q.all({
        user: DedicatedCloud.getUserDetail($stateParams.productId, id)
    }).then((infos) => {
        infos.user.state = infos.user.state.toUpperCase();
        infos.user.activationState = infos.user.activationState.toUpperCase();
        return infos.user;
    });

    this.modifyUserRights = (user) => {
        $state.go("app.dedicatedClouds.users.rights", { userId: user.userId });
    };

    this.editUser = (user) => {
        $state.go("app.dedicatedClouds.users.edit", { userId: user.userId });
    };
});
