angular
  .module('App')
  .controller(
    'DedicatedCloudSubDatacenterVeeamCtrl',
    class {
      /* @ngInject */
      constructor(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $translate,

        DedicatedCloud,
        currentService,
        veeam,

        VEEAM_STATE_ENUM,
      ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;

        this.DedicatedCloud = DedicatedCloud;
        this.currentService = currentService;
        this.veeam = veeam;

        this.VEEAM_STATE_ENUM = VEEAM_STATE_ENUM;
      }

      $onInit() {
        this.$scope.veeam = {
          model: this.veeam,
          constants: this.VEEAM_STATE_ENUM,
        };

        this.$scope.canBeActivated = () => this.canBeActivated();
        this.$scope.canBeDisabled = () => this.canBeDisabled();
      }

      canBeActivated() {
        return this.$scope.veeam.model
          && this.$scope.veeam.model.state === this.$scope.veeam.constants.DISABLED;
      }

      canBeDisabled() {
        return this.$scope.veeam.model
          && this.$scope.veeam.model.state === this.$scope.veeam.constants.ENABLED;
      }
    },
  );
