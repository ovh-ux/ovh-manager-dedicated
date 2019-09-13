export default class {
  /* @ngInject */
  constructor($scope, $state, $translate, Server) {
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.Server = Server;
  }

  $onInit() {
    this.model = {};
    this.isLoading = false;
    this.existingBandwidth = this.bandwidth.bandwidth.OvhToInternet.value;


    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOptions(this.serverName, this.existingBandwidth)
            .then((plans) => {
              this.plans = this.Server.getValidBandwidthPlans(plans, this.existingBandwidth);
            })
            .catch((error) => {
              this.$state.go('^');
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
            })
            .finally(() => { this.isLoading = false; });
        },
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPublicBandwidthOrder(this.serverName, this.model.plan)
            .then((res) => {
              res.bandwidth = _.find(this.plans, 'planCode', this.model.plan).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
            })
            .catch((error) => {
              this.$state.go('^');
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
            }).finally(() => { this.isLoading = false; });
        },
      },
    ];
    this.$scope.initFirstStep = () => this.steps[0].load();
    this.$scope.initSecondStep = () => this.steps[1].load();
    this.$scope.order = () => this.order();
    this.$scope.cancel = () => this.$state.go('^');
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      this.Server.bareMetalPublicBandwidthPlaceOrder(
        this.serverName, this.model.plan, this.model.autoPay,
      ).then((result) => {
        this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_success', {
          t0: result.order.url,
        }), true);
        window.open(result.order.url);
      }).catch((error) => {
        this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), error.data);
      }).finally(() => {
        this.isLoading = false;
        this.$state.go('^');
      });
    }
  }

  close() {
    this.$state.go('^');
  }
}
