export default class {
  /* @ngInject */
  constructor($filter, $translate, atInternet, billingRenewHelper) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.renewHelper = billingRenewHelper;
  }

  $onInit() {
    this.selectedServices = [];
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
}
