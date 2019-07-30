export const AUTORENEW_EVENT = 'billing.autorenew.changed';

export const CONTRACTS_IDS = {
  CA: 1752,
  QC: 1753,
  WE: 1754,
  WS: 1755,
};

export const MIN_DOMAIN_LENGTH = 50;

export const NIC_ALL = 'billing_autorenew_nic_all';

export const NIC_URL = '/me/autorenew';

export const RENEW_URL = {
  default: '/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  CA: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  EN: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  FR: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  GB: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  MA: 'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  QC: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  RU: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  SN: 'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  TN: 'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  WE: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
};

export const SERVICE_EXPIRATION = {
  EXPIRES_IN_A_WEEK: 'weeks',
  EXPIRES_IN_A_MONTH: 'months',
  RENEWED_IN_AMONTH: 'renew_month',
};

export const SERVICE_STATUS = {
  AUTOMATIC: 'auto',
  MANUAL: 'manual',
  PENDING_DEBT: 'pending_debt',
  PENDING_RESILIATION: 'delete_at_expiration',
  RESILIATED: 'expired',
};

export default {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  MIN_DOMAIN_LENGTH,
  NIC_ALL,
  NIC_URL,
  RENEW_URL,
  SERVICE_EXPIRATION,
  SERVICE_STATUS,
};
