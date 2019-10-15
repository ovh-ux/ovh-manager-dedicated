import _ from 'lodash';

export default class BillingOrdersCtrl {
  /* @ngInject */
  constructor($q, $log, $translate, OvhApiMeOrder, constants,
    orders, schema, criteria, currentUser, filter, goToOrder,
    updateFilterParam, billingFeatureAvailability) {
    this.$q = $q;
    this.$log = $log;
    this.$translate = $translate;
    this.OvhApiMeOrder = OvhApiMeOrder;
    this.orders = orders;
    this.schema = schema;
    this.criteria = criteria || [];
    this.filter = filter;
    this.goToOrder = goToOrder;
    this.updateFilterParam = updateFilterParam;
    this.billingGuideUrl = constants.urls[currentUser.ovhSubsidiary].guides.billing;
    this.allowOrderTracking = billingFeatureAvailability.allowOrderTracking();
  }

  loadRow($row) {
    return this.OvhApiMeOrder.v6()
      .getStatus({ orderId: $row.orderId })
      .$promise
      .then(status => _.assign($row, status));
  }

  getStateEnumFilter() {
    const states = _.get(this.schema.models, 'billing.order.OrderStatusEnum').enum;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      _.set(filter.values, state, this.$translate.instant(`orders_order_status_${state}`));
    });

    return filter;
  }

  onCriteriaChange(criteria) {
    this.criteria = criteria;
    try {
      this.filter = encodeURIComponent(JSON.stringify(criteria.map(c => _.omit(c, 'title'))));
      this.updateFilterParam(this.filter);
    } catch (err) {
      this.$log.error(err);
    }
  }
}
