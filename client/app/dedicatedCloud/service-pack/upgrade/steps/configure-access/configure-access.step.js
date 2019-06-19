import component from './configure-access.component';
import { name as serviceName } from './configure-access.service';
import state from './configure-access.state';

export default {
  componentName: component.name,
  name: 'configure-access',
  serviceName,
  state,
  translationId: 'dedicatedCloud_servicePack_requiredConfiguration_stepper_header',
};
