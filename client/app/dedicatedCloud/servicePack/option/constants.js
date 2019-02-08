export const OPTION_TYPES = {
  basicOption: {
    id: 'basicOption',
    servicePackCanHaveMoreThanOne: true,
  },
  certification: {
    id: 'certification',
    servicePackCanHaveMoreThanOne: false,
  },
};

export const DATA_ON_ALL_OPTIONS = [
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
  OPTION_TYPES,
  DATA_ON_ALL_OPTIONS,
};
