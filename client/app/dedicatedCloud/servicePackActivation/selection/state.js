const header = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_header`);

const subheader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloud_servicePackActivation_selection_${$transition$.params().activationType}_subheader`);

export default {
  resolve: {
    header,
    subheader,
  },
};
