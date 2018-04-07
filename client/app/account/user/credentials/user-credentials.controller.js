"use strict";
angular.module("UserAccount.controllers")
    .controller("UserAccount.controllers.credentials", class UserAccountCredentialsController {

        constructor ($scope, UseraccountCredentialsService, Alerter) {
            this.$scope = $scope;
            this.UseraccountCredentialsService = UseraccountCredentialsService;
            this.Alerter = Alerter;

            this.$scope.$on("useraccount.credentials.refresh", () => {
                this.$onInit();
            });
        }

        $onInit () {
            this.credentials = [];
            this.credentialsLoading = true;

            this.UseraccountCredentialsService.getCredentials()
                .then((credentials) => {
                    credentials.forEach((credentialId) => {
                        this.UseraccountCredentialsService.getCredential(credentialId)
                            .then((credential) => {
                                this.UseraccountCredentialsService.getApplication(credentialId)
                                    .then((application) => {
                                        credential.application = application;
                                        this.credentials.push(credential);
                                    });
                            });
                    });
                })
                .catch((err) => {
                    this.Alerter.error(`${this.$scope.tr("user_credentials_error")} ${_.get(err, "message") || err}`, "userCredentials");
                })
                .finally(() => {
                    this.credentialsLoading = false;
                });
        }
    });

