import angular from 'angular';

import template from './billing-payment-method-add.html';
import controller from './billing-payment-method-add.controller';

angular
  .module('Billing')
  .config(($stateProvider, $urlRouterProvider) => {
    const name = 'app.account.billing.payment.method.add';

    $stateProvider.state(name, {
      url: '/add',
      template,
      controller,
      controllerAs: '$ctrl',
      translations: ['./'],
    });

    $urlRouterProvider.when(
      /^\/billing\/mean\/add$/,
      ($location, $state) => $state.go(name),
    );
  });
