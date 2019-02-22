export default class DedicatedCloudServicePackOption {
  constructor({
    name,
    displayName,
    mensualCost,
    type,
    descriptionURL,
  }) {
    this.name = name;
    this.displayName = displayName;
    this.mensualCost = mensualCost;
    this.type = type;
    this.descriptionURL = descriptionURL;
  }
}
