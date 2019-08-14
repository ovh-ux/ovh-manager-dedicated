import _ from 'lodash';

export default class ServersCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    ouiDatagridService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ouiDatagridService = ouiDatagridService;
  }

  $onInit() {
    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: _.get(criteria, 'field') || 'name',
      operator: _.get(criteria, 'comparator'),
      value: criteria.reference[0],
    }));

    this.stateEnumFilter = this.getEnumFilter(this.serverStateEnum, 'server_configuration_state_');
    this.datacenterEnumFilter = this.getEnumFilter(this.datacenterEnum, 'server_datacenter_');
  }

  static toUpperSnakeCase(str) {
    return _.snakeCase(str).toUpperCase();
  }

  getEnumFilter(list, translationPrefix) {
    return {
      values: _.reduce(
        list,
        (result, item) => ({
          ...result,
          [item]: this.$translate.instant(`${translationPrefix}${this.constructor.toUpperSnakeCase(item)}`),
        }),
        {},
      ),
    };
  }

  getSorting(property) {
    return this.sort === property ? this.sortOrder : '';
  }

  loadServers() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    _.set(this.ouiDatagridService, 'datagrids.dg-servers.paging.offset', currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount);

    const data = _.get(this.dedicatedServers, 'data')
      .map((server) => {
        const service = _.find(
          this.dedicatedServersServices.data, s => s.resource.name === server.name,
        );

        if (service) {
          _.set(server, 'displayName', service.resource.displayName);
        }
        return server;
      });

    return this.$q.resolve({
      data,
      meta: {
        totalCount: this.paginationTotalCount,
      },
    });
  }

  onPageChange({ pageSize, offset }) {
    this.onListParamsChange({
      page: parseInt(offset / pageSize, 10) + 1,
      pageSize,
    });
  }

  onCriteriaChange($criteria) {
    const filter = $criteria.map(criteria => ({
      field: _.get(criteria, 'property') || 'name',
      comparator: criteria.operator,
      reference: [criteria.value],
    }));

    this.onListParamsChange({
      filter: JSON.stringify(filter),
    });
  }

  onSortChange({ name, order }) {
    this.onListParamsChange({
      sort: name,
      sortOrder: order,
    });
  }
}
