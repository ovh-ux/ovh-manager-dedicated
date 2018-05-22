angular.module("UserAccount").controller("UserAccount.controllers.contactServices", [
    "$scope",
    "UserAccount.services.Contacts",
    "Alerter",
    "$stateParams",
    "$location",
    "User",
    "$q",
    "$translate",
    function ($scope, Contacts, Alerter, $stateParams, $location, User, $q, $translate) {
        "use strict";

        const self = this;
        let allServicesIds = [];
        const servicesTemp = {};
        const servicesToDelete = [];

        self.loaders = {
            services: false,
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
                    Alerter.alertFromSWS($translate.instant("user_account_contacts_error"), err, "useraccount.alerts.dashboardContacts");
                }
            );
        }

        function init () {
            $q.all([getUser(), self.getServices(true)]).then(() => {
                if ($stateParams.serviceName) {
                    self.serviceFilter = _.find(self.allServices, (service) => service.serviceName === $stateParams.serviceName);
                    self.categoryFilter = $stateParams.category;
                    self.updateFilters();
                }
            });
        }

        self.getServices = function (forceRefresh) {
            self.loaders.services = true;
            self.categoryFilter = null;
            self.serviceFilter = null;

            return Contacts.getServices(forceRefresh)
                .then(
                    (services) => {
                        const servicesFiltered = services.filter((service) => Contacts.availableService.indexOf(service.category) !== -1 && Contacts.noAvailableService.indexOf(service.category) === -1);

                        servicesFiltered.forEach((s) => {
                            const key = [s.category.replace(/\s/, "-"), s.serviceName].join("::");
                            servicesTemp[key] = s;
                            if (self.categories.indexOf(s.category) === -1) {
                                self.categories.push(s.category);
                            }
                        });
                        self.servicesIds = Object.keys(servicesTemp);
                        self.allServices = servicesFiltered;
                        allServicesIds = angular.copy(self.servicesIds);
                    },
                    (err) => {
                        Alerter.alertFromSWS($translate.instant("user_account_contacts_error"), err, "useraccount.alerts.dashboardContacts");
                    }
                )
                .finally(() => {
                    self.loaders.services = false;
                });
        };

        self.transformItem = function (id) {
            self.loaders.services = true;
            return Contacts.getServiceInfos({ path: servicesTemp[id].path, serviceName: servicesTemp[id].serviceName }).then((serviceInfos) => {
                const nicMatch = Contacts.excludeNics.filter((nic) => nic.test(serviceInfos.contactTech)).length === 0;

                if (serviceInfos.status === "expired" || !nicMatch) {
                    servicesToDelete.push(id);
                    return null;
                }

                servicesTemp[id].contactTech = serviceInfos.contactTech;
                servicesTemp[id].contactAdmin = serviceInfos.contactAdmin;
                servicesTemp[id].contactBilling = serviceInfos.contactBilling;
                return servicesTemp[id];
            });
        };

        self.onTransformItemDone = function () {
            self.loaders.services = false;
            if (servicesToDelete.length > 0) {
                self.servicesIds = self.servicesIds.filter((s) => servicesToDelete.indexOf(s) === -1);
            }
        };

        self.updateFilters = function () {
            $location.search("serviceName", _.get(self.serviceFilter, "serviceName", null));
            $location.search("category", _.get(self, "categoryFilter", null));

            self.servicesIds = allServicesIds
                .filter((id) => self.categoryFilter ? id.indexOf(self.categoryFilter) === 0 : true)
                .filter((id) => self.serviceFilter ? id.indexOf(self.serviceFilter.serviceName) !== -1 : true);
        };

        self.openEditLine = function (index, service) {
            self.editLine = index;
            service.newContactAdmin = service.contactAdmin;
            service.newContactTech = service.contactTech;
            service.newContactBilling = service.contactBilling;
        };

        self.changeContact = function (service) {
            self.loaders.changeContact = true;
            Contacts.changeContact({
                service,
                contactAdmin: service.newContactAdmin,
                contactBilling: service.newContactBilling,
                contactTech: service.newContactTech
            })
                .then(
                    () => {
                        self.editLine = -1;
                        Alerter.success($translate.instant("user_account_change_contacts_success"), "useraccount.alerts.dashboardContacts");
                    },
                    (err) => {
                        Alerter.alertFromSWS($translate.instant("user_account_change_contacts_error"), err, "useraccount.alerts.dashboardContacts");
                    }
                )
                .finally(() => {
                    self.loaders.changeContact = false;
                });
        };

        $scope.$on("useraccount.contact.changed", init);

        init();
    }
]);
