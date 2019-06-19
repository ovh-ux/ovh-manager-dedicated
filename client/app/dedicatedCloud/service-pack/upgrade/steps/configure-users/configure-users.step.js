import component from './configure-users.component';
import { name as serviceName } from './configure-users.service';
import state from './configure-users.state';

export default {
  componentName: component.name,
  name: 'configure-users',
  serviceName,
  state,
  translationId: 'dedicatedCloud_servicePack_smsActivation_stepper_header',
};
