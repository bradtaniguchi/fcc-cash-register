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
  TWENTY: 2000,
  'ONE HUNDRED': 10000,
};
/**
 * List of bills and coins from smallest to largest
 */
const coinsAndBills = [
  'PENNY',
  'NICKEL',
  'DIME',
  'QUARTER',
  'ONE',
  'FIVE',
  'TEN',
  'TWENTY',
  'ONE HUNDRED',
];
/**
 * List of coins and bills from largest to smallest
 */
const billsAndCoins = [...coinsAndBills].reverse();
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
      status: 'INSUFFICIENT_FUNDS',
      change: [],
    };
  }
  const changeInPennies = getPennies(cash) - getPennies(price);
  console.log('change in pennies', changeInPennies);
  return {
    change: getChange(changeInPennies, penniesInDrawer),
    status: 'OPEN',
  };
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
/**
 * Returns if the bill given has enough available in the drawer
 */
const hasAmount = (bill, penniesInDrawer) =>
  penniesInDrawer[coinsAndBills.indexOf(bill)][1] >= penniesMap[bill];
/**
 * Removes the given bill from the pennies in the drawer via reference.
 */
const removeBill = (bill, penniesInDrawer) => {
  const amountInPennies = penniesMap[bill];
  penniesInDrawer[coinsAndBills.indexOf(bill)][1] -= amountInPennies;
  return;
};

/**
 * Returns the change in bills from the change in pennies from the drawer
 */
const getChange = (changeInPennies, penniesInDrawer) => {
  const changeInBillsAndCoinsMap = new Map();
  let escape = 0;
  while (changeInPennies >= 0 && escape < 5000) {
    escape++;
    // TODO: remove escape, prevents infinite loops
    for (let billOrCoin of billsAndCoins) {
      if (
        changeInPennies >= penniesMap[billOrCoin] &&
        hasAmount(billOrCoin, penniesInDrawer)
      ) {
        removeBill(billOrCoin, penniesInDrawer);
        changeInPennies = changeInPennies - penniesMap[billOrCoin];
        if (changeInBillsAndCoinsMap.has(billOrCoin)) {
          changeInBillsAndCoinsMap.set(
            billOrCoin,
            changeInBillsAndCoinsMap.get(billOrCoin) +
              penniesMap[billOrCoin] / 100
          );
          continue;
        }
        changeInBillsAndCoinsMap.set(billOrCoin, penniesMap[billOrCoin] / 100);
        // break the inner loop, to continue the while
        break;
      }
    }
  }
  return Array.from(changeInBillsAndCoinsMap.entries());
};
