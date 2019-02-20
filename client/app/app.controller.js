angular
  .module('App')
  .controller('AppCtrl', class AppCtrl {
    constructor(
      $rootScope,
      User,
    ) {
      this.$rootScope = $rootScope;
      this.User = User;
    }

    $onInit() {
      return this.User
        .getUser()
        .then(() => {
          this.$rootScope.managerPreloadHide += ' manager-preload-hide';
        });
    }
  });
