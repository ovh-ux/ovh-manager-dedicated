export default class {
  /* @ngInject */
  constructor(DedicatedServerInterfacesService) {
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  terminate() {
    this.loading = true;
    this.atTrack('terminate_ola');
    return this.InterfaceService.terminateOla(this.serverName)
      .then(() => {
        this.goBack().then(() => this.alertSuccess('server_success_ola_terminate'));
      })
      .catch((error) => {
        this.goBack().then(() => this.alertError('server_error_ola_terminate', error.data));
      });
  }
}
