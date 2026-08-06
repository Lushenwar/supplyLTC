// node api/test-orders.js
//
// Pins the two things in api/orders.js that break silently rather than loudly:
// the blob path layout must survive the round trip through unitSegment (or the
// admin panel shows an empty Orders table while the data is fine), and the
// newest-wins sort must actually put newest first (or a unit's order appears to
// roll back to an older version).
import assert from "node:assert/strict";
import { slug, unitDir, unitSegment, byNewest, mergeContributors } from "./orders.js";

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

console.log("ok");
