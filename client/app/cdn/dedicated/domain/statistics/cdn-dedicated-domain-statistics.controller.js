angular.module("App").controller("CdnDomainStatisticsCtrl", class CdnDomainStatisticsCtrl {

    constructor ($stateParams, $translate, Alerter, cdnDomain, OvhApiCdnDedicated) {
        // injections
        this.$stateParams = $stateParams;
        this.$translate = $translate;
        this.Alerter = Alerter;
        this.cdnDomain = cdnDomain;
        this.OvhApiCdnDedicated = OvhApiCdnDedicated;

        // other attributes used in view
        this.availablePeriods = ["day", "week", "month"];
        this.availableValues = ["bandwidth", "request"];

        this.loading = {
            stats: false
        };

        this.model = {
            period: null,
            value: null
        };
    }

    createChart (stats) {
        this.series = [];
        this.data = [];

        this.labels = _.map(_.get(stats, "cdn.values"), (value, index) => {
            const source = stats.backend || stats.cdn;
            const start = _.get(source, "pointStart");
            const interval = _.get(source, "pointInterval.standardSeconds");
            return moment(start).add((index + 1) * interval, "seconds").calendar();
        });
        this.series.push(this.$translate.instant(`cdn_stats_legend_${this.model.value}_cdn`));
        this.series.push(this.$translate.instant(`cdn_stats_legend_${this.model.value}_backend`));
        this.data.push(_.map(_.get(stats, "cdn.values"), (value) => value.y));
        this.data.push(_.map(_.get(stats, "backend.values"), (value) => value.y));
    }

    getStatistics () {
        this.loading.stats = true;

        return this.OvhApiCdnDedicated.v6().swsGetStatistics({
            serviceName: this.$stateParams.productId,
            domain: this.$stateParams.domain,
            period: this.model.period.toUpperCase(),
            dataType: this.model.value.toUpperCase()
        }).$promise.then((stats) => {
            this.createChart(stats);
        }).catch((error) => {
            this.Alerter.error([this.$translate.instant("cdn_dedicated_statistics_load_error"), _.get(error, "data.message")].join(" "), "cdnDedicatedDomain");
        }).finally(() => {
            this.loading.stats = false;
        });
    }

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    $onInit () {
        // set default value
        this.model.period = _.first(this.availablePeriods);
        this.model.value = _.first(this.availableValues);

        this.getStatistics();
    }

    /* -----  End of INITIALIZATION  ------ */

});
