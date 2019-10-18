export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.mfaEnrollment', {
    url: '/mfa-enrollment',
    views: {
      'app@': {
        component: 'mfaEnrollment',
      },
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      from: /* @ngInject */ $transition$ => $transition$.$from().name,
    },
  });
};
