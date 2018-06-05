"use strict";

const _ = require("lodash");

var constants = {
    EU : {
        RENEW_URL : "https://eu.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
        vmsUrl : "http://travaux.ovh.net/vms/",
        travauxUrl : "http://travaux.ovh.net/",
        UNIVERS      : "dedicated",
        URLS      : {
            CZ : {
                support: "http://www.ovh.cz/podpora/",
                support_contact: "http://www.ovh.cz/podpora/",
                guides: {
                    home   : "http://prirucky.ovh.cz/"
                },
                vpsCloud           : "http://www.ovh.cz/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://prirucky.ovh.cz/IpmiSol",
                RealTimeMonitoring : "http://prirucky.ovh.cz/RealTimeMonitoring",
                changeOwner        : "https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.cz/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                exchangeOrder: "https://www.ovh.cz/emails/hosted-exchange-2013/",
                renewAlign : "https://www.ovh.cz/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.cz/dedikovane_servery/faq.xml",
                faqVps: "https://www.ovh.cz/vps/pomoc-faq.xml",
                dedicatedOrder: "https://www.ovh.cz/dedikovane_servery"
            },
            DE : {
                support: "http://www.ovh.de/support/",
                support_contact: "http://www.ovh.de/support/",
                guides: {
                    home   : "http://hilfe.ovh.de/",
                    autoRenew: "https://www.ovh.de/g1271.anleitung_zur_nutzung_der_automatischen_verlangerung_bei_ovh",
                    ipv6Vps: "https://www.ovh.de/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.de/g1769.creating_ssh_keys",
                    sshChange: "https://www.ovh.de/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.de/virtual_server/vps-cloud.xml",
                dedicatedIpmi      : "http://hilfe.ovh.de/AdministrationIpmiSol",
                RealTimeMonitoring : "http://hilfe.ovh.de/DedizierteRealTimeMonitoring",
                changeOwner: "https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.de/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                exchangeOrder: "https://www.ovh.de/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.de/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.de/dedicated_server/faq.xml",
                faqVps: "https://www.ovh.de/virtual_server/faq-hilfe.xml",
                dedicatedOrder: "https://www.ovh.de/dedicated_server"
            },
            ES : {
                support: "http://www.ovh.es/soporte/",
                support_contact: "http://www.ovh.es/soporte/",
                guides: {
                    home   : "http://guias.ovh.es/",
                    autoRenew: "https://www.ovh.es/g1271.renovacion_automatica_en_ovh",
                    ipv6Vps: "https://www.ovh.es/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.es/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.es/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.es/g2069.replacing_your_lost_ssh_key_pair"

                },
                vpsCloud           : "http://www.ovh.es/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guias.ovh.es/IpmiSol",
                RealTimeMonitoring : "http://guias.ovh.es/RealTimeMonitoring",
                changeOwner: "https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi",
                dedicated2016News  : "http://www.ovh.es/a1837.news",
                exchangeOrder: "https://www.ovh.es/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.es/servidores_dedicados/faq.xml",
                faqVps: "https://www.ovh.es/vps/ayuda-faq.xml",
                dedicatedOrder: "https://www.ovh.es/servidores_dedicados"
            },
            FI : {
                support: "http://www.ovh-hosting.fi/tuki/",
                support_contact: "http://www.ovh-hosting.fi/tuki/",
                guides: {
                    home   : "http://ohjeet.ovh-hosting.fi/",
                    autoRenew: "https://www.ovh-hosting.fi/g1271.automaattinen-uusinta",
                    reinitPassword: "https://www.ovh-hosting.fi/g2366.virtuaalikoneen_root-salasanan_vaihto",
                    ipv6Vps: "https://www.ovh-hosting.fi/g2365.vps-ipv6"
                },
                vpsCloud           : "http://www.ovh-hosting.fi/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://ohjeet.ovh-hosting.fi/IpmiSol",
                RealTimeMonitoring : "http://ohjeet.ovh-hosting.fi/RealTimeMonitoring",
                changeOwner: "https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.fi/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                exchangeOrder: "https://www.ovh-hosting.fi/sahkopostit/hosted-exchange/",
                renewAlign : "https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh-hosting.fi/dedikoidut_palvelimet/ukk.xml",
                faqVps: "https://www.ovh-hosting.fi/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh-hosting.fi/dedikoidut_palvelimet"
            },
            FR : {
                support: "https://www.ovh.com/fr/support/",
                support_contact: "https://www.ovh.com/fr/support/nous-contacter/",
                guides: {
                    home   : "https://docs.ovh.com",
                    autoRenew: "https://www.ovh.com/fr/g1271.guide_dutilisation_du_renouvellement_automatique_ovh",
                    additionalDisksGuide: "https://www.ovh.com/fr/g2181.Commande_et_utilisation_d_un_disque_additionnel",
                    all: "https://www.ovh.com/fr/support/knowledge/",
                    nsx: "https://www.ovh.com/fr/private-cloud/options/nsx.xml",
                    vrops: "https://www.ovh.com/fr/private-cloud/options/vrops.xml",
                    pcidssHdsHipaa: "https://www.ovh.com/fr/private-cloud/",
                    pcidss: "https://www.ovh.com/fr/private-cloud/payment-infrastructure/pci-dss.xml",
                    hds: "https://www.ovh.com/fr/private-cloud/healthcare/agrement.xml",
                    reinitPassword: "https://www.ovh.com/fr/g2366.changer_le_mot_de_passe_root_sur_un_vps",
                    ipv6Vps: "https://www.ovh.fr/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.fr/g1769.creation_des_cles_ssh",
                    sshAdd: "https://www.ovh.fr/g1924.configurer_des_cles_ssh_supplementaires",
                    sshChange: "https://www.ovh.fr/g2069.changer_sa_cle_ssh_en_cas_de_perte",
                    megaRaidLED: "https://docs.ovh.com/fr/fr/cloud/dedicated/hotswap-raid-hard/",
                    noMegaRaidLED: "https://docs.ovh.com/fr/fr/cloud/dedicated/hotswap-raid-soft/",
                    diskSerial: "http://docs.ovh.com/fr/fr/cloud/dedicated/find-disk-serial-number/"
                },
                vpsCloud           : "https://www.ovh.com/fr/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guides.ovh.com/IpmiSol",
                RealTimeMonitoring : "http://guide.ovh.com/RealTimeMonitoring",
                changeOwner: "https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "https://www.ovh.com/fr/news/a1837.nouveaux-serveurs-dedies-2016",
                exchangeOrder: "https://www.ovh.com/fr/emails/hosted-exchange/",
                renewAlign : "https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1",
                housingPhoneSupport : "09 72 10 00 70",
                ipShortageWarnUrl: "http://travaux.ovh.net/?do=details&id=18851",
                faq: "https://www.ovh.com/fr/serveurs_dedies/faq.xml",
                faqVps: "https://www.ovh.com/fr/vps/aide-faq.xml",
                faqDedicatedCloud: "https://pccdocs.ovh.net/pages/viewpage.action?pageId=7766169",
                dedicatedOrder: "https://www.ovh.com/fr/serveurs_dedies"
            },
            GB : {
                support: "http://www.ovh.co.uk/support/",
                support_contact: "http://www.ovh.co.uk/support/",
                guides: {
                    home   : "http://help.ovh.co.uk/",
                    autoRenew: "https://www.ovh.co.uk/g1271.how_to_use_automatic_renewal_at_ovh",
                    all: "https://www.ovh.co.uk/community/knowledge/",
                    nsx: "https://www.ovh.co.uk/private-cloud/options/nsx.xml",
                    vrops: "https://www.ovh.co.uk/private-cloud/options/vrops.xml",
                    pcidssHdsHipaa: "https://www.ovh.co.uk/private-cloud/",
                    pcidss: "https://www.ovh.co.uk/private-cloud/payment-infrastructure/pci-dss.xml",
                    hds: "https://www.ovh.co.uk/private-cloud/healthcare/agrement.xml",
                    reinitPassword: "https://www.ovh.co.uk/g2366.change_the_root_password_on_a_vps_linux",
                    ipv6Vps: "https://www.ovh.co.uk/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.co.uk/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.co.uk/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.co.uk/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.co.uk/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                changeOwner: "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                exchangeOrder: "https://www.ovh.co.uk/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                ipShortageWarnUrl: "http://status.ovh.com/?do=details&id=13687",
                faq: "https://www.ovh.co.uk/dedicated_servers/faq.xml",
                faqVps: "https://www.ovh.co.uk/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.co.uk/dedicated_servers"
            },
            IT : {
                support: "http://www.ovh.it/supporto/",
                support_contact: "http://www.ovh.it/supporto/",
                guides: {
                    home   : "http://guida.ovh.it/",
                    autoRenew: "https://www.ovh.it/g1271.imposta_il_rinnovo_automatico_dei_tuoi_servizi_ovh",
                    reinitPassword: "https://www.ovh.it/g2366.modifica_la_password_di_root_su_un_vps_linux",
                    ipv6Vps: "https://www.ovh.it/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.it/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.it/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.it/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.it/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guida.ovh.it/IpmiSol",
                RealTimeMonitoring : "http://guida.ovh.it/RealTimeMonitoring",
                changeOwner: "https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.it/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.it/a1837.news",
                exchangeOrder: "https://www.ovh.it/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.it/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.it/server_dedicati/faq.xml",
                faqVps: "https://www.ovh.it/vps/aiuto-faq.xml",
                dedicatedOrder: "https://www.ovh.it/server_dedicati"
            },
            LT : {
                support: "http://www.ovh.lt/pagalba/",
                support_contact: "http://www.ovh.lt/pagalba/",
                guides: {
                    home   : "http://gidai.ovh.lt/",
                    autoRenew: "https://www.ovh.lt/g1271.automatinis_ovh_paslaugu_galiojimo_pratesimas",
                    reinitPassword: "https://www.ovh.lt/g2366.root_slaptazodzio_keitimas_vps_linux",
                    ipv6Vps: "https://www.ovh.lt/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.lt/g1769.creating_ssh_keys",
                    sshChange: "https://www.ovh.lt/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.lt/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://gidai.ovh.lt/IpmiSerialOverLan",
                RealTimeMonitoring : "http://gidai.ovh.lt/StebejimasRealiuLaiku",
                changeOwner: "https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.lt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.lt/a1837.news",
                exchangeOrder: "https://www.ovh.lt/El_pastas/hosted-exchange/",
                renewAlign : "https://www.ovh.lt/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.lt/dedikuoti_serveriai/duk.xml",
                faqVps: "https://www.ovh.lt/vps/pagalba-duk.xml",
                dedicatedOrder: "https://www.ovh.lt/dedikuoti_serveriai"
            },
            NL : {
                support: "http://www.ovh.nl/support/",
                support_contact: "http://www.ovh.nl/support/",
                guides: {
                    home   : "http://gids.ovh.nl/",
                    autoRenew: "https://www.ovh.nl/g1271.ovh_handleiding_voor_het_gebruik_van_de_automatische_verlenging",
                    ipv6Vps: "https://www.ovh.nl/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.nl/g1769.creating_ssh_keys",
                    sshChange: "https://www.ovh.nl/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud     : "http://www.ovh.nl/vps/vps-cloud.xml",
                changeOwner: "https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.nl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.nl/a1837.news",
                exchangeOrder: "https://www.ovh.nl/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.nl/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.nl/dedicated_servers/faq.xml",
                faqVps: "https://www.ovh.nl/vps/hulp-faq.xml",
                dedicatedOrder: "https://www.ovh.nl/dedicated_servers"
            },
            PL : {
                support: "https://www.ovh.pl/pomoc/",
                support_contact: "https://www.ovh.pl/pomoc/",
                guides: {
                    home   : "http://pomoc.ovh.pl/",
                    autoRenew: "https://www.ovh.pl/g1271.przewodnik_dotyczacy_opcji_automatycznego_odnawiania_uslug_w_ovh",
                    reinitPassword: "https://www.ovh.pl/g2366.Zmiana_hasla_root_na_serwerze_vps_linux",
                    ipv6Vps: "https://www.ovh.pl/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.pl/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.pl/g1924.configuring_additionnal_ssh_key",
                    shhChange: "https://www.ovh.pl/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.pl/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://pomoc.ovh.pl/IpmiSol",
                RealTimeMonitoring : "http://pomoc.ovh.pl/RealTimeMonitoring",
                changeOwner: "https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.pl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.pl/a1837.news",
                exchangeOrder: "https://www.ovh.pl/emaile/hosted-exchange/",
                renewAlign : "https://www.ovh.pl/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.pl/serwery_dedykowane/faq.xml",
                faqVps: "https://www.ovh.pl/vps/pomoc-faq.xml",
                dedicatedOrder: "https://www.ovh.pl/serwery_dedykowane"
            },
            PT : {
                support: "https://www.ovh.pt/suporte/",
                support_contact: "https://www.ovh.pt/suporte/",
                guides: {
                    home   : "http://guias.ovh.pt/",
                    autoRenew: "https://www.ovh.pt/g1271.guia_de_utilizacao_da_renovacao_automatica_da_ovh",
                    reinitPassword: "https://www.ovh.pt/g2366.alterar_a_password_root_num_servidor_vps_linux",
                    ipv6Vps: "https://www.ovh.pt/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.pt/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.pt/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.pt/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.pt/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guias.ovh.pt/IpmiSol",
                RealTimeMonitoring : "http://guias.ovh.pt/RealTimeMonitoring",
                changeOwner: "https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.pt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.pt/a1837.news",
                exchangeOrder: "https://www.ovh.pt/emails/hosted-exchange-2013/",
                renewAlign : "https://www.ovh.pt/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.pt/servidores_dedicados/faq.xml ",
                faqVps: "https://www.ovh.pt/vps/vps-ssd.xml",
                dedicatedOrder: "https://www.ovh.pt/servidores_dedicados"
            },
            IE : {
                support: "https://www.ovh.ie/suport/",
                support_contact: "https://www.ovh.ie/suport/",
                guides: {
                    home   : "http://help.ovh.ie/",
                    autoRenew: "https://www.ovh.ie/g1271.how_to_use_automatic_renewal_at_ovh",
                    all: "https://www.ovh.ie/community/knowledge/",
                    nsx: "https://www.ovh.ie/private-cloud/options/nsx.xml",
                    vrops: "https://www.ovh.ie/private-cloud/options/vrops.xml",
                    pcidssHdsHipaa: "https://www.ovh.ie/private-cloud/",
                    sshAdd: "https://www.ovh.ie/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.ie/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "http://www.ovh.ie/vps/vps-cloud.xml",
                changeOwner: "https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.ie/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                dedicated2016News  : "http://www.ovh.ie/a1837.news",
                exchangeOrder: "https://www.ovh.ie/emails/hosted-exchange-2013/",
                renewAlign : "https://www.ovh.ie/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.ie/dedicated_servers/faq.xml",
                faqVps: "https://www.ovh.ie/vps/vps-ssd.xml",
                dedicatedOrder: "https://www.ovh.ie/dedicated_servers"
            }
        },
        LANGUAGES : [
            { value : "de_DE", name : "Deutsch" },
            { value : "en_GB", name : "English" },
            { value : "en_CA", name : "English (Canadian)" },
            { value : "en_US", name : "English (United States)" },
            { value : "en_AU", name : "English (Australia)" },
            { value : "en_ASIA", name : "English (Asia)" },
            { value : "en_SG", name : "English (Singapore)" },
            { value : "es_ES", name : "Español" },
            { value : "fr_FR", name : "Français" },
            { value : "fr_CA", name : "Français (Canadien)" },
            { value : "it_IT", name : "Italiano" },
            { value : "lt_LT", name : "Lietuviškai" },
            { value : "nl_NL", name : "Nederlands" },
            { value : "pl_PL", name : "Polski" },
            { value : "pt_PT", name : "Português" },
            { value : "sk_SK", name : "Slovakian" },
            { value : "fi_FI", name : "Suomi" },
            { value : "cs_CZ", name : "Česky" }
        ],
        website_url  : {
            new_nic : {
                en_AU : "http://www.ovh.com/au/support/new_nic.xml",
                de_DE : "http://www.ovh.de/support/new_nic.xml",
                en_GB : "http://www.ovh.co.uk/support/new_nic.xml",
                en_CA : "http://www.ovh.com/ca/en/support/new_nic.xml",
                en_US : "http://www.ovh.com/us/support/new_nic.xml",
                es_ES : "http://www.ovh.es/soporte/new_nic.xml",
                es_US : "http://www.ovh.com/us/support/new_nic.xml",
                fr_CA : "http://www.ovh.com/ca/fr/support/new_nic.xml",
                fr_FR : "https://www.ovh.com/fr/support/new_nic.xml",
                fr_MA : "http://www.ovh.ma/support/new_nic.xml",
                fr_SN : "http://www.ovh.sn/support/new_nic.xml",
                fr_TN : "http://www.ovh.com.tn/support/new_nic.xml",
                it_IT : "https://www.ovh.it/cgi-bin/it/nic/newNic.cgi",
                lt_LT : "http://www.ovh.lt/pagalba/new_nic.xml",
                nl_NL : "http://www.ovh.nl/support/new_nic.xml",
                pl_PL : "http://www.ovh.pl/support/new_nic.xml",
                pt_PT : "http://www.ovh.pt/suporte/new_nic.xml",
                sk_SK : "http://www.ovh.cz/podpora/new_nic.xml",
                fi_FI : "http://www.ovh-hosting.fi/tuki/new_nic.xml",
                cs_CZ : "http://www.ovh.cz/podpora/new_nic.xml"
            }
        },
        MANAGER_URLS : {
            "portal"    : "https://www.ovh.com/manager/portal/index.html#/",
            "web"       : "https://www.ovh.com/manager/web/index.html#/",
            "dedicated" : "https://www.ovh.com/manager/dedicated/index.html#/",
            "cloud"     : "https://www.ovh.com/manager/cloud/index.html#/",
            "telecom"   : "https://www.ovhtelecom.fr/manager/index.html#/",
            "sunrise"   : "https://www.ovh.com/manager/sunrise/index.html#/",
            "partners"  : "https://www.ovh.com/manager/partners"
        },
        TOP_GUIDES : {
            all: {
                fr_FR: "https://docs.ovh.com/fr/dedicated/",
                de_DE: "https://docs.ovh.com/de/dedicated/",
                en_AU: "https://docs.ovh.com/au/en/dedicated/",
                en_CA: "https://docs.ovh.com/ca/en/dedicated/",
                en_GB: "https://docs.ovh.com/gb/en/dedicated/",
                en_US: "https://support.ovhcloud.com/hc/en-us",
                es_ES: "https://docs.ovh.com/es/dedicated/",
                it_IT: "https://docs.ovh.com/it/dedicated/",
                lt_LT: "https://docs.ovh.com/lt/dedicated/",
                nl_NL: "https://docs.ovh.com/nl/dedicated/",
                pl_PL: "https://docs.ovh.com/pl/dedicated/",
                pt_PT: "https://docs.ovh.com/pt/dedicated/",
                fi_FI: "https://docs.ovh.com/fi/dedicated/",
                cs_CZ: "https://docs.ovh.com/cz/cs/dedicated/"
            },
            sd: {
                fr_FR: [
                    {
                        title: "core_sd_top_guide_1_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-1",
                        url: "https://www.ovh.com/fr/g847.reinstallation"
                    }, {
                        title: "core_sd_top_guide_2_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-2",
                        url: "https://www.ovh.com/fr/g845.netboot"
                    }, {
                        title: "core_sd_top_guide_3_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-3",
                        url: "https://www.ovh.com/fr/g849.configurer_le_reverse"
                    }, {
                        title: "core_sd_top_guide_4_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-4",
                        url: "https://www.ovh.com/fr/g848.configurer_le_dns_secondaire"
                    }, {
                        title: "core_sd_top_guide_5_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-5",
                        url: "https://www.ovh.com/fr/g851.assigner_une_adresse_mac_virtuelle_a_une_ip_failover"
                    }, {
                        title: "core_sd_top_guide_6_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-6",
                        url: "https://www.ovh.com/fr/g850.deplacer_une_adresse_ip_failover"
                    }, {
                        title: "core_sd_top_guide_7_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-7",
                        url: "https://docs.ovh.com/fr/dedicated/ovh-rescue/"
                    }, {
                        title: "core_sd_top_guide_8_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-8",
                        url: "https://www.ovh.com/fr/g2168.creer_un_raid_hardware_avec_le_manager_ovh"
                    }
                ],
                en_GB: [
                    {
                        title: "core_sd_top_guide_7_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-7",
                        url: "https://www.ovh.co.uk/g920.rescue_mode"
                    }
                ]
            },
            pcc: {
                fr_FR: [
                    {
                        title: "core_pcc_top_guide_1_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-1",
                        url: "https://docs.ovh.com/fr/private-cloud/connexion-interface-vsphere/"
                    }, {
                        title: "core_pcc_top_guide_2_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-2",
                        url: "https://docs.ovh.com/fr/private-cloud/deploiement-d-une-machine-virtuelle/"
                    }, {
                        title: "core_pcc_top_guide_3_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-3",
                        url: "https://docs.ovh.com/fr/private-cloud/configuration-ip-machine-virtuelle/"
                    }, {
                        title: "core_pcc_top_guide_4_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-4",
                        url: "https://docs.ovh.com/fr/private-cloud/modification-des-ressources-d-une-machine-virtuelle/"
                    }, {
                        title: "core_pcc_top_guide_5_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-5",
                        url: "https://docs.ovh.com/fr/private-cloud/connexion-en-sftp/"
                    }, {
                        title: "core_pcc_top_guide_6_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-6",
                        url: "https://www.vmware.com/support/pubs/"
                    }, {
                        title: "core_pcc_top_guide_7_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-7",
                        url: "https://docs.ovh.com/fr/private-cloud/suppression-d-un-hote/"
                    }, {
                        title: "core_pcc_top_guide_10_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-10",
                        url: "http://pubs.vmware.com/NSX-62/index.jsp?lang=fr"
                    }
                ],
                en_GB: [
                    {
                        title: "core_pcc_top_guide_3_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-3",
                        url: "https://www.ovh.co.uk/g582.configure_an_ip_address_on_a_virtual_machine"
                    }, {
                        title: "core_pcc_top_guide_4_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-4",
                        url: "https://www.ovh.co.uk/g587.modify_the_hardware_configuration_of_your_virtual_machine"
                    }, {
                        title: "core_pcc_top_guide_5_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-5",
                        url: "https://www.ovh.co.uk/g589.sftp_connection"
                    }, {
                        title: "core_pcc_top_guide_6_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-6",
                        url: "https://www.vmware.com/support/pubs/"
                    }, {
                        title: "core_pcc_top_guide_7_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-7",
                        url: "https://pccdocs.ovh.net/display/VS/Remove+a+host"
                    }, {
                        title: "core_pcc_top_guide_9_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-9",
                        url: "https://pccdocs.ovh.net/display/ND/Getting+Started+with+NSX"
                    }, {
                        title: "core_pcc_top_guide_10_title",
                        atInternetClickTag: "TopGuide-PrivateCloud-10",
                        url: "http://pubs.vmware.com/NSX-62/index.jsp?lang=en"
                    }
                ]
            }
        },
        accountCreation: {
            default: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh",
            CZ: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=cz",
            DE: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=de",
            ES: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=es",
            FI: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=fi",
            FR: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=fr",
            GB: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=gb",
            IE: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=ie",
            IT: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=it",
            LT: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=lt",
            NL: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=nl",
            PL: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=pl",
            PT: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=pt",
            SN: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=sn",
            TN: "https://www.ovh.com/auth/signup/#/?ovhCompany=ovh&ovhSubsidiary=tn",
        },
        billingRenew: {
            CA : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            CZ : "https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            DE : "https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            EN : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            ES : "https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FI : "https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FR : "https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            GB : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IE : "https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IT : "https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            LT : "https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            MA : "https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            NL : "https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PL : "https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PT : "https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            QC : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            RU : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            SN : "https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            TN : "https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            WE : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}"
        },
        REDIRECT_URLS: {
            listTicket: "https://www.ovh.com/manager/dedicated/index.html#/ticket"
        }
    },
    CA : {
        RENEW_URL : "https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
        vmsUrl : "http://status.ovh.net/vms/",
        travauxUrl : "http://status.ovh.net/",
        UNIVERS      : "dedicated",
        URLS      : {
            ASIA: {
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps : "https://www.ovh.com/us/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                changeOwner        : "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/us/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.com/ca/en/dedicated-servers/faq.xml",
                faqVps: "https://www.ovh.com/us/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.com/asia/dedicated-servers"
            },
            AU: {
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps : "https://www.ovh.com/us/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                changeOwner        : "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/us/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.com/ca/en/dedicated-servers/faq.xml",
                faqVps: "https://www.ovh.com/us/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.com.au/dedicated-servers"
            },
            CA       : { // eq to en_CA
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps: "https://www.ovh.com/ca/en/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                changeOwner: "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/ca/en/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.com/ca/en/dedicated-servers/faq.xml",
                faqVps: "https://www.ovh.com/ca/en/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.com/ca/en/dedicated-servers"
            },
            QC       : { // eq to fr_CA
                support: "https://www.ovh.com/fr/support/",
                support_contact: "https://www.ovh.com/ca/fr/support/",
                guides: {
                    home   : "http://docs.ovh.ca/fr/",
                    reinitPassword: "http://docs.ovh.ca/fr/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps: "https://www.ovh.com/ca/fr/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/fr/g1769.creation_des_cles_ssh",
                    sshAdd: "https://www.ovh.com/ca/fr/g1924.configurer_des_cles_ssh_supplementaires",
                    sshChange: "https://www.ovh.com/ca/fr/g2069.changer_sa_cle_ssh_en_cas_de_perte"
                },
                vpsCloud           : "https://www.ovh.com/ca/fr/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guides.ovh.com/IpmiSol",
                changeOwner: "https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://guide.ovh.com/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/ca/fr/emails/hosted-exchange/",
                renewAlign : "https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1",
                faq: "https://www.ovh.com/ca/fr/serveurs-dedies/faq.xml",
                faqVps: "https://www.ovh.com/ca/fr/vps/aide-faq.xml",
                dedicatedOrder: "https://www.ovh.com/ca/fr/serveurs-dedies"
            },
            SG       : {
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps : "https://www.ovh.com/us/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                changeOwner: "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/us/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.es/servidores_dedicados/faq.xml",
                faqVps: "https://www.ovh.com/us/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.com/sg/dedicated-servers"
            },
            WE       : {
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps : "https://www.ovh.com/us/g2365.vps-ipv6",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://help.ovh.co.uk/IpmiSol",
                changeOwner: "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://help.ovh.co.uk/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/us/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.es/servidores_dedicados/faq.xml",
                faqVps: "https://www.ovh.com/us/vps/faq-help.xml",
                dedicatedOrder: "https://www.ovh.com/world/dedicated-servers"
            },
            WS       : { // eq to es_US
                support: "https://www.ovh.com/fr/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    home   : "http://docs.ovh.ca/en/",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    sshCreate: "https://www.ovh.com/ca/en/g1769.creating_ssh_keys",
                    sshAdd: "https://www.ovh.com/ca/en/g1924.configuring_additionnal_ssh_key",
                    sshChange: "https://www.ovh.com/ca/en/g2069.replacing_your_lost_ssh_key_pair"
                },
                vpsCloud           : "https://www.ovh.com/us/es/vps/vps-cloud.xml",
                dedicatedIpmi      : "http://guias.ovh.es/IpmiSol",
                changeOwner: "https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.es/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "http://guias.ovh.es/RealTimeMonitoring",
                exchangeOrder: "https://www.ovh.com/us/es/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.com/us/es/servidores-dedicados/faq.xml",
                faqVps: "https://www.ovh.com/us/es/vps/ayuda-faq.xml",
                dedicatedOrder: "https://www.ovh.com/world/dedicated-servers"
            }
        },
        LANGUAGES : [
            { value : "de_DE", name : "Deutsch" },
            { value : "en_GB", name : "English" },
            { value : "en_CA", name : "English (Canadian)" },
            { value : "en_US", name : "English (United States)" },
            { value : "en_AU", name : "English (Australia)" },
            { value : "en_ASIA", name : "English (Asia)" },
            { value : "en_SG", name : "English (Singapore)" },
            { value : "es_ES", name : "Español" },
            { value : "fr_FR", name : "Français" },
            { value : "fr_CA", name : "Français (Canadien)" },
            { value : "it_IT", name : "Italiano" },
            { value : "lt_LT", name : "Lietuviškai" },
            { value : "nl_NL", name : "Nederlands" },
            { value : "pl_PL", name : "Polski" },
            { value : "pt_PT", name : "Português" },
            { value : "sk_SK", name : "Slovakian" },
            { value : "fi_FI", name : "Suomi" },
            { value : "cs_CZ", name : "Česky" }
        ],
        website_url  : {
            new_nic : {
                en_AU : "http://www.ovh.com/ca/en/support/new_nic.xml",
                de_DE : "http://www.ovh.de/support/new_nic.xml",
                en_GB : "http://www.ovh.co.uk/support/new_nic.xml",
                en_CA : "http://www.ovh.com/ca/en/support/new_nic.xml",
                en_US : "http://www.ovh.com/us/support/new_nic.xml",
                es_ES : "http://www.ovh.es/soporte/new_nic.xml",
                es_US : "http://www.ovh.com/us/support/new_nic.xml",
                fr_CA : "http://www.ovh.com/ca/fr/support/new_nic.xml",
                fr_FR : "https://www.ovh.com/fr/support/new_nic.xml",
                fr_MA : "http://www.ovh.ma/support/new_nic.xml",
                fr_SN : "http://www.ovh.sn/support/new_nic.xml",
                fr_TN : "http://www.ovh.com.tn/support/new_nic.xml",
                it_IT : "https://www.ovh.it/cgi-bin/it/nic/newNic.cgi",
                lt_LT : "http://www.ovh.lt/pagalba/new_nic.xml",
                nl_NL : "http://www.ovh.nl/support/new_nic.xml",
                pl_PL : "http://www.ovh.pl/support/new_nic.xml",
                pt_PT : "http://www.ovh.pt/suporte/new_nic.xml",
                sk_SK : "http://www.ovh.cz/podpora/new_nic.xml",
                fi_FI : "http://www.ovh-hosting.fi/tuki/new_nic.xml",
                cs_CZ : "http://www.ovh.cz/podpora/new_nic.xml"
            }
        },
        MANAGER_URLS : {
            "dedicated" : "https://ca.ovh.com/manager/index.html#/",
            "cloud"     : "https://ca.ovh.com/manager/cloud/index.html#/",
            "sunrise"   : "https://ca.ovh.com/manager/sunrise/index.html#/"
        },
        TOP_GUIDES: {},
        accountCreation: {
            default: "http://www.ovh.com/ca/fr/support/new_nic.xml",
            DE : "http://www.ovh.de/support/new_nic.xml",
            GB : "http://www.ovh.co.uk/support/new_nic.xml",
            en_CA : "http://www.ovh.com/ca/en/support/new_nic.xml",
            en_US : "http://www.ovh.com/us/support/new_nic.xml",
            ES : "http://www.ovh.es/soporte/new_nic.xml",
            es_US : "http://www.ovh.com/us/support/new_nic.xml",
            fr_CA : "http://www.ovh.com/ca/fr/support/new_nic.xml",
            FR : "https://www.ovh.com/fr/support/new_nic.xml",
            MA : "http://www.ovh.ma/support/new_nic.xml",
            SN : "http://www.ovh.sn/support/new_nic.xml",
            TN : "http://www.ovh.com.tn/support/new_nic.xml",
            IT : "https://www.ovh.it/cgi-bin/it/nic/newNic.cgi",
            LT : "http://www.ovh.lt/pagalba/new_nic.xml",
            NL : "http://www.ovh.nl/support/new_nic.xml",
            PL : "http://www.ovh.pl/support/new_nic.xml",
            PT : "http://www.ovh.pt/suporte/new_nic.xml",
            SK : "http://www.ovh.cz/podpora/new_nic.xml",
            FI : "http://www.ovh-hosting.fi/tuki/new_nic.xml",
            CZ : "http://www.ovh.cz/podpora/new_nic.xml"
        },
        billingRenew: {
            CA : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            CZ : "https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            DE : "https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            EN : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            ES : "https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FI : "https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FR : "https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            GB : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IE : "https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IT : "https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            LT : "https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            MA : "https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            NL : "https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PL : "https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PT : "https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            QC : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            RU : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            SN : "https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            TN : "https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            WE : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}"
        },
        REDIRECT_URLS: {
            listTicket: "https://ca.ovh.com/manager/index.html#/ticket"
        }
    },
    US : {
        RENEW_URL : "/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
        vmsUrl : "http://status.ovh.net/vms/",
        travauxUrl : "http://status.ovh.net/",
        vrackUrl : "https://ovhcloud.com/manager/cloud/index.html#/vrack",
        UNIVERS : "dedicated",
        URLS : {
            US: {
                express_order: "https://ovh.us/order/express/#/express/",
                support: "http://www.ovh.co.uk/support/",
                support_contact: "https://www.ovh.com/ca/en/support/",
                guides: {
                    all: "https://support.ovhcloud.com/hc/en-us",
                    home   : "https://support.ovhcloud.com/hc/en-us",
                    reinitPassword: "http://docs.ovh.ca/en/faqs-server-issues.html#server-password-lost-forgotten",
                    ipv6Vps: "https://www.ovh.com/ca/en/g2365.vps-ipv6",
                    sshCreate: "http://support.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management",
                    sshAdd: "http://support.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management",
                    sshChange: "http://support.ovhcloud.com/hc/en-us/articles/115001588250-SSH-Key-Management",
                    nsx: "https://ovhcloud.com/products/hosted-private-cloud/vmware-nsx",
                    vrops: "https://ovhcloud.com/products/hosted-private-cloud/vmware-vrealize-operations",
                    pcidssHdsHipaa: "https://ovhcloud.com/products/hosted-private-cloud"
                },
                vpsCloud           : "https://www.ovh.com/ca/en/vps/vps-cloud.xml",
                dedicatedIpmi      : "https://docs.ovh.com/gb/en/dedicated/use-ipmi-dedicated-servers/#testing-and-rebooting-the-ipmi",
                changeOwner: "https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi",
                domainOrderTrade   : "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
                RealTimeMonitoring : "https://support.ovhcloud.com/hc/en-us/articles/115001821044-Learning-About-OVH-US-Monitoring",
                exchangeOrder: "https://www.ovh.com/ca/en/emails/hosted-exchange/",
                renewAlign : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0",
                faq: "https://www.ovh.com/ca/en/dedicated-servers/faq.xml",
                faqVps: "https://www.ovh.com/ca/en/vps/faq-help.xml",
                dedicatedOrder: "https://ovhcloud.com/order/dedicated/#/dedicated/select",
                vrackOrder: "https://ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))"
            }
        },
        LANGUAGES : [
            { value : "de_DE", name : "Deutsch" },
            { value : "en_GB", name : "English" },
            { value : "en_CA", name : "English (Canadian)" },
            { value : "en_US", name : "English (United States)" },
            { value : "en_AU", name : "English (Australia)" },
            { value : "en_ASIA", name : "English (Asia)" },
            { value : "en_SG", name : "English (Singapore)" },
            { value : "es_ES", name : "Español" },
            { value : "fr_FR", name : "Français" },
            { value : "fr_CA", name : "Français (Canadien)" },
            { value : "it_IT", name : "Italiano" },
            { value : "lt_LT", name : "Lietuviškai" },
            { value : "nl_NL", name : "Nederlands" },
            { value : "pl_PL", name : "Polski" },
            { value : "pt_PT", name : "Português" },
            { value : "sk_SK", name : "Slovakian" },
            { value : "fi_FI", name : "Suomi" },
            { value : "cs_CZ", name : "Česky" }
        ],
        website_url  : {
            new_nic : {
                en_AU : "http://www.ovh.com/au/support/new_nic.xml",
                de_DE : "http://www.ovh.de/support/new_nic.xml",
                en_GB : "http://www.ovh.co.uk/support/new_nic.xml",
                en_CA : "http://www.ovh.com/ca/en/support/new_nic.xml",
                en_US : "http://www.ovh.com/us/support/new_nic.xml",
                es_ES : "http://www.ovh.es/soporte/new_nic.xml",
                es_US : "http://www.ovh.com/us/support/new_nic.xml",
                fr_CA : "http://www.ovh.com/ca/fr/support/new_nic.xml",
                fr_FR : "https://www.ovh.com/fr/support/new_nic.xml",
                fr_MA : "http://www.ovh.ma/support/new_nic.xml",
                fr_SN : "http://www.ovh.sn/support/new_nic.xml",
                fr_TN : "http://www.ovh.com.tn/support/new_nic.xml",
                it_IT : "https://www.ovh.it/cgi-bin/it/nic/newNic.cgi",
                lt_LT : "http://www.ovh.lt/pagalba/new_nic.xml",
                nl_NL : "http://www.ovh.nl/support/new_nic.xml",
                pl_PL : "http://www.ovh.pl/support/new_nic.xml",
                pt_PT : "http://www.ovh.pt/suporte/new_nic.xml",
                sk_SK : "http://www.ovh.cz/podpora/new_nic.xml",
                fi_FI : "http://www.ovh-hosting.fi/tuki/new_nic.xml",
                cs_CZ : "http://www.ovh.cz/podpora/new_nic.xml"
            }
        },
        MANAGER_URLS : {
            "dedicated": "https://www.ovhcloud.com/manager/dedicated/",
            //"cloud"     : "/manager/cloud/index.html#/"
        },
        TOP_GUIDES: {
            sd: {
                en_GB: [
                    {
                        title: "core_sd_top_guide_7_title",
                        atInternetClickTag: "TopGuide-DedicatedServers-7",
                        url: "https://support.ovhcloud.com/hc/en-us/articles/115001754490-Rescue-Mode"
                    }
                ]
            },
        },
        accountCreation: {
            default: "https://ovhcloud.com/auth/signup/"
        },
        billingRenew: {
            CA : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            CZ : "https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            DE : "https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            EN : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            ES : "https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FI : "https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            FR : "https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            GB : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IE : "https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            IT : "https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            LT : "https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            MA : "https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            NL : "https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PL : "https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            PT : "https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            QC : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            RU : "https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            SN : "https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            TN : "https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}",
            WE : "https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}"
        },
        REDIRECT_URLS: {
            listTicket: "https://ovhcloud.com/manager/dedicated/index.html#/ticket"
        }
    }
};
/* in urls, all keys represents the two first letter of the language list in uppercase, except GB */
constants.EU.URLS.EN = constants.EU.URLS.GB;

/* Since all languages are availables in both CA and UE worlPart, they must have access to all languages conf */
for (var lang in constants.EU.URLS) {
    if (constants.EU.URLS.hasOwnProperty(lang)) {
        if (!constants.CA.URLS[lang]) {
            constants.CA.URLS[lang] = constants.EU.URLS[lang];
        }
        if (!constants.US.URLS[lang]) {
            constants.US.URLS[lang] = constants.EU.URLS[lang];
        }
    }
}
for (var lang in constants.CA.URLS) {
    if (constants.CA.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
        constants.EU.URLS[lang] = constants.CA.URLS[lang];
    }
}
for (var lang in constants.US.URLS) {
    if (constants.US.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
        constants.EU.URLS[lang] = constants.US.URLS[lang];
    }
}

constants.CA.TOP_GUIDES = _.defaults(constants.CA.TOP_GUIDES, constants.EU.TOP_GUIDES);
constants.US.TOP_GUIDES = _.defaults(constants.US.TOP_GUIDES, constants.EU.TOP_GUIDES);

module.exports = constants;
