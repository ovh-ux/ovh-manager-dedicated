import { NIC_ALL } from './autorenew.constants';

export default class AutorenewCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    atInternet,
    BillingAutoRenew,
    billingRenewHelper,
    ouiDatagridService,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.BillingAutoRenew = BillingAutoRenew;
    this.renewHelper = billingRenewHelper;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.selectedServices = [];

    this.nicBillingFilter = this.$translate.instant(NIC_ALL);

    this.filtersOptions = {
      serviceType: {
        hideOperators: true,
        values: this.serviceTypes,
      },
      renewStatus: {
        hideOperators: true,
        values: this.BillingAutoRenew.getStatusTypes(),
      },
      renewExpiration: {
        hideOperators: true,
        values: this.BillingAutoRenew.getExpirationFilterTypes(),
      },
    };

    this.criteria = this.selectedType ? [{
      property: 'serviceType',
      operator: 'is',
      value: this.selectedType,
      title: this.getCriterionTitle(),
    }] : [];
  }

  getCriterionTitle() {
    return `${this.$translate.instant('autorenew_service')} ${this.$translate.instant('common_criteria_adder_operator_options_is')} ${this.serviceTypes[this.selectedType]}`;
  }

  getDatasToExport() {
    const servicesToExport = (this.selectedServices.length === 0)
      ? this.services
      : this.selectedServices;
    const datasToReturn = [[
      this.$translate.instant('autorenew_service_type'),
      this.$translate.instant('autorenew_service_name'),
      this.$translate.instant('autorenew_service_date'),
      this.$translate.instant('autorenew_service_renew_frequency_title'),
    ]];

    servicesToExport.forEach((service) => {
      datasToReturn.push([
        this.$translate.instant(`autorenew_service_type_${service.serviceType}`),
        service.serviceId,
        `${this.renewHelper.getRenewDateFormated(service)} ${this.$filter('date')(service.expiration, 'mediumDate')}`,
        service.renewLabel,
      ]);
    });

    return datasToReturn;
  }

  onRowSelection($rows) {
    this.selectedServices = $rows;
  }

  trackCSVExport() {
    this.atInternet.trackClick({
      name: 'export_csv',
      type: 'action',
      chapter1: 'services',
      chapter2: 'export',
    });
  }

  static getCriterion(criteria, property) {
    return _.get(_.find(criteria, { property }), 'value');
  }

  loadServices({
    pageSize, offset, criteria, sort,
  }) {
    return this.getServices(
      pageSize,
      offset - 1,
      AutorenewCtrl.getCriterion(criteria, null),
      AutorenewCtrl.getCriterion(criteria, 'serviceType'),
      AutorenewCtrl.getCriterion(criteria, 'expiration'),
      AutorenewCtrl.getCriterion(criteria, 'status'),
      { predicate: sort.property, reverse: sort.dir === -1 },
      this.nicBillingFilter === this.$translate.instant(NIC_ALL) ? null : this.nicBillingFilter,
    ).then(services => ({
      meta: {
        totalCount: services.count,
      },
      data: services.list.results,
    }));
  }

  onNicBillingChange() {
    this.ouiDatagridService.refresh('services', true);
  }
}
