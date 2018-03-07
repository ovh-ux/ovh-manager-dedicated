"use strict";
angular.module("UserAccount.services").service("UseraccountUsersService", class UseraccountUsersService {

    constructor (OvhHttp) {
        this.ovhHttp = OvhHttp;
    }

    getUsers () {
        return this.ovhHttp.get("/me/user", {
            rootPath: "apiv6"
        });
    }

    getUser (user) {
        return this.ovhHttp.get("/me/user/{user}", {
            rootPath: "apiv6",
            urlParams: {
                user
            }
        });
    }

    addUser (data) {
        return this.ovhHttp.post("/me/user", {
            rootPath: "apiv6",
            data,
            broadcast: "useraccount.security.users.refresh"
        });
    }

    updateUser (data) {
        return this.ovhHttp.put("/me/user/{user}", {
            rootPath: "apiv6",
            urlParams: {
                user: data.login
            },
            data: {
                email: data.email,
                description: data.description
            },
            broadcast: "useraccount.security.users.refresh"
        });
    }

    deleteUser (user) {
        return this.ovhHttp.delete("/me/user/{user}", {
            rootPath: "apiv6",
            urlParams: {
                user: user.login
            },
            broadcast: "useraccount.security.users.refresh"
        });
    }

    enableUser (user) {
        return this.ovhHttp.post("/me/user/{user}/enable", {
            rootPath: "apiv6",
            urlParams: {
                user: user.login
            },
            broadcast: "useraccount.security.users.refresh"
        });
    }

    disableUser (user) {
        return this.ovhHttp.post("/me/user/{user}/disable", {
            rootPath: "apiv6",
            urlParams: {
                user: user.login
            },
            broadcast: "useraccount.security.users.refresh"
        });
    }
});
