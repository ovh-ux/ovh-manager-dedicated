const resolveUsersWhoCanReceiveSMS = /* @ngInject */ (
  $q,
  $transition$,
  DedicatedCloud,
) => $transition$.params().usersWhoCanReceiveSMS
    || DedicatedCloud
      .getUsers($transition$.params().productId)
      .then(ids => $q
        .all(ids
          .map(id => DedicatedCloud
            .getUserDetail($transition$.params().productId, id))));

export default {
  params: {
    usersWhoCanReceiveSMS: null,
  },
  resolve: {
    usersWhoCanReceiveSMS: resolveUsersWhoCanReceiveSMS,
  },
};
