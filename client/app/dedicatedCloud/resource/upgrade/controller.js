import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    $window,
    Alerter,
    OvhApiDedicatedCloud,
    OvhApiOrder,
    OvhHttp,
    User,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiOrder = OvhApiOrder;
    this.OvhHttp = OvhHttp;
    this.User = User;
  }

  $onInit() {
    this.bindings = {
      isLoading: false,
    };

    return this.fetchOVHSubsidiary()
      .then(() => this.fetchInitialData());
  }

  fetchOVHSubsidiary() {
    return this.User
      .getUser()
      .then(({ ovhSubsidiary }) => {
        this.ovhSubsidiary = ovhSubsidiary;
      });
  }

  fetchInitialData() {
    this.bindings.isLoading = true;

    return this.$q
      .all({
        catalog: this.OvhApiOrder.CatalogFormatted().v6()
          .get({
            catalogName: 'privateCloud',
            ovhSubsidiary: this.ovhSubsidiary,
          }).$promise,
        expressURL: this.User
          .getUrlOf('express_order'),
        service: this.OvhApiDedicatedCloud.v6()
          .get({ serviceName: this.$stateParams.productId }).$promise,
        target: this.fetchTarget(),
      })
      .then(({
        catalog,
        expressURL,
        service,
        target,
      }) => {
        this.expressURL = expressURL;
        this.service = service;

        this.plan = this.getPlanFromCatalog(target, catalog);

        [this.bindings.renewalPeriod] = this.plan.details.pricings[`pcc-servicepack-${service.servicePackName}`];
      })
      .catch(({ data }) => {
        this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_order_loading_error'), data, 'dedicatedCloud_alert');
        this.$scope.$dismiss();
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }

  fetchTarget() {
    if (this.$stateParams.type === 'host') {
      return this.OvhApiDedicatedCloud.Datacenter().Host().v6()
        .get({
          datacenterId: this.$stateParams.datacenterId,
          hostId: this.$stateParams.id,
          serviceName: this.$stateParams.productId,
        }).$promise;
    }

    return this.OvhApiDedicatedCloud.Filer().v6()
      .get({
        filerId: this.$stateParams.id,
        serviceName: this.$stateParams.productId,
      }).$promise
      .catch(() => this.OvhApiDedicatedCloud.Datacenter().Filer().v6()
        .get({
          datacenterId: this.$stateParams.datacenterId,
          filerId: this.$stateParams.id,
          serviceName: this.$stateParams.productId,
        }).$promise);
  }

  getPlanFromCatalog(target, catalog) {
    return _.first(
      _.filter(
        _.find(
          catalog.plans[0].addonsFamily,
          { family: this.$stateParams.type },
        ).addons,
        addon => addon.plan.planCode === target.profileCode || target.profile,
      ),
    ).plan;
  }

  placeOrder() {
    const stringifiedExpressParameters = JSURL.stringify([{
      productId: 'privateCloud',
      serviceName: this.$stateParams.productId,
      planCode: this.plan.planCode,
      duration: 'P1M',
      pricingMode: `pcc-servicepack-${this.service.servicePackName}`,
      quantity: 1,
      configuration: [{
        label: 'datacenter_id',
        value: this.$stateParams.datacenterId,
      }, {
        label: 'hourly_id',
        value: this.$stateParams.id,
      }],
    }]);

    const window = this.$window.open();
    window.opener = null;
    window.location = `${this.expressURL}review?products=${stringifiedExpressParameters}`;
    window.target = '_blank';

    this.$scope.$dismiss();
  }
}
