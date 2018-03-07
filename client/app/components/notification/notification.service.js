angular.module("App").service("Module.services.notification", [
    "$q",
    "ovhUserPref",
    function ($q, ovhUserPref) {
        "use strict";
        const self = this;

        self.stopNotification = function (userPrefName, subject) {
            return ovhUserPref
                .getValue(userPrefName)
                .then((data) => {
                    const notificationArray = data;
                    notificationArray.push(subject);
                    return ovhUserPref.assign(userPrefName, notificationArray);
                })
                .catch((error) => error.status === 404 ? createNotificationUserPref(userPrefName, subject) : $q.reject(error));
        };

        self.checkIfStopNotification = function (userPrefName, subject) {
            return ovhUserPref
                .getValue(userPrefName)
                .then((notification) => _.indexOf(notification, subject) !== -1)
                .catch((error) => error.status === 404 ? false : $q.reject(error));
        };

        function createNotificationUserPref (userPrefName, subject) {
            return ovhUserPref.create(userPrefName, [subject]);
        }
    }
]);
