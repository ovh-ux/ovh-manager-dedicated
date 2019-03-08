import addDomainTemplate from '../../domain/add/cdn-dedicated-domain-add.html';
import orderRuleTemplate from '../../domain/rule/order/cdn-dedicated-domain-rule-order.html';
import orderQuotaTemplate from '../../quota/order/cdn-dedicated-quota-order.html';

class CdnStatisticsCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, $uibModal, Alerter, Cdn) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.Cdn = Cdn;
  }

  $onInit() {
    this.loadingConsts = true;

    return this.$q.all({
      cdn: this.Cdn.getSelected(this.$stateParams.productId, true),
      serviceInfos: this.Cdn.getServiceInfos(this.$stateParams.productId),
      statisticsConsts: this.Cdn.getStatisticsConsts(),
    })
      .then(({ cdn, serviceInfos, statisticsConsts }) => {
        this.cdn = cdn;
        this.serviceInfos = serviceInfos;
        this.consts = statisticsConsts;
        this.statisticsSearchCriteria = {
          dataType: statisticsConsts.defaultType,
          period: statisticsConsts.defaultPeriod,
        };

        return this.getStatistics();
      })
      .catch(({ message: errorMessage }) => {
        if (errorMessage) {
          this.Alerter.error(`${this.$translate.instant('cdn_configuration_add_ssl_get_error')} ${errorMessage}`, 'cdnDedicatedManage');
        }
      })
      .finally(() => {
        this.loadingConsts = false;
      });
  }

  getStatistics() {
    this.loadingStats = true;
    return this.Cdn.getStatistics(this.$stateParams.productId, this.statisticsSearchCriteria)
      .then((statistics) => { this.createChart(statistics); })
      .catch(({ message: errorMessage }) => {
        if (errorMessage) {
          this.Alerter.error(`${this.$translate.instant('cdn_configuration_add_ssl_get_error')} ${errorMessage}`, 'cdnDedicatedManage');
        }
      })
      .finally(() => {
        this.loadingStats = false;
      });
  }

  createChart(statistics) {
    this.chartSeries = [];
    this.chartData = [];
    const statisticsValues = _.get(statistics, 'cdn.values', []);
    const statisticsBackendValues = _.get(statistics, 'backend.values', []);

    this.chartLabels = statisticsValues.map((value, index) => {
      const source = statistics.backend || statistics.cdn;
      const start = _.get(source, 'pointStart', {});
      const interval = _.get(source, 'pointInterval.standardSeconds', 1);
      return moment(start).add((index + 1) * interval, 'seconds').calendar();
    });

    this.chartSeries.push(this.$translate.instant(`cdn_stats_legend_${this.statisticsSearchCriteria.dataType.toLowerCase()}_cdn`));
    this.chartSeries.push(this.$translate.instant(`cdn_stats_legend_${this.statisticsSearchCriteria.dataType.toLowerCase()}_backend`));

    this.chartData.push(statisticsValues.map(({ y: yValue }) => yValue));
    this.chartData.push(statisticsBackendValues.map(({ y: yValue }) => yValue));
  }

  openModal(template, controller) {
    return this.$uibModal.open({ template, controller });
  }

  addDomain() {
    return this.openModal(addDomainTemplate, 'CdnAddDomainsCtrl');
  }

  orderDomainRules() {
    return this.openModal(orderRuleTemplate, 'CacherulesAddCtrl');
  }

  orderQuota() {
    return this.openModal(orderQuotaTemplate, 'OrderQuotaCtrl');
  }
}

angular.module('App').controller('CdnStatisticsCtrl', CdnStatisticsCtrl);
