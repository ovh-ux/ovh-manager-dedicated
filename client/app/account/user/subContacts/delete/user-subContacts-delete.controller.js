angular.module("UserAccount.controllers").controller("UserAccount.controllers.subcontacts.delete", [
    "$scope",
    "$translate",
    "UserAccount.services.Contacts",
    "Alerter",
    function ($scope, $translate, Contacts, Alerter) {
        "use strict";

        $scope.data = $scope.currentActionData;

        $scope.deleteContact = function () {
            Contacts.deleteContact($scope.data.id)
                .then(
                    () => {
                        _.delay(() => {
                            Alerter.success($translate.instant("useraccount_sub_contacts_delete_success_message"), "InfoAlert");
                        }, 500);
                    },
                    (err) => {
                        Alerter.alertFromSWS($translate.instant("useraccount_sub_contacts_delete_error_message"), err, "InfoAlert");
                    }
                )
                .finally(() => {
                    $scope.resetAction();
                });
        };
    }
]);
