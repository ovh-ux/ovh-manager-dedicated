angular
  .module('App')
  .controller('DedicatedCloudSubDatacenterVeeamCtrl', class {
    /* @ngInject */
    constructor(
      $rootScope,
      $scope,
      $stateParams,
      $translate,
      constants,
      currentService,
      DedicatedCloud,
      VEEAM_STATE_ENUM,
    ) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.constants = constants;
      this.currentService = currentService;
      this.DedicatedCloud = DedicatedCloud;
      this.VEEAM_STATE_ENUM = VEEAM_STATE_ENUM;
    }

    $onInit() {
      this.$scope.veeam = {
        model: null,
        constants: this.VEEAM_STATE_ENUM,
      };

      this.$scope.loading = false;
      this.$scope.currentService = this.currentService;

      this.$rootScope.$on('datacenter.veeam.reload', () => {
        this.$scope.loadVeeam(true);
      });

      return this.loadVeeam();
    }

    canBeDisabled() {
      return this.$scope.veeam.model
        && this.$scope.veeam.model.state === this.$scope.veeam.constants.ENABLED;
    }

    canBeActivated() {
      return this.$scope.veeam.model
        && this.$scope.veeam.model.state === this.$scope.veeam.constants.DISABLED;
    }

    loadVeeam(forceRefresh) {
      this.$scope.loading = true;

      return this.DedicatedCloud
        .getVeeam(this.$stateParams.productId, this.$stateParams.datacenterId, forceRefresh)
        .then((veeam) => {
          this.$scope.veeam.model = veeam;
        })
        .catch((data) => {
          this.$scope.setMessage(this.$translate.instant('dedicatedCloud_tab_veeam_loading_error'), angular.extend(data, { type: 'ERROR' }));
        })
        .finally(() => {
          this.$scope.loading = false;
        });
    }
  });
