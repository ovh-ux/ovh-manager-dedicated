angular.module("UserAccount.controllers")
    .controller("UserAccount.controllers.credentials.read", class UserAccountCredentialsReadController {
        constructor ($scope) {
            this.$scope = $scope;
            this.credential = $scope.currentActionData;
        }
    });
