angular.module('App')
  .controller('SessionCtrl', class {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $document,
      $timeout,
      $transitions,
      $translate,
      User,
    ) {
      _.set($document, 'title', $translate.instant('global_app_title'));
      // Scroll to anchor id
      $scope.scrollTo = (id) => {
        // Set focus to target
        if (_.isString(id)) {
          $document.find(`#${id}`)[0].focus();
        }
      };

      [this.currentLanguage] = $translate.use().split('_');

      User.getUser().then((user) => {
        this.user = user;
        $timeout(() => {
          $rootScope.$broadcast('ovh-chatbot:resume');
        });
      });

      $transitions.onStart({},
        () => this.closeSidebar());
    }

    openSidebar() {
      this.sidebarIsOpen = true;
    }

    closeSidebar() {
      this.sidebarIsOpen = false;
    }
  });
