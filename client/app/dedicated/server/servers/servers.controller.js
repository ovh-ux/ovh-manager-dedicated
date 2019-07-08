import _ from 'lodash';

export default class ServersCtrl {
  /* @ngInject */

  constructor($q, $translate, User, dedicatedServers, iceberg, schema) {
    this.$q = $q;
    this.$translate = $translate;
    this.dedicatedServers = dedicatedServers;
    this.iceberg = iceberg;
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

  loadServers({
    offset, pageSize,
  }) {
    return this.iceberg('/dedicated/server')
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(parseInt(offset / pageSize, 10) + 1)
      .sort('name', 'ASC')
      .execute(null, true)
      .$promise
      .then(dedicatedServers => ({
        data: JSON.parse(_.get(dedicatedServers.data)),
        meta: {
          totalCount: _.get(dedicatedServers.headers, 'x-pagination-elements'),
        },
      }));
  }
}
