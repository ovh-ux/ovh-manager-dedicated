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

    endAction (alert, message) {
        this.$state.go("^").then(() => {
            this.Alerter.alertFromSWS(alert, message);
        });
    }

    addSpla () {
        this.License.splaAdd(this.selected.server, { serialNumber: this.selected.serial, type: this.selected.type }).then(
            () => {
                this.endAction(this.$translate.instant("license_spla_add_success"), true);
            },
            ({ data }) => {
                this.endAction(this.$translate.instant("license_spla_add_fail"), data);
            }
        );
    }

    load () {
        this.License.splaAddAvailableServers().then(
            (data) => {
                this.options = data;
            },
            ({ data }) => {
                this.endAction(this.$translate.instant("license_spla_add_step1_loading_error"), data);
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
                this.endAction(this.$translate.instant("license_spla_add_step1_loading_error"), data);
            }
        );
    }

});
