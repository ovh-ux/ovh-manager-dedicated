import {
  PHYSICAL_TYPE,
  VIRTUAL_TYPE,
} from './interfaces.constants';

export default class Interface {
  constructor(resource) {
    Object.assign(this, resource);
  }

  isPhysical() {
    return this.type === PHYSICAL_TYPE.public
      || this.type === PHYSICAL_TYPE.private
      || this.type === PHYSICAL_TYPE.privateLag;
  }

  isVirtual() {
    return !this.isPhysical();
  }

  isPublic() {
    return this.type === PHYSICAL_TYPE.public
      || this.type === VIRTUAL_TYPE.public;
  }

  isPrivate() {
    return this.type === PHYSICAL_TYPE.private
      || this.type === PHYSICAL_TYPE.privateLag
      || this.type === VIRTUAL_TYPE.vrack
      || this.type === VIRTUAL_TYPE.vrackAggregation;
  }

  hasFailoverIps() {
    return !_.isEmpty(this.failoverIps);
  }

  hasVrack() {
    return this.vrack !== null;
  }
}
