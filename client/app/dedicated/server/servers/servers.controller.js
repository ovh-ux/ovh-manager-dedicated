export default class ServersCtrl {
  /* @ngInject */

  constructor($translate, dedicatedServers) {
    this.dedicatedServers = dedicatedServers;
  }
}
