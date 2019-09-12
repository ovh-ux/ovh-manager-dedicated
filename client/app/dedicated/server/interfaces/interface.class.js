import {
  PHYSICAL_TYPE_PUBLIC,
  PHYSICAL_TYPE_PRIVATE,
  PHYSICAL_TYPE_PRIVATE_LAG,
  VIRTUAL_TYPE_PUBLIC,
  VIRTUAL_TYPE_VRACK,
  VIRTUAL_TYPE_VRACK_AGGREGATION,
} from './interfaces.constants';

export default class Interface {
  constructor(resource) {
    Object.assign(this, resource);
  }

  isPublic() {
    return this.type === PHYSICAL_TYPE_PUBLIC
      || this.type === VIRTUAL_TYPE_PUBLIC;
  }

  isPrivate() {
    return this.type === PHYSICAL_TYPE_PRIVATE
      || this.type === PHYSICAL_TYPE_PRIVATE_LAG
      || this.type === VIRTUAL_TYPE_VRACK
      || this.type === VIRTUAL_TYPE_VRACK_AGGREGATION;
  }

  hasFailoverIps() {
    return !_.isEmpty(this.failoverIps);
  }

  hasVrack() {
    return this.vrack !== null;
  }
}
