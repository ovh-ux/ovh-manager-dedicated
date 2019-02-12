const resolveOrderedServicePack = /* @ngInject */ $transition$ => $transition$
  .params().orderedServicePack;

const resolveOrderURL = /* @ngInject */ $transition$ => $transition$
  .params().orderURL;

const resolveURLToGuides = /* @ngInject */ (
  $transition$,
  User,
) => $transition$.params().urlToGuides
      || User
        .getUrlOf('guides')
        .then(({ privateCloudHome }) => privateCloudHome);

export default {
  params: {
    orderedServicePack: null,
    orderURL: null,
    urlToGuides: null,
  },
  resolve: {
    orderedServicePack: resolveOrderedServicePack,
    orderURL: resolveOrderURL,
    urlToGuides: resolveURLToGuides,
  },
};
