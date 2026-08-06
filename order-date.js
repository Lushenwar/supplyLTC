// The monthly order deadline. Its own module so test-order-date.js can import
// it — supply.js is JSX and can't be run under plain node.

// First Wednesday of the given month. `month` is 0-based and may be 12, which
// rolls into January of the following year on its own.
export function firstWednesday(year, month) {
  const d = new Date(year, month, 1);
  d.setDate(1 + ((3 - d.getDay() + 7) % 7)); // 3 = Wednesday
  return d;
}

// The next deadline that hasn't passed: this month's first Wednesday while it's
// still ahead (today counts as ahead), otherwise next month's. Computed rather
// than read off the uploaded spreadsheet so it keeps moving on its own.
export function nextOrderByDate(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = firstWednesday(today.getFullYear(), today.getMonth());
  return thisMonth >= today ? thisMonth : firstWednesday(today.getFullYear(), today.getMonth() + 1);
}
