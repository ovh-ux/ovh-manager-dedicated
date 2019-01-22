angular
  .module('App')
  .constant(
    'DEDICATED_CLOUD_CONSTANTS',
    {
      securityOptions: ['pcidss', 'hds', 'hipaa'],
    },
  )
  .constant(
    'VM_ENCRYPTION_KMS',
    {
      regex: {
        ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        sslThumbprint: /^(((([0-9]|[a-fA-F]){2}:){19})|((([0-9]|[a-fA-F]){2}:){31}))([0-9]|[a-fA-F]){2}$/,
      },
      creationTaskWaitingConfiguration: 'Waiting for customer to configure the KMS Server...',
      waitingStatus: ['doing', 'todo'],
      endStatus: ['canceled', 'done'],
      pollingDelay: 2000,
    },
  )
  .constant(
    'VEEAM_STATE_ENUM',
    {
      ENABLED: 'enabled',
      DISABLED: 'disabled',
      DISABLING: 'DISABLING',
      ENABLING: 'ENABLING',
      ERROR: 'ERROR',
      REMOVING: 'REMOVING',
    },
  )
  .constant(
    'COMMERCIAL_RANGE_ENUM',
    {
      '2014v1Infrastructure': '2014 Infrastructure',
      '2014v1Enterprise': '2014 Enterprise',
      '2013v1': '2013',
    },
  );
