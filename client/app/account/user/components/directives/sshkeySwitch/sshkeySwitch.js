angular.module("UserAccount.directives").directive("sshkeySwitch", [
    "sshkey-regex",
    function (SSHKEY_REGEX) {
        "use strict";
        return {
            template: '<div><span class="label label-default ml-2" data-ng-class="{\'label-primary\': selectedType == keytype.name}" data-ng-repeat="keytype in keytypes" data-ng-bind="keytype.name"></span></div>',
            restrict: "A",
            require: "?ngModel",
            replace: true,
            scope: {
                isValid: "=ngModel",
                sshkeySwitchKey: "@sshkeySwitchKey"
            },
            link: function postLink ($scope) {
                $scope.isValid = false;
                $scope.selectedType = false;
                $scope.keytypes = SSHKEY_REGEX;

                let i = 0;
                let found = false;

                $scope.$watch("sshkeySwitchKey", (val) => {
                    found = false;
                    const valTrimmed = val.trim().replace(/\n/, "");
                    for (i = SSHKEY_REGEX.length; i--;) {
                        if (SSHKEY_REGEX[i].regex.test(valTrimmed)) {
                            found = SSHKEY_REGEX[i].name;
                            break;
                        }
                    }
                    $scope.selectedType = found;
                    $scope.isValid = !!found;
                });
            }
        };
    }
]);
