angular.module("UserAccount.controllers").controller("UserAccount.controllers.subcontacts.edit", [
    "$scope",
    "$location",
    "UserAccount.services.Infos",
    "Alerter",
    "UserAccount.services.Contacts",
    "$stateParams",
    "LANGUAGES",

    function ($scope, $location, UseraccountInfos, Alerter, Contacts, $stateParams, languagesEnum) {
        "use strict";

        $scope.loading = false;
        $scope.controls = {};

        function parseLegalForms (formsList) {
            $scope.controls.legalforms = formsList.enum || [];
            $scope.model.legalForm = _.find($scope.controls.legalforms, (legalform) => $scope.user.legalForm === legalform);
        }

        function parseCountries (countriesList) {
            const countries = countriesList.enum || [];
            const list = countries.map((country) => ({ countryCode: country, label: $scope.i18n[`country_${country}`] }));
            $scope.controls.countries = _.sortBy(list, "label");
        }

        function parseLanguages (languagesList) {
            const languages = languagesList.enum || [];

            const list = languages.map((lang) => _.find(languagesEnum, { value: lang }));
            $scope.controls.languages = _.sortBy(_.compact(list), "name");

            const index = _.findIndex($scope.controls.languages, (lang) => $scope.user.language === lang);
            if (index > -1) {
                $scope.model.language = $scope.controls.languages[index].value;
            }
        }

        function loadSubContactInfos () {
            Contacts.getContactInfo($stateParams.contactId)
                .then(
                    (contactInfo) => {
                        $scope.user = contactInfo;

                        $scope.model = _.clone(_.pick(contactInfo, ["lastName", "firstName", "legalForm", "email", "phone", "language", "organisationName", "address"]));
                        $scope.model.legalForm = _.find($scope.controls.legalforms, (legalform) => $scope.user.legalForm === legalform);

                        UseraccountInfos.getMeModels().then(
                            (models) => {
                                if (models) {
                                    parseLegalForms(models["nichandle.LegalFormEnum"]);
                                    parseCountries(models["nichandle.CountryEnum"]);
                                    parseLanguages(models["nichandle.LanguageEnum"]);
                                }
                            },
                            (err) => {
                                Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                            }
                        );
                    },
                    (err) => {
                        Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                    }
                )
                .finally(() => {
                    $scope.loading = false;
                });
        }
        loadSubContactInfos();

        function parseModel (model) {
            const data = { id: $stateParams.contactId };
            let key;
            for (key in $scope.model) {
                if ($scope.model.hasOwnProperty(key)) {
                    if (!angular.equals($scope.model[key], $scope.user[key])) {
                        data[key] = $scope.model[key];
                    }
                }
            }
            data.address = model.address;
            if (data.legalForm === "individual") {
                data.organisationName = null;
            }
            return data;
        }

        $scope.submitData = function () {
            Alerter.resetMessage("InfoAlert");
            $scope.loading = true;

            const data = parseModel($scope.model);
            if (Object.keys(data).length > 0) {
                Contacts.updateContact(data)
                    .then(
                        () => {
                            _.delay(() => {
                                Alerter.success($scope.tr("useraccount_sub_contacts_update_success_message"), "InfoAlert");
                            }, 500);
                            $location.path("/useraccount/subContacts");
                        },
                        (err) => {
                            Alerter.alertFromSWS($scope.tr("user_account_info_error"), err, "InfoAlert");
                        }
                    )
                    .finally(() => {
                        $scope.loading = false;
                    });
            }
        };

        $scope.cancel = function () {
            $location.path("/useraccount/subContacts");
        };
    }
]);
