angular.module("App").controller(
    "WorkingStatusCtrl",
    class WorkingStatusCtrl {
        constructor ($scope, Products) {
            this.$scope = $scope;
            this.Products = Products;
            this.worksDetails = [];
        }

        $onInit () {
            this.Products.getWorks("dedicated_server", true, true).then((works) => {
                this.worksDetails = works.items;
            });
        }
    });
