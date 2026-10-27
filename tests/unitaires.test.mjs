// Tests des fonctions pures (Node 24) : node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";

test("le lanceur Node tourne", () => {
  assert.equal(1 + 1, 2);
});
