const resolveURLToGuides = /* @ngInject */ (
  $transition$,
  User,
) => $transition$.params().urlToGuides
    || User
      .getUrlOf('guides')
      .then(({ privateCloudHome }) => privateCloudHome);

export default {
  params: {
    urlToGuides: null,
  },
  resolve: {
    urlToGuides: resolveURLToGuides,
  },
};
