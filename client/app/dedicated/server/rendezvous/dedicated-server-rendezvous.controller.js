angular.module('App').controller('DedicatedServerRendezVousCtrl', class DedicatedServerRendezVousCtrl {
  constructor($q, $state, $stateParams, $translate, Alerter, ovhUserPref) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.ovhUserPref = ovhUserPref;
    this.Alerter = Alerter;
    this.stopBother = false;
    this.serversRendezVousToStopBother = [];
  }

  $onInit() {
    this.ovhUserPref
      .getValue('SERVER_RENDEZVOUS_STOP_BOTHER')
      .then((data) => {
        this.serversRendezVousToStopBother = data;
      })
      .catch((err) => {
        if (_.get(err, 'status') === 404) {
          this.serversRendezVousToStopBother = [];
        }
      });
  }

  setStopBother() {
    if (this.stopBother) {
      this.serversRendezVousToStopBother.push(this.$stateParams.productId);
      return this.ovhUserPref.assign('SERVER_RENDEZVOUS_STOP_BOTHER', this.serversRendezVousToStopBother);
    }
    return this.$q.when(true);
  }

  onDismiss() {
    this.setStopBother().finally(() => {
      this.$state.go('^');
    });
  }
});
