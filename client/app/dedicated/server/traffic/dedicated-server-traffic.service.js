class ServerTrafficService {
  constructor($q, $filter, Server) {
    this.$q = $q;
    this.$filter = $filter;
    this.Server = Server;
  }

  getTraffic(productId) {
    const noTraffic = {
      hasQuota: false,
      traffic: {
        inputQuotaSize: {},
        outputQuotaSize: {},
        remainingQuotaSize: {},
        inputQuotaUsed: {},
        outputQuotaUsed: {},
        resetQuotaDate: '',
        isThrottled: false,
      },
    };

    return this.Server.getBandwidth(productId)
      .then((bandwidth) => {
        const { traffic } = bandwidth;

        const hasQuota = _.get(traffic, 'outputQuotaSize') !== null || _.get(traffic, 'inputQuotaSize') !== null;

        traffic.remainingInputQuotaSize = this.computeRemainingUsage(
          traffic.inputQuotaSize,
          traffic.inputQuotaUsed,
        );
        traffic.remainingOutputQuotaSize = this.computeRemainingUsage(
          traffic.outputQuotaSize,
          traffic.outputQuotaUsed,
        );

        _.set(traffic, 'inputQuotaSize.text', this.getQuotaText(traffic.inputQuotaSize), traffic.remainingInputQuotaSize.unit);
        _.set(traffic, 'inputQuotaUsed.text', this.getQuotaText(traffic.inputQuotaUsed));
        _.set(traffic, 'outputQuotaSize.text', this.getQuotaText(traffic.outputQuotaSize), traffic.remainingOutputQuotaSize.unit);
        _.set(traffic, 'outputQuotaUsed.text', this.getQuotaText(traffic.outputQuotaUsed));

        traffic.resetQuotaTimeLeft = null;
        if (traffic.resetQuotaDate) {
          traffic.resetQuotaTimeLeft = this.constructor.getTimeleft(traffic.resetQuotaDate);
        }

        return this.acceptResponse({
          hasQuota,
          usage: traffic,
        });
      })
      .catch(() => this.acceptResponse(noTraffic));
  }

  computeRemainingUsage(quota, quotaUsed) {
    if (!quota) {
      return {
        unit: 'B',
        value: Infinity,
      };
    } if (!quotaUsed) {
      return _.cloneDeep(quota);
    }

    const quotaSize = this.$filter('bytes')(quota.value, {
      precision: 20,
      fromUnit: quota.unit,
      toUnit: quota.unit,
      toFormat: 'object',
      toKibi: true,
    });

    const upsizedQuotaUsed = this.$filter('bytes')(quotaUsed.value, {
      precision: 20,
      fromUnit: quotaUsed.unit,
      toUnit: quotaSize.nonTranslatedUnit,
      toFormat: 'object',
      toKibi: true,
    });

    // If quota used > quotaSize we have to make sure remaining size is at zero.
    const remainingSize = quotaSize.value <= upsizedQuotaUsed.value
      ? 0
      : quotaSize.value - upsizedQuotaUsed.value;
    const remainingSizeUnit = quotaSize.nonTranslatedUnit;

    // If quota used > quotaSize we have to make sure percent is not greater than 100.
    const percent = quotaSize.value <= upsizedQuotaUsed.value
      ? 100
      : upsizedQuotaUsed.value / quotaSize.value * 100;

    const overQuota = quotaSize.value <= upsizedQuotaUsed.value;
    const nearQuota = overQuota && percent > 80;

    return {
      unit: remainingSizeUnit,
      value: remainingSize,
      percent,
      overQuota,
      nearQuota,
      text: this.getQuotaText({ unit: remainingSizeUnit, value: remainingSize }),
    };
  }

  getQuotaText(quota, forceUnit) {
    if (!quota) {
      return '';
    }

    return this.$filter('bytes')(quota.value, {
      precision: 2,
      fromUnit: forceUnit || quota.unit,
      toUnit: quota.unit,
      toFormat: 'object',
      toKibi: true,
    }).text;
  }

  static getTimeleft(endDate) {
    const timeleft = moment.duration(moment.utc(endDate).diff(moment.utc()));
    const day = moment.duration(1, 'days');

    if (timeleft < day) {
      return {
        value: Math.round(timeleft.asHours()),
        unit: 'hours',
      };
    }
    return {
      value: Math.round(timeleft.asDays()),
      unit: 'days',
    };
  }

  acceptResponse(data, message) {
    return this.$q.resolve({
      status: 'OK',
      data,
      message,
    });
  }

  rejectResponse(data, message) {
    return this.$q.reject({
      status: 'ERROR',
      data,
      message,
    });
  }
}

angular.module('App').service('ServerTrafficService', ServerTrafficService);
