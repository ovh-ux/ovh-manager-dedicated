import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $transitions,
    $translate,
    Alerter,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.$transitions.onError(
      { to: `${this.$state.$current.parent.name}.**` },
      transition => (transition.error().type !== 6
        ? this.$q.when()
        : this.goBack().then(() => this.displayErrorMessage(transition.error()))),
    );
  }

  displayErrorMessage(error) {
    const message = this.$translate.instant('dedicatedCloud_servicePack_confirmation_order_failure');
    let errorMessage = _.get(error.detail, 'data', error.detail);

    if (!_.isString(errorMessage)) {
      errorMessage = error.message;
    }

    this.Alerter.alertFromSWS(message, { message: errorMessage, type: 'ERROR' });
  }
}
