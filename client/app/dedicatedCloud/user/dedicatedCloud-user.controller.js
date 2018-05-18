angular.module("App").controller("DedicatedCloudUserCtrl", function ($scope, $state, $stateParams, $timeout, $q, $translate, DedicatedCloud, Alerter, constants) {
    "use strict";

    this.loading = false;

    $scope.firstStep = true;

    $scope.$state = $state;
    $scope.users = null;
    $scope.rights = null;
    $scope.rightsCurrentEdit = null;
    $scope.warningLine = false;
    $scope.usersEntrySearchSelected = null;
    $scope.loadSetUserRight = {
        value: false
    };

    $scope.alerts = {
        users: "dedicatedCloud.alerts.dashboardUsers"
    };

    if (constants.target === "US") {
        $scope.phoneRegExp = /\+1\.[0-9]{10}/;
    } else {
        $scope.phoneRegExp = /\+[0-9]{1,4}\.[0-9]{5,15}/;
    }
    $scope.phoneExample = new RandExp($scope.phoneRegExp).gen();

    //---------------------------------------------
    // POLLING
    //---------------------------------------------
    $scope.$on("dedicatedCloud.enableUser.start", () => {
        $scope.setMessage($translate.instant("dedicatedCloud_USER_enable_activation"));
    });

    $scope.$on("dedicatedCloud.enableUser.done", () => {
        $scope.$broadcast("paginationServerSide.reload", "userTable");
        $scope.setMessage($translate.instant("dedicatedCloud_USER_enable_success"));
    });

    $scope.$on("dedicatedCloud.enableUser.error", (event, err) => {
        $scope.setMessage($translate.instant("dedicatedCloud_USER_enable_fail"), { message: err.message, type: "ERROR" });
    });

    $scope.$on("dedicatedCloud.disableUser.start", () => {
        $scope.setMessage($translate.instant("dedicatedCloud_USER_disable_deactivation"));
    });

    $scope.$on("dedicatedCloud.disableUser.done", () => {
        $scope.$broadcast("paginationServerSide.reload", "userTable");
        $scope.setMessage($translate.instant("dedicatedCloud_USER_disable_success"));
    });

    $scope.$on("dedicatedCloud.disableUser.error", (event, err) => {
        $scope.setMessage($translate.instant("dedicatedCloud_USER_disable_fail"), { message: err.data, type: "ERROR" });
    });

    $scope.$on("$destroy", () => {
        DedicatedCloud.killAllPolling();
        DedicatedCloud.stopAllPolling({ namespace: "dedicatedCloud.user.update.poll" });
        DedicatedCloud.stopAllPolling({ namespace: "dedicatedCloud.password.update.poll" });
    });

    $scope.$on("dedicatedCloud.users.refresh", () => {
        $scope.loadUsers();
    });

    $scope.$on("dedicatedCloud.users.right.refresh", () => {
        $scope.$broadcast("paginationServerSide.reload", "rightTable");
    });

    // -- USER POLLING
    $scope.$on("dedicatedCloud.user.update.poll.start", (pollObject, task, user) => {
        const userd = findUser(user);
        if (userd) {
            userd.isUpdating = true;
            userd.progress = task.progress;
            userd.task = task;
        }
    });

    $scope.$on("dedicatedCloud.user.update.poll.doing", (pollObject, task, user) => {
        const userd = findUser(user);
        if (userd) {
            userd.isUpdating = true;
            userd.progress = task.progress;
        }
    });

    $scope.$on("dedicatedCloud.user.update.poll.done", (poll, task, x, user) => {
        const userd = findUser(user);
        if (userd) {
            userd.isUpdating = false;
        }
        $scope.refreshTable();
    });

    $scope.$on("dedicatedCloud.user.update.poll.error", (pollObject, task, user) => {
        const userd = findUser(user);
        if (userd) {
            userd.isUpdating = false;
        }
        $scope.refreshTable();
    });

    // -- PASSWORD POLLING
    $scope.$on("dedicatedCloud.password.update.poll.start", () => {
        Alerter.success($translate.instant("dedicatedCloud_users_password_loading_start"), $scope.alerts.users);
    });

    $scope.$on("dedicatedCloud.password.update.poll.doing", () => {
        Alerter.success($translate.instant("dedicatedCloud_users_password_loading_doing"), $scope.alerts.users);
    });

    $scope.$on("dedicatedCloud.password.update.poll.done", () => {
        Alerter.success($translate.instant("dedicatedCloud_users_password_loading_done"), $scope.alerts.users);
    });

    $scope.$on("dedicatedCloud.password.update.poll.error", (pollObject, err) => {
        Alerter.alertFromSWS($translate.instant("dedicatedCloud_users_password_loading_error"), err, $scope.alerts.users);
    });

    $scope.$watch(
        "usersEntrySearchSelected",
        (newValue) => {
            if ($scope.usersEntrySearchSelected !== null) {
                if ($scope.usersEntrySearchSelected === "") {
                    $scope.loadUsers();
                } else {
                    $timeout(() => {
                        if ($scope.usersEntrySearchSelected === newValue) {
                            $scope.loadUsers();
                        }
                    }, 500);
                }
            }
        },
        true
    );

    this.$onInit = () => {
        this.loading = true;
        console.log(document.getElementById("foo"));
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
        $scope.usersEntrySearchSelected
    ).then((users) => ({
        data: users.slice(offset - 1, offset - 1 + pageSize).map((id) => ({ id })),
        meta: {
            totalCount: users.length
        }
    }));

    this.loadUser = ({ id }) => $q.all({
        user: DedicatedCloud.getUserDetail($stateParams.productId, id),
        tasksTodo: DedicatedCloud.getFirstUserOperationDetail($stateParams.productId, { userId: id, params: { state: "todo" } }),
        tasksDoing: DedicatedCloud.getFirstUserOperationDetail($stateParams.productId, { userId: id, params: { state: "doing" } })
    }).then((infos) => {
        const operations = infos.tasksTodo ? infos.tasksTodo : infos.tasksDoing;
        infos.user.task = operations;
        infos.user.state = infos.user.state.toUpperCase();
        infos.user.activationState = infos.user.activationState.toUpperCase();

        if (operations) {
            infos.user.progress = operations.progress;
            infos.user.isUpdating = true;
            DedicatedCloud.pollUserTasks($stateParams.productId, {
                namespace: "dedicatedCloud.user.update.poll",
                task: operations,
                user: infos.user,
                successSates: ["canceled", "done"],
                errorsSates: ["error"]
            });
        }

        return infos.user;
    });

    this.modifyUserRights = (user) => {
        $state.go("app.dedicatedClouds.users.rights", { userId: user.userId });
    };

    this.editUser = (user) => {
        $state.go("app.dedicatedClouds.users.edit", { userId: user.userId });
    };

    $scope.displayUsers = function () {
        if ($scope.rightsCurrentEdit !== null) {
            $scope.warningLine = true;
        } else {
            $scope.firstStep = true;
            $scope.selectedUser = null;
        }
    };

    $scope.refreshTable = function () {
        $scope.loadUsers();
        $scope.$broadcast("paginationServerSide.reload", "userTable");
    };

    $scope.setUserCurrentEdit = function (user) {
        $scope.userCurrentEdit = angular.copy(user);
        $scope.userCurrentEdit.tokenValidator = user.isTokenValidator;
        $scope.userCurrentEdit.isValid = true;
        $scope.userCurrentEdit.emailValid = true;
        $scope.userCurrentEdit.phoneValid = true;
        $scope.userCurrentEditBack = user;
    };

    $scope.$watch("userCurrentEdit.email", checkForm.bind(this));

    $scope.$watch("userCurrentEdit.phoneNumber", checkForm.bind(this));

    $scope.saveUserCurrentEdit = function () {
        DedicatedCloud.updateUser($stateParams.productId, $scope.userCurrentEdit).then(
            () => {
                $scope.setMessage($translate.instant("dedicatedCloud_USER_set_success", { t0: $scope.userCurrentEdit.name }), { type: "ok" });
                $scope.userCurrentEditBack = null;
                findUser($scope.userCurrentEdit).isUpdating = true;
            },
            (err) => {
                $scope.setMessage($translate.instant("dedicatedCloud_USER_set_fail", { t0: $scope.userCurrentEdit.name }), { type: "ERROR", message: err.message }, $scope.alerts.users);
                $scope.userCurrentEditBack = null;
            }
        );
    };

    function checkForm () {
        if ($scope.userCurrentEdit) {
            $scope.userCurrentEdit.emailValid = /^(?:\S+@\S+\.\S+)?$/.test($scope.userCurrentEdit.email) || $scope.userCurrentEdit.email === null;
            $scope.userCurrentEdit.phoneValid = $scope.phoneRegExp.test($scope.userCurrentEdit.phoneNumber) || !$scope.userCurrentEdit.phoneNumber;
            $scope.userCurrentEdit.isValid = $scope.userCurrentEdit.emailValid && $scope.userCurrentEdit.phoneValid;
        }
    }

    function findUser (user) {
        return _.find($scope.users, (u) => u.userId === user.userId);
    }

});
