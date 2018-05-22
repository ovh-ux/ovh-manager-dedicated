angular.module("Module.license").controller("LicenseSplaAddCtrl", class LicenseSplaAddCtrl {

    constructor ($state, $translate, Alerter, License) {
        this.$state = $state;
        this.$translate = $translate;
        this.Alerter = Alerter;
        this.License = License;
    }

    $onInit () {
        this.options = {
            availableServers: null,
            availableTypes: null
        };

        this.selected = {
            serial: null,
            type: null,
            server: null
        };
    }

    addSpla () {
        this.License.splaAdd(this.selected.server, { serialNumber: this.selected.serial, type: this.selected.type }).then(
            () => {
                this.Alerter.alertFromSWS(this.$translate.instant("license_spla_add_success"), true);
            },
            ({ data }) => {
                this.Alerter.alertFromSWS(this.$translate.instant("license_spla_add_fail"), data);
            }
        );
    }

    close () {
        this.$state.go("^");
    }

    load () {
        this.License.splaAddAvailableServers().then(
            (data) => {
                this.options = data;
            },
            ({ data }) => {
                this.$state.go("^").then(() => {
                    this.Alerter.alertFromSWS(this.$translate.instant("license_spla_add_step1_loading_error"), data);
                });
            }
        );
    }

    loadTypes () {
        this.options.availableTypes = null;
        this.selected.type = null;
        this.License.splaAddAvailableTypes(this.selected.server).then(
            (data) => {
                angular.extend(this.options, data);
            },
            ({ data }) => {
                this.$state.go("^").then(() => {
                    this.Alerter.alertFromSWS(this.$translate.instant("license_spla_add_step1_loading_error"), data);
                });
            }
        );
    }

});
