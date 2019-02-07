export default class ServicePackOption {
  constructor({
    name,
    displayName,
    mensualCost,
    type,
    descriptionUrl,
  }) {
    this.name = name;
    this.displayName = displayName;
    this.mensualCost = mensualCost;
    this.type = type;
    this.descriptionUrl = descriptionUrl;
  }
}
