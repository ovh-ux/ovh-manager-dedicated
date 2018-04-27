angular.module("UserAccount.services")
    .service("UseraccountCredentialsService", class UseraccountCredentialsService {
        constructor (OvhHttp) {
            this.OvhHttp = OvhHttp;
        }

        getCredentials () {
            return this.OvhHttp.get("/me/api/credential", {
                rootPath: "apiv6"
            });
        }

        getCredential (credentialId) {
            return this.OvhHttp.get("/me/api/credential/{credentialId}", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                }
            });
        }

        getApplication (credentialId) {
            return this.OvhHttp.get("/me/api/credential/{credentialId}/application", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                }
            });
        }

        deleteCredential (credentialId) {
            return this.OvhHttp.delete("/me/api/credential/{credentialId}", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                },
                broadcast: "useraccount.credentials.refresh"
            });
        }
    });
