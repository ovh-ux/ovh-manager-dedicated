export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing', {
    url: '/billing',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
    resolve: {
      denyEnterprise: ($q, currentUser) => {
        if (currentUser.isEnterprise) {
          return $q.reject({
            status: 403,
            message: 'Access forbidden for enterprise accounts',
            code: 'FORBIDDEN_BILLING_ACCESS',
          });
        }

        return false;
      },
    },
  });
};
