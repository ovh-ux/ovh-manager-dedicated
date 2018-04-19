angular.module("UserAccount.controllers").controller("UserAccount.controllers.subcontacts.add", [
    "$scope",
    "$location",
    "$translate",
    "UserAccount.services.Infos",
    "Alerter",
    "UserAccount.services.Contacts",
    "$stateParams",
    "LANGUAGES",

    function ($scope, $location, $translate, UseraccountInfos, Alerter, Contacts, $stateParams, languagesEnum) {
        "use strict";

        $scope.loading = false;
        $scope.controls = { legalforms: [] };
        $scope.model = {
            address: {}
        };

        /* Be carefull, part of this controller is url driven.
           The url is checked to detect if a return toward an exterior url is wanted
            Example:  #/useraccount/subContacts/add?returnUrl=https:%2F%2Fapi.ovh.com
        */
        if ($location.search().returnUrl) {
            $scope.controls.returnUrl = _.clone($location.search().returnUrl);

            // $location.search('returnUrl', null);
        }

        function parseCountries (countriesList) {
            const countries = countriesList.enum || [];
            const list = countries.map((country) => ({ countryCode: country, label: $scope.i18n[`country_${country}`] }));
            $scope.controls.countries = _.sortBy(list, "label");
            $scope.model.country = $scope.controls.countries[67].countryCode; // default value
        }

        function parseLanguages (languagesList) {
            const languages = languagesList.enum || [];

            const list = languages.map((lang) => _.find(languagesEnum, { value: lang }));
            $scope.controls.languages = _.sortBy(_.compact(list), "name");
        }

        function loadSubContactInfos () {
            UseraccountInfos.getUseraccountInfos().then(
                (me) => {
                    $scope.model.language = me.language;
                    $scope.model.country = me.country;
                },
                (err) => {
                    Alerter.alertFromSWS($translate.instant("user_account_info_error"), err, "InfoAlert");
                }
            );

            UseraccountInfos.getMeModels().then(
                (models) => {
                    if (models) {
                        $scope.controls.legalforms = models["nichandle.LegalFormEnum"].enum;
                        $scope.model.legalForm = $scope.controls.legalforms[2]; // individual by default
                        parseCountries(models["nichandle.CountryEnum"]);
                        parseLanguages(models["nichandle.LanguageEnum"]);
                    }
                },
                (err) => {
                    Alerter.alertFromSWS($translate.instant("user_account_info_error"), err, "InfoAlert");
                }
            );

            $scope.model.legalForm = $scope.controls.legalforms[0]; // individual by default
        }
        loadSubContactInfos();

        $scope.submitData = function () {
            Alerter.resetMessage("InfoAlert");
            $scope.loading = true;

            if ($scope.model.legalForm === "individual") {
                $scope.model.organisationName = null;
            }

            if (Object.keys($scope.model).length > 0) {
                Contacts.updateContact($scope.model).then(
                    () => {
                        _.delay(() => {
                            Alerter.success($translate.instant("useraccount_sub_contacts_add_success_message"), "InfoAlert");
                        }, 500);
                        $scope.goBack();
                    },
                    (err) => {
                        Alerter.alertFromSWS($translate.instant("useraccount_sub_contacts_add_error_message"), err, "InfoAlert");
                    }
                );
            }
        };

        $scope.goBack = function () {
            if ($scope.controls.returnUrl) {
                window.open($scope.controls.returnUrl, "_self");
            } else {
                $location.path("/useraccount/subContacts");
            }
        };
    }
]);
