"use strict";
angular.module("UserAccount.controllers").controller("UserAccountUsersCtrl", class UserAccountUsersCtrl {

    constructor ($scope, UseraccountUsersService, Alerter, $translate) {
        this.$scope = $scope;
        this.usersService = UseraccountUsersService;
        this.alerter = Alerter;
        this.$translate = $translate;
        this.userIds = [];
        this.users = [];
        this.usersLoading = true;

        this.$scope.$on("useraccount.security.users.refresh", () => {
            this.$onInit();
        });
    }

    $onInit () {
        this.userIds = [];
        this.users = [];
        this.usersLoading = true;
        this.usersService.getUsers()
            .then((userIds) => {
                this.userIds = userIds;
            })
            .catch((err) => {
                this.alerter.error(`${this.$translate.instant("user_users_error")} ${_.get(err, "message", err)}`, "userUsers");
            })
            .finally(() => {
                this.usersLoading = false;
            });
    }

    onTransformItem (userId) {
        return this.usersService.getUser(userId);
    }

    onTransformItemDone () {
        this.usersLoading = false;
    }

});

