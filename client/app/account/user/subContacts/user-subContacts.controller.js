angular.module("UserAccount.controllers").controller("UserAccount.controllers.subcontacts", [
    "$scope",
    "$translate",
    "UserAccount.services.Contacts",
    "Alerter",
    "$stateParams",
    "$location",
    "User",
    "$q",

    function ($scope, $translate, Contacts, Alerter, $stateParams, $location, User, $q) {
        "use strict";

        const self = this;
        self.loaders = {
            contacts: false,
            serviceInfos: false,
            changeContact: false
        };

        self.servicesIds = [];
        self.allServices = [];
        self.services = [];
        self.categories = [];
        self.editLine = -1;

        function getUser () {
            return User.getUser().then(
                (user) => {
                    self.user = user;
                },
                (err) => {
                    Alerter.alertFromSWS($translate.instant("user_account_contacts_error"), err, "InfoAlert");
                }
            );
        }

        function init () {
            $q.all([getUser(), self.getContactsList()]).then(() => {
                if ($stateParams.serviceName) {
                    self.serviceFilter = _.find(self.allServices, (service) => service.serviceName === $stateParams.serviceName);
                    self.onServiceChanged();
                }
            });
        }

        self.getContactsList = function () {
            return Contacts.getContactsId()
                .then(
                    (contacts) => {
                        self.contactsIds = contacts.reverse();
                    },
                    (err) => {
                        Alerter.alertFromSWS($translate.instant("user_account_contacts_error"), err, "InfoAlert");
                    }
                )
                .finally(() => {
                    self.loaders.contacts = false;
                });
        };

        self.transformItem = function (id) {
            self.loaders.contacts = true;
            return Contacts.getContactInfo(id).then((contactInfos) => contactInfos);
        };

        self.onTransformItemDone = function () {
            self.loaders.contacts = false;
        };

        self.updateContact = function (contact) {
            $location.path(["/useraccount/subContacts", contact.id].join("/"));
        };

        self.deleteContact = function (contact) {
            $scope.setAction("subContacts/delete/user-subContacts-delete", contact);
        };

        self.addContact = function () {
            $location.path("/useraccount/subContacts/add");
        };

        $scope.$on("useraccount.contact.changed", init);

        init();
    }
]);
