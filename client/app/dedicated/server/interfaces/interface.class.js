import {
  TYPE_PUBLIC,
  TYPE_VRACK,
} from './interfaces.constants';

export default class Interface {
  constructor(resource) {
    Object.assign(this, resource);
  }

  isPublic() {
    return this.type === TYPE_PUBLIC;
  }

  isPrivate() {
    return this.type === TYPE_VRACK;
  }

  hasFailoverIps() {
    return !_.isEmpty(this.failoverIps);
  }

  hasVrack() {
    return this.vrack !== null;
  }
}
