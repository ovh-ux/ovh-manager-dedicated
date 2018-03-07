angular.module("App")
    .controller("SessionCtrl", ($scope, $document, translator, SessionService) => {
        "use strict";

        $scope.$watch("i18n.global_app_title", () => {
            translator.setTitle($scope.tr("global_app_title"));
        });

        // Scroll to anchor id
        $scope.scrollTo = (id) => {
        // Set focus to target
            if (_.isString(id)) {
                $document.find(`#${id}`)[0].focus();
            }
        };

        // Get first base structure of the navbar, to avoid heavy loading
        SessionService.getNavbar()
            .then((navbar) => {
                $scope.navbar = navbar;

                // Then get the products links, to build the reponsive menu
                SessionService.getResponsiveLinks()
                    .then((responsiveLinks) => {
                        $scope.navbar.responsiveLinks = responsiveLinks;
                    });
            });
    });
