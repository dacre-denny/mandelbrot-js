import {
  assert
} from 'chai';
import * as UI from '../src/ui'

const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;


const createRangeInput = (id) => {

  const div = document.createElement(`div`)

  div.innerHTML = `
  <label>Bar</label>
  <span></span>
  <input type="range" min="1" max="500" step="1" id="${ id }" />
  `
  return div
}

describe('createSlider', function () {

  beforeEach(function () {

    global.window = new JSDOM().window
    global.document = window.document
  })

  afterEach(function () {

    global.window = undefined
    global.document = undefined
  })

  describe('behaviour when invalid id passed', function () {

    it('should do nothing when invalid element id passed', function () {

      UI.createSlider()
    });

    it('should do nothing when no matching element found for id', function () {

      document.body.appendChild(createRangeInput('bar'))

      UI.createSlider('foo')
    });

  });

  describe('behaviour when id matches element in document', function () {

    it('should initialize range input with value', function () {

      document.body.appendChild(createRangeInput('bar'))

      assert.isUndefined(UI.createSlider('bar', 4))

      assert.equal(document.getElementById('bar').value, 4)
    });

    it('should add change event handler', function () {

      document.body.appendChild(createRangeInput('bar'))

      assert.isUndefined(UI.createSlider('bar', 4, event => {

        assert.isDefined(event)
        assert.isDefined(event.currentTarget)
        assert.equal(event.currentTarget.value, 5)
      }))

      range.value = 5
      range.dispatchEvent(new window.Event('change'))
    });
  });
});