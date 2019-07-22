export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  terminate() {
    this.isDeleting = true;
    return this.terminateService()
      .then(() => this.onSuccess())
      .catch(error => this.onError(error));
  }
}
