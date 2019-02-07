const resolveUsersWhoCanReceiveTextMessages = /* @ngInject */ (
  $q,
  $transition$,
  DedicatedCloud,
) => $transition$.params().usersWhoCanReceiveTextMessages
    || DedicatedCloud
      .getUsers($transition$.params().productId)
      .then(ids => $q
        .all(ids
          .map(id => DedicatedCloud
            .getUserDetail($transition$.params().productId, id))));

export default {
  params: {
    usersWhoCanReceiveTextMessages: null,
  },
  resolve: {
    usersWhoCanReceiveTextMessages: resolveUsersWhoCanReceiveTextMessages,
  },
};
