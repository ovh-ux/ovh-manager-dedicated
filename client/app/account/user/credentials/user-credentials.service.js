angular.module("UserAccount.services").service("UseraccountCredentialsService", [
    "OvhHttp",
    function (OvhHttp) {
        "use strict";

        const self = this;

        self.getCredentials = function () {
            return OvhHttp.get("/me/api/credential", {
                rootPath: "apiv6"
            });
        };

        self.getCredential = function (credentialId) {
            return OvhHttp.get("/me/api/credential/{credentialId}", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                }
            });
        };

        self.getApplication = function (credentialId) {
            return OvhHttp.get("/me/api/credential/{credentialId}/application", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                }
            });
        };

        self.deleteCredential = function (credentialId) {
            return OvhHttp.delete("/me/api/credential/{credentialId}", {
                rootPath: "apiv6",
                urlParams: {
                    credentialId
                },
                broadcast: "useraccount.credentials.refresh"
            });
        };
    }
]);

