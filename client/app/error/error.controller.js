export default class {
  /* @ngInject */
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  $onInit() {
    this.$rootScope.managerPreloadHide += ' manager-preload-hide';
  }
}
