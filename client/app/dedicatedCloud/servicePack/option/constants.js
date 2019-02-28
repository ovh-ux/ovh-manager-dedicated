export const CONSTANT_NAME = 'DEDICATED_CLOUD_SERVICE_PACK_OPTION';
export const MODULE_NAME = 'dedicatedCloudServicePackOption';
export const SERVICE_NAME = 'dedicatedCloudServicePackOption';

export const OPTION_TYPES = {
  basicOption: {
    name: 'basicOption',
    servicePackCanHaveMoreThanOne: true,
  },
  certification: {
    name: 'certification',
    servicePackCanHaveMoreThanOne: false,
  },
};

export const OPTIONS = [
  {
    name: 'nsx',
    type: OPTION_TYPES.basicOption,
  },
  {
    name: 'vrops',
    type: OPTION_TYPES.basicOption,
  },
  {
    name: 'pcidss',
    type: OPTION_TYPES.certification,
  },
  {
    name: 'hipaa',
    type: OPTION_TYPES.certification,
  },
  {
    name: 'hds',
    type: OPTION_TYPES.certification,
  },
  {
    name: 'hcx',
    type: OPTION_TYPES.certification,
  },
];

export default {
  CONSTANT_NAME,
  MODULE_NAME,
  OPTIONS,
  OPTION_TYPES,
  SERVICE_NAME,
};
