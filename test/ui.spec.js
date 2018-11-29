import {
  assert
} from 'chai';
import * as UI from '../src/ui'

const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;


describe('createSlider', function () {

  describe('behaviour when invalid id passed', function () {

    it('should do nothing when invalid element id passed', function () {

      UI.createSlider()
    });

    it('should do nothing when no matching element found for id', function () {

      const document = new JSDOM().window.document
      const div = document.createElement(`div`)

      document.body.appendChild(div)
      global.document = document

      div.innerHTML = `
    <label>Bar</label>
    <span></span>
    <input type="range" min="1" max="500" step="1" id="bar" />
    `

      UI.createSlider('foo')
    });

  });

  describe('behaviour when id matches element in document', function () {

    it('should initialize range input with value', function () {

      const document = new JSDOM().window.document
      const div = document.createElement(`div`)

      document.body.appendChild(div)
      global.document = document

      div.innerHTML = `
      <label>Bar</label>
      <span></span>
      <input type="range" min="1" max="500" step="1" id="bar" />
      `

      assert.isUndefined(UI.createSlider('bar', 4))

      assert.equal(document.getElementById('bar').value, 4)
    });

    it('should add change event handler', function () {

      const document = new JSDOM().window.document
      const div = document.createElement(`div`)

      document.body.appendChild(div)
      global.document = document

      div.innerHTML = `
      <label>Bar</label>
      <span></span>
      <input type="range" min="1" max="500" step="1" id="bar" />
      `

      assert.isUndefined(UI.createSlider('bar', 4, event => {

      }))

      const event = new Event('change');
      document.getElementById('bar').dispatchEvent(event)

      assert.equal(document.getElementById('bar').value, 4)
    });
  });
});