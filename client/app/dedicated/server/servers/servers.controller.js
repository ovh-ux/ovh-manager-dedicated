import _ from 'lodash';

export default class ServersCtrl {
  /* @ngInject */

  constructor(
    $q,
    $state,
    $timeout,
    $translate,
    User,
    dedicatedServers,
    iceberg,
    ouiDatagridService,
    schema,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.dedicatedServers = dedicatedServers;
    this.iceberg = iceberg;
    this.ouiDatagridService = ouiDatagridService;
    this.schema = schema;
    this.user = User;

    this.FILTER_OPERATORS = {
      contains: 'like',
      is: 'eq',
      isAfter: 'gt',
      isBefore: 'lt',
      isNot: 'ne',
      smaller: 'lt',
      bigger: 'gt',
      startsWith: 'like',
      endsWith: 'like',
    };

    this.user.getUrlOf('dedicatedOrder').then((orderUrl) => {
      this.orderUrl = orderUrl;
    });
  }

  $onInit() {
    this.criteria = JSON.parse(this.$state.params.filter).map(criteria => ({
      property: _.get(criteria, 'field') || 'name',
      operator: 'contains',
      value: criteria.reference[0],
    }));

    console.log(this.criteria);
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

  loadServers() {
    const currentOffset = _.get(this.dedicatedServers.headers, 'x-pagination-number') * _.get(this.dedicatedServers.headers, 'x-pagination-size');
    const totalCount = _.get(this.dedicatedServers.headers, 'x-pagination-elements');
    _.set(this.ouiDatagridService, 'datagrids.dg-servers.paging.offset', currentOffset < totalCount ? currentOffset : totalCount);

    return this.$q.resolve({
      data: _.get(this.dedicatedServers, 'data'),
      meta: {
        totalCount,
      },
    });
  }

  onPageChange({ pageSize, offset }) {
    this.$state.go('.', {
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    }, {
      notify: false,
    });
  }

  onCriteriaChanged($criteria) {
    const filter = $criteria.map(criteria => ({
      field: _.get(criteria, 'property') || 'name',
      comparator: _.get(this.FILTER_OPERATORS, criteria.operator),
      reference: [criteria.value],
    }));

    this.$state.go('.', {
      filter: JSON.stringify(filter),
    }, {
      notify: false,
    });
  }

  onSortChange({ name, order }) {
    this.$state.go('.', {
      sort: name,
      sortOrder: order,
    }, {
      notify: false,
    });
  }
}
