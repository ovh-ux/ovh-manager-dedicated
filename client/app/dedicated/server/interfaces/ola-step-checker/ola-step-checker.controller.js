export default class {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  goToOlaConfiguration() {
    this.$state.go('app.dedicated.server.interfaces.ola');
  }
}
