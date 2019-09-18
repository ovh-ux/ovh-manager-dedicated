export default class DedicatedServerInterfacesOlaActivationCtrl {
  constructor(OvhApiOrderCart) {
    this.CartService = OvhApiOrderCart;
  }

  activate() {
    this.CartService.v6().post({
      ovhSubsidiary: this.user.ovhSubsidiary,
    }).then(cart => this.CartService.ServiceOption().v6().post({
      productName: 'dedicated',
      serviceName: this.serviceName,
      planCode: 'ovh-link-aggregation-infra',
      duration: 'P1M',
      pricingMode: 'default',
      quantity: 1,
      cartId: cart.cartId,
    }));
  }
}
