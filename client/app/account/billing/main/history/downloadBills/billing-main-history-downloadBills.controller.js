angular.module('Billing').controller('BillingMainHistoryDonwloadBillsCtrl', class BillingMainHistoryDonwloadBillsCtrl {
  constructor($q, $translate, $uibModalInstance, Alerter, OvhApiMe) {
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.Alerter = Alerter;
    this.OvhApiMe = OvhApiMe;
  }

  $onInit() {
    this.archiveName = `${this.$translate.instant('billing_main_bills_tab')}_${moment().format('YYYY_MM_DD_hh_mm_ss')}`;
    this.billsCount = null;
    this.apiV7Request = this.OvhApiMe.Bill().v7().query().sort('date', 'DESC');
  }

  hasError() {
    return !!this.errorMessage || !!this.apiErrorMessage;
  }

  isDateFromBeforeDateTo() {
    this.errorMessage = null;
    if (!this.searchTo) {
      return true;
    }

    const searchFrom = moment(this.searchFrom, 'YYYY-MM-DD');
    const searchTo = moment(this.searchTo, 'YYYY-MM-DD');

    if (moment(searchFrom).isAfter(searchTo)) {
      this.errorMessage = this.$translate.instant('billing_main_bill_download_date_from_after_date_to');
      return false;
    }

    return true;
  }

  isDateRangeValid() {
    this.errorMessage = null;
    if (!this.searchTo) {
      return true;
    }

    const searchFrom = moment(this.searchFrom, 'YYYY-MM-DD');
    const searchTo = moment(this.searchTo, 'YYYY-MM-DD');

    if (moment(searchTo).diff(searchFrom, 'month') >= 1) {
      this.errorMessage = this.$translate.instant('billing_main_bill_download_date_range_invalid');
      return false;
    }

    return true;
  }

  getBills() {
    this.downloading = true;
    this.apiErrorMessage = null;

    if (!this.searchTo || moment(this.searchTo, 'YYYY-MM-DD').isSame(moment(this.searchFrom, 'YYYY-MM-DD'))) {
      this.apiV7Request = this.apiV7Request
        .addFilter('date', 'ge', moment(this.searchFrom, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        .addFilter('date', 'le', moment(this.searchFrom, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'));
    } else {
      this.apiV7Request = this.apiV7Request
        .addFilter('date', 'ge', moment(this.searchFrom, 'YYYY-MM-DD').format('YYYY-MM-DD'))
        .addFilter('date', 'le', moment(this.searchTo, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    return this.apiV7Request.clone().expand().execute().$promise
      .then(bills => this.downloadBillsSelection(bills.map(({ value }) => value)))
      .catch(() => {
        this.apiErrorMessage = this.$translate.instant('billing_main_bill_download_get_bills_error');
      })
      .finally(() => {
        this.downloading = false;
      });
  }

  downloadBillsSelection(bills) {
    const zip = new JSZip();
    this.billsCount = bills.length;

    return this.$q.all(bills
      .map(({ billId, pdfUrl }) => new Promise((resolve) => {
        JSZipUtils
          .getBinaryContent(pdfUrl, (error, data) => {
            if (error) {
              resolve(error);
            }
            resolve({ billId, file: data });
          });
      })))
      .then((result) => {
        result.forEach(({ file, error, billId }, index) => {
          if (error) {
            this.errorMessage = `${this.$translate.instant('billing_main_bill_download_error')} ${billId}`;
          }

          zip.file(billId, file, { binary: true });

          if (index === this.billsCount - 1) {
            zip.generateAsync({ type: 'blob' }).then((zipFile) => {
              saveAs(zipFile, this.archiveName);
            });
          }
        });
      });
  }
});
