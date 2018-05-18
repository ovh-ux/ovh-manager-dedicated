angular.module("App").controller("DedicatedCloudUserEditCtrl", class DedicatedCloudUserEditCtrl {

    constructor ($state, $stateParams, $translate, Alerter, DedicatedCloud) {
        this.$state = $state;
        this.$translate = $translate;
        this.productId = $stateParams.productId;
        this.userId = $stateParams.userId;
        this.Alerter = Alerter;
        this.DedicatedCloud = DedicatedCloud;
    }


    $onInit () {
        this.loading = true;
        return this.DedicatedCloud.getUserDetail(
            this.productId,
            this.userId
        ).then((user) => {
            this.user = user;
            this.user.tokenValidator = user.isTokenValidator;
        }).catch((err) => {
            this.Alerter.error(`${this.$translate.instant("dedicatedCloud_USER_edit_load_error")} ${_.get(err, "message") || err}`, "dedicatedCloud.user.edit");
        }).finally(() => {
            this.loading = false;
        });
    }

    editUser () {
        return this.DedicatedCloud.updateUser(
            this.productId,
            _.pick(this.user, [
                "userId",
                "name",
                "firstName",
                "lastName",
                "email",
                "phoneNumber",
                "tokenValidator",
                "canManageNetwork",
                "canManageIpFailOvers",
                "nsxRight"
            ])
        ).then(() => {
            this.Alerter.success(this.$translate.instant("dedicatedCloud_USER_edit_success"), "dedicatedCloud.user.edit");
        }).catch((err) => {
            this.Alerter.error(`${this.$translate.instant("dedicatedCloud_USER_edit_error")} ${_.get(err, "message") || err}`, "dedicatedCloud.user.edit");
        }).finally(() => {
            this.$state.go("^");
        });
    }
});
