export default class DedicatedServerInterfacesOlaActivationCtrl {
  constructor($window, OvhApiOrderCart) {
    this.$window = $window;
    this.CartService = OvhApiOrderCart;
  }

  activate() {
    this.window = this.$window.open('_blank');
    this.window.opener = null;

    this.CartService.v6().post({
      ovhSubsidiary: this.user.ovhSubsidiary,
    })
      .then((cart) => {
        this.cartId = cart.cartId;
        return this.CartService.v6().assign({ cartId: this.cartId });
      })
      .then(() => this.CartService.ServiceOption().v6().post({
        productName: 'baremetalServers',
        serviceName: this.serviceName,
        planCode: 'ovh-link-aggregation-infra',
        duration: 'P1M',
        pricingMode: 'default',
        quantity: 1,
        cartId: this.cartId,
      }))
      .then(() => this.CartService.v6().checkout({ cartId: this.cartId }, {
        autoPayWithPreferredPaymentMethod: false,
      }))
      .then((order) => {
        this.window.url = order.url;
        this.goBack();
      });
  }
}
