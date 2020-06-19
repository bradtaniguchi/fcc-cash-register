/**
 * Map of the "cash-type" to their pennies
 * amount
 */
const penniesMap = {
  PENNY: 1,
  NICKEL: 5,
  DIME: 10,
  QUARTER: 25,
  ONE: 100,
  FIVE: 500,
  TEN: 1000,
  TWENTY: 20000,
  'ONE HUNDRED': 100000,
};
/**
 * Returns
 * @param {number} price the cost of the item
 * @param {*} cash the amount given
 * @param {*} cid the cash in drawer
 * @returns {string} .status the status of the drawer, could be
 *   - INSUFFICIENT_FUNDS
 *   - CLOSED
 *   - OPEN
 * @returns {array} .change the list of change in bills/coins
 */
module.exports = function checkCashRegister(price, cash, cid) {
  const penniesInDrawer = getPenniesInDrawer(cid);
  if (!hasFunds(price, penniesInDrawer)) {
    return {
      STATUS: 'INSUFFICIENT_FUNDS',
      change: [],
    };
  }
  const changeInPennies = getPennies(cash) - getPennies(price);
  // TODO:
  return changeInPennies;
};
/**
 * Returns the pennies for the given price
 */
const getPennies = (price) => Math.round(price * 100);
/**
 * Returns the pennies in the drawer from the cash in the drawer
 */
const getPenniesInDrawer = (cid) =>
  cid.reduce((acc, [kind, amount]) => [...acc, [kind, getPennies(amount)]], []);

/**
 * Returns if the pennies in the drawer meets the price
 */
const hasFunds = (price, penniesInDrawer) =>
  penniesInDrawer.reduce((acc, [_, pennies]) => (acc += pennies), 0) >=
  getPennies(price);
