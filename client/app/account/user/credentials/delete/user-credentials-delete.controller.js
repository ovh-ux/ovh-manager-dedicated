"use strict";
angular.module("UserAccount.controllers")
    .controller("UserAccount.controllers.credentials.delete", class UserAccountCredentialsDeleteController {

        constructor ($scope, UseraccountCredentialsService, Alerter) {
            this.$scope = $scope;
            this.UseraccountCredentialsService = UseraccountCredentialsService;
            this.Alerter = Alerter;
            this.credential = $scope.currentActionData;
            this.loader = false;
        }

        $onInit () {
            this.$scope.deleteCredential = this.deleteCredential.bind(this);
        }

        deleteCredential () {
            this.loader = true;

            this.UseraccountCredentialsService.deleteCredential(this.credential.credentialId)
                .then(() => {
                    this.Alerter.success(this.$scope.tr("user_credentials_delete_success_message"), "userCredentials");
                })
                .catch((err) => {
                    this.Alerter.error(`${this.$scope.tr("user_credentials_delete_error_message")} ${_.get(err, "message") || err}`, "userCredentials");
                })
                .finally(() => {
                    this.loader = false;
                    this.$scope.resetAction();
                });
        }

    });
