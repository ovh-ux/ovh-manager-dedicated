angular.module("UserAccount.controllers").controller("UserAccount.controllers.subcontacts.delete", [
    "$scope",
    "UserAccount.services.Contacts",
    "Alerter",
    function ($scope, Contacts, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;

        $scope.deleteContact = function () {
            Contacts.deleteContact($scope.data.id)
                .then(
                    () => {
                        _.delay(() => {
                            Alerter.success($scope.tr("useraccount_sub_contacts_delete_success_message"), "InfoAlert");
                        }, 500);
                    },
                    (err) => {
                        Alerter.alertFromSWS($scope.tr("useraccount_sub_contacts_delete_error_message"), err, "InfoAlert");
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
