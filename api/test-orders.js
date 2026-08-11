// node api/test-orders.js
//
// Pins the two things in api/orders.js that break silently rather than loudly:
// the blob path layout must survive the round trip through unitSegment (or the
// admin panel shows an empty Orders table while the data is fine), and the
// newest-wins sort must actually put newest first (or a unit's order appears to
// roll back to an older version).
import assert from "node:assert/strict";
import { slug, unitDir, unitSegment, byNewest, mergeContributors, appendHistory } from "./orders.js";

// Path round trip: whatever unitDir writes, unitSegment has to read back.
for (const [cycle, unit] of [
  ["2026-06-18T14:32:00.000Z", "7E"],
  [null, "7E"],                       // no baseline uploaded yet
  ["2026-06-18T14:32:00.000Z", "2W"],
]) {
  const path = unitDir(cycle, unit) + "1750000000000.json";
  assert.equal(unitSegment(path), slug(unit), `unit segment lost for ${unit} in ${path}`);
  assert.equal(path.split("/")[1], slug(cycle), `cycle segment lost in ${path}`);
}

// Different cycles must never collide — that's what makes a new monthly
// baseline start every unit at an empty order.
assert.notEqual(unitDir("2026-06-01T00:00:00.000Z", "7E"), unitDir("2026-07-01T00:00:00.000Z", "7E"));
assert.notEqual(unitDir("c", "7E"), unitDir("c", "7W"));

// Newest first, so blobs[0] after sorting is the live order.
const sorted = [
  { uploadedAt: "2026-06-02T00:00:00.000Z", n: "mid" },
  { uploadedAt: "2026-06-03T00:00:00.000Z", n: "new" },
  { uploadedAt: "2026-06-01T00:00:00.000Z", n: "old" },
].sort(byNewest);
assert.deepEqual(sorted.map((b) => b.n), ["new", "mid", "old"]);

// Every shift that touches the order gets recorded once, and a blank name
// (nurse hasn't typed it yet) never lands in the list.
assert.deepEqual(mergeContributors([], "Sarah"), ["Sarah"]);
assert.deepEqual(mergeContributors(["Sarah"], "Mike"), ["Sarah", "Mike"]);
assert.deepEqual(mergeContributors(["Sarah"], "Sarah"), ["Sarah"]);
assert.deepEqual(mergeContributors(["Sarah"], "  "), ["Sarah"]);
assert.deepEqual(mergeContributors(undefined, ""), []);

// ---- Order history ----
// This is what the next shift reads to see what the previous one did, so a
// dropped or mis-merged entry means they re-order something already ordered.
const T0 = Date.parse("2026-08-11T08:00:00.000Z");
const min = (n) => T0 + n * 60000;

// A first save records every line as 0 -> qty.
let h = appendHistory(undefined, {}, { 3: 2, 7: 1 }, "Sarah", T0);
assert.deepEqual(h, [{ by: "Sarah", at: new Date(T0).toISOString(), changes: { 3: [0, 2], 7: [0, 1] } }]);

// The same person still working folds into one entry, keeping the original
// "from" — 2 -> 3 -> 5 has to read as 0 -> 5, not as three rows.
h = appendHistory(h, { 3: 2, 7: 1 }, { 3: 5, 7: 1 }, "Sarah", min(2));
assert.equal(h.length, 1);
assert.deepEqual(h[0].changes, { 3: [0, 5], 7: [0, 1] });
assert.equal(h[0].at, new Date(min(2)).toISOString());

// A different person always starts a new entry, however close together.
h = appendHistory(h, { 3: 5, 7: 1 }, { 3: 5, 7: 1, 9: 4 }, "Mike", min(3));
assert.equal(h.length, 2);
assert.deepEqual(h[1], { by: "Mike", at: new Date(min(3)).toISOString(), changes: { 9: [0, 4] } });

// So does the same person coming back after the coalesce window (10 min).
h = appendHistory(h, { 3: 5, 7: 1, 9: 4 }, { 3: 6, 7: 1, 9: 4 }, "Mike", min(20));
assert.equal(h.length, 3);
assert.deepEqual(h[2].changes, { 3: [5, 6] });

// Removing a line is recorded as a drop to zero, not silently omitted.
h = appendHistory(h, { 3: 6, 7: 1 }, { 3: 6 }, "Mike", min(21));
assert.deepEqual(h[h.length - 1].changes[7], [1, 0]);

// An autosave that changed no quantities is not history (name edits, re-saves).
const before = appendHistory([], { 3: 1 }, { 3: 1 }, "Sarah", T0);
assert.deepEqual(before, []);
const kept = appendHistory(h, { 3: 6 }, { 3: 6 }, "Mike", min(22));
assert.deepEqual(kept, h);

// Putting a value back where it started inside one entry removes it entirely,
// so "added it then changed my mind" doesn't read as a change to the next shift.
let u = appendHistory([], {}, { 5: 3 }, "Ann", T0);
u = appendHistory(u, { 5: 3 }, {}, "Ann", min(1));
assert.deepEqual(u, []);

// A blank name still records the change — anonymous is better than lost.
assert.equal(appendHistory([], {}, { 1: 1 }, "  ", T0)[0].by, "");

// The cap keeps the doc bounded, newest kept.
let many = [];
for (let i = 0; i < 130; i++) many = appendHistory(many, {}, { [i]: 1 }, "P" + i, min(i * 30));
assert.equal(many.length, 100);
assert.equal(many[many.length - 1].by, "P129");

console.log("ok");
