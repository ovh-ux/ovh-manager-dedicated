/**
 *  Class representing a Price
 */
export default class Price {
  /**
   * Create a price
   * @param {string} text - Text to display
   * @param {number} value - Raw value that can be used in calculus
   */
  constructor(text, value) {
    this.text = text;
    this.value = value;
  }
}
