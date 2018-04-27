angular.module("UserAccount.controllers")
    .controller("UserAccount.controllers.credentials", class UserAccountCredentialsController {

        constructor ($q, $scope, Alerter, UseraccountCredentialsService) {
            this.$q = $q;
            this.$scope = $scope;
            this.Alerter = Alerter;
            this.UseraccountCredentialsService = UseraccountCredentialsService;

            this.$scope.$on("useraccount.credentials.refresh", () => {
                this.$onInit();
            });
        }

        $onInit () {
            this.credentialsIds = [];

            return this.getCredentials();
        }

        /**
         * Get the list of your Api Credentials IDs.
         * @return {Promise}
         */
        getCredentials () {
            return this.UseraccountCredentialsService.getCredentials()
                .then((credentialsIds) => {
                    this.credentialsIds = credentialsIds;
                    return credentialsIds;
                })
                .catch((err) => {
                    this.Alerter.error(`${this.$scope.tr("user_credentials_error")} ${_.get(err, "message", "")}`, "userCredentials");
                });
        }

        loadDatagridCredentials ({ offset, pageSize }) {
            return this.getCredentials()
                .then(() => {
                    const part = this.credentialsIds.slice(offset - 1, offset - 1 + pageSize);
                    return {
                        data: part.map((id) => ({ id })),
                        meta: {
                            totalCount: this.credentialsIds.length
                        }
                    };
                });
        }

        transformItem (credential) {
            return this.UseraccountCredentialsService
                .getCredential(credential.id)
                .then((credentialInfo) => this.UseraccountCredentialsService
                    .getApplication(credentialInfo.credentialId)
                    .then((applicationInfo) => _.assign(credentialInfo, applicationInfo)));
        }
    });
