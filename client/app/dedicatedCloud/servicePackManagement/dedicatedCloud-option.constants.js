export const OPTION_TYPES = {
  option: {
    id: 'option',
    servicePackCanHaveMoreThanOne: true,
  },
  certification: {
    id: 'certification',
    servicePackCanHaveMoreThanOne: false,
  },
};

export const ALL_EXISTING_OPTIONS = {
  nsx: {
    name: 'nsx',
    type: OPTION_TYPES.option,
  },
  vrops: {
    name: 'vrops',
    type: OPTION_TYPES.option,
  },
  pcidss: {
    name: 'pcidss',
    type: OPTION_TYPES.certification,
  },
  hipaa: {
    name: 'hipaa',
    type: OPTION_TYPES.certification,
  },
  hds: {
    name: 'hds',
    type: OPTION_TYPES.certification,
  },
  hcx: {
    name: 'hcx',
    type: OPTION_TYPES.certification,
  },
};

export default {
  OPTION_TYPES,
  ALL_EXISTING_OPTIONS,
};
