import configureAccess from './steps/configure-access/configure-access.step';
import configureUsers from './steps/configure-users/configure-users.step';
import selection from './steps/selection/selection.step';
import validation from './steps/validation/validation.step';

export const ACTIVATION_TYPES = {
  basic: [
    selection,
  ],
  certification: [
    selection,
    configureAccess,
    configureUsers,
    validation,
  ],
};

ACTIVATION_TYPES.all = _.uniq(
  _.map(
    _.flatten(
      _.values(ACTIVATION_TYPES),
    ),
    ({ name }) => {
      const stepName = _.camelCase(name);

      return `ovhManagerPccServicePackUpgrade${stepName[0].toUpperCase() + stepName.slice(1)}`;
    },
  ),
);

export default {
  ACTIVATION_TYPES,
};
