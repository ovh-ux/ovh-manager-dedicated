export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.useraccount.contacts.services', {
    url: '/services?serviceName&category',
    component: 'accountContactsService',
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      editContacts: /* @ngInject */ $state => service => $state.go('app.account.useraccount.contacts.services.edit', { service: service.serviceName }),
      getServiceInfos: /* @ngInject */
        AccountContactsService => service => AccountContactsService.getServiceInfos(service),
      goToContacts: /* @ngInject */ ($state, $timeout, Alerter) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go('app.account.useraccount.contacts.services', {}, {
          reload,
        });

        if (message) {
          promise.then(() => $timeout(() => Alerter.set(`alert-${type}`, message, 'useraccount.alerts.dashboardContacts')));
        }

        return promise;
      },

      services: /* @ngInject */ AccountContactsService => AccountContactsService.getServices(),
    },
  });
};
