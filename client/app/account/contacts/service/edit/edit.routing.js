import _ from 'lodash';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.contacts.services.edit', {
    url: '/edit?service&categoryType',
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
        categoryType,
        getServiceInfos,
        serviceName,
        services,
      ) => getServiceInfos(_.find(services, { serviceName, category: categoryType })),
      serviceName: /* @ngInject */ $transition$ => $transition$.params().service,
      categoryType: /* @ngInject */ $transition$ => $transition$.params().categoryType,
    },
  });
};
