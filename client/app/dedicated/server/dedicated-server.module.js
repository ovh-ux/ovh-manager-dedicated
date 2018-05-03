angular
    .module("App")
    .constant("FIREWALL_RULE_ACTIONS", {
        ALLOW: "PERMIT",
        DENY: "DENY"
    })
    .constant("FIREWALL_RULE_PROTOCOLS", {
        IPV_4: "IPv4",
        UDP: "UDP",
        TCP: "TCP",
        ICMP: "ICMP"
    })
    .constant("FIREWALL_STATUSES", {
        ACTIVATED: "ACTIVATED",
        DEACTIVATED: "DEACTIVATED",
        NOT_CONFIGURED: "NOT_CONFIGURED"
    })
    .constant("MITIGATION_STATUSES", {
        ACTIVATED: "ACTIVATED",
        AUTO: "AUTO",
        FORCED: "FORCED"
    })
    .constant("STATISTICS_SCALE", {
        TENSECS: "_10_S",
        ONEMIN: "_1_M",
        FIVEMINS: "_5_M"
    });
