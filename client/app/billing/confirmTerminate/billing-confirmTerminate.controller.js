export default class {
  constructor(
    $q,
    $stateParams,
    BillingTerminate,
    BillingTerminateLegacy,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.BillingTerminate = BillingTerminate;
    this.BillingTerminateLegacy = BillingTerminateLegacy;
  }

  $onInit() {
    this.reasons = [
      'LACK_OF_PERFORMANCES',
      'TOO_EXPENSIVE',
      'TOO_HARD_TO_USE',
      'NOT_RELIABLE',
      'NOT_NEEDED_ANYMORE',
      'MIGRATED_TO_COMPETITOR',
      'MIGRATED_TO_ANOTHER_OVH_PRODUCT',
      'FEATURES_DONT_SUIT_ME',
      'UNSATIFIED_BY_CUSTOMER_SUPPORT',
      'NO_ANSWER',
      'OTHER',
    ];
    this.futureUses = [
      'SUBSCRIBE_AN_OTHER_SERVICE',
      'SUBSCRIBE_SIMILAR_SERVICE_WITH_COMPETITOR',
      'SUBSCRIBE_OTHER_KIND_OF_SERVICE_WITH_COMPETITOR',
      'NOT_REPLACING_SERVICE',
      'NO_ANSWER',
      'OTHER',
    ];

    this.serviceId = this.$stateParams.id;
    this.token = this.$stateParams.token;

    this.serviceState = null;
    this.loading = true;
    this.terminating = false;
    this.error = false;
    this.globalError = null;
    this.currentError = '';

    if (!this.token || !this.serviceId) {
      this.globalError = true;
      return;
    }

    this.USVersion = _.get(this, 'currentUser.ovhSubsidiary') === 'US';

    this.loadService().catch((error) => {
      this.globalError = true;
      this.currentError = error;
    });
  }

  loadService() {
    return this.BillingTerminate
      .getServiceApi(this.serviceId)
      .catch(() => this.BillingTerminateLegacy.getServiceApi(this.serviceId))
      .then((serviceApi) => {
        this.serviceApi = serviceApi;
        this.serviceState = _.get(serviceApi, 'resource.state');
        return this.BillingTerminateLegacy.getServiceInfo(serviceApi);
      })
      .then((serviceInfos) => {
        this.serviceInfos = serviceInfos;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  confirmTermination() {
    this.terminating = true;
    this.BillingTerminateLegacy
      .confirmTermination(
        this.serviceApi,
        this.reason,
        this.commentary,
        this.token,
      )
      .then(() => {
        this.error = false;
        this.serviceState = 'suspending';
      })
      .catch((error) => {
        this.error = true;
        this.currentError = error;
      })
      .finally(() => {
        this.terminating = false;
      });
  }
}
