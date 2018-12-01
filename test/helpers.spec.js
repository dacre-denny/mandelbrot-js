/* eslint-disable no-undef */
const { assert } = require("chai");
const Helpers = require("../src/helpers");

describe("helpers module", function() {
  describe("lerp", function() {
    describe("behaviour when invalid parameters are passed", function() {
      it("should return NaN when no parameters passed", function() {
        assert.isNaN(Helpers.lerp());
      });
      it("should return NaN when no frac parameter passed", function() {
        assert.isNaN(Helpers.lerp(1, 2));
      });
      it("should return NaN when invalid value parameters passed", function() {
        assert.isNaN(Helpers.lerp(undefined, undefined, 0.5));
      });
      it("should return NaN when non-number parameters passed", function() {
        assert.isNaN(Helpers.lerp("a", "b", "c"));
      });
    });
    describe("behaviour when valid numbers are passed", function() {
      it("should calculate linear iterpolation between two numbers", function() {
        assert.equal(Helpers.lerp(1, 2, 0.5), 1.5);
      });

      it("should calculate linear iterpolation between two numbers in reversed order", function() {
        assert.equal(Helpers.lerp(2, 1, 0.5), 1.5);
      });

      it("should calculate linear iterpolation outside of fractional range", function() {
        assert.equal(Helpers.lerp(2, 4, 1.5), 5);
      });

      it("should calculate negative linear iterpolation outside of fractional range", function() {
        assert.equal(Helpers.lerp(2, 4, -1), 0);
      });
    });
  });
});
