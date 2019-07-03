class ServerOrderAgoraBandwidthVrackCtrl {
  constructor($scope, $stateParams, $translate, User, Server, BandwidthVrackOrderService) {
    this.$scope = $scope;
    this.BandwidthVrackOrderService = BandwidthVrackOrderService;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Server = Server;
    this.User = User;
    this.model = {};
    this.isLoading = false;
    this.existingBandwidth = this.$scope.currentActionData.bandwidth.vrack.bandwidth;
    this.units = {
      model: [
        {
          label: 'Mbps',
          value: 1,
        },
        {
          label: 'Gbps',
          value: 1000,
        },
        {
          label: 'Tbps',
          value: Math.pow(1000, 2), // eslint-disable-line no-restricted-properties
        },
      ],
    };
  }

  $onInit() {
    this.isLoading = true;
    this.Server
      .getBareMetalPrivateBandwidthOptions(
        this.$stateParams.productId,
        this.existingBandwidth,
      ).then((result) => {
        this.isLoading = false;
        if (result.length < 1) {
          this.$scope.resetAction();
          _.set(this.data, 'type', 'ERROR');
          this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_error'), this.data);
        }
        this.plans = result;
      }).catch((err) => {
        this.$scope.resetAction();
        this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_loading_error'), err.data);
      });
    this.User.getUser().then((user) => {
      this.user = user;
    }).catch(err => this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_loading_error'), err.data));
  }

  // Display size with unit (recursive)
  getDisplaySize(octetsSize, _unitIndex) {
    let unitIndex = _unitIndex;
    if (!_.isNumber(octetsSize)) {
      if (!_.isNumber(unitIndex)) {
        unitIndex = 0;
      }
      if (octetsSize >= 1000 && unitIndex < this.units.model.length - 1) {
        return this.getDisplaySize(octetsSize / 1000, unitIndex + 1);
      }
      return `${parseFloat(octetsSize)} ${this.$translate.instant(`unit_size_${this.units.model[unitIndex].label}`)}`;
    }
    return '';
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
          this.isLoading = false;
          this.$scope.resetAction();
          this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_success', {
            t0: result.order.url,
          }), true);
          window.open(result.order.url);
        }).catch((error) => {
          this.$scope.resetAction();
          this.$scope.setMessage(this.$translate.instant('server_cancel_bandwidth_cancel_vrack_error'), error.data);
        });
    }
    return null;
  }

  close() {
    this.$scope.resetAction();
  }
}
angular.module('App').controller('ServerOrderAgoraBandwidthVrackCtrl', ServerOrderAgoraBandwidthVrackCtrl);
