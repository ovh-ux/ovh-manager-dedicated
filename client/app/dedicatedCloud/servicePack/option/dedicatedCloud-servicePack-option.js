export default class ServicePackOption {
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
