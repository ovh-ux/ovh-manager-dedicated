export default class {
  /* @ngInject */
  constructor(DedicatedServerInterfacesService) {
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  $onInit() {
    this.loading = true;
    this.taskPolling.promise.then(() => {
      this.loading = false;
    });
  }
}