import assert from "node:assert/strict";
import { validateContact, MAX_MESSAGE } from "../lib/contact";

const ok = { name: "Ada", email: "ada@example.com", message: "Hi" };
assert.deepEqual(validateContact(ok), ok);
assert.equal(typeof validateContact({ ...ok, name: "  " }), "string");
assert.equal(typeof validateContact({ ...ok, email: "nope" }), "string");
assert.equal(typeof validateContact({ ...ok, email: "a b@c.d" }), "string");
assert.equal(typeof validateContact({ ...ok, message: "" }), "string");
assert.equal(typeof validateContact({ ...ok, message: "x".repeat(MAX_MESSAGE + 1) }), "string");
assert.equal(typeof validateContact({ ...ok, name: "x".repeat(101) }), "string");
const injected = validateContact({ ...ok, name: "Ada\r\nBcc: evil@x.com" });
assert.ok(typeof injected !== "string" && !/[\r\n]/.test(injected.name));
console.log("contact validation: all checks passed");
