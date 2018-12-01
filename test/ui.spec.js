/* eslint-disable no-undef */
import { assert } from "chai";
import * as UI from "../src/ui";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("ui module", function() {
  beforeEach(function() {
    global.window = new JSDOM().window;
    global.document = window.document;
  });

  afterEach(function() {
    global.window = undefined;
    global.document = undefined;
  });

  describe("createSlider", function() {
    const createRangeInput = id => {
      const div = document.createElement("div");

      div.innerHTML = `
  <label>Bar</label>
  <span></span>
  <input type="range" min="1" max="500" step="1" id="${id}" />
  `;

      return div;
    };

    describe("behaviour when invalid id passed", function() {
      it("should do nothing when invalid element id passed", function() {
        UI.createSlider();
      });

      it("should do nothing when no matching element found for id", function() {
        document.body.appendChild(createRangeInput("bar"));

        UI.createSlider("foo");
      });
    });

    describe("behaviour when id matches element in document", function() {
      it("should initialize range input with value", function() {
        const range = createRangeInput("bar");
        document.body.appendChild(range);

        UI.createSlider("bar", 4);

        assert.equal(range.querySelector("input").value, 4);
        assert.equal(range.querySelector("span").innerText, "4");
      });

      it("should initialize range input with value if no span present", function() {
        const range = createRangeInput("bar");
        range.querySelector("span").remove();
        document.body.appendChild(range);

        UI.createSlider("bar", 4);

        assert.equal(range.querySelector("input").value, 4);
      });

      it("should add change event handler", function() {
        const range = createRangeInput("bar");
        document.body.appendChild(range);

        UI.createSlider("bar", 4, event => {
          assert.equal(event.currentTarget.value, 5);
        });

        range.querySelector("input").value = 5;
        range.querySelector("input").dispatchEvent(new window.Event("change"));

        assert.equal(range.querySelector("span").innerText, "5");
      });

      it("should add change value display if no event handler provided", function() {
        const range = createRangeInput("bar");
        document.body.appendChild(range);

        UI.createSlider("bar", 4);

        range.querySelector("input").value = 5;
        range.querySelector("input").dispatchEvent(new window.Event("change"));

        assert.equal(range.querySelector("span").innerText, "5");
      });
    });
  });

  describe("createToggle", function() {
    const createToggle = (id, value) => {
      const input = document.createElement("input");
      input.setAttribute("type", "button");
      input.setAttribute("id", id);
      input.setAttribute("value", value);

      return input;
    };

    describe("behaviour when invalid id passed", function() {
      it("should do nothing when invalid element id passed", function() {
        UI.createToggle();
      });

      it("should do nothing when no matching element found for id", function() {
        document.body.appendChild(createToggle("bar", "barvalue"));

        UI.createToggle("foo");
      });
    });
  });
});
