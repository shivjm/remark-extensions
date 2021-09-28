import "mocha";
import { assert } from "chai";

import { transform } from "../src";

describe("Transformation", () => {
    it("works", () => {
        assert.equal(transform(""), "")
    });
});
