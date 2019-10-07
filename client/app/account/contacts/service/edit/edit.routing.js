import _ from 'lodash';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.services.edit', {
    url: '/edit?service',
    views: {
      modal: {
        component: 'accountContactsServiceEdit',
      },
    },
    layout: 'modal',
    resolve: {
      changeContact: /* @ngInject */
        AccountContactsService => service => AccountContactsService.changeContact(service),
      goBack: /* @ngInject */ goToContacts => goToContacts,
      service: /* @ngInject */ (
        getServiceInfos,
        serviceName,
        services,
      ) => getServiceInfos(_.find(services, { serviceName })),
      serviceName: /* @ngInject */ $transition$ => $transition$.params().service,
    },
  });
};
