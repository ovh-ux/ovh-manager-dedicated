angular.module("App").controller("UserLangueCtrl", [
    "$scope",
    "$http",
    "User",
    "translator",

    function ($scope, $http, User, translator) {
        "use strict";

        // languages choice
        $scope.selectedLanguage = translator.getSelectedAvailableLanguage();
        $scope.availableLanguages = translator.getAvailableLanguages();

        $scope.setSelectedLanguage = function (newLanguage) {
            $scope.selectedLanguage = newLanguage;
            localStorage.setItem("univers-selected-language", newLanguage.value);
            window.location.reload(false);
        };
    }
]);
