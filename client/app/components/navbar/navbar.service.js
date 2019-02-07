import template from './navbar-menu-header/navbar-menu-header.component.html';

{
  class Navbar {
    constructor($compile, $rootScope, $timeout) {
      this.$compile = $compile;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
    }

    buildMenuHeader(content) {
      const compiledTemplate = this.$compile(template)(_.merge(
        this.$rootScope.$new(true),
        { $ctrl: { content } },
      ));
      // $timeout is required in order to let angular's scope $digest
      return this.$timeout(() => compiledTemplate.html());
    }
  }

  angular
    .module('services')
    .service('Navbar', Navbar);
}
