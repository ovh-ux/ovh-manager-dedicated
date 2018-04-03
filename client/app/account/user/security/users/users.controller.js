"use strict";
angular.module("UserAccount.controllers").controller("UserAccountUsersCtrl", class UserAccountUsersCtrl {

    constructor ($scope, $q, User, UseraccountUsersService, Alerter, $translate) {
        this.$scope = $scope;
        this.$q = $q;
        this.userService = User;
        this.usersService = UseraccountUsersService;
        this.alerter = Alerter;
        this.$translate = $translate;
        this.me = null;
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

        return this.$q.all({
            me: this.userService.getUser(),
            userIds: this.usersService.getUsers()
        }).then((data) => {
            this.me = data.me;
            this.userIds = data.userIds;
        }).catch((err) => {
            this.alerter.error(`${this.$translate.instant("user_users_error")} ${_.get(err, "message", err)}`, "userUsers");
        }).finally(() => {
            this.usersLoading = false;
        });
    }

    onTransformItem (userId) {
        return this.usersService.getUser(userId).then((user) => {
            user.fullLogin = `${this.me.email}/${user.login}`;
            return user;
        });
    }

    onTransformItemDone () {
        this.usersLoading = false;
    }

});

