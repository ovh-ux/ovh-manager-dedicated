angular.module("services").service("dedicatedCloudMailingList", [
    "OvhHttp",
    function (OvhHttp) {
        "use strict";

        this.postMailingList = function (email, mailingList) {
            return OvhHttp.post("/me/mailingList/subscribe", {
                rootPath: "apiv6",
                data: {
                    email,
                    mailingList
                }
            });
        };
    }
]);
