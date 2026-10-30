import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOrderTotals,
  calculateCashChange,
  checkLowStock,
  calculateFinancialSummary
} from './posCalculations.ts';

test('calculateOrderTotals applies subtotal, discount, 2% service fee, and 10% tax correctly', () => {
  const result = calculateOrderTotals({
    subtotal: 100000,
    discountPercentage: 10, // 10,000 discount -> 90,000
    couponDiscountAmount: 0,
    serviceFeeRate: 0.02, // 1,800
    taxRate: 0.10, // (90,000 + 1,800) * 10% = 9,180
  });

  assert.equal(result.subtotal, 100000);
  assert.equal(result.discountAmount, 10000);
  assert.equal(result.afterDiscount, 90000);
  assert.equal(result.serviceFeeAmount, 1800);
  assert.equal(result.taxAmount, 9180);
  assert.equal(result.total, 90000 + 1800 + 9180);
});

test('calculateCashChange computes correct change and sufficiency', () => {
  const ok = calculateCashChange(75000, 100000);
  assert.equal(ok.change, 25000);
  assert.equal(ok.isSufficient, true);

  const short = calculateCashChange(75000, 50000);
  assert.equal(short.change, 0);
  assert.equal(short.isSufficient, false);
});

test('checkLowStock flags warning and critical accurately', () => {
  const normal = checkLowStock(20, 10);
  assert.equal(normal.isLow, false);
  assert.equal(normal.isCritical, false);

  const low = checkLowStock(8, 10);
  assert.equal(low.isLow, true);
  assert.equal(low.isCritical, false);

  const critical = checkLowStock(4, 10);
  assert.equal(critical.isLow, true);
  assert.equal(critical.isCritical, true);

  const empty = checkLowStock(0, 10);
  assert.equal(empty.isCritical, true);
});

test('calculateFinancialSummary computes COGS, gross profit, and margin correctly', () => {
  const orders = [
    {
      total: 150000,
      subtotal: 130000,
      items: [
        { costPrice: 20000, quantity: 2 },
        { costPrice: 15000, quantity: 1 }
      ]
    }
  ];
  const summary = calculateFinancialSummary(orders);
  assert.equal(summary.grossRevenue, 150000);
  assert.equal(summary.totalCOGS, 55000); // 20k*2 + 15k*1
  assert.equal(summary.grossProfit, 95000);
});
