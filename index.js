/* eslint-disable no-unused-vars */
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
 * Returns the pennies for the given price
 */
const getPennies = (price) => Math.round(price * 100);
/**
 * Converts cash to pennies in the drawer
 */
const getPenniesInDrawer = (cid) =>
  cid.reduce((acc, [kind, amount]) => [...acc, [kind, getPennies(amount)]], []);

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
 * Returns the next bill, if there is one
 */
const getNextBill = (bill) => {
  if (bill === 'PENNY') {
    return null;
  }
  return billsAndCoins[billsAndCoins.indexOf(bill) + 1];
};

const toBills = (penniesInDrawer) =>
  penniesInDrawer.reduce(
    (acc, [kind, pennies]) => [...acc, [kind, pennies / 100]],
    []
  );

const addDefaultsOnEmpty = (map) => {
  coinsAndBills.forEach((coinOrBill) => {
    if (map.has(coinOrBill)) {
      return;
    }
    map.set(coinOrBill, 0);
  });
  return map;
};
const isEmpty = (penniesInDrawer) =>
  penniesInDrawer.reduce((acc, [key, pennies]) => (acc += pennies), 0) === 0;
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
  const changeInBillsAndCoinsMap = new Map();
  let changeInPennies = getPennies(cash) - getPennies(price);
  let bill = 'ONE HUNDRED';
  // change is cash - price;
  let escape = 0;
  // prevent an infinite loop
  while (escape < 5000) {
    escape++;
    if (changeInPennies === 0) {
      if (isEmpty(penniesInDrawer)) {
        return {
          status: 'CLOSED',
          change: toBills(
            Array.from(addDefaultsOnEmpty(changeInBillsAndCoinsMap).entries())
          ),
        };
      }
      return {
        status: 'OPEN',
        change: toBills(Array.from(changeInBillsAndCoinsMap.entries())),
      };
    }
    if (
      changeInPennies >= penniesMap[bill] &&
      hasAmount(bill, penniesInDrawer)
    ) {
      // if we can remove this bill, remove it from the drawer
      removeBill(bill, penniesInDrawer);
      // and how much we owe
      changeInPennies = changeInPennies - penniesMap[bill];

      if (changeInBillsAndCoinsMap.has(bill)) {
        changeInBillsAndCoinsMap.set(
          bill,
          changeInBillsAndCoinsMap.get(bill) + penniesMap[bill]
        );
        continue;
      }
      changeInBillsAndCoinsMap.set(bill, penniesMap[bill]);
      continue;
    }
    bill = getNextBill(bill);
    if (!bill && changeInPennies > 0) {
      return {
        status: 'INSUFFICIENT_FUNDS',
        change: [],
      };
    }
  }
  return {};
};
