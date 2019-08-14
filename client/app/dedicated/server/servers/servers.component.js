import controller from './servers.controller';
import template from './servers.html';

export default {
  bindings: {
    filter: '<',
    dedicatedServers: '<',
    dedicatedServersServices: '<',
    orderUrl: '<',
    serverStateEnum: '<',
    datacenterEnum: '<',
    onListParamsChange: '<',
    getServerDashboardLink: '<',
    paginationNumber: '<',
    paginationSize: '<',
    paginationTotalCount: '<',
    sort: '<',
    sortOrder: '<',
  },
  controller,
  template,
};
