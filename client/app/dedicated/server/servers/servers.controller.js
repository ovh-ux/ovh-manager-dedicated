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
  }

  $onInit() {
    this.criteria = JSON.parse(this.filter).map(criteria => ({
      property: _.get(criteria, 'field') || 'name',
      operator: 'contains',
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

  loadServers() {
    const currentOffset = this.paginationNumber * this.paginationSize;
    _.set(this.ouiDatagridService, 'datagrids.dg-servers.paging.offset', currentOffset < this.paginationTotalCount ? currentOffset : this.paginationTotalCount);

    return this.$q.resolve({
      data: _.get(this.dedicatedServers, 'data'),
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

  onCriteriaChanged($criteria) {
    const filter = $criteria.map(criteria => ({
      field: _.get(criteria, 'property') || 'name',
      comparator: _.get(this.FILTER_OPERATORS, criteria.operator),
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
