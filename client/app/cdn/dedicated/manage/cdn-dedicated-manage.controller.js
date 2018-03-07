angular.module("App").controller("CdnManageCtrl", class CdnManageCtrl {

    constructor ($scope, $q, $stateParams, $filter, translator, Cdn) {
        // injections
        this.$scope = $scope;
        this.$q = $q;
        this.$stateParams = $stateParams;
        this.$filter = $filter;
        this.translator = translator;
        this.Cdn = Cdn;

        // attributes used in view
        this.cdn = null;
        this.loading = false;
    }

    $onInit () {
        this.loading = true;

        return this.$q.allSettled([
            this.Cdn.getSelected(this.$stateParams.productId, true),
            this.Cdn.getServiceInfos(this.$stateParams.productId)
        ]).then((data) => {
            this.cdn = data[0];
            this.serviceInfos = data[1];

            const date = new Date();
            const endingDay = this.cdn.endingDay;

            if (!endingDay) {
                this.cdn.endingEstimationDate = "-";
            } else if (endingDay > 90) {
                this.cdn.endingEstimationDate = this.translator.tr("cdn_configuration_more_than_three_month");
            } else {
                date.setDate(date.getDate() + endingDay);
                this.cdn.endingEstimationDate = this.$filter("date")(date, "mediumDate");
            }
        }).catch((errors) => {
            const errCdn = errors[0];
            const errServiceInfos = errors[1];
            const errs = [];

            if (errCdn.data && errCdn.data.type === "ERROR") {
                errs.push(errCdn);
            } else {
                this.cdn = errCdn;
            }

            if (errServiceInfos.data && errServiceInfos.data.type === "ERROR") {
                errs.push(errServiceInfos);
            } else {
                this.serviceInfos = errServiceInfos.data;
            }

            this.$scope.setMessage(this.translator.tr("cdn_dashboard_loading_error"), {
                message: errs.map((data) => data.data.message).join(", "),
                type: "ERROR"
            });
        }).finally(() => {
            this.loading = false;
        });
    }

});
