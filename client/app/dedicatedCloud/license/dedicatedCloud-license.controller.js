angular
  .module('App')
  .controller(
    'DedicatedCloudLicencesCtrl',
    class {
      /* @ngInject */
      constructor(
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $translate,

        currentService,
        DedicatedCloud,
      ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$translate = $translate;

        this.currentService = currentService;
        this.DedicatedCloud = DedicatedCloud;
      }

      $onInit() {
        this.$scope.licences = {
          model: null,
          spla: null,
          canActive: false,
        };

        this.$scope.loading = {
          licences: false,
          error: false,
        };

        this.$rootScope.$on(
          'datacenter.licences.reload',
          () => {
            this.$scope.loadLicences(true);
          },
        );

        this.$scope.loadLicences = () => this.loadLicences();
        this.$scope.canBeActivatedSpla = () => this.canBeActivatedSpla();
        this.$scope.enableLicense = () => this.enableLicense();

        return this.loadLicences();
      }

      loadLicences() {
        this.$scope.loading.licences = true;

        return this.DedicatedCloud
          .getDatacenterLicence(this.$stateParams.productId, this.currentService.usesLegacyOrder)
          .then((datacenter) => {
            this.$scope.licences.spla = datacenter.isSplaActive;
            this.$scope.licences.canActive = datacenter.canOrderSpla;
          })
          .catch((data) => {
            this.$scope.loading.error = true;
            this.$scope.setMessage(this.$translate.instant('dedicatedCloud_dashboard_loading_error'), angular.extend(data, { type: 'ERROR' }));
          })
          .finally(() => {
            this.$scope.loading.licences = false;
          });
      }

      canBeActivatedSpla() {
        return this.$scope.licences.spla === false && this.$scope.licences.canActive;
      }

      enableLicense() {
        if (!this.currentService.usesLegacyOrder) {
          this.$state.go('app.dedicatedClouds.license.enable');
        } else {
          this.$scope.setAction('license/enable/dedicatedCloud-license-enable');
        }
      }
    },
  );
