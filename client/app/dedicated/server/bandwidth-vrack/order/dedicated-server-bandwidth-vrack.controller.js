class ServerOrderBandwidthVrackCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    BandwidthVrackOrderService,
    ducPriceDisplayService,
    Server,
    User,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.BandwidthVrackOrderService = BandwidthVrackOrderService;
    this.ducPriceDisplayService = ducPriceDisplayService;
    this.Server = Server;
    this.User = User;
  }

  $onInit() {
    this.model = {};
    this.isLoading = false;
    this.isStep2Loading = true;
    this.existingBandwidth = this.$scope.currentActionData.bandwidth.vrack.bandwidth.value;

    this.steps = [
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isLoading,
        load: () => {
          this.isLoading = true;
          return this.Server
            .getBareMetalPrivateBandwidthOptions(
              this.$stateParams.productId,
              this.existingBandwidth,
            )
            .then((plans) => {
              this.plans = this.Server.getValidBandwidthPlans(plans, this.existingBandwidth);
            })
            .catch((error) => {
              this.$scope.resetAction();
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_loading_error'), error.data);
            }).finally(() => { this.isLoading = false; });
        },
      },
      {
        isValid: () => this.model.plan,
        isLoading: () => this.isStep2Loading,
        load: () => {
          this.isStep2Loading = true;
          return this.Server
            .getBareMetalPrivateBandwidthOrder(this.$stateParams.productId, this.model.plan)
            .then((res) => {
              res.bandwidth = _.find(this.plans, 'planCode', this.model.plan).bandwidth;
              res.planCode = this.model.plan;
              this.provisionalPlan = res;
              this.prices = this.ducPriceDisplayService.buildFromCheckout(res);
            })
            .catch((error) => {
              this.$scope.resetAction();
              return this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_loading_error'), error.data);
            }).finally(() => {
              this.isStep2Loading = false;
            });
        },
      },
    ];

    this.$scope.initFirstStep = this.steps[0].load.bind(this);
    this.$scope.initSecondStep = this.steps[1].load.bind(this);
    this.$scope.order = this.order.bind(this);

    this
      .User
      .getUser()
      .then((user) => {
        this.user = user;
      });
  }

  order() {
    if (this.model.plan) {
      this.isLoading = true;
      return this.Server.bareMetalPrivateBandwidthPlaceOrder(
        this.$stateParams.productId,
        this.model.plan,
        this.model.autoPay,
      )
        .then((result) => {
          this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_success', {
            t0: result.order.url,
          }), true);
          window.open(result.order.url);
        }).catch((error) => {
          this.$scope.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_vrack_error'), error.data);
        }).finally(() => {
          this.isLoading = false;
          this.$scope.resetAction();
        });
    }
    return null;
  }

  close() {
    this.$scope.resetAction();
  }
}
angular.module('App').controller('ServerOrderBandwidthVrackCtrl', ServerOrderBandwidthVrackCtrl);
