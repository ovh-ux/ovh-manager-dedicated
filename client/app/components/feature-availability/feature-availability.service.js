class FeatureAvailability {
    constructor (constants) {
        this.target = constants.target;
    }

    hasContactChangement () {
        return this.deny("CA", "US");
    }

    hasNas () {
        return this.deny("CA", "US");
    }

    hasCdn () {
        return this.deny("CA", "US");
    }

    hasPCC () {
        return this.allow("CA", "EU", "US");
    }

    hasPCI () {
        return this.deny("US");
    }

    hasVrack () {
        return this.allow("EU", "CA");
    }

    hasVps () {
        return this.deny("US");
    }

    hasExchange () {
        return this.deny("EU", "US");
    }

    showAutoRenew () {
        return this.allow("EU");
    }

    showState () {
        return this.allow("US");
    }

    showFeedback () {
        return this.deny("US");
    }

    hasDedicatedServerBackupStorage () {
        return this.deny("US");
    }

    hasIpLoadBalancing () {
        return this.deny("US");
    }

    hasDedicatedServerManualRefund () {
        return this.allow("US");
    }

    hasTwoFactorAuthentication () {
        return this.deny("US");
    }

    hasTwoFactorAuthenticationBySms () {
        return this.deny("CA", "US");
    }

    hasCreditCode () {
        return this.deny("CA", "US");
    }

    hasSerialOverLan () {
        return this.deny("US");
    }

    allowDedicatedServerHardwareReplacement () {
        return this.deny("US");
    }

    allowDedicatedServerChangeOwner () {
        return this.deny("CA", "US");
    }

    allowDedicatedServerRenew () {
        return this.deny("EU", "US");
    }

    allowDedicatedServerRenewByCgi () {
        return this.allow("CA");
    }

    allowDedicatedServerBandwidthOption () {
        return this.allow("EU", "CA");
    }

    allowDedicatedServerOrderBandwidthOption () {
        return this.allow("EU", "CA");
    }

    allowDedicatedServerOrderVrackBandwidthOption () {
        return this.allow("EU", "CA");
    }

    allowDedicatedServerOrderTrafficOption () {
        return this.allow("EU", "CA");
    }

    allowDedicatedServerComplianceOptions () {
        return this.deny("US");
    }

    allowDedicatedServerUSBKeys () {
        return this.deny("US");
    }

    allowDedicatedServerFirewallCiscoAsa () {
        return this.deny("US");
    }

    allowIPFailoverImport () {
        return this.deny("US");
    }

    allowIPFailoverOrder () {
        return this.deny("US");
    }

    allowIPFailoverAgoraOrder () {
        return this.allow("US");
    }

    agreeTosAndPpOnManagerLoad () {
        return this.allow("US");
    }

    allowLicenseAgoraOrder () {
        return this.allow("US");
    }

    allowLicenseTypeAgoraOrder (licenseType) {
        return this.allowLicenseAgoraOrder() && _.includes(["CLOUDLINUX", "CPANEL", "DIRECTADMIN", "SQLSERVER", "WINDOWS", "WORKLIGHT", "PLESK", "VIRTUOZZO"], licenseType);
    }

    hasDeveloperMode () {
        return this.deny("US");
    }

    showPDFAndHTMLDepositLinks () {
        return this.deny("US");
    }

    hasVrackAccessibleFromSidebar () {
        return this.allow("US");
    }

    allowVrackOrder () {
        return this.allow("US");
    }

    allow (...args) {
        return Array.from(args).indexOf(this.target) > -1;
    }

    deny (...args) {
        return Array.from(args).indexOf(this.target) === -1;
    }
}

angular.module("services").service("featureAvailability", FeatureAvailability);
