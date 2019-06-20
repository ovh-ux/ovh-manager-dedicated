import _ from 'lodash';

export default class ServersCtrl {
  /* @ngInject */

  constructor($translate, User, dedicatedServers, schema) {
    this.$translate = $translate;
    this.dedicatedServers = dedicatedServers;
    this.schema = schema;
    this.user = User;

    this.user.getUrlOf('dedicatedOrder').then((orderUrl) => {
      this.orderUrl = orderUrl;
    });
  }

  static toUpperSnakeCase(str) {
    return _.snakeCase(str).toUpperCase();
  }

  getStateEnumFilter() {
    const states = _.get(this.schema.models, 'dedicated.server.StateEnum').enum;
    const filter = {
      values: {},
    };

    states.forEach((state) => {
      _.set(filter.values, state, this.$translate.instant(`server_configuration_state_${this.constructor.toUpperSnakeCase(state)}`));
    });

    return filter;
  }

  getDatacenterEnumFilter() {
    const datacenters = _.get(this.schema.models, 'dedicated.DatacenterEnum').enum;
    const filter = {
      values: {},
    };

    datacenters.forEach((datacenter) => {
      _.set(filter.values, datacenter, this.$translate.instant(`server_datacenter_${this.constructor.toUpperSnakeCase(datacenter)}`));
    });

    return filter;
  }
}
