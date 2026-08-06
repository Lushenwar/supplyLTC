// node test-order-date.js
//
// The order deadline is shown to every nurse on every kiosk, so a silent
// off-by-one here means a whole floor misses the cutoff. Pins the weekday, the
// month rollover, and the year boundary.
import assert from "node:assert/strict";
import { firstWednesday, nextOrderByDate } from "./order-date.js";

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Always a Wednesday, always in the first seven days, for four solid years.
for (let y = 2026; y <= 2029; y++) {
  for (let m = 0; m < 12; m++) {
    const d = firstWednesday(y, m);
    assert.equal(d.getDay(), 3, `${iso(d)} is not a Wednesday`);
    assert.equal(d.getMonth(), m, `${iso(d)} landed in the wrong month`);
    assert.ok(d.getDate() <= 7, `${iso(d)} is not the first Wednesday`);
  }
}

// Known values, including the Jun 3 2026 deadline the old parser read out of
// the spreadsheet — the computed date has to agree with it.
assert.equal(iso(firstWednesday(2026, 5)), "2026-06-03");
assert.equal(iso(firstWednesday(2026, 7)), "2026-08-05");
assert.equal(iso(firstWednesday(2026, 8)), "2026-09-02");
assert.equal(iso(firstWednesday(2027, 0)), "2027-01-06");
assert.equal(iso(firstWednesday(2026, 12)), "2027-01-06"); // month 12 rolls the year

// Rolls forward once this month's deadline is behind us...
assert.equal(iso(nextOrderByDate(new Date(2026, 7, 6))), "2026-09-02"); // Aug 6, day after Aug 5
assert.equal(iso(nextOrderByDate(new Date(2026, 7, 31))), "2026-09-02");

// ...but never skips a deadline that is still ahead, or today's.
assert.equal(iso(nextOrderByDate(new Date(2026, 8, 1))), "2026-09-02"); // day before
assert.equal(iso(nextOrderByDate(new Date(2026, 8, 2))), "2026-09-02"); // the day itself
assert.equal(iso(nextOrderByDate(new Date(2026, 8, 3))), "2026-10-07"); // day after

// Late December rolls into the new year.
assert.equal(iso(nextOrderByDate(new Date(2026, 11, 20))), "2027-01-06");

// A time of day late enough to cross a UTC date boundary must not shift it.
assert.equal(iso(nextOrderByDate(new Date(2026, 8, 2, 23, 59))), "2026-09-02");

console.log("ok");
