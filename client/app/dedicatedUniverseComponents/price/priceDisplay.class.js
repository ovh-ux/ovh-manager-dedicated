/**
 *  Class representing more than one price for only one offer
 *  For example, the prices to order a domain name for a month:
 *  All the prices are used to order a domain name, but expressed
 *  in more than one way (i.e. with or without taxes)
 */
export default class {
  /**
   * Add a price to display
   * @param {PriceDisplayTypes}  - Should be a value of PRICE_DISPLAY_TYPES
   * @param {Price}   - The price itself
   */
  addPrice(displayingType, price) {
    this[displayingType] = price;
  }
}
